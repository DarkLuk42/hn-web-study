# coding: utf-8

import json
from ..validator import Validator


class Ressource(object):
    def __init__(self, application):
        self.application = application
        self.data_file = self.application.application_dir + "/data/course_of_study.json"
        self.list = list()
        self.load()
    exposed = True

    def load(self):
        with open(self.data_file, "r") as f:
            self.list = json.load(f)

        i = 0
        for cos in self.list:
            cos["id"] = i
            i += 1

    def save(self):
        with open(self.data_file, "w") as f:
            json.dump(self.list, f, indent=4, sort_keys=True)

    def GET(self, course_of_study_id=None, **data):
        if course_of_study_id is None:
            new_list = list()
            for cos in self.list:
                if not cos["deleted"]:
                    new_list.append(cos)
            return json.dumps(new_list)

        course_of_study_id = Validator.require_int(course_of_study_id)
        if 0 <= course_of_study_id < len(self.list):
            cos = self.list[course_of_study_id]
            if not cos["deleted"]:
                return json.dumps(cos)

        Validator.fail_found()

    def POST(self, course_of_study_id, **data):
        course_of_study_id = Validator.require_int(course_of_study_id)
        if 0 <= course_of_study_id < len(self.list):
            cos = self.list[course_of_study_id]
            if not cos["deleted"]:
                Validator.require(data, "alias", "name", "semesters")

                for t_cos in self.list:
                    if not t_cos["deleted"]:
                        if t_cos is not cos and t_cos["alias"] == data["alias"]:
                            Validator.fail("The alias is already in use by another course of study.")

                max_semester = 1
                for course in cos["courses"]:
                    max_semester = max(max_semester, course["semester"])

                semesters = Validator.require_int(data["semesters"])
                if semesters < max_semester:
                    Validator.fail("The semesters must greater or equal than " + str(max_semester) + ".")

                cos["alias"] = data["alias"]
                cos["name"] = data["name"]
                cos["semesters"] = semesters

                self.save()
                return json.dumps(cos)

        Validator.fail_found()

    def PUT(self, **data):
        Validator.require(data, "alias", "name", "semesters")

        for t_cos in self.list:
            if not t_cos["deleted"]:
                if t_cos["alias"] == data["alias"]:
                    Validator.fail("The alias is already in use by another course of study.")

        semesters = Validator.require_int(data["semesters"])
        if semesters < 0:
            Validator.fail("The semesters must be greater then 0.")

        cos = {
            "id": len(self.list),
            "alias": data["alias"],
            "name": data["name"],
            "semesters": semesters,
            "courses": [],
            "deleted": False
        }
        self.list.append(cos)

        self.save()
        return json.dumps(cos)

    def DELETE(self, course_of_study_id, **data):
        # course_of_study_id = Validator.require_int(course_of_study_id)
        if 0 <= course_of_study_id < len(self.list):
            cos = self.list[course_of_study_id]
            if not cos["deleted"]:
                cos["deleted"] = True
                self.save()
                return json.dumps({"id": cos["id"]})

        Validator.fail_found()

# EOF
