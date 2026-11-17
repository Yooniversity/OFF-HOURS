/* Index intro: white -> (blinds) -> black OFF-HOURS -> (blinds) -> page.
   Stages: 1 pull (cord follows cursor, blind stays shut) -> 2 release (cord snaps back, beat) -> 3 white blinds open
   -> 4 black OFF-HOURS holds -> 5 black blinds open -> page.
   The white stage advances only by click-and-drag (or Enter / Space). */
(function () {
  const root = document.documentElement;
  if (location.hash) return; // skip when arriving from an in-site link
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  const SLATS = 14, STAGGER = 45, TURN = 700, SETTLE = 2000, IDLE = 3000;
  const PULL = Math.min(260, innerHeight * 0.32); // px of downward travel for a full pull
  const MAX_TILT = 14;                             // deg, slat ripple at full pull (blind stays shut)

  const intro = document.createElement("div");
  intro.className = "intro";
  intro.setAttribute("aria-hidden", "true");
  const slats = (cls) => `<div class="blinds ${cls}">${'<span class="slat"></span>'.repeat(SLATS)}</div>`;
  intro.innerHTML =
    `<div class="intro-black">${slats("blinds-black")}<div class="intro-logo"><img src="assets/img/offhours-wordmark.svg?v=15" alt="OFF-HOURS"></div>` +
    `<p class="intro-foot intro-foot-black">Based in Seoul, South Korea<br>&copy; Hayoon Park ${window.COPYRIGHT_YEARS || 2026}</p></div>` +
    slats("blinds-white") +
    `<div class="cord"><span class="cord-line"></span><span class="cord-pull"></span></div>` +
    `<img class="hand hand-back" src="assets/img/hand.svg?v=15" alt="">` +
    `<img class="hand hand-front" src="assets/img/hand.svg?v=15" alt="">` +
    `<p class="intro-foot intro-foot-white">click and drag down to enter</p>`;
  document.body.prepend(intro);
  root.classList.add("intro-active");

  const white = intro.querySelector(".blinds-white");
  const whiteSlats = [...white.querySelectorAll(".slat")];
  const cord = intro.querySelector(".cord");
  const hint = intro.querySelector(".intro-foot-white");
  const hands = [...intro.querySelectorAll(".hand")]; // back layer + thumb layer (in front of the handle)
  intro.classList.add("pulling-ui");

  let stage = 0, busy = false, last = null, pull = 0, raf = 0, decay = 0;
  const cx = () => innerWidth / 2;          // cord is fixed at the centre
  const VIS = 0.35;                          // handle travel per px of drag
  let pressed = false; // white stage only advances by click-and-drag
  let idleTimer = 0;
  const resetIdle = () => {};

  // ---- stage 1: pull (only the cord moves; the blind stays shut) ----
  const REST = innerHeight * 0.3;
  function render() {
    raf = 0;
    const p = Math.min(1, pull / PULL);
    // blind under tension: slats ripple a few degrees and shade slightly, never opening
    whiteSlats.forEach((s, i) => {
      const pi = Math.max(0, Math.min(1, p * 1.2 - (i / SLATS) * 0.2));
      s.style.transform = `rotateX(${-pi * MAX_TILT}deg)`;
      s.style.backgroundColor = `hsl(0 0% ${100 - pi * 5}%)`;
    });
    const y0 = REST + Math.min(pull, PULL) * VIS; // handle top
    cord.style.transform = `translate3d(${cx()}px, ${y0 - innerHeight}px, 0)`;
    hands.forEach((h) => (h.style.transform = `translate3d(${cx() - 39}px, ${y0 - 12}px, 0)`)); // handle in the pinch
    hint.style.opacity = String(Math.max(0, 1 - p * 2.5));
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };

  // hand stops before the click point: cord and blind settle back
  function springBack() {
    cancelAnimationFrame(decay);
    const step = () => {
      if (stage !== 0 || busy) return;
      pull *= 0.85;
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
    if (pressed) {
      if (last) pull = Math.max(0, pull + (y - last.y)); // down adds tension, up releases
      last = { x, y };
    }
    schedule();
    if (pull >= PULL) release();
  }

  // ---- stage 2: release — cord snaps back, a beat, then the blind opens ----
  function release() {
    if (stage !== 0 || busy) return;
    busy = true;
    clearTimeout(idleTimer); clearTimeout(restTimer); cancelAnimationFrame(decay);
    cancelAnimationFrame(raf); raf = 1; // stop pull rendering
    intro.classList.remove("pulling-ui");
    hint.style.opacity = "0";
    // slats settle flat, cord springs up to rest and fades
    whiteSlats.forEach((s) => { s.style.transition = "transform 220ms ease-out, background-color 220ms ease-out"; s.style.transform = ""; s.style.backgroundColor = ""; });
    cord.style.transition = "transform 320ms cubic-bezier(.2,.9,.3,1.2), opacity 300ms ease-out 260ms";
    cord.style.transform = `translate3d(${cx()}px, ${REST - innerHeight}px, 0)`;
    hands.forEach((h) => { h.style.transition = cord.style.transition; h.style.transform = `translate3d(${cx() - 39}px, ${REST - 12}px, 0)`; h.classList.add("out"); });
    cord.classList.add("out");
    setTimeout(() => { busy = false; advance(); }, reduced ? 0 : 520);
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
      if (!cord.classList.contains("out")) return release();
      stage = 1;
      clearTimeout(idleTimer); clearTimeout(restTimer); cancelAnimationFrame(decay);
      intro.classList.remove("pulling-ui");
      cord.classList.add("out");
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
  const grab = (x, y) => { pressed = true; last = { x, y }; cancelAnimationFrame(decay); intro.classList.add("gripping"); };
  const letGo = () => { if (!pressed) return; pressed = false; last = null; intro.classList.remove("gripping"); if (stage === 0 && !busy) springBack(); };
  const onDown = (e) => { if (stage === 0) { e.preventDefault(); grab(e.clientX, e.clientY); } else advance(); };
  const onUp = () => letGo();
  const onTouchMove = (e) => { const t = e.touches[0]; if (t && stage === 0) onPullMove(t.clientX, t.clientY); };
  const onTouchStart = (e) => { const t = e.touches[0]; if (stage === 0) { if (t) grab(t.clientX, t.clientY); } else advance(); };
  // keyboard stays available for accessibility: Enter / Space pull the cord
  const onKey = (e) => { if (stage === 0 && e.key !== "Enter" && e.key !== " ") return; e.preventDefault(); advance(); };
  const onWheel = (e) => { e.preventDefault(); if (stage !== 0) advance(); };

  const L = [["mousemove", onMouse, { passive: true }], ["touchmove", onTouchMove, { passive: true }],
             ["touchstart", onTouchStart, { passive: true }], ["touchend", onUp], ["mouseup", onUp],
             ["keydown", onKey], ["wheel", onWheel, { passive: false }], ["mousedown", onDown]];
  L.forEach(([t, f, o]) => window.addEventListener(t, f, o));
  const off = () => L.forEach(([t, f]) => window.removeEventListener(t, f));

  window.addEventListener("resize", schedule);
  render();
})();
