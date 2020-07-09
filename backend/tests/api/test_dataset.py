import json
from time import sleep
import os
import pytest


class TestDataset:

    @staticmethod
    def _get_inria_id(client, dataset_url):
        resp = client.get(dataset_url)
        resp = json.loads(resp.data)
        matched_elem = next((el for el in resp if el["name"] == "test_inria"), None)
        if matched_elem:
            return matched_elem["id"]

    @staticmethod
    def _get_inria_info(client, inria_id, dataset_url):
        url = os.path.join(dataset_url, str(inria_id), "stats")
        resp = client.get(url)
        respj = json.loads(resp.data)
        with open("dat_info", "w") as f:
            json.dump(respj, f)
        return resp, respj

    @pytest.mark.skip
    def test_create_dataset(self, client, dataset_url):
        data = {"name": "test_inria", "categories": ["person"]}
        resp = client.post(dataset_url, json=data)
        sleep(0.5)
        assert resp.status_code == 200

    def test_get_datasets(self, client, dataset_url):
        resp = client.get(dataset_url)
        assert resp.status_code == 200
        resp = json.loads(resp.data)
        assert isinstance(resp, list)

    @pytest.mark.skip
    def test_scan_dataset(self, client, dataset_url):
        inria_id = self._get_inria_id(client)
        url = os.path.join(dataset_url, str(inria_id), "scan")
        resp = client.get(url)
        sleep(0.5)
        assert resp.status_code == 200
        resp, respj = self._get_inria_info(client, inria_id)
        assert respj["total"]["Images"] == 5

    @pytest.mark.skip
    def test_import_by_path(self, client, dataset_url):
        inria_id = self._get_inria_id(client)
        url = os.path.join(dataset_url, str(inria_id), "coco")
        data = {"path_string": "/datasets/test_inria"}
        resp = client.post(url, json=data)
        sleep(2.5)
        assert resp.status_code == 200
        resp, respj = self._get_inria_info(client, inria_id)
        assert respj["total"]["Annotated Images"] == 5  # in case of failing this test, try to extend sleeping time
        assert respj["total"]["Annotations"] == 12

    @pytest.mark.skip
    def test_delete(self, client, dataset_url):
        inria_id = self._get_inria_id(client)
        url_dataset = os.path.join(dataset_url, str(inria_id))
        resp = client.delete(url_dataset)
        assert resp.status_code == 200
        url_undo = "/api/undo/"
        data = {"id": str(inria_id), "instance": "dataset"}
        resp = client.delete(url_undo, json=data)
        assert resp.status_code == 200
