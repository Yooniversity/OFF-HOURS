/* Index intro: white -> (blinds) -> black OFF-HOURS -> (blinds) -> page.
   Advances on deliberate input: mouse travel > THRESHOLD px, wheel, click, key, touch. */
(function () {
  const root = document.documentElement;
  // Skip when arriving from an in-site link (e.g. index.html#work) or with reduced motion
  if (location.hash) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SLATS = 14, STAGGER = 45, TURN = 700, THRESHOLD = 90, SETTLE = 2000, IDLE = 3000;

  const intro = document.createElement("div");
  intro.className = "intro";
  intro.setAttribute("aria-hidden", "true");
  const slats = (cls) => `<div class="blinds ${cls}">${'<span class="slat"></span>'.repeat(SLATS)}</div>`;
  intro.innerHTML =
    `<div class="intro-black">${slats("blinds-black")}<div class="intro-logo"><img src="assets/img/offhours-wordmark-white.svg" alt=""></div>` +
    `<p class="intro-foot intro-foot-black">Based in Seoul, South Korea<br>&copy; Hayoon Park ${window.COPYRIGHT_YEARS || 2026}</p></div>` +
    slats("blinds-white") +
    `<p class="intro-foot intro-foot-white">move to enter</p>`;
  document.body.prepend(intro);
  root.classList.add("intro-active");

  let stage = 0, busy = false, travel = 0, last = null;
  // White screen advances on its own after IDLE ms without a deliberate input
  const idleTimer = setTimeout(advance, IDLE);

  function open(blinds, done) {
    busy = true;
    const items = blinds.querySelectorAll(".slat");
    items.forEach((s, i) => { const d = reduced ? 0 : i * STAGGER; s.style.transitionDelay = `${d}ms, ${d + (reduced ? 0 : 580)}ms`; });
    blinds.classList.add("open");
    const total = reduced ? 300 : TURN + STAGGER * (SLATS - 1);
    setTimeout(() => { done(); setTimeout(() => { busy = false; travel = 0; last = null; }, SETTLE); }, total);
  }

  function advance() {
    if (busy) return;
    if (stage === 0) {
      stage = 1;
      clearTimeout(idleTimer);
      intro.querySelector(".intro-foot-white").classList.add("out");
      open(intro.querySelector(".blinds-white"), () => {});
    } else if (stage === 1) {
      stage = 2;
      intro.querySelector(".intro-logo").classList.add("out");
      intro.querySelector(".intro-foot-black").classList.add("out");
      open(intro.querySelector(".blinds-black"), finish);
    }
  }

  function finish() {
    intro.remove();
    root.classList.remove("intro-active");
    ["mousemove", "wheel", "mousedown", "keydown", "touchstart"].forEach((e) => window.removeEventListener(e, onInput));
  }

  function onInput(e) {
    if (e.type === "mousemove") {
      if (last) travel += Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      if (travel < THRESHOLD) return;
    }
    if (e.type === "wheel" || e.type === "keydown") e.preventDefault();
    advance();
  }
  window.addEventListener("mousemove", onInput, { passive: true });
  window.addEventListener("wheel", onInput, { passive: false });
  window.addEventListener("mousedown", onInput);
  window.addEventListener("keydown", onInput);
  window.addEventListener("touchstart", onInput, { passive: true });
})();
