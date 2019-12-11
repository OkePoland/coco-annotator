"""
Ingestor for DAIMLER formats.
{
  "@converter": "LabelTool",
  "tags": [],
  "@source": "",
  "imagename": "tsinghuaDaimlerDataset_2014-12-04_082614_000018089_leftImg8bit.png",
  "@date": "Fri Aug 12 13:36:20 2016",
  "@version": 3,
  "children": [
    {
      "maxcol": 1212,
      "tags": [],
      "trackid": "cyclist_100001",
      "mincol": 1157,
      "minrow": 378,
      "maxrow": 522,
      "uniqueid": 100000,
      "type": "rect",
      "children": [],
      "identity": "cyclist"
    }, ],
  "identity": "entitylist"
}
"""

import json
import os

from PIL import Image
from workers.lib.messenger import message

from .abstract import Ingestor

daimler_dict = {
    "cyclist": "bike",
    "pedestrian": "person",
    "Pedestrian": "person",
    "motorcyclist": "motorcycle",
    "tricyclist": "bicycle",
    "mopedrider": "motorbike",
    "wheelchairuser": "wheelchair",

}


class DAIMLERIngestor(Ingestor):
    def validate(self, path, folder_names):
        expected_dirs = [
            "images",
            "labels"
        ]
        for subdir in expected_dirs:
            if not os.path.isdir(os.path.join(path, subdir)):
                return False, f"Expected subdirectory {subdir} within {path}"
        return True, None

    def ingest(self, path, folder_names):
        return self._get_image_detection(path, image_ext="png", folder_names=folder_names)

    def _get_image_detection(self, root, folder_names, image_ext="png", ):
        image_detection_schema = []
        labels = os.listdir(os.path.join(root, "labels"))
        for filename in labels:
            try:
                path = os.path.join(root, "labels", filename)
                with open(path) as f:
                    data = json.load(f)
                    image_id = path_base_name(data["imagename"])
                    image_path = os.path.join(root, "images", f"{image_id}.{image_ext}")

                    detections = self._get_detections(data["children"])
                    detections = [det for det in detections if
                                  det["left"] < det["right"] and det["top"] < det["bottom"]]
                    try:
                        image_width, image_height = _image_dimensions(image_path)
                    except FileNotFoundError as e:
                        message(e)
                        continue
                    message(f"id: {image_id}")
                    image_detection_schema.append({
                        "image": {
                            "id": image_id,
                            "path": image_path,
                            "segmented_path": None,
                            "width": image_width,
                            "height": image_height
                        },
                        "detections": detections
                    })
            except FileNotFoundError as e:
                message(e)
                continue
        return image_detection_schema

    @staticmethod
    def _get_detections(children):
        detections = []
        for element in children:
            if len(element) == 0:
                continue
            try:
                x1 = element["mincol"]
                x2 = element["maxcol"]
                y1 = element["minrow"]
                y2 = element["maxrow"]
                label = daimler_dict[element["identity"]]
                detections.append({
                    "label": label,
                    "left": x1,
                    "right": x2,
                    "top": y1,
                    "bottom": y2
                })
            except ValueError as ve:
                message(f"{ve} - {element}")
        return detections


def _image_dimensions(path):
    with Image.open(path) as image:
        return image.width, image.height


def file_base_name(file_name):
    if "." in file_name:
        separator_index = file_name.index(".")
        base_name = file_name[:separator_index]
        return base_name
    else:
        return file_name


def path_base_name(path):
    file_name = os.path.basename(path)
    return file_base_name(file_name)


DEFAULT_TRUNCATED = 0.0  # 0% truncated
DEFAULT_OCCLUDED = 0  # fully visible
