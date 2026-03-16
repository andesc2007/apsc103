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
    df.columns = df.columns.str.strip().str.lower()
    df["product"] = df["product"].astype(str).str.strip()

    matches = df[df["product"].str.lower().str.contains(query, na=False)]
    product_names = matches["product"].drop_duplicates().head(8).tolist()

    return jsonify(product_names)

if __name__ == "__main__":
    app.run(debug=True)