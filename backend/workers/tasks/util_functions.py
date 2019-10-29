import json
import logging

def check_coco(ann_file):
    '''
    Not working yet
    '''
    if len(ann_file) == 1:
        try:
            c_bytes = ann_file[0].read()
            c_string = c_bytes.decode('utf-8')
            c_json = json.loads(c_string)
        except:
            return False, ann_file
    else:
        return False, ann_file
    logger = logging.getLogger('gunicorn.error')
    for cat in c_json:
        logger.info(str(cat))
    return True, ann_file

def convert_to_coco(ann_file):
    '''
    It should return json file (json.load)
    '''
    logger = logging.getLogger('gunicorn.error')
    logger.info("CONVERT TO VOVOVOOVOVOVOVOVOO ")
    return ann_file, "OH YRAH< IT WORKS"