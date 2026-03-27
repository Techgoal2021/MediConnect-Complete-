_SPECIALIST_SYMPTOMS = {
    "Cardiologist": [
        "chest pain",
        "heart palpitations",
        "shortness of breath",
        "high blood pressure",
        "dizziness",
    ],
    "Dermatologist": [
        "rash",
        "acne",
        "itching",
        "skin irritation",
        "hair loss"
    ],
    "Gastroenterologist": [
        "stomach pain",
        "nausea",
        "bloating",
        "diarrhea",
        "acid reflux",
    ],
    "Neurologist": [
        "headache",
        "migraine",
        "numbness",
        "seizures",
        "memory loss"
    ],
    "Orthopedist": [
        "joint pain",
        "back pain",
        "knee pain",
        "muscle pain",
        "stiffness",
    ],
    "Pulmonologist": [
        "cough",
        "wheezing",
        "chest tightness",
        "difficulty breathing",
        "asthma",
    ],
    "ENT Specialist": [
        "sore throat",
        "ear pain",
        "nasal congestion",
        "hearing loss",
        "sinusitis",
    ],
    "Psychiatrist": [
        "anxiety",
        "depression",
        "insomnia",
        "mood swings",
        "panic attacks",
    ],
    "Ophthalmologist": [
        "blurred vision",
        "eye pain",
        "red eyes",
        "eye strain",
        "watery eyes",
    ],
    "General Practitioner": [
        "fever",
        "fatigue",
        "weakness",
        "loss of appetite",
        "flu",
    ],
}


def recommend_specialist(symptoms: str) -> str:
    symptoms = symptoms.lower()
    scores = {}

    for specialist, symptom_list in _SPECIALIST_SYMPTOMS.items():
        score = sum(1 for symptom in symptom_list if symptom in symptoms)
        if score > 0:
            scores[specialist] = score

    if not scores:
        return "General Practitioner"

    return max(scores, key=lambda specialist: scores[specialist])
