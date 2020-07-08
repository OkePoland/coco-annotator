import json
import os
import sys
import zipfile
from datetime import datetime

import numpy as np
from celery import shared_task
from database import (
    fix_ids,
    ImageModel,
    CategoryModel,
    AnnotationModel,
    DatasetModel,
    TaskModel,
    ExportModel
)
from workers.lib import convert_to_coco
from workers.lib.tf_models.create_tf_record_from_coco import convert_coco_to_tfrecord
from workers.lib.vod_converter.split_labels_from_json_string import split_coco_labels

from ..socket import create_socket


@shared_task
def export_annotations(task_id, dataset_id, categories):
    """
    Exports annotations from current dataset to single json file accessible from:
    Datasets->Chosen Dataset -> Exports
    """
    task = TaskModel.objects.get(id=task_id)
    dataset = DatasetModel.objects.get(id=dataset_id)
    task.update(status="PROGRESS")
    socket = create_socket()
    task.info("Beginning Export (COCO Format)")

    task.info("===== Getting COCO labels =====")
    coco, category_names = collect_coco_annotations(task, categories, dataset, socket)
    directory = f"{dataset.directory}.exports/"
    file_path = f"{directory}coco-{datetime.now().strftime('%m_%d_%Y__%H_%M_%S_%f')}.json"

    if not os.path.exists(directory):
        os.makedirs(directory)

    task.info(f"Writing export to file {file_path}")
    with open(file_path, 'w') as fp:
        json.dump(coco, fp)

    task.info("Creating export object")
    export = ExportModel(dataset_id=dataset.id, path=file_path, tags=["COCO", *category_names])
    export.save()
    task.set_progress(100, socket=socket)


@shared_task
def export_annotations_to_tf_record(task_id, dataset_id, categories, validation_set_size, test_set_size,
                                    train_shards_number, val_shards_number, test_shards_number):
    """
    Loads COCO annotations from chosen dataset, converts them to tf record format and exports them
    to a single ZIP file accessible from:
    Datasets->Chosen Dataset -> Exports
    """
    task = TaskModel.objects.get(id=task_id)
    dataset = DatasetModel.objects.get(id=dataset_id)
    task.update(status="PROGRESS")
    socket = create_socket()
    task.info("===== Beginning Export (TF Record Format) =====")

    # Getting coco annotations
    task.info("===== Getting COCO labels =====")
    coco, category_names = collect_coco_annotations(task, categories, dataset, socket)

    out_directory = f"{dataset.directory}.exports/"
    image_dir = f"{dataset.directory}"
    if not os.path.exists(out_directory):
        os.makedirs(out_directory)

    task.info("===== Converting to TF Record =====")
    task.info(f"Number of train shards: {train_shards_number}")
    task.info(f"Number of validation shards: {val_shards_number}")
    task.info(f"Number of test shards: {test_shards_number}")
    tf_records_files_path = convert_coco_to_tfrecord(image_dir, json.dumps(coco), out_directory, validation_set_size,
                                                     test_set_size, task, train_shards_number, val_shards_number,
                                                     test_shards_number, include_masks=True)
    task.info(f"Created {len(tf_records_files_path)} TF Record files")

    zip_path = f"{out_directory}tf_record_zip-{datetime.now().strftime('%m_%d_%Y__%H_%M_%S_%f')}.zip"
    task.info(f"Writing TF Records to zip file")
    with zipfile.ZipFile(zip_path, 'w') as zipObj:
        for tf_record_file in tf_records_files_path:
            zipObj.write(tf_record_file, os.path.basename(tf_record_file))
    # Clean exports
    for tf_record_file in tf_records_files_path:
        os.remove(tf_record_file)

    export = ExportModel(dataset_id=dataset.id, path=zip_path, tags=["TF Record", *category_names])
    export.save()
    task.set_progress(100, socket=socket)


