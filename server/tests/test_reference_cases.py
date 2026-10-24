import json
from pathlib import Path
import pytest
from reference.pbac import score_pbac
from reference.hb import classify_hb

def test_pbac_cases():
    cases_file = Path(__file__).resolve().parent.parent.parent / "common" / "verification" / "cases" / "pbac.cases.json"
    assert cases_file.exists(), "pbac.cases.json must exist"

    with open(cases_file, "r", encoding="utf-8") as f:
        cases = json.load(f)

    for case in cases:
        score = score_pbac(case["input"])
        assert score == case["expectedScore"], f"Failed for case: {case['description']}"

def test_hb_cases():
    cases_file = Path(__file__).resolve().parent.parent.parent / "common" / "verification" / "cases" / "hb.cases.json"
    assert cases_file.exists(), "hb.cases.json must exist"

    with open(cases_file, "r", encoding="utf-8") as f:
        cases = json.load(f)

    for case in cases:
        res = classify_hb(case["hbValue"], is_pregnant=case.get("isPregnant", False))
        category = res["severity"] if res["status"] == "anaemic" else "normal"
        assert category == case["expectedCategory"], f"Failed for case: {case['description']}"
