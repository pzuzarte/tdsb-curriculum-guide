#!/usr/bin/env python3
"""
Build js/schools.js -- TDSB elementary school profiles and EQAO results -- from the
Ontario Ministry of Education open dataset "School information and student demographics"
(Open Government Licence - Ontario):
https://data.ontario.ca/dataset/school-information-and-student-demographics

Usage:
    python3 tools/build_schools.py

Requires: openpyxl (pip install openpyxl)

Notes
- Only school years with EQAO results are kept (no assessments in 2019-20 / 2020-21).
- "Typical school" reference values are MEDIANS across schools (TDSB, and all Ontario
  English-language schools), not official board/provincial averages.
"""
import json
import os
import re
import statistics
import sys
import time
import urllib.request

import openpyxl

DATASET = "d85f68c5-fcb0-4b4d-aec5-3047db47dcd5"
CKAN = f"https://data.ontario.ca/api/3/action/package_show?id={DATASET}"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(os.environ.get("TMPDIR", "/tmp"), "sif_cache")
BOARD = "Toronto DSB"
# EQAO did not run in these years (COVID); the source files repeat the previous year's results.
SKIP_YEARS = {"2019-20", "2020-21"}

# Column names in the source workbook
C = {
    "board": "Board Name", "num": "School Number", "name": "School Name", "level": "School Level",
    "lang": "School Language", "grades": "Grade Range", "street": "Street", "city": "City",
    "postal": "Postal Code", "phone": "Phone Number", "web": "School Website", "enrol": "Enrolment",
    "lat": "Latitude", "lon": "Longitude", "special": "School Special Condition Code",
}
RESULTS = [  # order matters: g3r, g3w, g3m, g6r, g6w, g6m
    "Percentage of Grade 3 Students Achieving the Provincial Standard in Reading",
    "Percentage of Grade 3 Students Achieving the Provincial Standard in Writing",
    "Percentage of Grade 3 Students Achieving the Provincial Standard in Mathematics",
    "Percentage of Grade 6 Students Achieving the Provincial Standard in Reading",
    "Percentage of Grade 6 Students Achieving the Provincial Standard in Writing",
    "Percentage of Grade 6 Students Achieving the Provincial Standard in Mathematics",
]
CONTEXT = {  # short key -> column
    "ell": "Percentage of Students Whose First Language Is Not English",
    "newc": "Percentage of Students Who Are New to Canada from a Non-English Speaking Country",
    "sped": "Percentage of Students Receiving Special Education Services",
    "gift": "Percentage of Students Identified as Gifted",
    "lowinc": "Percentage of School-Aged Children Who Live in Low-Income Households",
    "nodeg": "Percentage of Students Whose Parents Have No Degree, Diploma or Certificate",
}


def resources():
    with urllib.request.urlopen(CKAN, timeout=60) as r:
        res = json.load(r)["result"]["resources"]
    out = {}
    for x in res:
        m = re.search(r"sif_data_table_(\d{4})_(\d{4})_en\.xlsx$", x["url"])
        if m:
            out[f"{m.group(1)}-{m.group(2)[2:]}"] = x["url"]
    return dict(sorted(out.items()))


def download(year, url):
    os.makedirs(CACHE, exist_ok=True)
    fp = os.path.join(CACHE, f"sif_{year}.xlsx")
    if not os.path.exists(fp):
        print(f"  downloading {year} ...")
        urllib.request.urlretrieve(url, fp)
        time.sleep(0.5)
    return fp


def pct(v):
    """'76%' -> 76; suppressed/missing -> None plus a reason code."""
    s = str(v).strip() if v is not None else ""
    m = re.match(r"^(\d+(?:\.\d+)?)\s*%?$", s)
    if m and s not in ("",):
        return round(float(m.group(1))), None
    return None, {"N/R": "nr", "N/D": "nd", "NA": "na", "SP": "nr"}.get(s, "na")


def num(v):
    try:
        return round(float(str(v).replace("%", "").replace(",", "")))
    except (TypeError, ValueError):
        return None


