import json
import os


class TestImage:

    def test_get_empty(self, client, image_url):
        response = client.get(image_url)
        data = json.loads(response.data)

        assert isinstance(data, dict)
        assert data['total'] == 0

    def test_post_no_data(self, client, image_url):
        response = client.post(image_url)
        assert response.status_code == 400

    def test_post_images(self, client):
        pass

    def test_post_images_invalid(self, client):
        pass


class TestImageId:
    def test_get_invalid_id(self, client, image_url):
        url = os.path.join(image_url, "1000")
        response = client.get(url)
        assert response.status_code == 400

    def test_delete_invalid_id(self, client, image_url):
        url = os.path.join(image_url, "1000")
        response = client.delete(url)
        assert response.status_code == 400


class TestImageCoco:
    def test_get_invalid_id(self, client, image_url):
        url = os.path.join(image_url, "1000", "coco")
        response = client.get(url)
        assert response.status_code == 400



