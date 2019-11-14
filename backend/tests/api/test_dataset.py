import json
import pytest

class TestDataset:

    @staticmethod
    def _get_inria_id(client):
        url = '/api/dataset/'
        resp = client.get(url)
        resp = json.loads(resp.data)
        for el in resp:
            if el['name'] == 'test_inria':
                inria_id = el['id']
                return inria_id

    @pytest.mark.skip
    def test_create_dataset(self, client):
        url = '/api/dataset/'
        data = {"name": "test_inria", "categories": ["person"]}
        resp = client.post(url, json=data)
        assert resp.status_code == 200


    def test_get_datasets(self, client):
        url = '/api/dataset/'
        resp = client.get(url)
        assert resp.status_code == 200
        resp = json.loads(resp.data)
        assert isinstance(resp, list)


    @pytest.mark.skip
    def test_scan_dataset(self, client):
        inria_id = self._get_inria_id(client)
        url = '/api/dataset/' + str(inria_id) + '/scan'
        resp = client.get(url)
        assert resp.status_code == 200

    @pytest.mark.skip
    def test_import_by_path(self, client):
        inria_id = self._get_inria_id(client)
        url = '/api/dataset/' + str(inria_id) + '/coco'
        data = {'path_string': '/datasets/test_inria'}
        resp = client.post(url, json=data)
        assert resp.status_code == 200