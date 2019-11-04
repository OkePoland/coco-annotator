import json
import logging
from .vod_converter import converter

INGESTORS = [
    'mio',
    'pedx',
    'citycam',
    #'coco',
    'daimler',
    'kitti',
    'kitti-tracking',
    'voc',
    'detrac',
    'caltech']


def check_coco(ann_file):
    # logger = logging.getLogger('gunicorn.error')
    try:
        # f = open(ann_file)
        c_json = json.loads(ann_file)

    except Exception as error:
        return False, ann_file
    if all(x in c_json.keys() for x in ['images', 'categories', 'annotations']):
        return True, c_json
    else:
        return False, ann_file


def convert_to_coco(ann_file):
    '''
    It should return json file (json.load)
    '''
    logger = logging.getLogger('gunicorn.error')
    to_key = 'coco'
    
    for from_key in INGESTORS:
        success, file = converter.convert(from_path=ann_file, to_path=None, ingestor_key=from_key,
                                        egestor_key=to_key,
                                        select_only_known_labels=False,
                                        filter_images_without_labels=True, folder_names=None)
        if success:
            logger.info(f"Successfully converted from {from_key} to {to_key}.")
            coco = file
            break
        else:
            logger.info(f"Failed to convert from {from_key} to {to_key}")
    return coco, "OH YRAH< IT WORKS"