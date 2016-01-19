# coding: utf-8

import cherrypy
import json
from .validator import Validator
from app.ressources import lehrveranstaltung, login, modul, modulhandbuch, studiengang, template


class Application(object):
    def __init__(self, application_dir):
        self.application_dir = application_dir

        self.template = template.Ressource(self)

        self.studiengang = studiengang.Ressource(self)
        self.modul = modul.Ressource(self)

        self.modulhandbuch = modulhandbuch.Index(self)
        self.lehrveranstaltung = lehrveranstaltung.Ressource(self)

        self.login = login.Ressource(self)

    def is_admin(self, **data):
        return self.login.is_admin(**data)

    def is_module_admin(self, module_id=None, **data):
        return self.login.is_module_admin(module_id, **data)

    def proof_admin(self, **data):
        self.login.proof_admin(**data)

    def proof_module_admin(self, module_id=None, **data):
        self.login.proof_module_admin(module_id, **data)

    @staticmethod
    def response(data=None):
        return json.dumps(data)

    @staticmethod
    def handle_error():
        exception = cherrypy._cperror._exc_info()[1]
        message = repr(exception)

        cherrypy.response.status = 500
        if isinstance(exception, cherrypy.NotFound):
            cherrypy.response.status = 404
        elif isinstance(exception, Validator.ValidationFailed):
            cherrypy.response.status = 400
            message = str(exception)

        cherrypy.response.body = bytes(json.dumps({
            "message": message
        }), "UTF-8")

    def default(self, *arglist, **kwargs):
        msg_s = "unbekannte Anforderung: " + \
                repr(arglist) + \
                '' + \
                repr(kwargs)
        raise cherrypy.HTTPError(404, msg_s)
    default.exposed = True


# EOF
