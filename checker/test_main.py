import unittest

from main import CheckInput, check, parse_math
from sympy import simplify


class RestrictedMathParserTests(unittest.TestCase):
    def test_equivalent_product_forms_simplify_to_zero(self):
        left = parse_math("2*x*exp(x) + x^2*exp(x)", "x")
        right = parse_math("x*exp(x)*(x+2)", "x")
        self.assertEqual(simplify(left - right), 0)

    def test_parser_rejects_python_code_and_attributes(self):
        for expression in ["__import__('os')", "x.__class__", "open(1)"]:
            with self.subTest(expression=expression), self.assertRaises(ValueError):
                parse_math(expression, "x")

    def test_nonzero_remainder_is_not_claimed_as_proven_inequivalence(self):
        result = check(CheckInput(answer="x", expected="x^2", variable="x"))
        self.assertFalse(result["correct"])
        self.assertFalse(result["verified"])

    def test_numeric_constants_are_supported(self):
        self.assertEqual(parse_math("1/2 + 1/2", "x"), 1)


if __name__ == "__main__":
    unittest.main()
