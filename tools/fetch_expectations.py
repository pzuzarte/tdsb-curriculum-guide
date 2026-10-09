#!/usr/bin/env python3
"""
Fetch official Ontario curriculum expectations (Grades 1-6, plus Kindergarten)
from the Ministry of Education's public content API that powers
https://www.dcp.edu.gov.on.ca and write them to js/expectations.<lang>.js.

Usage:
    python3 tools/fetch_expectations.py            # English + French
    python3 tools/fetch_expectations.py --lang en  # one language
    python3 tools/fetch_expectations.py --probe kindergarten

Content (c) King's Printer for Ontario. Reproduced for non-commercial,
educational use with attribution.
"""
import argparse
import html
import json
import os
import re
import sys
import time
import urllib.request

API = "https://ws.api.dcp.edu.gov.on.ca/content/api"
LANGS = {"en": "en-CA", "fr": "fr-CA"}
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(os.environ.get("TMPDIR", "/tmp"), "dcp_cache")

# subject id -> {grade id: course codename}
COURSES = {
    "k": {"k": "kindergarten"},
    "lang": {f"g{n}": f"lang___fra___grade_{n}" for n in range(1, 7)},
    "math": {f"g{n}": f"ele___math___grade_{n}" for n in range(1, 7)},
    "sci": {f"g{n}": f"sci___tech___grade_{n}" for n in range(1, 7)},
    "ss": {"g1": "sshg___grade_1", "g2": "sshg___grade_1__copy_", "g3": "sshg___grade_2__copy_",
           "g4": "sshg___grade_3__copy_", "g5": "sshg___grade_4__copy_", "g6": "sshg___grade_5__copy_"},
    "hpe": {f"g{n}": f"hpe___grade_{n}" for n in range(1, 7)},
    "arts": {f"g{n}": f"arts___grade_{n}" for n in range(1, 7)},
    "fsl": {"g4": "fsl___core___grade_4", "g5": "fsl___core___grade_4__copy_", "g6": "fsl___core___grade_5__copy_"},
    "fsli": {"g1": "fsl___immersion___grade_1", "g2": "fsl___immersion___grade_1__copy_",
             "g3": "fsl___immersion___grade_2__copy_", "g4": "fsl___extended___grade_4__copy__bb04c0f",
             "g5": "fsl___immersion___grade_4__copy_", "g6": "fsl___immersion___grade_5__copy_"},
}
URL_SLUGS = {"k": "kindergarten", "lang": "elementary-language", "math": "elementary-mathematics", "sci": "science-technology",
             "ss": "elementary-sshg", "hpe": "elementary-health-and-physical-education",
             "arts": "elementary-arts", "fsl": "elementary-fsl", "fsli": "elementary-fsl"}
# The French-language versions of these documents match what TDSB teaches expectation-for-expectation.
# Other subjects' French versions are written for French-language schools and differ (e.g. Language ->
# Francais, Arts, Social Studies, Kindergarten), so the French site shows the official English text.
FR_EQUIVALENT = {"math": "elementaire-mathematiques", "sci": "sciences-technologie",
                 "hpe": "elementaire-education-physique-sante"}


def get(path, lang, depth):
    os.makedirs(CACHE, exist_ok=True)
    key = re.sub(r"[^A-Za-z0-9_]", "_", f"{path}_{lang}_{depth}") + ".json"
    fp = os.path.join(CACHE, key)
    if os.path.exists(fp):
        with open(fp, encoding="utf-8") as f:
            return json.load(f)
    url = f"{API}/items/{path}?language={LANGS[lang]}&depth={depth}"
    req = urllib.request.Request(url, headers={"User-Agent": "tdsb-curriculum-guide (parent education site)"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.load(r)
            break
        except Exception as e:  # noqa: BLE001
            print(f"  retry {attempt + 1} for {path}: {e}", file=sys.stderr)
            time.sleep(2 + attempt * 3)
    else:
        raise RuntimeError(f"failed: {url}")
    with open(fp, "w", encoding="utf-8") as f:
        json.dump(data, f)
    time.sleep(0.4)  # be polite
    return data


def clean(rich):
    """Rich text -> plain text, keeping list items as '; '-separated."""
    s = rich or ""
    s = re.sub(r"<math.*?</math>", "", s, flags=re.S)
    s = re.sub(r"</li>\s*<li[^>]*>", "; ", s)
    s = re.sub(r"</?(p|div|br|ul|ol|li|h\d)\b[^>]*>", " ", s)  # block tags -> space
    s = re.sub(r"<[^>]+>", "", s)  # inline tags (glossary links etc.) -> nothing
    s = html.unescape(s).replace(" ", " ")
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\s+([,.;:)\]])", r"\1", s)
    s = re.sub(r"([(\[])\s+", r"\1", s)
    s = re.sub(r"([“])\s+", r"\1", s)
    s = re.sub(r"\s+([”])", r"\1", s)
    return s.strip()


