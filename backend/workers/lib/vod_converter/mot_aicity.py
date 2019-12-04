"""
    Ingestor for AICity format. TODO: test if works for original MOT Challenge format
        - Stored in txt files, one file for all frames from one camera.
        - Ground truth stored as following:
            [frame, ID, left, top, width, height, 1, -1, -1, -1]
"""

import csv
import os
import traceback

from PIL import Image

from .abstract import Ingestor


class MOT_AICITYIngestor(Ingestor):
    def validate(self, path, folder_names):
        expected_dirs = [
            # "test",
            "train"
        ]
        expected_subdirs = [
            "annotations",
            "images"
        ]
        for directory in expected_dirs:
            if not os.path.isdir(f"{path}/{directory}"):
                return False, f"Expected subdirectory {directory} within {path}"
            else:
                for subdirectory in expected_subdirs:
                    if not os.path.isdir(f"{path}/{directory}/{subdirectory}"):
                        return False, f"Expected subdirectory {subdirectory} within {path}/{directory}"
        return True, "Validation OK"

    def ingest(self, path, folder_names):
        try:
            ret = self._get_image_detection(path, folder_names=folder_names)
            print(type(ret))
            return ret
        except Exception:
            print(traceback.format_exc())
            print("Ingesting failed")
            exit()

    def _get_image_detection(self, root, folder_names):
        image_detections = []
        detections = {}
        images = {}
        det_id = 0
        path_ann = [
            # root + "/test/annotations",
            root + "/train/annotations"
        ]
        path_img = [
            # root + "/test/images",
            root + "/train/images"
        ]
        for i in range(len(path_ann)):
            for ann in os.scandir(path_ann[i]):
                img_name_base = ann.name[:9]
                with open(ann.path) as f:
                    f_csv = csv.reader(f, delimiter=",")
                    for row in f_csv:
                        frame_id = row[0]
                        img_name = img_name_base + "0000"[:4 - len(frame_id)] + frame_id + "..jpg"
                        img_path = os.path.join(path_img[i], img_name)
                        success, width, height = self._image_dimensions(img_path)
                        # success, width, height = True, 1000, 1000
                        if not success:
                            continue
                        if frame_id not in images.keys():
                            img = {
                                "id": frame_id,
                                "dataset_id": None,
                                "path": img_path,
                                "segmented_path": None,
                                "width": width,
                                "height": height,
                                "file_name": img_name
                            }
                            images[frame_id] = img
                        success, det = self._get_detections(row, img_name, det_id)
                        if success:
                            if frame_id in detections:
                                detections[frame_id].append(det)
                            else:
                                detections[frame_id] = []
                                detections[frame_id].append(det)
                            det_id += 1
                        else:
                            print("Parsing row failed")
                            print(row)
                            print(det)
                            continue
        for k, v in images.items():
            image_detections.append({
                "image": v,
                "detections": detections[k]
            })
        return image_detections

    @staticmethod
    def _get_detections(row, img_name, det_id):
        try:
            x1, y1, w, h = map(int, row[2:6])
            label = row[6]
            det = {
                "id": det_id,
                "image_id": img_name,
                "label": label,
                "segmentation": None,
                "area": None,
                "top": y1,
                "left": x1,
                "right": x1 + w,
                "bottom": y1 + h,
                "iscrowd": False,
                "isbbox": True,
                "keypoints": []
            }
            return True, det
        except Exception as ex:
            return False, ex

    @staticmethod
    def _image_dimensions(path):
        try:
            with Image.open(path) as image:
                return True, image.width, image.height
        except Exception:
            return False, -1, -1
