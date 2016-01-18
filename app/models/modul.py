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

        i = 0
        for obj in self.list:
            obj["id"] = i
            i += 1

    def save(self):
        with open(self.data_file, "w") as f:
            json.dump(self.list, f, indent=4, sort_keys=True)

    def GET(self, module_id=None):
        if module_id is None:
            new_list = list()
            for obj in self.list:
                if not obj["deleted"]:
                    new_list.append(obj)
            return json.dumps(new_list)

        module_id = Validator.require_int(module_id)
        if 0 <= module_id < len(self.list):
            obj = self.list[module_id]
            if not obj["deleted"]:
                return json.dumps(obj)

        Validator.fail_found()

# EOF
