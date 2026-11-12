/* Shan Wesley Bachain: skills filter and count-up numbers.
 * Filter chips show or hide skill cards by data-cat. Numbers marked data-count
 * count up once when they scroll into view. Reduced-motion users get the final values.
 * No inline scripts: the CSP is script-src 'self'.
 */
(function () {
  "use strict";

  var grid = document.querySelector(".skill-grid");
  var bar = document.querySelector(".skill-filter");
  var countLabel = document.getElementById("skillCount");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (grid && bar) {
    var cards = grid.children;
    var chips = bar.querySelectorAll(".chip-filter");

    var apply = function (filter) {
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var match = filter === "all" || cards[i].getAttribute("data-cat") === filter;
        cards[i].hidden = !match;
        if (match) shown++;
      }
      for (var j = 0; j < chips.length; j++) {
        chips[j].setAttribute("aria-pressed", chips[j].getAttribute("data-filter") === filter ? "true" : "false");
      }
      if (countLabel) countLabel.textContent = "Showing " + shown + " of " + cards.length + " areas";
    };

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".chip-filter") : null;
      if (btn) apply(btn.getAttribute("data-filter"));
    });
    apply("all");
  }

  var counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  var animate = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 900;
    var start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = "0" + suffix;
    requestAnimationFrame(step);
  };

  if (reduce || !("IntersectionObserver" in window)) return;

  var root = document.getElementById("pfScroll");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { root: root, threshold: 0.6 });

  for (var k = 0; k < counters.length; k++) io.observe(counters[k]);
})();
