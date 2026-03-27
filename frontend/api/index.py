from datetime import datetime
from flask import Flask, jsonify, request
from rating_system import Specialist
from recommendations import recommend_specialist

app = Flask(__name__)


@app.route("/api/ai/", methods=["GET", "HEAD"])
def health_check():
    return jsonify({"status": "healthy", "service": "MediConnect AI Engine"}), 200


@app.route("/api/ai/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    symptoms = data.get("symptoms", "")
    result = recommend_specialist(symptoms)
    return jsonify({"specialist": result})


@app.route("/api/ai/specialist/rating", methods=["POST"])
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
        doctor.ratings.append((star, datetime.fromisoformat(date_str.replace('Z', '+00:00'))))

    score = doctor.calculate_trust_score()
    label = doctor.get_trust_label()

    return jsonify({"trust_score": score, "trust_label": label})


@app.route("/api/ai/specialist/ratings/batch", methods=["POST"])
def get_ratings_batch():
    try:
        data = request.get_json()
        specialists_data = data.get("specialists", [])
        results = []

        for s in specialists_data:
            name = s.get("name")
            specialisation = s.get("specialisation")
            consultations = s.get("total_consultations", 0)
            ratings = s.get("ratings", [])

            doctor = Specialist(
                name=name, specialization=specialisation,
                total_consultations=consultations
            )

            for star, date_str in ratings:
                doctor.ratings.append((star, datetime.fromisoformat(date_str.replace('Z', '+00:00'))))

            score = doctor.calculate_trust_score()
            label = doctor.get_trust_label()
            
            results.append({
                "specialistId": s.get("id"),
                "trust_score": score,
                "trust_label": label
            })

        return jsonify({"success": True, "results": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.errorhandler(404)
def resource_not_found(e):
    return jsonify({
        "success": False,
        "error": "Not Found in AI Engine",
        "path": request.path,
        "help": "If you see this, the request reached the AI Engine but the flask route didn't match."
    }), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
