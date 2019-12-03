import copy

"""
I recommend importing raw_image_detection_schema and raw_detection_schema and with them build our middle format by
fulfilling necessary fields. Created format will be validated in convert.py to test if it has structure, which can be
converted to coco format accepted by COCO Annotator.

Requirements for Schemas:
In raw_image_detection_schema:
{
    "image":
        {
            "id" - Mandatory (int or string)
            "dataset_id": Optional (int) or can be left as None
            "path": Mandatory (string)
            "segmented_path": Optional (string) or can be left as None
            'width': Mandatory (int)
            'height': Mandatory (int)
            "file_name": Mandatory (string)
        },
    "detections": List of raw_image_detection_schema - need to be filled with raw_image_detection_schema objects or
                can be left as empty list

    # categories are currently not used
    #
    # "categories": List of raw_categories_schema, used to store info about keypoinst and skeletons of categories if
    #           ingested dataset has them
}

In raw_detection_schema:
{
    "id": Mandatory (int or string)
    "image_id": Mandatory (int or string)
    "label": Mandatory (string)
    "segmentation": Optional (list of lists, for each subsegment one sublist) or can be left as None, if left as None and isbbox=True, it will be automatically
                    fulfilled with points of bbox to ensure compatibility with COCO Annotator.
                    How to fill list:
                    * If iscrowd=0 then polygons are used and list should be consecutive x and y coordinates of
                    polygon points, so for polygon made of 3 (x,y) points, the list should be
                    [x0, y0, x1, y1, x2, y2].
                    * If iscrowd=1 then RLE is used. List then should be filled with Run-length encoding

    (Below are 4 bbox coordinates, if isbbox=True, they need to be filled with numbers (min 0) indicating proper points
    of bbox, if isbbox=False they probably can be filled with random values, I am not sure now because even if
    annotation is a segmentation made of polygons, COCO Annotator is filling bbox with some values, maybe it is
    calculating bbox from segmentation but it need to be tested)
    
    "area" - area calculated from segmentation, int or can be left as None, if left as None, area will
            be calculated automatically from content of segmentation 
    "top" - y coordinate of left-top point of bbox
    "left" - x coordinate of left-top point of bbox
    "right" - x coordinate of right-bottom point of bbox
    "bottom" - y coordinate of right-bottom point of bbox
    "iscrowd" - If True, "segmentation" will be used as Run-length encoding, if False "segmentation" will be used as
                polygons (more details in description of "segmentation" field)
    "isbbox" - Not sure how that one works, if True "top", "left", "right", "bottom" must be filled with proper xy
               values, if False I am not sure what COCO Annotator is doing, maybe ignoring this filed so it can be left
               as None.
    "keypoints" - If not used, should be set to empty list: []
}


In raw_categories_schema:
{
    "name" - name of category, for example "person"
    "keypoints" - list of names of keypoints for current category, for example: ["nose", "left_eye", "right_eye"]
    "skeleton" - list of 2 elem lists, indicates connections between points, for exmaple [[1, 2], [2, 3]] means
                nose is connected with left_eye and left_eye is connected with right_eye
}

"""
# !!!
# Warning: If you use raw_schemas you need to make copy of it with .copy() in every iteration, because dict in python
# are addressed by reference, so if you change dict's values without copy, you will be changing values from every
# iteration
# Better use functions below to get copy of these dicts
# !!!
_raw_image_detection_schema = {
    "image":
        {
            "id": None,
            "dataset_id": None,
            "path": None,
            "segmented_path": None,
            'width': None,
            'height': None,
            "file_name": None},

    "detections": []
}

# !!!
# Warning: If you use raw_schemas you need to make copy of it with .copy() in every iteration, because dict in python
# are addressed by reference, so if you change dict's values without copy, you will be changing values from every
# iteration
# Better use functions below to get copy of these dicts
# !!!
_raw_detection_schema = {
    "id": None,
    "image_id": None,
    "label": None,
    "segmentation": None,
    "area": None,
    "top": None,
    "left": None,
    "right": None,
    "bottom": None,
    "iscrowd": None,
    "isbbox": None,
    "keypoints": []
}

# !!!
# Warning: If you use raw_schemas you need to make copy of it with .copy() in every iteration, because dict in python
# are addressed by reference, so if you change dict's values without copy, you will be changing values from every
# iteration
# Better use functions below to get copy of these dicts
# !!!
_raw_categories_schema = {
    "name": None,
    "keypoints": None,
    "skeleton": None,
}


def get_blank_image_detection_schema():
    return copy.deepcopy(_raw_image_detection_schema)


def get_blank_detection_schema():
    return copy.deepcopy(_raw_detection_schema)


def get_blank_categories_schema():
    return copy.deepcopy(_raw_categories_schema)


IMAGE_SCHEMA = {
    'type': 'object',
    'properties': {
        'id': {
            'anyOf': [
                {'type': 'integer'},
                {'type': 'string'}
            ]},
        'dataset_id': {
            'anyOf': [
                {'type': 'integer'},
                {'type': 'null'}
            ]},
        'path': {'type': 'string'},
        'segmented_path': {
            'anyOf': [
                {'type': 'null'},
                {'type': 'string'}
            ]},
        'width': {'type': 'integer', 'minimum': 10},
        'height': {'type': 'integer', 'minimum': 10},
        'file_name': {'type': 'string'},

    },
    'required': ['id', 'dataset_id', 'path', 'segmented_path', 'width', 'height', 'file_name']
}

DETECTION_SCHEMA = {
    'type': 'object',
    'properties': {
        'id': {
            'anyOf': [
                {'type': 'integer'},
                {'type': 'string'}
            ]},
        'image_id': {
            'anyOf': [
                {'type': 'integer'},
                {'type': 'string'}
            ]},

        'label': {'type': 'string'},
        'segmentation': {
            'anyOf': [
                {'type': 'array'},
                {'type': 'null'}
            ]},
        'area': {
            'anyOf': [
                {'type': 'number'},
                {'type': 'null'}
            ]},
        'top': {'type': 'number', 'minimum': 0},
        'left': {'type': 'number', 'minimum': 0},
        'right': {'type': 'number', 'minimum': 0},
        'bottom': {'type': 'number', 'minimum': 0},
        'iscrowd': {'type': 'boolean'},
        'isbbox': {'type': 'boolean'},
        'color': {'type': 'string'},
        'keypoints': {'type': 'array'},

    },
    'required': ['id', 'image_id', 'label', 'segmentation', 'area', 'top', 'left', 'right', 'bottom', 'iscrowd',
                 'isbbox', 'keypoints']
}

CATEGORIES_SCHEMA = {
    'type': 'object',
    'properties': {
        'name': {'type': 'string'},
        "keypoints": {'type': 'array'},
        "skeleton": {'type': 'array'},
    },
    'required': ['name', 'keypoints', "skeleton"]
}

IMAGE_DETECTION_SCHEMA = {
    'type': 'object',
    'properties': {
        'image': IMAGE_SCHEMA,
        'detections': {
            'type': 'array',
            'items': DETECTION_SCHEMA
        },
    },
    'required': ['image', 'detections']
}
