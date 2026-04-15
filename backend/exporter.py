from docx import Document
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def export_docx(content):
    file_name = "output.docx"
    doc = Document()
    doc.add_paragraph(content)
    doc.save(file_name)
    return file_name


def export_pdf(content):
    file_name = "output.pdf"
    doc = SimpleDocTemplate(file_name)
    styles = getSampleStyleSheet()

    story = []
    for line in content.split("\n"):
        story.append(Paragraph(line, styles["Normal"]))
        story.append(Spacer(1, 10))

    doc.build(story)
    return file_name


def export_txt(content):
    file_name = "output.txt"
    with open(file_name, "w", encoding="utf-8") as f:
        f.write(content)
    return file_name