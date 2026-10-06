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

doc.add_heading("Executive summary", level=1)
doc.add_paragraph(
    "The committee is considering a shared AI data center for university members. We recommend Texas as the "
    "reference location and authorization of a bounded diligence stage, not construction or equipment procurement. "
    "Texas leads the weighted site comparison (3.60 versus 3.05 for Québec and Helsinki), chiefly because it "
    "reaches more of the modeled member demand within the 50 ms threshold. The 20 MW IT reference design implies "
    "25 MW at the facility and 219 GWh of annual electricity demand. That scale makes grid timing, power terms, "
    "resilience and contracted member demand decisive. Return for a capital decision only with a written utility "
    "schedule and cost, site-specific engineering, member commitments and priced delivery options."
)

doc.add_heading("1. Site selection: proximity gives Texas the lead", level=1)
doc.add_paragraph(
    "The same weighted rubric compares Texas, Québec and Helsinki; demand proximity carries the largest weight "
    "at 25%. In the modeled demand distribution, Texas places 62.3% of addressable demand inside a 50 ms round "
    "trip, versus 50.7% for Québec and 19.5% for Helsinki. This explains the score advantage, while the table "
    "remains a reference-site comparison rather than a final property decision."
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

doc.add_heading("2. Design: the grid and resilience set the gate", level=1)
doc.add_paragraph(
    "The planning baseline is 20 MW of IT demand at a PUE of 1.25, producing 25 MW of total facility demand. "
    "At 8,760 operating hours, the calculated annual energy requirement is 219 GWh. The major design choice is "
    "closed-loop, non-evaporative cooling. The electrical concept includes protected distribution, UPS ride-through "
    "and backup generation. A 48-hour outage at full facility demand implies 1,200 MWh of delivered backup energy "
    "before load shedding; the fuel plan, emissions permits and redundancy topology therefore require site-specific engineering."
)

investment_heading = doc.add_heading("3. Investment: stage capital against evidence", level=1)
investment_heading.paragraph_format.page_break_before = True
doc.add_paragraph(
    "Build-and-own, lease and phased hybrid structures are available for comparison in the decision explorer. "
    "The editable example assumes 0.5 months (about two weeks) to grid energization; its delay stress adds another two weeks. It shows "
    "how power price, utilization, PUE and delay affect pre-opening cash, operating cost, cost per productive "
    "GPU-hour and capital at risk. This is a sensitivity tool, not a capital approval case: vendor prices, "
    "financing terms, replacement schedules and contracted workloads must replace scenario inputs."
)
doc.add_paragraph(
    "Development equity funds the utility study, site control, member-demand survey and early design. Construction "
    "debt should follow a connection agreement, priced scope, permits and committed demand. Equipment financing "
    "should follow GPU procurement terms and defined operating service levels."
)

doc.add_heading("4. Conditions and reversal tests", level=1)
conditions = [
    "Get a written energization date and full connection cost for a specific Texas property; confirm large-load rules and curtailment terms.",
    "Complete resilience, backup-power, refuelling and closed-loop cooling engineering with permitting implications.",
    "Secure member demand commitments, a capacity policy and an acceptable power and carbon-attribute procurement plan.",
    "Obtain comparable priced build, lease and hybrid offers with financing and equipment replacement assumptions."
]
for item in conditions:
    p = doc.add_paragraph(style="List Bullet")
    p.add_run(item)
doc.add_paragraph(
    "Re-run the site rubric if Québec offers a materially earlier connection and durable delivered power rate, "
    "if member workloads favor batch training or East Coast latency, or if Texas interconnection terms weaken "
    "availability or economics. These are decision-changing tests, not reasons to commit capital now."
)

doc.add_heading("Conclusion and recommendation", level=1)
doc.add_paragraph(
    "Approve the bounded utility, site and member-demand diligence package. Keep Texas as the base case and "
    "Québec and Helsinki as live comparators. The project team should return with a property-specific grid and "
    "resilience design, member commitments and comparable priced delivery offers before requesting construction "
    "or equipment capital."
)

footer = sec.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
run = footer.add_run("Shared university AI infrastructure  |  Decision memo")
run.font.name = "Arial"
run.font.size = Pt(8)
run.font.color.rgb = RGBColor(99, 113, 122)

doc.save(OUTPUT)
print(OUTPUT)
