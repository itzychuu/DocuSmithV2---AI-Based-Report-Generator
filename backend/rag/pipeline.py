from .extractor import extract_text
from .generator import generate
from .prompt import build_prompt

def rag_pipeline(file_path, section, words):
    text = extract_text(file_path)

    context = text[:3000] if text.strip() else "No file content provided. Generate based on general knowledge."

    prompt = build_prompt(section, words, context)

    return generate(prompt)