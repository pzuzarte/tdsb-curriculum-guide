#!/usr/bin/env python3
"""
Build js/facilities.js: building, capacity and water-testing information for TDSB elementary schools.

Sources (all public TDSB pages):
  * Elementary school list (TDSB school numbers, names, addresses), used to match TDSB's own school
    numbers to the Ministry numbers used everywhere else on the site.
  * Long-Term Program and Accommodation Strategy, "School Data (abbreviated version)" PDF: one row per
    school with LOI rank, facility condition, backlog, building age, accessibility, portables, pool,
    eco-school level, out-of-area status, capacity, enrolment, utilization projections and
    home-school participation.
  * Each school's Facility Condition Index page: the current FCI and the list of renewal needs by priority.
  * Each school's Safe Drinking Water Test Results page: the latest annual lead sampling.

Usage:
    python3 tools/fetch_tdsb_facilities.py            # ~940 page requests, 3 s apart (~50 minutes)
    python3 tools/fetch_tdsb_facilities.py --delay 1

Needs pdfplumber (pip install pdfplumber). Pages are cached, so an interrupted run resumes.
"""
import argparse
import html
import json
import logging
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(os.environ.get("TMPDIR", "/tmp"), "tdsb_facilities_cache")
BASE = "https://www.tdsb.on.ca"
UA = {"User-Agent": "Mozilla/5.0 (tdsb-curriculum-guide; parent education site)"}
LIST_URL = BASE + "/Find-your/School/By-School-Name/Elementary"
LTPAS_URL = BASE + "/About-Us/Strategy-Planning/Long-Term-Program-and-Accommodation-Strategy"
FCI_URL = BASE + "/Find-your/Schools/School-FCI/schno/{n}"
WATER_URL = BASE + "/Findyour/Schools/WaterTestResults.aspx?schno={n}"
PROFILE_URL = BASE + "/FindYour/Schools.aspx?schno={n}"
ACCESS_URL = BASE + "/SchoolAccessibilityProfile/{n}.pdf"
# Schools whose TDSB and Ministry names differ too much to match automatically: Ministry name -> TDSB name
NAME_FIXES = {}
# Renamed schools whose LTPAS row can't be matched by words: Ministry name -> LTPAS name
LTPAS_FIXES = {
    "Donview Middle School": "Donview Middle Health and Wellness Academy",
    "Shoreham Public School": "Shoreham Public Sports and Wellness Academy",
    "Kapapamahchakwew - Wandering Spirit Scho Junior Senior": "Kapapamahchakwe w ‐ Wandering Spirit School",
}


def get(url, name, delay):
    os.makedirs(CACHE, exist_ok=True)
    fp = os.path.join(CACHE, name)
    if os.path.exists(fp):
        with open(fp, "rb") as f:
            return f.read(), False
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90) as r:
        data = r.read()
    with open(fp, "wb") as f:
        f.write(data)
    time.sleep(delay)
    return data, True


def text_lines(raw):
    s = raw.decode("utf-8", "replace")
    s = re.sub(r"(?is)<(script|style).*?</\1>", "", s)
    s = re.sub(r"(?i)<br\s*/?>|</(p|div|tr|li|h\d|td|th|span)>", "\n", s)
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    return [x for x in (re.sub(r"\s+", " ", l).strip() for l in s.split("\n")) if x]


def norm(name):
    s = unicodedata.normalize("NFD", name).encode("ascii", "ignore").decode().lower()
    s = s.replace("&", " and ")
    return re.sub(r"[^a-z0-9]", "", s)


def num(v):
    m = re.search(r"-?\d[\d,]*(?:\.\d+)?", v or "")
    return float(m.group(0).replace(",", "")) if m else None


def load_js(path, var):
    with open(path, encoding="utf-8") as f:
        txt = f.read()
    return json.loads(re.search(re.escape(var) + r"\s*=\s*(\{.*\});\s*$", txt, re.S).group(1))


def school_list(delay):
    raw, _ = get(LIST_URL, "elementary_list.html", delay)
    s = raw.decode("utf-8", "replace")
    out = []
    for m in re.finditer(r'href="/FindYour/Schools\.aspx\?schno=(\d+)"[^>]*>([^<]+)</a>.*?spanAddress_\d+">([^<]*)</span>', s, re.S):
        addr = html.unescape(m.group(3)).strip()
        pc = re.search(r"[A-Z]\d[A-Z] ?\d[A-Z]\d", addr.upper())
        out.append({"schno": m.group(1), "name": html.unescape(m.group(2)).strip(), "postal": pc.group(0).replace(" ", "") if pc else ""})
    return out


