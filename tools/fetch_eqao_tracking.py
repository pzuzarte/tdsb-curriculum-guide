#!/usr/bin/env python3
"""
Fetch EQAO's Grade 3 -> Grade 6 student tracking results and write js/tracking.js.

EQAO links each Grade 6 student's result to the same student's Grade 3 result and reports, per
school, the share who: maintained the standard (met it in both grades), rose (met it only in
Grade 6), dropped (met it only in Grade 3) or never met it. These figures are not in EQAO's
open-data CSVs; they are published per school on EQAO's results site (latest year only), so this
script requests one small JSON file per school, honouring robots.txt (Crawl-delay: 10).

Usage:
    python3 tools/fetch_eqao_tracking.py                       # TDSB + Toronto Catholic
    python3 tools/fetch_eqao_tracking.py --boards toronto-cdsb peel-dsb
    python3 tools/fetch_eqao_tracking.py --release 47 --year 2026

Files are cached, so an interrupted run resumes where it stopped.
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(os.environ.get("TMPDIR", "/tmp"), "eqao_tracking_cache")
BASE = "https://www.eqao.com/wp-content/uploads/eqao-results-static-auto/v1/dataset-{year}/release-{rel}/grade-6/en/school-{board}-{school}.json"
UA = {"User-Agent": "tdsb-curriculum-guide (parent education site; respects robots.txt crawl-delay)"}
DELAY = 10  # seconds, per EQAO robots.txt
SUBJ = ["R", "W", "M"]
KINDS = ["Maintained", "Rose", "Dropped", "NeverMet"]


def load_js(path, var):
    with open(path, encoding="utf-8") as f:
        txt = f.read()
    m = re.search(re.escape(var) + r"\s*=\s*(\{.*\});\s*$", txt, re.S)
    return json.loads(m.group(1))


def pct(v):
    m = re.match(r"^<?(\d+(?:\.\d+)?)%?$", (v or "").strip())
    return round(float(m.group(1))) if m else None


def get(url, name):
    os.makedirs(CACHE, exist_ok=True)
    fp = os.path.join(CACHE, name)
    if os.path.exists(fp):
        with open(fp, encoding="utf-8") as f:
            return json.load(f), False
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        data = {"error": e.code}
    with open(fp, "w", encoding="utf-8") as f:
        json.dump(data, f)
    return data, True


def tracking(row):
    """[maintained, rose, dropped, neverMet, students] per subject, or None if not reported."""
    out = {}
    for s in SUBJ:
        vals = [pct(row.get(f"G36{s}_pct{k}")) for k in KINDS]
        n = row.get(f"G36_cntFullyParticipating_{ {'R': 'Read', 'W': 'Write', 'M': 'Math'}[s] }")
        out[s] = vals + [int(n) if n and str(n).isdigit() else None] if all(v is not None for v in vals) else None
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--boards", nargs="*", default=["toronto-cdsb"], help="board file slugs in js/boards (TDSB is always included)")
    ap.add_argument("--year", default="2026")
    ap.add_argument("--release", default="47")
    a = ap.parse_args()

    S = load_js(os.path.join(ROOT, "js", "schools.js"), "window.SCHOOLS")
    latest = S["years"][-1]
    targets = [(s["id"], "66052") for s in S["schools"] if s["res"].get(latest) and any(v is not None for v in s["res"][latest][3:])]
    for slug in a.boards:
        B = load_js(os.path.join(ROOT, "js", "boards", f"{slug}.js"), f'window.BOARD_DATA["{slug}"]')
        targets += [(s["id"], s["boardNo"]) for s in B["schools"]
                    if s["res"].get(latest) and any(v is not None for v in s["res"][latest][3:]) and not s.get("fr")]
    print(f"{len(targets)} schools with Grade 6 results; up to {len(targets) * DELAY // 60} minutes at {DELAY}s per request")

    out = {"year": latest, "grade3Year": None, "release": a.release, "fetched": time.strftime("%Y-%m-%d"),
           "source": "https://www.eqao.com/results/", "reference": {}, "boards": {}, "schools": {}}
    done = 0
    for sid, board in targets:
        url = BASE.format(year=a.year, rel=a.release, board=board, school=int(sid))
        data, fetched = get(url, f"{a.year}-{a.release}-{board}-{int(sid)}.json")
        done += 1
        rows = data.get("data") if isinstance(data, dict) else None
        if rows:
            for r in rows:
                kind = r.get("OrgType")
                if kind == "S":
                    out["schools"][sid] = tracking(r)
                elif kind == "B":
                    out["boards"].setdefault(board, tracking(r))
                elif kind == "P" and "ontario" not in out["reference"]:
                    out["reference"]["ontario"] = tracking(r)
        if done % 25 == 0 or done == len(targets):
            print(f"  {done}/{len(targets)} schools")
            sys.stdout.flush()
        if fetched:
            time.sleep(DELAY)
    out["reference"]["tdsb"] = out["boards"].get("66052")
    ys = latest.split("-")
    out["grade3Year"] = f"{int(ys[0]) - 3}-{int(ys[1]) - 3:02d}"
    dest = os.path.join(ROOT, "js", "tracking.js")
    with open(dest, "w", encoding="utf-8") as f:
        f.write("/* EQAO Grade 3 -> Grade 6 student tracking (latest year). Source: EQAO results site.\n"
                "   Generated by tools/fetch_eqao_tracking.py -- do not edit by hand. */\n")
        f.write("window.TRACKING = ")
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    have = sum(1 for v in out["schools"].values() if any(v.values()))
    print(f"wrote {dest}: {have} schools with tracking data ({os.path.getsize(dest) // 1024} KB)")


if __name__ == "__main__":
    main()