def collect_coco_annotations(task, categories, dataset, socket):
    """
    Getting all coco labels from current dataset and creating a dict from it

    :return: COCO labels from current dataset as dict with fields: "images", "categories",
    "annotations".
    """
    # Getting coco annotations
    task.info("===== Getting COCO annotations =====")
    db_categories = CategoryModel.objects(id__in=categories, deleted=False) \
        .only(*CategoryModel.COCO_PROPERTIES)
    db_images = ImageModel.objects(deleted=False, dataset_id=dataset.id) \
        .only(*ImageModel.COCO_PROPERTIES)
    db_annotations = AnnotationModel.objects(deleted=False, category_id__in=categories)
    total_items = db_categories.count()

    coco = {
        'images': [],
        'categories': [],
        'annotations': []
    }

    total_items += db_images.count()
    progress = 0

    # iterate though all categoires and upsert
    category_names = []
    for category in fix_ids(db_categories):
        if len(category.get('keypoint_labels', [])) > 0:
            category['keypoints'] = category.pop('keypoint_labels', [])
            category['skeleton'] = category.pop('keypoint_edges', [])
        else:
            if 'keypoint_edges' in category:
                del category['keypoint_edges']
            if 'keypoint_labels' in category:
                del category['keypoint_labels']

        task.info(f"Adding category: {category.get('name')}")
        coco.get('categories').append(category)
        category_names.append(category.get('name'))
        progress += 1
        task.set_progress((progress / total_items) * 50, socket=socket)

    total_annotations = db_annotations.count()
    total_images = db_images.count()
    for img_counter, image in enumerate(fix_ids(db_images)):
        progress += 1
        task.set_progress((progress / total_items) * 50, socket=socket)

        annotations = db_annotations.filter(image_id=image.get('id')) \
            .only(*AnnotationModel.COCO_PROPERTIES)
        annotations = fix_ids(annotations)
        num_annotations = 0
        for annotation in annotations:
            has_keypoints = len(annotation.get('keypoints', [])) > 0
            has_segmentation = len(annotation.get('segmentation', [])) > 0

            if has_keypoints or has_segmentation:
                if not has_keypoints:
                    if 'keypoints' in annotation:
                        del annotation['keypoints']
                else:
                    arr = np.array(annotation.get('keypoints', []))
                    arr = arr[2::3]
                    annotation['num_keypoints'] = len(arr[arr > 0])
                num_annotations += 1
                coco.get('annotations').append(annotation)

        task.info(f"Exporting {num_annotations} annotations for image {image.get('id')} ({img_counter+1}/{total_images})")
        coco.get('images').append(image)
    task.info(f"Done export {total_annotations} annotations and {total_images} images from {dataset.name}")
    return coco, category_names


