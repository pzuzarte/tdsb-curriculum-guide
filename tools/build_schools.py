#!/usr/bin/env python3
"""
Build js/schools.js -- TDSB elementary schools with EQAO Grade 3 and 6 results.

Sources
- EQAO open data (achievement results by school, board and province, from 2021-22):
  https://www.eqao.com/about-eqao/open-data/
- School directory, map coordinates and school context (latest year available):
  Ontario Ministry of Education, "School information and student demographics"
  (Open Government Licence - Ontario)
  https://data.ontario.ca/dataset/school-information-and-student-demographics

Usage:
    python3 tools/build_schools.py

Requires: openpyxl (pip install openpyxl)
"""
import csv
import io
import json
import os
import re
import sys
import time
import urllib.request
import zipfile

import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(os.environ.get("TMPDIR", "/tmp"), "schools_cache")
UA = {"User-Agent": "tdsb-curriculum-guide (parent education site)"}

BOARD_NAME = "Toronto DSB"   # name in the Ministry file
BOARD_MIDENT = "66052"       # EQAO board id
EQAO_OPEN_DATA = "https://www.eqao.com/about-eqao/open-data/"
SIF_DATASET = "https://data.ontario.ca/api/3/action/package_show?id=d85f68c5-fcb0-4b4d-aec5-3047db47dcd5"

MEASURES = [("3", "R"), ("3", "W"), ("3", "M"), ("6", "R"), ("6", "W"), ("6", "M")]
LEVELS = ["L4", "L3", "L2", "L1", "NE1"]

SIF = {
    "board": "Board Name", "num": "School Number", "name": "School Name", "level": "School Level",
    "lang": "School Language", "grades": "Grade Range", "street": "Street", "city": "City",
    "postal": "Postal Code", "phone": "Phone Number", "web": "School Website", "enrol": "Enrolment",
    "lat": "Latitude", "lon": "Longitude",
}
CONTEXT = {  # short key -> Ministry column
    "ell": "Percentage of Students Whose First Language Is Not English",
    "newc": "Percentage of Students Who Are New to Canada from a Non-English Speaking Country",
    "sped": "Percentage of Students Receiving Special Education Services",
    "gift": "Percentage of Students Identified as Gifted",
    "lowinc": "Percentage of School-Aged Children Who Live in Low-Income Households",
    "nodeg": "Percentage of Students Whose Parents Have No Degree, Diploma or Certificate",
}


def fetch(url, name):
    os.makedirs(CACHE, exist_ok=True)
    fp = os.path.join(CACHE, name)
    if not os.path.exists(fp):
        print(f"  downloading {name} ...")
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r, open(fp, "wb") as f:
            f.write(r.read())
        time.sleep(1)
    return fp


def num(v):
    try:
        return round(float(str(v).replace("%", "").replace(",", "")))
    except (TypeError, ValueError):
        return None


def pct(v):
    """'76%' -> 76, '<1%' -> 0; 'N/R' (small group) -> None."""
    s = (v or "").strip()
    if s.startswith("<"):
        return 0
    m = re.match(r"^(\d+(?:\.\d+)?)%?$", s)
    return round(float(m.group(1))) if m else None


# ---------------------------------------------------------------- school directory
def school_directory():
    with urllib.request.urlopen(urllib.request.Request(SIF_DATASET, headers=UA), timeout=60) as r:
        res = json.load(r)["result"]["resources"]
    files = {}
    for x in res:
        m = re.search(r"sif_data_table_(\d{4})_(\d{4})_en\.xlsx$", x["url"])
        if m:
            files[m.group(1) + "-" + m.group(2)[2:]] = x["url"]
    year = max(files)
    print(f"school directory: Ministry data for {year}")
    ws = openpyxl.load_workbook(fetch(files[year], f"sif_{year}.xlsx"), read_only=True).active
    rows = ws.iter_rows(values_only=True)
    header = [str(h).strip() if h else "" for h in next(rows)]
    schools = {}
    for r in rows:
        if not r or not r[0]:
            continue
        d = dict(zip(header, r))
        if d.get(SIF["board"]) != BOARD_NAME or d.get(SIF["level"]) != "Elementary" or d.get(SIF["lat"]) is None:
            continue
        sid = str(d[SIF["num"]]).strip()
        schools[sid] = {
            "id": sid, "name": str(d[SIF["name"]]).strip(), "grades": d.get(SIF["grades"]) or "",
            "addr": d.get(SIF["street"]) or "", "city": d.get(SIF["city"]) or "",
            "postal": d.get(SIF["postal"]) or "", "phone": d.get(SIF["phone"]) or "",
            "web": d.get(SIF["web"]) or "", "enrol": num(d.get(SIF["enrol"])),
            "lat": round(float(d[SIF["lat"]]), 5), "lon": round(float(d[SIF["lon"]]), 5),
            "ctx": {k: num(d.get(col)) for k, col in CONTEXT.items()},
            "res": {}, "why": {},
        }
    return year, schools


