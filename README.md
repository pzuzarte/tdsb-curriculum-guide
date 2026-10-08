# TDSB Curriculum Guide for Parents (JK – Grade 6)

An interactive, plain-language guide to the Ontario curriculum as taught in Toronto District School Board schools.

**Features**
- **Overview** – grade × subject grid of the whole curriculum, plus a "which grade is my child in?" calculator
- **Grade pages** – big ideas, subject-by-subject learning, tips for home, questions for the teacher, printable
- **Subject journeys** – how each subject builds from JK to Grade 6
- **Report card decoder** – letter grades ↔ levels, learning skills, report card timing
- **Milestones** – EQAO, Grade 3 gifted screening, French Immersion windows, transitions
- **Learning tracker** – checklist saved in the browser (localStorage only)
- **Glossary** and site-wide **search**

## Run locally
No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8765
```

## Edit content
All curriculum text is in [`js/data.js`](js/data.js). Each subject has an entry per grade (`jk`, `sk`, `g1` … `g6`) with `focus`, `learn`, and `home` lists. The UI picks up changes automatically.

## Publish on GitHub Pages
1. Create a GitHub repo and push this folder to `main`.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` / `(root)`.
3. The site will be at `https://<your-username>.github.io/<repo-name>/`.

## Disclaimer
This is an independent summary, not an official TDSB or Ontario Ministry of Education resource. See the official curriculum at <https://www.dcp.edu.gov.on.ca/en/curriculum>.
