"""
Ingestor and egestor for VOC formats.

http://host.robots.ox.ac.uk/pascal/VOC/voc2012/htmldoc/index.html
"""

import os
import xml.etree.ElementTree as ET
from pathlib import Path

from .abstract import Ingestor
from .validation_schemas import get_blank_image_detection_schema, get_blank_detection_schema


class VocCityIngestor(Ingestor):
    iii = 0
    detection_counter = 0

    folder_names = {"images": "JPEGImages", "annotations": "Annotations", "sets": "ImageSets/Main"}
    chosen_set = "trainval.txt"

    def validate(self, root, folder_names, chosen_set="trainval.txt"):
        self.chosen_set = chosen_set
        if folder_names is None:
            folder_names = self.folder_names
        path = f"{root}"
        print(root)
        for subdir in folder_names.values():
            if not os.path.isdir(os.path.join(root, subdir)):
                return False, f"Expected subdirectory {subdir}"
            if not os.path.isfile(os.path.join(path, os.path.join(folder_names["sets"], chosen_set))):
                return False, f"Expected {chosen_set} to exist within {os.path.join(path, folder_names['sets'])}"
        return True, None

    def ingest(self, path, folder_names=None):
        self.iii = 0
        self.detection_counter = 0
        if folder_names is None:
            folder_names = self.folder_names
        image_names = self._get_image_ids(path, folder_names)
        return [self._get_image_detection(path, image_name, folder_names) for image_name in image_names]

    def _get_image_ids(self, root, folder_names):
        if folder_names is None:
            path = f"{root}/{self.folder_names['sets']}/{self.chosen_set}"
        else:
            path = f"{root}/{folder_names['sets']}/{self.chosen_set}"

        with open(path, "r+") as f:
            lines = f.readlines()
            if len(lines) == 0:
                fnames = [Path(file).stem for file in os.listdir(folder_names["images"])]
                f.writelines(fnames)
            else:
                fnames = [x.replace("\n", "") for x in lines]
            return fnames

    def _get_image_detection(self, root, image_id, folder_names):
        if self.iii % 100 == 0:
            print(f"Processed {self.iii} xmls")
        self.iii += 1

        path = f"{root}"
        image_path = os.path.join(os.path.join(root, os.path.join(folder_names["images"], f"{image_id}.jpg")))
        if not os.path.isfile(image_path):
            raise Exception(f"Expected {image_path} to exist.")

        annotation_path = os.path.join(os.path.join(root, os.path.join(folder_names["annotations"], f"{image_id}.xml")))
        if not os.path.isfile(annotation_path):
            raise Exception(f"Expected annotation file {annotation_path} to exist.")
        tree = ET.parse(annotation_path)
        xml_root = tree.getroot()
        size = xml_root.find("size")
        # segmented = xml_root.find("segmented").text == "1"
        segmented = False
        segmented_path = None
        if segmented:
            segmented_path = f"{path}/SegmentationObject/{image_id}.png"
            if not os.path.isfile(segmented_path):
                raise Exception(f"Expected segmentation file {segmented_path} to exist.")
        image_width = int(xml_root.find("width").text)
        image_height = int(xml_root.find("height").text)

        single_img_detection = get_blank_image_detection_schema()

        single_img_detection["image"]["id"] = image_id
        single_img_detection["image"]["dataset_id"] = None
        single_img_detection["image"]["path"] = image_path
        single_img_detection["image"]["segmented_path"] = segmented_path
        single_img_detection["image"]["width"] = image_width
        single_img_detection["image"]["height"] = image_height
        single_img_detection["image"]["file_name"] = f"{image_id}.jpg"

        detections = [self._get_detection(node, image_id, False, image_width, image_height) for node in
                      xml_root.findall("vehicle")]
        detections2 = [self._get_detection(node, image_id, True, image_width, image_height) for node in
                       xml_root.findall("passengers")]
        for detection in detections2:
            detections.append(detection)

        single_img_detection["detections"] = detections

        return single_img_detection

    def _get_detection(self, node, img_id, passenger, width, height):
        curr_detection = get_blank_detection_schema()

        bndbox = node.find("bndbox")

        curr_detection["id"] = self.detection_counter
        self.detection_counter += 1
        curr_detection["image_id"] = str(img_id)
        if passenger:
            curr_detection["label"] = "person"
        else:
            curr_detection["label"] = node.find("type").text
        curr_detection["segmentation"] = None
        curr_detection["top"] = float(bndbox.find("ymin").text)
        if curr_detection["top"] < 0:
            curr_detection["top"] = 0
        curr_detection["left"] = float(bndbox.find("xmin").text)
        if curr_detection["left"] < 0:
            curr_detection["left"] = 0
        curr_detection["right"] = float(bndbox.find("xmax").text)
        if curr_detection["right"] > width:
            curr_detection["right"] = width
        curr_detection["bottom"] = float(bndbox.find("ymax").text)
        if curr_detection["bottom"] > height:
            curr_detection["bottom"] = height
        curr_detection["iscrowd"] = False
        curr_detection["isbbox"] = True
        curr_detection["keypoints"] = []

        return curr_detection
