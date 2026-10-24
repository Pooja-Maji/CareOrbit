import json
from pathlib import Path
import pytest

def test_rules_json_syntax():
    common_rules_dir = Path(__file__).resolve().parent.parent.parent / "common" / "rules"
    assert common_rules_dir.exists(), "common/rules directory must exist"

    rule_files = list(common_rules_dir.glob("*.json"))
    assert len(rule_files) > 0, "Must have rules files"

    for rfile in rule_files:
        with open(rfile, "r", encoding="utf-8") as f:
            data = json.load(f)
            assert "id" in data, f"{rfile.name} missing 'id'"
            assert "version" in data, f"{rfile.name} missing 'version'"
