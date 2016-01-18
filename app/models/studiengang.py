# coding: utf-8

import json
from ..validator import Validator
import cherrypy


class Index(object):
    def __init__(self, application):
        self.application = application
        self.data_file = self.application.application_dir + "/data/course_of_study.json"
        self.list = list()
        self.load()
    exposed = True

    def load(self):
        with open(self.data_file, "r") as f:
            self.list = json.load(f)

    def save(self):
        with open(self.data_file, "w") as f:
            json.dump(self.list, f)

    def GET(self, course_of_study_id=None):
        if course_of_study_id is None:
            return json.dumps(self.list)

        course_of_study_id = Validator.require_int(course_of_study_id)
        if 0 <= course_of_study_id < len(self.list):
            obj = self.list[course_of_study_id]
            if not obj["deleted"]:
                return json.dumps(obj)

        raise cherrypy.HTTPError(status=404)

# EOF
