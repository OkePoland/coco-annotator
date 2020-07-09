import json
import os
import pytest
from database import CategoryModel

category1_id = 0
category2_id = 0
category3_id = 0


class TestCategory:

    @classmethod
    def setup_class(cls):
        CategoryModel.objects.delete()

    @pytest.mark.run(before='test_post_categories')
    def test_get_empty(self, client, category_url):
        response = client.get(category_url)
        data = json.loads(response.data)

        assert isinstance(data, list)
        assert len(data) == 0

    def test_post_no_data(self, client, category_url):
        response = client.post(category_url)
        assert response.status_code == 400

    @pytest.mark.run(after="test_get_empty")
    def test_post_categories(self, client, category_url):
        global category1_id, category2_id, category3_id
        # Category 1 Test
        data = {
            "name": "test1"
        }
        response = client.post(category_url, json=data)

        r = json.loads(response.data)
        assert response.status_code == 200
        assert r.get("name") == data.get("name")
        assert r.get("color") is not None
        assert r.get("id") is not None
        category1_id = r.get("id")

        # Category 2 Test
        data = {
            "name": "test2",
            "color": "white",
            "metadata": {"key1": True, "key2": 1, "key3": "value"}
        }
        response = client.post(category_url, json=data)

        r = json.loads(response.data)
        assert response.status_code == 200
        assert r.get("name") == data.get("name")
        assert r.get("color") == data.get("color")
        assert r.get("metadata") == data.get("metadata")
        assert r.get("id") is not None
        category2_id = r.get("id")

        # Category 3 Test
        data = {
            "name": "test3"
        }
        response = client.post(category_url, json=data)

        r = json.loads(response.data)
        assert response.status_code == 200
        assert r.get("name") == data.get("name")
        assert r.get("metadata") is not None
        assert r.get("id") is not None
        category3_id = r.get("id")

    def test_post_categories_invalid(self, client):
        pass

    @pytest.mark.run(after='test_post_categories')
    def test_post_already_existing_category(self, client):
        pass


class TestCategoryId:

    @pytest.mark.run(after='test_post_categories')
    def test_get(self, client, category_url):
        url = os.path.join(category_url, str(category2_id))
        response = client.get(url)
        r = json.loads(response.data)
        assert response.status_code == 200
        assert r.get("name") == "test2"
        assert r.get("color") == "white"

    def test_get_invalid_id(self, client, category_url):
        url = os.path.join(category_url, "1000")
        response = client.get(url)
        assert response.status_code == 400

    def test_delete_invalid_id(self, client, category_url):
        url = os.path.join(category_url, "1000")
        response = client.delete(url)
        assert response.status_code == 400

    @pytest.mark.run(after='test_post_categories')
    def test_get(self, client, category_url):
        url = os.path.join(category_url, str(category3_id))
        response = client.delete(url)
        assert response.status_code == 200

    @pytest.mark.run(after='test_post_categories')
    def test_put_equal(self, client, category_url):
        """ Test response when the name to update is the same as already stored """
        data = {
            "name": "test1"
        }
        url = os.path.join(category_url, str(category1_id))
        response = client.put(url, json=data)
        assert response.status_code == 200

    def test_put_invalid_id(self, client, category_url):
        """ Test response when id does not exit """
        url = os.path.join(category_url, "1000")
        response = client.put(url)
        assert response.status_code == 400

    def test_put_not_unique(self, client, category_url):
        """ Test response when the name already exits """
        data = {
            "name": "test2"
        }
        url = os.path.join(category_url, str(category1_id))
        response = client.put(url, json=data)
        assert response.status_code == 400

    def test_put_empty(self, client, category_url):
        """ Test response when category name is empty"""
        data = {
            "name": ""
        }
        url = os.path.join(category_url, str(category1_id))
        response = client.put(url, json=data)
        assert response.status_code == 400

    @pytest.mark.run(after='test_put_not_unique')
    def test_put(self, client, category_url):
        """ Test response when update is correct"""
        data = {
            "name": "test1_updated"
        }
        url = os.path.join(category_url, str(category1_id))
        response = client.put(url, json=data)
        assert response.status_code == 200

    @pytest.mark.run(after='test_put')
    def test_put_reset(self, client, category_url):
        """ Reset test after a correct update """
        data = {
            "name": "test1"
        }
        url = os.path.join(category_url, str(category1_id))
        response = client.put("url", json=data)
        assert response.status_code == 200
