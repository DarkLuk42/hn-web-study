# coding: utf-8


class Validator(object):
    def __init__(self):
        pass

    @staticmethod
    def require(data, *fields):
        empty_fields = list()
        for field in fields:
            if field is None or field.trim() == "":
                empty_fields.append(field)
        if len(empty_fields) > 0:
            raise Validator.ValidationFailed(empty_fields)

    class ValidationFailed(Exception):
        def __init__(self, required_fields):
            self.required_fields = required_fields
            pass

        def __str__(self):
            msg = "The fields '" + self.required_fields.join("', '") + "' are required."
            return msg


# EOF
