def build_prompt(section, words, context):
    return f"""
You are a professional report writer.

Context:
{context}

Task:
Write content for section: {section}

Rules:
- Maintain structure
- Use headings properly
- Be clear and professional
- Avoid generic responses
- Stay relevant to context

Length:
{words} words
"""