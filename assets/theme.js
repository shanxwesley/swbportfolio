/* Shan Wesley Bachain: light/dark theme.
 * Dark is the default. A visitor's choice is saved and applied before first paint.
 * Loaded synchronously in <head> so there is no flash. No inline scripts: the CSP is script-src 'self'.
 */
(function () {
  "use strict";

  var KEY = "swb-theme";
  var root = document.documentElement;
  var COLORS = { light: "#f4e2a1", dark: "#26356a" };
  var MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  var SUN =
    '<circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';

  // Tells the stylesheet that JavaScript is running, so scroll reveals can hide items until they enter.
  root.classList.add("js");

  function readSaved() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null; // storage blocked (private mode, file://, etc.)
    }
  }

  function save(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
  }

  function effective() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  // Apply a saved choice immediately (this script runs before the body is parsed).
  var saved = readSaved();
  root.setAttribute("data-theme", saved || "dark");

  function syncUi() {
    var theme = effective();
    var next = theme === "dark" ? "light" : "dark";

    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute("content", COLORS[theme]);

    var btn = document.getElementById("themeBtn");
    if (!btn) return;
    btn.setAttribute("aria-label", "Switch to " + next + " theme");
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");

    var label = document.getElementById("themeLabel");
    if (label) label.textContent = next === "dark" ? "Dark" : "Light";

    var icon = document.getElementById("themeIcon");
    if (icon) icon.innerHTML = theme === "dark" ? SUN : MOON;
  }

  function toggle() {
    var next = effective() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    save(next);
    syncUi();
  }

  function init() {
    var btn = document.getElementById("themeBtn");
    if (btn) btn.addEventListener("click", toggle);
    syncUi();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
