import pytest
import flask
import urllib.parse

from app.config import AppProperties
from app.domain.search_request import FilterOperator
from app.rql_parser import RqlRequestParser
from app.main import create_app


@pytest.fixture()
def request_factory():
    app_properties = AppProperties(
        database_url = 'sqlite:///:memory:',
        session_secret_key = '',
        cors_origin = '',
        app_version = 'unit-test'
    )
    app = create_app(app_properties=app_properties)

    def request(rql_string):
        query_params = urllib.parse.quote(rql_string)
        return app.test_request_context('/?rql=' + query_params)

    return request


def test_rql_parser_no_mapping_allowed(request_factory):
    rql_parser = RqlRequestParser({'field': 'field'})
    with request_factory('eq(field,value)'):
        search_request = rql_parser.parse(flask.request)
        assert search_request.filter_request is not None, 'FilterRequest should be defined'
        assert search_request.filter_request.get_field() == 'field'
        assert search_request.filter_request.get_value() == 'value'
        assert search_request.filter_request.get_operator() == FilterOperator.EQ
