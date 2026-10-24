"""
PBAC Python Reference Scorer (Higham et al., BJOG 1990)
Test oracle only.
"""

PAD_WEIGHTS = {
    "light": 1,
    "moderate": 5,
    "saturated": 20,
}

TAMPON_WEIGHTS = {
    "light": 1,
    "moderate": 5,
    "saturated": 10,
}

CLOT_WEIGHTS = {
    "small": 1,
    "large": 5,
}

FLOODING_WEIGHT = 5

def score_pbac(inputs: dict) -> int:
    score = 0

    pads = inputs.get("pad", {})
    for k, w in PAD_WEIGHTS.items():
        score += pads.get(k, 0) * w

    tampons = inputs.get("tampon", {})
    for k, w in TAMPON_WEIGHTS.items():
        score += tampons.get(k, 0) * w

    clots = inputs.get("clot", {})
    for k, w in CLOT_WEIGHTS.items():
        score += clots.get(k, 0) * w

    flooding = inputs.get("flooding", 0)
    score += flooding * FLOODING_WEIGHT

    return score
