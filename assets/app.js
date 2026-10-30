/* Shan Wesley Bachain: chat-first app shell, portfolio view, and AI chat.
 * No inline scripts (CSP is script-src 'self').
 */
(function () {
  "use strict";

  var API_URL = "/api/chat";
  var MAX_HISTORY = 10;
  var MAX_INPUT = 800;

  var SUGGESTIONS = [
    "What projects has Shan built?",
    "What was his role in the thesis?",
    "Is he open to internships?",
    "What are his main technical skills?"
  ];

  var chatView = document.getElementById("viewChat");
  var portfolioView = document.getElementById("viewPortfolio");
  var scroller = document.getElementById("chatScroll");
  var welcome = document.getElementById("welcome");
  var thread = document.getElementById("thread");
  var chips = document.getElementById("chips");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var sendBtn = document.getElementById("chatSend");
  var yearEl = document.getElementById("year");

  var history = [];
  var busy = false;

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Rendering helpers ---------- */

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Escape first, then add only the formatting we allow.
  function formatInline(raw) {
    var out = escapeHtml(raw);
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(
      /(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    out = out.replace(
      /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
      '<a href="mailto:$1">$1</a>'
    );
    return out;
  }

  function formatBotReply(text) {
    return String(text)
      .split(/\n\s*\n/)
      .map(function (block) {
        var lines = block.split("\n").filter(function (l) {
          return l.trim() !== "";
        });
        if (!lines.length) return "";

        var isList = lines.every(function (l) {
          return /^\s*[-*]\s+/.test(l);
        });
        if (isList) {
          return (
            "<ul>" +
            lines
              .map(function (l) {
                return "<li>" + formatInline(l.replace(/^\s*[-*]\s+/, "")) + "</li>";
              })
              .join("") +
            "</ul>"
          );
        }
        return (
          "<p>" +
          lines
            .map(function (l) {
              return formatInline(l.trim());
            })
            .join("<br>") +
          "</p>"
        );
      })
      .join("");
  }

  function scrollToEnd() {
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }

  function addUserMessage(text) {
    var el = document.createElement("div");
    el.className = "msg-user";
    el.textContent = text;
    thread.appendChild(el);
  }

  function addBotMessage(text) {
    var el = document.createElement("div");
    el.className = "msg-bot";
    el.innerHTML = formatBotReply(text);
    thread.appendChild(el);
  }

  function addError(text) {
    var el = document.createElement("div");
    el.className = "msg-error";
    el.setAttribute("role", "alert");
    el.textContent = text;
    thread.appendChild(el);
  }

  function showWaiting() {
    var el = document.createElement("div");
    el.className = "msg-wait";
    el.innerHTML =
      '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Thinking</span>';
    thread.appendChild(el);
    return el;
  }

  function updateWelcome() {
    var hasMessages = thread.children.length > 0;
    if (welcome) welcome.hidden = hasMessages;
  }

  function renderChips() {
    if (!chips) return;
    chips.innerHTML = "";
    SUGGESTIONS.forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = q;
      b.addEventListener("click", function () {
        ask(q);
      });
      chips.appendChild(b);
    });
  }

  /* ---------- View switching ---------- */

  function setActiveNav(view, target) {
    document.querySelectorAll(".side-btn[data-view]").forEach(function (btn) {
      var isActive;
      if (view === "chat") {
        isActive = btn.getAttribute("data-view") === "chat";
      } else {
        // Highlight the portfolio entry, and the specific section entry when one is targeted.
        isActive = btn.getAttribute("data-view") === "portfolio" &&
          (!target ? btn.classList.contains("side-btn") && !btn.classList.contains("side-sub") : btn.getAttribute("data-target") === target);
      }
      btn.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function showView(view, target) {
    var toChat = view === "chat";
    chatView.hidden = !toChat;
    portfolioView.hidden = toChat;
    setActiveNav(view, target);

    if (toChat) {
      if (input) setTimeout(function () { input.focus(); }, 30);
    } else {
      var scrollTarget = target ? document.getElementById(target) : null;
      portfolioView.scrollTop = 0;
      if (scrollTarget) {
        scrollTarget.scrollIntoView({ block: "start" });
      }
    }
  }

  /* ---------- Sending ---------- */

  async function ask(rawText) {
    var text = String(rawText || "").trim().slice(0, MAX_INPUT);
    if (!text || busy) return;

    showView("chat");

    busy = true;
    sendBtn.disabled = true;

    addUserMessage(text);
    history.push({ role: "user", content: text });
    history = history.slice(-MAX_HISTORY);
    updateWelcome();
    scrollToEnd();

    var waiting = showWaiting();
    scrollToEnd();

    try {
      var res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });

      var data = {};
      try {
        data = await res.json();
      } catch (e) {
        data = {};
      }

      waiting.remove();

      if (res.ok && data.reply) {
        addBotMessage(data.reply);
        history.push({ role: "assistant", content: data.reply });
        history = history.slice(-MAX_HISTORY);
      } else {
        history.pop();
        addError(data.error || "The assistant is unavailable right now. Please try again, or email Shan directly.");
      }
    } catch (err) {
      waiting.remove();
      history.pop();
      addError("Network problem. Check your connection and try again.");
    } finally {
      busy = false;
      sendBtn.disabled = false;
      scrollToEnd();
      if (input) input.focus();
    }
  }

  function autoGrow() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 160) + "px";
  }

  /* ---------- Input and controls ---------- */

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      var value = input.value;
      input.value = "";
      autoGrow();
      ask(value);
    });
  }

  if (input) {
    input.addEventListener("input", autoGrow);
    input.addEventListener("keydown", function (e) {
      // Enter sends, Shift+Enter adds a new line.
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        if (form.requestSubmit) form.requestSubmit();
        else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    });
  }

  // Delegated handlers for navigation, new chat, and "Ask" buttons.
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var newChat = t.closest("[data-new-chat]");
    if (newChat) {
      e.preventDefault();
      if (busy) return;
      history = [];
      thread.innerHTML = "";
      updateWelcome();
      showView("chat");
      return;
    }

    var askEl = t.closest("[data-ask]");
    if (askEl) {
      e.preventDefault();
      ask(askEl.getAttribute("data-ask"));
      return;
    }

    var navEl = t.closest("[data-view]");
    if (navEl) {
      e.preventDefault();
      showView(navEl.getAttribute("data-view"), navEl.getAttribute("data-target"));
    }
  });

  renderChips();
  updateWelcome();
  showView("chat");
})();
