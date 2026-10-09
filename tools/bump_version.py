#!/usr/bin/env python3
"""
Set the cache-busting version (ASSET_V in js/app.js and the ?v= tags in index.html) so
browsers fetch fresh copies after data or code changes.

Usage:
    python3 tools/bump_version.py            # version = today's date, e.g. 20261101
    python3 tools/bump_version.py 20261101b
"""
import os
import re
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
version = sys.argv[1] if len(sys.argv) > 1 else time.strftime("%Y%m%d")

for path, pattern, repl in [
    ("index.html", r'\?v=[0-9a-z]+"', f'?v={version}"'),
    ("js/app.js", r'const ASSET_V = "[0-9a-z]+";', f'const ASSET_V = "{version}";'),
]:
    fp = os.path.join(ROOT, path)
    with open(fp, encoding="utf-8") as f:
        txt = f.read()
    new, n = re.subn(pattern, repl, txt)
    if not n:
        sys.exit(f"no version tag found in {path}")
    with open(fp, "w", encoding="utf-8") as f:
        f.write(new)
    print(f"{path}: {n} tag(s) set to {version}")
