/* Shan Wesley Bachain, theme toggle.
 * Loaded synchronously in <head> so the saved theme is applied before first paint.
 * Follows the system setting until the visitor clicks the toggle, then remembers the choice.
 */
(function () {
  "use strict";

  var KEY = "theme";
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function readStored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* storage blocked: the toggle still works for this page view */
    }
  }

  function isDark() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr === "dark";
    return !!(mq && mq.matches);
  }

  function syncUi() {
    var dark = isDark();

    var btn = document.getElementById("themeBtn");
    if (btn) {
      btn.textContent = dark ? "Light" : "Dark";
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }

    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].removeAttribute("media");
      metas[i].setAttribute("content", dark ? "#14181e" : "#f8fbff");
    }
  }

  function applyTheme(value) {
    if (value) {
      root.setAttribute("data-theme", value);
    } else {
      root.removeAttribute("data-theme");
    }
    syncUi();
  }

  // Apply saved choice immediately (before paint).
  applyTheme(readStored());

  // Follow system changes only when the visitor has not chosen a theme.
  if (mq) {
    var onSystemChange = function () {
      if (!readStored()) syncUi();
    };
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }

  // Delegated click handler, so it works no matter when the button is rendered.
  document.addEventListener("click", function (e) {
    var target = e.target && e.target.closest ? e.target.closest("#themeBtn") : null;
    if (!target) return;
    var next = isDark() ? "light" : "dark";
    saveChoice(next);
    applyTheme(next);
  });

  document.addEventListener("DOMContentLoaded", syncUi);
})();
