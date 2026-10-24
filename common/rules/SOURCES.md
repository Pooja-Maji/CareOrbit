# Clinical Sources and Verification Documentation

> **IMPORTANT DISCLAIMER**: SthreeCare is a screening and healthcare navigation decision-support prototype. It is **NOT** a diagnostic application and never diagnoses diseases. All rules are deterministic, fully explainable, and based on published clinical literature or public health guidelines. Every screening result advises the user to consult a qualified healthcare professional.

## Screening Instruments and Cut-offs

### 1. Pictorial Blood Assessment Chart (PBAC)
- **Primary Source**: Higham JM, O'Brien PM, Shaw RW. *Assessment of menstrual blood loss using a pictorial chart.* Br J Obstet Gynaecol. 1990;97(8):734-739.
- **Instrument Validation**:
  - Validated for semi-quantitative assessment of menorrhagia (heavy menstrual bleeding).
  - Score $\ge 100$ per menstrual cycle indicates $\ge 80$ mL blood loss (clinical threshold for menorrhagia).
  - Self-assessed sensitivity 86%, specificity 89% in original study; subsequent literature reports sensitivity 58–97%.
- **Scoring Scheme**:
  - Towel / Pad (light): 1 point
  - Towel / Pad (moderate): 5 points
  - Towel / Pad (saturated): 20 points
  - Tampon (light): 1 point
  - Tampon (moderate): 5 points
  - Tampon (saturated): 10 points
  - Small clot ($< 1$ coin size): 1 point
  - Large clot ($\ge 1$ coin size): 5 points
  - Flooding episode: 5 points
- **Status**: *Screening tool only; score values based on Higham (1990). Marked for qualified medical student/doctor review prior to clinical pilot.*

---

### 2. WHO Haemoglobin Thresholds for Anaemia
- **Primary Source**: World Health Organization. *Haemoglobin concentrations for the diagnosis of anaemia and assessment of severity.* Vitamin and Mineral Nutrition Information System. Geneva, World Health Organization, 2011 (WHO/NMH/NHD/MNM/11.1).
- **Thresholds (Sea level)**:
  - **Non-pregnant women ($\ge 15$ years)**:
    - Normal: $\ge 12.0$ g/dL
    - Mild anaemia: $11.0 - 11.9$ g/dL
    - Moderate anaemia: $8.0 - 10.9$ g/dL
    - Severe anaemia: $< 8.0$ g/dL
  - **Pregnant women**:
    - Normal: $\ge 11.0$ g/dL
    - Mild anaemia: $10.0 - 10.9$ g/dL
    - Moderate anaemia: $7.0 - 9.9$ g/dL
    - Severe anaemia: $< 7.0$ g/dL
- **Connecting Logic**: If PBAC $\ge 100$ and Hb $< 12.0$ g/dL (or $< 11.0$ g/dL in pregnancy), connect results cautiously: *"Your heavy bleeding score and haemoglobin level suggest heavy bleeding may be contributing to iron deficiency. Please discuss this with a doctor to check ferritin and investigate the cause."*

---

### 3. Edinburgh Postnatal Depression Scale (EPDS)
- **Primary Source**: Cox JL, Holden JM, Sagovsky R. *Detection of postnatal depression. Development of the 10-item Edinburgh Postnatal Depression Scale.* Br J Psychiatry. 1987;150:782-786.
- **Indian Population Context**: Fernandes M et al. *Validation of the Edinburgh Postnatal Depression Scale in India.* BMC Psychiatry. 2021.
- **Threshold**: Total score $\ge 13$ indicates elevated risk of depression (pooled sensitivity 88.9%, specificity 93.4% at $\ge 13$).
- **Critical Safety Guard**: Item 10 evaluates thoughts of self-harm. Any score $> 0$ on Item 10 immediately triggers an urgent care/support intercept with Tele-MANAS (14416) and 108 emergency helpline.
- **Limitation**: Validated for screening depression, **not** anxiety or other mood disorders.

---

### 4. Danger Signs and Emergency Intercept
- **Source**: MoHFW / WHO Maternal and Gynaecological Emergency Danger Signs guidelines.
- **Triggers**:
  - Severe sudden lower abdominal or pelvic pain.
  - Soaking more than two large pads per hour for two consecutive hours.
  - Dizziness, fainting, confusion, or cold/clammy skin with bleeding.
  - High fever ($> 38.5^\circ\text{C}$ or $101.3^\circ\text{F}$) accompanied by pelvic pain or foul discharge.
  - Suicidal thoughts or acute urge to harm oneself or baby.
- **Action**: Immediate full-screen emergency takeover with direct button to call **108** and notify designated family/emergency contact. Never gated by login, steps, or credits.

---

### 5. Escalation and Referral Guidance
- **Source**: Shree IVF / Endometriosis Society Guidelines; NICE Guidelines on Heavy Menstrual Bleeding.
- **Triggers**:
  - Disruptive menstrual pain causing missed school/work across 3+ cycles.
  - PBAC score $> 100$ across 3+ consecutive cycles.
  - Post-menopausal bleeding (any bleeding 12+ months after menopause).
- **Recommendation**: Prompt doctor discussion script asking specifically about pelvic ultrasound and specialist referral (Gynaecologist).