def ltpas(delay):
    """Rows from the latest LTPAS 'School Data (abbreviated version)' PDF, keyed by normalized school name."""
    import pdfplumber
    logging.getLogger("pdfminer").setLevel(logging.ERROR)
    page, _ = get(LTPAS_URL, "ltpas.html", delay)
    links = re.findall(r'href="([^"]*LTPASSections/(\d{4})/School%20Data[^"]*\.pdf)"', page.decode("utf-8", "replace"), re.I)
    if not links:
        sys.exit("LTPAS School Data PDF link not found")
    href, year = max(links, key=lambda x: x[1])
    raw, _ = get(urllib.parse.urljoin(BASE, href), f"ltpas_school_data_{year}.pdf", delay)
    fp = os.path.join(CACHE, f"ltpas_school_data_{year}.pdf")
    rows = {}
    with pdfplumber.open(fp) as pdf:
        for p in pdf.pages:
            for tb in p.extract_tables():
                if len(tb) < 2 or not tb[0] or "School Name" not in (tb[0][0] or ""):
                    continue
                head = [re.sub(r"\s+", " ", c or "") for c in tb[0]]
                for r in tb[1:]:
                    if not r or not r[0]:
                        continue
                    rec = rows.setdefault(norm(re.sub(r"\s+", " ", r[0])), {"name": re.sub(r"\s+", " ", r[0]).strip()})
                    for h, c in zip(head[1:], r[1:]):
                        rec[h] = re.sub(r"\s+", " ", c or "").strip()
    return year, rows


GENERIC = {"school", "public", "junior", "senior", "middle", "and", "the", "of", "academy", "elementary", "jr", "sr", "ps"}


def words(name):
    return set(re.findall(r"[a-z]+", unicodedata.normalize("NFD", name).encode("ascii", "ignore").decode().lower())) - GENERIC


def fuzzy_row(lt, names):
    """Best elementary LTPAS row for a school whose name changed (e.g. '... Sports and Wellness Academy')."""
    best, score = None, 0
    for r in lt.values():
        if col(r, "Panel") != "E":
            continue
        a = words(r["name"])
        for n in names:
            b = words(n)
            if not a or not b:
                continue
            j = len(a & b) / len(a | b)
            if j > score and next(iter(re.findall(r"[a-z]+", r["name"].lower())), "") == next(iter(re.findall(r"[a-z]+", n.lower())), ""):
                best, score = r, j
    return best if score >= 0.5 else None


def col(rec, prefix):
    for k, v in rec.items():
        if k.startswith(prefix):
            return v
    return ""


def ltpas_fields(rec):
    acc = col(rec, "Barrier Free").lower()
    util = [num(col(rec, f"Utilization {y}")) for y in (2023, 2028, 2033, 2038, 2043)]
    # Out-of-area status per program: regular, Early French Immersion, Middle Immersion / Extended French,
    # Central Student Interest Program. "N/A" = the school doesn't offer that program.
    toks = re.findall(r"Open|Closed|N/A|Limited(?: \([^)]*\))?", col(rec, "2024") or col(rec, "OOA"))
    prog = dict(zip(["reg", "fi", "mi", "csip"], [None if x == "N/A" else x for x in toks])) if len(toks) == 4 else None
    ooa = toks[0].split(" ")[0] if toks else ""
    return {
        "loi": num(col(rec, "LOI")),
        "built": num(col(rec, "Build Date")),
        "access": "yes" if acc.startswith("accessible") else "some" if acc.startswith("somewhat") else "no" if acc.startswith("not") else None,
        "fci": num(col(rec, "Current FCI")),
        "backlog": num(col(rec, "Current Backlog")),
        "port": num(col(rec, "Port. Instruc")) or 0,
        "eco": col(rec, "Eco Schools") or None,
        "pool": bool(col(rec, "Pool")),
        "ooa": ooa if ooa in ("Open", "Limited", "Closed") else None,
        "prog": prog,
        "site": num(col(rec, "Site Size")),
        "cap": num(col(rec, "Revised Capacity")),
        "enrol": num(col(rec, "Head Count")),
        "util": util if any(u is not None for u in util) else None,
        "home": num(col(rec, "Home School Participation")),
    }


def fci_page(n, delay):
    raw, fetched = get(FCI_URL.format(n=n), f"fci_{n}.html", delay)
    L = text_lines(raw)
    out = {"v": None, "year": None, "count": {"Urgent": 0, "High": 0, "Medium": 0, "Low": 0},
           "items": {"Urgent": [], "High": [], "Medium": [], "Low": []}}
    for i, l in enumerate(L):
        if l == "F.C.I." and i + 1 < len(L):
            out["v"] = num(L[i + 1])
        m = re.match(r"^(\d{4})\s*-\s*(\d{4})$", l)
        if m and not out["year"]:
            out["year"] = f"{m.group(1)}-{m.group(2)[2:]}"
    try:
        start = L.index("Priority") + 1
    except ValueError:
        return out, fetched
    for i in range(start, len(L) - 1, 2):
        desc, pri = L[i], L[i + 1]
        if pri not in out["count"]:
            break
        out["count"][pri] += 1
        out["items"][pri].append(re.sub(r"^[A-Z]\d{2,8}\s*(?:-\s+)?", "", desc))  # drop building-system codes like "D2030" or "G30 -"
    return out, fetched


