from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)   # Creates the actual application
CORS(app)               # Ensures that the app can run in a web browser

@app.route("/") # Once someone visits the home page, this function will run
def home():
    return "Backend is running"

@app.route("/calculate", methods=["POST"]) #When /calculate is fetched, this function will run
def calculate():
    data = request.json
    product = data["product"] # Receives product pushed by JS function

    # Fake test calculation for now. Will be updated to support logic.py and csv files, MAYBE an API?
    carbon_value = len(product) * 2

    return jsonify({ # Returns the carbon value to the frontend
        "product": product,
        "carbon": carbon_value
    })

if __name__ == "__main__":
    app.run(debug=True)