@shared_task
def import_annotations(task_id, dataset_id, encoded_coco_json):
    """
    Loading annotations from encoded json file with coco labels
    """
    coco_json = json.loads(encoded_coco_json)

    task = TaskModel.objects.get(id=task_id)
    dataset = DatasetModel.objects.get(id=dataset_id)
    task.update(status="PROGRESS")
    socket = create_socket()
    task.info("Beginning Import")

    images = ImageModel.objects(dataset_id=dataset.id)
    categories = CategoryModel.objects
    coco_images = coco_json.get('images', [])
    coco_annotations = coco_json.get('annotations', [])
    coco_categories = coco_json.get('categories', [])

    task.info(f"Importing {len(coco_categories)} categories, "
              f"{len(coco_images)} images, and "
              f"{len(coco_annotations)} annotations")
    total_items = sum([
        len(coco_categories),
        len(coco_annotations),
        len(coco_images)
    ])
    progress = 0
    task.info("===== Importing Categories =====")
    # category id mapping  ( file : database )
    categories_id = {}

    # Create any missing categories
    for category in coco_categories:
        category_name = category.get('name')
        category_id = category.get('id')
        category_model = categories.filter(name__iexact=category_name).first()

        # Checking if category already exists in Database Categories
        if category_model is None:
            task.warning(f"{category_name} category not found in Database Categories (creating a new one)")

            new_category = CategoryModel(
                name=category_name,
                keypoint_edges=category.get('skeleton', []),
                keypoint_labels=category.get('keypoints', [])
            )
            new_category.save()

            category_model = new_category
        else:
            task.info(f"{category_name} category already exists in Database Categories")

        # Checking if category already exists in current Dataset categories
        if category_model.id not in dataset.categories:
            task.warning(f"{category_name} category not found in Dataset categories (adding a new one)")
            dataset.categories.append(category_model.id)
        else:
            task.info(f"{category_name} category already exists in Dataset categories")

        # map category ids
        categories_id[category_id] = category_model.id

        # update progress
        progress += 1
        task.set_progress((progress / total_items) * 100, socket=socket)

    dataset.update(set__categories=dataset.categories)

    task.info("===== Loading Images =====")
    # image id mapping ( file: database )
    images_id = {}
    categories_by_image = {}
    total_images = len(coco_images)
    # Find all images
    for image_counter, image in enumerate(coco_images):
        image_id = image.get('id')
        image_filename = image.get('file_name')

        # update progress
        progress += 1
        task.set_progress((progress / total_items) * 100, socket=socket)

        image_model = images.filter(file_name__exact=image_filename).all()
        if len(image_model) == 0:
            task.warning(f"Could not find image {image_filename}")
            continue
        if len(image_model) > 1:
            task.error(f"Too many images found with the same file name: {image_filename}")
            continue

        task.info(f"Image {image_filename} found ({image_counter+1}/{total_images})")
        image_model = image_model[0]
        images_id[image_id] = image_model
        categories_by_image[image_id] = list()

    task.info("===== Import Annotations =====")
    total_annotations = len(coco_annotations)
    for annotation_counter, annotation in enumerate(coco_annotations):

        image_id = annotation.get('image_id')
        category_id = annotation.get('category_id')
        segmentation = annotation.get('segmentation', [])
        keypoints = annotation.get('keypoints', [])
        # is_crowd = annotation.get('iscrowed', False)
        area = annotation.get('area', 0)
        bbox = annotation.get('bbox', [0, 0, 0, 0])
        isbbox = annotation.get('isbbox', False)

        progress += 1
        task.set_progress((progress / total_items) * 100, socket=socket)

        has_segmentation = len(segmentation) > 0
        try:
            has_keypoints = len(keypoints) > 0
        except:
            has_keypoints = False
        if not has_segmentation and not has_keypoints:
            task.warning(f"Annotation {annotation.get('id')} has no segmentation or keypoints")
            continue

        try:
            image_model = images_id[image_id]
            category_model_id = categories_id[category_id]
            image_categories = categories_by_image[image_id]
        except KeyError:
            task.warning(f"Could not find image associated with annotation {annotation.get('id')}")
            continue

        annotation_model = AnnotationModel.objects(
            image_id=image_model.id,
            category_id=category_model_id,
            segmentation=segmentation,
            keypoints=keypoints
        ).first()

        if annotation_model is None:
            task.info(f"Creating annotation data ({image_id}, {category_id}) "
                      f"({annotation_counter+1}/{total_annotations})")

            annotation_model = AnnotationModel(image_id=image_model.id)
            annotation_model.category_id = category_model_id
            annotation_model.color = annotation.get('color')
            annotation_model.metadata = annotation.get('metadata', {})

            if has_segmentation:
                annotation_model.segmentation = segmentation
                annotation_model.area = area
                annotation_model.bbox = bbox
            if has_keypoints:
                annotation_model.keypoints = keypoints

            annotation_model.isbbox = isbbox
            annotation_model.save()

            image_categories.append(category_id)
        else:
            annotation_model.update(deleted=False, isbbox=isbbox)
            task.info(f"Annotation already exists (i:{image_id}, c:{category_id}) "
                      f"({annotation_counter+1}/{total_annotations})")

    for image_id in images_id:
        image_model = images_id[image_id]
        category_ids = categories_by_image[image_id]
        all_category_ids = list(image_model.category_ids)
        all_category_ids += category_ids

        image_model.update(
            set__annotated=True,
            set__category_ids=list(set(all_category_ids)),
            set__num_annotations=AnnotationModel.objects(image_id=image_model.id, area__gt=0, deleted=False).count()
        )

    task.set_progress(100, socket=socket)


