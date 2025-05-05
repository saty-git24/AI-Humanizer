from flask import Flask, request, jsonify
from llama_cpp import Llama
import os
from flask_cors import CORS
import bcrypt
import jwt
import datetime
import mysql.connector

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'your-secret-key' 

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="mysql",
    database="humanizer"
)
cursor = db.cursor(dictionary=True)

# Helper: Create JWT token
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# Load the model from your local path
model_path = "./mistral-7b-instruct-v0.3-q5_k_m.gguf"  # Update this to your actual file path

llm = Llama(
    model_path=model_path,
    n_ctx=2048,
    n_threads=8,        # adjust to your CPU
    n_gpu_layers=0      # set > 0 if you're using GPU acceleration
)

# Paraphrasing prompt template
def paraphrase_with_prompt(text):
    prompt = f"""Paraphrase the given text in detail in humanlike way
    Text: {text}
    Paraphrased_Text:"""
    
    response = llm(
        prompt,
        max_tokens=1024,
        temperature=0.8,
        stop=["\n"]
    )
    output = response["choices"][0]["text"].strip()
    return output


# Register
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']

    # Check if user exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({'message': 'User already exists'}), 409

    # Hash password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert user
    cursor.execute("INSERT INTO users (username, password_hash, email) VALUES (%s, %s, %s)", (username, hashed, email))
    db.commit()

    return jsonify({'message': 'User registered successfully'}), 201


# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user['id'])
    return jsonify({'message': token})

# Logout (client-side should handle token deletion)
@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out (client must delete token)'}), 200

# API route
@app.route("/paraphrase", methods=["POST"])
def paraphrase():
    data = request.get_json()
    if "text" not in data:
        return jsonify({"error": "Missing 'text' in request"}), 400

    input_text = data["text"]
    result = paraphrase_with_prompt(input_text)
    return jsonify({"paraphrased_text": result})

# Run the app locally
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
