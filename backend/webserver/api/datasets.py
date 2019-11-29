import datetime
import json
import logging
import os
from threading import Thread

from database import (
    ImageModel,
    DatasetModel,
    CategoryModel,
    AnnotationModel,
    ExportModel
)
from flask import request
from flask_login import login_required, current_user
from flask_restplus import Namespace, Resource, reqparse
from google_images_download import google_images_download as gid
from mongoengine.errors import NotUniqueError
from werkzeug.datastructures import FileStorage

from ..util import query_util, coco_util, profile
from ..util.pagination_util import Pagination

logger = logging.getLogger('gunicorn.error')
api = Namespace('dataset', description='Dataset related operations')


dataset_create = reqparse.RequestParser()
dataset_create.add_argument('name', required=True)
dataset_create.add_argument('categories', type=list, required=False, location='json',
                            help="List of default categories for sub images")

page_data = reqparse.RequestParser()
page_data.add_argument('page', default=1, type=int)
page_data.add_argument('limit', default=20, type=int)
page_data.add_argument('folder', default='', help='Folder for data')
page_data.add_argument('order', default='file_name', help='Order to display images')

delete_data = reqparse.RequestParser()
delete_data.add_argument('fully', default=False, type=bool,
                         help="Fully delete dataset (no undo)")

coco_upload = reqparse.RequestParser()
coco_upload.add_argument('coco', location='files', type=FileStorage, required=False, help='Json coco', action='append')

path_string = reqparse.RequestParser()
path_string.add_argument('path_string', type=str, required=False, help='Path to labels ')

export = reqparse.RequestParser()
export.add_argument('categories', type=str, default=None, required=False, help='Ids of categories to export')
export.add_argument('export_format', type=str, default=None, required=False, help='Format of expected export')
export.add_argument('validation_size', type=int, default=None, required=False, help='Size of validation dataset')
export.add_argument('testing_size', type=int, default=None, required=False, help='Size of testing dataset')
export.add_argument('tfrecord_train_num_shards', type=int, default=1, required=False, help='Size of training dataset')
export.add_argument('tfrecord_val_num_shards', type=int, default=1, required=False, help='Size of validation dataset')
export.add_argument('tfrecord_test_num_shards', type=int, default=1, required=False, help='Size of testing dataset')


update_dataset = reqparse.RequestParser()
update_dataset.add_argument('categories', location='json', type=list, help="New list of categories")
update_dataset.add_argument('default_annotation_metadata', location='json', type=dict,
                            help="Default annotation metadata")

dataset_generate = reqparse.RequestParser()
dataset_generate.add_argument('keywords', location='json', type=list, default=[],
                              help="Keywords associated with images")
dataset_generate.add_argument('limit', location='json', type=int, default=100, help="Number of images per keyword")

share = reqparse.RequestParser()
share.add_argument('users', location='json', type=list, default=[], help="List of users")


@api.route('/')
class Dataset(Resource):
    @login_required
    def get(self):
        """ Returns all datasets """
        return query_util.fix_ids(current_user.datasets.filter(deleted=False).all())

    @api.expect(dataset_create)
    @login_required
    def post(self):
        """ Creates a dataset """
        args = dataset_create.parse_args()
        name = args['name']
        categories = args.get('categories', [])

        category_ids = CategoryModel.bulk_create(categories)

        try:
            dataset = DatasetModel(name=name, categories=category_ids)
            dataset.save()
        except NotUniqueError:
            return {'message': 'Dataset already exists. Check the undo tab to fully delete the dataset.'}, 400

        return query_util.fix_ids(dataset)


def download_images(output_dir, args):
    for keyword in args['keywords']:
        response = gid.googleimagesdownload()
        response.download({
            "keywords": keyword,
            "limit": args['limit'],
            "output_directory": output_dir,
            "no_numbering": True,
            "format": "jpg",
            "type": "photo",
            "print_urls": False,
            "print_paths": False,
            "print_size": False
        })


@api.route('/<int:dataset_id>/generate')
class DatasetGenerate(Resource):
    @api.expect(dataset_generate)
    @login_required
    def post(self, dataset_id):
        """ Adds images found on google to the dataset """
        args = dataset_generate.parse_args()

        dataset = current_user.datasets.filter(id=dataset_id, deleted=False).first()
        if dataset is None:
            return {"message": "Invalid dataset id"}, 400

        if not dataset.is_owner(current_user):
            return {"message": "You do not have permission to download the dataset's annotations"}, 403

        thread = Thread(target=download_images, args=(dataset.directory, args))
        thread.start()

        return {"success": True}


