# TDSB Curriculum Guide for Parents (JK – Grade 6)

An interactive, plain-language guide to the Ontario curriculum as taught in Toronto District School Board schools.

Available in **English and French** (language button in the header, or add `?lang=fr` to a link).

**Features**
- **Overview** – grade × subject grid of the whole curriculum (a grade picker with a subject list on phones)
- **Grade pages** – big ideas, subject-by-subject learning, tips for home, questions for the teacher, printable
- **Official expectations** – the Ministry's overall and specific expectations, word for word, for every subject and grade (plus the 2026 Kindergarten program), with the Ministry's "Why is my child learning this?" notes and a filter
- **Practice activities** – on each grade page, free outside links for every subject: TVO Learn activities by curriculum strand, EQAO sample tests (Grades 3 and 6) and Waterloo's Problem of the Week (math, Grades 3–6). Links live in [`js/practice.js`](js/practice.js); `python3 tools/check_links.py` checks them (also run monthly). To hide them, set `SHOW_PRACTICE = false` in `js/app.js`
- **Subject journeys** – how each subject builds from JK to Grade 6
- **Compare two grades** – side by side, with "what changes" highlights
- **Interview handout** – a printable one-page sheet for parent-teacher interviews
- **Report card decoder** – letter grades ↔ levels, learning skills, report card timing
- **Milestones** – EQAO, Grade 3 gifted screening, French Immersion windows, transitions
- **Schools & EQAO** – map (TDSB or all Ontario schools) and sortable table, school profiles for any Ontario elementary school, "schools like this one" (closest schools by community context), side-by-side comparison of up to 4 schools from any board (five-year averages and ranges, level breakdowns, where each school sits among all TDSB schools, results for girls/boys, English learners and special education, Grade 3 to Grade 6 tracking of the same students), and a private "my child's EQAO results" explainer
- **Toronto overview** – results vs. what's expected given low-income share (scatter, table and map), results by school income level over time, year-to-year change vs. school size (funnel plot), TDSB vs. Ontario by student group, and what students say in EQAO's questionnaire vs. results
- **Learning tracker** – checklist saved in the browser (localStorage only)
- **Glossary** and site-wide **search**

## Run locally
No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8765
```

## Edit content
- Plain-language summaries: [`js/data.js`](js/data.js) (English) and [`js/data.fr.js`](js/data.fr.js) (French). Each subject has an entry per grade (`jk`, `sk`, `g1` … `g6`) with `focus`, `learn`, and `home` lists. Keep both files in the same order -- the tracker keys checkmarks by position.
- Tracker pop-up explanations: [`js/explain.en.js`](js/explain.en.js) and [`js/explain.fr.js`](js/explain.fr.js) -- one `[what it means, what you might see]` pair per tracker item, in the same order as the `learn` lists.
- Interface text: [`js/i18n.js`](js/i18n.js).

## Refresh the generated data
These files are generated -- don't edit them by hand:

| File | Source | Command |
|---|---|---|
| `js/expectations.en.js`, `js/expectations.fr.js` | Ministry of Education curriculum site (dcp.edu.gov.on.ca) content API | `python3 tools/fetch_expectations.py` |
| `js/boards/<board>.js` | Same detail as `js/schools.js` for every other Ontario board (one file per board, loaded only when one of its schools is opened or compared) | built by `tools/build_schools.py` |
| `js/tracking.js` | EQAO results site: Grade 3 to Grade 6 tracking of the same students (latest year), TDSB and Toronto Catholic schools. Not in EQAO's open-data files, so one small file per school is requested at 10-second intervals (robots.txt crawl-delay), ~80 minutes | `python3 tools/fetch_eqao_tracking.py --boards toronto-cdsb` |
| `js/schools-ontario.js` | Same sources, every Ontario elementary school (latest EQAO year, compact rows) for the maps' "All Ontario schools" view | built by `tools/build_schools.py` |
| `js/schools.js` | Results: [EQAO open data](https://www.eqao.com/about-eqao/open-data/). School list, map locations and context: Ontario open data, [School information and student demographics](https://data.ontario.ca/dataset/school-information-and-student-demographics) | `python3 tools/build_schools.py` (needs `openpyxl`) |

After regenerating, run `python3 tools/check_data.py` (sanity checks) and `python3 tools/bump_version.py` (updates `ASSET_V` in `js/app.js` and the `?v=` tags in `index.html` so browsers fetch the new files).

### Automatic refresh
`.github/workflows/refresh-data.yml` runs on the 1st of every month (and on demand from the Actions tab). It rebuilds the curriculum and school data, runs the checks, and opens a pull request if anything changed -- nothing is published until you merge it. On the 15th of September, October and November it also refreshes the Grade 3 to 6 tracking. Requires **Settings → Actions → General → Workflow permissions → "Allow GitHub Actions to create and approve pull requests"**.

**Notes on the data**
- In French, Math, Science and Health & PE use the Ministry's French text (same expectations). Language, Arts, Social Studies and Kindergarten have French versions written for French-language schools that differ from what TDSB teaches, so the French site shows their official English text with a note. FSL is only published in English.
- Children in low-income households is a Ministry estimate: students' home postal codes are matched to Statistics Canada census income data for those neighbourhoods (after-tax Low-Income Measure). It describes neighbourhoods, not families, and is randomly rounded by the Ministry.
- "Schools like this one" = nearest schools in the same board on five standardized context measures (low income, English learners, newcomers, special education, parents without a diploma).
- "Expected" results are a straight-line fit of each school's result against its share of children in low-income households, across TDSB schools for that assessment and year. Funnel limits use the TDSB result and each school's number of participating students (approx. 95% and 99.8%). Subgroup and questionnaire data come from the same EQAO files; groups under 10 students are suppressed by EQAO.
- EQAO school results come from EQAO's open data, 2021-22 onward (EQAO posts each year's files in the fall; rerun the build script to pick up a new year). TDSB and Ontario reference values are EQAO's official all-student results (Ontario = English-language schools). School context (low income, English learners, etc.) comes from the latest Ministry school file, which lags a few years behind.

## Publish on GitHub Pages
1. Create a GitHub repo and push this folder to `main`.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` / `(root)`.
3. The site will be at `https://<your-username>.github.io/<repo-name>/`.

## Disclaimer and licences
This is an independent summary, not an official TDSB or Ontario Ministry of Education resource. See the official curriculum at <https://www.dcp.edu.gov.on.ca/en/curriculum>.
- Curriculum expectations © King's Printer for Ontario, reproduced for non-commercial educational use with attribution.
- School results: EQAO open data. School directory and context: Ontario Ministry of Education, Open Government Licence – Ontario.
- Map tiles © OpenStreetMap contributors; map library: Leaflet.
