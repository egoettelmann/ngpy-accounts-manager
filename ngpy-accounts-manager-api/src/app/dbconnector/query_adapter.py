from sqlalchemy import func, cast, String


class QueryAdapter:
    """
    The query adapter class to abstract DB specific functions
    """
    __type: str

    def __init__(self, db_type: str):
        """Constructor"""
        self.__type = db_type

    def right(self, expression: any, length: int) -> any:
        """Substrings an expression from the right of a given length.

        :param expression: the expression to substring
        :param length: the length of the substring from the right
        :return: the substring expression
        """
        if self.__type is 'sqlite':
            # SQLite has no RIGHT expression, using substring with negative length
            return func.substr(expression, -length)
        # By default using RIGHT expression
        return func.right(expression, length)

    def pad(self, expression: any, placeholder: str):
        """Adds a padding in front of the expression.
        The placeholder should be of the length of the resulting expression.

        Basically, ``pad(7, '000')``, will result in: '007'.

        :param expression:
        :param placeholder:
        :return:
        """
        return self.right(placeholder + cast(expression, String), len(placeholder))