@api.route('/<int:dataset_id>/users')
class DatasetMembers(Resource):

    @login_required
    def get(self, dataset_id):
        """ All users in the dataset """
        args = dataset_generate.parse_args()

        dataset = current_user.datasets.filter(id=dataset_id, deleted=False).first()
        if dataset is None:
            return {"message": "Invalid dataset id"}, 400

        users = dataset.get_users()
        return query_util.fix_ids(users)


@api.route('/<int:dataset_id>/reset/metadata')
class DatasetCleanMeta(Resource):

    @login_required
    def get(self, dataset_id):
        """ All users in the dataset """
        args = dataset_generate.parse_args()

        dataset = current_user.datasets.filter(id=dataset_id, deleted=False).first()
        if dataset is None:
            return {"message": "Invalid dataset id"}, 400

        AnnotationModel.objects(dataset_id=dataset.id)\
            .update(metadata=dataset.default_annotation_metadata)
        ImageModel.objects(dataset_id=dataset.id)\
            .update(metadata={})

        return {'success': True}


@api.route('/<int:dataset_id>/reset/annotations')
class DatasetCleanAnnotations(Resource):

    @login_required
    def get(self, dataset_id):
        args = dataset_generate.parse_args()

        dataset = current_user.datasets.filter(id=dataset_id, deleted=False).first()
        if dataset is None:
            return {"message": "Invalid dataset id"}, 400

        logger.info(f"Cleaning Annotations")

        AnnotationModel.objects(dataset_id=dataset.id).delete()

        logger.info("Refreshing Images")
        ImageModel.objects(dataset_id=dataset.id).update(
            set__annotated=False,
            set__num_annotations=0
        )

        return {'success': True}


@api.route('/<int:dataset_id>/stats')
class DatasetStats(Resource):

    @login_required
    def get(self, dataset_id):
        """ All users in the dataset """
        args = dataset_generate.parse_args()

        dataset = current_user.datasets.filter(id=dataset_id, deleted=False).first()
        if dataset is None:
            return {"message": "Invalid dataset id"}, 400

        images = ImageModel.objects(dataset_id=dataset.id, deleted=False)
        annotated_images = images.filter(annotated=True)
        annotations = AnnotationModel.objects(dataset_id=dataset_id, deleted=False)

        # Calculate annotation counts by category in this dataset
        category_count = dict()
        image_category_count = dict()
        for category in dataset.categories:

            # Calculate the annotation count in the current category in this dataset
            cat_name = CategoryModel.objects(id=category).first()['name']
            cat_count = AnnotationModel.objects(dataset_id=dataset_id, category_id=category, deleted=False).count()
            category_count.update({str(cat_name): cat_count})

            # Calculate the annotated images count in the current category in this dataset
            image_count = len(AnnotationModel.objects(dataset_id=dataset_id, category_id=category, deleted=False).distinct('image_id'))
            image_category_count.update({str(cat_name): image_count})

        stats = {
            'total': {
                'Users': dataset.get_users().count(),
                'Images': images.count(),
                'Annotated Images': annotated_images.count(),
                'Annotations': annotations.count(),
                'Categories': len(dataset.categories),
                'Time Annotating (s)': (images.sum('milliseconds') or 0) / 1000
            },
            'average': {
                'Image Size (px)': images.average('width'),
                'Image Height (px)': images.average('height'),
                'Annotation Area (px)': annotations.average('area'),
                'Time (ms) per Image': images.average('milliseconds') or 0,
                'Time (ms) per Annotation': annotations.average('milliseconds') or 0
            },
            'categories': category_count,
            'images_per_category': image_category_count
        }
        return stats


@api.route('/<int:dataset_id>')
class DatasetId(Resource):

    @login_required
    def delete(self, dataset_id):
        """ Deletes dataset by ID (only owners)"""

        dataset = DatasetModel.objects(id=dataset_id, deleted=False).first()

        if dataset is None:
            return {"message": "Invalid dataset id"}, 400

        if not current_user.can_delete(dataset):
            return {"message": "You do not have permission to delete the dataset"}, 403

        dataset.update(set__deleted=True, set__deleted_date=datetime.datetime.now())
        return {"success": True}

    @api.expect(update_dataset)
    def post(self, dataset_id):

        """ Updates dataset by ID """

        dataset = current_user.datasets.filter(id=dataset_id, deleted=False).first()
        if dataset is None:
            return {"message": "Invalid dataset id"}, 400

        args = update_dataset.parse_args()
        categories = args.get('categories')
        default_annotation_metadata = args.get('default_annotation_metadata')
        set_default_annotation_metadata = args.get('set_default_annotation_metadata')

        if categories is not None:
            dataset.categories = CategoryModel.bulk_create(categories)

        if default_annotation_metadata is not None:

            update = {}
            for key, value in default_annotation_metadata.items():
                if key not in dataset.default_annotation_metadata:
                    update[f'set__metadata__{key}'] = value

            dataset.default_annotation_metadata = default_annotation_metadata

            if len(update.keys()) > 0:
                AnnotationModel.objects(dataset_id=dataset.id, deleted=False)\
                    .update(**update)

        dataset.update(
            categories=dataset.categories,
            default_annotation_metadata=dataset.default_annotation_metadata
        )

        return {"success": True}


