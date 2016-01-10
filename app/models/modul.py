# coding: utf-8

import json


class Index(object):
    def __init__(self, application_dir):
        self.application_dir = application_dir
        self.list = json.load(open(self.application_dir + "/data/modul.json", "r"))
        for id in self.list:
            setattr(self, id, Modul(self.list[id]))
    exposed = True

    def GET(self):
        return json.dumps(self.list)


class Modul(object):
    def __init__(self, data):
        self.data = data
    exposed = True

    def GET(self):
        return json.dumps(self.data)


# EOF
