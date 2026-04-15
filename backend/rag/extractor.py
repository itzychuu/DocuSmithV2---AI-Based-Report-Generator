import re
from pypdf import PdfReader
import docx


def _clean_text(text: str) -> str:
    """Remove binary data, PDF syntax artifacts, and metadata noise."""
    # Remove lines that look like PDF object syntax or binary headers
    lines = text.splitlines()
    clean_lines = []
    for line in lines:
        stripped = line.strip()
        # Skip empty or very short lines that are just noise
        if not stripped:
            clean_lines.append('')
            continue
        # Skip PDF binary/header signatures
        if stripped.startswith('%PDF') or stripped.startswith('%%EOF'):
            continue
        # Skip lines containing only non-printable or symbol-heavy content
        printable_ratio = sum(1 for c in stripped if c.isprintable() and not c in '\\/<>[]{}()') / max(len(stripped), 1)
        if printable_ratio < 0.5:
            continue
        # Skip lines that look like PDF object definitions (e.g., "3 0 obj", "endobj", "stream")
        if re.match(r'^\d+ \d+ obj$', stripped) or stripped in ('endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref'):
            continue
        clean_lines.append(line)

    # Collapse multiple blank lines into one
    result = re.sub(r'\n{3,}', '\n\n', '\n'.join(clean_lines))
    return result.strip()


def extract_text(file_path: str) -> str:
    try:
        ext = file_path.rsplit('.', 1)[-1].lower()

        if ext == 'pdf':
            reader = PdfReader(file_path)
            pages_text = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    pages_text.append(page_text)
            raw = '\n'.join(pages_text)
            return _clean_text(raw)

        elif ext == 'docx':
            doc_obj = docx.Document(file_path)
            paragraphs = [p.text for p in doc_obj.paragraphs if p.text.strip()]
            return _clean_text('\n'.join(paragraphs))

        elif ext in ('txt', 'js', 'jsx', 'py'):
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return _clean_text(f.read())

        else:
            return ''

    except Exception as e:
        print('EXTRACT ERROR:', e)
        return ''