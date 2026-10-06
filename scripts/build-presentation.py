"""Build the eight-slide committee deck from deliverables/model-results.json.

A python-pptx port of scripts/build-presentation.mjs (which needs a Codex-only runtime).
Same slides, wording, positions (1280x720 px canvas) and speaker notes.
Run: python scripts/build-presentation.py   (needs python-pptx)
"""
import json
from pathlib import Path
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.oxml.ns import qn
from pptx.util import Emu, Pt

ROOT = Path(__file__).resolve().parents[1]
MODEL = json.loads((ROOT / "deliverables/model-results.json").read_text())
I = MODEL["inputs"]
REQUIRED = [s for s in MODEL["scenarios"] if s["id"] in ("base", "year-delay", "half-utilization")]
if len(REQUIRED) != 3:
    raise ValueError("Export must contain the three required scenarios")
B = next(o for o in REQUIRED[0]["options"] if o["id"] == "build")
OUTPUT = ROOT / "deliverables/University_AI_Data_Center_Customer_Presentation.pptx"
SITE = "https://global-datacenter-design-explorer-test.stephxu700296.chatgpt.site"

F = "Helvetica Neue"
NAVY, TEAL, INK, MUTED, WHITE, MINT = "071C29", "078E83", "14212B", "63717A", "FFFFFF", "D9F4ED"
px = lambda v: Emu(round(v * 9525))  # 1280 px canvas -> 12,192,000 EMU
rgb = RGBColor.from_string
money = lambda v: f"${v:.1f}m"
dollars = lambda v: "Not defined" if v is None else f"${v:.2f}"
num = lambda v: f"{v:g}"

prs = Presentation()
prs.slide_width, prs.slide_height = px(1280), px(720)
blank = prs.slide_layouts[6]


def txt(s, text, x, y, w, h, size, color=INK, bold=False):
    box = s.shapes.add_textbox(px(x), px(y), px(w), px(h))
    tf = box.text_frame
    tf.word_wrap, tf.auto_size, tf.vertical_anchor = True, MSO_AUTO_SIZE.NONE, MSO_ANCHOR.TOP
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    for k, line in enumerate(text.split("\n")):
        para = tf.paragraphs[0] if k == 0 else tf.add_paragraph()
        run = para.add_run()
        run.text = line
        run.font.name, run.font.size, run.font.bold = F, Pt(size * 0.75), bold
        run.font.color.rgb = rgb(color)
    return box


def slide(title, n, dark=False):
    s = prs.slides.add_slide(blank)
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = rgb(NAVY if dark else WHITE)
    txt(s, title, 72, 64, 1130, 108, 46, WHITE if dark else INK, True)
    txt(s, f"{n:02d}", 1160, 663, 50, 24, 14, MINT if dark else MUTED)
    return s


def note(s, seconds, text):
    s.notes_slide.notes_text_frame.text = (
        f"Timing: {seconds} seconds. {text}\nSources: challenge brief pp. 2–3; docs/phase-01-define-website.md; "
        f"shared deterministic model export {MODEL['generatedAt']}. Published sources: {SITE}/evidence"
    )


