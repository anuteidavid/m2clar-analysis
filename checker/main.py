"""Restricted symbolic equivalence endpoint for student expressions."""
import ast
import operator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sympy import E, I, Integer, Rational, Symbol, cos, exp, log, pi, sin, simplify, sqrt, tan

app = FastAPI(title="m2clar symbolic checker")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_methods=["POST"], allow_headers=["*"],
)

class CheckInput(BaseModel):
    answer: str = Field(min_length=1, max_length=300)
    expected: str = Field(min_length=1, max_length=300)
    variable: str = Field(default="x", pattern=r"^[a-zA-Z]$")

BIN_OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv, ast.Pow: operator.pow}
UNARY_OPS = {ast.UAdd: operator.pos, ast.USub: operator.neg}
FUNCTIONS = {"sin": sin, "cos": cos, "tan": tan, "exp": exp, "log": log, "sqrt": sqrt}
CONSTANTS = {"pi": pi, "E": E, "I": I}

def parse_math(source: str, variable: str):
    """Parse a deliberately small arithmetic grammar; never eval/exec user input."""
    try:
        tree = ast.parse(source.replace("^", "**"), mode="eval")
    except SyntaxError as exc:
        raise ValueError("Syntaxă matematică invalidă") from exc
    if sum(1 for _ in ast.walk(tree)) > 100:
        raise ValueError("Expresia este prea complexă")
    symbol = Symbol(variable, real=True)

    def visit(node):
        if isinstance(node, ast.Expression):
            return visit(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)) and not isinstance(node.value, bool):
            return Integer(node.value) if isinstance(node.value, int) else Rational(str(node.value))
        if isinstance(node, ast.Name):
            if node.id == variable:
                return symbol
            if node.id in CONSTANTS:
                return CONSTANTS[node.id]
            raise ValueError("Simbol nepermis")
        if isinstance(node, ast.BinOp) and type(node.op) in BIN_OPS:
            left, right = visit(node.left), visit(node.right)
            if isinstance(node.op, ast.Pow) and right.is_number and abs(float(right)) > 100:
                raise ValueError("Exponentul depășește limita acceptată")
            return BIN_OPS[type(node.op)](left, right)
        if isinstance(node, ast.UnaryOp) and type(node.op) in UNARY_OPS:
            return UNARY_OPS[type(node.op)](visit(node.operand))
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in FUNCTIONS and len(node.args) == 1 and not node.keywords:
            return FUNCTIONS[node.func.id](visit(node.args[0]))
        raise ValueError("Operator sau funcție nepermisă")

    result = visit(tree)
    if len(str(result)) > 5000:
        raise ValueError("Rezultatul intermediar este prea complex")
    return result

@app.post("/check")
def check(payload: CheckInput):
    try:
        submitted = parse_math(payload.answer, payload.variable)
        expected = parse_math(payload.expected, payload.variable)
        equivalent = simplify(submitted - expected) == 0
        # Simplification to zero is positive evidence of equality; a nonzero
        # remainder alone is not a general proof that two expressions differ.
        return {"correct": bool(equivalent), "verified": bool(equivalent), "method": "symbolic_simplification"}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:
        # A failed simplification is not a mathematical proof of inequivalence.
        return {"correct": False, "verified": False, "method": "symbolic_simplification", "message": "Echivalența nu a putut fi verificată simbolic."}

@app.get("/health")
def health():
    return {"status": "ok"}
