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

    def PUT(self, **data):
        Validator.require(data, "alias", "name")

        for t_module in self.list:
            if not t_module["deleted"]:
                if t_module["alias"] == data["alias"]:
                    Validator.fail("The alias is already in use by another module.")

        coursecount = Validator.require_int(data["coursecount"])
        creditpoints = Validator.require_int(data["creditpoints"])

        module = {
            "id": len(self.list),
            "alias": data["alias"],
            "name": data["name"],
            "coursecount": coursecount,
            "creditpoints": creditpoints,
            "deleted": False
        }
        self.list.append(module)
        self.save()
        return json.dumps(module)

    def POST(self, module_id, **data):
        module_id = Validator.require_int(module_id)
        if 0 <= module_id < len(self.list):
            module = self.list[module_id]
            if not module["deleted"]:
                Validator.require(data, "alias", "name")

                for t_module in self.list:
                    if not t_module["deleted"]:
                        if t_module is not module and t_module["alias"] == data["alias"]:
                            Validator.fail("The alias is already in use by another module.")

                coursecount = Validator.require_int(data["coursecount"])
                creditpoints = Validator.require_int(data["creditpoints"])

                module["alias"] = data["alias"]
                module["name"] = data["name"]
                module["coursecount"] = coursecount
                module["creditpoints"] = creditpoints

                self.save()

                return json.dumps(module)

        Validator.fail_found()

    def DELETE(self, module_id):
        module_id = Validator.require_int(module_id)
        if 0 <= module_id < len(self.list):
            module = self.list[module_id]
            if not module["deleted"]:
                module["deleted"] = True
                self.save()
                return json.dumps({"id": module["id"]})

        Validator.fail_found()

# EOF
