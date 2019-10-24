IMAGE_SCHEMA = {
    'type': 'object',
    'properties': {
        'id': {'type': 'string'},
        'path': {'type': 'string'},
        'segmented_path': {
            'anyOf': [
                {'type': 'null'},
                {'type': 'string'}
            ]
        },
        'width': {'type': 'integer', 'minimum': 10},
        'height': {'type': 'integer', 'minimum': 10},
    },
    'required': ['id', 'path', 'segmented_path', 'width', 'height']
}

DETECTION_SCHEMA = {
    'type': 'object',
    'properties': {
        'label': {'type': 'string'},
        'top': {'type': 'number', 'minimum': 0},
        'left': {'type': 'number', 'minimum': 0},
        'right': {'type': 'number', 'minimum': 0},
        'bottom': {'type': 'number', 'minimum': 0}
    },
    'required': ['top', 'left', 'right', 'bottom']
}

IMAGE_DETECTION_SCHEMA = {
    'type': 'object',
    'properties': {
        'image': IMAGE_SCHEMA,
        'detections': {
            'type': 'array',
            'items': DETECTION_SCHEMA
        }
    }
}