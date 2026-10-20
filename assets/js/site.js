/* Renders content.js into the page. No build step; works from file:// and GitHub Pages. */
(function () {
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---- Language: ?lang= > saved > browser > en ---- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const qLang = new URLSearchParams(location.search).get("lang");
  let lang = qLang || store.get("lang") || ((navigator.language || "").startsWith("ko") ? "ko" : "en");
  if (lang !== "ko") lang = "en";
  const t = (o) => (o == null ? "" : typeof o === "string" ? o : (o[lang] || o.en || ""));

  const UI = {
    work: { en: "Work", ko: "작업" },
    position: { en: "Position", ko: "관점" },
    writing: { en: "Writing", ko: "글" },
    about: { en: "About", ko: "소개" },
    toggle: { en: "한국어", ko: "English" },
    workIntro: { en: "Projects developed outside commissioned work: design, research and the tools behind them.", ko: "대가성 업무 밖에서 이어가는 설계·연구, 그리고 그 뒤의 도구들." },
    posIntro: { en: "Three lines that run through every project.", ko: "모든 작업을 관통하는 세 개의 축." },
    writingIntro: { en: "Ongoing publishing on mass timber, retrofit and heritage.", ko: "매스팀버·리트로핏·유산에 관한 지속적인 기록." },
    ref: { en: "Ref", ko: "번호" }, project: { en: "Project", ko: "프로젝트" },
    type: { en: "Type", ko: "유형" }, status: { en: "Status", ko: "상태" }, year: { en: "Year", ko: "연도" },
    ongoing: { en: "Ongoing", ko: "진행 중" }, complete: { en: "Complete", ko: "완료" }, concept: { en: "Concept", ko: "구상" },
    coming: { en: "Coming soon", ko: "준비 중" }, open: { en: "Open", ko: "열기" },
    education: { en: "Education", ko: "학력" }, tools: { en: "Tools", ko: "도구" },
    sheet: { en: "Sheet", ko: "도면" }, scale: { en: "Scale", ko: "축척" }, drawn: { en: "Drawn", ko: "작성" }, revised: { en: "Revised", ko: "개정" },
    sheetV: { en: "Section through the three layers", ko: "세 레이어 단면" },
    scaleV: { en: "Not to scale", ko: "축척 없음" },
    back: { en: "All work", ko: "전체 작업" }, prev: { en: "Previous", ko: "이전" }, nextP: { en: "Next", ko: "다음" },
    plate: { en: "Drawings to be added", ko: "도면 추가 예정" },
    notFound: { en: "Project not found.", ko: "프로젝트를 찾을 수 없습니다." },
    contact: { en: "Contact", ko: "연락" }
  };

  function applyChrome() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-ui]").forEach((el) => { el.textContent = t(UI[el.dataset.ui]); });
    const btn = $(".lang-toggle");
    if (btn) {
      btn.textContent = t(UI.toggle);
      btn.setAttribute("lang", lang === "en" ? "ko" : "en");
      btn.onclick = () => { lang = lang === "en" ? "ko" : "en"; store.set("lang", lang); render(); };
    }
    const contact = $("#contact");
    if (contact) {
      const L = S.links, items = [];
      if (L.email) items.push(`<a href="mailto:${esc(L.email)}">${esc(L.email)}</a>`);
      if (L.linkedin) items.push(`<a href="${esc(L.linkedin)}" rel="me">LinkedIn</a>`);
      if (L.instagram) items.push(`<a href="${esc(L.instagram)}" rel="me">Instagram</a>`);
      if (L.github) items.push(`<a href="${esc(L.github)}" rel="me">GitHub</a>`);
      contact.innerHTML = items.join("");
    }
    const yr = $("#year"); if (yr) yr.textContent = window.COPYRIGHT_YEARS;
  }

  /* ---- Home ---- */
  const GLYPHS = [
    // Timber: CLT layup in section (cross-laminated plies)
    '<svg class="axis-glyph" viewBox="0 0 56 56" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><rect x="4" y="18" width="48" height="20"/><line x1="4" y1="24.7" x2="52" y2="24.7"/><line x1="4" y1="31.3" x2="52" y2="31.3"/>' +
      Array.from({ length: 11 }, (_, i) => `<line x1="${6 + i * 4.4}" y1="24.7" x2="${6 + i * 4.4}" y2="31.3"/>`).join("") + "</g></svg>",
    // Reversibility: tenon withdrawn from mortise
    '<svg class="axis-glyph" viewBox="0 0 56 56" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M4 14h22v10h-8v8h8v10H4z"/><path d="M34 14h18v28H34V32h-6v-8h6z" stroke-dasharray="2 2"/><path d="M30 46h12m-3-3 3 3-3 3"/></g></svg>',
    // Evidence: deflection under load
    '<svg class="axis-glyph" viewBox="0 0 56 56" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><line x1="4" y1="22" x2="52" y2="22" stroke-dasharray="2 2"/><path d="M4 22Q28 40 52 22"/><path d="M4 22l-3 6h6zM52 22l-3 6h6z"/>' +
      [12, 20, 28, 36, 44].map((x) => `<path d="M${x} 6v9m-2-3 2 3 2-3"/>`).join("") + "</g></svg>"
  ];

  function renderHome() {
    $("#statement").textContent = t(S.statement);
    $("#role").textContent = t(S.role);
    $("#tb-sheet").textContent = t(UI.sheetV);
    $("#tb-scale").textContent = t(UI.scaleV);
    $("#tb-drawn").textContent = S.owner;
    $("#tb-rev").textContent = document.lastModified ? new Date(document.lastModified).toISOString().slice(0, 10) : "";

    $("#register-body").innerHTML = S.projects.map((p) => `
      <tr>
        <td class="ref">${esc(p.ref)}</td>
        <td class="t"><a href="project.html?p=${encodeURIComponent(p.id)}">${esc(t(p.title))}</a><p>${esc(t(p.type))}</p></td>
        <td class="meta"><span class="status" data-s="${esc(p.status)}">${esc(t(UI[p.status]))}</span></td>
        <td class="meta">${esc(p.year)}</td>
      </tr>`).join("");

    $("#axes").innerHTML = S.axes.map((a, i) => `
      <div>${GLYPHS[i] || ""}<h3>${esc(t(a.title))}</h3><p>${esc(t(a.body))}</p></div>`).join("");

    $("#journal").innerHTML = S.journal.map((j) => `
      <li><span class="j-t">${esc(t(j.title))}</span><span class="j-b">${esc(t(j.body))}</span>
      <span class="j-l">${j.url ? `<a href="${esc(j.url)}">${esc(t(UI.open))}</a>` : esc(t(UI.coming))}</span></li>`).join("");

    $("#about-text").textContent = t(S.about);
    $("#edu").innerHTML = S.education.map((e) => `<li>${esc(t(e))}</li>`).join("");
    $("#tools").innerHTML = S.toolkit.map((x) => `<li>${esc(x)}</li>`).join("");
  }

  /* ---- Project page ---- */
  function renderProject() {
    const id = new URLSearchParams(location.search).get("p");
    const i = S.projects.findIndex((p) => p.id === id);
    const main = $("#project");
    if (i < 0) { main.innerHTML = `<p class="p-head">${esc(t(UI.notFound))} <a href="index.html#work">${esc(t(UI.back))}</a></p>`; return; }
    const p = S.projects[i];
    document.title = `${t(p.title)} — ${S.owner}`;
    const prev = S.projects[(i - 1 + S.projects.length) % S.projects.length];
    const next = S.projects[(i + 1) % S.projects.length];
    const plates = p.images && p.images.length
      ? p.images.map((im) => `<figure class="plate"><img src="${esc(im.src)}" alt="${esc(t(im.caption))}" loading="lazy"><figcaption>${esc(t(im.caption))}</figcaption></figure>`).join("")
      : `<div class="plate-empty"><span>${esc(t(UI.plate))}</span></div>`;

    main.innerHTML = `
      <header class="p-head">
        <p class="p-ref">${esc(p.ref)} — <span class="status" data-s="${esc(p.status)}">${esc(t(UI[p.status]))}</span>, ${esc(p.year)}</p>
        <h1 class="p-title">${esc(t(p.title))}</h1>
      </header>
      <div class="p-grid">
        <div><p class="p-summary">${esc(t(p.summary))}</p><p class="p-next">${esc(t(p.next))}</p></div>
        <dl class="spec">
          <div><dt>${esc(t(UI.type))}</dt><dd>${esc(t(p.type))}</dd></div>
          ${p.facts.map((f) => `<div><dt>${esc(t(f.k))}</dt><dd>${esc(t(f.v))}</dd></div>`).join("")}
        </dl>
      </div>
      <div class="plates">${plates}</div>
      <nav class="p-nav" aria-label="Projects">
        <a href="project.html?p=${encodeURIComponent(prev.id)}">${esc(t(UI.prev))}: ${esc(t(prev.title))}</a>
        <a href="index.html#work">${esc(t(UI.back))}</a>
        <a href="project.html?p=${encodeURIComponent(next.id)}">${esc(t(UI.nextP))}: ${esc(t(next.title))}</a>
      </nav>`;
  }

  function render() {
    applyChrome();
    if (document.body.dataset.page === "home") renderHome();
    if (document.body.dataset.page === "project") renderProject();
  }
  render();
})();
