from flask import Flask, request, jsonify
from flask_cors import CORS

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