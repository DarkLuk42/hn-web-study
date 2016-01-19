# coding: utf-8

import json
import cherrypy
from app.validator import Validator


class Ressource(object):
    def __init__(self, application):
        self.application = application
        self.data_file = self.application.application_dir + "/data/users.json"
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

    def PUT(self, username, password, **data):
        for user in self.list:
            if user["username"] == username:
                if user["password"] != password:
                    Validator.fail("The username or password is wrong!")
                return json.dumps(user)
        Validator.fail("The username or password is wrong!")

    def is_admin(self, **data):
        if "user_id" not in data or data is None:
            return False
        user_id = Validator.require_int(data["user_id"])
        if 0 <= user_id < len(self.list):
            user = self.list[user_id]
            if user["role"] == "ADMIN":
                return True
        return False

    def proof_admin(self, **data):
        if not self.is_admin(**data):
            print(repr(data))
            raise cherrypy.HTTPError(403, "Du bist kein Admin!")

    def is_module_admin(self, module_id=None, **data):
        if "user_id" not in data or data is None:
            return False
        user_id = Validator.require_int(data["user_id"])
        if 0 <= user_id < len(self.list):
            user = self.list[user_id]
            if user["role"] != "ADMIN" and module_id is not None:
                for u_module_id in user["module"]:
                    if u_module_id == module_id:
                        return True
                return False
            return True
        return False

    def proof_module_admin(self, module_id=None, **data):
        if not self.is_module_admin(module_id, **data):
            print(repr(data))
            raise cherrypy.HTTPError(403, "Du hast kein Zugriff auf das Modul!")



# EOF
