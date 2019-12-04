"""
Ingestor and egestor for VOC formats.

http://host.robots.ox.ac.uk/pascal/VOC/voc2012/htmldoc/index.html
"""

import glob
import os
import shutil
import xml.etree.ElementTree as ET

import numpy as np
from PIL import Image
from pycocotools import mask
from skimage import measure

from .abstract import Ingestor, Egestor
from .labels_and_aliases import output_labels
from .validation_schemas import get_blank_image_detection_schema, get_blank_detection_schema


class VOCIngestor(Ingestor):
    iii = 0
    detection_counter = 0
    folder_names = {"images": "JPEGImages", "annotations": "Annotations", "segmentation_classes": "SegmentationClass",
                    "segmentation_object": "SegmentationObject"}
    segmentation_labels = {"1": "aeroplane", "2": "bicycle", "3": "bird", "4": "boat", "5": "bottle",
                           "6": "bus", "7": "car", "8": "cat", "9": "chair", "10": "cow",
                           "11": "diningtable", "12": "dog", "13": "horse", "14": "motorbike", "15": "person",
                           "16": "pottedplant", "17": "sheep", "18": "sofa", "19": "train", "20": "tvmonitor"}

    def validate(self, root, folder_names):
        if folder_names is None:
            folder_names = self.folder_names
        for subdir in folder_names.values():
            if not os.path.isdir(os.path.join(root, subdir)):
                return False, f"Expected subdirectory {subdir}"
        return True, None

    def ingest(self, path, folder_names=None):
        self.iii = 0
        self.detection_counter = 0
        if folder_names is None:
            folder_names = self.folder_names
        image_names = self._get_image_ids(path, folder_names)
        return [self._get_image_detection(path, image_name, folder_names) for image_name in image_names]

    @staticmethod
    def _get_image_ids(root, folder_names):
        if folder_names is None:
            path = os.path.join(root, "Annotations")
        else:
            path = os.path.join(root, folder_names['annotations'])
        fnames = [xml_file.split("/")[-1].split(".")[0] for xml_file in glob.glob(os.path.join(path, "*.xml"))]
        return fnames

    def _get_image_detection(self, root, image_id, folder_names):
        if self.iii % 100 == 0:
            print(f"Processed {self.iii} xmls")
        self.iii += 1

        image_path = os.path.join(os.path.join(root, os.path.join(folder_names["images"], f"{image_id}.jpg")))
        if not os.path.isfile(image_path):
            raise Exception(f"Expected {image_path} to exist.")

        annotation_path = os.path.join(os.path.join(root, os.path.join(folder_names["annotations"], f"{image_id}.xml")))
        if not os.path.isfile(annotation_path):
            raise Exception(f"Expected annotation file {annotation_path} to exist.")

        tree = ET.parse(annotation_path)
        xml_root = tree.getroot()
        size = xml_root.find("size")
        segmented = xml_root.find("segmented").text == "1"
        segmented_path = None
        segmented_objects = None
        if segmented:
            segmented_path = os.path.join(root, folder_names['segmentation_classes'], f"{image_id}.png")
            segmented_objects = os.path.join(root, folder_names['segmentation_object'], f"{image_id}.png")
            if not os.path.isfile(segmented_path):
                raise Exception(f"Expected segmentation file {segmented_path} to exist.")
            if not os.path.isfile(segmented_objects):
                raise Exception(f"Expected segmentation file {segmented_path} to exist.")
        image_width = int(size.find("width").text)
        image_height = int(size.find("height").text)

        single_img_detection = get_blank_image_detection_schema()
        single_img_detection["image"]["id"] = image_id
        single_img_detection["image"]["dataset_id"] = None
        single_img_detection["image"]["path"] = image_path
        single_img_detection["image"]["segmented_path"] = segmented_path
        single_img_detection["image"]["width"] = image_width
        single_img_detection["image"]["height"] = image_height
        single_img_detection["image"]["file_name"] = f"{image_id}.jpg"
        single_img_detection["detections"] = self._get_detections(xml_root, image_id, segmented_path, segmented_objects,
                                                                  image_width, image_height)

        return single_img_detection

    def _get_detections(self, xml_root, img_id, segmented_classes, segmented_objects, image_width, image_height):
        if segmented_classes is None:
            return [self._get_detection(node, img_id) for node in xml_root.findall("object")]
        else:
            detections = []
            sub_masks = self.create_sub_masks(Image.open(segmented_objects))
            class_segmentation_array = np.asarray(Image.open(segmented_classes), dtype="uint8")

            for label, single_mask in sub_masks.items():
                array_mask = np.asarray(single_mask, dtype="uint8")
                contours = measure.find_contours(array_mask, 0.5)

                curr_detection = get_blank_detection_schema()
                curr_detection["segmentation"] = []
                for contour in contours:
                    contour = np.flip(contour, axis=1)
                    segmentation = contour.ravel().tolist()
                    try:
                        rs = mask.frPyObjects([segmentation], image_height, image_width)
                        if mask.area(rs)[0] > 25:
                            curr_detection["segmentation"].append(segmentation)
                        else:
                            continue
                    except Exception as e:
                        print(f"Cannot calculate area of polygon: {e}")
                        continue
                if curr_detection["segmentation"]:
                    curr_detection["area"] = int(sum(mask.area(mask.frPyObjects(curr_detection["segmentation"],
                                                                                image_height, image_width))))
                else:
                    continue

                encoded_ground_truth = mask.encode(np.asfortranarray(array_mask))
                ground_truth_bounding_box = mask.toBbox(encoded_ground_truth)

                curr_detection["id"] = self.detection_counter
                self.detection_counter += 1
                curr_detection["image_id"] = img_id
                curr_detection["label"] = self._get_class_label(array_mask, class_segmentation_array)

                bbox = ground_truth_bounding_box.tolist()
                curr_detection["left"] = bbox[0]
                curr_detection["top"] = bbox[1]
                curr_detection["right"] = bbox[2] + bbox[0]
                curr_detection["bottom"] = bbox[3] + bbox[1]
                curr_detection["iscrowd"] = False
                curr_detection["isbbox"] = False
                curr_detection["keypoints"] = []

                detections.append(curr_detection)
            return detections

    def _get_detection(self, node, img_id):
        curr_detection = get_blank_detection_schema()
        bndbox = node.find("bndbox")
        curr_detection["id"] = self.detection_counter
        self.detection_counter += 1
        curr_detection["image_id"] = img_id
        curr_detection["label"] = node.find("name").text
        curr_detection["segmentation"] = None
        curr_detection["top"] = float(bndbox.find("ymin").text)
        curr_detection["left"] = float(bndbox.find("xmin").text)
        curr_detection["right"] = float(bndbox.find("xmax").text)
        curr_detection["bottom"] = float(bndbox.find("ymax").text)
        curr_detection["iscrowd"] = False
        curr_detection["isbbox"] = True
        curr_detection["keypoints"] = []
        return curr_detection

    @staticmethod
    def create_sub_masks(mask_image):
        width, height = mask_image.size
        sub_masks = {}
        for x in range(width):
            for y in range(height):
                pixel = mask_image.getpixel((x, y))
                if pixel != 0 and pixel != 255:
                    pixel_str = str(pixel)
                    if sub_masks.get(pixel_str) is None:
                        sub_masks[pixel_str] = Image.new("1", (width, height))
                    sub_masks[pixel_str].putpixel((x, y), 1)
        return sub_masks

    def _get_class_label(self, object_mask, class_segmentation_mask):
        object_pixels = np.where((object_mask != 0) & (object_mask != 255))
        labels = []
        for x, y in zip(*object_pixels):
            labels.append(class_segmentation_mask[x][y])
        if len(set(labels)) != 1:
            print(f"Error with finding class from class segmentation mask, not all pixels has the same label, found "
                  f"labels: {set(labels)}")
            return None
        return self.segmentation_labels[str(labels[0])]


