# TODO: Optimizations: list generating with list comprehension etc.
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
import csv
import os
import shutil
import json
import re
from PIL import Image
from lib.vod_converter.labels_and_aliases import output_labels
from lib.vod_converter.abstract import Ingestor, Egestor
from pycocotools import mask


class COCOIngestor(Ingestor):
    def validate(self, path, folder_names):
        expected_dirs = [
            'images'
        ]
        for subdir in expected_dirs:
            if not os.path.isdir(f"{path}/{subdir}"):
                return False, f"Expected subdirectory {subdir} within {path}"
        if not os.path.isfile(f"{path}/labels.json"):
            return False, f"Expected label.json file within {path}"
        return True, None

    def ingest(self, path, folder_names):
        return self._get_image_detection(path, folder_names=folder_names)

    def _get_image_ids(self, root):
        path = f"{root}/labels.json"
        with open(path) as f:
            data = json.load(f)
            image_ids = [element['file_name'] for element in data['images']]
            coco_image_ids = [element['id'] for element in data['images']]
            return image_ids, coco_image_ids

    def _get_image_detection(self, root, folder_names):
        image_detection_schema = []
        try:
            path = os.path.join(root, 'labels.json')
            with open(path) as f:
                data = json.load(f)
                for image_dict in data['images']:
                    detections = self._get_detections(image_dict['id'], data)
                    detections = [det for det in detections if det['left'] < det['right'] and det['top'] < det['bottom']]
                    image_id = image_dict['file_name'].split('.')[0]
                    image_path = f"{root}/images/{image_dict['file_name']}"
                    try:
                        image_width, image_height = _image_dimensions(image_path)
                    except Exception as e:
                        print(e)
                        continue
                    image_detection_schema.append({
                        'image': {
                            'id': image_id,
                            "dataset_id": 0,
                            'path': image_path,
                            'segmented_path': None,
                            'width': image_width,
                            'height': image_height
                        },
                        'detections': detections
                    })
                return image_detection_schema
        except Exception as e:
            print(e)

    def _get_detections(self, image_id, data):
        detections = []
        for annotation in data['annotations']:
            if annotation['image_id'] == image_id:
                try:
                    x1 = annotation['bbox'][0]
                    y1 = annotation['bbox'][1]
                    x2 = x1 + annotation['bbox'][2]
                    y2 = y1 + annotation['bbox'][3]
                    label = self._get_category(data, annotation['category_id'])
                    detections.append({
                        'label': label,
                        'left': x1,
                        'right': x2,
                        'top': y1,
                        'bottom': y2
                    })
                except ValueError as ve:
                    print(annotation)
        return detections

    def _get_category(self, data, category_id):
        for category in data['categories']:
            if category['id'] == category_id:
                return category['name']


def _image_dimensions(path):
    with Image.open(path) as image:
        return image.width, image.height


class COCOEgestor(Egestor):

    def expected_labels(self):
        return output_labels

    def egest(self, *, image_detections, root, folder_names):

        print("Processing data by COCO Egestor...")
        images_dir = f"{root}/images"
        os.makedirs(images_dir, exist_ok=True)
        with open(f"{root}/labels.json", "w") as file:
            pass

        labels = {"images": [], "categories": self.generate_categories(), "annotations": []}

        detection_counter = 0

        for i, image_detection in enumerate(image_detections):
            if i % 100 == 0:
                print(f"Processed {i} image detections")

            image = image_detection['image']
            new_image = {}
            new_image["id"] = i
            new_image["dataset_id"] = None
            new_image["path"] = image["path"]
            new_image["width"] = image['width']
            new_image["height"] = image['height']
            new_image["file_name"] = image['path'].split('/')[-1]

            labels["images"].append(new_image)

            # try:
            #     shutil.copyfile(image['path'], f"{images_dir}/{image_id}.{src_extension}")
            # except FileNotFoundError as e:
            #     print(e)
            #     continue

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
                new_detection["bbox"] = [detection["left"], detection["top"], detection["right"]-detection["left"],
                                         detection["bottom"]-detection["top"]]

                if new_detection["isbbox"] == True and detection["segmentation"] is None:
                    # segmentation from bbox = [x right upper corner, y right upper corner, x right lower corner,
                    # y right lower corner, x left lower corner, y left lower corner, x left upper corner,
                    # y left upper corner]
                    new_detection["segmentation"] = [
                        [detection["right"], detection["top"], detection["right"], detection["bottom"], detection["left"], detection["bottom"], detection["left"], detection["top"]]
                    ]
                else:
                    new_detection["segmentation"] = [detection["segmentation"]]

                if detection["area"] is None:
                    rs = mask.frPyObjects(new_detection['segmentation'], new_image["height"], new_image["width"])
                    a = mask.area(rs)
                    new_detection['area'] = int(a[0])

                new_detection["keypoints"] = detection["keypoints"]

                labels["annotations"].append(new_detection)

        print("Saving json file...")
        with open(f"{root}/labels.json", "w") as annotation_file:
            json.dump(labels, annotation_file)

    def generate_categories(self):
        categories = []
        for i, label in enumerate(self.expected_labels().keys()):
            curr_cat = {"id": i, "name": label, "supercategory": ""}
            categories.append(curr_cat)

        return categories
