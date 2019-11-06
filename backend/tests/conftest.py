import pytest
import logging
import json
from webserver import app

def create(s):
    url = 'http://127.0.0.1:8080/api/' + 'user/register'
    data = {'username': 'korjak', 'password': 'korjak'}
    data = json.dumps(data)
    resp = s.post(url, data=data, headers={'content-type': 'application/json'})
    print('create: ' + str(resp))

def login(s):
    url = 'http://127.0.0.1:8080/api/' + 'user/login'
    data = {'username': 'korjak', 'password': 'korjak'}
    data = json.dumps(data)
    resp = s.post(url, data=data, headers={'content-type': 'application/json'})
    with open('response_code_here', 'w') as f:
        f.write(str(resp))


@pytest.fixture
def client():
    test_client = app.test_client()
    create(test_client)
    login(test_client)
    return test_client