# ---------------------------------------------------------------- EQAO results
def eqao_files():
    req = urllib.request.Request(EQAO_OPEN_DATA, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        page = r.read().decode("utf-8", "replace")
    out = {}
    for url in set(re.findall(r'href="([^"]+Grade-([36])-(\d{4})-(\d{4})-Achievement-Results\.zip)"', page)):
        u, grade, y1, y2 = url
        out[(f"{y1}-{y2[2:]}", grade)] = u
    return out


def read_eqao(zpath):
    """Yield rows (dicts) from the achievement CSV(s) in an EQAO zip, joined across split files."""
    merged = {}
    with zipfile.ZipFile(zpath) as z:
        for name in sorted(n for n in z.namelist() if n.lower().endswith(".csv")):
            with z.open(name) as f:
                for row in csv.DictReader(io.TextIOWrapper(f, encoding="utf-8-sig")):
                    lang = row.get("Language") or row.get("Lang") or ""
                    key = (row.get("OrgType"), row.get("OrgID"), lang)
                    merged.setdefault(key, {}).update(row)
    return merged.values()


def main():
    dir_year, schools = school_directory()
    files = eqao_files()
    years = sorted({y for y, _ in files})
    print("EQAO years:", ", ".join(years))
    reference = {}
    dist = {}
    for year in years:
        ref = {"tdsb": [None] * 6, "ontario": [None] * 6}
        res = {}
        for grade in ("3", "6"):
            if (year, grade) not in files:
                continue
            rows = read_eqao(fetch(files[(year, grade)], f"eqao_g{grade}_{year}.zip"))
            for r in rows:
                lang = r.get("Language") or r.get("Lang")
                kind = r.get("OrgType")
                for i, (g, subj) in enumerate(MEASURES):
                    if g != grade:
                        continue
                    v = pct(r.get(f"pctOverall{subj}_L34"))
                    if kind == "P" and lang == "en":
                        ref["ontario"][i] = v
                    elif kind == "B" and r.get("BoardMident") == BOARD_MIDENT:
                        ref["tdsb"][i] = v
                    elif kind == "S" and r.get("BoardMident") == BOARD_MIDENT:
                        sid = (r.get("SchoolMident") or "").strip().zfill(6)
                        suppressed = (r.get("Suppressed") or "0") != "0"
                        res.setdefault(sid, [None] * 6)[i] = None if suppressed else v
                        if year == years[-1] and not suppressed:
                            dist.setdefault(sid, [None] * 6)[i] = [pct(r.get(f"pctOverall{subj}_{lv}")) for lv in LEVELS]
        reference[year] = ref
        matched = 0
        for sid, vals in res.items():
            if sid in schools:
                matched += 1
                schools[sid]["res"][year] = vals
        missing = len(set(res) - set(schools))
        print(f"  {year}: {matched} TDSB schools with results"
              f"{f' ({missing} not in the school directory, e.g. new schools)' if missing else ''}; "
              f"TDSB {ref['tdsb']}, Ontario {ref['ontario']}")

    # Why a value is blank: 'nr' = small group not reported, 'na' = school has no students in that grade
    for s in schools.values():
        for year, vals in s["res"].items():
            codes = [None if v is not None else "nr" for v in vals]
            for grade_block in (slice(0, 3), slice(3, 6)):
                if all(v is None for v in vals[grade_block]):
                    codes[grade_block] = ["na"] * 3
            if any(codes):
                s["why"][year] = codes
        if s["id"] in dist:
            s["dist"] = dist[s["id"]]

    data = {
        "built": time.strftime("%Y-%m-%d"),
        "sources": {"eqao": EQAO_OPEN_DATA,
                    "schools": "https://data.ontario.ca/dataset/school-information-and-student-demographics"},
        "contextYear": dir_year,
        "years": years,
        "levels": LEVELS,
        "reference": reference,
        "schools": sorted(schools.values(), key=lambda x: x["name"]),
    }
    dest = os.path.join(ROOT, "js", "schools.js")
    with open(dest, "w", encoding="utf-8") as f:
        f.write("/* TDSB elementary schools and EQAO results. Sources: EQAO open data; Ontario Ministry of Education,\n"
                "   School information and student demographics (Open Government Licence - Ontario).\n"
                "   Generated by tools/build_schools.py -- do not edit by hand. */\n")
        f.write("window.SCHOOLS = ")
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print(f"wrote {dest}: {len(schools)} schools, years {', '.join(years)} ({os.path.getsize(dest) // 1024} KB)")


if __name__ == "__main__":
    sys.exit(main())
