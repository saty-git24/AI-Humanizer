from flask import Flask, request, jsonify
from llama_cpp import Llama
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
