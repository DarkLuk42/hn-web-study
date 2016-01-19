# coding: utf-8

import json
from ..validator import Validator
import cherrypy


class Ressource(object):
    def __init__(self, application):
        self.application = application
        self.course_of_study = application.studiengang
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

    def GET(self, module_id=None, **data):
        self.application.proof_module_admin(**data)
        if module_id is None:
            new_list = list()
            for obj in self.list:
                if not obj["deleted"] and self.application.is_module_admin(obj["id"], **data):
                    new_list.append(obj)
            return json.dumps(new_list)

        module_id = Validator.require_int(module_id)
        self.application.proof_module_admin(module_id, **data)
        if 0 <= module_id < len(self.list):
            obj = self.list[module_id]
            if not obj["deleted"]:
                return json.dumps(obj)

        Validator.fail_found()

    def PUT(self, **data):
        self.application.proof_admin(**data)
        Validator.require(data, "alias", "name", "description")

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
            "description": data["description"],
            "coursecount": coursecount,
            "creditpoints": creditpoints,
            "deleted": False
        }
        self.list.append(module)
        self.save()
        return json.dumps(module)

    def POST(self, module_id, **data):
        module_id = Validator.require_int(module_id)
        self.application.proof_module_admin(module_id, **data)
        if 0 <= module_id < len(self.list):
            module = self.list[module_id]
            if not module["deleted"]:
                Validator.require(data, "alias", "name", "description")

                for t_module in self.list:
                    if not t_module["deleted"]:
                        if t_module is not module and t_module["alias"] == data["alias"]:
                            Validator.fail("The alias is already in use by another module.")

                coursecount = Validator.require_int(data["coursecount"])
                creditpoints = Validator.require_int(data["creditpoints"])

                module["alias"] = data["alias"]
                module["name"] = data["name"]
                module["description"] = data["description"]
                module["coursecount"] = coursecount
                module["creditpoints"] = creditpoints

                self.save()

                return json.dumps(module)

        Validator.fail_found()

    def DELETE(self, module_id, **data):
        # self.application.proof_admin(**data)
        module_id = Validator.require_int(module_id)
        if 0 <= module_id < len(self.list):
            module = self.list[module_id]
            if not module["deleted"]:

                for cos in self.course_of_study.list:
                    for course in cos["courses"]:
                        if course["modul_id"] == module_id:
                            Validator.fail("The module is still in use.")

                module["deleted"] = True
                self.save()
                return json.dumps({"id": module["id"]})

        Validator.fail_found()

# EOF