@api.route('/<int:dataset_id>/share')
class DatasetIdShare(Resource):
    @api.expect(share)
    @login_required
    def post(self, dataset_id):
        args = share.parse_args()

        dataset = current_user.datasets.filter(id=dataset_id, deleted=False).first()
        if dataset is None:
            return {"message": "Invalid dataset id"}, 400

        if not dataset.is_owner(current_user):
            return {"message": "You do not have permission to share this dataset"}, 403

        dataset.update(users=args.get('users'))

        return {"success": True}


@api.route('/data')
class DatasetData(Resource):
    @api.expect(page_data)
    @login_required
    def get(self):
        """ Endpoint called by dataset viewer client """

        args = page_data.parse_args()
        limit = args['limit']
        page = args['page']
        folder = args['folder']

        datasets = current_user.datasets.filter(deleted=False)
        pagination = Pagination(datasets.count(), limit, page)
        datasets = datasets[pagination.start:pagination.end]

        datasets_json = []
        for dataset in datasets:
            dataset_json = query_util.fix_ids(dataset)
            images = ImageModel.objects(dataset_id=dataset.id, deleted=False)

            dataset_json['numberImages'] = images.count()
            dataset_json['numberAnnotated'] = images.filter(annotated=True).count()
            dataset_json['permissions'] = dataset.permissions(current_user)

            first = images.first()
            if first is not None:
                dataset_json['first_image_id'] = images.first().id
            datasets_json.append(dataset_json)

        return {
            "pagination": pagination.export(),
            "folder": folder,
            "datasets": datasets_json,
            "categories": query_util.fix_ids(current_user.categories.filter(deleted=False).all())
        }

@api.route('/<int:dataset_id>/data')
class DatasetDataId(Resource):

    @profile
    @api.expect(page_data)
    @login_required
    def get(self, dataset_id):
        """ Endpoint called by image viewer client """

        parsed_args = page_data.parse_args()
        per_page = parsed_args.get('limit')
        page = parsed_args.get('page') - 1
        folder = parsed_args.get('folder')
        order = parsed_args.get('order')

        args = dict(request.args)

        # Check if dataset exists
        dataset = current_user.datasets.filter(id=dataset_id, deleted=False).first()
        if dataset is None:
            return {'message', 'Invalid dataset id'}, 400

        # Make sure folder starts with is in proper format
        if len(folder) > 0:
            folder = folder[0].strip('/') + folder[1:]
            if folder[-1] != '/':
                folder = folder + '/'

        # Get directory
        directory = os.path.join(dataset.directory, folder)
        if not os.path.exists(directory):
            return {'message': 'Directory does not exist.'}, 400

        # Remove parsed arguments
        for key in parsed_args:
            args.pop(key, None)

        # Generate query from remaining arugments
        query = {}
        for key, value in args.items():
            lower = value.lower()
            if lower in ["true", "false"]:
                value = json.loads(lower)

            if len(lower) != 0:
                query[key] = value

        images = current_user.images \
            .filter(dataset_id=dataset_id, path__startswith=directory, deleted=False, **query) \
            .order_by(order).only('id', 'file_name', 'annotating', 'annotated', 'num_annotations')

        total = images.count()
        pages = int(total/per_page) + 1

        images = images.skip(page*per_page).limit(per_page)
        images_json = query_util.fix_ids(images)
        subdirectories = [f for f in sorted(os.listdir(directory))
                          if os.path.isdir(directory + f) and not f.startswith('.')]

        categories = CategoryModel.objects(id__in=dataset.categories).only('id', 'name')

        return {
            "total": total,
            "per_page": per_page,
            "pages": pages,
            "page": page,
            "images": images_json,
            "folder": folder,
            "directory": directory,
            "dataset": query_util.fix_ids(dataset),
            "categories": query_util.fix_ids(categories),
            "subdirectories": subdirectories
        }


