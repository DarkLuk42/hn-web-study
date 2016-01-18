# coding: utf-8

import cherrypy


class Validator(object):
    def __init__(self):
        pass

    @staticmethod
    def require(data, *fields):
        empty_fields = list()
        for field in fields:
            if field is None or field.strip() == "":
                empty_fields.append(field)
        if len(empty_fields) > 0:
            raise Validator.ValidationFailed(empty_fields)

    @staticmethod
    def require_int(strVal):
        try:
            return int(strVal)
        except ValueError:
            Validator.fail("The string '" + strVal + "' has to be a valid integer.")

    @staticmethod
    def fail(message):
        raise Validator.ValidationFailed(message)

    @staticmethod
    def fail_found(message=None):
        raise cherrypy.HTTPError(status=404, message=message)

    class ValidationFailed(Exception):
        def __init__(self, msg):
            self.msg = msg
            pass

        def __str__(self):
            return self.msg

    class ValidationFailedRequire(ValidationFailed):
        def __init__(self, required_fields):
            self.required_fields = required_fields
            super("The fields '" + self.required_fields.join("', '") + "' are required.")
            pass


# EOF
