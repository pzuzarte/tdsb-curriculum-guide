#!/usr/bin/env python3
"""
Check the outside practice links in js/practice.js.

TVO Learn pages are checked against TVO Learn's public product list (one request per 250 items);
other links get a plain GET. EQAO's site blocks scripted requests, so EQAO links are only
reported, not checked -- open them by hand if TVO or CEMC links start failing.

Exits with status 1 if any checked link is missing, so the monthly workflow shows a failure.
"""
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "Mozilla/5.0 (tdsb-curriculum-guide link check)"}


def load_practice():
    with open(os.path.join(ROOT, "js", "practice.js"), encoding="utf-8") as f:
        txt = f.read()
    body = re.search(r"window\.PRACTICE\s*=\s*(\{.*\});", txt, re.S).group(1)
    body = re.sub(r"(?<!:)//[^\n]*", "", body)                       # line comments
    body = re.sub(r"([{,]\s*)([A-Za-z_]\w*|\d+)\s*:", r'\1"\2":', body)  # quote keys
    body = re.sub(r",(\s*[}\]])", r"\1", body)                    # trailing commas
    return json.loads(body)


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.status, r.read()


def main():
    P = load_practice()
    handles = set()
    for page in range(1, 20):
        _, data = fetch(f"https://tvolearn.com/collections/courses/products.json?limit=250&page={page}")
        prods = json.loads(data).get("products", [])
        if not prods:
            break
        handles.update(p["handle"] for p in prods)
    print(f"TVO Learn lists {len(handles)} resources")

    bad = []
    for sid, rows in P["tvo"].items():
        for row in rows:
            only = row[2] if len(row) > 2 else range(1, 7)
            for n in only:
                h = f"g{n}-{row[0]}"
                if h not in handles:
                    bad.append(P["tvoBase"] + h)
    others = [P["tvoK"], P["potw"]["en"], P["potw"]["fr"]]
    for url in others:
        try:
            status, _ = fetch(url)
            if status != 200:
                bad.append(f"{url} (HTTP {status})")
        except Exception as e:  # noqa: BLE001
            bad.append(f"{url} ({e})")
    for g, v in P["eqao"].items():
        print(f"not checked (EQAO blocks scripts): {v['en']}")

    if bad:
        print(f"{len(bad)} broken practice link(s):")
        for b in bad:
            print("  " + b)
        sys.exit(1)
    print("all checked practice links OK")


if __name__ == "__main__":
    main()
