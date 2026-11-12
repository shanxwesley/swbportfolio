/* Shan Wesley Bachain: ladybug guide.
 * A small ladybug crawls down the right edge as you scroll. When you pause it wakes up:
 * it scuttles out sideways, flutters, hops, wiggles the tab it wants you to try next, and
 * pops up a hint. It favors tabs you have not opened yet. Click it to scroll further or to
 * jump to the suggested tab. No inline scripts: the CSP is script-src 'self'.
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

  var TAB_HINTS = {
    home: "Back to the start \u2192",
    projects: "See what I\u2019ve built \u2192",
    thesis: "Peek at my thesis \u2192",
    skills: "Check out my skills \u2192",
    about: "Get to know me \u2192",
    contact: "Say hi! Contact \u2192"
  };
  var SCROLL_TOP_HINTS = ["Scroll down, there\u2019s more to read!", "Psst\u2026 more below \u2193"];
  var SCROLL_MID_HINTS = ["Keep going \u2193 it gets good!", "Don\u2019t stop now, read more \u2193"];

  var visited = {};
  var hint = { kind: "scroll", panel: null };
  var lastTop = pf.scrollTop;
  var ticking = false;
  var idleCount = 0;
  var dirBeforeWander = "down";
  var walkTimer, tipTimer, idleTimer, flutterTimer, nudgeTimer, wanderTimers = [];

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

  // The tab to push next: prefer one the visitor has not opened, starting after the current tab.
  function suggestPanel() {
    var cur = currentPanel();
    var i = PANELS.indexOf(cur);
    var order = PANELS.slice(i + 1).concat(PANELS.slice(0, Math.max(i, 0)));
    for (var k = 0; k < order.length; k++) {
      if (!visited[order[k]] && order[k] !== "home") return order[k];
    }
    return i === -1 || i >= PANELS.length - 1 ? null : PANELS[i + 1];
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // What the bug is suggesting right now. preferTab makes idle hints point at a tab.
  function message(preferTab) {
    var scrollable = canScroll() && !atBottom();
    var s = suggestPanel();
    if (!scrollable || (preferTab && s)) {
      if (s) {
        hint = { kind: "tab", panel: s };
        return TAB_HINTS[s];
      }
      hint = { kind: "top", panel: null };
      return "Back to top \u2191";
    }
    hint = { kind: "scroll", panel: null };
    return pf.scrollTop < 40 ? pick(SCROLL_TOP_HINTS) : pick(SCROLL_MID_HINTS);
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
    if (!wandering && Math.abs(pf.scrollTop - lastTop) > 1) bug.setAttribute("data-dir", dir);
    lastTop = pf.scrollTop;
    if (!bug.classList.contains("show-tip")) setTip(message(false));
  }

  var wandering = false;

  function stopWander() {
    wandering = false;
    wanderTimers.forEach(clearTimeout);
    wanderTimers = [];
    bug.style.setProperty("--lbug-x", "0px");
    bug.classList.remove("is-wander");
    if (bug.getAttribute("data-dir") === "left" || bug.getAttribute("data-dir") === "right") {
      bug.setAttribute("data-dir", dirBeforeWander);
    }
  }

  function clearNudge() {
    clearTimeout(nudgeTimer);
    var n = document.querySelectorAll(".nav-item.lbug-nudge");
    for (var i = 0; i < n.length; i++) n[i].classList.remove("lbug-nudge");
  }

  function nudgeTab(panel) {
    clearNudge();
    if (!panel || reduce) return;
    var btn = document.querySelector('.nav-item[data-view="portfolio"][data-panel="' + panel + '"]');
    if (!btn) return;
    btn.classList.add("lbug-nudge");
    nudgeTimer = setTimeout(clearNudge, 3200);
  }

  function showHint() {
    idleCount++;
    // Alternate: keep reading, then try a tab. The first hint on a short page is always a tab.
    setTip(message(idleCount % 2 === 0 || !canScroll()));
    bug.classList.add("show-tip");
    if (hint.kind === "tab") nudgeTab(hint.panel);
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
    }, 4800);
  }

  // The bug scuttles sideways out into the page and back, then speaks up.
  function wander() {
    if (reduce) {
      showHint();
      return;
    }
    wandering = true;
    dirBeforeWander = bug.getAttribute("data-dir") === "up" ? "up" : "down";
    bug.classList.remove("show-tip");
    bug.classList.add("is-wander", "is-walking");
    bug.setAttribute("data-dir", "left");
    bug.style.setProperty("--lbug-x", "-54px");
    wanderTimers.push(
      setTimeout(function () {
        bug.setAttribute("data-dir", "right");
        bug.style.setProperty("--lbug-x", "0px");
      }, 1350),
      setTimeout(function () {
        bug.classList.remove("is-walking");
        stopWander();
        showHint();
      }, 2700)
    );
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(place);
    }
    if (wandering) stopWander();
    bug.classList.remove("show-tip");
    clearNudge();
    if (!reduce) {
      bug.classList.add("is-walking");
      clearTimeout(walkTimer);
      walkTimer = setTimeout(function () {
        bug.classList.remove("is-walking");
      }, 260);
    }
    idleCount = 0;
    armIdle(2600);
  }

  // After a pause, wake up and urge the visitor on; repeat a few times, gently.
  var repeats = 0;
  function armIdle(delay) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (viewPortfolio.hidden) return;
      wander();
      if (++repeats < 6) armIdle(9000);
    }, delay || 2600);
  }

  bug.addEventListener("click", function () {
    var h = hint;
    stopWander();
    clearNudge();
    bug.classList.remove("show-tip");
    bug.classList.add("is-flutter");
    clearTimeout(flutterTimer);
    flutterTimer = setTimeout(function () {
      bug.classList.remove("is-flutter");
    }, 600);
    repeats = 0;
    if (h.kind === "tab" && h.panel) {
      var btn = document.querySelector('.nav-item[data-view="portfolio"][data-panel="' + h.panel + '"]');
      if (btn) btn.click();
      return;
    }
    if (h.kind === "scroll" && canScroll() && !atBottom()) {
      pf.scrollBy({ top: Math.round(pf.clientHeight * 0.8), behavior: reduce ? "auto" : "smooth" });
      return;
    }
    var s = suggestPanel();
    if (s) {
      var b2 = document.querySelector('.nav-item[data-view="portfolio"][data-panel="' + s + '"]');
      if (b2) b2.click();
    } else {
      pf.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  });

  // Hide in the chat view; re-measure when tabs change
  function sync() {
    bug.hidden = viewPortfolio.hidden;
    if (!bug.hidden) {
      visited[currentPanel()] = true;
      lastTop = pf.scrollTop;
      stopWander();
      clearNudge();
      bug.classList.remove("show-tip");
      bug.setAttribute("data-dir", "down");
      idleCount = 0;
      repeats = 0;
      place();
      armIdle(2200);
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
