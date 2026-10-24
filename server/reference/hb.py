"""
WHO Haemoglobin Anaemia Reference Scorer (WHO 2011)
Test oracle only.
"""

def classify_hb(hb_val: float, is_pregnant: bool = False) -> dict:
    if is_pregnant:
        if hb_val >= 11.0:
            return {"status": "normal", "severity": None}
        elif hb_val >= 10.0:
            return {"status": "anaemic", "severity": "mild"}
        elif hb_val >= 7.0:
            return {"status": "anaemic", "severity": "moderate"}
        else:
            return {"status": "anaemic", "severity": "severe"}
    else:
        if hb_val >= 12.0:
            return {"status": "normal", "severity": None}
        elif hb_val >= 11.0:
            return {"status": "anaemic", "severity": "mild"}
        elif hb_val >= 8.0:
            return {"status": "anaemic", "severity": "moderate"}
        else:
            return {"status": "anaemic", "severity": "severe"}
