from database import (
    fix_ids,
    ImageModel,
    CategoryModel,
    AnnotationModel,
    DatasetModel,
    TaskModel,
    ExportModel
)

# import pycocotools.mask as mask
import numpy as np
import time
import json
import logging
import sys
import os
import zipfile

from celery import shared_task
from ..socket import create_socket
from workers.lib import check_coco, convert_to_coco
from workers.lib.vod_converter.split_labels_from_json_string import split_coco_labels


@shared_task
def export_annotations(task_id, dataset_id, categories):
    task = TaskModel.objects.get(id=task_id)
    dataset = DatasetModel.objects.get(id=dataset_id)

    task.update(status="PROGRESS")
    socket = create_socket()

    task.info("Beginning Export (COCO Format)")

    db_categories = CategoryModel.objects(id__in=categories, deleted=False) \
        .only(*CategoryModel.COCO_PROPERTIES)
    db_images = ImageModel.objects(deleted=False, annotated=True, dataset_id=dataset.id) \
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
        task.set_progress((progress / total_items) * 100, socket=socket)

    total_annotations = db_annotations.count()
    total_images = db_images.count()
    for image in fix_ids(db_images):

        progress += 1
        task.set_progress((progress / total_items) * 100, socket=socket)

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

        task.info(f"Exporting {num_annotations} annotations for image {image.get('id')}")
        coco.get('images').append(image)

    task.info(f"Done export {total_annotations} annotations and {total_images} images from {dataset.name}")

    timestamp = time.time()
    directory = f"{dataset.directory}.exports/"
    file_path = f"{directory}coco-{timestamp}.json"

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
def export_annotations_to_tf_record(task_id, dataset_id, categories, validation_set_size):
    task = TaskModel.objects.get(id=task_id)
    dataset = DatasetModel.objects.get(id=dataset_id)

    task.update(status="PROGRESS")
    socket = create_socket()

    task.info("===== Beginning Export (TF Record Format) =====")

    # Getting coco annotations
    task.info("===== Getting COCO annotations =====")

    db_categories = CategoryModel.objects(id__in=categories, deleted=False) \
        .only(*CategoryModel.COCO_PROPERTIES)
    db_images = ImageModel.objects(deleted=False, annotated=True, dataset_id=dataset.id) \
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
        task.set_progress((progress / total_items) * 100, socket=socket)

    total_annotations = db_annotations.count()
    total_images = db_images.count()
    for image in fix_ids(db_images):

        progress += 1
        task.set_progress((progress / total_items) * 100, socket=socket)

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

        task.info(f"Exporting {num_annotations} annotations for image {image.get('id')}")
        coco.get('images').append(image)

    task.info(f"Done export {total_annotations} annotations and {total_images} images from {dataset.name}")

    # TODO: Convert COCO to TF Record


    timestamp = time.time()
    directory = f"{dataset.directory}.exports/"

    if not os.path.exists(directory):
        os.makedirs(directory)

    files_paths = []
    for i in range(5):

        file_path = f"{directory}file{i}_{timestamp}.txt"
        files_paths.append(file_path)
        task.info(f"Writing export to file {file_path}")
        with open(file_path, 'w') as fp:
            fp.write("abc")
            fp.write(str(validation_set_size))

        task.info("Creating export object")
        export = ExportModel(dataset_id=dataset.id, path=file_path, tags=["TF Record"])
        export.save()

    zip_path = f"{directory}tf_record_zip-{timestamp}.zip"
    with zipfile.ZipFile(zip_path, 'w') as zipObj:
        for file_path in files_paths:
            zipObj.write(file_path, os.path.basename(file_path))

    for file_path in files_paths:
        os.remove(file_path)

    export = ExportModel(dataset_id=dataset.id, path=zip_path, tags=["TF Record", *category_names])
    export.save()

    task.set_progress(100, socket=socket)


@shared_task
def import_annotations(task_id, dataset_id, encoded_coco_json):

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

        if category_model is None:
            task.warning(f"{category_name} category not found (creating a new one)")

            new_category = CategoryModel(
                name=category_name,
                keypoint_edges=category.get('skeleton', []),
                keypoint_labels=category.get('keypoints', [])
            )
            new_category.save()

            category_model = new_category
            dataset.categories.append(new_category.id)

        task.info(f"{category_name} category found")
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

    # Find all images
    for image in coco_images:
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

        task.info(f"Image {image_filename} found")
        image_model = image_model[0]
        images_id[image_id] = image_model
        categories_by_image[image_id] = list()

    task.info("===== Import Annotations =====")
    for annotation in coco_annotations:

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
        has_keypoints = len(keypoints) > 0
        if not has_segmentation and not has_keypoints:
            task.warning(f"Annotation {annotation.get('id')} has no segmentation or keypoints")
            continue

        try:
            image_model = images_id[image_id]
            category_model_id = categories_id[category_id]
            image_categories = categories_by_image[image_id]
        except KeyError:
            task.warning(f"Could not find image assoicated with annotation {annotation.get('id')}")
            continue

        annotation_model = AnnotationModel.objects(
            image_id=image_model.id,
            category_id=category_model_id,
            segmentation=segmentation,
            keypoints=keypoints
        ).first()

        if annotation_model is None:
            task.info(f"Creating annotation data ({image_id}, {category_id})")

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
            task.info(f"Annotation already exists (i:{image_id}, c:{category_id})")

    for image_id in images_id:
        image_model = images_id[image_id]
        category_ids = categories_by_image[image_id]
        all_category_ids = list(image_model.category_ids)
        all_category_ids += category_ids

        image_model.update(
            set__annotated=True,
            set__category_ids=list(set(all_category_ids)),
            set__num_annotations=AnnotationModel \
                .objects(image_id=image_id, area__gt=0, deleted=False).count()
        )

    task.set_progress(100, socket=socket)


@shared_task
def convert_dataset(task_id, dataset_id, coco_json, dataset_name):
    max_json_string_size = 20000000
    task = TaskModel.objects.get(id=task_id)
    dataset = DatasetModel.objects.get(id=dataset_id)

    task.update(status="PROGRESS")
    socket = create_socket()

    task.info("===== Beginning Conversion =====")
    # logger = logging.getLogger('gunicorn.error')
    task.set_progress(0, socket=socket)

    is_coco, coco_json = check_coco(coco_json)
    if not is_coco:
        task.info("Input dataset not in COCO, converting to COCO...")
        coco_json, _ = convert_to_coco(coco_json)
    else:
        task.info("Input dataset in COCO, uploading...")
    task.set_progress(50, socket=socket)

    task.info(f"Checking size of json string, max size = {max_json_string_size}")
    json_string_size = sys.getsizeof(coco_json)
    task.info(f"Json string size = {json_string_size}")

    if json_string_size > max_json_string_size:
        task.info("Json string to large")
        task.info("===== Splitting json string =====")
        list_of_json_strings = split_coco_labels(coco_json, max_byte_size=14000000)
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


__all__ = ["export_annotations", "import_annotations", "convert_dataset", "export_annotations_to_tf_record"]