@api.route('/<int:dataset_id>/exports')
class DatasetExports(Resource):

    @login_required
    def get(self, dataset_id):
        """ Returns exports of images and annotations in the dataset (only owners) """
        dataset = current_user.datasets.filter(id=dataset_id).first()

        if dataset is None:
            return {"message": "Invalid dataset ID"}, 400

        if not current_user.can_download(dataset):
            return {"message": "You do not have permission to download the dataset's annotations"}, 403

        exports = ExportModel.objects(dataset_id=dataset.id).order_by('-created_at').limit(50)

        dict_export = []
        for export in exports:
            # file_path = export.path
            extension = str(export.path).split(".")[-1]
            time_delta = datetime.datetime.utcnow() - export.created_at
            dict_export.append({
                'id': export.id,
                'ago': query_util.td_format(time_delta),
                'tags': export.tags,
                "extension": extension
            })

        return dict_export


@api.route('/<int:dataset_id>/export')
class DatasetExport(Resource):

    @api.expect(export)
    @login_required
    def get(self, dataset_id):

        args = export.parse_args()
        categories = args.get('categories')
        export_format = args.get('export_format')
        validation_size = args.get('validation_size')
        testing_size = args.get('testing_size')
        tfrecord_train_num_shards = args.get('tfrecord_train_num_shards')
        tfrecord_val_num_shards = args.get('tfrecord_val_num_shards')
        tfrecord_test_num_shards = args.get('tfrecord_test_num_shards')
        logger.info(f"Export format: {export_format}")

        if len(categories) == 0:
            categories = []

        if len(categories) > 0 or isinstance(categories, str):
            categories = [int(c) for c in categories.split(',')]

        dataset = DatasetModel.objects(id=dataset_id).first()

        if not dataset:
            return {'message': 'Invalid dataset ID'}, 400
        if export_format == "coco":
            return dataset.export_coco(categories=categories)
        elif export_format == "tfrecord":
            return dataset.export_tf_record(train_shards=tfrecord_train_num_shards, val_shards=tfrecord_val_num_shards,
                                            test_shards=tfrecord_test_num_shards,
                                            categories=categories, validation_set_size=validation_size,
                                            testing_set_size=testing_size)
        else:
            logger.info("Unknown format")

    @api.expect(coco_upload)
    @login_required
    def post(self, dataset_id):
        """ Adds coco formatted annotations to the dataset """
        args = coco_upload.parse_args()
        coco = args['coco']
        logger.info("Loading ")

        dataset = current_user.datasets.filter(id=dataset_id).first()
        if dataset is None:
            return {'message': 'Invalid dataset ID'}, 400

        return dataset.import_coco(json.load(coco))


@api.route('/<int:dataset_id>/coco')
class DatasetCoco(Resource):

    @login_required
    def get(self, dataset_id):
        """ Returns coco of images and annotations in the dataset (only owners) """
        dataset = current_user.datasets.filter(id=dataset_id).first()

        if dataset is None:
            return {"message": "Invalid dataset ID"}, 400

        if not current_user.can_download(dataset):
            return {"message": "You do not have permission to download the dataset's annotations"}, 403

        return coco_util.get_dataset_coco(dataset)

    @api.expect(coco_upload)
    @login_required
    def post(self, dataset_id):
        """ Adds coco formatted annotations to the dataset """
        args = coco_upload.parse_args()
        coco = args['coco']
        args = path_string.parse_args()
        path = args['path_string']

        dataset = current_user.datasets.filter(id=dataset_id).first()
        if dataset is None:
            return {'message': 'Invalid dataset ID'}, 400

        if coco==None and path != '/datasets/':
            return dataset.import_coco(path)

        # Decoding from File Storage format to json strings
        coco_json_files = []
        for file_storage in coco:
            coco_json_bytes = file_storage.read()
            coco_json_string = coco_json_bytes.decode('utf-8')
            coco_json_files.append(coco_json_string)

        return dataset.import_coco_from_json_files(coco_json_files)


@api.route('/coco/<int:import_id>')
class DatasetCocoId(Resource):

    @login_required
    def get(self, import_id):
        """ Returns current progress and errors of a coco import """
        coco_import = CocoImportModel.objects(
            id=import_id, creator=current_user.username).first()

        if not coco_import:
            return {'message': 'No such coco import'}, 400

        return {
            "progress": coco_import.progress,
            "errors": coco_import.errors
        }


@api.route('/<int:dataset_id>/scan')
class DatasetScan(Resource):

    @login_required
    def get(self, dataset_id):

        dataset = DatasetModel.objects(id=dataset_id).first()

        if not dataset:
            return {'message': 'Invalid dataset ID'}, 400

        return dataset.scan()

