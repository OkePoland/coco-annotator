'''
    Ingestor for PedX dataset format. PedX annotations are stored in json format.
'''
import json
import os

from PIL import Image

from .abstract import Ingestor
from .validation_schemas import get_blank_detection_schema, get_blank_image_detection_schema


class PEDXIngestor(Ingestor):
    def validate(self, path, folder_names):
        expected_dirs = [
            'calib',
            'images',
            'labels',
            'preview',
            'timestamps'
        ]
        for subdir in expected_dirs:
            if not os.path.isdir(f"{path}/{subdir}"):
                return False, f"Expected subdirectory {subdir} within {path}"
        return True, None

    def ingest(self, path, folder_names):
        return self._get_image_detection(path, folder_names=folder_names)

    def _get_image_detection(self, root, folder_names):
        det_id = 0
        image_detections = []
        names = []
        detcs = {}
        image_width = {}
        image_height = {}
        path_labs = root + '/labels/2d/'
        path_imgs = root + '/images/'
        for date in os.scandir(path_imgs):
            for cam in os.scandir(date):
                for im in os.scandir(cam):
                    if not im.name.startswith('.'):
                        names.append(os.path.splitext(im.name)[0])
        for im_name in names:
            detcs[im_name] = []
            im_name_seg = im_name.split('_')
            image_path = path_imgs + im_name_seg[0] + '/' + im_name_seg[1] + '/' + im_name + '.jpg'
            image_width[im_name], image_height[im_name] = self._image_dimensions(image_path)
        for date in os.scandir(path_labs):
            for lab in os.scandir(date):
                with open(lab.path) as file_lab:
                    data = json.load(file_lab)
                im_name = lab.name[0:29]
                detection = self._get_detections(data, im_name, det_id, lab.name)
                det_id += 1
                if im_name in detcs.keys():
                    detcs[im_name].append(detection)
        for im_name in names:
            im_schema = get_blank_image_detection_schema()
            if im_name in detcs:
                im_name_seg = im_name.split('_')
                im_path = path_imgs + im_name_seg[0] + '/' + im_name_seg[1] + '/' + im_name + '.jpg'
                if os.path.isfile(im_path) and im_name in detcs and len(detcs[im_name]) != 0:
                    im_schema['image']['id'] = im_name
                    im_schema['image']['path'] = im_path
                    im_schema['image']['width'] = image_width[im_name]
                    im_schema['image']['height'] = image_height[im_name]
                    im_schema['image']['file_name'] = im_name + '.jpg'
                    im_schema['detections'] = detcs[im_name]
                    image_detections.append(im_schema)
        return image_detections

    def _get_detections(self, json_data, image_id, det_id, lab_name):
        if json_data['polygon'] is not None:
            polygon = [item for sublist in json_data['polygon'] for item in sublist]
        else:
            polygon = None
        if json_data['keypoint'] is not None:
            keypoint, num_keypoints = self._get_keypoints(json_data['keypoint'])
        else:
            keypoint, num_keypoints = [], None
        temp = get_blank_detection_schema()
        temp['id'] = det_id
        temp['image_id'] = image_id
        temp['label'] = json_data['category']
        temp['segmentation'] = [polygon]
        temp['iscrowd'] = False
        temp['isbbox'] = False
        temp['keypoints'] = keypoint
        temp['top'] = 0
        temp['left'] = 0
        temp['right'] = 0
        temp['bottom'] = 0
        return temp

    def _get_keypoints(self, keypoints_dict):
        ALL_KEYPOINTS = [
            "nose", "leye", "reye", "lear", "rear",
            "lsho", "rsho", "lelb", "relb",
            "lwri", "rwri", "lhip", "rhip",
            "lknee", "rknee", "lankl", "rankl"
        ]
        no_keypoints = len(keypoints_dict)
        list_keypoints = []
        for keypoint in ALL_KEYPOINTS:
            if keypoint in keypoints_dict.keys():
                if keypoints_dict[keypoint]['visible']:
                    is_visible = True
                else:
                    is_visible = False
                list_keypoints.append(keypoints_dict[keypoint]['x'])
                list_keypoints.append(keypoints_dict[keypoint]['y'])
                list_keypoints.append(is_visible)
            else:
                list_keypoints.append(0)
                list_keypoints.append(0)
                list_keypoints.append(0)
        return list_keypoints, no_keypoints

    @staticmethod
    def _image_dimensions(path):
        with Image.open(path) as image:
            return image.width, image.height
