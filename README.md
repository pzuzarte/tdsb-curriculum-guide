# TDSB Curriculum Guide for Parents (JK – Grade 6)

An interactive, plain-language guide to the Ontario curriculum as taught in Toronto District School Board schools.

Available in **English and French** (language button in the header, or add `?lang=fr` to a link).

**Features**
- **Overview** – grade × subject grid of the whole curriculum, plus a "which grade is my child in?" calculator
- **Grade pages** – big ideas, subject-by-subject learning, tips for home, questions for the teacher, printable
- **Official expectations** – the Ministry's overall and specific expectations, word for word, for every subject and grade (plus the 2026 Kindergarten program), with the Ministry's "Why is my child learning this?" notes and a filter
- **Subject journeys** – how each subject builds from JK to Grade 6
- **Compare two grades** – side by side, with "what changes" highlights
- **Interview handout** – a printable one-page sheet for parent-teacher interviews
- **Report card decoder** – letter grades ↔ levels, learning skills, report card timing
- **Milestones** – EQAO, Grade 3 gifted screening, French Immersion windows, transitions
- **Schools & EQAO** – map and sortable table of all TDSB elementary schools, school profiles with results over time and school context, side-by-side comparison of up to 4 schools, and a private "my child's EQAO results" explainer
- **Learning tracker** – checklist saved in the browser (localStorage only)
- **Glossary** and site-wide **search**

## Run locally
No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8765
```

## Edit content
- Plain-language summaries: [`js/data.js`](js/data.js) (English) and [`js/data.fr.js`](js/data.fr.js) (French). Each subject has an entry per grade (`jk`, `sk`, `g1` … `g6`) with `focus`, `learn`, and `home` lists. Keep both files in the same order -- the tracker keys checkmarks by position.
- Interface text: [`js/i18n.js`](js/i18n.js).

## Refresh the generated data
These files are generated -- don't edit them by hand:

| File | Source | Command |
|---|---|---|
| `js/expectations.en.js`, `js/expectations.fr.js` | Ministry of Education curriculum site (dcp.edu.gov.on.ca) content API | `python3 tools/fetch_expectations.py` |
| `js/schools.js` | Ontario open data: [School information and student demographics](https://data.ontario.ca/dataset/school-information-and-student-demographics) | `python3 tools/build_schools.py` (needs `openpyxl`) |

After regenerating, bump `ASSET_V` in `js/app.js` and the `?v=` tags in `index.html` so browsers fetch the new files.

**Notes on the data**
- In French, Math, Science and Health & PE use the Ministry's French text (same expectations). Language, Arts, Social Studies and Kindergarten have French versions written for French-language schools that differ from what TDSB teaches, so the French site shows their official English text with a note. FSL is only published in English.
- EQAO school results: the latest open data year is 2022-23. 2019-20 and 2020-21 are excluded (no assessments; the source repeats the prior year). "Typical school" values are medians across schools, not official board or provincial averages.

## Publish on GitHub Pages
1. Create a GitHub repo and push this folder to `main`.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` / `(root)`.
3. The site will be at `https://<your-username>.github.io/<repo-name>/`.

## Disclaimer and licences
This is an independent summary, not an official TDSB or Ontario Ministry of Education resource. See the official curriculum at <https://www.dcp.edu.gov.on.ca/en/curriculum>.
- Curriculum expectations © King's Printer for Ontario, reproduced for non-commercial educational use with attribution.
- School data: Ontario Ministry of Education, Open Government Licence – Ontario.
- Map tiles © OpenStreetMap contributors; map library: Leaflet.
