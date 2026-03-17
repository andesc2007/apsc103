import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from social import social_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(social_bp, url_prefix="/social")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "item_database.csv")


def load_database():
    df = pd.read_csv(DATA_PATH)
    df.columns = df.columns.str.lower().str.strip()
    df["product"] = df["product"].astype(str).str.strip()
    return df


def generate_suggestion(product_name):
    p = product_name.lower()

    if any(word in p for word in ["beef", "burger", "steak"]):
        return "Consider replacing beef with chicken, lentils, or tofu to significantly reduce emissions."

    if any(word in p for word in ["milk", "cheese", "butter", "cream"]):
        return "Dairy products often have a higher carbon footprint. Consider oat, soy, or almond-based alternatives."

    if "rice" in p:
        return "Rice production can create methane emissions. Consider grains such as quinoa or barley."

    if any(word in p for word in ["cake", "dessert", "cookie", "biscuit"]):
        return "Baked goods can have hidden emissions from eggs, dairy, and packaging. Consider lower-impact plant-based recipes."

    if "chicken" in p:
        return "Chicken has a lower footprint than beef, but plant-based proteins can reduce emissions even more."

    return "Buying seasonal, local, or minimally processed products can reduce carbon emissions."


def generate_alternative(product_name, total_carbon):
    p = product_name.lower()

    if any(word in p for word in ["beef", "burger", "steak"]):
        alt_name = "Tofu or lentils"
        alt_carbon = max(total_carbon * 0.2, 0.1)

    elif any(word in p for word in ["milk", "cheese", "butter", "cream"]):
        alt_name = "Oat milk or soy-based alternative"
        alt_carbon = max(total_carbon * 0.45, 0.1)

    elif "rice" in p:
        alt_name = "Quinoa or barley"
        alt_carbon = max(total_carbon * 0.6, 0.1)

    elif any(word in p for word in ["cake", "dessert", "cookie", "biscuit"]):
        alt_name = "Plant-based sponge cake"
        alt_carbon = max(total_carbon * 0.7, 0.1)

    else:
        alt_name = "A plant-based or minimally processed alternative"
        alt_carbon = max(total_carbon * 0.75, 0.1)

    savings = total_carbon - alt_carbon

    return {
        "name": alt_name,
        "carbon": alt_carbon,
        "savings": savings
    }


@app.route("/")
def home():
    return jsonify({"message": "Backend is running"})


@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "").lower().strip()

    if not query:
        return jsonify([])

    try:
        df = load_database()
        matches = df[df["product"].str.lower().str.contains(query, na=False)]
        product_names = matches["product"].drop_duplicates().head(8).tolist()
        return jsonify(product_names)

    except Exception as e:
        return jsonify({"error": f"Search failed: {str(e)}"}), 500


@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()

    product_name = str(data.get("product", "")).strip()
    amount = data.get("amount", 0)

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({"error": "Amount must be a valid number."}), 400

    if not product_name:
        return jsonify({"error": "No product provided."}), 400

    if amount <= 0:
        return jsonify({"error": "Amount must be greater than 0."}), 400

    try:
        df = load_database()
        match = df[df["product"].str.lower() == product_name.lower()]

        if match.empty:
            return jsonify({"error": "Product not found."}), 404

        row = match.iloc[0]
        carbon_per_kg = float(row["carbon"])
        total_carbon = carbon_per_kg * amount

        suggestion = generate_suggestion(row["product"])
        alternative = generate_alternative(row["product"], total_carbon)

        return jsonify({
            "product": row["product"],
            "amount": amount,
            "carbon_per_kg": carbon_per_kg,
            "total_carbon": total_carbon,
            "suggestion": suggestion,
            "alternative": alternative["name"],
            "alternative_carbon": alternative["carbon"],
            "savings": alternative["savings"]
        })

    except Exception as e:
        return jsonify({"error": f"Calculation failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)