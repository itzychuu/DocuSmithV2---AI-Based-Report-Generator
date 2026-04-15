from fastapi import FastAPI, UploadFile, File, Body, Form
from fastapi.staticfiles import StaticFiles
import shutil
import os
from rag.pipeline import rag_pipeline
from rag.generator import generate
from rag.extractor import extract_text
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from exporter import export_docx, export_pdf, export_txt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

SUPPORTED_EXTENSIONS = (".pdf", ".docx", ".txt", ".js", ".jsx", ".py")


def save_and_extract(upload_file: UploadFile) -> str:
    """Save an uploaded file to disk and extract its text. Returns extracted text."""
    try:
        if not upload_file or not upload_file.filename:
            return ""
        ext = os.path.splitext(upload_file.filename)[1].lower()
        if ext not in SUPPORTED_EXTENSIONS:
            return f"[Unsupported file type: {ext}. Please upload pdf, docx, or txt.]"
        file_path = f"{UPLOAD_FOLDER}/{upload_file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        text = extract_text(file_path)
        if not text or not text.strip():
            return "[Could not extract text from file]"
        # Final safety: reject text that looks like binary garbage
        printable = sum(1 for c in text[:500] if c.isprintable() or c in '\n\r\t')
        if printable / max(len(text[:500]), 1) < 0.7:
            return "[File appears to contain binary data. Please upload a readable document.]"
        return text
    except Exception as e:
        print(f"EXTRACT ERROR: {e}")
        return "[Unable to read file. Please upload a valid document.]"


# ─── /generate (legacy RAG pipeline endpoint) ───────────────────────────────

@app.post("/generate")
async def generate_from_file(file: UploadFile = File(...), section: str = "", words: int = 100):
    try:
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        output = rag_pipeline(file_path, section, words)
        return {"output": output}
    except Exception as e:
        return {"output": "Error generating content. Please try again."}


# ─── /generate-text (Proposal Drafter — smart chat mode) ─────────────────────

@app.post("/generate-text")
async def generate_text(data: dict = Body(...)):
    user_input = data.get("prompt", "").strip()

    if not user_input:
        return {"output": "Please enter a message."}

    try:
        prompt = f"""You are SuDOCU, a smart AI assistant specializing in document creation and proposals.

BEHAVIOR RULES:
- If the user sends a greeting (hello, hi, hey, etc.) → respond warmly and conversationally. Ask how you can help.
- If the user asks a question → answer it clearly and helpfully.
- If the user asks to draft, write, or create a proposal → generate a structured proposal using the format below.
- Do NOT always generate a proposal. Only do so when the user explicitly requests one.

PROPOSAL FORMAT (use ONLY when user requests a proposal):
Title
<paragraph>

Introduction
<paragraph>

Objectives
<paragraph>

Proposed Solution
<paragraph>

Benefits
<paragraph>

Conclusion
<paragraph>

FORMATTING RULES FOR PROPOSALS:
- Use EXACTLY those section headings
- Each section: 1-2 clear paragraphs
- Blank line between sections
- Professional, formal language
- Do NOT add extra sections

Be natural and conversational like ChatGPT. Do NOT be robotic.

USER MESSAGE:
{user_input}"""

        return {"output": generate(prompt)}
    except Exception as e:
        return {"output": "Error generating content. Please try again."}


# ─── /replace (Replace Content) ──────────────────────────────────────────────

@app.post("/replace")
async def replace_content(
    content: str = Form(""),
    instructions: str = Form(""),
    reference: str = Form(""),
    content_file: UploadFile = File(None),
    reference_file: UploadFile = File(None),
):
    try:
        # Extract text from uploaded files if provided
        final_content = content.strip()
        if content_file and content_file.filename:
            extracted = save_and_extract(content_file)
            if extracted.startswith("["):
                return {"output": extracted.strip("[]")}
            final_content = extracted

        final_reference = reference.strip()
        if reference_file and reference_file.filename:
            extracted_ref = save_and_extract(reference_file)
            if not extracted_ref.startswith("["):
                final_reference = extracted_ref

        if not final_content:
            return {"output": "Unable to read file. Please upload a valid document or paste your content."}

        prompt = f"""You are a professional document editor.

TASK:
Rewrite the content below using the reference provided.

STRICT RULES:
- DO NOT include any raw file formats, PDF syntax, binary data, or metadata in the output
- DO NOT output anything that is not clean human-readable text
- DO NOT output error messages or warnings
- DO NOT change any headings or section titles — keep them EXACTLY as they appear
- ONLY rewrite and improve the paragraph text under each heading
- Maintain the EXACT SAME order and structure as the original
- Make content more professional, clear, and detailed
- Add a blank line between each section for readability
- Output must use the SAME headings from the original content
- If content is unclear, still generate the best possible structured output

CONTENT TO REWRITE:
{final_content[:4000]}

REFERENCE MATERIAL:
{final_reference[:2000] if final_reference else "No reference provided — improve based on general knowledge."}

ADDITIONAL INSTRUCTIONS:
{instructions if instructions else "None provided."}"""

        return {"output": generate(prompt)}
    except Exception as e:
        print(f"REPLACE ERROR: {e}")
        return {"output": "Error generating content. Please try again."}


# ─── /generate-report (Report Generator) ─────────────────────────────────────

@app.post("/generate-report")
async def generate_report(
    file: UploadFile = File(None),
    structure: str = Form("")
):
    try:
        file_text = ""
        if file and file.filename:
            file_text = save_and_extract(file)
            if file_text.startswith("[Unsupported") or file_text.startswith("[Unable"):
                return {"output": file_text.strip("[]")}

        content_source = (
            f"Use ONLY the following uploaded content as your source:\n\n{file_text[:4000]}"
            if file_text.strip() and not file_text.startswith("[")
            else "Generate content based on general knowledge relevant to each heading."
        )

        prompt = f"""You are generating a structured report.

STRICT RULES:
- ONLY use the exact headings and subheadings listed in the STRUCTURE below
- DO NOT add any new headings beyond what is listed
- DO NOT rename, merge, reorder, or skip any heading
- DO NOT add extra sections — if you generate extra sections, the output is INVALID
- DO NOT output raw file data, PDF syntax, binary content, or metadata

CONTENT RULES:
- Each section must strictly follow the word limit provided next to that heading
- If a heading says [100 words] → generate approximately 90–110 words ONLY for that section
- Do NOT exceed the word limit
- If no word limit is given, write 1-2 focused paragraphs per section

FORMAT:
Heading
<paragraph>

Subheading
<paragraph>

- Separate each section with a blank line
- Keep content relevant, professional and clean
- Output the heading name, then immediately its paragraph(s) below it

STRUCTURE (use ONLY these headings):
{structure if structure.strip() else "Introduction\nBody\nConclusion"}

CONTENT SOURCE:
{content_source}"""

        return {"output": generate(prompt)}
    except Exception as e:
        print(f"REPORT ERROR: {e}")
        return {"output": "Error generating content. Please try again."}


# ─── /export/{type} ──────────────────────────────────────────────────────────

@app.post("/export/{type}")
async def export(type: str, data: dict = Body(...)):
    try:
        content = data.get("content", "")

        if type == "docx":
            file = export_docx(content)
        elif type == "pdf":
            file = export_pdf(content)
        else:
            file = export_txt(content)

        return FileResponse(file, filename=file, media_type="application/octet-stream")
    except Exception as e:
        return {"error": "Export failed. Please try again."}

import os
if os.path.exists("../frontend/dist"):
    app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)