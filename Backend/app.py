import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend is running"

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.json
    product = data["product"]

    carbon_value = len(product)

    return jsonify({
        "product": product,
        "carbon": carbon_value
    })

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "").lower()

    if not query:
        return jsonify([])
    
    CSV_PATH = os.path.join("data", "item_database.csv")
    df = pd.read_csv(CSV_PATH)

    df["product"] = df["product"].str.strip()
    matches = df[df["product"].str.lower().str.contains(query, na=False)]

    product_names = matches["product"].drop_duplicates().head(8).tolist()

    return jsonify(product_names)