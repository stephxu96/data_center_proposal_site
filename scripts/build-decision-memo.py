"""Build the two-page memo from the application's shared model export."""
import json
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parents[1]
MODEL = json.loads((ROOT / "deliverables/model-results.json").read_text())
INPUT = MODEL["inputs"]
BASE = next(s for s in MODEL["scenarios"] if s["id"] == "base")
OPTIONS = {o["id"]: o for o in BASE["options"]}
REQUIRED = [s for s in MODEL["scenarios"] if s["id"] in ("base", "year-delay", "half-utilization", "low-utilization")]
if len(REQUIRED) != 3:
    raise ValueError("Expected base, year-delay, and half-utilization scenarios")
OUTPUT = ROOT / "deliverables/University_AI_Data_Center_Decision_Memo.docx"
def money(v): return f"${v:,.1f}m"
def dollars(v): return "Not defined" if v is None else f"${v:.2f}"

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Inches(8.5), Inches(11)
sec.top_margin, sec.bottom_margin = Inches(.60), Inches(.55)
sec.left_margin = sec.right_margin = Inches(.76)
for name, size, before, after in [("Normal", 9.8, 0, 5), ("Title", 18.5, 0, 7), ("Heading 1", 11.7, 9, 4)]:
    s = doc.styles[name]
    s.font.name, s.font.size = "Arial", Pt(size)
    s.font.color.rgb = RGBColor(0, 0, 0)
    s.font.bold = name != "Normal"
    s._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), "Arial")
    s._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), "Arial")
    s.paragraph_format.space_before, s.paragraph_format.space_after = Pt(before), Pt(after)
    s.paragraph_format.line_spacing = 1.06
    if name != "Normal": s.paragraph_format.keep_with_next = True
    for border in s._element.get_or_add_pPr().findall(qn("w:pBdr")):
        s._element.get_or_add_pPr().remove(border)
def p(text): return doc.add_paragraph(text)
def heading(text, new_page=False):
    para = doc.add_heading(text, 1)
    para.paragraph_format.page_break_before = new_page
    return para
def table(headers, rows, widths, size=8.7):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment, t.autofit = WD_TABLE_ALIGNMENT.CENTER, False
    for c, width in zip(t.columns, widths): c.width = Inches(width)
    for cell, text in zip(t.rows[0].cells, headers): cell.text = text
    t.rows[0]._tr.get_or_add_trPr().append(OxmlElement("w:tblHeader"))
    for values in rows:
        for cell, text in zip(t.add_row().cells, values): cell.text = str(text)
    for i, row in enumerate(t.rows):
        for j, (cell, width) in enumerate(zip(row.cells, widths)):
            cell.width, cell.vertical_alignment = Inches(width), WD_CELL_VERTICAL_ALIGNMENT.CENTER
            tcpr = cell._tc.get_or_add_tcPr()
            shade = OxmlElement("w:shd")
            shade.set(qn("w:fill"), "153747" if i == 0 else ("F1F5F5" if i % 2 == 0 else "FFFFFF"))
            tcpr.append(shade)
            margins, borders = OxmlElement("w:tcMar"), OxmlElement("w:tcBorders")
            for edge in ("top", "bottom", "left", "right"):
                e = OxmlElement(f"w:{edge}"); e.set(qn("w:w"), "60"); e.set(qn("w:type"), "dxa"); margins.append(e)
                e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "4"); e.set(qn("w:color"), "D9D9D9"); borders.append(e)
            tcpr.append(margins); tcpr.append(borders)
            for para in cell.paragraphs:
                para.paragraph_format.space_after, para.paragraph_format.line_spacing = Pt(0), 1.02
                if j > 0: para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                for run in para.runs:
                    run.font.size, run.bold = Pt(size), i == 0
                    run.font.color.rgb = RGBColor(255, 255, 255) if i == 0 else RGBColor(0, 0, 0)
    return t

