"""
Ingstor and Egestor for coco format. Coco is stored in json format.
{
"info": info, "images": [image], "annotations": [annotation], "licenses": [license],
}

info{
"year": int, "version": str, "description": str, "contributor": str, "url": str, "date_created": datetime,
}

image{
"id": int, "width": int, "height": int, "file_name": str, "license": int, "flickr_url": str, "coco_url": str, "date_captured": datetime,
}

license{
"id": int, "name": str, "url": str,
}

"""
import collections
import json
import os

from PIL import Image
from pycocotools import mask

from .abstract import Ingestor, Egestor
from .labels_and_aliases import output_labels
from .validation_schemas import get_blank_detection_schema, get_blank_image_detection_schema


class COCOIngestor(Ingestor):
    default_label_file = 'labels.json'
    categories = None

    def __init__(self):
        pass

    def validate(self, path, folder_names):
        expected_dirs = [
            'images'
        ]
        for subdir in expected_dirs:
            if not os.path.isdir(f"{path}/{subdir}"):
                return False, f"Expected subdirectory {subdir} within {path}"
        if not os.path.isfile(f"{path}/{self.default_label_file}"):
            return False, f"Expected {self.default_label_file} file within {path}"
        return True, None

    def ingest(self, path, folder_names):
        return self._get_image_detection(path, folder_names=folder_names)

    def _get_image_ids(self, root):
        path = f"{root}/{self.default_label_file}"
        with open(path) as f:
            data = json.load(f)
            image_ids = [element['file_name'] for element in data['images']]
            coco_image_ids = [element['id'] for element in data['images']]
            return image_ids, coco_image_ids

    def _get_image_detection(self, root, folder_names):
        image_detections = []
        path = os.path.join(root, self.default_label_file)
        with open(path) as f:
            data = json.load(f)

        self.categories = {category['id']: category['name'] for category in data['categories']}
        annotations_base = self._create_annotations_base(data['annotations'])
        for i, image_dict in enumerate(data['images']):
            if i % 1000 == 0:
                print(f"Ingested {i} images")

            single_img_detection = get_blank_image_detection_schema()

            single_img_detection["image"]["id"] = image_dict['id']
            single_img_detection["image"]["dataset_id"] = None
            single_img_detection["image"]["path"] = image_dict['path']
            single_img_detection["image"]["segmented_path"] = None
            single_img_detection["image"]["width"] = image_dict['width']
            single_img_detection["image"]["height"] = image_dict['height']
            single_img_detection["image"]["file_name"] = image_dict['file_name']

            single_img_detection["detections"] = self._get_detections(
                annotations_base[single_img_detection["image"]["id"]])
            image_detections.append(single_img_detection)

        return image_detections

    def _get_detections(self, annotations_for_curr_img):
        detections = []
        for annotation in annotations_for_curr_img:
            try:
                curr_detection = get_blank_detection_schema()

                curr_detection["id"] = annotation['id']
                curr_detection["image_id"] = annotation['image_id']
                curr_detection["label"] = self.categories[annotation['category_id']]
                curr_detection["segmentation"] = annotation['segmentation'] \
                    if (annotation['segmentation'] != [] and annotation['segmentation'] != [[]]) else None
                curr_detection["left"] = annotation['bbox'][0]
                curr_detection["top"] = annotation['bbox'][1]
                curr_detection["right"] = annotation['bbox'][2] + annotation['bbox'][0]
                curr_detection["bottom"] = annotation['bbox'][3] + annotation['bbox'][1]
                curr_detection["iscrowd"] = annotation['iscrowd']
                curr_detection["isbbox"] = annotation['isbbox']
                curr_detection["keypoints"] = annotation['keypoints']

                detections.append(curr_detection)
            except ValueError as ve:
                print(f"Cannot find selected key: {annotation} - {ve}")
        return detections

    def _create_annotations_base(self, annotations):
        annotations_dict = collections.defaultdict(list)
        for annotation in annotations:
            annotations_dict[annotation['image_id']].append(annotation)

        return annotations_dict

    @staticmethod
    def _image_dimensions(path):
        with Image.open(path) as image:
            return image.width, image.height


class COCOEgestor(Egestor):
    default_label_file = 'labels.json'

    def __init__(self):
        pass

    def expected_labels(self):
        return output_labels

    def egest(self, *, image_detections, root, folder_names):

        print("Processing data by COCO Egestor...")

        labels = {"images": [], "categories": self.generate_categories(), "annotations": []}

        detection_counter = 0

        for i, image_detection in enumerate(image_detections):
            if i % 100 == 0:
                print(f"Processed {i} image detections")

            image = image_detection['image']
            new_image = {"id": i,
                         "dataset_id": None,
                         "path": image["path"],
                         "width": image['width'],
                         "height": image['height'],
                         "file_name": image['path'].split('/')[-1]}

            labels["images"].append(new_image)

            for detection in image_detection['detections']:

                category_id = next((category["id"] for category in labels["categories"]
                                    if category["name"] == detection["label"]), None)

                if category_id is None:
                    print(f"No available category found: detection label = {detection['label']}")
                    continue

                new_detection = {"id": detection_counter}
                detection_counter += 1
                new_detection["image_id"] = new_image["id"]
                new_detection["category_id"] = category_id

                new_detection["iscrowd"] = detection["iscrowd"]
                new_detection["isbbox"] = detection["isbbox"]
                # Bbox = [x left upper corner, y left upper corner, width, height]
                new_detection["bbox"] = [detection["left"], detection["top"], detection["right"] - detection["left"],
                                         detection["bottom"] - detection["top"]]

                if new_detection["isbbox"] == True and detection["segmentation"] is None:
                    # segmentation from bbox = [x right upper corner, y right upper corner, x right lower corner,
                    # y right lower corner, x left lower corner, y left lower corner, x left upper corner,
                    # y left upper corner]
                    new_detection["segmentation"] = [
                        [detection["right"], detection["top"], detection["right"], detection["bottom"],
                         detection["left"], detection["bottom"], detection["left"], detection["top"]]
                    ]
                else:
                    new_detection["segmentation"] = detection["segmentation"]
                detection['area'] = None
                if detection["area"] is None:
                    try:
                        # rs = mask.frPyObjects(new_detection['segmentation'], new_image["height"], new_image["width"])
                        # a = mask.area(rs)
                        new_detection['area'] = int(sum(mask.area(mask.frPyObjects(
                            new_detection['segmentation'], new_image['height'], new_image['width']))))

                    except Exception as e:
                        print(f"Unable to automatically calculate area from segmentation: {e}")
                        new_detection['area'] = 0

                new_detection["keypoints"] = detection["keypoints"]

                labels["annotations"].append(new_detection)

        print("Saving json file...")
        print('Finished egesting COCO')

        encoded_labels = json.dumps(labels)
        return encoded_labels

    def generate_categories(self):
        categories = []
        for i, label in enumerate(self.expected_labels().keys()):
            curr_cat = {"id": i, "name": label, "supercategory": ""}
            categories.append(curr_cat)

        return categories
