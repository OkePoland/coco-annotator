import json
import os
import sys
from contextlib import redirect_stdout

from .vod_converter import converter

INGESTORS = [
    "mio",  # NOT tested
    "pedx",  # tested and working
    "citycam",  # tested and working
    "coco",  # tested and working
    # "daimler",        TODO: daimler needs more strict validation
    "kitti",  # tested and working
    "kitti-tracking",  # NOT tested
    "voc",  # tested and working
    "aicity",  # tested and working
    "detrac",  # tested and working
    "caltech",  # tested and working
    "town-centre"]  # tested and working


class RedirectStream:
    task_stream = None

    def __init__(self, task):
        self.task_stream = task

    def write(self, message):
        if message != "\n":
            self.task_stream.info(message)

    def flush(self):
        pass


def check_coco(ann_file):
    flist = []
    for dirpath, dirnames, filenames in os.walk(ann_file):
        for filename in [f for f in filenames if f.endswith(".json")]:
            flist.append(os.path.join(dirpath, filename))
    try:
        c_json = json.loads(ann_file)
    except Exception as error:
        return False, ann_file
    if all(x in c_json.keys() for x in ["images", "categories", "annotations"]):
        return True, ann_file
    else:
        return False, ann_file


def convert_to_coco(ann_file, current_task):
    to_key = "coco"
    success = False
    with redirect_stdout(RedirectStream(current_task)):
        for from_key in INGESTORS:
            print(f"\nConverting from {from_key} to {to_key}.")
            try:
                success, encoded_labels = converter.convert(from_path=ann_file, to_path=None, ingestor_key=from_key,
                                                            egestor_key=to_key,
                                                            select_only_known_labels=False,
                                                            filter_images_without_labels=True, folder_names=None)
            except:
                success = False
            if success:
                print(f"Successfully converted from {from_key} to {to_key}.")
                coco = encoded_labels
                return coco, True
            else:
                print(f"Failed to convert from {from_key} to {to_key}")

        return None, False