def table(s, values, x, y, w, h, widths, size=21):
    shape = s.shapes.add_table(len(values), len(values[0]), px(x), px(y), px(w), px(h))
    t = shape.table
    for c, width in enumerate(widths):
        t.columns[c].width = px(width)
    for r, row in enumerate(values):
        t.rows[r].height = px(h / len(values))
        for c, value in enumerate(row):
            cell = t.cell(r, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = rgb(NAVY if r == 0 else ("FFFFFF" if r % 2 else "EDF5F4"))
            cell.margin_left = cell.margin_right = px(10)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.text = str(value)
            for para in cell.text_frame.paragraphs:
                for run in para.runs:
                    run.font.name, run.font.size, run.font.bold = F, Pt(size * 0.75), r == 0
                    run.font.color.rgb = rgb(WHITE if r == 0 else INK)
    # Plain table style: no banding or theme borders beyond the fills above.
    tbl_pr = shape._element.graphic.graphicData.tbl.tblPr
    tbl_pr.set("bandRow", "0")
    tbl_pr.set("firstRow", "0")
    return shape


# 1
s = slide("Shared university AI infrastructure", 1, True)
txt(s, "Lease first. Stage ownership.", 72, 224, 1100, 102, 62, WHITE, True)
txt(s, "Approve bounded diligence and leased access.\nSend the full 25 MW build back for evidence.", 76, 376, 1080, 132, 34, MINT)
txt(s, "Investment committee discussion   October 2026", 76, 608, 1060, 35, 22, "C4D6DC")
note(s, 25, "The decision is whether a shared facility meets a demonstrated need at an acceptable cost and risk. Members have expressed interest but signed no long-term commitments. The grid price, upgrade cost and date are unknown. We recommend a phased hybrid option after evidence closes, not approval of the full build today.")

# 2
s = slide("Demand determines the scale and location", 2)
hours = I["gpuCount"] * I["operatingHours"] * I["utilizationPct"] / 100 * I["availabilityPct"] / 100 / 1e6
txt(s, f"{hours:.2f} million", 72, 219, 550, 82, 54, TEAL, True)
txt(s, "productive GPU-hours per full year", 76, 306, 550, 55, 27)
txt(s, f"{I['gpuCount']:,} GPUs at {num(I['utilizationPct'])}% utilization\n{num(I['availabilityPct'])}% planning availability", 76, 381, 548, 88, 25)
table(s, [["Reference site", "Score / 5", "<50 ms"], ["Texas", "3.60", "62.3%"], ["Québec", "3.05", "50.7%"], ["Helsinki", "3.05", "19.5%"]], 652, 210, 550, 272, [252, 138, 160], 22)
txt(s, "These figures describe modeled capacity and proximity, not signed member demand.", 76, 547, 1120, 78, 27, INK, True)
note(s, 35, "Survey member training, teaching and inference needs, required reservation windows, security and existing campus/cloud alternatives. The base model does not demonstrate that 25 MW is needed. Texas leads because demand proximity is 25 percent of the site rubric. City proxies require campus measurements. Geographic alternatives stay open, especially if demand is predominantly batch training.")

# 3
s = slide("The 25 MW concept needs tested failure paths", 3)
for value, label, x in [(f"{num(I['itLoadMw'])} MW", "IT demand", 72), (f"{I['itLoadMw'] * I['pue']:.0f} MW", "Whole facility", 465), (f"{I['itLoadMw'] * I['pue'] * I['operatingHours'] / 1000:.0f} GWh", "Annual electricity", 860)]:
    txt(s, value, x, 195, 340, 82, 57, TEAL, True)
    txt(s, label, x + 3, 280, 340, 42, 25)
txt(s, "Grid and protected distribution supply UPS, GPUs, cooling, network and storage. Closed-loop cooling avoids routine evaporative demand.", 76, 369, 1125, 101, 28)
txt(s, "Largest component loss", 76, 497, 520, 46, 28, TEAL, True)
txt(s, "Isolate the fault, bridge transfer, preserve critical load and checkpoint or shed flexible training.", 76, 544, 520, 96, 23)
txt(s, "48-hour grid outage", 673, 497, 520, 46, 28, TEAL, True)
txt(s, f"{I['itLoadMw'] * I['pue'] * 48:,.0f} MWh delivered backup energy at full load. Verify fuel, refuelling and cooling continuity.", 673, 544, 520, 96, 23)
note(s, 45, "Refer to the separate one-page system diagram for power, cooling, networking, storage and failure paths. PUE is a planning assumption. Grid reliability is not workload availability. The largest transformer failure requires demonstrated remaining-path capacity. Confirm UPS autonomy, transfer performance, generator derating, failure/repair rates, common-mode faults and workload recovery. Do not credit renewable contracts as firm backup without hourly evidence.")

# 4
s = slide("Ten-year costs separate facility and GPU fleet", 4)
table(s, [["Build capital", "USD millions"], ["Facility", f"{B['facilityCapital']:.1f}"], ["Grid upgrades", f"{B['gridCapital']:.1f}"], ["Land", f"{B['landCapital']:.1f}"], ["GPU fleet", f"{B['gpuCapital']:.1f}"], ["Total", f"{I['buildCapexMillions']:.1f}"]], 72, 199, 1136, 354, [720, 416], 24)
txt(s, f"Power, staffing, maintenance, financing and GPU replacement every {num(I['replacementYears'])} years appear separately.", 76, 577, 1090, 72, 25)
note(s, 45, f"All values are planning assumptions, not quotes. The app shows ten annual rows for each option. Baseline electricity is ${num(I['powerPriceUsdMwh'])}/MWh. Owned capacity uses the full power envelope conservatively even at lower productive utilization. The lease price includes power and fleet replacement. Discount rate is {num(I['discountRatePct'])} percent, member charge ${num(I['memberChargeUsdHour'])}/productive hour. Build annual cost allocated to unused capacity is {money(B['annualUnusedCapacityCost'])}, already inside total cost and not added again. Debt draws and repayments are separate from project cash flow. Explain the risk that the demand does not materialize.")

# 5
s = slide("Required base and stress comparisons", 5)
values = [["Case / path", "Before opening", "Annual ops", "$/GPU-hour", "Capital at risk"]]
for sc in REQUIRED:
    label = "Base" if sc["id"] == "base" else ("Half use" if "util" in sc["id"] else "+12 months")
    for o in sc["options"]:
        values.append([f"{label} / {o['id']}", money(o["beforeOpeningWithDelay"]), money(o["annual"]), dollars(o["costPerProductiveHour"]), money(o["capitalAtRiskWithDelay"])])
table(s, values, 72, 186, 1136, 390, [312, 206, 184, 200, 234], 21)
txt(s, f"Base: {num(I['gridDelayMonths'])} month delay. Half utilization: {num(I['utilizationPct'] / 2)}%. The app also retains +3 months.", 76, 598, 1110, 55, 22)
note(s, 55, "Amounts other than per-hour costs are USD millions. Annual operations are the full-service run rate rather than a delayed first-year amount. Before-opening funding includes construction, the commissioning fleet, delay carry, interest and any lease bridge in the hybrid. Capital at risk measures year-three spent-capital loss after assumed salvage plus delay and interest. Cost per productive hour uses all ten years and reflects lost productive time. Lower use reduces productive hours without automatically reducing the contracted facility or lease envelope. This is why signed demand and staging are central to the recommendation.")

# 6
s = slide("Ownership and access rules protect members", 6)
txt(s, "20%", 76, 212, 260, 80, 62, TEAL, True)
txt(s, "reserved for smaller institutions and teaching", 76, 299, 485, 96, 28)
txt(s, "35%", 678, 212, 300, 80, 62, TEAL, True)
txt(s, "cap on one member’s discretionary allocation", 678, 299, 485, 96, 28)
txt(s, "Proposed policy: fixed costs by reservation, variable costs by use, release unused capacity, publish allocations and allow appeals.", 76, 453, 1110, 102, 29)
txt(s, "The consortium owns approved assets. Contract construction, power, specialist operations and overflow compute.", 76, 579, 1110, 62, 23, MUTED)
note(s, 30, "These percentages are proposed design decisions, not current agreements. A representative board approves pricing and admits members. An independent scientific panel resolves conflicts. Development equity funds site control and studies; construction debt follows permits, grid terms, priced scope and signed demand; equipment finance follows GPU terms and service commitments. Sponsors bear grid-delay risk unless transferred by contract. A departing member must supply replacement demand or cover unrecovered commitments.")

# 7
s = slide("Three findings could reverse the recommendation", 7)
items = [("Signed productive demand", "Contracted workloads and acceptable member prices could justify earlier ownership. Low use favors leasing or a smaller facility."), ("Binding grid terms", "Energization date, delivered power cost, upgrades and curtailment could change both the delivery path and country."), ("Tested and priced design", "Cooling, failure recovery, vendor offers and replacement terms could change the uptime, PUE and ownership economics.")]
for k, (head, body) in enumerate(items):
    txt(s, str(k + 1), 76, 202 + k * 143, 64, 52, 34, TEAL, True)
    txt(s, head, 157, 203 + k * 143, 1030, 43, 29, INK, True)
    txt(s, body, 157, 251 + k * 143, 1025, 83, 24)
note(s, 35, "The most decision-changing evidence is not another headline about national data centers. It is signed member demand, a property-specific utility offer and a tested/priced delivery design. Québec and Helsinki remain live alternatives. Include energy/water use, permits and grid impacts on other customers. Obtain evidence for the workload availability and recovery targets rather than implying professional engineering certification.")

# 8
s = slide("Committee decision", 8, True)
txt(s, "Approve diligence and leased access.\nReturn with a priced hybrid option.", 72, 225, 1120, 151, 47, WHITE, True)
txt(s, "Full construction and equipment capital remain conditional on demand, grid terms and resilience evidence.", 76, 438, 1080, 95, 29, MINT)
txt(s, "Questions: scale, member commitments, failure tolerance and risk allocation", 76, 601, 1095, 48, 22, "C4D6DC")
note(s, 30, "Total planned speaking time across all eight slides is five minutes, followed by questions. Open the Investment Case for detailed ten-year rows and sensitivities, Evidence for claims/sources, and Initial Design for the failure walkthroughs. The decision requested is limited and reversible. This presentation does not certify a construction-ready engineering design.")

prs.save(OUTPUT)
print(OUTPUT)