def read(fp):
    ws = openpyxl.load_workbook(fp, read_only=True).active
    rows = ws.iter_rows(values_only=True)
    header = [str(h).strip() if h else "" for h in next(rows)]
    idx = {h: i for i, h in enumerate(header)}
    for r in rows:
        if r and r[0]:
            yield {h: r[i] for h, i in idx.items()}


def median(vals):
    vals = [v for v in vals if v is not None]
    return round(statistics.median(vals)) if vals else None


def main():
    years = resources()
    print("years found:", ", ".join(years))
    schools, ref = {}, {}
    for year, url in years.items():
        if year in SKIP_YEARS:
            print(f"  {year}: no EQAO assessments that year, skipped")
            continue
        rows = list(read(download(year, url)))
        if not rows or RESULTS[0] not in rows[0]:
            print(f"  {year}: no EQAO columns, skipped")
            continue
        has_any = False
        prov = [[] for _ in RESULTS]
        board = [[] for _ in RESULTS]
        for r in rows:
            if r.get(C["level"]) != "Elementary" or r.get(C["lang"]) != "English":
                continue
            vals = [pct(r.get(col))[0] for col in RESULTS]
            for i, v in enumerate(vals):
                prov[i].append(v)
            if r.get(C["board"]) != BOARD:
                continue
            for i, v in enumerate(vals):
                board[i].append(v)
            has_any = has_any or any(v is not None for v in vals)
            sid = str(r[C["num"]]).strip()
            s = schools.setdefault(sid, {"id": sid, "res": {}, "why": {}})
            # latest year wins for descriptive fields
            s.update({
                "name": str(r[C["name"]]).strip(), "grades": r.get(C["grades"]) or "",
                "addr": r.get(C["street"]) or "", "city": r.get(C["city"]) or "",
                "postal": r.get(C["postal"]) or "", "phone": r.get(C["phone"]) or "",
                "web": r.get(C["web"]) or "", "enrol": num(r.get(C["enrol"])),
                "lat": r.get(C["lat"]), "lon": r.get(C["lon"]),
                "ctx": {k: num(r.get(col)) for k, col in CONTEXT.items()},
                "ctxYear": year,
            })
            pairs = [pct(r.get(col)) for col in RESULTS]
            s["res"][year] = [p[0] for p in pairs]
            s["why"][year] = [p[1] for p in pairs]
        if not has_any:
            for s in schools.values():
                s["res"].pop(year, None)
                s["why"].pop(year, None)
            print(f"  {year}: no EQAO results (e.g. COVID pause), skipped")
            continue
        ref[year] = {"tdsb": [median(b) for b in board], "ontario": [median(p) for p in prov]}
        print(f"  {year}: TDSB elementary schools with results: "
              f"{sum(1 for s in schools.values() if year in s['res'] and any(v is not None for v in s['res'][year]))}")

    # Drop schools that closed before the latest year and compact the reason codes
    latest = max(ref)
    out_schools = []
    for s in sorted(schools.values(), key=lambda x: x["name"]):
        if s.get("ctxYear") != latest:  # closed or merged before the latest year
            continue
        s["why"] = {y: w for y, w in s["why"].items() if any(w)}
        if s.get("lat") is None:
            continue
        s["lat"], s["lon"] = round(float(s["lat"]), 5), round(float(s["lon"]), 5)
        del s["ctxYear"]
        out_schools.append(s)

    data = {
        "built": time.strftime("%Y-%m-%d"),
        "source": "https://data.ontario.ca/dataset/school-information-and-student-demographics",
        "years": sorted(ref),
        "measures": ["g3r", "g3w", "g3m", "g6r", "g6w", "g6m"],
        "reference": ref,
        "schools": out_schools,
    }
    dest = os.path.join(ROOT, "js", "schools.js")
    with open(dest, "w", encoding="utf-8") as f:
        f.write("/* TDSB elementary schools and EQAO results. Source: Ontario Ministry of Education, "
                "School information and student demographics (Open Government Licence - Ontario).\n"
                "   Generated by tools/build_schools.py -- do not edit by hand. */\n")
        f.write("window.SCHOOLS = ")
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print(f"wrote {dest}: {len(out_schools)} schools, years {', '.join(data['years'])} "
          f"({os.path.getsize(dest) // 1024} KB)")


if __name__ == "__main__":
    sys.exit(main())