def water_page(n, delay):
    raw, fetched = get(WATER_URL.format(n=n), f"water_{n}.html", delay)
    s = raw.decode("utf-8", "replace")
    year = re.search(r"Annual Safe Drinking Water Test Results\s*(\d{4})", html.unescape(re.sub(r"<[^>]+>", " ", s)))
    vals = []
    for kind in ("StandingOriginal", "FlushedOriginal"):
        for m in re.finditer(r'lbl' + kind + r'_(\d+)"[^>]*>(.*?)</span>', s, re.S):  # values like "<0.5" are raw
            v = html.unescape(m.group(2)).strip()
            x = 0.0 if v.startswith("<") else num(v)
            if x is not None:
                vals.append((int(m.group(1)), kind, x))
    fixtures = len({i for i, _, _ in vals})
    exceed = len({i for i, _, x in vals if x > 10})
    return {"year": int(year.group(1)) if year else None, "n": fixtures, "exc": exceed,
            "max": max((x for _, _, x in vals), default=None)}, fetched


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--delay", type=float, default=3.0, help="seconds between new page requests")
    ap.add_argument("--limit", type=int, default=0, help="only the first N schools (for testing)")
    a = ap.parse_args()

    S = load_js(os.path.join(ROOT, "js", "schools.js"), "window.SCHOOLS")
    tl = school_list(a.delay)
    print(f"TDSB elementary list: {len(tl)} schools")

    # Match TDSB school numbers to Ministry numbers: exact name, then postal code, then manual fixes.
    by_name = {}
    for x in tl:
        by_name.setdefault(norm(x["name"]), []).append(x)
    match = {}
    for s in S["schools"]:
        c = by_name.get(norm(NAME_FIXES.get(s["name"], s["name"])), [])
        if len(c) != 1:
            c = [x for x in tl if x["postal"] and x["postal"] == (s.get("postal") or "").replace(" ", "").upper()]
        if len(c) != 1:
            # same postal code shared by several schools: pick the one whose name shares the most words
            words = set(re.findall(r"[a-z]+", s["name"].lower())) - {"school", "public", "junior", "senior", "middle", "the"}
            c = sorted(c, key=lambda x: -len(words & set(re.findall(r"[a-z]+", x["name"].lower()))))[:1]
        if c:
            match[s["id"]] = c[0]
    missing = [s["name"] for s in S["schools"] if s["id"] not in match]
    print(f"matched {len(match)} of {len(S['schools'])} schools" + (f"; not matched: {', '.join(missing)}" if missing else ""))

    lt_year, lt = ltpas(a.delay)
    print(f"LTPAS {lt_year}: {len(lt)} school rows")

    out = {"ltpasYear": lt_year, "sources": {"ltpas": LTPAS_URL, "fci": FCI_URL, "water": WATER_URL,
           "profile": PROFILE_URL, "access": ACCESS_URL}, "schools": {}}
    lt_hits = 0
    lt_names = {norm(x["name"]) for x in match.values()} | {norm(s["name"]) for s in S["schools"]}
    print(f"LTPAS elementary rows without a matching school: {sorted(r['name'] for k, r in lt.items() if k not in lt_names and col(r, 'Panel') == 'E')[:20]}")
    items = sorted(match.items())[: a.limit or None]
    for k, (sid, x) in enumerate(items):
        mname = next(s["name"] for s in S["schools"] if s["id"] == sid)
        rec = lt.get(norm(x["name"])) or lt.get(norm(mname)) or lt.get(norm(LTPAS_FIXES.get(mname, "")))
        if not rec:
            rec = fuzzy_row(lt, [x["name"], mname])
            print(f"  fuzzy LTPAS match: {mname} -> {rec['name'] if rec else 'none'}")
        fci, f1 = fci_page(x["schno"], a.delay)
        water, f2 = water_page(x["schno"], a.delay)
        row = {"schno": x["schno"], "fciNow": fci, "water": water}
        if rec:
            lt_hits += 1
            row["lt"] = ltpas_fields(rec)
        out["schools"][sid] = row
        if (k + 1) % 25 == 0 or k + 1 == len(items):
            print(f"  {k + 1}/{len(items)} schools")
            sys.stdout.flush()
    print(f"LTPAS rows matched: {lt_hits}; FCI pages with a value: {sum(1 for r in out['schools'].values() if r['fciNow']['v'] is not None)}; "
          f"water pages with results: {sum(1 for r in out['schools'].values() if r['water']['n'])}")

    # Repair descriptions repeat across schools: store each once and refer to it by index.
    names = sorted({d for r in out["schools"].values() for lst in r["fciNow"]["items"].values() for d in lst})
    idx = {d: i for i, d in enumerate(names)}
    out["repairNames"] = names
    for r in out["schools"].values():
        r["fciNow"]["items"] = {k[0]: [idx[d] for d in lst] for k, lst in r["fciNow"]["items"].items()}  # U, H, M, L

    dest = os.path.join(ROOT, "js", "facilities.js")
    with open(dest, "w", encoding="utf-8") as f:
        f.write("/* TDSB school buildings: LTPAS school data, Facility Condition Index pages and drinking-water results.\n"
                "   Source: Toronto District School Board website. Generated by tools/fetch_tdsb_facilities.py -- do not edit by hand. */\n")
        f.write("window.FACILITIES = ")
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print(f"wrote {dest} ({os.path.getsize(dest) // 1024} KB)")


if __name__ == "__main__":
    main()
