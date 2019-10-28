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
            return False, None
    else:
        return False, None
    logger = logging.getLogger('gunicorn.error')
    for cat in c_json:
        logger.info(str(cat))

def convert_to_coco(ann_file):
    '''
    It should return json file (json.load)
    '''
    return True