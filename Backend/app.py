import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend is running"

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "").lower().strip()

    if not query:
        return jsonify([])

    df = pd.read_csv("data/item_database.csv")
    df.columns = df.columns.str.lower().str.strip()
    df["product"] = df["product"].astype(str).str.strip()

    matches = df[df["product"].str.lower().str.contains(query, na=False)]
    product_names = matches["product"].drop_duplicates().head(8).tolist()

    return jsonify(product_names)

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()

    product_name = data.get("product", "").strip()
    amount = data.get("amount", 0)

    if not product_name:
        return jsonify({"error": "No product provided."}), 400

    if amount <= 0:
        return jsonify({"error": "Amount must be greater than 0."}), 400

    df = pd.read_csv("data/item_database.csv")
    df.columns = df.columns.str.strip().str.lower()
    df["product"] = df["product"].astype(str).str.strip()

    match = df[df["product"].str.lower() == product_name.lower()]

    if match.empty:
        return jsonify({"error": "Product not found."}), 404

    row = match.iloc[0]
    carbon_per_kg = float(row["carbon"])
    total_carbon = carbon_per_kg * float(amount)

    return jsonify({
        "product": row["product"],
        "amount": amount,
        "carbon_per_kg": carbon_per_kg,
        "total_carbon": total_carbon
    })

if __name__ == "__main__":
    app.run(debug=True)