@shared_task
def load_annotation_files(task_id, dataset_id, coco_json_strings, dataset_name):
    """
    Task loading single json file, splitting it if necessary and starting importing it on
    other workers
    """

    task = TaskModel.objects.get(id=task_id)
    max_json_string_size = 32000000

    task.update(status="PROGRESS")
    socket = create_socket()
    task.set_progress(0, socket=socket)

    task.info("===== Beginning Loading =====")
    total_files = len(coco_json_strings)
    for file_index, single_json_string in enumerate(coco_json_strings):

        task.info(f"===== Processing file nr {file_index} =====")
        task.info(f"Checking size of json string, max allowed size = {max_json_string_size}")
        json_string_size = sys.getsizeof(single_json_string)
        task.info(f"Current file size = {json_string_size}")

        if json_string_size > max_json_string_size:
            task.info("Json string to large")
            task.info("===== Splitting json string =====")
            list_of_json_strings = split_coco_labels(single_json_string,
                                                     max_byte_size=max_json_string_size, current_task=task)
        else:
            task.info("Correct size of json string")
            list_of_json_strings = [single_json_string]

        task.info("===== Outsourcing import annotations tasks to other workers =====")
        for substring_index, json_substring in enumerate(list_of_json_strings):
            task.info(f"Current subfile size = {sys.getsizeof(json_substring)}")
            load_annotations_task = TaskModel(
                name="Import COCO format into {}".format(dataset_name),
                dataset_id=dataset_id,
                group="Annotation Import"
            )
            load_annotations_task.save()
            task.info(f"Sending json subfile nr {substring_index} from file nr {file_index} to workers queue")
            cel_test_task = import_annotations.delay(load_annotations_task.id, dataset_id, json_substring)

        task.set_progress((file_index + 1) * 100 / total_files, socket=socket)
    task.set_progress(100, socket=socket)
    task.info("===== Finished =====")


@shared_task
def convert_dataset(task_id, dataset_id, coco_json, dataset_name):
    task = TaskModel.objects.get(id=task_id)
    max_json_string_size = 32000000

    task.update(status="PROGRESS")
    socket = create_socket()
    task.info("===== Beginning Conversion =====")
    task.set_progress(0, socket=socket)
    task.info('Trying to import your dataset...')
    coco_json, success = convert_to_coco(coco_json, task)

    if not success:
        task.info('Format not supported')
        task.set_progress(100, socket=socket)
        task.info("===== Finished =====")
        return
    task.set_progress(50, socket=socket)

    task.info(f"Checking size of json string, max size = {max_json_string_size}")
    json_string_size = sys.getsizeof(coco_json)
    task.info(f"Json string size = {json_string_size}")

    if json_string_size > max_json_string_size:
        task.info("Json string to large")
        task.info("===== Splitting json string =====")
        list_of_json_strings = split_coco_labels(coco_json, max_byte_size=max_json_string_size, current_task=task)
    else:
        task.info("Correct size of json string")
        list_of_json_strings = [coco_json]

    task.set_progress(75, socket=socket)

    task.info("===== Outsourcing import annotations tasks to other workers =====")
    for i, json_substring in enumerate(list_of_json_strings):
        load_annotations_task = TaskModel(
            name="Import COCO format into {}".format(dataset_name),
            dataset_id=dataset_id,
            group="Annotation Import"
        )
        load_annotations_task.save()
        task.info(f"Sending json subfile to worker {i}")
        cel_test_task = import_annotations.delay(load_annotations_task.id, dataset_id, json_substring)

    task.set_progress(100, socket=socket)
    task.info("===== Finished =====")


__all__ = ["export_annotations", "import_annotations", "convert_dataset", "export_annotations_to_tf_record",
           "load_annotation_files"]
