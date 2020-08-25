import json
import os
from logging import getLogger
from pathlib import Path
from time import time
from uuid import uuid4

import cv2
import numpy as np
import tensorflow as tf

from .inference_statics import DETECTION_MASKS, output_type_enum, DETECTION_SCORES, DETECTION_BOXES, DETECTION_CLASSES, NUM_DETECTIONS


def __version__():
    return '0.1.3'


default_logger = getLogger("INFER")

TRT_EXEC = os.environ.get('TRT_ENABLED', True)
GPU_COUNT = os.environ.get('GPU_COUNT', 1)

default_logger.info(f"Tensorrt {'enabled ' if TRT_EXEC else 'disabled'}")

if TRT_EXEC:
    import tensorflow.contrib.tensorrt as trt


class InitialRunException(Exception):
    pass


class ModelInferenceHandler:
    def __init__(self, frozen_model_path, name=None, normalized_image=False,
                 image_tensor='image_tensor', max_batch_size=1, precision_mode='FP16', input_size=(300, 300, 3),
                 output_type=1, logger=None):
        if name is None:
            name = str(uuid4())
        self.logger = default_logger if logger is None else logger
        self.name = name
        self.__image_tensor = image_tensor
        self.__normalized_image = normalized_image
        self.__max_batch_size = max_batch_size
        self.__detection_graph = tf.Graph()
        self.__precision_mode = precision_mode
        self.__input_size = input_size
        self.__output_names = output_type_enum[output_type]
        self.__get_in_out_nodes(frozen_model_path)
        self.__init_graph(frozen_model_path)
        self.__sess = None
        self.__all_tensor_names = []

    @property
    def is_initialized(self):
        return self.__sess is not None

    @staticmethod
    def read_labels_from_pbtxt(path):
        from re import findall, MULTILINE
        regex = r"(?<=\w:\')(\w+)(?=\')"
        with open(path, 'r') as f:
            return findall(regex, f.read(), MULTILINE)

    def __init_graph(self, frozen_model_path):  # TODO Pass name to def
        if TRT_EXEC:
            if not Path(frozen_model_path).stem.endswith('trt'):
                frozen_model_path = self.create_trt_graph(frozen_model_path)
        with self.__detection_graph.as_default():
            od_graph_def = tf.GraphDef()
            with tf.gfile.GFile(frozen_model_path, 'rb') as fid:
                od_graph_def.ParseFromString(fid.read())
                tf.import_graph_def(od_graph_def, name='')

    def init_session(self, config=None):
        if config is None:
            config = self.get_tf_config()
        with self.__detection_graph.as_default() as graph:
            self.__sess = tf.Session(graph=graph, config=config)

    def dry_run(self):
        start = time()

        try:
            shape = (self.__input_size[1], self.__input_size[0], self.__input_size[2])
            return self.predict([np.zeros(shape) for i in range(self.__max_batch_size)])
        finally:
            self.logger.info(f"Dry run for {type(self).__name__} executed in {time() - start} s")

    def close_session(self):
        try:
            if self.__sess is not None:
                self.__sess.close()
        except AttributeError:
            self.logger.warning("Session not initialized, nothing to clean")

    def __get_in_out_nodes(self, frozen_graph_path):
        config_file_path = os.path.join(Path(frozen_graph_path).parent, Path(frozen_graph_path).stem + '.json')
        if os.path.exists(config_file_path):
            with open(config_file_path, 'r') as json_file:
                data = json.load(json_file)
                self.__image_tensor = data['input_names'][0]
                self.__output_names = data['output_names']
        else:
            self.logger.warning(
                f'{config_file_path} don\'t exist using default {self.__output_names} and {self.__image_tensor}')

    def create_trt_graph(self, frozen_graph_path, frozen_trt_graph_path=None):
        if not TRT_EXEC:
            self.logger.warning(f'Using Legacy tensorflow graph, things might be slower')
            return frozen_graph_path
        elif frozen_trt_graph_path is None:
            frozen_trt_graph_path = os.path.join(Path(frozen_graph_path).parent,
                                                 Path(frozen_graph_path).stem + 'trt.pb')

        frozen_graph = tf.GraphDef()

        if os.path.exists(frozen_trt_graph_path):
            return frozen_trt_graph_path

        with open(frozen_graph_path, 'rb') as f:
            frozen_graph.ParseFromString(f.read())

        trt_graph = trt.create_inference_graph(
            input_graph_def=frozen_graph,
            outputs=self.__output_names,
            max_batch_size=self.__max_batch_size,
            # max_workspace_size_bytes=1 << 25
            precision_mode=self.__precision_mode,
            minimum_segment_size=50)

        with tf.gfile.GFile(frozen_trt_graph_path, "wb") as f:
            f.write(trt_graph.SerializeToString())
        return frozen_trt_graph_path

    @staticmethod
    def get_tf_config(gpu_count: int = GPU_COUNT, gpu_per_process_gpu_memory_fraction: float = .2,
                      dynamic_memory_alocation: bool = False) -> tf.ConfigProto:
        config = tf.ConfigProto(device_count={'GPU': gpu_count})
        if gpu_count > 0:
            if not dynamic_memory_alocation:
                config.gpu_options.per_process_gpu_memory_fraction = gpu_per_process_gpu_memory_fraction
            else:
                config.gpu_options.allow_growth = dynamic_memory_alocation
        return config

    def predict(self, inputs, with_padding=True):
        if type(inputs) is list:
            ln = len(inputs)
            mismatch = ln - self.__max_batch_size
            if mismatch != 0:
                self.logger.info(f"Input size mismatch {mismatch} from {self.__max_batch_size} adjusting")
                if mismatch < 0:
                    for _ in range(-mismatch):
                        inputs.append(np.zeros(self.__input_size))
                else:
                    output_dicts = []
                    for i in range(0, ln, self.__max_batch_size):
                        output_dicts.extend(self.predict(inputs[i:i + self.__max_batch_size]))
                    return output_dicts
            if with_padding:
                for i, inp in enumerate(inputs):
                    shape = (self.__input_size[1], self.__input_size[0], self.__input_size[2])
                    inputs[i] = self.pad_with_zeros(inp, shape)

            return self.run_inference_for_multiple_images(inputs)
        else:
            if with_padding:
                inputs = self.pad_with_zeros(inputs, self.__input_size)
            return self.run_inference_for_single_image(inputs)

    @staticmethod
    def pad_with_zeros(input, target):
        if input is None:
            return np.zeros(target)
        a = np.argmax(input.shape)
        dy = target[a] / input.shape[a]
        if a == 0:
            x = cv2.resize(input, None, fx=dy, fy=dy)
            diff = (target[1] - x.shape[1])
            return np.pad(x, ((0, 0), (0, diff), (0, 0)), mode='constant', constant_values=0)
        if a == 1:
            x = cv2.resize(input, None, fx=dy, fy=dy)
            diff = (target[0] - x.shape[0])
            return np.pad(x, ((0, diff), (0, 0), (0, 0)), mode='constant', constant_values=0)

    def run_inference_for_multiple_images(self, images) -> list:
        with self.__detection_graph.as_default():
            with self.__sess.as_default() as sess:
                if len(self.__all_tensor_names) == 0:
                    ops = tf.get_default_graph().get_operations()
                    self.__all_tensor_names = {output.name for op in ops for output in op.outputs}
                tensor_dict = {}
                for key in self.__output_names:
                    self.__get_tensor_key(key, tensor_dict)
                image_tensor = tf.get_default_graph().get_tensor_by_name(self.__image_tensor + ':0')
                output_dict = sess.run(tensor_dict, feed_dict={image_tensor: np.array(images)})
                output_dicts = []
                for i in range(0, len(output_dict[NUM_DETECTIONS])):
                    out_dict = {NUM_DETECTIONS: int(output_dict[NUM_DETECTIONS][i]),
                                DETECTION_CLASSES: output_dict[DETECTION_CLASSES][i].astype(np.uint8),
                                DETECTION_BOXES: output_dict[DETECTION_BOXES][i],
                                DETECTION_SCORES: output_dict[DETECTION_SCORES][i]}
                    if DETECTION_MASKS in output_dict:
                        output_dict[DETECTION_MASKS] = output_dict[DETECTION_MASKS][i]
                    output_dicts.append(out_dict)

        return output_dicts

    def __get_tensor_key(self, key, tensor_dict):
        tensor_name = key + ':0'
        if tensor_name in self.__all_tensor_names:
            tensor_dict[key] = tf.get_default_graph().get_tensor_by_name(
                tensor_name)

    def run_inference_for_single_image(self, image, **kwargs):
        with self.__detection_graph.as_default():
            with self.__sess.as_default() as sess:
                if len(self.__all_tensor_names) == 0:
                    ops = tf.get_default_graph().get_operations()
                    self.__all_tensor_names = {output.name for op in ops for output in op.outputs}
                tensor_dict = {}
                for key in self.__output_names:
                    tensor_name = key + ':0'
                    if tensor_name in self.__all_tensor_names:
                        self.__get_tensor_key(key, tensor_dict)

                if image.shape is None or image.shape[0] == 0:
                    return

                image_tensor = tf.get_default_graph().get_tensor_by_name(self.__image_tensor + ':0')
                output_dict = sess.run(tensor_dict, feed_dict={image_tensor: np.expand_dims(image, 0)})
                output_dict[NUM_DETECTIONS] = int(output_dict[NUM_DETECTIONS][0])
                output_dict[DETECTION_CLASSES] = output_dict[DETECTION_CLASSES][0].astype(np.uint8)
                output_dict[DETECTION_BOXES] = output_dict[DETECTION_BOXES][0]
                output_dict[DETECTION_SCORES] = output_dict[DETECTION_SCORES][0]
                if DETECTION_MASKS in output_dict:
                    output_dict[DETECTION_MASKS] = output_dict[DETECTION_MASKS][0]
        return output_dict

    def get_name(self):
        return self.name

    def __del__(self):
        self.__detection_graph = None
        self.__all_tensor_names = None
