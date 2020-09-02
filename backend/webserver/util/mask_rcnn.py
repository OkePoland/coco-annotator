from config import Config as AnnotatorConfig
from skimage.transform import resize
import imantics as im
import numpy as np
from scipy.interpolate import interp1d
from scipy.ndimage import gaussian_filter
from keras.preprocessing.image import img_to_array
from mrcnn.config import Config
from .inference import ModelInferenceHandler
import logging

logger = logging.getLogger('gunicorn.error')

MODEL_DIR = AnnotatorConfig.MODEL_DIR
COCO_MODEL_PATH = AnnotatorConfig.MASK_RCNN_FILE
CLASS_NAMES = AnnotatorConfig.MASK_RCNN_CLASSES.split(',')
EXCLUDED_LAYERS = AnnotatorConfig.MASK_RCNN_EXCLUDED_LAYERS.split(',')


class CocoConfig(Config):
    """
    Configuration for COCO Dataset.
    """
    NAME = "coco"
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1
    NUM_CLASSES = len(CLASS_NAMES)


class MaskRCNN():

    def __init__(self):

        self.config = CocoConfig()
        # self.model = modellib.MaskRCNN(
        #     mode="inference",
        #     model_dir=MODEL_DIR,
        #     config=self.config
        # )
        try:
            logger.info(f"Loading {COCO_MODEL_PATH}")
            self.model = ModelInferenceHandler(frozen_model_path=COCO_MODEL_PATH, output_type=0, max_batch_size=1)
            self.model.init_session()
            logger.info(f"Loaded MaskRCNN model: {COCO_MODEL_PATH}")
        except Exception as e:
            logger.error(e)
            logger.error(f"Could not load MaskRCNN model (place '{COCO_MODEL_PATH}' in the {MODEL_DIR} directory)")
            self.model = None

    def detect(self, image):
        logger.info("Started Detection xd")
        if self.model is None:
            return {}
        logger.info("Started Detection")
        image = image.convert('RGB')
        width, height = image.size
        logger.info(width)
        image.thumbnail((1024, 1024))

        image = img_to_array(image)
        result = [self.model.predict(image, with_padding=False)]
        logger.info(result)
        result = self.parse_result(result)
        logger.info(result)
        bboxes = result["boxes"]
        segments = result["polygons"]
        class_ids = result["classes"]

        coco_image = im.Image(width=width, height=height)

        for bbox, segment, class_id in zip(bboxes, segments, class_ids):
            x1 = int(round(bbox[1] * width))
            y1 = int(round(bbox[2] * height))
            x2 = int(round(bbox[3] * width))
            y2 = int(round(bbox[0] * height))
            #TODO hardcoded values of scaled mask dimensions
            width_fixed = (x2-x1)/29.0
            height_fixed = (y1-y2)/29.0
            segment = self.points_interpolation(segment)
            for i in range(len(segment)):
                if i % 2 == 0:
                    segment[i] = segment[i]*width_fixed+x1
                else: segment[i] = height_fixed*segment[i]+y2
            fixed_mask = im.Polygons([segment])
            fixed_bbox = im.BBox((x1, y2, x2, y1))
            logger.info(fixed_bbox)
            logger.info(class_id)
            class_name = CLASS_NAMES[class_id - 1]
            logger.info(class_name)
            logger.info(type(class_name))
            category = im.Category(class_name)
            logger.info(type(category))
            coco_image.add(fixed_mask, category=category)
            # comment this for no bbox label
            coco_image.add(fixed_bbox, category=category)

        return coco_image.coco()

    def parse_result(self, result):
        threshold = 0.4
        new_result = {"classes": [], "boxes": [], "scores": [], "polygons": []}
        classes = np.concatenate([el['detection_classes'] for el in result]).ravel().tolist()
        boxes = np.concatenate([el['detection_boxes'] for el in result]).ravel().tolist()
        scores = np.concatenate([el['detection_scores'] for el in result]).ravel().tolist()
        bin_masks = [np.where(r['detection_masks'] > threshold, 1, 0) for r in result if 'detection_masks' in r][0]
        bin_masks = np.kron(bin_masks, np.ones((2, 2)))
        # bin_masks = self.gauss_blur(bin_masks)
        for i in range(len(scores)):
            if scores[i] > threshold:
                new_result['classes'].append(classes[i])
                new_result['boxes'].append([boxes[i * 4], boxes[i * 4 + 1], boxes[i * 4 + 2], boxes[i * 4 + 3]])
                new_result['scores'].append(scores[i])
                if len(bin_masks) > i-1:
                    new_result['polygons'].append(im.Mask(bin_masks[i]).polygons().segmentation[0])
        return new_result

    def points_interpolation(self, segment):
        points = [[], []]
        for n in range(0, len(segment), 2):
            points[0].append(segment[n])
            points[1].append(segment[n+1])

        points = np.array([points[0], points[1]]).T
        distance = np.cumsum(np.sqrt(np.sum(np.diff(points, axis=0) ** 2, axis=1)))
        distance = np.insert(distance, 0, 0) / distance[-1]
        alpha = np.linspace(0, 1, 100)

        interpolator = interp1d(distance, points, kind='slinear', axis=0)
        interpolated_points = interpolator(alpha)
        interpolated_points = interpolated_points.flatten().tolist()
        return interpolated_points

    def gauss_blur(self, bin_masks):
        bin_masks = np.kron(bin_masks, np.ones((4, 4)))
        bin_masks = gaussian_filter(bin_masks, sigma=1)
        bin_masks = [(np.where(n > 0.35, 1, 0)) for n in bin_masks]
        return bin_masks


model = MaskRCNN()
