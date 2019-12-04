import os
import xml.etree.ElementTree as ET

from PIL import Image

from .abstract import Ingestor
from .validation_schemas import get_blank_detection_schema, get_blank_image_detection_schema


class DETRACIngestor(Ingestor):
    def validate(self, path, folder_names):
        expected_dirs = [
            "DETRAC-Train-Annotations-XML",
            "DETRAC-Test-Annotations-XML",
            "DETRAC-Train-Data",
            "DETRAC-test-data"
        ]
        for subdir in expected_dirs:
            if not os.path.isdir(f"{path}/{subdir}"):
                return False, f"Expected subdirectory {subdir} within {path}"
        return True, None

    def ingest(self, path, folder_names):
        return self._get_image_detection(path, folder_names=folder_names)

    def _get_image_detection(self, root, folder_names):
        lab_dirs = ["DETRAC-Train-Annotations-XML", "DETRAC-Test-Annotations-XML"]
        img_det = []
        for lab_type in lab_dirs:
            directory = os.path.join(root, lab_type)
            for lab in os.scandir(directory):
                mov_name = os.path.splitext(lab.name)[0]
                tree = ET.parse(lab.path)
                toor = tree.getroot()
                accepted_tags = ["car", "bus", "van"]
                obj_id = -1
                for frame in toor.iter("frame"):  # child = frame
                    no_frame = frame.attrib["num"]
                    img_name = f"img{'0' * (5 - len(str(no_frame)))}{no_frame}"
                    for target in frame:
                        detections = []
                        for obj in target:
                            obj_id += 1
                            box = obj.find("box").attrib
                            attr = obj.find("attribute").attrib
                            if attr["vehicle_type"] in accepted_tags:
                                det = get_blank_detection_schema()
                                det["id"] = obj_id
                                det["image_id"] = os.path.join(mov_name, img_name)
                                det["iscrowd"] = False
                                det["isbbox"] = True
                                det["segmentation"] = None
                                det["label"] = attr["vehicle_type"]
                                det["left"] = float(box["left"])
                                det["right"] = float(box["left"]) + float(box["width"])
                                det["top"] = float(box["top"])
                                det["bottom"] = float(box["top"]) + float(box["height"])
                                det["keypoints"] = []
                                detections.append(det)
                        img = get_blank_image_detection_schema()
                        img["detections"] = detections
                        img["image"]["id"] = os.path.join(mov_name, img_name)
                        img["image"]["id"] = os.path.join(mov_name, img_name)
                        img["image"]["dataset_id"] = None
                        img["image"]["path"] = os.path.join(directory, mov_name, f"{img_name}.jpg")
                        img["image"]["width"] = 10000
                        img["image"]["height"] = 10000
                        img["image"]["file_name"] = f"{img_name}.jpg"
                        img_det.append(img)
        return img_det

    @staticmethod
    def _image_dimensions(path):
        with Image.open(path) as image:
            return image.width, image.height
