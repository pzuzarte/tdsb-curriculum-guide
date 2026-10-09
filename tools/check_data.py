#!/usr/bin/env python3
"""
Sanity checks for the generated data files. Exits non-zero if something looks broken, so an
automated refresh never publishes empty or malformed data.

Usage:
    python3 tools/check_data.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
problems = []


def load(path, var):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        txt = f.read()
    m = re.search(re.escape(var) + r"\s*=\s*(\{.*\});\s*$", txt, re.S)
    if not m:
        problems.append(f"{path}: could not find {var}")
        return None
    return json.loads(m.group(1))


def check(cond, msg):
    if not cond:
        problems.append(msg)


def pct_ok(v):
    return v is None or (isinstance(v, (int, float)) and 0 <= v <= 100)


# Curriculum expectations
for lang in ("en", "fr"):
    path = f"js/expectations.{lang}.js"
    E = load(path, f"window.EXPECTATIONS.{lang}")
    if not E:
        continue
    for subj in ("k", "lang", "math", "sci", "ss", "hpe", "arts", "fsl", "fsli"):
        grades = E["subjects"].get(subj, {})
        check(grades, f"{path}: subject {subj} missing")
        for gid, doc in grades.items():
            n = sum(len(o["specific"]) for s in doc["strands"] for o in s["overall"])
            check(len(doc["strands"]) >= 2 and n >= 10, f"{path}: {subj} {gid} looks empty ({len(doc['strands'])} strands, {n} specific)")

# TDSB schools
S = load("js/schools.js", "window.SCHOOLS")
if S:
    latest = S["years"][-1]
    check(len(S["schools"]) >= 400, f"schools.js: only {len(S['schools'])} TDSB schools")
    with_res = sum(1 for s in S["schools"] if s["res"].get(latest) and any(v is not None for v in s["res"][latest]))
    check(with_res >= 300, f"schools.js: only {with_res} schools with {latest} results")
    check(all(pct_ok(v) for s in S["schools"] for vals in s["res"].values() for v in vals), "schools.js: result outside 0-100")
    for y in S["years"]:
        ref = S["reference"][y]
        check(all(v is not None for v in ref["tdsb"] + ref["ontario"]), f"schools.js: missing TDSB/Ontario reference for {y}")

# All-Ontario index and board files
O = load("js/schools-ontario.js", "window.SCHOOLS_ON")
if O:
    check(len(O["rows"]) >= 3000, f"schools-ontario.js: only {len(O['rows'])} schools")
    bdir = os.path.join(ROOT, "js", "boards")
    missing = [slug for slug, b in zip(O["boardSlugs"], O["boards"]) if b != O["tdsb"] and not os.path.exists(os.path.join(bdir, f"{slug}.js"))]
    check(not missing, f"boards: missing files for {missing[:5]}")

# Grade 3 -> 6 tracking (optional)
if os.path.exists(os.path.join(ROOT, "js", "tracking.js")):
    T = load("js/tracking.js", "window.TRACKING")
    if T:
        have = sum(1 for v in T["schools"].values() if any(v.values()))
        check(have >= 200, f"tracking.js: only {have} schools with tracking data")
        check(T["reference"].get("tdsb") and T["reference"].get("ontario"), "tracking.js: missing TDSB/Ontario reference")

if problems:
    print("DATA CHECK FAILED:")
    for p in problems:
        print("  - " + p)
    sys.exit(1)
print("data check passed")
