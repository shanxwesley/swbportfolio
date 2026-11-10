/* Shan Wesley Bachain: subtle scroll reveals.
 * Elements marked .reveal fade in and rise a few pixels as they enter the scrolling
 * panel. Works with the tabs: items in a hidden panel animate when that panel is shown.
 * Without JavaScript (or without IntersectionObserver) everything stays visible.
 * No inline scripts: the CSP is script-src 'self'.
 */
(function () {
  "use strict";

  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!items.length) return;
  if (reduce || !("IntersectionObserver" in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add("is-in");
    return;
  }

  var root = document.getElementById("pfScroll");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { root: root, threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  for (var j = 0; j < items.length; j++) io.observe(items[j]);
})();
