"""
Defines the protocol for converting too and from a common data format and executes
the conversion, validating proper conversion along the way.

For a given dataformat, e.g `voc.py`, if you wish to support reading in of your data format, define
an `Ingestor` that can read in data from a path and return an array of data conforming to `IMAGE_DETECTION_SCHEMA`.

If you wish to support data output, define an `Egestor` that, given an array of data of the same form,
can output the data to the filesystem.

See `main.py` for the supported types, and `voc.py` and `kitti.py` for reference.
"""

from jsonschema import validate as raw_validate
from jsonschema.exceptions import ValidationError as SchemaError
from ..vod_converter import pedx as pedx
from ..vod_converter import coco as coco
from ..vod_converter import daimler as daimler
from ..vod_converter import kitti as kitti
from ..vod_converter import kitti_tracking as kitti_tracking
from ..vod_converter import voc as voc
from ..vod_converter import citycam as voc_city
from ..vod_converter import mio as mio
from ..vod_converter import caltech as caltech
from ..vod_converter import detrac as detrac
from ..vod_converter.validation_schemas import IMAGE_DETECTION_SCHEMA
import logging
logger = logging.getLogger('gunicorn.error')
print = logger.info

def validate_schema(data, schema):
    """Wraps default implementation but accepting tuples as arrays too.

    https://github.com/Julian/jsonschema/issues/148
    """
    return raw_validate(data, schema, types={"array": (list, tuple)})


INGESTORS = {
    'pedx': pedx.PEDXIngestor(),
    'citycam': voc_city.VOC_CITY_Ingestor(),
    'coco': coco.COCOIngestor(),
    'mio': mio.MIOIngestor(),
    'daimler': daimler.DAIMLERIngestor(),
    'kitti': kitti.KITTIIngestor(),
    'kitti-tracking': kitti_tracking.KITTITrackingIngestor(),
    'voc': voc.VOCIngestor(),
    'detrac': detrac.DETRACIngestor(),
    'caltech': caltech.CaltechIngestor()}

EGESTORS = {
    'voc': voc.VOCEgestor(),
    'kitti': kitti.KITTIEgestor(),
    'coco': coco.COCOEgestor()
}


def convert(*, labels, ingestor_key, egestor_key, select_only_known_labels, filter_images_without_labels,
            folder_names):

    """
    Converts between data formats, validating that the converted data matches
    `IMAGE_DETECTION_SCHEMA` along the way.

    :param from_path: '/path/to/read/from'
    :param ingestor_key: `Ingestor` to read in data
    :param to_path: '/path/to/write/to'
    :param egestor_key: `Egestor` to write out data
    :param select_only_known_labels: Bool indicating if an annotation with unknown label should be passed to Egestor
    :param filter_images_without_labels: Bool indicating if an image detection without any annotation should be passed
            to Egestor
    :param folder_names: List of folders' names that are passed to Egestor
    :return: (success, message)
    """
    print("start")
    ingestor = INGESTORS[ingestor_key]
    egestor = EGESTORS[egestor_key]
    from_valid, from_msg = ingestor.validate(labels, folder_names)

    if not from_valid:
        return from_valid, from_msg

    image_detections = ingestor.ingest(labels, folder_names)

    validate_image_detections(image_detections)

    image_detections = convert_labels(
        image_detections=image_detections, expected_labels=egestor.expected_labels(),
        select_only_known_labels=select_only_known_labels,
        filter_images_without_labels=filter_images_without_labels)

    ready_file = egestor.egest(image_detections=image_detections, folder_names=folder_names)
    return True, ready_file


def validate_image_detections(image_detections):
    print("Validating...")
    deleted_img_detections = 0
    for i, image_detection in enumerate(image_detections):
        if i % 100 == 0:
            print(f"Validated {i} image detections")
        try:
            validate_schema(image_detection, IMAGE_DETECTION_SCHEMA)
        except SchemaError as se:
            #print(se)
            image_detections.remove(image_detection)
            continue
        image = image_detection['image']
        for detection in image_detection['detections']:
            try:
                if detection['right'] > image['width']:
                    # os.remove(image['path'])
                    raise ValueError(f"Image {image} has out of bounds bounding box {detection}")
                if detection['bottom'] > image['height']:
                    # os.remove(image['path'])
                    raise ValueError(f"Image {image} has out of bounds bounding box {detection}")
                if detection['right'] <= detection['left'] or detection['bottom'] <= detection['top']:
                    # os.remove(image['path'])
                    raise ValueError(f"Image {image} has zero dimension bbox {detection}")
            except Exception as ve:
                print(ve)
                image_detections.remove(image_detection)
                deleted_img_detections += 1
                break
    print(f"Deleted labels for {deleted_img_detections} images")


def convert_labels(*, image_detections, expected_labels,
                   select_only_known_labels, filter_images_without_labels):
    print("Converting labels...")
    convert_dict = {}
    for label, aliases in expected_labels.items():
        convert_dict[label.lower()] = label
        for alias in aliases:
            convert_dict[alias.lower()] = label

    final_image_detections = []
    for i, image_detection in enumerate(image_detections):
        if i % 100 == 0:
            print(f"Converted {i} labels")

        detections = []
        try:
            for detection in image_detection['detections']:
                label = detection['label']

                fallback_label = label if not select_only_known_labels else None
                final_label = convert_dict.get(label.lower(), fallback_label)
                if final_label:
                    detection['label'] = final_label
                    detections.append(detection)
            image_detection['detections'] = detections
            if detections:
                final_image_detections.append(image_detection)
            elif not filter_images_without_labels:
                final_image_detections.append(image_detection)
        except Exception as e:
            print(e)
    return final_image_detections
