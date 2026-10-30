/* Shan Wesley Bachain, portfolio behavior: footer year and the "Ask my AI" chat.
 * No inline scripts (CSP is script-src 'self'), no third-party code.
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

  var dialog = document.getElementById("chat");
  var body = document.getElementById("chatBody");
  var thread = document.getElementById("thread");
  var empty = document.getElementById("chatEmpty");
  var chips = document.getElementById("chips");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var sendBtn = document.getElementById("chatSend");
  var clearBtn = document.getElementById("chatClear");
  var closeBtn = document.getElementById("chatClose");
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
    var blocks = String(text).split(/\n\s*\n/);
    return blocks
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
    body.scrollTop = body.scrollHeight;
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
      '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
      "<span>Typing...</span>";
    thread.appendChild(el);
    return el;
  }

  function updateChrome() {
    var hasMessages = thread.children.length > 0;
    empty.hidden = hasMessages;
    clearBtn.hidden = !hasMessages;
  }

  function renderChips() {
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

  /* ---------- Dialog ---------- */

  function openChat() {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    setTimeout(function () {
      if (input) input.focus();
    }, 50);
  }

  function closeChat() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  /* ---------- Sending ---------- */

  async function ask(rawText) {
    var text = String(rawText || "").trim().slice(0, MAX_INPUT);
    if (!text || busy) return;

    busy = true;
    sendBtn.disabled = true;

    addUserMessage(text);
    history.push({ role: "user", content: text });
    history = history.slice(-MAX_HISTORY);
    updateChrome();
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
        // Drop the unanswered question from history so a retry sends a clean state.
        history.pop();
        addError(
          data.error || "The assistant is unavailable right now. Please try again, or email Shan directly."
        );
      }
    } catch (err) {
      waiting.remove();
      history.pop();
      addError("Network problem. Check your connection and try again.");
    } finally {
      busy = false;
      sendBtn.disabled = false;
      updateChrome();
      scrollToEnd();
      if (input) input.focus();
    }
  }

  /* ---------- Input handling ---------- */

  function autoGrow() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

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

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      history = [];
      thread.innerHTML = "";
      updateChrome();
      if (input) input.focus();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeChat);
  }

  // Click on the dark backdrop closes the dialog (the dialog box itself is the click target only on its edges).
  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeChat();
    });
  }

  // Delegated handlers: "Ask my AI" buttons and "Ask the AI about this project" buttons.
  document.addEventListener("click", function (e) {
    var openEl = e.target.closest ? e.target.closest("[data-open-chat]") : null;
    if (openEl) {
      e.preventDefault();
      openChat();
      return;
    }
    var askEl = e.target.closest ? e.target.closest("[data-ask]") : null;
    if (askEl) {
      e.preventDefault();
      openChat();
      ask(askEl.getAttribute("data-ask"));
    }
  });

  renderChips();
  updateChrome();
})();
