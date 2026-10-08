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
  const SERIES = ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s4)"];
  const MEASURES = ["g3r", "g3w", "g3m", "g6r", "g6w", "g6m"];
  const ASSET_V = "20261008d"; // bump when data files change so browsers fetch fresh copies

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
    const lb = document.getElementById("langBtn");
    lb.textContent = t("langSwitch");
    lb.setAttribute("aria-label", t("langSwitchLabel"));
    lb.lang = lang === "en" ? "fr" : "en";
    document.getElementById("sources").innerHTML = `<strong>${esc(t("footer.sources"))}</strong> ` +
      D.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join(" · ");
    document.getElementById("reviewed").textContent = t("footer.reviewed", { d: D.lastReviewed });
  }

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

  // ======================================================================
  // CURRICULUM VIEWS
  // ======================================================================
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
      <p class="muted">${esc(t("home.glanceSub"))}</p>
      <div class="matrix-wrap"><table class="matrix">
        <thead><tr><th>${esc(t("home.subject"))}</th>${D.grades.map(g => `<th><a href="#/grade/${g.id}">${esc(g.short)}</a></th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody></table></div>
      <h2>${esc(t("home.toolsH"))}</h2>
      <div class="grid grid-3">${tools.map(([h, i, k]) => toolCard(h, i, t(k)[0], t(k)[1])).join("")}</div>`;
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
      <h2>${esc(t("subject.builds"))}</h2>
      <div class="thread-wrap"><table class="thread">
        <thead><tr><th></th>${D.grades.map(g => `<th><a href="#/grade/${g.id}/${s.id}">${esc(g.short)}</a></th>`).join("")}</tr></thead>
        <tbody>${s.threads.map(th => `<tr><th scope="row">${esc(th.name)}</th>${D.grades.map(g => `<td>${esc(th.values[g.id] || "")}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>
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
      <p class="muted small">${esc(t("tr.saved"))}</p>
      <div class="grid grid-2" id="trk">
        ${subs.map(s => `
          <div class="card subj" style="--c:${s.color}">
            <h3>${s.icon} ${esc(s.name)}</h3>
            <div class="progress" style="--c:${s.color}"><span data-bar="${s.id}"></span></div>
            ${s.grades[gid].learn.map((item, i) => {
              const key = `${gid}.${s.id}.${i}`; // keyed by position so ticks survive a language switch
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
      document.getElementById("totalTxt").textContent = t("tr.checked", { d: done, t: total });
      document.getElementById("totalBar").style.width = (100 * done / total) + "%";
    };
    document.getElementById("trk").addEventListener("change", ev => {
      const cb = ev.target.closest("input[data-key]"); if (!cb) return;
      if (cb.checked) checks[cb.dataset.key] = 1; else delete checks[cb.dataset.key];
      cb.closest(".check").classList.toggle("done", cb.checked);
      saveStore(store); update();
    });
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (!confirm(t("tr.confirm", { g: g.short }))) return;
      Object.keys(checks).forEach(k => { if (k.startsWith(gid + ".")) delete checks[k]; });
      saveStore(store); viewTracker(gid);
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
  const schoolById = S => (S._byId = S._byId || Object.fromEntries(S.schools.map(s => [s.id, s])));
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

  const caveat = S => `<div class="note">${t("sc.caveat_html", { y: yearLabel(latestYear(S)) })}</div>`;

  function compareTray(S) {
    const ids = getCompare(), by = schoolById(S);
    return `<div class="tray card" id="tray">
      <strong>${esc(t("sc.tray", { n: ids.length }))}</strong>
      ${ids.map((id, i) => by[id] ? `<span class="tray-chip"><span class="sw" style="background:${SERIES[i]}"></span><a href="#/school/${id}">${esc(by[id].name)}</a>
        <button class="x" data-toggle="${id}" aria-label="${esc(t("sc.remove"))}: ${esc(by[id].name)}">×</button></span>` : "").join("")}
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
  function chartLegend(series) {
    return `<div class="legend">${series.map(s => `<span><i class="sw" style="background:${s.color}"></i>${esc(s.label)}</span>`).join("")}
      <span><i class="refkey r1"></i>${esc(t("sc.typTDSB"))}</span><span><i class="refkey r2"></i>${esc(t("sc.typON"))}</span></div>`;
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
          ${series.map(s => years.map((yr, i) => {
            const v = s.school.res[yr] ? s.school.res[yr][mi] : null;
            return v == null ? "" : `<circle cx="${x(i)}" cy="${y(v)}" r="4" class="pt" style="fill:${s.color}"/>
              <circle cx="${x(i)}" cy="${y(v)}" r="10" class="hit" data-tip="${esc(s.label)} -- ${yearLabel(yr)}: ${pctTxt(v)}"/>`;
          }).join("")).join("")}
        </svg></figure>`;
    }).join("")}</div><p class="muted small">${esc(t("sc.trendP"))}</p>`;
  }

  function resultsTable(S, schools, year) {
    const ref = S.reference[year];
    const cell = (s, i) => {
      const v = s.res[year] ? s.res[year][i] : null;
      return v == null ? `<td class="muted" title="${esc(reasonText(s, year, i))}">--</td>` : `<td>${pctTxt(v)}</td>`;
    };
    return `<div class="table-wrap"><table class="data">
      <thead><tr><th>${esc(t("sc.name"))}</th>${MEASURES.map(m => `<th>${esc(t("m." + m))}</th>`).join("")}</tr></thead>
      <tbody>${schools.map(s => `<tr><th scope="row">${esc(s.name)}</th>${MEASURES.map((m, i) => cell(s, i)).join("")}</tr>`).join("")}
        <tr class="ref"><th scope="row">${esc(t("sc.typTDSB"))}</th>${ref.tdsb.map(v => `<td>${pctTxt(v)}</td>`).join("")}</tr>
        <tr class="ref"><th scope="row">${esc(t("sc.typON"))}</th>${ref.ontario.map(v => `<td>${pctTxt(v)}</td>`).join("")}</tr>
      </tbody></table></div>`;
  }

  function contextTable(S, schools) {
    const med = ctxMedians(S);
    return `<div class="table-wrap"><table class="data">
      <thead><tr><th></th>${schools.map(s => `<th>${esc(s.name)}</th>`).join("")}<th>${esc(t("sc.typCtx"))}</th></tr></thead>
      <tbody>${Object.keys(med).map(k => `<tr><th scope="row">${esc(t("ctx." + k))}</th>${schools.map(s => `<td>${pctTxt(s.ctx[k])}</td>`).join("")}<td class="muted">${pctTxt(med[k])}</td></tr>`).join("")}
        <tr><th scope="row">${esc(t("sc.enrol"))}</th>${schools.map(s => `<td>${s.enrol == null ? "--" : s.enrol}</td>`).join("")}<td class="muted">${median(S.schools.map(s => s.enrol))}</td></tr>
      </tbody></table></div>`;
  }

  function viewSchools(tab) {
    tab = tab === "table" ? "table" : "map";
    withData(needSchools, S => {
      const year = latestYear(S);
      const state = { q: "", sort: "name", dir: 1, near: null };
      main.innerHTML = `<div id="schoolsView">
        <h1>🏫 ${esc(t("sc.h1"))}</h1>
        <p class="lead">${esc(t("sc.lead"))}</p>
        ${caveat(S)}
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
        </div>
        <p class="muted small" id="count"></p>
        ${tab === "map" ? `<div id="map" class="map"></div><p class="muted small">${esc(t("sc.mapNote"))}</p><div id="mapList" class="grid grid-3"></div>`
          : `<p class="muted small">${esc(t("sc.sortHint"))} ${esc(t("sc.year"))}: ${yearLabel(year)}.</p><div class="table-wrap" id="tbl"></div>`}
        <p class="muted small">${esc(t("sc.typNote"))}</p></div>`;
      const view = document.getElementById("schoolsView");

      const filtered = () => {
        const q = state.q.toLowerCase().replace(/\s+/g, "");
        let rows = S.schools.filter(s => !q || s.name.toLowerCase().replace(/\s+/g, "").includes(q) || (s.postal || "").toLowerCase().startsWith(q));
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
        document.getElementById("tbl").innerHTML = `<table class="data schools">
          <thead><tr><th><span class="sr">${esc(t("sc.add"))}</span></th>${cols.map(th).join("")}</tr></thead>
          <tbody>${rows.map(s => `<tr>
            <td><input type="checkbox" data-toggle="${s.id}" ${ids.includes(s.id) ? "checked" : ""} aria-label="${esc(t("sc.add"))}: ${esc(s.name)}"></td>
            <th scope="row"><a href="#/school/${s.id}">${esc(s.name)}</a></th>
            ${state.near ? `<td>${s._d.toFixed(1)}</td>` : ""}
            <td>${esc(s.grades)}</td><td>${s.enrol == null ? "--" : s.enrol}</td>
            ${MEASURES.map((m, i) => { const v = s.res[year] ? s.res[year][i] : null; return v == null ? `<td class="muted" title="${esc(reasonText(s, year, i))}">--</td>` : `<td>${v}</td>`; }).join("")}
            <td>${s.ctx.lowinc == null ? "--" : s.ctx.lowinc}</td><td>${s.ctx.ell == null ? "--" : s.ctx.ell}</td></tr>`).join("")}</tbody></table>`;
        document.getElementById("count").textContent = t("sc.showing", { n: rows.length, t: S.schools.length });
      }

      function renderMapList() {
        let rows = filtered();
        if (state.near) rows.sort((a, b) => a._d - b._d);
        const ids = getCompare();
        document.getElementById("count").textContent = t("sc.showing", { n: rows.length, t: S.schools.length });
        document.getElementById("mapList").innerHTML = rows.slice(0, 24).map(s => `
          <div class="card school-card"><a href="#/school/${s.id}"><strong>${esc(s.name)}</strong></a>
            <div class="muted small">${esc(s.grades)} · ${esc(s.addr)}${state.near ? ` · ${t("sc.km", { d: s._d.toFixed(1) })}` : ""}</div>
            <button class="btn ghost sm" data-toggle="${s.id}">${ids.includes(s.id) ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button></div>`).join("");
        if (mapApi) mapApi.update(rows);
      }

      async function initMap() {
        let L;
        try { L = await needLeaflet(); } catch (e) { document.getElementById("map").innerHTML = `<p class="note">${esc(t("sc.mapFail"))}</p>`; return; }
        const el = document.getElementById("map");
        if (!el) return;
        const map = L.map(el, { scrollWheelZoom: false }).setView([43.7, -79.39], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
        const layer = L.layerGroup().addTo(map);
        let youMarker = null;
        mapApi = {
          update(rows) {
            layer.clearLayers();
            const ids = getCompare();
            rows.forEach(s => {
              const ci = ids.indexOf(s.id);
              const m = L.circleMarker([s.lat, s.lon], {
                radius: ci >= 0 ? 9 : 6, weight: 2, color: getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#fff",
                fillColor: ci >= 0 ? getComputedStyle(document.documentElement).getPropertyValue(`--s${ci + 1}`).trim() : getComputedStyle(document.documentElement).getPropertyValue("--map-dot").trim(),
                fillOpacity: 0.95
              });
              const r = s.res[year] || [];
              m.bindPopup(() => `<strong><a href="#/school/${s.id}">${esc(s.name)}</a></strong><br>${esc(s.grades)} · ${esc(s.addr)}
                <br><small>${MEASURES.map((mm, i) => `${esc(t("m." + mm))}: ${pctTxt(r[i])}`).join("<br>")}</small>
                <br><button class="btn ghost sm" data-toggle="${s.id}">${getCompare().includes(s.id) ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button>`);
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
      if (tab === "table") renderTable(); else initMap();
    });
  }

  function viewSchool(id) {
    withData(needSchools, S => {
      const s = schoolById(S)[id];
      if (!s) return notFound();
      const year = latestYear(S);
      const ids = getCompare();
      const series = [{ label: s.name, color: SERIES[0], school: s }];
      main.innerHTML = `
        <p><a href="#/schools">← ${esc(t("sc.h1"))}</a></p>
        <span class="pill">${esc(t("sc.profile"))} · ${esc(s.grades)}</span>
        <h1>🏫 ${esc(s.name)}</h1>
        <div class="grid grid-3 facts">
          <div><strong>${esc(t("sc.address"))}</strong><br>${esc(s.addr)}, ${esc(s.city)} ${esc(s.postal)}</div>
          <div><strong>${esc(t("sc.enrol"))}</strong><br>${s.enrol == null ? "--" : s.enrol}</div>
          <div>${s.web ? `<a href="${esc(s.web)}" target="_blank" rel="noopener">${esc(t("sc.website"))} ↗</a><br>` : ""}${s.phone ? `${esc(t("sc.phone"))}: ${esc(s.phone)}` : ""}</div>
        </div>
        <div class="page-actions">
          <button class="btn ${ids.includes(id) ? "ghost" : ""}" id="cmpBtn">${ids.includes(id) ? "✓ " + esc(t("sc.remove")) : "+ " + esc(t("sc.add"))}</button>
          ${ids.length ? `<a class="btn ghost" href="#/compare-schools/${ids.join(",")}">${esc(t("sc.compareBtn"))} (${ids.length})</a>` : ""}
          <a class="btn ghost" href="#/my-eqao/${id}">🎯 ${esc(t("tool.myeqao")[0])}</a>
        </div>
        ${caveat(S)}
        <h2>${esc(t("sc.latestH", { y: yearLabel(year) }))}</h2>
        <p class="muted">${esc(t("sc.latestP"))}</p>
        <div class="card">${barsChart(S, series, year)}
          <details class="tv"><summary>${esc(t("sc.tableView"))}</summary>${resultsTable(S, [s], year)}</details></div>
        <h2>${esc(t("sc.trendH"))}</h2>
        ${trendCharts(S, series)}
        <h2>${esc(t("sc.contextH"))}</h2>
        <p class="muted">${esc(t("sc.contextP", { y: yearLabel(S.contextYear) }))}</p>
        ${contextTable(S, [s])}
        <p class="muted small">${esc(t("sc.typNote"))}</p>`;
      document.getElementById("cmpBtn").onclick = () => { if (toggleCompare(id)) viewSchool(id); };
    });
  }

  function viewCompareSchools(idList) {
    withData(needSchools, S => {
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
      main.innerHTML = `${head}
        ${caveat(S)}
        <div id="trayWrap">${compareTray(S)}</div>
        ${ids.length < 4 ? `<div class="card controls"><label class="grow">${esc(t("sc.addMore"))}
          <input list="schoolNames" id="addSchool" placeholder="${esc(t("me.schoolPh"))}"></label>
          <datalist id="schoolNames">${S.schools.map(s => `<option value="${esc(s.name)}">`).join("")}</datalist></div>` : ""}
        <h2>${esc(t("sc.latestH", { y: yearLabel(year) }))}</h2>
        <p class="muted">${esc(t("sc.latestP"))}</p>
        <div class="card">${barsChart(S, series, year)}</div>
        <h3>${esc(t("sc.tableView"))}</h3>
        ${resultsTable(S, schools, year)}
        <h2>${esc(t("sc.trendH"))}</h2>
        ${trendCharts(S, series)}
        <h2>${esc(t("sc.ctxCompare"))}</h2>
        <p class="muted">${esc(t("sc.contextP", { y: yearLabel(S.contextYear) }))}</p>
        ${contextTable(S, schools)}
        <p class="muted small">${esc(t("sc.typNote"))}</p>`;
      main.querySelector("#trayWrap").addEventListener("click", ev => {
        const tg = ev.target.closest("button[data-toggle]");
        if (tg) { toggleCompare(tg.dataset.toggle); location.hash = `#/compare-schools/${getCompare().join(",")}`; }
        if (ev.target.closest("[data-clear]")) { setCompare([]); location.hash = "#/compare-schools/"; }
      });
      const add = document.getElementById("addSchool");
      if (add) add.addEventListener("change", () => {
        const s = S.schools.find(x => x.name === add.value);
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
            ${s && s.dist && s.dist[i] && st.year === latestYear(S) ? `<p class="muted small">${esc(t("me.dist", { s: s.name, y: yearLabel(st.year), a: s.dist[i][0], b: s.dist[i][1], c: s.dist[i][2], d: s.dist[i][3], e: s.dist[i][4] }))}</p>` : ""}
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
    report: "report", milestones: "milestones", tracker: "tracker", glossary: "glossary" };

  function afterRender() {
    const h1 = main.querySelector("h1");
    document.title = (h1 ? h1.textContent.replace(/^[^\p{L}\p{N}]+/u, "") + " | " : "") + t("brand.title");
  }

  function route() {
    renderId++;
    tip.hidden = true;
    const parts = location.hash.replace(/^#\/?/, "").split("/").map(p => { try { return decodeURIComponent(p); } catch (e) { return p; } });
    const [page = "", a, b, c] = parts;
    const navKey = NAV_FOR[page];
    document.querySelectorAll(".nav a").forEach(l => l.classList.toggle("active", l.dataset.nav === navKey));
    document.getElementById("nav").classList.remove("open");
    document.querySelector(".menu-btn").setAttribute("aria-expanded", "false");

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
      case "search": viewSearch(a || ""); break;
      case "schools": viewSchools(a); break;
      case "school": viewSchool(a); break;
      case "compare-schools": viewCompareSchools(a); break;
      case "my-eqao": viewMyEqao(a); break;
      default: notFound();
    }
    afterRender();
    if (!(page === "grade" && b)) window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  // ---------- startup ----------
  document.querySelector(".menu-btn").addEventListener("click", ev => {
    const open = document.getElementById("nav").classList.toggle("open");
    ev.currentTarget.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("searchForm").addEventListener("submit", ev => {
    ev.preventDefault();
    const q = document.getElementById("q").value.trim();
    if (q) location.hash = "#/search/" + encodeURIComponent(q);
  });
  document.getElementById("langBtn").addEventListener("click", () => { setLang(lang === "en" ? "fr" : "en"); route(); });
  document.addEventListener("click", ev => { if (ev.target.closest("[data-print]")) window.print(); });

  setLang(initialLang());
  window.addEventListener("hashchange", route);
  route();
})();