doc.add_paragraph("Shared University AI Infrastructure Decision Memo", "Title")
p("To: University investment committee   From: Project team   Date: October 6 2026")
heading("Executive summary")
p("We recommend sending the full 25 MW build back for evidence while approving bounded diligence and competitively priced leased access. Retain a phased hybrid as the preferred expansion path. The brief establishes interest but no signed long-term commitments and no firm grid price or energization date. Texas leads the site rubric, but that does not establish that 25 MW is justified. Lease first to measure productive use, then release owned capacity against signed demand, a priced utility agreement and a validated resilience design. The ten-year comparisons make early ownership and unused-capacity costs explicit.")
heading("Demand and location")
hours = INPUT["gpuCount"] * INPUT["operatingHours"] * INPUT["utilizationPct"] / 100 * INPUT["availabilityPct"] / 100
p(f"The planning case assumes {INPUT['gpuCount']:,} GPUs, {INPUT['utilizationPct']:g}% productive utilization and {INPUT['availabilityPct']:g}% availability, or {hours/1e6:.2f} million productive GPU-hours per full operating year. These are assumptions, not orders. Survey training-cluster sizes, teaching timetables, inference demand, security needs and existing capacity before choosing scale. Texas scores 3.60/5 versus 3.05 for Québec and Helsinki. Demand proximity contributes 25% of the rubric; modeled demand within 50 ms is 62.3%, 50.7% and 19.5%, respectively. Validate campus-specific latency rather than treating city proxies as commitments.")
heading("Technical concept and external effects")
power = INPUT["itLoadMw"] * INPUT["pue"]
energy = power * INPUT["operatingHours"] / 1000
p(f"The reference design is {INPUT['itLoadMw']:g} MW IT at PUE {INPUT['pue']:g}: {power:g} MW total site demand and {energy:g} GWh/year. It includes protected distribution, UPS ride-through, standby generation, closed-loop non-evaporative cooling, diverse networking and checkpoint storage. Isolation and remaining capacity must sustain critical load after the largest component fails; otherwise shed lower-priority workloads. A 48-hour grid outage requires {power*48:,.0f} MWh at full facility load, with fuel and refuelling matched to that duty. Renewable contracts receive no firm outage credit without hourly delivery evidence. Check drought exposure, noise, emissions, grid-upgrade allocation and effects on other customers before permitting.")
heading("Ownership governance and financing")
p("The consortium should own any approved facility and its data-access policy, and contract construction, utility supply, specialist maintenance and overflow compute. A representative board sets prices and admits members; a scientific panel resolves research and teaching conflicts. Proposed policy reserves 20% for small institutions and teaching, caps one member at 35% of discretionary capacity, releases unused reservations, and charges fixed costs by reservation and variable costs by metered use. Seek development equity for bounded studies; require grid terms, permits and demand before construction debt, then equipment terms and service levels before GPU financing. Sponsors carry delay risk until contractually transferred. Withdrawal requires replacement demand or payment of unrecovered commitments.")

heading("Ten year economics and required stress cases", True)
b = OPTIONS["build"]
p(f"All figures below are planning calculations in nominal USD. Build capital of {money(INPUT['buildCapexMillions'])} separates facility {money(b['facilityCapital'])}, grid {money(b['gridCapital'])}, land {money(b['landCapital'])} and GPUs {money(b['gpuCapital'])}. The model includes electricity, staff, maintenance, other operations, debt interest, replacement every {INPUT['replacementYears']:g} years and member charges. Productive-hour cost includes ten-year cost and opening delays. NPV uses a {INPUT['discountRatePct']:g}% discount rate.")
rows = []
for scenario in REQUIRED:
    label = "Base" if scenario["id"] == "base" else ("Half utilization" if "util" in scenario["id"] else "+12 months")
    for o in scenario["options"]:
        rows.append([f"{label} / {o['id'].title()}", money(o["beforeOpeningWithDelay"]), money(o["annual"]), dollars(o["costPerProductiveHour"]), money(o["capitalAtRiskWithDelay"])])
table(["Case and path", "Cash before\nopening", "Annual\noperations", "Cost per\nGPU hour", "Capital\nat risk"], rows, [2.05, 1.2, 1.12, 1.09, 1.52])
p(f"Base delay is {INPUT['gridDelayMonths']:g} months (about two weeks) after planned construction. The +12-month case adds one year; half utilization is {INPUT['utilizationPct']/2:g}%. Operations are the full-service run rate. Capital at risk is modeled year-three loss on spent capital plus delay and interest, after the assumed salvage allowance. Idle capacity is allocated, not counted twice: build's annual allocation is {money(b['annualUnusedCapacityCost'])}. The app retains a separate +3-month sensitivity.")
heading("Three findings most likely to change the recommendation")
p("1. Signed productive demand at acceptable member prices could justify earlier ownership; persistently low use favors leasing or a smaller facility.\n2. A binding grid offer with an earlier date, lower delivered cost or different curtailment terms could change the delivery path and country.\n3. Site-specific failure and cooling studies, with priced build and lease offers, could overturn assumed uptime, PUE or ownership economics.")
heading("Evidence needed to verify uptime")
p(f"The {INPUT['availabilityPct']:g}% availability input is a planning assumption. Agree targets by workload, then verify electrical single lines, failure/repair rates and common-mode risks, maintenance, transfer times, UPS duration, generator derating and black-start tests, 48-hour fuel arrangements, cooling at peak temperature and network/storage recovery. Measure delivered workload availability, not grid reliability alone.")
heading("Conclusion and recommendation")
p("Approve capped diligence and leased access. Send the full build back for signed demand, binding grid terms and priced resilient options. Retain Texas as the reference location and Québec and Helsinki as comparators. Return for capital approval only when those findings support a scale and risk allocation members will accept.")
source = p("Basis: challenge brief pp. 2–3; Phase 1 site rubric; site Evidence catalog; shared model export " + MODEL["generatedAt"] + ".")
for run in source.runs: run.font.size = Pt(7.6)
doc.save(OUTPUT)
print(OUTPUT)
