import collections
import csv
import glob
import os

from PIL import Image
from workers.lib.messenger import message

from .abstract import Ingestor
from .validation_schemas import get_blank_detection_schema, get_blank_image_detection_schema


class TownCentreIngestor(Ingestor):
    detection_counter = 0
    default_label_file = "TownCentre-groundtruth.csv"

    def validate(self, path, folder_names):
        expected_dirs = [
            "images"
        ]
        for subdir in expected_dirs:
            if not os.path.isdir(os.path.join(path, subdir)):
                return False, f"Expected subdirectory {subdir} within {path}"
        if not os.path.isfile(os.path.join(path, self.default_label_file)):
            return False, f"Expected {self.default_label_file} file within {path}"
        return True, None

    def ingest(self, path, folder_names):
        self.detection_counter = 0
        return self._get_image_detection(path, folder_names=folder_names)

    def _get_image_detection(self, root, folder_names):
        image_detections = []
        annotations_base = self._create_annotations_base(root)

        for i, image_path in enumerate(glob.glob(os.path.join(root, "images", "*.png"))):
            if i % 100 == 0:
                message(f"Ingested {i} images")
            single_img_detection = get_blank_image_detection_schema()
            img_file_name = image_path.split("/")[-1]
            img_name = image_path.split("/")[-1].split(".")[0]
            single_img_detection["image"]["id"] = int(img_name.split("_")[-1])
            single_img_detection["image"]["dataset_id"] = None
            single_img_detection["image"]["path"] = image_path
            single_img_detection["image"]["segmented_path"] = None
            img_width, img_height = self._image_dimensions(image_path)
            single_img_detection["image"]["width"] = img_width
            single_img_detection["image"]["height"] = img_height
            single_img_detection["image"]["file_name"] = img_file_name
            single_img_detection["detections"] = self._get_detections(annotations_base, img_name, img_width, img_height)

            image_detections.append(single_img_detection)
        return image_detections

    def _create_annotations_base(self, root):
        labels_path = os.path.join(root, self.default_label_file)
        annotations_dict = collections.defaultdict(list)
        with open(labels_path) as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=",")
            labels_len = sum(1 for _ in csv_reader)

        with open(labels_path) as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=",")
            for i, label in enumerate(csv_reader):
                if label[3] == "1":  # Body label valid
                    annotations_dict[f"town_centre_{int(label[1]):04d}"].append(
                        {"left": float(label[8]), "top": float(label[9]), "right": float(label[10]),
                         "bottom": float(label[11])})
                else:
                    message(f"Label {i} invalid - no body region")
                if i % 1000 == 0:
                    message(f"Processed {i} on {labels_len} labels")
        return annotations_dict

    def _get_detections(self, annotations_base, img_name, img_width, img_height):
        detections_for_curr_img = []
        for groundtruth_annotation in annotations_base[img_name]:
            curr_detection = get_blank_detection_schema()
            curr_detection["id"] = self.detection_counter
            self.detection_counter += 1
            curr_detection["image_id"] = int(img_name.split("_")[-1])
            curr_detection["label"] = "person"
            curr_detection["segmentation"] = None
            curr_detection["area"] = None
            curr_detection["top"] = 0 if groundtruth_annotation["top"] < 0 else groundtruth_annotation["top"]
            curr_detection["left"] = 0 if groundtruth_annotation["left"] < 0 else groundtruth_annotation["left"]
            curr_detection["right"] = img_width if groundtruth_annotation["right"] > img_width \
                else groundtruth_annotation["right"]
            curr_detection["bottom"] = img_height if groundtruth_annotation["bottom"] > img_height \
                else groundtruth_annotation["bottom"]
            curr_detection["iscrowd"] = False
            curr_detection["isbbox"] = True
            curr_detection["keypoints"] = []

            detections_for_curr_img.append(curr_detection)
        return detections_for_curr_img

    @staticmethod
    def _image_dimensions(path):
        with Image.open(path) as image:
            return image.width, image.height
