/* TDSB Curriculum Guide -- single-page app with hash routing. No build step. */
(function () {
  "use strict";

  const D = window.CURRICULUM;
  const main = document.getElementById("main");
  const gradeById = Object.fromEntries(D.grades.map(g => [g.id, g]));
  const subjectById = Object.fromEntries(D.subjects.map(s => [s.id, s]));
  const STORE_KEY = "tdsb-guide-tracker-v1";

  // ---------- helpers ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = (items, cls = "ticks") => items.length ? `<ul class="clean ${cls}">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
  const gradeChips = (active, base = "#/grade/") =>
    `<nav class="grade-chips" aria-label="Choose a grade">${D.grades.map(g => `<a href="${base}${g.id}" class="${g.id === active ? "active" : ""}">${esc(g.short)}</a>`).join("")}</nav>`;
  const isK = id => id === "jk" || id === "sk";

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveStore(obj) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) { /* storage unavailable */ }
  }

  // School year starts in September; before Sept we're still in the previous school year.
  function currentSchoolYear(d = new Date()) {
    return d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
  }
  // Ontario: JK in the September of the calendar year the child turns 4.
  function gradeIndexFor(birthYear, schoolYearStart) {
    return schoolYearStart - birthYear - 4; // 0 = JK, 1 = SK, 2 = Gr 1 ... 7 = Gr 6
  }

  // ---------- views ----------
  function viewHome() {
    const sy = currentSchoolYear();
    const years = [];
    for (let y = sy - 12; y <= sy - 1; y++) years.push(y);
    const saved = loadStore().birthYear;

    const matrixRows = D.subjects.map(s => `
      <tr>
        <th scope="row"><a href="#/subject/${s.id}"><span class="dot" style="background:${s.color}"></span>${s.icon} ${esc(s.name)}</a></th>
        ${D.grades.map(g => {
          const e = s.grades[g.id];
          const empty = !e.learn.length && s.id === "fsl";
          return `<td class="${empty ? "empty" : ""}"><a href="#/grade/${g.id}/${s.id}">${esc(shortFocus(s, g.id))}</a></td>`;
        }).join("")}
      </tr>`).join("");

    main.innerHTML = `
      <section class="hero">
        <div>
          <span class="pill">Ontario curriculum · Toronto District School Board</span>
          <h1>What is my child learning this year?</h1>
          <p class="lead">A plain-language guide to the curriculum from Junior Kindergarten to Grade 6: what's taught, how it builds year to year, how report cards work, and how you can help at home.</p>
          ${gradeChips(null)}
        </div>
        <div class="card calc">
          <h3>Which grade is my child in?</h3>
          <label for="by">Year your child was born</label>
          <div class="row">
            <select id="by">
              <option value="">Choose a year</option>
              ${years.reverse().map(y => `<option ${saved == y ? "selected" : ""}>${y}</option>`).join("")}
            </select>
          </div>
          <div class="calc-out" id="calcOut" aria-live="polite"><p class="muted">Children start JK in September of the year they turn 4.</p></div>
        </div>
      </section>

      <h2>The whole picture at a glance</h2>
      <p class="muted">Each cell is the main focus for that subject and grade. Select one to see the details.</p>
      <div class="matrix-wrap">
        <table class="matrix">
          <thead><tr><th>Subject</th>${D.grades.map(g => `<th><a href="#/grade/${g.id}">${esc(g.short)}</a></th>`).join("")}</tr></thead>
          <tbody>${matrixRows}</tbody>
        </table>
      </div>

      <h2>Tools for parents</h2>
      <div class="grid grid-3">
        ${tool("#/report", "📝", "Report card decoder", "What do B+, Level 3 and 'S' in Collaboration actually mean?")}
        ${tool("#/milestones", "🗓️", "Key milestones", "EQAO, gifted screening, French Immersion windows and more.")}
        ${tool("#/tracker", "✅", "Learning tracker", "Check off skills you see at home. Saved on this device only.")}
        ${tool("#/subject/math", "📈", "Subject journeys", "See how a subject builds from JK to Grade 6.")}
        ${tool("#/glossary", "📖", "Glossary", "IEP, IPRC, DECE, strands and other school jargon explained.")}
        ${tool("#/grade/g3", "💬", "Questions for the teacher", "Ready-made questions on every grade page for parent-teacher interviews.")}
      </div>`;

    const sel = document.getElementById("by");
    const render = () => {
      const by = parseInt(sel.value, 10);
      const out = document.getElementById("calcOut");
      if (!by) return;
      const st = loadStore(); st.birthYear = by; saveStore(st);
      const idx = gradeIndexFor(by, sy);
      let headline;
      if (idx < 0) headline = `Starts JK in September ${by + 4}`;
      else if (idx >= D.grades.length) headline = `Beyond Grade 6 in ${sy}-${String(sy + 1).slice(2)}`;
      else headline = `${gradeById[D.grades[idx].id].name} in ${sy}-${String(sy + 1).slice(2)}`;
      const chips = D.grades.map((g, i) => {
        const y = by + 4 + i;
        return `<a href="#/grade/${g.id}" class="${i === idx ? "now" : ""}">${g.short}: ${y}-${String(y + 1).slice(2)}</a>`;
      }).join("");
      const go = idx >= 0 && idx < D.grades.length ? `<p><a class="btn" href="#/grade/${D.grades[idx].id}">See ${esc(D.grades[idx].name)} →</a></p>` : "";
      out.innerHTML = `<div class="big">${esc(headline)}</div>${go}<div class="calc-years">${chips}</div>
        <p class="muted" style="font-size:.82rem;margin-top:8px">Based on Ontario's rule of starting JK in the year a child turns 4. Some children are placed differently.</p>`;
    };
    sel.addEventListener("change", render);
    if (saved) render();
  }

  function shortFocus(s, gid) {
    const t = s.threads[0] && s.threads[0].values[gid];
    if (s.id === "fsl") return s.threads.map(th => th.values[gid]).filter(v => v && v !== "--" && v !== "Immersion")[0] || (gid === "jk" || gid === "sk" || /^g[1-3]$/.test(gid) ? "Immersion only" : "Core French");
    if (isK(gid)) return t;
    return s.threads.map(th => th.values[gid]).slice(0, 2).join(" · ");
  }

  function tool(href, icon, title, text) {
    return `<a class="card" href="${href}" style="text-decoration:none;color:inherit"><h3>${icon} ${esc(title)}</h3><p class="muted" style="margin:0">${esc(text)}</p></a>`;
  }

  function viewGrade(gid, focusSubject) {
    const g = gradeById[gid];
    if (!g) return notFound();
    const idx = D.grades.indexOf(g);
    const prev = D.grades[idx - 1], next = D.grades[idx + 1];
    const ms = D.milestones.filter(m => m.grade === gid);

    const frames = isK(gid) ? `
      <h2>The four frames of Kindergarten</h2>
      <p class="muted">Kindergarten isn't split into subjects. Learning is organized into four "frames" and taught mostly through play and inquiry. The revised Kindergarten program (in effect from September 2026) keeps play-based learning and adds a stronger, more explicit focus on early literacy, math, and science and technology.</p>
      <div class="grid grid-4 frames">${D.kindergartenFrames.map(f => `
        <div class="card"><h3>${f.icon} ${esc(f.name)}</h3><p>${esc(f.desc)}</p>${list(f.examples)}</div>`).join("")}
      </div>
      <h2>How each subject starts in ${esc(g.short)}</h2>` : `<h2>Subject by subject</h2>`;

    const cards = D.subjects.map(s => {
      const e = s.grades[gid];
      return `
        <article class="card subj" id="s-${s.id}" style="--c:${s.color}">
          <h3>${s.icon} ${esc(s.name)}</h3>
          <p class="focus">${esc(e.focus)}</p>
          ${e.learn.length ? `<strong>What they work on</strong>${list(e.learn)}` : ""}
          ${e.home.length ? `<strong>Help at home</strong>${list(e.home, "homes")}` : ""}
          <p style="margin-bottom:0"><a href="#/subject/${s.id}">See the ${esc(s.name)} journey →</a></p>
        </article>`;
    }).join("");

    main.innerHTML = `
      ${gradeChips(gid)}
      <span class="pill">${esc(g.age)}</span>
      <h1>${esc(g.name)}</h1>
      <p class="lead">${esc(g.summary)}</p>
      <div class="page-actions">
        <button class="btn ghost" onclick="window.print()">🖨️ Print this grade</button>
        <a class="btn ghost" href="#/tracker/${gid}">✅ Open ${esc(g.short)} tracker</a>
      </div>
      <div class="grid grid-2">
        <div class="card"><h3>Big ideas this year</h3>${list(g.big)}</div>
        <div class="card"><h3>💬 Questions to ask the teacher</h3>${list(g.ask, "")}</div>
      </div>
      ${ms.length ? `<div class="note"><strong>Milestones this year:</strong> ${ms.map(m => esc(m.title)).join(" · ")} · <a href="#/milestones">details</a></div>` : ""}
      ${frames}
      <div class="grid grid-2">${cards}</div>
      <div class="page-actions" style="justify-content:space-between;margin-top:24px">
        ${prev ? `<a class="btn ghost" href="#/grade/${prev.id}">← ${esc(prev.name)}</a>` : "<span></span>"}
        ${next ? `<a class="btn ghost" href="#/grade/${next.id}">${esc(next.name)} →</a>` : ""}
      </div>`;

    if (focusSubject) {
      const el = document.getElementById("s-" + focusSubject);
      if (el) { el.scrollIntoView({ block: "start" }); el.style.outline = "3px solid " + subjectById[focusSubject].color; }
    }
  }

  function viewSubject(sid) {
    const s = subjectById[sid];
    if (!s) return notFound();
    main.innerHTML = `
      <nav class="subject-tabs" aria-label="Choose a subject">${D.subjects.map(x => `<a href="#/subject/${x.id}" style="--c:${x.color}" class="${x.id === sid ? "active" : ""}">${x.icon} ${esc(x.name)}</a>`).join("")}</nav>
      <h1>${s.icon} ${esc(s.name)}: the journey from JK to Grade 6</h1>
      <p class="lead">${esc(s.intro)}</p>
      <div class="grid grid-2">
        <div class="card"><h3>Strands (main areas)</h3>${list(s.strands, "")}</div>
        <div class="card"><h3>Official document</h3><p>${esc(s.doc)}</p><p><a href="${s.url}" target="_blank" rel="noopener">Read the official curriculum ↗</a></p></div>
      </div>

      <h2>How it builds, year by year</h2>
      <div class="thread-wrap">
        <table class="thread">
          <thead><tr><th></th>${D.grades.map(g => `<th><a href="#/grade/${g.id}/${s.id}">${esc(g.short)}</a></th>`).join("")}</tr></thead>
          <tbody>${s.threads.map(t => `<tr><th scope="row">${esc(t.name)}</th>${D.grades.map(g => `<td>${esc(t.values[g.id] || "")}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>

      <h2>Grade by grade</h2>
      <p class="muted">Scroll sideways to follow the journey.</p>
      <div class="journey" style="--c:${s.color}">
        ${D.grades.map(g => {
          const e = s.grades[g.id];
          return `<div class="card"><div class="step">${esc(g.name)}</div><p>${esc(e.focus)}</p>${list(e.learn)}<a href="#/grade/${g.id}/${s.id}">Open in ${esc(g.short)} →</a></div>`;
        }).join("")}
      </div>`;
  }

  function viewReport() {
    const R = D.reportCards;
    main.innerHTML = `
      <h1>📝 Report card decoder</h1>
      <p class="lead">Ontario report cards follow the provincial <em>Growing Success</em> policy. Here's what everything means.</p>

      <h2>Decode a grade</h2>
      <div class="card">
        <p style="margin-top:0">Select a letter grade from your child's report card (Grades 1-6):</p>
        <div class="letter-picker" id="letters">
          ${R.levels.flatMap(l => l.letters).map(x => `<button type="button" data-l="${x}">${x}</button>`).join("")}
        </div>
        <div class="decode-out" id="decodeOut" aria-live="polite"><p class="muted">Level 3 (B range) is the provincial standard -- the goal for every student.</p></div>
      </div>

      <h2>Achievement levels</h2>
      <div class="levels">${R.levels.map(l => `
        <div class="level-row" data-level="${l.level}"><div class="badge ${l.tone}">${l.level}</div>
        <div><strong>${l.letters.join(", ")}</strong> <span class="muted">(${l.pct})</span><br>${esc(l.meaning)}</div></div>`).join("")}
      </div>

      <h2>When report cards come home</h2>
      <div class="tl">
        <div class="tl-row head"><div></div><div>Kindergarten</div><div>Grades 1-6</div></div>
        ${R.timeline.map(t => `<div class="tl-row"><div><strong>${esc(t.when)}</strong></div><div>${esc(t.k)}</div><div>${esc(t.e)}</div></div>`).join("")}
      </div>
      <div class="note">Kindergarten report cards (Communication of Learning) use written comments about the four frames -- there are no letter grades until Grade 1.</div>

      <h2>Learning skills and work habits</h2>
      <p>Reported separately from grades, rated <strong>${R.skillRatings.map(r => `${r.code}</strong> = ${r.name}`).join(", <strong>")}.</p>
      <div class="grid grid-3">${R.skills.map(s => `<div class="card"><h3>${esc(s.name)}</h3><p class="muted" style="margin:0">${esc(s.desc)}</p></div>`).join("")}</div>

      <h2>Checkboxes on the report card</h2>
      <div class="grid grid-2">${R.boxes.map(b => `<div class="card"><h3>${esc(b.name)}</h3><p class="muted" style="margin:0">${esc(b.desc)}</p></div>`).join("")}</div>`;

    const out = document.getElementById("decodeOut");
    document.getElementById("letters").addEventListener("click", ev => {
      const b = ev.target.closest("button"); if (!b) return;
      document.querySelectorAll("#letters button").forEach(x => x.classList.toggle("sel", x === b));
      const lv = R.levels.find(l => l.letters.includes(b.dataset.l));
      document.querySelectorAll(".level-row").forEach(r => r.classList.toggle("sel", r.dataset.level === lv.level));
      const advice = { "4": "Keep encouraging curiosity and challenge -- ask the teacher about enrichment.", "3": "Your child is meeting the standard. Look at the 'next steps' comments to keep growing.", "2": "Ask the teacher which specific skills to focus on, and how you can practise at home.", "1": "Request a meeting with the teacher to discuss a support plan.", "R": "Request a meeting soon. Ask about extra support and whether a School Support Team (SST) referral is appropriate.", "I": "Ask the teacher what evidence is missing and how it will be gathered." }[lv.level];
      out.innerHTML = `<p style="margin:0"><span class="badge ${lv.tone}" style="display:inline-block;padding:2px 10px;border-radius:8px;color:#fff;font-weight:700">Level ${lv.level}</span> <strong>${esc(b.dataset.l)}</strong> · ${lv.pct}</p><p>${esc(lv.meaning)}</p><p class="muted" style="margin-bottom:0"><strong>What to do:</strong> ${esc(advice)}</p>`;
    });
  }

  function viewMilestones() {
    const groups = [{ id: "before", name: "Before school starts" }].concat(D.grades.map(g => ({ id: g.id, name: g.name })));
    main.innerHTML = `
      <h1>🗓️ Key milestones, JK to Grade 6</h1>
      <p class="lead">Dates and application windows change each year -- always confirm on the TDSB website or with your school.</p>
      <div class="timeline">
        ${groups.map(gr => {
          const items = D.milestones.filter(m => m.grade === gr.id);
          if (!items.length) return "";
          return `<section class="tl-group"><h3>${gr.id !== "before" ? `<a href="#/grade/${gr.id}">${esc(gr.name)}</a>` : esc(gr.name)}</h3>
            ${items.map(m => `<div class="card ms"><span class="pill">${esc(m.tag)}</span><h3 style="margin-top:6px">${esc(m.title)}</h3><p style="margin:0">${esc(m.text)}</p></div>`).join("")}
          </section>`;
        }).join("")}
      </div>`;
  }

  function viewTracker(gid) {
    const store = loadStore();
    if (!gid) {
      const by = store.birthYear;
      const idx = by ? gradeIndexFor(by, currentSchoolYear()) : -1;
      gid = store.lastGrade || (idx >= 0 && idx < D.grades.length ? D.grades[idx].id : "g1");
    }
    const g = gradeById[gid];
    if (!g) return notFound();
    store.lastGrade = gid; saveStore(store);
    const checks = (store.checks = store.checks || {});

    const subs = D.subjects.filter(s => s.grades[gid].learn.length);
    const total = subs.reduce((n, s) => n + s.grades[gid].learn.length, 0);

    main.innerHTML = `
      ${gradeChips(gid, "#/tracker/")}
      <h1>✅ ${esc(g.name)} learning tracker</h1>
      <p class="lead">Check off things you've seen your child do. This is a conversation starter, not a test -- children develop at different rates, and your child's teacher has the full picture.</p>
      <div class="card tracker-head">
        <div style="flex:1;min-width:220px"><strong id="totalTxt"></strong><div class="progress" style="margin-top:6px"><span id="totalBar"></span></div></div>
        <div class="page-actions" style="margin:0">
          <button class="btn ghost" onclick="window.print()">🖨️ Print</button>
          <button class="btn ghost" id="resetBtn">Reset ${esc(g.short)}</button>
        </div>
      </div>
      <p class="muted" style="font-size:.85rem">Saved only in this browser on this device. Nothing is sent anywhere.</p>
      <div class="grid grid-2" style="margin-top:12px" id="trk">
        ${subs.map(s => `
          <div class="card subj" style="--c:${s.color}">
            <h3>${s.icon} ${esc(s.name)}</h3>
            <div class="progress" style="--c:${s.color};margin-bottom:8px"><span data-bar="${s.id}"></span></div>
            ${s.grades[gid].learn.map((item, i) => {
              const key = `${gid}.${s.id}.${i}`;
              return `<label class="check ${checks[key] ? "done" : ""}"><input type="checkbox" data-key="${key}" ${checks[key] ? "checked" : ""}><span>${esc(item)}</span></label>`;
            }).join("")}
          </div>`).join("")}
      </div>`;

    const update = () => {
      let done = 0;
      subs.forEach(s => {
        const n = s.grades[gid].learn.length;
        let d = 0;
        for (let i = 0; i < n; i++) if (checks[`${gid}.${s.id}.${i}`]) d++;
        done += d;
        main.querySelector(`[data-bar="${s.id}"]`).style.width = (100 * d / n) + "%";
      });
      document.getElementById("totalTxt").textContent = `${done} of ${total} checked`;
      document.getElementById("totalBar").style.width = (100 * done / total) + "%";
    };
    document.getElementById("trk").addEventListener("change", ev => {
      const cb = ev.target.closest("input[data-key]"); if (!cb) return;
      if (cb.checked) checks[cb.dataset.key] = 1; else delete checks[cb.dataset.key];
      cb.closest(".check").classList.toggle("done", cb.checked);
      saveStore(store); update();
    });
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (!confirm(`Clear all ${g.short} checkmarks on this device?`)) return;
      Object.keys(checks).forEach(k => { if (k.startsWith(gid + ".")) delete checks[k]; });
      saveStore(store); viewTracker(gid);
    });
    update();
  }

  function viewGlossary() {
    main.innerHTML = `
      <h1>📖 Glossary</h1>
      <p class="lead">School and curriculum terms in plain language.</p>
      <label class="sr" for="gf">Filter terms</label>
      <input id="gf" class="gloss-filter" type="search" placeholder="Filter terms...">
      <dl class="gloss" id="gl">${D.glossary.slice().sort((a, b) => a.term.localeCompare(b.term)).map(t => `<div data-t="${esc((t.term + " " + t.def).toLowerCase())}"><dt>${esc(t.term)}</dt><dd>${esc(t.def)}</dd></div>`).join("")}</dl>`;
    document.getElementById("gf").addEventListener("input", ev => {
      const q = ev.target.value.trim().toLowerCase();
      document.querySelectorAll("#gl > div").forEach(d => { d.hidden = q && !d.dataset.t.includes(q); });
    });
  }

  // ---------- search ----------
  function buildIndex() {
    const idx = [];
    D.grades.forEach(g => idx.push({ title: g.name, href: `#/grade/${g.id}`, text: [g.summary, ...g.big, ...g.ask].join(" ") }));
    D.subjects.forEach(s => {
      idx.push({ title: `${s.name} (all grades)`, href: `#/subject/${s.id}`, text: [s.intro, ...s.strands, ...s.threads.flatMap(t => Object.values(t.values))].join(" ") });
      D.grades.forEach(g => {
        const e = s.grades[g.id];
        idx.push({ title: `${s.name} -- ${g.name}`, href: `#/grade/${g.id}/${s.id}`, text: [e.focus, ...e.learn, ...e.home].join(" ") });
      });
    });
    D.milestones.forEach(m => idx.push({ title: `Milestone: ${m.title}`, href: "#/milestones", text: m.text }));
    D.glossary.forEach(t => idx.push({ title: `Glossary: ${t.term}`, href: "#/glossary", text: t.def }));
    idx.push({ title: "Report card decoder", href: "#/report", text: "report card letter grade level achievement learning skills E G S N progress report communication of learning " + D.reportCards.skills.map(s => s.name + " " + s.desc).join(" ") });
    return idx;
  }
  let INDEX;
  function viewSearch(q) {
    INDEX = INDEX || buildIndex();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = terms.length ? INDEX.map(r => {
      const hay = (r.title + " " + r.text).toLowerCase();
      const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0) + (r.title.toLowerCase().includes(t) ? 1 : 0), 0);
      return { r, score, all: terms.every(t => hay.includes(t)) };
    }).filter(h => h.all).sort((a, b) => b.score - a.score) : [];
    const hl = s => { let out = esc(s); terms.forEach(t => { out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>"); }); return out; };
    const snippet = text => {
      const lower = text.toLowerCase(); const i = Math.max(0, lower.indexOf(terms[0]) - 60);
      return (i > 0 ? "..." : "") + text.slice(i, i + 180) + (text.length > i + 180 ? "..." : "");
    };
    main.innerHTML = `<h1>Search results</h1><p class="muted">${hits.length} result${hits.length === 1 ? "" : "s"} for "${esc(q)}"</p>
      ${hits.slice(0, 40).map(h => `<div class="card result"><a href="${h.r.href}">${hl(h.r.title)}</a><p class="muted" style="margin:4px 0 0">${hl(snippet(h.r.text))}</p></div>`).join("") || `<p>Try a different word, or browse by <a href="#/grade/jk">grade</a> or <a href="#/subject/lang">subject</a>.</p>`}`;
  }

  function notFound() {
    main.innerHTML = `<h1>Page not found</h1><p><a href="#/">Back to the overview</a></p>`;
  }

  // ---------- router ----------
  function route() {
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/").map(decodeURIComponent);
    const [page, a, b] = parts;
    document.querySelectorAll(".nav a").forEach(l => {
      const href = l.getAttribute("href").replace(/^#\/?/, "").split("/")[0];
      l.classList.toggle("active", (l.dataset.match || href) === (page || ""));
    });
    document.getElementById("nav").classList.remove("open");
    document.querySelector(".menu-btn").setAttribute("aria-expanded", "false");

    switch (page) {
      case undefined: case "": viewHome(); break;
      case "grade": viewGrade(a || "jk", b); break;
      case "subject": viewSubject(a || "lang"); break;
      case "report": viewReport(); break;
      case "milestones": viewMilestones(); break;
      case "tracker": viewTracker(a); break;
      case "glossary": viewGlossary(); break;
      case "search": viewSearch(a || ""); break;
      default: notFound();
    }
    const title = main.querySelector("h1");
    document.title = (title ? title.textContent + " | " : "") + "TDSB Curriculum Guide";
    if (!b) window.scrollTo(0, 0);
  }

  // ---------- chrome ----------
  document.querySelector(".menu-btn").addEventListener("click", ev => {
    const nav = document.getElementById("nav");
    const open = nav.classList.toggle("open");
    ev.currentTarget.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("searchForm").addEventListener("submit", ev => {
    ev.preventDefault();
    const q = document.getElementById("q").value.trim();
    if (q) location.hash = "#/search/" + encodeURIComponent(q);
  });
  document.getElementById("sources").innerHTML = "<strong>Official sources:</strong> " +
    D.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join(" · ");
  document.getElementById("reviewed").textContent = `Content last reviewed ${D.lastReviewed}.`;

  window.addEventListener("hashchange", route);
  route();
})();
