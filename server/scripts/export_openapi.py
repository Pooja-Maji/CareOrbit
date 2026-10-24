"""
SthreeCare - Export OpenAPI JSON Specification
Owner: Person B
"""

import json
from pathlib import Path
import sys

# Ensure server root is in path
server_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(server_root))

from app.main import app

def export_openapi():
    spec = app.openapi()
    target_path = server_root / "openapi.json"
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(spec, f, indent=2)
    print(f"Exported OpenAPI spec to {target_path}")

if __name__ == "__main__":
    export_openapi()
