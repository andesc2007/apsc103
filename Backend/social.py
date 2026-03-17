from flask import Blueprint, jsonify

social_bp = Blueprint("social", __name__)

users = {
    "Sophie": {
        "weekly_carbon": 18.4
    },
    "Sara": {
        "weekly_carbon": 15.2
    },
    "Mahek": {
        "weekly_carbon": 21.7
    },
    "Hana": {
        "weekly_carbon": 12.9
    }
}

def get_leaderboard():
    leaderboard = []

    for name, info in users.items():
        leaderboard.append({
            "name": name,
            "weekly_carbon": info["weekly_carbon"]
        })

    leaderboard.sort(key=lambda user: user["weekly_carbon"])
    return leaderboard

@social_bp.route("/leaderboard", methods=["GET"])
def leaderboard():
    return jsonify(get_leaderboard())