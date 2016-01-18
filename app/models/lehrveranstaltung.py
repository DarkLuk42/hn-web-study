# coding: utf-8

import json
from ..validator import Validator
import cherrypy
from copy import deepcopy


class Index(object):
    def __init__(self, application):
        self.application = application
        self.course_of_study = self.application.studiengang
        self.module = self.application.modul
    exposed = True

    def GET(self, course_of_study_id, module_id=None):
        course_of_study_id = Validator.require_int(course_of_study_id)
        if 0 <= course_of_study_id < len(self.course_of_study.list):
            cos = self.course_of_study.list[course_of_study_id]
            if not cos["deleted"]:
                if module_id is None:
                    data = dict()

                    def get_courses_name(obj):
                        return obj["name"]

                    data["courses"] = deepcopy(cos["courses"])
                    data["courses"].sort(key=get_courses_name)

                    for course in data["courses"]:
                        course["module"] = self.module.list[course["modul_id"]]
                        course["creditpoints"] = course["module"]["creditpoints"]

                    return json.dumps(data["courses"])

                module_id = Validator.require_int(module_id)
                for course in deepcopy(cos["courses"]):
                    if course["modul_id"] == module_id:
                        course["module"] = self.module.list[course["modul_id"]]
                        course["creditpoints"] = course["module"]["creditpoints"]
                        return json.dumps(course)

        Validator.fail_found()

    def PUT(self, course_of_study_id, **data):
        course_of_study_id = Validator.require_int(course_of_study_id)
        if 0 <= course_of_study_id < len(self.course_of_study.list):
            cos = self.course_of_study.list[course_of_study_id]
            if not cos["deleted"]:
                Validator.require(data, "modul_id", "name", "semester")
                modul_id = Validator.require_int(data["modul_id"])
                semester = Validator.require_int(data["semester"])

                for course in cos["courses"]:
                    if course["modul_id"] == modul_id:
                        Validator.fail("The module has already a course in this cours of study.")

                if semester < 1 or semester > cos["semesters"]:
                    Validator.fail("The semester should be between 1 and " + str(cos["semesters"]))

                new_course = {
                    "modul_id": modul_id,
                    "semester": semester,
                    "name": data["name"]
                }
                cos["courses"].append(new_course)
                self.course_of_study.save()

                return json.dumps(new_course)

        Validator.fail_found()

    def POST(self, course_of_study_id, module_id, **data):
        module_id = Validator.require_int(module_id)
        course_of_study_id = Validator.require_int(course_of_study_id)
        if 0 <= course_of_study_id < len(self.course_of_study.list):
            cos = self.course_of_study.list[course_of_study_id]
            if not cos["deleted"]:
                Validator.require(data, "modul_id", "name", "semester")
                semester = Validator.require_int(data["semester"])

                for course in cos["courses"]:
                    if course["modul_id"] == module_id:
                        if semester < 1 or semester > cos["semesters"]:
                            Validator.fail("The semester should be between 1 and " + str(cos["semesters"]))

                        new_module_id = Validator.require_int(data["modul_id"])
                        if new_module_id != module_id:
                            for t_course in cos["courses"]:
                                if t_course is not course and t_course["modul_id"] == new_module_id:
                                    Validator.fail("The module has already a course in this course of study.")
                            course["modul_id"] = new_module_id

                        course["semester"] = semester
                        course["name"] = data["name"]

                        self.course_of_study.save()

                        return json.dumps(course)

        Validator.fail_found()


# EOF
