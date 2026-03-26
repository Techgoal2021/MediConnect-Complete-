from datetime import datetime
from flask import Flask, jsonify, request
from rating_system import Specialist
from recommendations import recommend_specialist

app = Flask(__name__)


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    symptoms = data.get("symptoms", "")
    result = recommend_specialist(symptoms)
    return jsonify({"specialist": result})


@app.route("/specialist/rating", methods=["POST"])
def get_rating():
    data = request.get_json()
    name = data.get("name")
    specialisation = data.get("specialisation")
    consultations = data.get("total_consultations", 0)
    ratings = data.get("ratings", [])

    doctor = Specialist(
        name=name, specialization=specialisation,
        total_consultations=consultations
    )

    for star, date_str in ratings:
        doctor.ratings.append((star, datetime.fromisoformat(date_str)))

    score = doctor.calculate_trust_score()
    label = doctor.get_trust_label()

    return jsonify({"trust_score": score, "label": label})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
