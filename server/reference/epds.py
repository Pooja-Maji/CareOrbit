"""
EPDS Mood Reference Scorer (Cox et al., 1987)
Test oracle only.
"""

def score_epds(answers: list[int]) -> dict:
    if len(answers) != 10:
        raise ValueError("EPDS requires exactly 10 responses (items 1-10)")

    total_score = sum(answers)
    self_harm_item = answers[9] # Item 10 is index 9

    return {
        "score": total_score,
        "is_elevated": total_score >= 13,
        "self_harm_positive": self_harm_item > 0,
    }
