/* Shan Wesley Bachain: ladybug guide.
 * A small ladybug crawls down the right edge as you scroll, flutters its wings, and
 * pops up a hint after a pause. Click it to scroll further, or to jump to the next tab
 * once you reach the bottom. No inline scripts: the CSP is script-src 'self'.
 */
(function () {
  "use strict";

  var pf = document.getElementById("pfScroll");
  var viewPortfolio = document.getElementById("viewPortfolio");
  if (!pf || !viewPortfolio) return;

  var PANELS = ["home", "projects", "thesis", "skills", "about", "contact"];
  var LABELS = { home: "Home", projects: "Projects", thesis: "Thesis", skills: "Skills", about: "About", contact: "Contact" };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var svg =
    '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<g class="lbug-ant" stroke="#1d2547" stroke-width="1.6" stroke-linecap="round" fill="none">' +
    '<path d="M20 9 Q17 4 13 4"/><path d="M28 9 Q31 4 35 4"/></g>' +
    '<g stroke="#1d2547" stroke-width="2" stroke-linecap="round" fill="none">' +
    '<path class="lbug-leg lbug-leg-a" d="M11 22 L5 19"/><path class="lbug-leg lbug-leg-b" d="M10 29 L4 30"/><path class="lbug-leg lbug-leg-a" d="M12 36 L6 41"/>' +
    '<path class="lbug-leg lbug-leg-b" d="M37 22 L43 19"/><path class="lbug-leg lbug-leg-a" d="M38 29 L44 30"/><path class="lbug-leg lbug-leg-b" d="M36 36 L42 41"/></g>' +
    '<ellipse cx="24" cy="12" rx="8" ry="6.5" fill="#1d2547"/>' +
    '<circle cx="21" cy="11" r="1.7" fill="#fff"/><circle cx="27" cy="11" r="1.7" fill="#fff"/>' +
    '<circle cx="21.3" cy="11.2" r=".8" fill="#1d2547"/><circle cx="27.3" cy="11.2" r=".8" fill="#1d2547"/>' +
    '<path class="lbug-wing lbug-wing-l" d="M24 16 C12 16 8 26 9 34 C10 42 18 45 24 45 Z" fill="#e5484d"/>' +
    '<path class="lbug-wing lbug-wing-r" d="M24 16 C36 16 40 26 39 34 C38 42 30 45 24 45 Z" fill="#e5484d"/>' +
    '<path d="M24 16 L24 45" stroke="#1d2547" stroke-width="1.6"/>' +
    '<circle cx="16" cy="26" r="3" fill="#1d2547"/><circle cx="32" cy="26" r="3" fill="#1d2547"/>' +
    '<circle cx="15" cy="37" r="2.4" fill="#1d2547"/><circle cx="33" cy="37" r="2.4" fill="#1d2547"/>' +
    '<ellipse cx="18" cy="21" rx="3" ry="1.6" fill="#fff" opacity=".35"/>' +
    "</svg>";

  var bug = document.createElement("button");
  bug.type = "button";
  bug.className = "lbug";
  bug.setAttribute("data-dir", "down");
  bug.innerHTML = svg + '<span class="lbug-tip" id="lbugTip"></span>';
  document.body.appendChild(bug);
  var tip = bug.querySelector(".lbug-tip");

  var lastTop = pf.scrollTop;
  var ticking = false;
  var walkTimer, tipTimer, idleTimer, flutterTimer;

  function currentPanel() {
    var cur = document.querySelector('.nav-item[aria-current="true"][data-panel]');
    return cur ? cur.getAttribute("data-panel") : "home";
  }

  function atBottom() {
    return pf.scrollHeight - pf.clientHeight - pf.scrollTop < 24;
  }

  function canScroll() {
    return pf.scrollHeight - pf.clientHeight > 40;
  }

  function nextPanel() {
    var i = PANELS.indexOf(currentPanel());
    return i === -1 || i >= PANELS.length - 1 ? null : PANELS[i + 1];
  }

  // What the bug is suggesting right now
  function message() {
    if (!canScroll() || atBottom()) {
      var n = nextPanel();
      return n ? "Next: " + LABELS[n] + " \u2192" : "Back to top \u2191";
    }
    return pf.scrollTop < 40 ? "Scroll down, there\u2019s more!" : "Keep going \u2193";
  }

  function setTip(text) {
    tip.textContent = text;
    bug.setAttribute("aria-label", text);
  }

  function place() {
    ticking = false;
    var r = pf.getBoundingClientRect();
    var range = pf.scrollHeight - pf.clientHeight;
    var progress = range > 0 ? Math.min(1, Math.max(0, pf.scrollTop / range)) : 0;
    var size = bug.offsetHeight || 44;
    var top = r.top + 12 + progress * Math.max(0, r.height - size - 24);
    bug.style.top = Math.round(top) + "px";

    var dir = pf.scrollTop >= lastTop ? "down" : "up";
    if (Math.abs(pf.scrollTop - lastTop) > 1) bug.setAttribute("data-dir", dir);
    lastTop = pf.scrollTop;
    setTip(message());
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(place);
    }
    bug.classList.remove("show-tip");
    if (!reduce) {
      bug.classList.add("is-walking");
      clearTimeout(walkTimer);
      walkTimer = setTimeout(function () {
        bug.classList.remove("is-walking");
      }, 260);
    }
    armIdle();
  }

  // After a pause, flutter and show a hint
  function armIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (viewPortfolio.hidden) return;
      setTip(message());
      bug.classList.add("show-tip");
      if (!reduce) {
        bug.classList.add("is-flutter");
        clearTimeout(flutterTimer);
        flutterTimer = setTimeout(function () {
          bug.classList.remove("is-flutter");
        }, 1100);
      }
      clearTimeout(tipTimer);
      tipTimer = setTimeout(function () {
        bug.classList.remove("show-tip");
      }, 4500);
    }, 3500);
  }

  bug.addEventListener("click", function () {
    bug.classList.remove("show-tip");
    if (canScroll() && !atBottom()) {
      pf.scrollBy({ top: Math.round(pf.clientHeight * 0.8), behavior: reduce ? "auto" : "smooth" });
      return;
    }
    var n = nextPanel();
    if (n) {
      var btn = document.querySelector('.nav-item[data-view="portfolio"][data-panel="' + n + '"]');
      if (btn) btn.click();
    } else {
      pf.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  });

  // Hide in the chat view; re-measure when tabs change
  function sync() {
    bug.hidden = viewPortfolio.hidden;
    if (!bug.hidden) {
      lastTop = pf.scrollTop;
      bug.setAttribute("data-dir", "down");
      place();
      armIdle();
    }
  }

  pf.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", place);
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("[data-view]")) setTimeout(sync, 60);
  });
  window.addEventListener("popstate", function () {
    setTimeout(sync, 60);
  });
  if (window.ResizeObserver) new ResizeObserver(place).observe(pf);

  sync();
})();