class VOCEgestor(Egestor):

    def expected_labels(self):
        return output_labels

    def egest(self, *, image_detections, root, folder_names):
        image_sets_path = os.path.join(root, "ImageSets", "Main")
        images_path = os.path.join(root, folder_names["images"])
        annotations_path = os.path.join(root, folder_names["annotations"])
        segmentations_path = os.path.join(root, "SegmentationObject")
        segmentations_dir_created = False

        for to_create in [image_sets_path, images_path, annotations_path]:
            os.makedirs(to_create, exist_ok=True)
        for image_detection in image_detections:
            image = image_detection["image"]
            image_id = image["id"]
            src_extension = image["path"].split(".")[-1]
            shutil.copyfile(image["path"], os.path.join(images_path, f"{image_id}.{src_extension}"))

            with open(os.path.join(image_sets_path, "trainval.txt"), "a") as out_image_index_file:
                out_image_index_file.write(f"{image_id}\n")

            if image["segmented_path"] is not None:
                if not segmentations_dir_created:
                    os.makedirs(segmentations_path)
                    segmentations_dir_created = True
                shutil.copyfile(image["segmented_path"], os.path.join(segmentations_path, f"{image_id}.png"))

            xml_root = ET.Element("annotation")
            add_text_node(xml_root, "filename", f"{image_id}.{src_extension}")
            add_text_node(xml_root, "folder", root.split("/")[-1])
            add_text_node(xml_root, "segmented", int(segmentations_dir_created))

            add_sub_node(xml_root, "size", {
                "depth": 3,
                "width": image["width"],
                "height": image["height"]
            })
            add_sub_node(xml_root, "source", {
                "annotation": "Dummy",
                "database": "Dummy",
                "image": "Dummy"
            })

            for detection in image_detection["detections"]:
                x_object = add_sub_node(xml_root, "object", {
                    "name": detection["label"],
                    "difficult": 0,
                    "occluded": 0,
                    "truncated": 0,
                    "pose": "Unspecified"
                })
                add_sub_node(x_object, "bndbox", {
                    "xmin": detection["left"] + 1,
                    "xmax": detection["right"] + 1,
                    "ymin": detection["top"] + 1,
                    "ymax": detection["bottom"] + 1
                })
            ET.ElementTree(xml_root).write(os.path.join(annotations_path, f"{image_id}.xml"))


def add_sub_node(node, name, kvs):
    subnode = ET.SubElement(node, name)
    for k, v in kvs.items():
        add_text_node(subnode, k, v)
    return subnode


def add_text_node(node, name, text):
    subnode = ET.SubElement(node, name)
    subnode.text = f"{text}"
    return subnode
