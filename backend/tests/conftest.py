import json
import os

import pytest
from webserver import app


def get_credentials():
    with open("tests/cred.json") as f:
        fj = json.load(f)
    return fj


def create(s):
    url = os.path.join("http://127.0.0.1:8080/api/", "user/register")
    data = get_credentials()
    data = json.dumps(data)
    resp = s.post(url, data=data, headers={"content-type": "application/json"})
    print("create: " + str(resp))


def login(s):
    url = os.path.join("http://127.0.0.1:8080/api/", "user/login")
    data = get_credentials()
    data = json.dumps(data)
    resp = s.post(url, data=data, headers={"content-type": "application/json"})
    with open("response_code_here", "w") as f:
        f.write(str(resp))


@pytest.fixture
def client():
    test_client = app.test_client()
    create(test_client)
    login(test_client)
    return test_client
