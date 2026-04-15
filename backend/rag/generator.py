import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

def generate(prompt):
    if not API_KEY:
        return "❌ Missing OpenRouter API Key"

    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "meta-llama/llama-3-8b-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        result = response.json()

        print("AI RESPONSE:", result)

        if "choices" in result:
            return result["choices"][0]["message"]["content"]

        elif "error" in result:
            return f"❌ OpenRouter Error: {result['error']['message']}"

        else:
            return f"❌ Unknown Response: {result}"

    except Exception as e:
        return f"❌ Request Failed: {str(e)}"