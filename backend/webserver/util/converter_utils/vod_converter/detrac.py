'''
    Ingestor for DETRAC dataset format. DETRAC annotations are stored in XML format.
    
    YET NOT TESTED
'''
import os
import json

from PIL import Image
import xml.etree.ElementTree as ET
from lib.vod_converter.abstract import Ingestor, Egestor
from lib.vod_converter.validation_schemas import get_blank_detection_schema, get_blank_image_detection_schema

class DETRACIngestor(Ingestor):
    def validate(self, path, folder_names):
        expected_dirs = [
            'DETRAC-Train-Annotations-XML',
            'DETRAC-Test-Annotations-XML',
            'DETRAC-Train-Data',
            'DETRAC-test-data'
        ]
        for subdir in expected_dirs:
            if not os.path.isdir(f"{path}/{subdir}"):
                return False, f"Expected subdirectory {subdir} within {path}"
        return True, None

    def ingest(self, path, folder_names):
        return self._get_image_detection(path, folder_names=folder_names)

    def _get_image_detection(self, root, folder_names):
        lab_dirs = ['DETRAC-Train-Annotations-XML', 'DETRAC-Test-Annotations-XML',]
        for lab_type in lab_dirs:
            for lab in os.scandir(lab_type):
                #TODO: get image dimensions
                mov_name = os.path.splitext(lab.name)[0]
                tree = ET.parse(lab.name)
                root = tree.getroot()
                accepted_tags = ['car', 'bus', 'van']
                obj_id = -1
                for frame in root.iter('frame'):                # child = frame
                    no_frame = frame.attrib['num']
                    img_name = 'img' + '0' * (5 - len(str(no_frame))) + str(no_frame)
                    for target in frame:                 
                        detections = []
                        for obj in target:
                            obj_id += 1
                            box = obj.find('box').attrib
                            attr = obj.find('attribute').attrib
                            if attr['vehicle_type'] in accepted_tags:
                                det = get_blank_detection_schema()
                                det['id'] = obj_id
                                det['image_id'] = mov_name + '/' + img_name
                                det['iscrowd'] = False
                                det['isbbox'] = False
                                det['label'] = attr['vehicle_type']
                                det['left'] = box['left']
                                det['right'] = box['left'] + box['width']
                                det['top'] = box['top']
                                det['bottom'] = box['top'] + box['height']
                                detections.append(det)
                        img = get_blank_image_detection_schema()
                        img['detections'] = detections
                        img['image']['id'] = mov_name + '/' + img_name
                        img['image']['dataset_id'] = None
                        img['image']['path'] = mov_name + '/' + img_name + '.jpg'
                        img['image']['width'] = 100
                        img['image']['height'] = 100
                        img['image']['file_name'] = img_name + '.jpg'
    
    @staticmethod
    def _image_dimensions(path):
        with Image.open(path) as image:
            return image.width, image.height