import json
import logging
from .vod_converter import converter
import os

INGESTORS = [
    # 'mio',
    'pedx',         # tested and working
    'citycam',
    'coco',         # tested and working
    # 'daimler',    TODO: daimler needs more strict validation
    'kitti',        # tested and working
    'kitti-tracking',
    'voc',          # tested and working
    'detrac',
    'caltech']


def check_coco(ann_file):
    logger = logging.getLogger('gunicorn.error')
    flist = []
    for dirpath, dirnames, filenames in os.walk(ann_file):
        for filename in [f for f in filenames if f.endswith(".json")]:
            flist.append(os.path.join(dirpath, filename))
    try:
        # f = open(ann_file)
        c_json = json.loads(ann_file)
    except Exception as error:
        return False, ann_file
    if all(x in c_json.keys() for x in ['images', 'categories', 'annotations']):
        return True, ann_file
    else:
        return False, ann_file


def convert_to_coco(ann_file):
    logger = logging.getLogger('gunicorn.error')
    to_key = 'coco'
    success = False
    for from_key in INGESTORS:
        try:
            success, encoded_labels = converter.convert(from_path=ann_file, to_path=None, ingestor_key=from_key,
                                            egestor_key=to_key,
                                            select_only_known_labels=False,
                                            filter_images_without_labels=True, folder_names=None)
        except:
            success = False
        if success:
            logger.info(f"Successfully converted from {from_key} to {to_key}.")
            coco = encoded_labels
            return coco, True
        else:
            logger.info(f"Failed to convert from {from_key} to {to_key}")
    return None, False