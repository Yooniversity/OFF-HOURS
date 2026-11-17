/* Index intro: white -> (blinds) -> black OFF-HOURS -> (blinds) -> page.
   White stage: the cursor holds a blind cord — pulling down tilts the slats, a full pull opens them.
   Also advances on click, wheel, key, or IDLE ms without input. */
(function () {
  const root = document.documentElement;
  if (location.hash) return; // skip when arriving from an in-site link
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  const SLATS = 14, STAGGER = 45, TURN = 700, SETTLE = 2000, IDLE = 3000;
  const PULL = Math.min(260, innerHeight * 0.32); // px of downward travel for a full pull
  const MAX_TILT = 78;                             // deg, slat tilt at full pull

  const intro = document.createElement("div");
  intro.className = "intro";
  intro.setAttribute("aria-hidden", "true");
  const slats = (cls) => `<div class="blinds ${cls}">${'<span class="slat"></span>'.repeat(SLATS)}</div>`;
  intro.innerHTML =
    `<div class="intro-black">${slats("blinds-black")}<div class="intro-logo">OFF-HOURS</div>` +
    `<p class="intro-foot intro-foot-black">Based in Seoul, South Korea<br>&copy; Hayoon Park ${window.COPYRIGHT_YEARS || 2026}</p></div>` +
    slats("blinds-white") +
    `<div class="cord"><span class="cord-line"></span><span class="cord-pull"></span></div>` +
    `<p class="intro-foot intro-foot-white">pull to enter</p>`;
  document.body.prepend(intro);
  root.classList.add("intro-active");

  const white = intro.querySelector(".blinds-white");
  const whiteSlats = [...white.querySelectorAll(".slat")];
  const cord = intro.querySelector(".cord");
  const hint = intro.querySelector(".intro-foot-white");
  if (fine && !reduced) intro.classList.add("pulling-ui");

  let stage = 0, busy = false, last = null, pull = 0, raf = 0, decay = 0;
  let cx = innerWidth / 2, cy = innerHeight * 0.3; // cord handle position (rest)
  let idleTimer = setTimeout(advance, IDLE);
  const resetIdle = () => { clearTimeout(idleTimer); idleTimer = setTimeout(advance, IDLE); };

  // ---- pull rendering ----
  function render() {
    raf = 0;
    const p = Math.min(1, pull / PULL);
    white.classList.toggle("tilting", p > 0.002);
    hint.style.opacity = String(Math.max(0, 1 - p * 3));
    whiteSlats.forEach((s, i) => {
      const pi = Math.max(0, Math.min(1, p * 1.25 - (i / SLATS) * 0.25)); // top slats lead
      s.style.transform = `rotateX(${-pi * MAX_TILT}deg)`;
    });
    cord.style.transform = `translate3d(${cx}px,0,0)`;
    cord.style.setProperty("--len", `${cy + p * 18}px`); // cord stretches a little under tension
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };

  // ease the pull back when the hand stops (blind springs up)
  function springBack() {
    cancelAnimationFrame(decay);
    const step = () => {
      if (stage !== 0 || busy) return;
      pull *= 0.88;
      if (pull < 0.5) pull = 0;
      schedule();
      if (pull > 0) decay = requestAnimationFrame(step);
    };
    decay = requestAnimationFrame(step);
  }
  let restTimer = 0;

  function onPullMove(x, y) {
    if (stage !== 0 || busy) return;
    cancelAnimationFrame(decay);
    if (last) pull = Math.max(0, pull + (y - last.y)); // down adds tension, up releases
    last = { x, y };
    cx = x; cy = y;
    schedule();
    resetIdle();
    clearTimeout(restTimer);
    restTimer = setTimeout(springBack, 450);
    if (pull >= PULL) advance();
  }

  // ---- stages ----
  function open(blinds, done) {
    busy = true;
    blinds.querySelectorAll(".slat").forEach((s, i) => {
      const d = reduced ? 0 : i * STAGGER;
      s.style.transition = "";
      s.style.transform = "";
      s.style.transitionDelay = `${d}ms, ${d + (reduced ? 0 : 580)}ms`;
    });
    blinds.classList.add("open");
    const total = reduced ? 300 : TURN + STAGGER * (SLATS - 1);
    setTimeout(() => { blinds.style.display = "none"; done(); setTimeout(() => { busy = false; last = null; }, SETTLE); }, total);
  }

  function advance() {
    if (busy) return;
    if (stage === 0) {
      stage = 1;
      clearTimeout(idleTimer); clearTimeout(restTimer); cancelAnimationFrame(decay);
      intro.classList.remove("pulling-ui");
      cord.classList.add("out");
      cancelAnimationFrame(raf); raf = 1; // freeze pull rendering
      hint.style.opacity = "0";
      open(white, () => {});
    } else if (stage === 1) {
      stage = 2;
      intro.querySelector(".intro-logo").classList.add("out");
      intro.querySelector(".intro-foot-black").classList.add("out");
      intro.querySelector(".intro-black").classList.add("opening");
      open(intro.querySelector(".blinds-black"), finish);
    }
  }

  function finish() {
    intro.remove();
    root.classList.remove("intro-active");
    off();
  }

  // ---- input ----
  let travel = 0, lastBlack = null;
  const onMouse = (e) => {
    if (stage === 0) return onPullMove(e.clientX, e.clientY);
    // black stage: deliberate movement advances
    if (lastBlack) travel += Math.hypot(e.clientX - lastBlack.x, e.clientY - lastBlack.y);
    lastBlack = { x: e.clientX, y: e.clientY };
    if (travel > 90 && !busy) { travel = 0; lastBlack = null; advance(); }
  };
  const onTouchMove = (e) => { const t = e.touches[0]; if (t && stage === 0) onPullMove(t.clientX, t.clientY); };
  const onTouchStart = (e) => { const t = e.touches[0]; last = t ? { x: t.clientX, y: t.clientY } : null; if (stage !== 0) advance(); };
  const onKey = (e) => { e.preventDefault(); advance(); };
  const onWheel = (e) => { e.preventDefault(); advance(); };
  const onDown = () => advance();

  const L = [["mousemove", onMouse, { passive: true }], ["touchmove", onTouchMove, { passive: true }],
             ["touchstart", onTouchStart, { passive: true }], ["keydown", onKey], ["wheel", onWheel, { passive: false }],
             ["mousedown", onDown]];
  L.forEach(([t, f, o]) => window.addEventListener(t, f, o));
  const off = () => L.forEach(([t, f]) => window.removeEventListener(t, f));

  render();
})();
