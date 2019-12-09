# Copyright 2017 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

r"""Convert raw COCO dataset to TFRecord for object_detection.

Please note that this tool creates sharded output files.

Example usage:
    python create_coco_tf_record.py --logtostderr \
      --train_image_dir="${TRAIN_IMAGE_DIR}" \
      --train_annotations_file="${TRAIN_ANNOTATIONS_FILE}" \
      --output_dir="${OUTPUT_DIR}"
      --val_size = SIZE_OF_WANTED_VAL_DATASET
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import hashlib
import io
import json
import os
import random
from itertools import islice

import PIL.Image
import contextlib2
import numpy as np
import tensorflow as tf
from pycocotools import mask
from workers.lib.tf_models import dataset_util
from workers.lib.tf_models import label_map_util
from workers.lib.tf_models import tf_record_creation_util


def create_tf_example(image,
                      annotations_list,
                      image_dir,
                      category_index,
                      include_masks=False):
    """Converts image and annotations to a tf.Example proto.

    Args:
      image: dict with keys:
        [u'license', u'file_name', u'coco_url', u'height', u'width',
        u'date_captured', u'flickr_url', u'id']
      annotations_list:
        list of dicts with keys:
        [u'segmentation', u'area', u'iscrowd', u'image_id',
        u'bbox', u'category_id', u'id']
        Notice that bounding box coordinates in the official COCO dataset are
        given as [x, y, width, height] tuples using absolute coordinates where
        x, y represent the top-left (0-indexed) corner.  This function converts
        to the format expected by the Tensorflow Object Detection API (which is
        which is [ymin, xmin, ymax, xmax] with coordinates normalized relative
        to image size).
      image_dir: directory containing the image files.
      category_index: a dict containing COCO category information keyed
        by the 'id' field of each category.  See the
        label_map_util.create_category_index function.
      include_masks: Whether to include instance segmentations masks
        (PNG encoded) in the result. default: False.
    Returns:
      example: The converted tf.Example
      num_annotations_skipped: Number of (invalid) annotations that were ignored.

    Raises:
      ValueError: if the image pointed to by data['filename'] is not a valid JPEG
    """
    image_height = image["height"]
    image_width = image["width"]
    filename = image["file_name"]
    image_id = image["id"]

    full_path = image["path"]
    with tf.gfile.GFile(full_path, "rb") as fid:
        encoded_jpg = fid.read()
    encoded_jpg_io = io.BytesIO(encoded_jpg)
    image = PIL.Image.open(encoded_jpg_io)
    key = hashlib.sha256(encoded_jpg).hexdigest()

    xmin = []
    xmax = []
    ymin = []
    ymax = []
    is_crowd = []
    category_names = []
    category_ids = []
    area = []
    encoded_mask_png = []
    num_annotations_skipped = 0
    for object_annotations in annotations_list:
        (x, y, width, height) = tuple(object_annotations["bbox"])
        if width <= 0 or height <= 0:
            num_annotations_skipped += 1
            continue
        if x + width > image_width or y + height > image_height:
            num_annotations_skipped += 1
            continue
        xmin.append(float(x) / image_width)
        xmax.append(float(x + width) / image_width)
        ymin.append(float(y) / image_height)
        ymax.append(float(y + height) / image_height)
        is_crowd.append(object_annotations["iscrowd"])
        category_id = int(object_annotations["category_id"])
        category_ids.append(category_id)
        category_names.append(category_index[category_id]["name"].encode("utf8"))
        area.append(object_annotations["area"])

        if include_masks:
            run_len_encoding = mask.frPyObjects(object_annotations["segmentation"],
                                                image_height, image_width)
            binary_mask = mask.decode(run_len_encoding)
            if not object_annotations["iscrowd"]:
                binary_mask = np.amax(binary_mask, axis=2)
            pil_image = PIL.Image.fromarray(binary_mask)
            output_io = io.BytesIO()
            pil_image.save(output_io, format="PNG")
            encoded_mask_png.append(output_io.getvalue())
    feature_dict = {
        "image/height":
            dataset_util.int64_feature(image_height),
        "image/width":
            dataset_util.int64_feature(image_width),
        "image/filename":
            dataset_util.bytes_feature(filename.encode("utf8")),
        "image/source_id":
            dataset_util.bytes_feature(str(image_id).encode("utf8")),
        "image/key/sha256":
            dataset_util.bytes_feature(key.encode("utf8")),
        "image/encoded":
            dataset_util.bytes_feature(encoded_jpg),
        "image/format":
            dataset_util.bytes_feature("jpeg".encode("utf8")),
        "image/object/bbox/xmin":
            dataset_util.float_list_feature(xmin),
        "image/object/bbox/xmax":
            dataset_util.float_list_feature(xmax),
        "image/object/bbox/ymin":
            dataset_util.float_list_feature(ymin),
        "image/object/bbox/ymax":
            dataset_util.float_list_feature(ymax),
        "image/object/class/text":
            dataset_util.bytes_list_feature(category_names),
        "image/object/is_crowd":
            dataset_util.int64_list_feature(is_crowd),
        "image/object/area":
            dataset_util.float_list_feature(area),
    }
    if include_masks:
        feature_dict["image/object/mask"] = (
            dataset_util.bytes_list_feature(encoded_mask_png))
    example = tf.train.Example(features=tf.train.Features(feature=feature_dict))
    return key, example, num_annotations_skipped


def _create_tf_record_from_coco_annotations(
        task, groundtruth_data, dataset_dir, output_path, include_masks, num_shards):
    """Loads COCO annotation json files and converts to tf.Record format.

    Args:
      groundtruth_data: JSON file containing bounding box annotations.
      dataset_dir: Directory containing the dataset.
      output_path: Path to output tf.Record file.
      include_masks: Whether to include instance segmentations masks
        (PNG encoded) in the result. default: False.
      num_shards: number of output file shards.
    """
    with contextlib2.ExitStack() as tf_record_close_stack:
        output_tfrecords, results_paths = tf_record_creation_util.open_sharded_output_tfrecords(
            tf_record_close_stack, output_path, num_shards)
        images = groundtruth_data["images"]
        category_index = label_map_util.create_category_index(
            groundtruth_data["categories"])

        annotations_index = {}
        if "annotations" in groundtruth_data:
            task.info(
                "Found groundtruth annotations. Building annotations index.")
            for annotation in groundtruth_data["annotations"]:
                image_id = annotation["image_id"]
                if image_id not in annotations_index:
                    annotations_index[image_id] = []
                annotations_index[image_id].append(annotation)
        missing_annotation_count = 0
        for image in images:
            image_id = image["id"]
            if image_id not in annotations_index:
                missing_annotation_count += 1
                annotations_index[image_id] = []
        task.info(f"{missing_annotation_count} images are missing annotations.")

        total_num_annotations_skipped = 0
        for idx, image in enumerate(images):
            if idx % 100 == 0:
                task.info(f"On image {idx} of {len(images)}")
            annotations_list = annotations_index[image["id"]]
            _, tf_example, num_annotations_skipped = create_tf_example(
                image, annotations_list, dataset_dir, category_index, include_masks)
            total_num_annotations_skipped += num_annotations_skipped
            shard_idx = idx % num_shards
            output_tfrecords[shard_idx].write(tf_example.SerializeToString())
        task.info(f"Finished writing, skipped {total_num_annotations_skipped} annotations.")

    return results_paths


def _split_dataset(annotations_file, val_size, test_size):
    groundtruth_data = json.loads(annotations_file)
    images = groundtruth_data["images"]
    annotations = groundtruth_data["annotations"]

    all_images_annotations = {img["id"]: {"image": img, "annotations": []} for img in images}
    for annotation in annotations:
        all_images_annotations[annotation["image_id"]]["annotations"].append(annotation)

    train_images_keys = list(all_images_annotations.keys())
    random.shuffle(train_images_keys)

    chunks_lengths = [len(train_images_keys)-val_size-test_size, val_size, test_size]
    keys_iterator = iter(train_images_keys)
    divided_keys = [list(islice(keys_iterator, elem)) for elem in chunks_lengths]
    # divided keys struct: [[train_keys], [val_keys], [test_keys]]

    train_data = {'images': [all_images_annotations[train_key]['image'] for train_key in divided_keys[0]],
                  'categories': groundtruth_data['categories'],
                  'annotations': [annot for train_key in divided_keys[0] for annot in
                                  all_images_annotations[train_key]['annotations']]}

    val_data = {'images': [all_images_annotations[val_key]['image'] for val_key in divided_keys[1]],
                'categories': groundtruth_data['categories'],
                'annotations': [annot for val_key in divided_keys[1] for annot in
                                all_images_annotations[val_key]['annotations']]}

    test_data = {'images': [all_images_annotations[test_key]['image'] for test_key in divided_keys[2]],
                 'categories': groundtruth_data['categories'],
                 'annotations': [annot for test_key in divided_keys[2] for annot in
                                 all_images_annotations[test_key]['annotations']]}

    return train_data, val_data, test_data


def convert_coco_to_tfrecord(dataset_dir, annotations_file, output_dir, val_size, test_size, task, train_shards,
                             val_shards, test_shards,
                             include_masks=False):
    assert dataset_dir, "`image_dir` missing."
    assert annotations_file, "`annotations_file` missing."
    assert output_dir, "`output_dir` missing."
    if val_size != 0:
        assert val_size, "`val_size` missing"
    if test_size != 0:
        assert test_size, "`test_size` missing"
    assert train_shards, "number of train shards missing"
    assert val_shards, "number of val shards missing"
    assert test_shards, "number of test shards missing"

    if not tf.gfile.IsDirectory(output_dir):
        tf.gfile.MakeDirs(output_dir)

    tfrecords_name = dataset_dir.split("/")[-1]
    train_output_path = os.path.join(output_dir, f"coco_train_{tfrecords_name}.record")
    val_output_path = os.path.join(output_dir, f"coco_val_{tfrecords_name}.record")
    test_output_path = os.path.join(output_dir, f"coco_test_{tfrecords_name}.record")

    task.info("Splitting data into train, validation and test sets")
    train_annotation, val_annotation, test_annotation = _split_dataset(annotations_file, val_size, test_size)

    task.info("Creating train set")
    train_files_path = _create_tf_record_from_coco_annotations(
        task,
        train_annotation,
        dataset_dir,
        train_output_path,
        include_masks,
        num_shards=train_shards)

    task.info("Creating validation set")
    val_files_path = _create_tf_record_from_coco_annotations(
        task,
        val_annotation,
        dataset_dir,
        val_output_path,
        include_masks,
        num_shards=val_shards)

    task.info("Creating test set")
    test_files_path = _create_tf_record_from_coco_annotations(
        task,
        test_annotation,
        dataset_dir,
        test_output_path,
        include_masks,
        num_shards=test_shards)

    tf_record_files_path = train_files_path + val_files_path + test_files_path
    return tf_record_files_path
