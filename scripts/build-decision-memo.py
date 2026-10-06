from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "deliverables" / "University_AI_Data_Center_Decision_Memo.docx"
OUTPUT.parent.mkdir(exist_ok=True)

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Inches(8.5), Inches(11)
sec.top_margin = Inches(.75)
sec.bottom_margin = Inches(.68)
sec.left_margin = Inches(.9)
sec.right_margin = Inches(.9)

styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Arial"
normal.font.size = Pt(10.5)
normal.font.color.rgb = RGBColor(28, 40, 48)
normal._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), "Arial")
normal._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), "Arial")
normal.paragraph_format.space_after = Pt(7)
normal.paragraph_format.line_spacing = 1.12
for name, size, before, after in [("Title", 21, 0, 10), ("Heading 1", 12.5, 13, 5), ("Heading 2", 11, 9, 4)]:
    s = styles[name]
    s.font.name = "Arial"
    s.font.size = Pt(size)
    s.font.bold = True
    s.font.color.rgb = RGBColor(0, 0, 0)
    s._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), "Arial")
    s._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), "Arial")
    s.paragraph_format.space_before = Pt(before)
    s.paragraph_format.space_after = Pt(after)
    s.paragraph_format.keep_with_next = True
    if name == "Title":
        pPr = s._element.get_or_add_pPr()
        for border in pPr.findall(qn("w:pBdr")):
            pPr.remove(border)

title = doc.add_paragraph(style="Title")
title.add_run("Shared University AI Data Center Decision Memo")

meta = doc.add_paragraph()
meta.paragraph_format.space_after = Pt(14)
for label, value in [("To", "University investment committee"), ("From", "Project team"), ("Date", "October 6, 2026"), ("Subject", "Texas reference site and next funding gate")]:
    run = meta.add_run(f"{label}: ")
    run.bold = True
    meta.add_run(value)
    if label != "Subject":
        meta.add_run("\n")

doc.add_heading("Decision requested", level=1)
doc.add_paragraph(
    "Authorize the next stage of site, utility and member-demand diligence for a shared AI data center in Texas. "
    "Do not authorize full construction or equipment procurement yet. The current comparison favors Texas, but "
    "a binding capital decision depends on a written grid schedule and cost, a site-specific resilience design, "
    "committed member demand and priced vendor offers."
)

doc.add_heading("Why Texas leads", level=1)
doc.add_paragraph(
    "The project compared Texas, Québec and Helsinki using one weighted rubric. Texas scores 3.60; the other two "
    "reference locations each score 3.05. Demand proximity has the largest weight. In the modeled demand distribution, "
    "Texas places 62.3% of addressable demand inside a 50 ms round trip, compared with 50.7% for Québec and 19.5% "
    "for Helsinki. These scores are planning judgments, not utility bids or a final property selection."
)
table = doc.add_table(rows=1, cols=3)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
table.style = "Table Grid"
for cell, text in zip(table.rows[0].cells, ["Reference site", "Weighted score", "Demand within 50 ms"]):
    cell.text = text
for row in [("Texas, United States", "3.60", "62.3%"), ("Québec, Canada", "3.05", "50.7%"), ("Helsinki, Finland", "3.05", "19.5%")]:
    cells = table.add_row().cells
    for cell, text in zip(cells, row):
        cell.text = text
for i, row in enumerate(table.rows):
    for cell in row.cells:
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        tcPr = cell._tc.get_or_add_tcPr()
        shd = OxmlElement("w:shd")
        shd.set(qn("w:fill"), "153747" if i == 0 else ("F0F5F5" if i % 2 == 0 else "FFFFFF"))
        tcPr.append(shd)
        for p in cell.paragraphs:
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.space_before = Pt(3)
            for run in p.runs:
                run.font.size = Pt(9.5)
                if i == 0:
                    run.bold = True
                    run.font.color.rgb = RGBColor(255, 255, 255)

doc.add_heading("Reference design", level=1)
doc.add_paragraph(
    "The planning baseline is 20 MW of IT demand at a PUE of 1.25, producing 25 MW of total facility demand. "
    "At 8,760 operating hours, the calculated annual energy requirement is 219 GWh. The major design choice is "
    "closed-loop, non-evaporative cooling. The electrical concept includes protected distribution, UPS ride-through "
    "and backup generation. A 48-hour grid outage at full facility demand would require 1,200 MWh of delivered energy "
    "before any load shedding. The fuel plan, emissions permits and actual redundancy topology need engineering work."
)

doc.add_heading("Conditions for the next gate", level=1)
conditions = [
    "Obtain a written utility energization timeline and the full connection cost for a specific property.",
    "Confirm applicable large-load rules, curtailment obligations and operating flexibility.",
    "Complete the site-specific resilience, backup-power and refuelling studies.",
    "Preserve the closed-loop cooling requirement through vendor design and permitting.",
    "Agree a procurement plan for electricity and carbon attributes that member institutions can accept.",
    "Secure member demand commitments and a capacity policy that protects smaller institutions."
]
for item in conditions:
    p = doc.add_paragraph(style="List Bullet")
    p.add_run(item)

investment_heading = doc.add_heading("Investment path", level=1)
investment_heading.paragraph_format.page_break_before = True
doc.add_paragraph(
    "Build-and-own, lease and phased hybrid structures are available for comparison in the decision explorer. "
    "Its editable example demonstrates how power price, utilization, PUE and grid delay affect cash before opening, "
    "annual operating cost, cost per productive GPU-hour and capital at risk. The example inputs are scenario "
    "assumptions. Vendor quotes, financing terms, replacement schedules and contracted workloads are required "
    "before the committee can use a ten-year cash flow to approve capital."
)
doc.add_paragraph(
    "Development equity should fund the utility study, site control, demand survey and early design. Construction "
    "debt follows a connection agreement, priced scope, permits and committed demand. Equipment financing follows "
    "GPU procurement terms and operating service levels."
)

doc.add_heading("What would reverse the recommendation", level=1)
doc.add_paragraph(
    "A materially earlier Québec connection paired with a durable delivered power rate could change the site result. "
    "So could a member workload mix dominated by batch training, stronger East Coast latency needs, or Texas "
    "interconnection terms that reduce availability or increase cost. The committee should revisit the same rubric "
    "when those answers arrive."
)

doc.add_heading("Next action", level=1)
doc.add_paragraph(
    "Commission the utility and member-demand work, obtain priced build and lease proposals, and return to the "
    "committee with a site-specific gate package. Keep the Texas reference design as the base case while the "
    "alternative locations remain live comparators."
)

footer = sec.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
run = footer.add_run("Shared university AI infrastructure  |  Decision memo")
run.font.name = "Arial"
run.font.size = Pt(8)
run.font.color.rgb = RGBColor(99, 113, 122)

doc.save(OUTPUT)
print(OUTPUT)
