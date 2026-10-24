"""
Architecture Boundary Linter: check_no_health_imports.py
Owner: Person B

Strict Rule:
Fails the build if anything under server/app/ imports reference/
or reads common/rules. Server must know nothing about clinical health logic.
"""

import sys
import re
from pathlib import Path

def check_imports():
    app_dir = Path(__file__).resolve().parent.parent / "app"
    violations = []

    forbidden_patterns = [
        re.compile(r"import\s+.*reference"),
        re.compile(r"from\s+.*reference\s+import"),
        re.compile(r"common/rules"),
        re.compile(r"common\\rules"),
        re.compile(r"pbac\.json"),
        re.compile(r"hb_who\.json"),
        re.compile(r"epds\.json"),
    ]

    for py_file in app_dir.rglob("*.py"):
        with open(py_file, "r", encoding="utf-8") as f:
            for line_no, line in enumerate(f, 1):
                for pat in forbidden_patterns:
                    if pat.search(line):
                        violations.append((py_file, line_no, line.strip()))

    if violations:
        print("ARCHITECTURE BOUNDARY VIOLATION:")
        print("server/app must NEVER import reference scorers or read common/rules directly!")
        for file, line_no, text in violations:
            print(f"  {file}:{line_no} -> {text}")
        sys.exit(1)
    else:
        print("Architecture Boundary Check PASSED: zero health imports in server/app.")

if __name__ == "__main__":
    check_imports()
