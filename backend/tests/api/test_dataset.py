import json
from time import sleep
import os
import pytest


class TestDataset:

    @staticmethod
    def _get_inria_id(client):
        url = "/api/dataset/"
        resp = client.get(url)
        resp = json.loads(resp.data)
        for el in resp:
            if el["name"] == "test_inria":
                return el["id"]

    @staticmethod
    def _get_inria_info(client, inria_id):
        url = os.path.join("/api/dataset/", str(inria_id), "stats")
        resp = client.get(url)
        respj = json.loads(resp.data)
        with open("dat_info", "w") as f:
            json.dump(respj, f)
        return resp, respj

    @pytest.mark.skip
    def test_create_dataset(self, client):
        url = "/api/dataset/"
        data = {"name": "test_inria", "categories": ["person"]}
        resp = client.post(url, json=data)
        sleep(0.5)
        assert resp.status_code == 200

    def test_get_datasets(self, client):
        url = "/api/dataset/"
        resp = client.get(url)
        assert resp.status_code == 200
        resp = json.loads(resp.data)
        assert isinstance(resp, list)

    @pytest.mark.skip
    def test_scan_dataset(self, client):
        inria_id = self._get_inria_id(client)
        url = os.path.join("/api/dataset/", str(inria_id), "scan")
        resp = client.get(url)
        sleep(0.5)
        assert resp.status_code == 200
        resp, respj = self._get_inria_info(client, inria_id)
        assert respj["total"]["Images"] == 5

    @pytest.mark.skip
    def test_import_by_path(self, client):
        inria_id = self._get_inria_id(client)
        url = os.path.join("/api/dataset/", str(inria_id), "coco")
        data = {"path_string": "/datasets/test_inria"}
        resp = client.post(url, json=data)
        sleep(2.5)
        assert resp.status_code == 200
        resp, respj = self._get_inria_info(client, inria_id)
        assert respj["total"]["Annotated Images"] == 5  # in case of failing this test, try to extend sleeping time
        assert respj["total"]["Annotations"] == 12

    @pytest.mark.skip
    def test_delete(self, client):
        inria_id = self._get_inria_id(client)
        url = os.path.join("/api/dataset/", str(inria_id))
        resp = client.delete(url)
        assert resp.status_code == 200
        url = "/api/undo/"
        data = {"id": str(inria_id), "instance": "dataset"}
        resp = client.delete(url, json=data)
        assert resp.status_code == 200
