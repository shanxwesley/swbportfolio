/* Shan Wesley Bachain: portfolio panels, Claude-style chat, and recent chats.
 * No inline scripts (CSP is script-src 'self').
 */
(function () {
  "use strict";

  var API_URL = "/api/chat";
  var MAX_HISTORY = 10;
  var MAX_INPUT = 800;
  var MAX_RECENTS = 20;

  var SUGGESTIONS = [
    "Why should I hire Shan?",
    "What projects has he built?",
    "What was his role in the thesis?",
    "Is he open to internships?"
  ];

  var viewPortfolio = document.getElementById("viewPortfolio");
  var viewChat = document.getElementById("viewChat");
  var pfScroll = document.getElementById("pfScroll");
  var chatScroll = document.getElementById("chatScroll");
  var welcome = document.getElementById("welcome");
  var thread = document.getElementById("thread");
  var chips = document.getElementById("chips");
  var recentsEl = document.getElementById("recents");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var sendBtn = document.getElementById("chatSend");
  var yearEl = document.getElementById("year");

  var chats = [];          // { id, title, html, history }
  var currentId = null;
  var nextId = 1;
  var history = [];        // history for the active chat
  var busy = false;

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Formatting ---------- */

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

  /* ---------- Thread rendering ---------- */

  function scrollChatToEnd() {
    if (chatScroll) chatScroll.scrollTop = chatScroll.scrollHeight;
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

  function updateWelcome() {
    welcome.hidden = thread.children.length > 0;
  }

  /* ---------- Recent chats ---------- */

  function findChat(id) {
    for (var i = 0; i < chats.length; i++) {
      if (chats[i].id === id) return chats[i];
    }
    return null;
  }

  // Stores the visible thread and history into the active chat record.
  function saveCurrent() {
    var rec = findChat(currentId);
    if (rec) {
      rec.html = thread.innerHTML;
      rec.history = history.slice();
    }
  }

  function renderRecents() {
    recentsEl.innerHTML = "";
    if (!chats.length) {
      var none = document.createElement("p");
      none.className = "recents-empty";
      none.textContent = "No chats yet";
      recentsEl.appendChild(none);
      return;
    }
    chats.forEach(function (rec) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "recent";
      b.textContent = rec.title;
      b.title = rec.title;
      b.setAttribute("data-recent", String(rec.id));
      b.setAttribute("aria-current", rec.id === currentId ? "true" : "false");
      recentsEl.appendChild(b);
    });
  }

  function openChat(id) {
    var rec = findChat(id);
    if (!rec) return;
    saveCurrent();
    currentId = id;
    history = (rec.history || []).slice();
    thread.innerHTML = rec.html || "";
    updateWelcome();
    renderRecents();
    showView("chat");
    scrollChatToEnd();
  }

  function startNewChat() {
    if (busy) return;
    saveCurrent();
    currentId = null;
    history = [];
    thread.innerHTML = "";
    updateWelcome();
    renderRecents();
    showView("chat");
    setTimeout(function () {
      input.focus();
    }, 30);
  }

  // The first question becomes the title of the chat in Recents.
  function titleFrom(text) {
    var t = text.replace(/\s+/g, " ").trim();
    return t.length > 42 ? t.slice(0, 40).trim() + "…" : t;
  }

  /* ---------- Views and panels ---------- */

  var PANELS = ["home", "projects", "thesis", "skills", "about", "contact"];

  function setNavCurrent(view, panel) {
    document.querySelectorAll(".nav-item[data-view]").forEach(function (btn) {
      var bView = btn.getAttribute("data-view");
      var bPanel = btn.getAttribute("data-panel") || "home";
      var active =
        view === "chat"
          ? bView === "chat"
          : bView === "portfolio" && bPanel === panel;
      btn.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function showPanel(name) {
    if (PANELS.indexOf(name) === -1) name = "home";
    PANELS.forEach(function (p) {
      var el = document.getElementById(p);
      if (el) el.hidden = p !== name;
    });
    // Scroll only the panel area, never the whole page.
    pfScroll.scrollTop = 0;
  }

  function showView(view, panel) {
    var toChat = view === "chat";
    viewChat.hidden = !toChat;
    viewPortfolio.hidden = toChat;
    if (!toChat) {
      showPanel(panel || "home");
      setNavCurrent("portfolio", panel || "home");
    } else {
      setNavCurrent("chat");
      setTimeout(function () {
        input.focus();
      }, 30);
    }
  }

  /* ---------- Sending ---------- */

  async function ask(rawText) {
    var text = String(rawText || "").trim().slice(0, MAX_INPUT);
    if (!text || busy) return;

    showView("chat");

    // The first message in a new chat creates its entry in Recents.
    if (currentId === null) {
      currentId = nextId++;
      chats.unshift({ id: currentId, title: titleFrom(text), html: "", history: [] });
      if (chats.length > MAX_RECENTS) chats.length = MAX_RECENTS;
      renderRecents();
    }

    busy = true;
    sendBtn.disabled = true;

    addUserMessage(text);
    history.push({ role: "user", content: text });
    history = history.slice(-MAX_HISTORY);
    updateWelcome();
    scrollChatToEnd();

    var waiting = showWaiting();
    scrollChatToEnd();

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
      saveCurrent();
      scrollChatToEnd();
      input.focus();
    }
  }

  function autoGrow() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 180) + "px";
  }

  /* ---------- Events ---------- */

  var heroForm = document.getElementById("heroAsk");
  var heroInput = document.getElementById("heroInput");
  if (heroForm && heroInput) {
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = heroInput.value;
      heroInput.value = "";
      ask(v);
    });
    heroInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        heroForm.requestSubmit ? heroForm.requestSubmit() : heroForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) return;
    var value = input.value;
    input.value = "";
    autoGrow();
    ask(value);
  });

  input.addEventListener("input", autoGrow);
  input.addEventListener("keydown", function (e) {
    // Enter sends, Shift+Enter adds a new line.
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  });

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    if (t.closest("[data-new-chat]")) {
      e.preventDefault();
      startNewChat();
      return;
    }

    var recent = t.closest("[data-recent]");
    if (recent) {
      e.preventDefault();
      if (!busy) openChat(Number(recent.getAttribute("data-recent")));
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
      showView(navEl.getAttribute("data-view"), navEl.getAttribute("data-panel"));
      return;
    }
  });

  renderChips();
  renderRecents();
  updateWelcome();
  showView("portfolio", "home");
})();