def val(item, name):
    e = item["elements"].get(name)
    return e["value"] if e else None


def extract(course, lang):
    """Return list of strands: {code, title, why, overall: [{code, title, text, specific: [...]}]}."""
    top = get(course, lang, 1)
    sections = val(top["item"], "sections") or []
    strands = []
    seen = set()
    for sec in sections:
        data = get(sec, lang, 6)
        mc = data["modular_content"]
        mc[data["item"]["system"]["codename"]] = data["item"]

        def text_of(codenames):
            out = []
            for cn in codenames or []:
                it = mc.get(cn)
                if not it:
                    continue
                for k, v in it["elements"].items():
                    if v["type"] == "rich_text" and v["value"] and k not in ("describer",):
                        t = clean(v["value"])
                        if t:
                            out.append(t)
            return " ".join(out)

        def walk(cn, cur):
            it = mc.get(cn)
            if not it or cn in seen:
                return
            t = it["system"]["type"]
            if t == "l3___strand":
                seen.add(cn)
                s = {"code": val(it, "title_index") or "", "title": val(it, "title") or "",
                     "why": text_of(val(it, "why_is_this_learning_important")), "overall": []}
                strands.append(s)
                for o in val(it, "overall_expectations") or []:
                    walk(o, s)
                # Some documents nest sub-strands or expectations differently.
                for k, v in it["elements"].items():
                    if v["type"] == "modular_content" and k not in ("overall_expectations", "why_is_this_learning_important"):
                        for ch in v["value"]:
                            walk(ch, s)
                return
            if t == "l4___overall_expectation" and cur is not None:
                seen.add(cn)
                o = {"code": val(it, "title_index") or "", "title": val(it, "title") or "",
                     "text": clean(val(it, "content")), "specific": []}
                cur["overall"].append(o)
                for sp in val(it, "specific_expectations") or []:
                    si = mc.get(sp)
                    if si and si["system"]["type"] == "l5___specific_expectation":
                        o["specific"].append({"code": val(si, "title_index") or "", "title": val(si, "title") or "",
                                              "text": clean(val(si, "content"))})
                return
            if t in ("elaborations",):
                return
            for k, v in it["elements"].items():
                if v["type"] == "modular_content":
                    for ch in v["value"]:
                        walk(ch, cur)

        walk(data["item"]["system"]["codename"], None)
    return strands


def probe(codename, lang):
    top = get(codename, lang, 1)
    print("sections:", val(top["item"], "sections"))
    for sec in val(top["item"], "sections") or []:
        d = get(sec, lang, 6)
        types = {}
        for v in d["modular_content"].values():
            types[v["system"]["type"]] = types.get(v["system"]["type"], 0) + 1
        print(" ", sec, types)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", choices=list(LANGS), action="append")
    ap.add_argument("--probe")
    a = ap.parse_args()
    langs = a.lang or list(LANGS)
    if a.probe:
        probe(a.probe, langs[0])
        return
    for lang in langs:
        out = {"subjects": {}}  # no timestamps: unchanged data must produce identical files
        for sid, grades in COURSES.items():
            out["subjects"][sid] = {}
            src = lang if (lang == "en" or sid in FR_EQUIVALENT) else "en"
            for gid, course in grades.items():
                print(f"[{lang}] {sid} {gid} <- {course} ({src})")
                strands = extract(course, src)
                n_o = sum(len(s["overall"]) for s in strands)
                n_s = sum(len(o["specific"]) for s in strands for o in s["overall"])
                print(f"    {len(strands)} strands, {n_o} overall, {n_s} specific")
                slug = FR_EQUIVALENT[sid] if src == "fr" else URL_SLUGS[sid]
                out["subjects"][sid][gid] = {
                    "url": f"https://www.dcp.edu.gov.on.ca/{src}/curriculum/{slug}",
                    "sourceLang": src,
                    "strands": strands,
                }
        dest = os.path.join(ROOT, "js", f"expectations.{lang}.js")
        with open(dest, "w", encoding="utf-8") as f:
            f.write("/* Official Ontario curriculum expectations. (c) King's Printer for Ontario.\n"
                    "   Generated by tools/fetch_expectations.py -- do not edit by hand. */\n")
            f.write(f"window.EXPECTATIONS = window.EXPECTATIONS || {{}};\nwindow.EXPECTATIONS.{lang} = ")
            json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
            f.write(";\n")
        print(f"wrote {dest} ({os.path.getsize(dest) // 1024} KB)")


if __name__ == "__main__":
    main()
