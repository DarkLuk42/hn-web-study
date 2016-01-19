#  coding: utf-8

from os import path
from jsmin import jsmin
from app.validator import Validator

class Ressource(object):
    def __init__(self, application):
        self.application = application
        self.js_dir = self.application.application_dir + "/content/js"
        self.templates = {}
    exposed = True

    def GET(self, *files):
        minified = ""
        for file in files:
            file = path.join(self.js_dir, file + ".js")
            if not path.isfile(file):
                Validator.fail_found()
            with open(file) as js_file:
                minified += jsmin(js_file.read(), quote_chars="'\"`") + "\n"
        return minified


# EOF
