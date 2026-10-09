/* TDSB Curriculum Guide -- single-page app with hash routing. No build step.
 * Data: js/data.js + js/data.fr.js (summaries), js/i18n.js (interface text),
 * js/expectations.<lang>.js and js/schools.js (loaded on demand).
 */
(function () {
  "use strict";

  const DATA = window.CURRICULUM_DATA;
  const I = window.I18N;
  const main = document.getElementById("main");
  const LANG_KEY = "tdsb-guide-lang";
  const STORE_KEY = "tdsb-guide-tracker-v1";
  const COMPARE_KEY = "tdsb-guide-compare";
  const HANDOUT_KEY = "tdsb-guide-handout";
  const MYEQAO_KEY = "tdsb-guide-myeqao";
  const THEME_KEY = "tdsb-guide-theme"; // also read by the inline script in index.html
  const SERIES = ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s4)"];
  const MEASURES = ["g3r", "g3w", "g3m", "g6r", "g6w", "g6m"];
  const ASSET_V = "20261009d"; // bump when data files change so browsers fetch fresh copies

  let lang, D, T, gradeById, subjectById, INDEX = null, INDEX_LANG = null;
  let renderId = 0;

  // ---------- storage ----------
  function getJSON(key, dflt) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? dflt : v; } catch (e) { return dflt; }
  }
  function setJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
  }
  const loadStore = () => getJSON(STORE_KEY, {});
  const saveStore = v => setJSON(STORE_KEY, v);

  // ---------- language ----------
  function initialLang() {
    const qp = new URLSearchParams(location.search).get("lang");
    if (qp && DATA[qp]) return qp;
    const saved = getJSON(LANG_KEY, null);
    if (saved && DATA[saved]) return saved;
    return (navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en";
  }
  function setLang(l) {
    lang = l; D = DATA[l]; T = I[l];
    gradeById = Object.fromEntries(D.grades.map(g => [g.id, g]));
    subjectById = Object.fromEntries(D.subjects.map(s => [s.id, s]));
    INDEX = null;
    setJSON(LANG_KEY, l);
    renderChrome();
  }
  function t(key, vars) {
    let s = T[key] !== undefined ? T[key] : (I.en[key] !== undefined ? I.en[key] : key);
    if (typeof s === "string" && vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
    return s;
  }

  // ---------- helpers ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = (items, cls = "ticks") => items.length ? `<ul class="clean ${cls}">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
  const isK = id => id === "jk" || id === "sk";
  const gradeChips = (active, base = "#/grade/", suffix = "") =>
    `<nav class="grade-chips" aria-label="${esc(t("nav.grades"))}">${D.grades.map(g => `<a href="${base}${g.id}${suffix}" class="${g.id === active ? "active" : ""}">${esc(g.short)}</a>`).join("")}</nav>`;
  const kName = () => (lang === "fr" ? "Maternelle et jardin d'enfants" : "Kindergarten");
  const yearLabel = y => (lang === "fr" ? y.replace("-", "-20") : y);
  const pctTxt = v => (v == null ? "--" : (lang === "fr" ? `${v} %` : `${v}%`));

  const loaded = {};
  function loadScript(src) {
    if (!loaded[src]) {
      loaded[src] = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src; s.onload = resolve;
        s.onerror = () => { delete loaded[src]; s.remove(); reject(new Error("load " + src)); };
        document.head.appendChild(s);
      });
    }
    return loaded[src];
  }
  function loadCss(href) {
    if (!loaded[href]) {
      loaded[href] = new Promise(resolve => {
        const l = document.createElement("link");
        l.rel = "stylesheet"; l.href = href; l.onload = resolve; l.onerror = resolve;
        document.head.appendChild(l);
      });
    }
    return loaded[href];
  }
  const needExp = () => loadScript(`js/expectations.${lang}.js?v=${ASSET_V}`).then(() => window.EXPECTATIONS[lang]);
  const needExplain = () => loadScript(`js/explain.${lang}.js?v=${ASSET_V}`).then(() => window.EXPLAIN[lang]);
  // All-Ontario schools (compact rows), loaded only when a map is switched to the Ontario view.
  const needOntario = () => loadScript(`js/schools-ontario.js?v=${ASSET_V}`).then(() => {
    const O = window.SCHOOLS_ON;
    if (!O._objs) {
      O._objs = O.rows.map(r => ({ id: r[0], name: r[1], board: O.boards[r[2]], slug: O.boardSlugs[r[2]], fr: !!r[3], grades: r[4], lat: r[5], lon: r[6], lowinc: r[7], r: r.slice(8, 14), tdsb: O.boards[r[2]] === O.tdsb }));
      O._byId = Object.fromEntries(O._objs.map(o => [o.id, o]));
    }
    return O;
  });
  let mapScope = "tdsb"; // remembered while the page is open
  const eqaoLink = id => `https://www.eqao.com/results/?orgType=S&mident=${parseInt(id, 10)}&yearnum=20${String(window.SCHOOLS_ON ? window.SCHOOLS_ON.year : "").slice(-2)}`;
  const scopeToggle = () => `<div class="seg" role="group" aria-label="${esc(t("sc.scopeLabel"))}">
      <button type="button" data-scope="tdsb" aria-pressed="${mapScope === "tdsb"}">${esc(t("sc.scopeTdsb"))}</button>
      <button type="button" data-scope="on" aria-pressed="${mapScope === "on"}">${esc(t("sc.scopeOn"))}</button></div>`;
  const needSchools = () => loadScript(`js/schools.js?v=${ASSET_V}`).then(() => window.SCHOOLS);
  const needLeaflet = () => Promise.all([
    loadCss("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"),
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js")
  ]).then(() => window.L);

  // Show a loading state, run an async loader, and drop the result if the user navigated away.
  async function withData(loader, render) {
    const id = ++renderId;
    main.innerHTML = `<p class="muted">${esc(t("loading"))}</p>`;
    try {
      const data = await loader();
      if (id !== renderId) return;
      render(data);
      afterRender();
    } catch (e) {
      if (id === renderId) main.innerHTML = `<p class="note">${esc(t("loadError"))}</p>`;
    }
  }

  // ---------- chrome ----------
  function renderChrome() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    updateThemeBtn();
    const lb = document.getElementById("langBtn");
    lb.innerHTML = `<span class="lg-long">${esc(t("langSwitch"))}</span><span class="lg-short" aria-hidden="true">${lang === "en" ? "FR" : "EN"}</span>`;
    lb.setAttribute("aria-label", t("langSwitchLabel"));
    lb.lang = lang === "en" ? "fr" : "en";
    document.getElementById("sources").innerHTML = `<strong>${esc(t("footer.sources"))}</strong> ` +
      D.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join(" · ");
    document.getElementById("reviewed").textContent = t("footer.reviewed", { d: D.lastReviewed });
  }

  // ---------- light / dark theme ----------
  // No saved choice = follow the device setting. Choosing sets data-theme on <html>, which the CSS honours.
  const darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const currentTheme = () => document.documentElement.getAttribute("data-theme") || (darkQuery && darkQuery.matches ? "dark" : "light");
  function updateThemeBtn() {
    const btn = document.getElementById("themeBtn");
    const dark = currentTheme() === "dark";
    btn.firstElementChild.textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", t(dark ? "theme.toLight" : "theme.toDark"));
    btn.title = t(dark ? "theme.toLight" : "theme.toDark");
  }
  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setJSON(THEME_KEY, next);
    updateThemeBtn();
    if (document.getElementById("map")) route(); // map dot colours are read from CSS when drawn
  }
  if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener("change", updateThemeBtn);

  // ---------- tooltip ----------
  const tip = document.createElement("div");
  tip.className = "tip"; tip.setAttribute("role", "tooltip"); tip.hidden = true;
  document.body.appendChild(tip);
  function showTip(el, x, y) {
    tip.textContent = el.dataset.tip; tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = x + 12, top = y + 12;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 12;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - 12;
    tip.style.left = Math.max(8, left) + "px"; tip.style.top = Math.max(8, top) + "px";
  }
  document.addEventListener("mousemove", e => {
    const el = e.target.closest && e.target.closest("[data-tip]");
    if (el) showTip(el, e.clientX, e.clientY); else tip.hidden = true;
  });
  document.addEventListener("focusin", e => {
    const el = e.target.closest && e.target.closest("[data-tip]");
    if (el) { const r = el.getBoundingClientRect(); showTip(el, r.left, r.bottom); }
  });
  document.addEventListener("focusout", () => { tip.hidden = true; });

  // ---------- click card for chart dots (add to compare / open profile) ----------
  const pop = document.createElement("div");
  pop.className = "pop card"; pop.hidden = true; pop.setAttribute("role", "dialog");
  document.body.appendChild(pop);
  let onCompareChange = null; // set by each schools view to refresh its highlights after a change
  const closePop = () => { pop.hidden = true; };
  function popName(sid) {
    const s = findSchool(sid);
    if (s) return s.name;
    const O = window.SCHOOLS_ON;
    return O && O._byId && O._byId[sid] ? O._byId[sid].name : sid;
  }
  function openPop(el, x, y) {
    const sid = el.dataset.sid, inC = getCompare().includes(sid);
    pop.innerHTML = `<button type="button" class="x pop-x" aria-label="${esc(t("pop.close"))}">×</button>
      <strong>${esc(popName(sid))}</strong>
      ${el.dataset.tip ? `<p class="small muted">${esc(el.dataset.tip)}</p>` : ""}
      <div class="pop-actions"><button type="button" class="btn add sm ${inC ? "on" : ""}" data-pop-toggle="${sid}">${inC ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button>
      <a class="btn ghost sm" href="#/school/${sid}">${esc(t("pop.profile"))}</a></div>`;
    pop.hidden = false; tip.hidden = true;
    const r = pop.getBoundingClientRect();
    let left = x + 10, top = y + 10;
    if (left + r.width > window.innerWidth - 8) left = Math.max(8, x - r.width - 10);
    if (top + r.height > window.innerHeight - 8) top = Math.max(8, y - r.height - 10);
    pop.style.left = left + "px"; pop.style.top = top + "px";
    pop.querySelector("[data-pop-toggle]").focus({ preventScroll: true });
  }
  document.addEventListener("click", ev => {
    const pt = ev.target.closest("[data-pop-toggle]");
    if (pt) { if (toggleCompare(pt.dataset.popToggle)) { closePop(); if (onCompareChange) onCompareChange(); } return; }
    if (ev.target.closest(".pop-x")) { closePop(); return; }
    const dot = ev.target.closest("svg.viz [data-sid], .strip [data-sid]");
    if (dot) { openPop(dot, ev.clientX, ev.clientY); return; }
    if (!ev.target.closest(".pop")) closePop();
  });
  document.addEventListener("keydown", ev => { if (ev.key === "Escape") closePop(); });
  window.addEventListener("scroll", closePop, { passive: true });

  // ======================================================================
  // CURRICULUM VIEWS
  // ======================================================================
  // ---------- "What the research says" ----------
  const researchTopics = () => (window.RESEARCH ? window.RESEARCH.topics : []);
  function researchPanel(key) {
    const items = researchTopics().filter(r => r.on.includes(key));
    if (!items.length) return "";
    return `<aside class="research-box"><div class="rb-head">🔬 ${esc(t("rs.panel"))}</div>
      ${items.map(r => { const c = r[lang] || r.en; return `<a class="rb-item" href="#/research/${r.id}"><strong>${r.icon} ${esc(c.title)}</strong><span>${esc(c.summary)}</span><em>${esc(t("rs.more"))} →</em></a>`; }).join("")}</aside>`;
  }
  function viewResearch(focus) {
    const topics = researchTopics();
    main.innerHTML = `
      <h1>🔬 ${esc(t("rs.h1"))}</h1>
      <p class="lead">${esc(t("rs.lead"))}</p>
      <nav class="rs-toc" aria-label="${esc(t("rs.h1"))}">${topics.map(r => `<a href="#/research/${r.id}">${r.icon} ${esc((r[lang] || r.en).title)}</a>`).join("")}</nav>
      ${topics.map(r => { const c = r[lang] || r.en; return `
        <article class="card rs-topic" id="rs-${r.id}">
          <h2>${r.icon} ${esc(c.title)}</h2>
          <p class="lead">${esc(c.summary)}</p>
          <h3>${esc(t("rs.ontario"))}</h3><p>${esc(c.ontario)}</p>
          <div class="grid grid-2 rs-sides">
            <div class="rs-pro"><h3>${esc(t("rs.pro"))}</h3><p>${esc(c.pro)}</p></div>
            <div class="rs-con"><h3>${esc(t("rs.con"))}</h3><p>${esc(c.con)}</p></div>
          </div>
          <div class="note"><strong>${esc(t("rs.parents"))}</strong> ${esc(c.parents)}</div>
          <details class="tv"><summary>${esc(t("rs.sources"))} (${r.sources.length})</summary>
            <ul class="rs-src">${r.sources.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)} ↗</a></li>`).join("")}</ul></details>
        </article>`; }).join("")}
      <p class="muted small">${esc(t("rs.note", { d: window.RESEARCH ? window.RESEARCH.reviewed : "" }))}</p>`;
    if (focus) {
      const el = document.getElementById("rs-" + focus);
      if (el) requestAnimationFrame(() => { el.scrollIntoView({ block: "start" }); window.scrollBy(0, -80); el.classList.add("focused"); });
    }
  }

  function viewHome() {
    const rows = D.subjects.map(s => `
      <tr>
        <th scope="row"><a href="#/subject/${s.id}"><span class="dot" style="background:${s.color}"></span>${s.icon} ${esc(s.name)}</a></th>
        ${D.grades.map(g => {
          const empty = s.id === "fsl" && !s.grades[g.id].learn.length;
          return `<td class="${empty ? "empty" : ""}"><a href="#/grade/${g.id}/${s.id}">${esc(shortFocus(s, g.id))}</a></td>`;
        }).join("")}
      </tr>`).join("");

    const tools = [["#/report", "📝", "tool.report"], ["#/schools", "🏫", "tool.schools"], ["#/compare/g2/g3", "↔️", "tool.compare"],
      ["#/handout/g3", "💬", "tool.handout"], ["#/official/g3/math", "📘", "tool.official"], ["#/milestones", "🗓️", "tool.milestones"],
      ["#/tracker", "✅", "tool.tracker"], ["#/my-eqao", "🎯", "tool.myeqao"], ["#/subject/math", "📈", "tool.journeys"], ["#/glossary", "📖", "tool.glossary"]];

    main.innerHTML = `
      <section class="hero">
        <span class="pill">${esc(t("home.pill"))}</span>
        <h1>${esc(t("home.h1"))}</h1>
        <p class="lead">${esc(t("home.lead"))}</p>
        ${gradeChips(null)}
      </section>
      <h2>${esc(t("home.glanceH"))}</h2>
      <p class="muted"><span class="d-only">${esc(t("home.glanceSub"))}</span><span class="m-text">${esc(t("home.glanceSubM"))}</span></p>
      <div class="matrix-wrap"><table class="matrix">
        <thead><tr><th>${esc(t("home.subject"))}</th>${D.grades.map(g => `<th><a href="#/grade/${g.id}">${esc(g.short)}</a></th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody></table></div>
      <div class="glance-m">
        <div class="grade-chips" role="group" aria-label="${esc(t("nav.grades"))}">${D.grades.map(g => `<button type="button" data-mg="${g.id}">${esc(g.short)}</button>`).join("")}</div>
        <div id="glanceList" class="glance-list"></div>
      </div>
      <h2>${esc(t("home.toolsH"))}</h2>
      <div class="grid grid-3">${tools.map(([h, i, k]) => toolCard(h, i, t(k)[0], t(k)[1])).join("")}</div>`;

    // Phones: pick a grade, see every subject's focus as a list (the full grid needs a wide screen).
    const showGlance = gid => {
      const g = gradeById[gid];
      main.querySelectorAll("[data-mg]").forEach(b => { b.classList.toggle("active", b.dataset.mg === gid); b.setAttribute("aria-pressed", String(b.dataset.mg === gid)); });
      document.getElementById("glanceList").innerHTML = D.subjects.map(s => `
        <a class="glance-item" href="#/grade/${gid}/${s.id}" style="--c:${s.color}">
          <span class="gi-subj">${s.icon} ${esc(s.name)}</span><span class="gi-focus">${esc(shortFocus(s, gid))}</span></a>`).join("") +
        `<a class="btn ghost glance-all" href="#/grade/${gid}">${esc(t("home.see", { g: g.name }))} →</a>`;
    };
    main.querySelector(".glance-m").addEventListener("click", ev => { const b = ev.target.closest("[data-mg]"); if (b) showGlance(b.dataset.mg); });
    showGlance(loadStore().lastGrade && gradeById[loadStore().lastGrade] ? loadStore().lastGrade : "g1");
  }

  function shortFocus(s, gid) {
    if (s.id === "fsl") {
      const v = s.threads.map(th => th.values[gid]).filter(x => x && x !== "--" && x !== "Immersion")[0];
      return v || (isK(gid) || /^g[1-3]$/.test(gid) ? t("home.immersionOnly") : t("home.coreFrench"));
    }
    const vals = s.threads.map(th => th.values[gid]);
    return isK(gid) ? vals[0] : vals.slice(0, 2).join(" · ");
  }
  const toolCard = (href, icon, title, text) =>
    `<a class="card tool" href="${href}"><h3>${icon} ${esc(title)}</h3><p class="muted">${esc(text)}</p></a>`;

  function officialHref(gid, sid) {
    return isK(gid) ? `#/official/${gid}/k` : `#/official/${gid}/${sid}`;
  }

  function viewGrade(gid, focusSubject) {
    const g = gradeById[gid];
    if (!g) return notFound();
    const idx = D.grades.indexOf(g);
    const prev = D.grades[idx - 1], next = D.grades[idx + 1];
    const ms = D.milestones.filter(m => m.grade === gid);

    const frames = isK(gid) ? `
      <h2>${esc(t("grade.kStrandsH"))}</h2>
      <p class="muted">${esc(t("grade.kStrandsP"))}</p>
      <div class="grid grid-4 frames">${D.kindergartenFrames.map(f => `
        <div class="card"><h3>${f.icon} ${esc(f.name)}</h3><p>${esc(f.desc)}</p>${list(f.examples)}</div>`).join("")}</div>
      <p><a class="btn ghost" href="#/official/${gid}/k">📘 ${esc(t("grade.kOfficial"))}</a></p>
      <h2>${esc(t("grade.kHow", { g: g.short }))}</h2>` : `<h2>${esc(t("grade.bySubject"))}</h2>`;

    const cards = D.subjects.map(s => {
      const e = s.grades[gid];
      const showOfficial = !(s.id === "fsl" && isK(gid));
      return `
        <article class="card subj" id="s-${s.id}" style="--c:${s.color}">
          <h3>${s.icon} ${esc(s.name)}</h3>
          <p class="focus">${esc(e.focus)}</p>
          ${e.learn.length ? `<strong>${esc(t("grade.workOn"))}</strong>${list(e.learn)}` : ""}
          ${e.home.length ? `<strong>${esc(t("grade.helpHome"))}</strong>${list(e.home, "homes")}` : ""}
          <p class="card-links">
            ${showOfficial ? `<a href="${officialHref(gid, s.id)}">📘 ${esc(t("grade.official"))}</a>` : ""}
            <a href="#/subject/${s.id}">${esc(t("grade.journey", { s: s.name }))} →</a></p>
        </article>`;
    }).join("");

    main.innerHTML = `
      ${gradeChips(gid)}
      <span class="pill">${esc(g.age)}</span>
      <h1>${esc(g.name)}</h1>
      <p class="lead">${esc(g.summary)}</p>
      <div class="page-actions">
        <button class="btn ghost" data-print>🖨️ ${esc(t("grade.print"))}</button>
        <a class="btn ghost" href="#/handout/${gid}">💬 ${esc(t("grade.handout"))}</a>
        <a class="btn ghost" href="#/tracker/${gid}">✅ ${esc(t("grade.tracker", { g: g.short }))}</a>
        ${next ? `<a class="btn ghost" href="#/compare/${gid}/${next.id}">↔️ ${esc(t("grade.compare"))}</a>` : ""}
      </div>
      <div class="grid grid-2">
        <div class="card"><h3>${esc(t("grade.big"))}</h3>${list(g.big)}</div>
        <div class="card"><h3>💬 ${esc(t("grade.ask"))}</h3>${list(g.ask, "")}</div>
      </div>
      ${ms.length ? `<div class="note"><strong>${esc(t("grade.milestones"))}</strong> ${ms.map(m => esc(m.title)).join(" · ")} · <a href="#/milestones">${esc(t("grade.details"))}</a></div>` : ""}
      ${researchPanel("grade:" + gid)}
      ${frames}
      <div class="grid grid-2">${cards}</div>
      <div class="page-actions spread">
        ${prev ? `<a class="btn ghost" href="#/grade/${prev.id}">← ${esc(prev.name)}</a>` : "<span></span>"}
        ${next ? `<a class="btn ghost" href="#/grade/${next.id}">${esc(next.name)} →</a>` : ""}
      </div>`;

    if (focusSubject) {
      const el = document.getElementById("s-" + focusSubject);
      if (el && subjectById[focusSubject]) {
        requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
        el.classList.add("focused");
      }
    }
  }

  function viewSubject(sid) {
    const s = subjectById[sid];
    if (!s) return notFound();
    main.innerHTML = `
      <nav class="subject-tabs" aria-label="${esc(t("nav.subjects"))}">${D.subjects.map(x => `<a href="#/subject/${x.id}" style="--c:${x.color}" class="${x.id === sid ? "active" : ""}">${x.icon} ${esc(x.name)}</a>`).join("")}</nav>
      <h1>${s.icon} ${esc(t("subject.h1", { s: s.name }))}</h1>
      <p class="lead">${esc(s.intro)}</p>
      <div class="grid grid-2">
        <div class="card"><h3>${esc(t("subject.strands"))}</h3>${list(s.strands, "")}</div>
        <div class="card"><h3>${esc(t("subject.doc"))}</h3><p>${esc(s.doc)}</p><p><a href="${s.url}" target="_blank" rel="noopener">${esc(t("subject.read"))} ↗</a></p></div>
      </div>
      ${researchPanel("subject:" + sid)}
      <h2>${esc(t("subject.builds"))}</h2>
      <div class="thread-wrap"><table class="thread">
        <thead><tr><th></th>${D.grades.map(g => `<th><a href="#/grade/${g.id}/${s.id}">${esc(g.short)}</a></th>`).join("")}</tr></thead>
        <tbody>${s.threads.map(th => `<tr><th scope="row">${esc(th.name)}</th>${D.grades.map(g => `<td>${esc(th.values[g.id] || "")}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>
      <div class="thread-m">${s.threads.map(th => `<div class="card thread-card" style="--c:${s.color}"><h3>${esc(th.name)}</h3>
        <dl>${D.grades.map(g => `<div><dt><a href="#/grade/${g.id}/${s.id}">${esc(g.short)}</a></dt><dd>${esc(th.values[g.id] || "")}</dd></div>`).join("")}</dl></div>`).join("")}</div>
      <h2>${esc(t("subject.gbg"))}</h2>
      <p class="muted">${esc(t("subject.scroll"))}</p>
      <div class="journey" style="--c:${s.color}">
        ${D.grades.map(g => {
          const e = s.grades[g.id];
          const off = !(s.id === "fsl" && isK(g.id));
          return `<div class="card"><div class="step">${esc(g.name)}</div><p>${esc(e.focus)}</p>${list(e.learn)}
            <p class="card-links"><a href="#/grade/${g.id}/${s.id}">${esc(t("subject.openIn", { g: g.short }))} →</a>
            ${off ? `<a href="${officialHref(g.id, s.id)}">📘 ${esc(t("grade.official"))}</a>` : ""}</p></div>`;
        }).join("")}
      </div>`;
  }

  // ---------- official expectations ----------
  function viewOfficial(gid, sid, prog) {
    const g = gradeById[gid];
    if (!g) return notFound();
    const k = isK(gid);
    if (k) sid = "k";
    const s = k ? null : subjectById[sid];
    if (!k && !s) return notFound();
    if (sid === "fsl" && k) return notFound();

    withData(needExp, E => {
      let key = sid, notice = "";
      if (sid === "fsl") {
        if (!E.subjects.fsl[gid]) { key = "fsli"; notice = t("official.noFrench"); }
        else key = prog === "immersion" ? "fsli" : "fsl";
      }
      const doc = E.subjects[key][k ? "k" : gid];
      if (!doc) return notFound();
      const name = k ? kName() : s.name;
      const langNote = lang === "fr" ? (doc.sourceLang === "en" ? t("official.enNote") : t("official.frNote")) : "";
      const progTabs = sid === "fsl" && E.subjects.fsl[gid] ? `<div class="subject-tabs">
          <a href="#/official/${gid}/fsl" class="${key === "fsl" ? "active" : ""}" style="--c:${s.color}">${esc(t("official.core"))}</a>
          <a href="#/official/${gid}/fsl/immersion" class="${key === "fsli" ? "active" : ""}" style="--c:${s.color}">${esc(t("official.immersion"))}</a></div>` : "";
      const chipsSuffix = k ? "/k" : `/${sid}`;
      const color = k ? "var(--accent)" : s.color;

      main.innerHTML = `
        ${gradeChips(gid, "#/official/", chipsSuffix)}
        <h1>${k ? "📘" : s.icon} ${esc(k ? t("official.h1k", { s: name }) : t("official.h1", { s: name, g: g.name }))}</h1>
        <p class="lead">${esc(t("official.lead"))}</p>
        <p><a href="${k ? `#/grade/${gid}` : `#/grade/${gid}/${sid}`}">← ${esc(t("official.summaryLink"))}</a></p>
        ${notice ? `<div class="note">${esc(notice)}</div>` : ""}
        ${langNote ? `<div class="note">${esc(langNote)}</div>` : ""}
        ${progTabs}
        <div class="official-tools">
          <label class="sr" for="of">${esc(t("official.filter"))}</label>
          <input id="of" type="search" class="gloss-filter" placeholder="${esc(t("official.filter"))}">
          <button class="btn ghost" id="exAll">${esc(t("official.expandAll"))}</button>
          <button class="btn ghost" id="coAll">${esc(t("official.collapseAll"))}</button>
          <span class="muted small" id="ofCount" aria-live="polite"></span>
        </div>
        <div class="official" style="--c:${color}" ${doc.sourceLang !== lang ? `lang="${doc.sourceLang}"` : ""}>
          ${doc.strands.map(st => `
            <section class="strand">
              <h2>${esc(st.code)}. ${esc(st.title.trim())}</h2>
              ${st.why ? `<div class="why"><strong>${esc(t("official.why"))}</strong><p>${esc(st.why)}</p></div>` : ""}
              ${st.overall.map(o => `
                <details class="oe">
                  <summary><span class="code">${esc(o.code)}</span> <span><strong>${esc((o.title || "").trim())}</strong>${o.title ? " -- " : ""}${esc(o.text)}
                    <span class="pill">${esc(o.specific.length ? t("official.specific", { n: o.specific.length }) : "")}</span></span></summary>
                  ${o.specific.length ? `<ol class="se">${o.specific.map(sp => `<li><span class="code">${esc(sp.code)}</span> <span>${sp.title ? `<strong>${esc(sp.title.trim())}:</strong> ` : ""}${esc(sp.text)}</span></li>`).join("")}</ol>`
                    : `<p class="muted small">${esc(t("official.noSpecific"))}</p>`}
                </details>`).join("")}
            </section>`).join("")}
        </div>
        <p class="muted small">${t("official.source", { link: `<a href="${doc.url}" target="_blank" rel="noopener">${esc(t("official.sourceLink"))} ↗</a>` })}</p>`;

      const all = () => main.querySelectorAll("details.oe");
      document.getElementById("exAll").onclick = () => all().forEach(d => { d.open = true; });
      document.getElementById("coAll").onclick = () => all().forEach(d => { d.open = false; });
      document.getElementById("of").addEventListener("input", ev => {
        const q = ev.target.value.trim().toLowerCase();
        let n = 0;
        all().forEach(d => {
          const sum = d.querySelector("summary").textContent.toLowerCase();
          let hit = !q || sum.includes(q);
          d.querySelectorAll("li").forEach(li => {
            const m = !q || li.textContent.toLowerCase().includes(q);
            li.hidden = !m && !(!q);
            if (q && m) { hit = true; n++; }
          });
          if (q && sum.includes(q)) { n++; d.querySelectorAll("li").forEach(li => { li.hidden = false; }); }
          d.hidden = !hit;
          d.open = !!q && hit;
        });
        main.querySelectorAll("section.strand").forEach(sec => { sec.hidden = !!q && !sec.querySelector("details.oe:not([hidden])"); });
        document.getElementById("ofCount").textContent = q ? t("official.matches", { n }) : "";
      });
    });
  }

  // ---------- compare grades ----------
  function viewCompare(a, b, sid) {
    a = gradeById[a] ? a : "g2"; b = gradeById[b] ? b : "g3";
    const ga = gradeById[a], gb = gradeById[b];
    const subs = sid && subjectById[sid] ? [subjectById[sid]] : D.subjects;
    const opt = sel => D.grades.map(g => `<option value="${g.id}" ${g.id === sel ? "selected" : ""}>${esc(g.name)}</option>`).join("");
    const col = (g, s) => {
      const e = s.grades[g.id];
      return `<div class="cmp-col"><div class="step">${esc(g.name)}</div><p class="focus">${esc(e.focus)}</p>${list(e.learn)}</div>`;
    };
    main.innerHTML = `
      <h1>↔️ ${esc(t("compare.h1"))}</h1>
      <p class="lead">${esc(t("compare.lead"))}</p>
      <div class="card controls">
        <label>${esc(t("compare.a"))}<select id="ca">${opt(a)}</select></label>
        <button class="btn ghost" id="swap" aria-label="${esc(t("compare.swap"))}">⇄</button>
        <label>${esc(t("compare.b"))}<select id="cb">${opt(b)}</select></label>
        <label>${esc(t("compare.subject"))}<select id="cs"><option value="">${esc(t("compare.all"))}</option>
          ${D.subjects.map(s => `<option value="${s.id}" ${s.id === sid ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></label>
      </div>
      ${subs.map(s => {
        const changes = s.threads.filter(th => th.values[a] !== th.values[b]).map(th =>
          `<li><strong>${esc(th.name)}:</strong> ${esc(th.values[a])} <span aria-hidden="true">→</span><span class="sr">,</span> ${esc(th.values[b])}</li>`).join("");
        return `<article class="card subj cmp" style="--c:${s.color}">
          <h2>${s.icon} ${esc(s.name)}</h2>
          ${changes ? `<div class="changes"><strong>${esc(t("compare.changes"))}</strong><ul class="clean">${changes}</ul></div>` : ""}
          <div class="cmp-grid">${col(ga, s)}${col(gb, s)}</div>
        </article>`;
      }).join("")}`;
    const go = () => { location.hash = `#/compare/${$("#ca").value}/${$("#cb").value}${$("#cs").value ? "/" + $("#cs").value : ""}`; };
    ["ca", "cb", "cs"].forEach(id => document.getElementById(id).addEventListener("change", go));
    document.getElementById("swap").onclick = () => { const x = $("#ca").value; $("#ca").value = $("#cb").value; $("#cb").value = x; go(); };
  }
  const $ = sel => document.querySelector(sel);

  // ---------- printable interview handout ----------
  function viewHandout(gid) {
    const g = gradeById[gid];
    if (!g) return notFound();
    const all = getJSON(HANDOUT_KEY, {});
    const st = Object.assign({ child: "", teacher: "", date: "", off: [], mine: ["", "", ""], notes: "" }, all[gid] || {});
    const save = () => { all[gid] = st; setJSON(HANDOUT_KEY, all); };

    main.innerHTML = `
      ${gradeChips(gid, "#/handout/")}
      <div class="page-actions">
        <button class="btn" data-print>🖨️ ${esc(t("handout.printBtn"))}</button>
        <button class="btn ghost" id="hoClear">${esc(t("handout.clear"))}</button>
      </div>
      <p class="muted no-print">${esc(t("handout.lead"))}</p>
      <article class="handout card">
        <header class="ho-head">
          <h1>${esc(t("handout.h1", { g: g.name }))}</h1>
          <div class="ho-fields">
            <label>${esc(t("handout.child"))}<input data-f="child" value="${esc(st.child)}"></label>
            <label>${esc(t("handout.teacher"))}<input data-f="teacher" value="${esc(st.teacher)}"></label>
            <label>${esc(t("handout.date"))}<input data-f="date" type="date" value="${esc(st.date)}"></label>
          </div>
        </header>
        <div class="ho-cols">
          <section><h2>${esc(t("handout.glance"))}</h2>${list(g.big)}
            <h2>${esc(t("handout.focus"))}</h2>
            <table class="ho-focus">${D.subjects.map(s => `<tr><th>${s.icon} ${esc(s.name)}</th><td>${esc(s.grades[gid].focus)}</td></tr>`).join("")}</table>
          </section>
          <section><h2>${esc(t("handout.questions"))}</h2>
            <ul class="clean ho-q">${g.ask.map((q, i) => `<li class="${st.off.includes(i) ? "off" : ""}"><label><input type="checkbox" data-q="${i}" ${st.off.includes(i) ? "" : "checked"}> <span>${esc(q)}</span></label></li>`).join("")}</ul>
            <h2>${esc(t("handout.mine"))}</h2>
            <ul class="clean ho-mine">${st.mine.map((q, i) => `<li class="${q ? "" : "empty"}"><input data-m="${i}" value="${esc(q)}" placeholder="${esc(t("handout.minePh"))}"></li>`).join("")}</ul>
            <h2>${esc(t("handout.notes"))}</h2>
            <textarea data-f="notes" rows="6" class="ho-notes">${esc(st.notes)}</textarea>
          </section>
        </div>
        <footer class="ho-foot"><strong>${esc(t("handout.key"))}:</strong> ${esc(t("handout.keyText"))}
          <div class="muted">${esc(t("handout.footer"))} · ${esc(location.origin + location.pathname)}</div></footer>
      </article>`;

    const ho = main.querySelector(".handout");
    ho.addEventListener("input", ev => {
      const el = ev.target;
      if (el.dataset.f) st[el.dataset.f] = el.value;
      if (el.dataset.m !== undefined) { st.mine[+el.dataset.m] = el.value; el.closest("li").classList.toggle("empty", !el.value); }
      save();
    });
    ho.addEventListener("change", ev => {
      const el = ev.target;
      if (el.dataset.q === undefined) return;
      const i = +el.dataset.q;
      st.off = el.checked ? st.off.filter(x => x !== i) : st.off.concat(i);
      el.closest("li").classList.toggle("off", !el.checked);
      save();
    });
    document.getElementById("hoClear").onclick = () => { delete all[gid]; setJSON(HANDOUT_KEY, all); viewHandout(gid); };
  }

  // ---------- report card, milestones, tracker, glossary ----------
  function viewReport() {
    const R = D.reportCards;
    main.innerHTML = `
      <h1>📝 ${esc(t("report.h1"))}</h1>
      <p class="lead">${t("report.lead_html")}</p>
      <h2>${esc(t("report.decodeH"))}</h2>
      <div class="card">
        <p class="mt0">${esc(t("report.decodeP"))}</p>
        <div class="letter-picker" id="letters">${R.levels.flatMap(l => l.letters).map(x => `<button type="button" data-l="${x}">${x}</button>`).join("")}</div>
        <div class="decode-out" id="decodeOut" aria-live="polite"><p class="muted">${esc(t("report.hint"))}</p></div>
      </div>
      <h2>${esc(t("report.levelsH"))}</h2>
      <div class="levels">${R.levels.map(l => `
        <div class="level-row" data-level="${l.level}"><div class="badge ${l.tone}">${l.level}</div>
        <div><strong>${l.letters.join(", ")}</strong> <span class="muted">(${l.pct})</span><br>${esc(l.meaning)}</div></div>`).join("")}</div>
      <h2>${esc(t("report.whenH"))}</h2>
      <div class="tl">
        <div class="tl-row head"><div></div><div>${esc(t("report.colK"))}</div><div>${esc(t("report.colE"))}</div></div>
        ${R.timeline.map(x => `<div class="tl-row"><div><strong>${esc(x.when)}</strong></div><div>${esc(x.k)}</div><div>${esc(x.e)}</div></div>`).join("")}
      </div>
      <div class="note">${esc(t("report.kNote"))}</div>
      <h2>${esc(t("report.skillsH"))}</h2>
      <p>${esc(t("report.skillsP"))} ${R.skillRatings.map(r => `<strong>${r.code}</strong> = ${esc(r.name)}`).join(", ")}.</p>
      <div class="grid grid-3">${R.skills.map(s => `<div class="card"><h3>${esc(s.name)}</h3><p class="muted mb0">${esc(s.desc)}</p></div>`).join("")}</div>
      <h2>${esc(t("report.boxesH"))}</h2>
      <div class="grid grid-2">${R.boxes.map(b => `<div class="card"><h3>${esc(b.name)}</h3><p class="muted mb0">${esc(b.desc)}</p></div>`).join("")}</div>`;

    document.getElementById("letters").addEventListener("click", ev => {
      const b = ev.target.closest("button"); if (!b) return;
      document.querySelectorAll("#letters button").forEach(x => x.classList.toggle("sel", x === b));
      const lv = R.levels.find(l => l.letters.includes(b.dataset.l));
      document.querySelectorAll(".level-row").forEach(r => r.classList.toggle("sel", r.dataset.level === lv.level));
      document.getElementById("decodeOut").innerHTML = `<p class="mt0"><span class="badge inline ${lv.tone}">${esc(t("report.level"))} ${lv.level}</span> <strong>${esc(b.dataset.l)}</strong> · ${lv.pct}</p>
        <p>${esc(lv.meaning)}</p><p class="muted mb0"><strong>${esc(t("report.todo"))}</strong> ${esc(t("report.advice")[lv.level])}</p>`;
    });
  }

  function viewMilestones() {
    const groups = [{ id: "before", name: t("ms.before") }].concat(D.grades.map(g => ({ id: g.id, name: g.name })));
    main.innerHTML = `
      <h1>🗓️ ${esc(t("ms.h1"))}</h1>
      <p class="lead">${esc(t("ms.lead"))}</p>
      <div class="timeline">${groups.map(gr => {
        const items = D.milestones.filter(m => m.grade === gr.id);
        if (!items.length) return "";
        return `<section class="tl-group"><h3>${gr.id !== "before" ? `<a href="#/grade/${gr.id}">${esc(gr.name)}</a>` : esc(gr.name)}</h3>
          ${items.map(m => `<div class="card ms"><span class="pill">${esc(m.tag)}</span><h3 class="mt6">${esc(m.title)}</h3><p class="mb0">${esc(m.text)}</p></div>`).join("")}</section>`;
      }).join("")}</div>`;
  }

  function viewTracker(gid) {
    withData(needExplain, X => renderTracker(gid, X));
  }
  function renderTracker(gid, X) {
    const store = loadStore();
    if (!gid) {
      gid = store.lastGrade || "g1";
    }
    const g = gradeById[gid];
    if (!g) return notFound();
    store.lastGrade = gid; saveStore(store);
    const checks = (store.checks = store.checks || {});
    const subs = D.subjects.filter(s => s.grades[gid].learn.length);
    const total = subs.reduce((n, s) => n + s.grades[gid].learn.length, 0);

    main.innerHTML = `
      ${gradeChips(gid, "#/tracker/")}
      <h1>✅ ${esc(t("tr.h1", { g: g.name }))}</h1>
      <p class="lead">${esc(t("tr.lead"))}</p>
      <div class="card tracker-head">
        <div class="grow"><strong id="totalTxt"></strong><div class="progress mt6"><span id="totalBar"></span></div></div>
        <div class="page-actions m0">
          <button class="btn ghost" data-print>🖨️ ${esc(t("print"))}</button>
          <button class="btn ghost" id="resetBtn">${esc(t("tr.reset", { g: g.short }))}</button>
        </div>
      </div>
      <p class="muted small">${esc(t("tr.saved"))} ${esc(t("tr.hint"))}</p>
      <div class="grid grid-2" id="trk">
        ${subs.map(s => `
          <div class="card subj" style="--c:${s.color}">
            <h3>${s.icon} ${esc(s.name)}</h3>
            <div class="progress" style="--c:${s.color}"><span data-bar="${s.id}"></span></div>
            ${s.grades[gid].learn.map((item, i) => {
              const key = `${gid}.${s.id}.${i}`; // keyed by position so ticks survive a language switch
              const ex = (X[`${gid}.${s.id}`] || [])[i];
              const exId = `ex-${s.id}-${i}`;
              return `<div class="check-row">
                <label class="check ${checks[key] ? "done" : ""}"><input type="checkbox" data-key="${key}" ${checks[key] ? "checked" : ""}><span>${esc(item)}</span></label>
                ${ex ? `<button type="button" class="info" aria-expanded="false" aria-controls="${exId}" aria-label="${esc(t("tr.explain"))}: ${esc(item)}">i</button>
                <div class="explain" id="${exId}" role="note"><strong>${esc(t("tr.means"))}</strong><p>${esc(ex[0])}</p><strong>${esc(t("tr.see"))}</strong><p>${esc(ex[1])}</p></div>` : ""}
              </div>`;
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
      document.getElementById("totalTxt").textContent = t("tr.checked", { d: done, t: total });
      document.getElementById("totalBar").style.width = (100 * done / total) + "%";
    };
    document.getElementById("trk").addEventListener("change", ev => {
      const cb = ev.target.closest("input[data-key]"); if (!cb) return;
      if (cb.checked) checks[cb.dataset.key] = 1; else delete checks[cb.dataset.key];
      cb.closest(".check").classList.toggle("done", cb.checked);
      saveStore(store); update();
    });
    // Tap/click the info button to pin an explanation open (hover and keyboard focus also show it).
    const closeAll = except => main.querySelectorAll(".check-row.open").forEach(r => {
      if (r !== except) { r.classList.remove("open"); r.querySelector(".info").setAttribute("aria-expanded", "false"); }
    });
    document.getElementById("trk").addEventListener("click", ev => {
      const btn = ev.target.closest(".info");
      if (!btn) return;
      const row = btn.closest(".check-row");
      closeAll(row);
      const open = row.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    document.getElementById("trk").addEventListener("keydown", ev => { if (ev.key === "Escape") closeAll(null); });
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (!confirm(t("tr.confirm", { g: g.short }))) return;
      Object.keys(checks).forEach(k => { if (k.startsWith(gid + ".")) delete checks[k]; });
      saveStore(store); renderTracker(gid, X);
    });
    update();
  }

  function viewGlossary() {
    const loc = lang === "fr" ? "fr" : "en";
    main.innerHTML = `
      <h1>📖 ${esc(t("gl.h1"))}</h1>
      <p class="lead">${esc(t("gl.lead"))}</p>
      <label class="sr" for="gf">${esc(t("gl.filter"))}</label>
      <input id="gf" class="gloss-filter" type="search" placeholder="${esc(t("gl.filter"))}">
      <dl class="gloss" id="gl">${D.glossary.slice().sort((a, b) => a.term.localeCompare(b.term, loc)).map(x => `<div data-t="${esc((x.term + " " + x.def).toLowerCase())}"><dt>${esc(x.term)}</dt><dd>${esc(x.def)}</dd></div>`).join("")}</dl>`;
    document.getElementById("gf").addEventListener("input", ev => {
      const q = ev.target.value.trim().toLowerCase();
      document.querySelectorAll("#gl > div").forEach(d => { d.hidden = !!q && !d.dataset.t.includes(q); });
    });
  }

  // ---------- search ----------
  function buildIndex(E, S) {
    const idx = [];
    D.grades.forEach(g => idx.push({ title: g.name, href: `#/grade/${g.id}`, text: [g.summary, ...g.big, ...g.ask].join(" ") }));
    D.subjects.forEach(s => {
      idx.push({ title: s.name, href: `#/subject/${s.id}`, text: [s.intro, ...s.strands, ...s.threads.flatMap(th => Object.values(th.values))].join(" ") });
      D.grades.forEach(g => {
        const e = s.grades[g.id];
        idx.push({ title: `${s.name} -- ${g.name}`, href: `#/grade/${g.id}/${s.id}`, text: [e.focus, ...e.learn, ...e.home].join(" ") });
      });
    });
    D.milestones.forEach(m => idx.push({ title: m.title, href: "#/milestones", text: m.text }));
    D.glossary.forEach(x => idx.push({ title: `${t("gl.h1")}: ${x.term}`, href: "#/glossary", text: x.def }));
    researchTopics().forEach(r => { const c = r[lang] || r.en; idx.push({ title: `${t("rs.h1")}: ${c.title}`, href: `#/research/${r.id}`, text: [c.summary, c.ontario, c.pro, c.con, c.parents].join(" ") }); });
    idx.push({ title: t("report.h1"), href: "#/report", text: "report card bulletin letter grade level E G S N " + D.reportCards.skills.map(s => s.name + " " + s.desc).join(" ") });
    if (E) {
      Object.entries(E.subjects).forEach(([sid, grades]) => Object.entries(grades).forEach(([gid, doc]) => {
        const sub = sid === "k" ? kName() : (subjectById[sid === "fsli" ? "fsl" : sid] || {}).name;
        doc.strands.forEach(st => st.overall.forEach(o => {
          const gname = gid === "k" ? "" : ` -- ${gradeById[gid].name}`;
          const href = gid === "k" ? "#/official/jk/k" : `#/official/${gid}/${sid === "fsli" ? "fsl/immersion" : sid}`;
          idx.push({ title: `${t("se.official")}: ${sub}${gname}, ${o.code} ${o.title || ""}`, href,
            text: [o.text, ...o.specific.map(sp => `${sp.code} ${sp.title} ${sp.text}`)].join(" ") });
        }));
      }));
    }
    if (S) S.schools.forEach(s => idx.push({ title: `${t("se.school")}: ${s.name}`, href: `#/school/${s.id}`, text: `${s.addr} ${s.city} ${s.postal} ${s.grades}` }));
    return idx;
  }

  function viewSearch(q) {
    withData(() => Promise.all([needExp().catch(() => null), needSchools().catch(() => null)]), ([E, S]) => {
      if (!INDEX || INDEX_LANG !== lang) { INDEX = buildIndex(E, S); INDEX_LANG = lang; }
      const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const terms = norm(q).split(/\s+/).filter(Boolean);
      const hits = terms.length ? INDEX.map(r => {
        const hay = norm(r.title + " " + r.text), tl = norm(r.title);
        const score = terms.reduce((n, x) => n + (hay.includes(x) ? 1 : 0) + (tl.includes(x) ? 2 : 0), 0) - (r.title.startsWith(t("se.official")) ? 1 : 0);
        return { r, score, all: terms.every(x => hay.includes(x)) };
      }).filter(h => h.all).sort((a, b) => b.score - a.score) : [];
      const hl = s => {
        let out = esc(s);
        terms.forEach(x => { if (x.length > 1) out = out.replace(new RegExp(`(${x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>"); });
        return out;
      };
      const snippet = text => {
        const i = Math.max(0, norm(text).indexOf(terms[0]) - 60);
        return (i > 0 ? "..." : "") + text.slice(i, i + 200) + (text.length > i + 200 ? "..." : "");
      };
      main.innerHTML = `<h1>${esc(t("se.h1"))}</h1><p class="muted">${esc(t("se.count", { n: hits.length, q }))}</p>
        ${hits.slice(0, 50).map(h => `<div class="card result"><a href="${h.r.href}">${hl(h.r.title)}</a><p class="muted mb0">${hl(snippet(h.r.text))}</p></div>`).join("") || `<p>${t("se.none_html")}</p>`}`;
    });
  }

  // ======================================================================
  // SCHOOLS & EQAO
  // ======================================================================
  const latestYear = S => S.years[S.years.length - 1];
  // School registry: TDSB schools come with schools.js; any other Ontario school is loaded from its board's file on demand.
  const schoolCache = {};
  function registerTDSB(S) {
    if (!S._reg) { S.schools.forEach(s => { s.board = s.board || "Toronto DSB"; s.tdsb = true; schoolCache[s.id] = s; }); S._reg = true; }
  }
  const needBoard = slug => loadScript(`js/boards/${slug}.js?v=${ASSET_V}`).then(() => {
    const B = window.BOARD_DATA[slug];
    if (!B._reg) { B.schools.forEach(s => { s.boardRef = B.ref; s.tdsb = false; schoolCache[s.id] = s; }); B._reg = true; }
    return B;
  });
  async function ensureSchools(S, ids) {
    registerTDSB(S);
    const missing = ids.filter(id => id && !schoolCache[id]);
    if (!missing.length) return;
    const O = await needOntario();
    const slugs = new Set(missing.map(id => O._byId[id]).filter(o => o && !o.tdsb).map(o => o.slug));
    await Promise.all([...slugs].map(needBoard));
  }
  const findSchool = id => schoolCache[id];
  // Load TDSB data plus whatever boards the given (or compared) schools belong to.
  const needTracking = () => loadScript(`js/tracking.js?v=${ASSET_V}`).then(() => window.TRACKING, () => null);
  const needSchoolsFor = ids => () => needSchools().then(S => Promise.all([ensureSchools(S, (ids || []).concat(getCompare())), needTracking()]).then(() => S));
  const schoolById = S => { registerTDSB(S); return schoolCache; };
  const getCompare = () => getJSON(COMPARE_KEY, []).slice(0, 4);
  const setCompare = ids => setJSON(COMPARE_KEY, ids.slice(0, 4));
  function toggleCompare(id) {
    const ids = getCompare();
    if (ids.includes(id)) setCompare(ids.filter(x => x !== id));
    else if (ids.length >= 4) { alert(t("sc.max")); return false; }
    else setCompare(ids.concat(id));
    return true;
  }
  function median(vals) {
    const v = vals.filter(x => x != null).sort((a, b) => a - b);
    if (!v.length) return null;
    const m = Math.floor(v.length / 2);
    return v.length % 2 ? v[m] : Math.round((v[m - 1] + v[m]) / 2);
  }
  function ctxMedians(S) {
    if (!S._ctx) {
      S._ctx = {};
      Object.keys(S.schools[0].ctx).forEach(k => { S._ctx[k] = median(S.schools.map(s => s.ctx[k])); });
    }
    return S._ctx;
  }
  function reasonText(s, year, i) {
    const w = s.why && s.why[year] && s.why[year][i];
    return w === "nr" ? t("sc.nr") : w === "na" ? t("sc.na") : t("sc.noData");
  }
  function distKm(a, b, c, d) {
    const R = 6371, toR = x => x * Math.PI / 180;
    const h = Math.sin(toR(c - a) / 2) ** 2 + Math.cos(toR(a)) * Math.cos(toR(c)) * Math.sin(toR(d - b) / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  const addBtn = id => { const on = getCompare().includes(id); return `<button type="button" class="btn add sm ${on ? "on" : ""}" data-toggle="${id}">${on ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button>`; };
  // Map dots: the same size for every school; touch screens get bigger dots and a wider tap area around each.
  const isTouch = () => window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 700px)").matches;
  const mapDot = () => (isTouch() ? 7 : 6);
  const mapTapTolerance = () => (isTouch() ? 12 : 3);
  const isPhone = () => window.matchMedia("(max-width: 700px)").matches;
  const caveat = S => {
    const body = t("sc.caveat_html", { y: yearLabel(latestYear(S)) }).replace(/^<strong>[^<]*<\/strong>\s*/, "");
    return `<details class="note caveat" ${isPhone() ? "" : "open"}><summary>${esc(t("sc.caveatTitle"))}</summary><p>${body}</p></details>`;
  };

  function compareTray(S) {
    const ids = getCompare(), by = schoolById(S);
    const O = window.SCHOOLS_ON && window.SCHOOLS_ON._byId;
    const nameOf = id => (by[id] ? by[id].name : O && O[id] ? O[id].name : null);
    return `<div class="tray card" id="tray">
      <strong>${esc(t("sc.tray", { n: ids.length }))}</strong>
      ${ids.map((id, i) => nameOf(id) ? `<span class="tray-chip"><span class="sw" style="background:${SERIES[i]}"></span><a href="#/school/${id}">${esc(nameOf(id))}</a>
        <button class="x" data-toggle="${id}" aria-label="${esc(t("sc.remove"))}: ${esc(nameOf(id))}">×</button></span>` : "").join("")}
      <span class="grow"></span>
      ${ids.length ? `<a class="btn" href="#/compare-schools/${ids.join(",")}">${esc(t("sc.compareBtn"))}</a><button class="btn ghost" data-clear>${esc(t("sc.clear"))}</button>` : ""}
    </div>`;
  }

  // Grouped horizontal bars (HTML/CSS so text stays readable at any width).
  function barsChart(S, series, year) {
    const ref = S.reference[year];
    const legend = chartLegend(series);
    const rows = MEASURES.map((m, i) => `
      <div class="hb-row">
        <div class="hb-label">${esc(t("m." + m))}</div>
        <div class="hb-track" style="--n:${series.length}">
          ${series.map(s => {
            const v = s.school.res[year] ? s.school.res[year][i] : null;
            return v == null
              ? `<div class="hb-none" data-tip="${esc(s.label)} -- ${esc(t("m." + m))}: ${esc(reasonText(s.school, year, i))}">--</div>`
              : `<div class="hb-bar" style="width:${v}%;background:${s.color}" data-tip="${esc(s.label)} -- ${esc(t("m." + m))}: ${pctTxt(v)}"></div>`;
          }).join("")}
          ${refTicks(ref.tdsb[i], ref.ontario[i])}
        </div>
      </div>`).join("");
    return `${legend}<div class="hbars">${rows}<div class="hb-axis"><span></span><div>${[0, 25, 50, 75, 100].map(x => `<span style="left:${x}%">${pctTxt(x)}</span>`).join("")}</div></div></div>`;
  }
  // TDSB: thick solid tick underneath. Ontario: thin dashed tick on top, so both stay visible when equal.
  function refTicks(tv, ov) {
    const same = tv != null && tv === ov;
    const tipT = same ? `${t("sc.typTDSB")}, ${t("sc.typON")}: ${pctTxt(tv)}` : `${t("sc.typTDSB")}: ${pctTxt(tv)}`;
    const tipO = same ? tipT : `${t("sc.typON")}: ${pctTxt(ov)}`;
    return (tv != null ? `<span class="hb-ref r1" style="left:${tv}%" data-tip="${esc(tipT)}"></span>` : "") +
      (ov != null ? `<span class="hb-ref r2" style="left:${ov}%" data-tip="${esc(tipO)}"></span>` : "");
  }
  // Horizontal offsets (px) for points at the same x whose values are close enough to overlap.
  function dodge(vals, closePts = 4, step = 7) {
    const idx = vals.map((v, i) => ({ v, i })).filter(o => o.v != null).sort((a, b) => a.v - b.v);
    const out = vals.map(() => 0), groups = [];
    idx.forEach(o => { const g = groups[groups.length - 1]; if (g && o.v - g[g.length - 1].v <= closePts) g.push(o); else groups.push([o]); });
    groups.forEach(g => g.forEach((o, k) => { out[o.i] = (k - (g.length - 1) / 2) * step; }));
    return out;
  }
  function chartLegend(series, o = {}) {
    return `<div class="legend">${series.map(s => `<span><i class="sw" style="background:${s.color}"></i>${esc(s.label)}</span>`).join("")}
      <span><i class="refkey r1"></i>${esc(o.tdsbLabel || t("sc.typTDSB"))}</span>${o.noOntario ? "" : `<span><i class="refkey r2"></i>${esc(t("sc.typON"))}</span>`}</div>`;
  }

  // Small-multiple trend lines, one per measure. The COVID gap breaks the line.
  function trendCharts(S, series) {
    const years = S.years;
    const W = 300, H = 170, L = 34, R = 10, Tp = 12, B = 30;
    const gapAfter = years.indexOf("2018-19");
    const pos = years.map((y, i) => i + (gapAfter >= 0 && i > gapAfter ? 0.8 : 0));
    const maxPos = pos[pos.length - 1] || 1;
    const x = i => L + (W - L - R) * (pos[i] / maxPos);
    const y = v => Tp + (H - Tp - B) * (1 - v / 100);
    const linePaths = (vals, cls, color) => {
      let d = "";
      vals.forEach((v, i) => {
        if (v == null) return;
        const brk = i === 0 || vals[i - 1] == null || (gapAfter >= 0 && i === gapAfter + 1);
        d += `${brk ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      });
      return d ? `<path d="${d}" class="${cls}" ${color ? `style="stroke:${color}"` : ""}/>` : "";
    };
    return `${chartLegend(series)}<div class="grid grid-3 trends">${MEASURES.map((m, mi) => {
      const refT = years.map(yr => S.reference[yr].tdsb[mi]);
      const refO = years.map(yr => S.reference[yr].ontario[mi]);
      const gapX = gapAfter >= 0 && gapAfter < years.length - 1 ? (x(gapAfter) + x(gapAfter + 1)) / 2 : null;
      return `<figure class="trend card">
        <figcaption>${esc(t("m." + m))}</figcaption>
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("m." + m))}">
          ${[0, 50, 100].map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 6}" y="${y(v) + 4}" class="ax" text-anchor="end">${v}</text>`).join("")}
          ${gapX ? `<rect x="${gapX - 14}" y="${Tp}" width="28" height="${H - Tp - B}" class="gap"/>` : ""}
          ${years.map((yr, i) => `<text x="${x(i)}" y="${H - 10}" class="ax" text-anchor="middle">${esc(yr.slice(2))}</text>`).join("")}
          ${linePaths(refT, "ref r1")}${linePaths(refO, "ref r2")}
          ${series.map(s => linePaths(years.map(yr => s.school.res[yr] ? s.school.res[yr][mi] : null), "ln", s.color)).join("")}
          ${years.map((yr, i) => {
            const vals = series.map(s => (s.school.res[yr] ? s.school.res[yr][mi] : null));
            const dx = dodge(vals);
            return series.map((s, k) => vals[k] == null ? "" : `<circle cx="${x(i) + dx[k]}" cy="${y(vals[k])}" r="4" class="pt" style="fill:${s.color}"/>
              <circle cx="${x(i) + dx[k]}" cy="${y(vals[k])}" r="9" class="hit" data-tip="${esc(s.label)} -- ${yearLabel(yr)}: ${pctTxt(vals[k])}"/>`).join("");
          }).join("")}
        </svg></figure>`;
    }).join("")}</div><p class="muted small">${esc(t("sc.trendP"))}</p>`;
  }

  function resultsTable(S, schools, year) {
    const ref = S.reference[year];
    const cell = (s, i) => {
      const v = s.res[year] ? s.res[year][i] : null;
      const lab = ` data-label="${esc(t("m." + MEASURES[i]))}"`;
      return v == null ? `<td class="muted"${lab} title="${esc(reasonText(s, year, i))}">--</td>` : `<td${lab}>${pctTxt(v)}</td>`;
    };
    const refCells = vals => vals.map((v, i) => `<td data-label="${esc(t("m." + MEASURES[i]))}">${pctTxt(v)}</td>`).join("");
    return `<div class="table-wrap"><table class="data stack">
      <thead><tr><th>${esc(t("sc.name"))}</th>${MEASURES.map(m => `<th>${esc(t("m." + m))}</th>`).join("")}</tr></thead>
      <tbody>${schools.map(s => `<tr><th scope="row">${esc(s.name)}</th>${MEASURES.map((m, i) => cell(s, i)).join("")}</tr>`).join("")}
        <tr class="ref"><th scope="row">${esc(t("sc.typTDSB"))}</th>${refCells(ref.tdsb)}</tr>
        <tr class="ref"><th scope="row">${esc(t("sc.typON"))}</th>${refCells(ref.ontario)}</tr>
        ${[...new Map(schools.filter(s => !s.tdsb && s.boardRef && s.boardRef[year]).map(s => [s.board, s.boardRef[year]])).entries()].map(([b, vals]) =>
          `<tr class="ref"><th scope="row">${esc(t("sc.boardAll", { b }))}</th>${refCells(vals)}</tr>`).join("")}
      </tbody></table></div>`;
  }

  // Enrolment-weighted share across all TDSB elementary students (approximate: the Ministry rounds each school's value).
  function ctxWeighted(S) {
    if (!S._ctxW) {
      S._ctxW = {};
      Object.keys(S.schools[0].ctx).forEach(k => {
        let num = 0, den = 0;
        S.schools.forEach(s => { if (s.ctx[k] != null && s.enrol) { num += s.ctx[k] * s.enrol; den += s.enrol; } });
        S._ctxW[k] = den ? Math.round(num / den * 10) / 10 : null;
      });
    }
    return S._ctxW;
  }
  function contextTable(S, schools) {
    const med = ctxMedians(S), wtd = ctxWeighted(S);
    const fmt1 = v => (v == null ? "--" : (lang === "fr" ? `${String(v).replace(".", ",")} %` : `${v}%`));
    const L = s => ` data-label="${esc(s)}"`;
    return `<div class="table-wrap"><table class="data stack">
      <thead><tr><th></th>${schools.map(s => `<th>${esc(s.name)}${s.tdsb ? "" : `<br><span class="muted small">${esc(s.board)}</span>`}</th>`).join("")}<th>${esc(t("sc.typCtx"))}</th><th>${esc(t("sc.allCtx"))}</th></tr></thead>
      <tbody>${Object.keys(med).map(k => `<tr><th scope="row">${esc(t("ctx." + k))}</th>${schools.map(s => `<td${L(s.name)}>${pctTxt(s.ctx[k])}</td>`).join("")}<td class="muted"${L(t("sc.typCtx"))}>${pctTxt(med[k])}</td><td class="muted"${L(t("sc.allCtx"))}>${fmt1(wtd[k])}</td></tr>`).join("")}
        <tr><th scope="row">${esc(t("sc.enrol"))}</th>${schools.map(s => `<td${L(s.name)}>${s.enrol == null ? "--" : s.enrol}</td>`).join("")}<td class="muted"${L(t("sc.typCtx"))}>${median(S.schools.map(s => s.enrol))}</td><td class="muted"${L(t("sc.allCtx"))}>--</td></tr>
      </tbody></table></div>
      <p class="muted small">${esc(t("sc.ctxNote"))}</p>
      <details class="tv how"><summary>${esc(t("sc.howMeasuredH"))}</summary>${t("sc.howMeasured_html")}</details>`;
  }

  // ======================================================================
  // EQAO ANALYTICS (deeper charts for school comparison and the city overview)
  // ======================================================================
  const mean = a => { const v = a.filter(x => x != null); return v.length ? v.reduce((p, c) => p + c, 0) / v.length : null; };
  const medianOf = a => median(a);
  const jitter = (id, amp) => ((((parseInt(id, 10) || 1) * 9301 + 49297) % 233280) / 233280 - 0.5) * 2 * amp;

  // Responsive SVG charts: drawn at the container's real width so text stays a readable size.
  let mounted = [];
  function mount(el, draw) {
    if (!el) return;
    const render = () => { const w = Math.max(260, Math.floor(el.clientWidth)); el.innerHTML = draw(w); };
    render();
    mounted.push({ el, render });
  }
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { mounted = mounted.filter(m => m.el.isConnected); mounted.forEach(m => m.render()); }, 150);
  });

  // Least-squares line y = a + b x
  function fitLine(pts) {
    const n = pts.length;
    if (n < 3) return null;
    const mx = mean(pts.map(p => p.x)), my = mean(pts.map(p => p.y));
    let sxy = 0, sxx = 0;
    pts.forEach(p => { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2; });
    const b = sxx ? sxy / sxx : 0, a = my - b * mx;
    return { a, b, at: x => a + b * x };
  }
  // Each school's result compared with what is typical for TDSB schools with the same low-income share.
  function expectedFor(S, year, mi) {
    const pts = S.schools.filter(s => s.ctx.lowinc != null && s.res[year] && s.res[year][mi] != null)
      .map(s => ({ s, x: s.ctx.lowinc, y: s.res[year][mi] }));
    const f = fitLine(pts);
    if (f) pts.forEach(p => { p.exp = f.at(p.x); p.r = p.y - p.exp; });
    return { pts, f };
  }
  const resBin = r => (r >= 15 ? "p2" : r >= 5 ? "p1" : r > -5 ? "z" : r > -15 ? "n1" : "n2");
  const signed = v => (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(Math.round(v));
  function resLegend() {
    return `<div class="legend">${["p2", "p1", "z", "n1", "n2"].map(b => `<span><i class="sw rb-${b}"></i>${esc(t("viz.res." + b))}</span>`).join("")}</div>`;
  }
  function measureOptions(sel) {
    return MEASURES.map((m, i) => `<option value="${i}" ${i === sel ? "selected" : ""}>${esc(t("m." + m))}</option>`).join("");
  }
  const howTo = key => `<p class="howto"><strong>${esc(t("viz.howTo"))}</strong> ${esc(t(key))}</p>`;

  // ---------- generic SVG pieces ----------
  function axesY(L, R, w, y, ticks, fmt) {
    return ticks.map(v => `<line x1="${L}" x2="${w - R}" y1="${y(v)}" y2="${y(v)}" class="g"/><text x="${L - 6}" y="${y(v) + 4}" class="ax" text-anchor="end">${fmt(v)}</text>`).join("");
  }
  function scatterSVG(w, o) {
    const H = Math.round(Math.min(440, Math.max(300, w * 0.62)));
    const L = 44, R = 14, T = 12, B = 44;
    const x = v => L + (w - L - R) * (v - o.x0) / (o.x1 - o.x0);
    const y = v => T + (H - T - B) * (1 - (v - o.y0) / (o.y1 - o.y0));
    const xt = o.xTicks.map(v => `<line x1="${x(v)}" x2="${x(v)}" y1="${T}" y2="${H - B}" class="g"/><text x="${x(v)}" y="${H - B + 16}" class="ax" text-anchor="middle">${o.xFmt(v)}</text>`).join("");
    const line = o.fit ? `<line x1="${x(o.x0)}" y1="${y(Math.max(o.y0, Math.min(o.y1, o.fit.at(o.x0))))}" x2="${x(o.x1)}" y2="${y(Math.max(o.y0, Math.min(o.y1, o.fit.at(o.x1))))}" class="fit"/>` : "";
    const dots = o.pts.filter(p => !p.big).map(p => `<circle cx="${x(p.x).toFixed(1)}" cy="${y(p.y).toFixed(1)}" r="4" class="dot ${p.cls || ""}" data-tip="${esc(p.tip)}" ${p.sid ? `data-sid="${p.sid}"` : ""}/>`).join("");
    const placed = [];
    const bigs = o.pts.filter(p => p.big).map(p => {
      let cx = x(p.x), cy = y(p.y);
      while (placed.some(q => Math.hypot(q[0] - cx, q[1] - cy) < 12)) cx += 12; // keep identical schools visible
      placed.push([cx, cy]);
      return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="7.5" class="dot big" style="fill:${p.color}" data-tip="${esc(p.tip)}" data-sid="${p.sid}"/>`;
    }).join("");
    return `<svg width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" class="viz" role="img" aria-label="${esc(o.label)}">
      ${axesY(L, R, w, y, o.yTicks, o.yFmt)}${xt}${o.extra ? o.extra(x, y, H, T, B) : ""}${line}${dots}${bigs}
      <text x="${(L + w - R) / 2}" y="${H - 6}" class="axl" text-anchor="middle">${esc(o.xLabel)}</text>
      <text x="12" y="${(T + H - B) / 2}" class="axl" text-anchor="middle" transform="rotate(-90 12 ${(T + H - B) / 2})">${esc(o.yLabel)}</text>
    </svg>`;
  }
  // Lines over a set of x labels; series: {label, color, cls, vals}
  function linesSVG(w, o) {
    const H = o.h || 220, L = 38, R = o.r || 12, T = 12, B = 30;
    const n = o.xs.length;
    const x = i => L + (w - L - R) * (n === 1 ? 0.5 : i / (n - 1));
    const y = v => T + (H - T - B) * (1 - (v - o.y0) / (o.y1 - o.y0));
    const path = vals => { let d = ""; vals.forEach((v, i) => { if (v == null) return; d += `${d && vals[i - 1] != null ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`; }); return d; };
    return `<svg width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" class="viz" role="img" aria-label="${esc(o.label || "")}">
      ${axesY(L, R, w, y, o.yTicks || [0, 50, 100], v => v)}
      ${o.xs.map((lab, i) => `<text x="${x(i)}" y="${H - 10}" class="ax" text-anchor="${n === 2 ? (i ? "end" : "start") : "middle"}">${esc(lab)}</text>`).join("")}
      ${o.series.map(s => { const d = path(s.vals); return d ? `<path d="${d}" class="ln ${s.cls || ""}" ${s.color ? `style="stroke:${s.color}"` : ""}/>` : ""; }).join("")}
      ${o.xs.map((lab, i) => {
        const pts = o.series.filter(s => !s.noDots);
        const dx = dodge(pts.map(s => (s.cls && s.cls.includes("ref") ? null : s.vals[i])), 4, 8);
        return pts.map((s, k) => { const v = s.vals[i]; if (v == null) return "";
          const cx = x(i) + (dx[k] || 0);
          return `<circle cx="${cx}" cy="${y(v)}" r="${s.cls && s.cls.includes("ref") ? 3 : 4}" class="pt ${s.cls || ""}" ${s.color ? `style="fill:${s.color}"` : ""}/><circle cx="${cx}" cy="${y(v)}" r="9" class="hit" data-tip="${esc(s.label)} -- ${esc(lab)}: ${pctTxt(Math.round(v))}"/>`; }).join("");
      }).join("")}
    </svg>`;
  }

  // ---------- C2: five-year average with range ----------
  function rangeChart(S, series) {
    const ys = S.years;
    const refAvg = MEASURES.map((m, i) => mean(ys.map(y => S.reference[y].tdsb[i])));
    return `${chartLegend(series, { noOntario: true, tdsbLabel: t("viz.tdsbAvg") })}<div class="rg">${MEASURES.map((m, i) => `
      <div class="hb-row"><div class="hb-label">${esc(t("m." + m))}</div>
        <div class="rg-track">${series.map(s => {
          const vals = ys.map(y => (s.school.res[y] ? s.school.res[y][i] : null)).filter(v => v != null);
          if (!vals.length) return `<div class="rg-row"><span class="hb-none">${esc(t("sc.noData"))}</span></div>`;
          const lo = Math.min(...vals), hi = Math.max(...vals), av = mean(vals);
          const tip = t("viz.rangeTip", { s: s.label, m: t("m." + m), a: pctTxt(Math.round(av)), lo: pctTxt(lo), hi: pctTxt(hi), n: vals.length });
          return `<div class="rg-row" data-tip="${esc(tip)}"><span class="rg-bar" style="left:${lo}%;width:${Math.max(0.6, hi - lo)}%;background:${s.color}"></span>
            <span class="rg-dot" style="left:${av}%;background:${s.color}"></span></div>`;
        }).join("")}
        ${refAvg[i] != null ? `<span class="hb-ref r1" style="left:${refAvg[i]}%" data-tip="${esc(t("viz.tdsbAvg"))}: ${pctTxt(Math.round(refAvg[i]))}"></span>` : ""}</div>
      </div>`).join("")}${axisRow()}</div>`;
  }
  const axisRow = () => `<div class="hb-axis"><span></span><div>${[0, 25, 50, 75, 100].map(x => `<span style="left:${x}%">${pctTxt(x)}</span>`).join("")}</div></div>`;

  // ---------- C1: level breakdown (diverging around the provincial standard) ----------
  function levelChart(S, series, year) {
    const ref = S.reference[year].dist;
    const rows = mi => [
      ...series.map(s => ({ label: s.label, color: s.color, d: s.school.dist && s.school.dist[year] ? s.school.dist[year][mi] : null })),
      { label: t("sc.typTDSB"), d: ref.tdsb[mi], ref: true },
      { label: t("sc.typON"), d: ref.ontario[mi], ref: true }];
    const seg = (cls, v, label, who, m) => v ? `<span class="lv ${cls}" style="width:${v}%" data-tip="${esc(who)} -- ${esc(t("m." + m))}: ${esc(label)} ${pctTxt(v)}"></span>` : "";
    const L = t("me.levels");
    return `<div class="legend">
        <span><i class="sw lv-l1"></i>${esc(t("viz.lvBelow1"))}</span><span><i class="sw lv-l2"></i>${esc(L["2"])}</span>
        <span class="lv-sep">|</span><span><i class="sw lv-l3"></i>${esc(L["3"])}</span><span><i class="sw lv-l4"></i>${esc(L["4"])}</span></div>
      <div class="lvc">${MEASURES.map((m, mi) => `
        <div class="lv-block"><div class="lv-title">${esc(t("m." + m))}</div>
          ${rows(mi).map(r => `<div class="lv-row ${r.ref ? "ref" : ""}">
            <span class="lv-name">${r.color ? `<i class="sw" style="background:${r.color}"></i>` : ""}${esc(r.label)}</span>
            ${r.d ? `<div class="lv-bar"><div class="lv-left">${seg("lv-l1", (r.d[3] || 0) + (r.d[4] || 0), t("viz.lvBelow1"), r.label, m)}${seg("lv-l2", r.d[2], L["2"], r.label, m)}</div>
              <div class="lv-right">${seg("lv-l3", r.d[1], L["3"], r.label, m)}${seg("lv-l4", r.d[0], L["4"], r.label, m)}</div></div>`
              : `<span class="muted small">${esc(t("sc.nr"))}</span>`}
          </div>`).join("")}
        </div>`).join("")}
        <div class="lv-axis"><span></span><div><span>100%</span><span>50%</span><span class="mid">${esc(t("viz.standard"))}</span><span>50%</span><span>100%</span></div></div>
      </div>`;
  }

  // ---------- C4: where each school sits among all TDSB schools ----------
  function stripChart(S, series, year) {
    const rows = [...MEASURES.map((m, i) => ({ label: t("m." + m), val: s => (s.res[year] ? s.res[year][i] : null), ref: S.reference[year].tdsb[i], refLabel: t("sc.typTDSB") })),
      { label: t("ctx.lowinc") + " (0-40%)", val: s => s.ctx.lowinc, max: 40, ctx: true },
      { label: t("ctx.ell"), val: s => s.ctx.ell, ctx: true }];
    return `${chartLegend(series, { noOntario: true })}<div class="strips">${rows.map(r => {
      const max = r.max || 100;
      const all = S.schools.map(s => ({ s, v: r.val(s) })).filter(o => o.v != null);
      const sorted = all.map(o => o.v).sort((a, b) => a - b);
      const med = medianOf(sorted);
      const below = v => Math.round(100 * sorted.filter(x => x < v).length / sorted.length);
      return `<div class="hb-row ${r.ctx ? "ctxrow" : ""}"><div class="hb-label">${esc(r.label)}</div>
        <div class="strip">${all.map(o => `<i style="left:${Math.min(100, o.v / max * 100)}%;top:${50 + jitter(o.s.id, 38)}%" data-sid="${o.s.id}" data-tip="${esc(o.s.name)}: ${pctTxt(o.v)}"></i>`).join("")}
          ${r.ctx ? `<span class="hb-ref r2" style="left:${med / max * 100}%" data-tip="${esc(t("sc.typCtx"))}: ${pctTxt(med)}"></span>`
            : (r.ref != null ? `<span class="hb-ref r1" style="left:${r.ref}%" data-tip="${esc(r.refLabel)}: ${pctTxt(r.ref)}"></span>` : "")}
          ${stackDots(series.map(s => ({ s, v: r.val(s.school) })).filter(o => o.v != null).map(o => ({ ...o, pos: Math.min(100, o.v / max * 100) })))
            .map(o => `<b style="left:${o.pos}%;margin-top:${o.dy - 7}px;background:${o.s.color}" data-sid="${o.s.school.id}" data-tip="${esc(t("viz.stripTip", { s: o.s.label, v: pctTxt(o.v), p: below(o.v) }))}"></b>`).join("")}
        </div></div>`;
    }).join("")}${axisRow()}</div>
    <p class="muted small">${esc(t("viz.stripNote"))}</p><p class="muted small click-hint">👆 ${esc(t("viz.clickHint"))}</p>`;
  }

  // Schools with the same (or nearly the same) value would hide each other, so stack those dots vertically.
  function stackDots(items, gap = 1.6, step = 11) {
    const sorted = items.slice().sort((p, q) => p.pos - q.pos);
    const groups = [];
    sorted.forEach(o => {
      const g = groups[groups.length - 1];
      if (g && o.pos - g[g.length - 1].pos < gap) g.push(o); else groups.push([o]);
    });
    groups.forEach(g => g.forEach((o, i) => { o.dy = (i - (g.length - 1) / 2) * step; }));
    return sorted;
  }

  // ---------- C3: subgroups (latest year) ----------
  function subgroupChart(S, series, mi) {
    const year = latestYear(S), R = S.reference[year];
    const rows = [...series.map(s => ({ label: s.label, color: s.color, all: s.school.res[year] ? s.school.res[year][mi] : null, sub: s.school.sub })),
      { label: t("sc.typTDSB"), color: "var(--ref1)", all: R.tdsb[mi], sub: Object.fromEntries(Object.keys(R.sub).map(k => [k, R.sub[k].tdsb])), ref: true },
      { label: t("sc.typON"), color: "var(--ref2)", all: R.ontario[mi], sub: Object.fromEntries(Object.keys(R.sub).map(k => [k, R.sub[k].ontario])), ref: true }];
    const panels = [["girls", "boys"], ["ell", "all"], ["sped", "all"]];
    const val = (r, k) => (k === "all" ? r.all : (r.sub && r.sub[k] ? r.sub[k][mi] : null));
    const lab = k => t("viz.sub." + k);
    return `<div class="sg">${panels.map(([a, b]) => `
      <div class="sg-panel"><div class="sg-head"><span><i class="mk ma"></i>${esc(lab(a))}</span><span><i class="mk mb"></i>${esc(lab(b))}</span></div>
        ${rows.map(r => { const va = val(r, a), vb = val(r, b);
          const tip = `${r.label} -- ${lab(a)}: ${va == null ? t("sc.nr") : pctTxt(va)}; ${lab(b)}: ${vb == null ? t("sc.nr") : pctTxt(vb)}`;
          const gap = va != null && vb != null ? signed(va - vb) : "";
          return `<div class="sg-row ${r.ref ? "ref" : ""} ${va == null ? "nr" : ""}" data-tip="${esc(tip)}"><span class="lv-name">${r.ref ? "" : `<i class="sw" style="background:${r.color}"></i>`}${esc(r.label)}</span>
            <div class="sg-track">${va != null && vb != null ? `<span class="sg-link" style="left:${Math.min(va, vb)}%;width:${Math.abs(va - vb)}%"></span>` : ""}
              ${vb != null ? `<span class="mk mb" style="left:${vb}%;--c:${r.color}"></span>` : ""}
              ${va != null ? `<span class="mk ma" style="left:${va}%;--c:${r.color}"></span>` : ""}</div>
            <span class="sg-note">${va == null ? esc(t("viz.nrShort")) : gap}</span></div>`;
        }).join("")}
        ${axisRow().replace("hb-axis", "hb-axis sg-axis")}
      </div>`).join("")}</div>`;
  }

  // ---------- C5: Grade 3 class, three years later in Grade 6 ----------
  function cohortCharts(S, series) {
    const ys = S.years;
    if (ys.length < 4) return "";
    const y3 = ys[ys.length - 4], y6 = ys[ys.length - 1];
    const xs = [t("viz.g3in", { y: yearLabel(y3) }), t("viz.g6in", { y: yearLabel(y6) })];
    const ids = [];
    const html = `${chartLegend(series)}<div class="grid grid-3">${[0, 1, 2].map(k => {
      const id = `coh${k}`; ids.push(id);
      return `<figure class="card trend"><figcaption>${esc(t("me.mt")[["r", "w", "m"][k]])}</figcaption><div id="${id}" class="mount"></div></figure>`;
    }).join("")}</div><p class="muted small">${esc(t("viz.cohortNote", { a: yearLabel(y3), b: yearLabel(y6) }))}</p>`;
    const draw = () => [0, 1, 2].forEach(k => mount(document.getElementById(ids[k]), w => linesSVG(w, {
      xs, y0: 0, y1: 100, h: 200, r: 18, label: t("me.mt")[["r", "w", "m"][k]],
      series: [
        { label: t("sc.typON"), cls: "ref r2", vals: [S.reference[y3].ontario[k], S.reference[y6].ontario[k + 3]] },
        { label: t("sc.typTDSB"), cls: "ref r1", vals: [S.reference[y3].tdsb[k], S.reference[y6].tdsb[k + 3]] },
        ...series.map(s => ({ label: s.label, color: s.color, vals: [s.school.res[y3] ? s.school.res[y3][k] : null, s.school.res[y6] ? s.school.res[y6][k + 3] : null] }))]
    })));
    return { html, draw };
  }

  // ---------- class sizes (Ontario open data, latest school year) ----------
  function classSizeSection(S, schools) {
    const R = S.classRef;
    if (!R || !schools.some(s => s.cls)) return "";
    const num1 = v => (v == null ? "--" : (lang === "fr" ? String(v).replace(".", ",") : String(v)));
    const cols = [...schools.map(s => ({ label: s.name, c: s.cls })), { label: t("sc.typTDSB"), c: R.tdsb, ref: true }, { label: t("sc.typON"), c: R.ontario, ref: true }];
    const rowsDef = [
      [t("cs.k"), c => c.k[0] ? `${num1(c.k[1])} <span class="muted small">(${t("cs.nClasses", { n: c.k[0] })})</span>` : "--"],
      [t("cs.p"), c => c.p[0] ? `${num1(c.p[1])} <span class="muted small">(${t("cs.nClasses", { n: c.p[0] })})</span>` : "--"],
      [t("cs.p20"), c => (c.p[2] == null ? "--" : pctTxt(c.p[2]))],
      [t("cs.j"), c => c.j[0] ? `${num1(c.j[1])} <span class="muted small">(${t("cs.nClasses", { n: c.j[0] })})</span>` : "--"],
      [t("cs.comb"), c => (c.n ? `${c.c} ${t("cs.of")} ${c.n}` : "--")]];
    return `<h2>${esc(t("cs.h", { y: yearLabel(R.year) }))}</h2>${howTo("cs.how")}
      <div class="table-wrap"><table class="data stack">
        <thead><tr><th></th>${cols.map(c => `<th>${esc(c.label)}</th>`).join("")}</tr></thead>
        <tbody>${rowsDef.map(([lab, f]) => `<tr><th scope="row">${esc(lab)}</th>${cols.map(c => `<td data-label="${esc(c.label)}" class="${c.ref ? "muted" : ""}">${c.c ? f(c.c) : "--"}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>
      <p class="muted small">${esc(t("cs.note"))} <a href="https://www.ontario.ca/laws/regulation/120132" target="_blank" rel="noopener">${esc(t("cs.reg"))} ↗</a></p>`;
  }

  // ---------- "Schools like this one": nearest schools by community context, same board ----------
  const SIM_KEYS = ["lowinc", "ell", "newc", "sped", "nodeg"];
  function similarSchools(S, school, k = 6) {
    const year = latestYear(S);
    const pool = (school.tdsb ? S.schools : Object.values(schoolCache).filter(x => x.board === school.board))
      .filter(x => SIM_KEYS.every(key => x.ctx && x.ctx[key] != null) && x.res[year] && x.res[year].some(v => v != null));
    if (!SIM_KEYS.every(key => school.ctx[key] != null) || pool.length < 5) return [];
    const stats = SIM_KEYS.map(key => {
      const v = pool.map(x => x.ctx[key]), m = mean(v);
      const sd = Math.sqrt(mean(v.map(x => (x - m) ** 2))) || 1;
      return { key, m, sd };
    });
    const z = x => stats.map(st => (x.ctx[st.key] - st.m) / st.sd);
    const zs = z(school);
    // Prefer schools that report the same grades (e.g. both have Grade 6 results).
    const sameGrades = x => [0, 3].every(off => (school.res[year] && school.res[year].slice(off, off + 3).some(v => v != null)) === x.res[year].slice(off, off + 3).some(v => v != null));
    return pool.filter(x => x.id !== school.id)
      .map(x => ({ s: x, d: Math.hypot(...z(x).map((v, i) => v - zs[i])) + (sameGrades(x) ? 0 : 1.5) }))
      .sort((a, b) => a.d - b.d).slice(0, k).map(o => o.s);
  }
  function similarSection(S, school) {
    const year = latestYear(S);
    const sims = similarSchools(S, school);
    if (!sims.length) return "";
    const own = school.res[year] || [];
    const groupAvg = MEASURES.map((m, i) => mean(sims.map(x => x.res[year][i])));
    const diffs = MEASURES.map((m, i) => (own[i] != null && groupAvg[i] != null ? own[i] - groupAvg[i] : null));
    const summary = MEASURES.map((m, i) => diffs[i] == null ? "" :
      `<li><strong>${esc(t("m." + m))}:</strong> ${pctTxt(own[i])} ${esc(t("sim.vs"))} ${pctTxt(Math.round(groupAvg[i]))} <span class="sim-d ${diffs[i] >= 5 ? "up" : diffs[i] <= -5 ? "down" : ""}">(${signed(diffs[i])})</span></li>`).join("");
    const L = s => ` data-label="${esc(s)}"`;
    const row = (x, self) => `<tr class="${self ? "sim-self" : ""}"><th scope="row">${self ? `<strong>${esc(x.name)}</strong>` : `<a href="#/school/${x.id}">${esc(x.name)}</a>`}</th>
      <td${L(t("sc.lowinc"))}>${pctTxt(x.ctx.lowinc)}</td><td${L(t("sc.ell"))}>${pctTxt(x.ctx.ell)}</td>
      ${MEASURES.map((m, i) => { const v = x.res[year] ? x.res[year][i] : null; return `<td${L(t("m." + m))}${v == null ? ' class="muted"' : ""}>${v == null ? "--" : pctTxt(v)}</td>`; }).join("")}
      <td class="cb"${L(t("sc.add"))}>${self ? "" : addBtn(x.id)}</td></tr>`;
    const top3 = [school.id, ...sims.slice(0, 3).map(x => x.id)];
    return `<h2>${esc(t("sim.h"))}</h2>${howTo("sim.how")}
      <div class="card">
        <p class="small"><strong>${esc(t("sim.sumH", { y: yearLabel(year) }))}</strong></p>
        <ul class="clean sim-sum">${summary}</ul>
        <div class="table-wrap"><table class="data stack sim-table">
          <thead><tr><th>${esc(t("sc.name"))}</th><th>${esc(t("sc.lowinc"))}</th><th>${esc(t("sc.ell"))}</th>${MEASURES.map(m => `<th>${esc(t("m." + m))}</th>`).join("")}<th><span class="sr">${esc(t("sc.add"))}</span></th></tr></thead>
          <tbody>${row(school, true)}${sims.map(x => row(x, false)).join("")}</tbody></table></div>
        <p class="page-actions"><a class="btn" href="#/compare-schools/${top3.join(",")}">⚖️ ${esc(t("sim.compare3"))}</a></p>
        <p class="muted small">${esc(t("sim.note", { b: school.tdsb ? "TDSB" : school.board }))}</p>
      </div>`;
  }

  // ---------- Grade 3 -> Grade 6, same students (EQAO tracking) ----------
  function trackingChart(series) {
    const T = window.TRACKING;
    if (!T || !series.some(s => T.schools[s.school.id])) return null;
    const boards = [...new Set(series.filter(s => !s.school.tdsb && s.school.boardNo && T.boards[s.school.boardNo]).map(s => s.school))]
      .filter((sc, i, arr) => arr.findIndex(x => x.boardNo === sc.boardNo) === i);
    const rows = k => [
      ...series.map(s => ({ label: s.label, color: s.color, d: (T.schools[s.school.id] || {})[k] })),
      { label: t("sc.typTDSB"), d: T.reference.tdsb && T.reference.tdsb[k], ref: true },
      ...boards.map(sc => ({ label: t("sc.boardAll", { b: sc.board }), d: T.boards[sc.boardNo][k], ref: true })),
      { label: t("sc.typON"), d: T.reference.ontario && T.reference.ontario[k], ref: true }];
    const lab = ["maintained", "rose", "dropped", "never"].map(x => t("trk." + x));
    const seg = (cls, v, i, who, subj, n) => v ? `<span class="lv ${cls}" style="width:${v}%" data-tip="${esc(who)} -- ${esc(subj)}: ${esc(lab[i])} ${pctTxt(v)}${n ? ` (${t("trk.ofN", { n })})` : ""}"></span>` : "";
    const subj = { R: t("me.mt").r, W: t("me.mt").w, M: t("me.mt").m };
    return `<div class="legend">
        <span><i class="sw lv-l1"></i>${esc(lab[3])}</span><span><i class="sw lv-l2"></i>${esc(lab[2])}</span><span class="lv-sep">|</span>
        <span><i class="sw lv-l3"></i>${esc(lab[1])}</span><span><i class="sw lv-l4"></i>${esc(lab[0])}</span></div>
      <div class="lvc">${["R", "W", "M"].map(k => `
        <div class="lv-block"><div class="lv-title">${esc(subj[k])}</div>
          ${rows(k).map(r => { const d = r.d; return `<div class="lv-row ${r.ref ? "ref" : ""}">
            <span class="lv-name">${r.color ? `<i class="sw" style="background:${r.color}"></i>` : ""}${esc(r.label)}${d && d[4] && !r.ref ? ` <span class="muted">(${d[4]})</span>` : ""}</span>
            ${d ? `<div class="lv-bar"><div class="lv-left">${seg("lv-l1", d[3], 3, r.label, subj[k], d[4])}${seg("lv-l2", d[2], 2, r.label, subj[k], d[4])}</div>
              <div class="lv-right">${seg("lv-l3", d[1], 1, r.label, subj[k], d[4])}${seg("lv-l4", d[0], 0, r.label, subj[k], d[4])}</div></div>`
              : `<span class="muted small">${esc(t("trk.na"))}</span>`}</div>`; }).join("")}
        </div>`).join("")}
        <div class="lv-axis"><span></span><div><span>100%</span><span>50%</span><span class="mid">${esc(t("trk.axis"))}</span><span>50%</span><span>100%</span></div></div>
      </div>
      <p class="muted small">${esc(t("trk.note", { a: yearLabel(T.grade3Year), b: yearLabel(T.year) }))}</p>`;
  }

  // Deep-dive sections shared by the school profile and the comparison page.
  function deepDive(S, series) {
    const year = latestYear(S);
    const coh = cohortCharts(S, series);
    const trk = trackingChart(series);
    const html = `
      <h2>${esc(t("viz.rangeH"))}</h2>${howTo("viz.rangeHow")}
      <div class="card">${rangeChart(S, series)}</div>
      <h2>${esc(t("viz.levelsH", { y: yearLabel(year) }))}</h2>${howTo("viz.levelsHow")}
      <div class="card">${levelChart(S, series, year)}</div>
      <h2>${esc(t("viz.stripH", { y: yearLabel(year) }))}</h2>${howTo("viz.stripHow")}
      <div class="card">${stripChart(S, series, year)}</div>
      <h2>${esc(t("viz.subH", { y: yearLabel(year) }))}</h2>${howTo("viz.subHow")}
      <div class="card"><div class="controls inline"><label>${esc(t("viz.measure"))}<select id="sgMeasure">${measureOptions(5)}</select></label></div>
        <div id="sgOut">${subgroupChart(S, series, 5)}</div><p class="muted small">${esc(t("viz.subNote"))}</p></div>
      ${trk ? `<h2>${esc(t("trk.h"))}</h2>${howTo("trk.how")}<div class="card">${trk}</div>`
        : coh ? `<h2>${esc(t("viz.cohortH"))}</h2>${howTo("viz.cohortHow")}${coh.html}` : ""}`;
    const wire = () => {
      const sel = document.getElementById("sgMeasure");
      if (sel) sel.addEventListener("change", () => { document.getElementById("sgOut").innerHTML = subgroupChart(S, series, +sel.value); });
      if (coh && !trk) coh.draw();
    };
    return { html, wire };
  }

  // ---------- city-wide overview ----------
  const INCOME_BANDS = [[0, 9], [10, 14], [15, 19], [20, 100]];
  const bandOf = v => INCOME_BANDS.findIndex(([a, b]) => v >= a && v <= b);

  function viewCity() {
    withData(needSchoolsFor([]), S => {
      const st = { mi: 5, year: latestYear(S), sq: 0 };
      const by = schoolById(S);
      let sel = getCompare().filter(id => by[id]);
      main.innerHTML = `<div id="cityView">
        <h1>📊 ${esc(t("city.h1"))}</h1>
        <p class="lead">${esc(t("city.lead"))}</p>
        ${caveat(S)}
        <div class="subject-tabs" role="tablist">
          <a href="#/schools/map" style="--c:var(--accent)">🗺️ ${esc(t("sc.map"))}</a>
          <a href="#/schools/table" style="--c:var(--accent)">📋 ${esc(t("sc.table"))}</a>
          <a href="#/schools/city" class="active" style="--c:var(--accent)">📊 ${esc(t("city.tab"))}</a>
        </div>
        <div class="card controls viz-controls">
          <label>${esc(t("viz.measure"))}<select id="cMeasure">${measureOptions(st.mi)}</select></label>
          <label>${esc(t("sc.year"))}<select id="cYear">${S.years.slice().reverse().map(y => `<option value="${y}">${yearLabel(y)}</option>`).join("")}</select></label>
        </div>
        <p class="small muted hl-line" id="hlLine">${sel.length ? `${esc(t("city.highlight"))} ${sel.map((id, i) => `<span class="tray-chip"><span class="sw" style="background:${SERIES[i]}"></span>${esc(by[id].name)}</span>`).join(" ")}`
            : esc(t("city.highlightNone"))}</p>
        <section><h2>${esc(t("city.oddsH"))}</h2>${howTo("city.oddsHow")}<div class="card"><div id="cOddsSum" class="small"></div>${resLegend()}<div id="cOdds" class="mount"></div><p class="muted small click-hint">👆 ${esc(t("viz.clickHint"))}</p>
          <details class="tv"><summary>${esc(t("city.oddsTable"))}</summary><div id="cOddsTbl"></div></details></div></section>
        <section><h2>${esc(t("city.mapH"))}</h2>${howTo("city.mapHow")}<div class="card">${scopeToggle()}<p class="muted small" id="cMapNote"></p>${resLegend()}<div id="cMap" class="map"></div><p class="muted small">${esc(t("sc.mapNote"))}</p></div></section>
        <section><h2>${esc(t("city.incomeH"))}</h2>${howTo("city.incomeHow")}<div class="card"><div id="cIncLegend"></div><div id="cIncome" class="mount"></div><div id="cIncTbl"></div></div></section>
        <section><h2>${esc(t("city.funnelH"))}</h2>${howTo("city.funnelHow")}<div class="card"><div id="cFunSum" class="small"></div><div id="cFunnel" class="mount"></div><p class="muted small click-hint">👆 ${esc(t("viz.clickHint"))}</p></div></section>
        <section><h2>${esc(t("city.groupsH"))}</h2>${howTo("city.groupsHow")}<div class="card"><div class="legend"><span><i class="refkey r1"></i>${esc(t("sc.typTDSB"))}</span><span><i class="refkey r2"></i>${esc(t("sc.typON"))}</span></div><div id="cGroups" class="grid grid-3"></div></div></section>
        <section><h2>${esc(t("city.sqH"))}</h2>${howTo("city.sqHow")}<div class="card"><div class="controls inline"><label>${esc(t("city.sqItem"))}<select id="cSq"></select></label></div><div id="cSqSum" class="small"></div><div id="cSqChart" class="mount"></div><p class="muted small click-hint">👆 ${esc(t("viz.clickHint"))}</p></div></section>
        <p class="muted small">${esc(t("city.method"))} ${esc(t("city.lowincNote"))}</p>
        <details class="tv how"><summary>${esc(t("sc.howMeasuredH"))}</summary>${t("sc.howMeasured_html")}</details>
      </div>`;

      const tipName = s => s.name;
      const hiIndex = s => sel.indexOf(s.id);

      function drawOdds() {
        const { pts, f } = expectedFor(S, st.year, st.mi);
        const m = t("m." + MEASURES[st.mi]);
        const above = pts.filter(p => p.r >= 15).length, below = pts.filter(p => p.r <= -15).length;
        document.getElementById("cOddsSum").innerHTML = f ? esc(t("city.oddsSum", { n: pts.length, a: above, b: below, slope: Math.abs(f.b * 10).toFixed(0) })) : "";
        mount(document.getElementById("cOdds"), w => scatterSVG(w, {
          label: t("city.oddsH"), x0: 0, x1: 40, y0: 0, y1: 100, xTicks: [0, 10, 20, 30, 40], yTicks: [0, 25, 50, 75, 100],
          xFmt: v => pctTxt(v), yFmt: v => v, xLabel: t("ctx.lowinc"), yLabel: m, fit: f,
          pts: pts.map(p => {
            const hi = hiIndex(p.s);
            return { x: Math.min(40, p.x + jitter(p.s.id, 1.4)), y: p.y, big: hi >= 0, color: SERIES[hi], cls: "rb-" + resBin(p.r), sid: p.s.id,
              tip: t("city.oddsTip", { s: tipName(p.s), v: pctTxt(p.y), e: pctTxt(Math.round(p.exp)), d: signed(p.r), li: pctTxt(p.x) }) };
          })
        }));
        const sorted = pts.slice().sort((a, b) => b.r - a.r);
        const row = p => `<tr><th scope="row"><a href="#/school/${p.s.id}">${esc(p.s.name)}</a></th><td data-label="${esc(t("sc.lowinc"))}">${pctTxt(p.x)}</td><td data-label="${esc(m)}">${pctTxt(p.y)}</td><td data-label="${esc(t("city.expected"))}">${pctTxt(Math.round(p.exp))}</td><td data-label="${esc(t("city.diff"))}">${signed(p.r)}</td></tr>`;
        document.getElementById("cOddsTbl").innerHTML = `<div class="table-wrap"><table class="data stack"><thead><tr><th>${esc(t("sc.name"))}</th><th>${esc(t("sc.lowinc"))}</th><th>${esc(m)}</th><th>${esc(t("city.expected"))}</th><th>${esc(t("city.diff"))}</th></tr></thead>
          <tbody>${sorted.map(row).join("")}</tbody></table></div>`;
        drawCityMap(pts);
      }

      // Map: TDSB schools vs the TDSB pattern, or every Ontario English-language school vs the Ontario pattern.
      let lastMapScope = null;
      function drawCityMap(tdsbPts) {
        if (!mapApi) return;
        const note = document.getElementById("cMapNote");
        if (mapScope !== "on") { note.textContent = ""; mapApi(tdsbPts || expectedFor(S, st.year, st.mi).pts, false); return; }
        needOntario().then(O => {
          const pts = O._objs.filter(o => !o.fr && o.lowinc != null && o.r[st.mi] != null).map(o => ({ s: o, x: o.lowinc, y: o.r[st.mi] }));
          const f = fitLine(pts);
          pts.forEach(p => { p.exp = f.at(p.x); p.r = p.y - p.exp; });
          note.textContent = t("city.onMapNote", { y: yearLabel(O.year), n: pts.length.toLocaleString(lang === "fr" ? "fr-CA" : "en-CA") }) + (st.year !== O.year ? " " + t("city.onYearNote", { y: yearLabel(O.year) }) : "");
          mapApi(pts, true);
        }).catch(() => { note.textContent = t("loadError"); });
      }

      let mapApi = null;
      needLeaflet().then(L => {
        const el = document.getElementById("cMap");
        if (!el || !el.isConnected) return;
        const map = L.map(el, { scrollWheelZoom: false, renderer: L.canvas({ padding: 0.5, tolerance: mapTapTolerance() }) }).setView([43.7, -79.39], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
        const layer = L.layerGroup().addTo(map);
        const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
        mapApi = (pts, ontario) => {
          layer.clearLayers();
          if (ontario !== (lastMapScope === "on")) map.setView(ontario ? [43.9, -79.6] : [43.7, -79.39], ontario ? 8 : 11);
          lastMapScope = ontario ? "on" : "tdsb";
          if (ontario) {
            pts.forEach(p => {
              const hi = hiIndex(p.s);
              L.circleMarker([p.s.lat, p.s.lon], { radius: hi >= 0 ? 9 : mapDot(), weight: hi >= 0 ? 3 : 1.5, color: hi >= 0 ? css(`--s${hi + 1}`) : css("--surface"), fillColor: css("--rb-" + resBin(p.r)), fillOpacity: 0.95 })
                .bindPopup(() => `<strong>${p.s.tdsb ? `<a href="#/school/${p.s.id}">${esc(p.s.name)}</a>` : esc(p.s.name)}</strong><br>${esc(p.s.board)}<br>${esc(t("city.oddsTip", { s: "", v: pctTxt(p.y), e: pctTxt(Math.round(p.exp)), d: signed(p.r), li: pctTxt(p.x) }).replace(/^\s*--\s*/, ""))}
                  <br>${addBtn(p.s.id)}${p.s.tdsb ? "" : `<br><a class="small" href="${eqaoLink(p.s.id)}" target="_blank" rel="noopener">${esc(t("sc.eqaoLink"))} ↗</a>`}`)
                .addTo(layer);
            });
            return;
          }
          pts.forEach(p => {
            const hi = hiIndex(p.s);
            L.circleMarker([p.s.lat, p.s.lon], { radius: hi >= 0 ? 9 : mapDot(), weight: hi >= 0 ? 3 : 1.5, color: hi >= 0 ? css(`--s${hi + 1}`) : css("--surface"), fillColor: css("--rb-" + resBin(p.r)), fillOpacity: 0.95 })
              .bindPopup(() => `<strong><a href="#/school/${p.s.id}">${esc(p.s.name)}</a></strong><br>${esc(t("city.oddsTip", { s: "", v: pctTxt(p.y), e: pctTxt(Math.round(p.exp)), d: signed(p.r), li: pctTxt(p.x) }).replace(/^\s*--\s*/, ""))}
                <br>${addBtn(p.s.id)}`)
              .addTo(layer);
          });
        };
        drawOdds();
      }).catch(() => { const el = document.getElementById("cMap"); if (el) el.innerHTML = `<p class="note">${esc(t("sc.mapFail"))}</p>`; });

      function drawIncome() {
        const mi = st.mi, ys = S.years;
        const series = INCOME_BANDS.map((band, bi) => ({
          label: t("city.band" + bi), color: `var(--q${bi + 1})`,
          vals: ys.map(y => medianOf(S.schools.filter(s => s.ctx.lowinc != null && bandOf(s.ctx.lowinc) === bi && s.res[y] && s.res[y][mi] != null).map(s => s.res[y][mi])))
        }));
        const counts = INCOME_BANDS.map((b, bi) => S.schools.filter(s => s.ctx.lowinc != null && bandOf(s.ctx.lowinc) === bi).length);
        document.getElementById("cIncLegend").innerHTML = `<div class="legend">${series.map((s, i) => `<span><i class="sw" style="background:${s.color}"></i>${esc(s.label)} (${counts[i]})</span>`).join("")}</div>`;
        mount(document.getElementById("cIncome"), w => linesSVG(w, { xs: ys.map(yearLabel), y0: 0, y1: 100, h: 280, series, label: t("city.incomeH"), yTicks: [0, 25, 50, 75, 100] }));
        const last = series.map(s => s.vals[s.vals.length - 1]);
        document.getElementById("cIncTbl").innerHTML = `<p class="small"><strong>${esc(t("city.incomeGap", { y: yearLabel(ys[ys.length - 1]), a: pctTxt(last[0]), b: pctTxt(last[3]), d: last[0] != null && last[3] != null ? last[0] - last[3] : "--" }))}</strong></p>
          <details class="tv"><summary>${esc(t("sc.tableView"))}</summary><div class="table-wrap"><table class="data stack"><thead><tr><th></th>${ys.map(y => `<th>${yearLabel(y)}</th>`).join("")}</tr></thead>
          <tbody>${series.map(s => `<tr><th scope="row">${esc(s.label)}</th>${s.vals.map((v, i) => `<td data-label="${yearLabel(ys[i])}">${pctTxt(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`;
      }

      function drawFunnel() {
        const ys = S.years, y1 = ys[ys.length - 1], y0 = ys[ys.length - 2], mi = st.mi;
        const p = (S.reference[y1].tdsb[mi] || 50) / 100;
        const pts = S.schools.filter(s => s.res[y1] && s.res[y0] && s.res[y1][mi] != null && s.res[y0][mi] != null && s.n && s.n[y1] && s.n[y1][mi])
          .map(s => { const n = s.n[y1][mi], d = s.res[y1][mi] - s.res[y0][mi], se = 100 * Math.sqrt(2 * p * (1 - p) / n);
            return { s, n, d, z: d / se }; });
        const maxN = Math.max(60, ...pts.map(q => q.n));
        const out95 = pts.filter(q => Math.abs(q.z) > 1.96).length, out99 = pts.filter(q => Math.abs(q.z) > 3).length;
        document.getElementById("cFunSum").innerHTML = esc(t("city.funnelSum", { n: pts.length, a: out95, b: out99, y0: yearLabel(y0), y1: yearLabel(y1) }));
        mount(document.getElementById("cFunnel"), w => scatterSVG(w, {
          label: t("city.funnelH"), x0: 0, x1: maxN, y0: -60, y1: 60, xTicks: Array.from({ length: Math.floor(maxN / 25) + 1 }, (_, i) => i * 25), yTicks: [-60, -30, 0, 30, 60],
          xFmt: v => v, yFmt: v => (v > 0 ? "+" + v : v), xLabel: t("city.cohort"), yLabel: t("city.change"),
          extra: (x, y) => {
            const curve = (k, sign) => { let d = ""; for (let n = 5; n <= maxN; n += 2) { const v = sign * k * 100 * Math.sqrt(2 * p * (1 - p) / n); d += `${d ? "L" : "M"}${x(n).toFixed(1)},${y(Math.max(-60, Math.min(60, v))).toFixed(1)}`; } return d; };
            return `<line x1="${x(0)}" x2="${x(maxN)}" y1="${y(0)}" y2="${y(0)}" class="zero"/>
              <path d="${curve(1.96, 1)}" class="fun f95"/><path d="${curve(1.96, -1)}" class="fun f95"/><path d="${curve(3, 1)}" class="fun f99"/><path d="${curve(3, -1)}" class="fun f99"/>`;
          },
          pts: pts.map(q => { const hi = hiIndex(q.s);
            const cls = q.z > 3 ? "rb-p2" : q.z > 1.96 ? "rb-p1" : q.z < -3 ? "rb-n2" : q.z < -1.96 ? "rb-n1" : "rb-z";
            return { x: q.n + jitter(q.s.id, 0.4), y: Math.max(-59, Math.min(59, q.d)), big: hi >= 0, color: SERIES[hi], cls, sid: q.s.id,
              tip: t("city.funnelTip", { s: q.s.name, d: signed(q.d), n: q.n, y0: yearLabel(y0), y1: yearLabel(y1) }) + (Math.abs(q.z) > 1.96 ? " " + t("city.funnelUnusual") : "") }; })
        }));
      }

      function drawGroups() {
        const mi = st.mi, ys = S.years;
        const groups = [["all", null], ["girls", "girls"], ["boys", "boys"], ["ell", "ell"], ["sped", "sped"]];
        const box = document.getElementById("cGroups");
        box.innerHTML = groups.map(([k]) => `<figure class="trend card"><figcaption>${esc(t("viz.sub." + k))}</figcaption><div id="grp-${k}" class="mount"></div></figure>`).join("");
        groups.forEach(([k, key]) => {
          const get = who => ys.map(y => (key ? S.reference[y].sub[key][who][mi] : S.reference[y][who][mi]));
          mount(document.getElementById("grp-" + k), w => linesSVG(w, { xs: ys.map(y => y.slice(2)), y0: 0, y1: 100, h: 190, label: t("viz.sub." + k),
            series: [{ label: t("sc.typON"), cls: "ref r2", vals: get("ontario") }, { label: t("sc.typTDSB"), cls: "ref r1", vals: get("tdsb") }] }));
        });
      }

      function drawSq() {
        const subj = MEASURES[st.mi][2], grade = MEASURES[st.mi][1];
        const items = subj === "r" ? [["likeRead", 0], ["goodReader", 2]] : subj === "m" ? [["likeMath", 1], ["goodMath", 3]] : [];
        const selEl = document.getElementById("cSq");
        const out = document.getElementById("cSqChart"), sum = document.getElementById("cSqSum");
        if (!items.length) { selEl.innerHTML = ""; selEl.disabled = true; out.innerHTML = ""; sum.innerHTML = `<p class="muted">${esc(t("city.sqNoWriting"))}</p>`; return; }
        selEl.disabled = false;
        if (st.sq > 1) st.sq = 0;
        selEl.innerHTML = items.map(([k], i) => `<option value="${i}" ${i === st.sq ? "selected" : ""}>${esc(t("city.sq." + k))}</option>`).join("");
        const off = (grade === "3" ? 0 : 4) + items[st.sq][1];
        const yL = latestYear(S);
        const pts = S.schools.filter(s => s.sq && s.sq[off] != null && s.res[yL] && s.res[yL][st.mi] != null).map(s => ({ s, x: s.sq[off], y: s.res[yL][st.mi] }));
        const f = fitLine(pts);
        const ref = S.sqReference;
        sum.innerHTML = esc(t("city.sqSum", { item: t("city.sq." + items[st.sq][0]), t: pctTxt(ref.tdsb[off]), o: pctTxt(ref.ontario[off]), n: pts.length, y: yearLabel(yL) }));
        mount(out, w => scatterSVG(w, {
          label: t("city.sqH"), x0: 0, x1: 100, y0: 0, y1: 100, xTicks: [0, 25, 50, 75, 100], yTicks: [0, 25, 50, 75, 100],
          xFmt: v => pctTxt(v), yFmt: v => v, xLabel: t("city.sq." + items[st.sq][0]), yLabel: t("m." + MEASURES[st.mi]) + ` (${yearLabel(yL)})`, fit: f,
          pts: pts.map(p => { const hi = hiIndex(p.s); return { x: p.x, y: p.y, big: hi >= 0, color: SERIES[hi], cls: "rb-z", sid: p.s.id,
            tip: `${p.s.name} -- ${t("city.sq." + items[st.sq][0])}: ${pctTxt(p.x)}; ${t("m." + MEASURES[st.mi])}: ${pctTxt(p.y)}` }; })
        }));
      }

      const drawAll = () => { mounted = []; drawOdds(); drawIncome(); drawFunnel(); drawGroups(); drawSq(); };
      const view = document.getElementById("cityView");
      document.getElementById("cMeasure").addEventListener("change", ev => { st.mi = +ev.target.value; drawAll(); });
      document.getElementById("cYear").addEventListener("change", ev => { st.year = ev.target.value; drawOdds(); });
      document.getElementById("cSq").addEventListener("change", ev => { st.sq = +ev.target.value; drawSq(); });
      // After a school is added or removed anywhere on this page, refresh the highlights everywhere.
      onCompareChange = () => {
        ensureSchools(S, getCompare()).then(() => {
          sel = getCompare().filter(id => by[id]);
          document.getElementById("hlLine").innerHTML = sel.length ? `${esc(t("city.highlight"))} ${sel.map((id, i) => `<span class="tray-chip"><span class="sw" style="background:${SERIES[i]}"></span>${esc(by[id].name)}</span>`).join(" ")}` : esc(t("city.highlightNone"));
          drawAll();
        });
      };
      view.addEventListener("click", ev => {
        const sc = ev.target.closest("[data-scope]");
        if (sc) { mapScope = sc.dataset.scope; view.querySelectorAll("[data-scope]").forEach(b => b.setAttribute("aria-pressed", String(b === sc))); drawCityMap(); return; }
        const tg = ev.target.closest("button[data-toggle]");
        if (tg) { if (toggleCompare(tg.dataset.toggle)) onCompareChange(); }
      });
      drawAll();
    });
  }

  function viewSchools(tab) {
    tab = tab === "table" ? "table" : "map";
    withData(needSchoolsFor([]), S => {
      const year = latestYear(S);
      const state = { q: "", sort: "name", dir: 1, near: null };
      main.innerHTML = `<div id="schoolsView">
        <h1>🏫 ${esc(t("sc.h1"))}</h1>
        <p class="lead">${esc(t("sc.lead"))}</p>
        ${caveat(S)}
        ${researchPanel("schools")}
        <div id="trayWrap">${compareTray(S)}</div>
        <div class="card controls">
          <label class="grow"><span class="sr">${esc(t("sc.searchPh"))}</span><input id="sq" type="search" placeholder="${esc(t("sc.searchPh"))}"></label>
          <button class="btn ghost" id="near">📍 ${esc(t("sc.nearMe"))}</button>
          <a class="btn ghost" href="#/my-eqao">🎯 ${esc(t("tool.myeqao")[0])}</a>
        </div>
        <p class="muted small" id="nearMsg" aria-live="polite"></p>
        <div class="subject-tabs" role="tablist">
          <a href="#/schools/map" class="${tab === "map" ? "active" : ""}" style="--c:var(--accent)">🗺️ ${esc(t("sc.map"))}</a>
          <a href="#/schools/table" class="${tab === "table" ? "active" : ""}" style="--c:var(--accent)">📋 ${esc(t("sc.table"))}</a>
          <a href="#/schools/city" style="--c:var(--accent)">📊 ${esc(t("city.tab"))}</a>
        </div>
        <p class="muted small" id="count"></p>
        ${tab === "map" ? `${scopeToggle()}<p class="muted small" id="scopeNote"></p>
          <div id="map" class="map"></div><p class="muted small">${esc(t("sc.mapNote"))}</p><div id="mapList" class="grid grid-3"></div>`
          : `<p class="muted small">${esc(t("sc.sortHint"))} ${esc(t("sc.year"))}: ${yearLabel(year)}.</p><div class="table-wrap" id="tbl"></div>`}
        <p class="muted small">${esc(t("sc.typNote"))}</p></div>`;
      const view = document.getElementById("schoolsView");

      const onMode = () => tab === "map" && mapScope === "on" && window.SCHOOLS_ON;
      const filtered = () => {
        const q = state.q.toLowerCase().replace(/\s+/g, "");
        let rows = onMode()
          ? window.SCHOOLS_ON._objs.filter(s => !q || s.name.toLowerCase().replace(/\s+/g, "").includes(q) || s.board.toLowerCase().replace(/\s+/g, "").includes(q))
          : S.schools.filter(s => !q || s.name.toLowerCase().replace(/\s+/g, "").includes(q) || (s.postal || "").toLowerCase().startsWith(q));
        if (state.near) rows = rows.map(s => Object.assign({}, s, { _d: distKm(state.near[0], state.near[1], s.lat, s.lon) }));
        return rows;
      };
      const refreshTray = () => { document.getElementById("trayWrap").innerHTML = compareTray(S); };
      let mapApi = null;

      function renderTable() {
        const rows = filtered();
        const key = state.sort, mi = MEASURES.indexOf(key);
        const val = s => key === "name" ? s.name : key === "dist" ? s._d : key === "enrol" ? s.enrol :
          key === "lowinc" || key === "ell" ? s.ctx[key] : (s.res[year] ? s.res[year][mi] : null);
        rows.sort((a, b) => {
          const va = val(a), vb = val(b);
          if (va == null && vb == null) return 0;
          if (va == null) return 1;
          if (vb == null) return -1;
          return (typeof va === "string" ? va.localeCompare(vb) : va - vb) * state.dir;
        });
        const ids = getCompare();
        const cols = [["name", t("sc.name")], ...(state.near ? [["dist", "km"]] : []), ["grades", t("sc.grades")], ["enrol", t("sc.enrol")],
          ...MEASURES.map(m => [m, t("m." + m)]), ["lowinc", t("sc.lowinc")], ["ell", t("sc.ell")]];
        const th = ([k, label]) => k === "grades" ? `<th>${esc(label)}</th>` :
          `<th aria-sort="${state.sort === k ? (state.dir > 0 ? "ascending" : "descending") : "none"}"><button class="sort" data-sort="${k}">${esc(label)}${state.sort === k ? (state.dir > 0 ? " ▲" : " ▼") : ""}</button></th>`;
        document.getElementById("tbl").innerHTML = `<label class="m-only m-sort">${esc(t("sc.sortBy"))}
            <select id="sortSel">${cols.filter(([k]) => k !== "grades").map(([k, label]) => `<option value="${k}" ${state.sort === k ? "selected" : ""}>${esc(label)}</option>`).join("")}</select></label>
          <table class="data schools stack">
          <thead><tr><th><span class="sr">${esc(t("sc.add"))}</span></th>${cols.map(th).join("")}</tr></thead>
          <tbody>${rows.map(s => `<tr>
            <td class="cb" data-label="${esc(t("sc.add"))}"><input type="checkbox" data-toggle="${s.id}" ${ids.includes(s.id) ? "checked" : ""} aria-label="${esc(t("sc.add"))}: ${esc(s.name)}"></td>
            <th scope="row"><a href="#/school/${s.id}">${esc(s.name)}</a></th>
            ${state.near ? `<td data-label="km">${s._d.toFixed(1)}</td>` : ""}
            <td data-label="${esc(t("sc.grades"))}">${esc(s.grades)}</td><td data-label="${esc(t("sc.enrol"))}">${s.enrol == null ? "--" : s.enrol}</td>
            ${MEASURES.map((m, i) => { const v = s.res[year] ? s.res[year][i] : null; const lab = esc(t("m." + m)); return v == null ? `<td class="muted" data-label="${lab}" title="${esc(reasonText(s, year, i))}">--</td>` : `<td data-label="${lab}">${v}</td>`; }).join("")}
            <td data-label="${esc(t("sc.lowinc"))}">${s.ctx.lowinc == null ? "--" : s.ctx.lowinc}</td><td data-label="${esc(t("sc.ell"))}">${s.ctx.ell == null ? "--" : s.ctx.ell}</td></tr>`).join("")}</tbody></table>`;
        document.getElementById("sortSel").addEventListener("change", ev => { state.sort = ev.target.value; state.dir = (state.sort === "name" || state.sort === "dist") ? 1 : -1; renderTable(); });
        document.getElementById("count").textContent = t("sc.showing", { n: rows.length, t: S.schools.length });
      }

      function renderMapList() {
        let rows = filtered();
        if (state.near) rows.sort((a, b) => a._d - b._d);
        const ids = getCompare();
        const on = onMode();
        document.getElementById("count").textContent = t("sc.showing", { n: rows.length, t: on ? window.SCHOOLS_ON.rows.length : S.schools.length });
        document.getElementById("scopeNote").textContent = on ? t("sc.onNote", { y: yearLabel(window.SCHOOLS_ON.year) }) : "";
        document.getElementById("mapList").innerHTML = on ? rows.slice(0, 24).map(s => `
          <div class="card school-card"><a href="#/school/${s.id}"><strong>${esc(s.name)}</strong></a>
            <div class="muted small">${esc(s.board)} · ${esc(s.grades)}${s.fr ? " · FR" : ""}${state.near ? ` · ${t("sc.km", { d: s._d.toFixed(1) })}` : ""}</div>
            <button class="btn add sm ${ids.includes(s.id) ? "on" : ""}" data-toggle="${s.id}">${ids.includes(s.id) ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button></div>`).join("") : rows.slice(0, 24).map(s => `
          <div class="card school-card"><a href="#/school/${s.id}"><strong>${esc(s.name)}</strong></a>
            <div class="muted small">${esc(s.grades)} · ${esc(s.addr)}${state.near ? ` · ${t("sc.km", { d: s._d.toFixed(1) })}` : ""}</div>
            <button class="btn add sm ${ids.includes(s.id) ? "on" : ""}" data-toggle="${s.id}">${ids.includes(s.id) ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button></div>`).join("");
        if (mapApi) mapApi.update(rows);
      }

      async function initMap() {
        let L;
        try { L = await needLeaflet(); } catch (e) { document.getElementById("map").innerHTML = `<p class="note">${esc(t("sc.mapFail"))}</p>`; return; }
        const el = document.getElementById("map");
        if (!el) return;
        const map = L.map(el, { scrollWheelZoom: false, renderer: L.canvas({ padding: 0.5, tolerance: mapTapTolerance() }) }).setView([43.7, -79.39], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
        const layer = L.layerGroup().addTo(map);
        let youMarker = null, lastScope = null;
        const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
        mapApi = {
          update(rows) {
            layer.clearLayers();
            const ids = getCompare();
            if (onMode()) {
              const yr = yearLabel(window.SCHOOLS_ON.year);
              rows.forEach(s => {
                const ci = ids.indexOf(s.id);
                L.circleMarker([s.lat, s.lon], { radius: ci >= 0 ? 9 : mapDot(), weight: ci >= 0 ? 2 : 1.5, color: css("--surface"),
                  fillColor: ci >= 0 ? css(`--s${ci + 1}`) : s.tdsb ? css("--accent") : css("--map-dot"), fillOpacity: 0.9 })
                  .bindPopup(() => `<strong><a href="#/school/${s.id}">${esc(s.name)}</a></strong><br>${esc(s.board)} · ${esc(s.grades)}
                    ${s.fr ? `<br><small><em>${esc(t("sc.frNote"))}</em></small>` : ""}
                    <br><small><strong>${yr}</strong><br>${MEASURES.map((mm, i) => `${esc(t("m." + mm))}: ${pctTxt(s.r[i])}`).join("<br>")}</small>
                    <br><button class="btn add sm ${getCompare().includes(s.id) ? "on" : ""}" data-toggle="${s.id}">${getCompare().includes(s.id) ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button>
                    ${s.tdsb ? "" : `<br><a class="small" href="${eqaoLink(s.id)}" target="_blank" rel="noopener">${esc(t("sc.eqaoLink"))} ↗</a>`}`)
                  .addTo(layer);
              });
              if (state.near) { if (youMarker) youMarker.remove(); youMarker = L.circleMarker(state.near, { radius: 7, color: "#000", weight: 2, fillColor: "#fff", fillOpacity: 1 }).addTo(map); map.setView(state.near, 13); }
              else if (rows.length && rows.length < window.SCHOOLS_ON.rows.length) map.fitBounds(rows.map(s => [s.lat, s.lon]), { maxZoom: 14, padding: [20, 20] });
              else if (lastScope !== "on") map.setView([43.9, -79.6], 8);
              lastScope = "on";
              return;
            }
            if (lastScope === "on" && !state.near && rows.length === S.schools.length) map.setView([43.7, -79.39], 11);
            lastScope = "tdsb";
            rows.forEach(s => {
              const ci = ids.indexOf(s.id);
              const m = L.circleMarker([s.lat, s.lon], {
                radius: ci >= 0 ? 9 : mapDot(), weight: 2, color: getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#fff",
                fillColor: ci >= 0 ? getComputedStyle(document.documentElement).getPropertyValue(`--s${ci + 1}`).trim() : getComputedStyle(document.documentElement).getPropertyValue("--map-dot").trim(),
                fillOpacity: 0.95
              });
              const r = s.res[year] || [];
              m.bindPopup(() => `<strong><a href="#/school/${s.id}">${esc(s.name)}</a></strong><br>${esc(s.grades)} · ${esc(s.addr)}
                <br><small>${MEASURES.map((mm, i) => `${esc(t("m." + mm))}: ${pctTxt(r[i])}`).join("<br>")}</small>
                <br><button class="btn add sm ${getCompare().includes(s.id) ? "on" : ""}" data-toggle="${s.id}">${getCompare().includes(s.id) ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button>`);
              m.addTo(layer);
            });
            if (state.near) {
              if (youMarker) youMarker.remove();
              youMarker = L.circleMarker(state.near, { radius: 7, color: "#000", weight: 2, fillColor: "#fff", fillOpacity: 1 }).addTo(map);
              map.setView(state.near, 14);
            } else if (rows.length && rows.length < S.schools.length) {
              map.fitBounds(rows.map(s => [s.lat, s.lon]), { maxZoom: 15, padding: [20, 20] });
            }
          }
        };
        renderMapList();
      }

      const rerender = () => (tab === "table" ? renderTable() : renderMapList());
      onCompareChange = () => ensureSchools(S, getCompare()).then(() => { refreshTray(); rerender(); });
      document.getElementById("sq").addEventListener("input", ev => { state.q = ev.target.value.trim(); rerender(); });
      document.getElementById("near").addEventListener("click", () => {
        const msg = document.getElementById("nearMsg");
        if (!navigator.geolocation) { msg.textContent = t("sc.nearErr"); return; }
        navigator.geolocation.getCurrentPosition(p => {
          state.near = [p.coords.latitude, p.coords.longitude];
          if (tab === "table") { state.sort = "dist"; state.dir = 1; }
          msg.textContent = t("sc.nearNote"); rerender();
        }, () => { msg.textContent = t("sc.nearErr"); }, { timeout: 10000 });
      });
      view.addEventListener("click", ev => {
        const sc = ev.target.closest("[data-scope]");
        if (sc) {
          mapScope = sc.dataset.scope;
          view.querySelectorAll("[data-scope]").forEach(b => b.setAttribute("aria-pressed", String(b === sc)));
          (mapScope === "on" ? needOntario() : Promise.resolve()).then(renderMapList).catch(() => { document.getElementById("scopeNote").textContent = t("loadError"); });
          return;
        }
        const sb = ev.target.closest("[data-sort]");
        if (sb) { const k = sb.dataset.sort; state.dir = state.sort === k ? -state.dir : (k === "name" || k === "dist" ? 1 : -1); state.sort = k; renderTable(); return; }
        if (ev.target.closest("[data-clear]")) { setCompare([]); refreshTray(); rerender(); return; }
        const tg = ev.target.closest("button[data-toggle]");
        if (tg) { toggleCompare(tg.dataset.toggle); refreshTray(); rerender(); }
      });
      view.addEventListener("change", ev => {
        const cb = ev.target.closest("input[data-toggle]");
        if (cb) { if (!toggleCompare(cb.dataset.toggle)) cb.checked = false; refreshTray(); }
      });
      if (tab === "table") renderTable();
      else if (mapScope === "on") needOntario().then(initMap, () => { mapScope = "tdsb"; initMap(); });
      else initMap();
    });
  }

  function viewSchool(id) {
    withData(needSchoolsFor([id]), S => {
      const s = schoolById(S)[id];
      if (!s) return notFound();
      const year = latestYear(S);
      const ids = getCompare();
      const series = [{ label: s.name, color: SERIES[0], school: s }];
      const dd = deepDive(S, series);
      main.innerHTML = `
        <p><a href="#/schools">← ${esc(t("sc.h1"))}</a></p>
        <span class="pill">${esc(t("sc.profile"))} · ${esc(s.board || "Toronto DSB")} · ${esc(s.grades)}</span>
        <h1>🏫 ${esc(s.name)}</h1>
        ${s.tdsb ? "" : `<div class="note">${esc(t("sc.notTdsb", { b: s.board }))}${s.fr ? " " + esc(t("sc.frNote")) : ""}</div>`}
        <div class="grid grid-3 facts">
          <div><strong>${esc(t("sc.address"))}</strong><br>${esc(s.addr)}, ${esc(s.city)} ${esc(s.postal)}</div>
          <div><strong>${esc(t("sc.enrol"))}</strong><br>${s.enrol == null ? "--" : s.enrol}</div>
          <div>${s.web ? `<a href="${esc(s.web)}" target="_blank" rel="noopener">${esc(t("sc.website"))} ↗</a><br>` : ""}${s.phone ? `${esc(t("sc.phone"))}: ${esc(s.phone)}` : ""}</div>
        </div>
        <div class="page-actions">
          <button class="btn add ${ids.includes(id) ? "on" : ""}" id="cmpBtn">${ids.includes(id) ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button>
          ${ids.length ? `<a class="btn ghost" href="#/compare-schools/${ids.join(",")}">${esc(t("sc.compareBtn"))} (${ids.length})</a>` : ""}
          ${s.tdsb ? `<a class="btn ghost" href="#/my-eqao/${id}">🎯 ${esc(t("tool.myeqao")[0])}</a>` : `<a class="btn ghost" href="${eqaoLink(id)}" target="_blank" rel="noopener">${esc(t("sc.eqaoLink"))} ↗</a>`}
        </div>
        ${caveat(S)}
        <h2>${esc(t("sc.latestH", { y: yearLabel(year) }))}</h2>
        <p class="muted">${esc(t("sc.latestP"))}</p>
        <div class="card">${barsChart(S, series, year)}
          <details class="tv"><summary>${esc(t("sc.tableView"))}</summary>${resultsTable(S, [s], year)}</details></div>
        <h2>${esc(t("sc.trendH"))}</h2>
        ${trendCharts(S, series)}
        ${dd.html}
        ${similarSection(S, s)}
        ${classSizeSection(S, [s])}
        <h2>${esc(t("sc.contextH"))}</h2>
        <p class="muted">${esc(t("sc.contextP", { y: yearLabel(S.contextYear) }))}</p>
        ${contextTable(S, [s])}
        <p class="muted small">${esc(t("sc.typNote"))}</p>`;
      dd.wire();
      document.getElementById("cmpBtn").onclick = () => { if (toggleCompare(id)) viewSchool(id); };
      onCompareChange = () => { const y = window.scrollY; viewSchool(id); setTimeout(() => window.scrollTo(0, y), 150); };
      main.addEventListener("click", function simAdd(ev) {
        if (!document.getElementById("cmpBtn")) { main.removeEventListener("click", simAdd); return; }
        const tg = ev.target.closest(".sim-table button[data-toggle]");
        if (tg && toggleCompare(tg.dataset.toggle)) onCompareChange();
      });
    });
  }

  // Choices for "add another school": every Ontario school when the province list is loaded, otherwise TDSB.
  function addOptions(S) {
    const O = window.SCHOOLS_ON;
    return O && O._objs ? O._objs.map(o => ({ id: o.id, label: `${o.name} (${o.board})` })) : S.schools.map(s => ({ id: s.id, label: s.name }));
  }

  function viewCompareSchools(idList) {
    const loader = needSchoolsFor(idList ? idList.split(",") : []);
    withData(() => loader().then(S => needOntario().then(() => S, () => S)), S => {
      const by = schoolById(S);
      let ids = (idList ? idList.split(",") : getCompare()).filter(x => by[x]).slice(0, 4);
      if (idList) setCompare(ids);
      const year = latestYear(S);
      const head = `<p><a href="#/schools">← ${esc(t("sc.h1"))}</a></p><h1>⚖️ ${esc(t("sc.compareH"))}</h1><p class="lead">${esc(t("sc.compareLead"))}</p>`;
      if (!ids.length) {
        main.innerHTML = `${head}<p>${esc(t("sc.pickMore"))}</p><p><a class="btn" href="#/schools">${esc(t("sc.findSchools"))}</a></p>`;
        return;
      }
      const schools = ids.map(x => by[x]);
      const series = schools.map((s, i) => ({ label: s.name, color: SERIES[i], school: s }));
      const dd = deepDive(S, series);
      main.innerHTML = `${head}
        ${caveat(S)}
        <div id="trayWrap">${compareTray(S)}</div>
        ${ids.length < 4 ? `<div class="card controls"><label class="grow">${esc(t("sc.addMore"))}
          <input list="schoolNames" id="addSchool" placeholder="${esc(t("me.schoolPh"))}"></label>
          <datalist id="schoolNames">${addOptions(S).map(o => `<option value="${esc(o.label)}">`).join("")}</datalist></div>` : ""}
        <h2>${esc(t("sc.latestH", { y: yearLabel(year) }))}</h2>
        <p class="muted">${esc(t("sc.latestP"))}</p>
        <div class="card">${barsChart(S, series, year)}</div>
        <h3>${esc(t("sc.tableView"))}</h3>
        ${resultsTable(S, schools, year)}
        <h2>${esc(t("sc.trendH"))}</h2>
        ${trendCharts(S, series)}
        ${dd.html}
        <p><a class="btn ghost" href="#/schools/city">📊 ${esc(t("city.see"))}</a></p>
        ${classSizeSection(S, schools)}
        <h2>${esc(t("sc.ctxCompare"))}</h2>
        <p class="muted">${esc(t("sc.contextP", { y: yearLabel(S.contextYear) }))}</p>
        ${contextTable(S, schools)}
        <p class="muted small">${esc(t("sc.typNote"))}</p>`;
      dd.wire();
      onCompareChange = () => { location.hash = `#/compare-schools/${getCompare().join(",")}`; };
      main.querySelector("#trayWrap").addEventListener("click", ev => {
        const tg = ev.target.closest("button[data-toggle]");
        if (tg) { toggleCompare(tg.dataset.toggle); location.hash = `#/compare-schools/${getCompare().join(",")}`; }
        if (ev.target.closest("[data-clear]")) { setCompare([]); location.hash = "#/compare-schools/"; }
      });
      const add = document.getElementById("addSchool");
      if (add) add.addEventListener("change", () => {
        const s = addOptions(S).find(x => x.label === add.value);
        if (s && !ids.includes(s.id)) location.hash = `#/compare-schools/${ids.concat(s.id).join(",")}`;
      });
    });
  }

  function viewMyEqao(presetId) {
    withData(needSchools, S => {
      const st = Object.assign({ school: "", year: latestYear(S), g3: {}, g6: {} }, getJSON(MYEQAO_KEY, {}));
      if (presetId && schoolById(S)[presetId]) st.school = presetId;
      if (!S.years.includes(st.year)) st.year = latestYear(S);
      const save = () => setJSON(MYEQAO_KEY, st);
      const lv = t("me.levels");
      const levelSel = (g, m) => `<label>${esc(t("me.mt")[m])}<select data-g="${g}" data-m="${m}">
          <option value="">${esc(t("me.notEntered"))}</option>${["4", "3", "2", "1", "B"].map(k => `<option value="${k}" ${st[g][m] === k ? "selected" : ""}>${esc(lv[k])}</option>`).join("")}</select></label>`;
      const sch = schoolById(S)[st.school];

      main.innerHTML = `
        <p><a href="#/schools">← ${esc(t("sc.h1"))}</a></p>
        <h1>🎯 ${esc(t("me.h1"))}</h1>
        <p class="lead">${esc(t("me.lead"))}</p>
        <p class="muted small">🔒 ${esc(t("me.privacy"))}</p>
        <div class="card me-form">
          <label class="grow">${esc(t("me.school"))}<input list="schoolNames" id="meSchool" value="${esc(sch ? sch.name : "")}" placeholder="${esc(t("me.schoolPh"))}"></label>
          <datalist id="schoolNames">${S.schools.map(s => `<option value="${esc(s.name)}">`).join("")}</datalist>
          <label>${esc(t("me.year"))}<select id="meYear">${S.years.slice().reverse().map(y => `<option value="${y}" ${y === st.year ? "selected" : ""}>${yearLabel(y)}</option>`).join("")}</select></label>
          <fieldset><legend>${esc(t("me.g3"))}</legend>${["r", "w", "m"].map(m => levelSel("g3", m)).join("")}</fieldset>
          <fieldset><legend>${esc(t("me.g6"))}</legend>${["r", "w", "m"].map(m => levelSel("g6", m)).join("")}</fieldset>
          <button class="btn ghost" id="meClear">${esc(t("me.clear"))}</button>
        </div>
        <div id="meOut" aria-live="polite"></div>
        <p class="muted small">${esc(t("me.note"))}</p>`;

      const renderOut = () => {
        const s = schoolById(S)[st.school];
        const ref = S.reference[st.year];
        const cards = [];
        [["g3", 3, 0], ["g6", 6, 3]].forEach(([g, gn, off]) => ["r", "w", "m"].forEach((m, j) => {
          const level = st[g][m];
          if (!level) return;
          const i = off + j, meets = level === "4" || level === "3";
          const v = s && s.res[st.year] ? s.res[st.year][i] : null;
          cards.push(`<div class="card me-card ${meets ? "ok" : "warn"}">
            <h3>${esc(t(gn === 3 ? "me.g3" : "me.g6"))} -- ${esc(t("me.mt")[m])}</h3>
            <p><span class="badge inline ${{ 4: "l4", 3: "l3", 2: "l2", 1: "l1", B: "lr" }[level]}">${esc(lv[level])}</span>
              <strong>${esc(meets ? t("me.meets") : t("me.notYet"))}</strong></p>
            <p>${esc(t("me.levelMeaning")[level])}</p>
            ${s && v != null ? `<p class="muted">${esc(t("me.schoolPct", { s: s.name, p: v, g: gn, m: t("me.m")[m], y: yearLabel(st.year) }))}</p>` : ""}
            ${ref ? `<p class="muted small">${esc(t("me.compareTypical", { t: ref.tdsb[i], o: ref.ontario[i] }))}</p>` : ""}
            ${s && s.dist && s.dist[st.year] && s.dist[st.year][i] ? (d => `<p class="muted small">${esc(t("me.dist", { s: s.name, y: yearLabel(st.year), a: d[0], b: d[1], c: d[2], d: d[3], e: d[4] }))}</p>`)(s.dist[st.year][i]) : ""}
          </div>`);
        }));
        document.getElementById("meOut").innerHTML = cards.length ? `<div class="grid grid-3">${cards.join("")}</div>` : `<p class="muted">${esc(t("me.empty"))}</p>`;
      };
      main.querySelector(".me-form").addEventListener("change", ev => {
        const el = ev.target;
        if (el.id === "meSchool") { const s = S.schools.find(x => x.name === el.value); st.school = s ? s.id : ""; }
        else if (el.id === "meYear") st.year = el.value;
        else if (el.dataset.g) st[el.dataset.g][el.dataset.m] = el.value;
        save(); renderOut();
      });
      document.getElementById("meClear").onclick = () => { setJSON(MYEQAO_KEY, {}); viewMyEqao(); };
      renderOut();
    });
  }

  function notFound() {
    main.innerHTML = `<h1>${esc(t("notFound"))}</h1><p><a href="#/">${esc(t("backHome"))}</a></p>`;
  }

  // ---------- router ----------
  const NAV_FOR = { "": "", grade: "grade", official: "grade", handout: "grade", subject: "subject", compare: "compare",
    schools: "schools", school: "schools", "compare-schools": "schools", "my-eqao": "schools",
    report: "report", milestones: "milestones", tracker: "tracker", glossary: "glossary", research: "research" };

  function afterRender() {
    const h1 = main.querySelector("h1");
    document.title = (h1 ? h1.textContent.replace(/^[^\p{L}\p{N}]+/u, "") + " | " : "") + t("brand.title");
  }

  function route() {
    renderId++;
    closePop();
    onCompareChange = null;
    mounted = [];
    tip.hidden = true;
    const parts = location.hash.replace(/^#\/?/, "").split("/").map(p => { try { return decodeURIComponent(p); } catch (e) { return p; } });
    const [page = "", a, b, c] = parts;
    const navKey = NAV_FOR[page];
    document.querySelectorAll(".nav a").forEach(l => l.classList.toggle("active", l.dataset.nav === navKey));
    document.getElementById("nav").classList.remove("open");
    document.querySelector(".menu-btn").setAttribute("aria-expanded", "false");
    document.querySelector(".site-header").classList.remove("search-open");

    switch (page) {
      case "": viewHome(); break;
      case "grade": viewGrade(a || "jk", b); break;
      case "subject": viewSubject(a || "lang"); break;
      case "official": viewOfficial(a || "g1", b || "lang", c); break;
      case "compare": viewCompare(a, b, c); break;
      case "handout": viewHandout(a || (loadStore().lastGrade || "g1")); break;
      case "report": viewReport(); break;
      case "milestones": viewMilestones(); break;
      case "tracker": viewTracker(a); break;
      case "glossary": viewGlossary(); break;
      case "research": viewResearch(a); break;
      case "search": viewSearch(a || ""); break;
      case "schools": if (a === "city") viewCity(); else viewSchools(a); break;
      case "school": viewSchool(a); break;
      case "compare-schools": viewCompareSchools(a); break;
      case "my-eqao": viewMyEqao(a); break;
      default: notFound();
    }
    afterRender();
    if (!(page === "grade" && b) && !(page === "research" && a)) window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  // ---------- startup ----------
  const header = document.querySelector(".site-header");
  const setSearch = open => {
    header.classList.toggle("search-open", open);
    document.getElementById("searchBtn").setAttribute("aria-expanded", String(open));
  };
  document.querySelector(".menu-btn").addEventListener("click", ev => {
    const open = document.getElementById("nav").classList.toggle("open");
    ev.currentTarget.setAttribute("aria-expanded", String(open));
    if (open) setSearch(false);
  });
  document.getElementById("searchBtn").addEventListener("click", () => {
    const open = !header.classList.contains("search-open");
    setSearch(open);
    if (open) { document.getElementById("nav").classList.remove("open"); document.querySelector(".menu-btn").setAttribute("aria-expanded", "false"); document.getElementById("q").focus(); }
  });
  document.getElementById("searchForm").addEventListener("submit", ev => {
    ev.preventDefault();
    const q = document.getElementById("q").value.trim();
    if (q) location.hash = "#/search/" + encodeURIComponent(q);
  });
  document.getElementById("langBtn").addEventListener("click", () => { setLang(lang === "en" ? "fr" : "en"); route(); });
  document.getElementById("themeBtn").addEventListener("click", toggleTheme);
  document.addEventListener("click", ev => { if (ev.target.closest("[data-print]")) window.print(); });

  setLang(initialLang());
  window.addEventListener("hashchange", route);
  route();
})();
