
import logging
import os

from config import Config
from flask_login import current_user
from mongoengine import *

from .tasks import TaskModel


class DatasetModel(DynamicDocument):
    
    id = SequenceField(primary_key=True)
    name = StringField(required=True, unique=True)
    directory = StringField()
    thumbnails = StringField()
    categories = ListField(default=[])

    owner = StringField(required=True)
    users = ListField(default=[])

    annotate_url = StringField(default="")

    default_annotation_metadata = DictField(default={})

    deleted = BooleanField(default=False)
    deleted_date = DateTimeField()

    def save(self, *args, **kwargs):

        directory = os.path.join(Config.DATASET_DIRECTORY, self.name + '/')
        os.makedirs(directory, mode=0o777, exist_ok=True)

        self.directory = directory
        self.owner = current_user.username if current_user else 'system'

        return super(DatasetModel, self).save(*args, **kwargs)

    def get_users(self):
        from .users import UserModel
    
        members = self.users
        members.append(self.owner)

        return UserModel.objects(username__in=members)\
            .exclude('password', 'id', 'preferences')

    def import_coco(self, coco_json):
        from workers.tasks import convert_dataset
        task = TaskModel(
            name="Convert input dataset",
            dataset_id=self.id,
            group="Annotation Conversion"
        )
        task.save()
        cel_task = convert_dataset.delay(task.id, self.id, coco_json, self.name)
        return {
            "celery_id": cel_task.id,
            "id": task.id,
            "name": task.name
        }

    def import_coco_from_json_files(self, coco_json_strings):
        from workers.tasks import load_annotation_files
        task = TaskModel(
            name="Load annotation files",
            dataset_id=self.id,
            group="Annotation Conversion"
        )
        task.save()
        cel_task = load_annotation_files.delay(task.id, self.id, coco_json_strings, self.name)

        return {
            "celery_id": cel_task.id,
            "id": task.id,
            "name": task.name
        }

    def export_coco(self, categories=None, style="COCO"):

        from workers.tasks import export_annotations

        if categories is None or len(categories) == 0:
            categories = self.categories

        task = TaskModel(
            name=f"Exporting {self.name} into {style} format",
            dataset_id=self.id,
            group="Annotation Export"
        )
        task.save()

        cel_task = export_annotations.delay(task.id, self.id, categories)

        return {
            "celery_id": cel_task.id,
            "id": task.id,
            "name": task.name
        }

    def export_tf_record(self, *, train_shards, val_shards, test_shards, categories=None, validation_set_size=0,
                         testing_set_size=0, style="TF Record"):

        from workers.tasks import export_annotations_to_tf_record

        if categories is None or len(categories) == 0:
            categories = self.categories

        task = TaskModel(
            name=f"Exporting {self.name} into {style} format",
            dataset_id=self.id,
            group="Annotation Export"
        )
        task.save()

        cel_task = export_annotations_to_tf_record.delay(task.id, self.id, categories, validation_set_size,
                                                         testing_set_size,
                                                         train_shards, val_shards, test_shards)

        return {
            "celery_id": cel_task.id,
            "id": task.id,
            "name": task.name
        }

    def scan(self):

        from workers.tasks import scan_dataset
        
        task = TaskModel(
            name=f"Scanning {self.name} for new images",
            dataset_id=self.id,
            group="Directory Image Scan"
        )
        task.save()
        
        cel_task = scan_dataset.delay(task.id, self.id)

        return {
            "celery_id": cel_task.id,
            "id": task.id,
            "name": task.name
        }

    def is_owner(self, user):

        if user.is_admin:
            return True
        
        return user.username.lower() == self.owner.lower()

    def can_download(self, user):
        return self.is_owner(user)

    def can_delete(self, user):
        return self.is_owner(user)
    
    def can_share(self, user):
        return self.is_owner(user)
    
    def can_generate(self, user):
        return self.is_owner(user)

    def can_edit(self, user):
        return user.username in self.users or self.is_owner(user)
    
    def permissions(self, user):
        return {
            'owner': self.is_owner(user),
            'edit': self.can_edit(user),
            'share': self.can_share(user),
            'generate': self.can_generate(user),
            'delete': self.can_delete(user),
            'download': self.can_download(user)
        }


__all__ = ["DatasetModel"]
