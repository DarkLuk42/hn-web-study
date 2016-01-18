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

    def GET(self, course_of_study_id):
        course_of_study_id = Validator.require_int(course_of_study_id)
        if 0 <= course_of_study_id < len(self.course_of_study.list):
            cos = self.course_of_study.list[course_of_study_id]
            if not cos["deleted"]:
                data = dict()

                def get_courses_name(obj):
                    return obj["name"]

                data["courses"] = deepcopy(cos["courses"])
                data["courses"].sort(key=get_courses_name)

                for course in data["courses"]:
                    course["module"] = self.module.list[course["module_id"]]
                    course["creditpoints"] = course["module"]["creditpoints"]
                    del course["module_id"]

                return json.dumps(data)

        Validator.fail_found()

# EOF
