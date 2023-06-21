import re


class MatchesRegex:
    # This is a utility class to make testing easier.
    # With this class, you can do:
    # assert x == { "key": MatchesRegex("regex") }

    def __init__(self, regex):
        self.regex = re.compile(regex)

    def __eq__(self, other):
        return isinstance(other, str) and bool(self.regex.match(other))


def MatchesFunctionString(name):
    return MatchesRegex(f"<function {re.escape(name)} at 0x[0-9a-f]*>")
