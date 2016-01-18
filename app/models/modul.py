# coding: utf-8

import json
from ..validator import Validator
import cherrypy


class Index(object):
    def __init__(self, application):
        self.application = application
        self.data_file = self.application.application_dir + "/data/module.json"
        self.list = list()
        self.load()
    exposed = True

    def load(self):
        with open(self.data_file, "r") as f:
            self.list = json.load(f)

    def save(self):
        with open(self.data_file, "w") as f:
            json.dump(self.list, f)

    def GET(self, module_id=None):
        if module_id is None:
            return json.dumps(self.list)

        module_id = Validator.require_int(module_id)
        if 0 <= module_id < len(self.list):
            obj = self.list[module_id]
            if not obj["deleted"]:
                return json.dumps(obj)

        raise cherrypy.HTTPError(status=404)

# EOF
