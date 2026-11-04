/* Shan Wesley Bachain: portfolio panels, Claude-style chat, and recent chats.
 * No inline scripts (CSP is script-src 'self'). All paths are relative so the
 * site works from a domain root, a subfolder, or opened straight from disk.
 */
(function () {
  "use strict";

  var API_URL = "api/chat";
  var REQUEST_TIMEOUT_MS = 25000;
  var MAX_HISTORY = 10;
  var MAX_INPUT = 800;
  var MAX_RECENTS = 20;
  var SITE = "Shan Wesley Bachain";

  var SUGGESTIONS = [
    "Why should I hire Shan?",
    "What projects has he built?",
    "What was his role in the thesis?",
    "Is he open to internships?"
  ];

  var PANELS = ["home", "projects", "thesis", "skills", "about", "contact"];
  var PANEL_TITLES = {
    home: "Home",
    projects: "Projects",
    thesis: "Thesis",
    skills: "Skills",
    about: "About & education",
    contact: "Contact"
  };

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

  var chats = []; // { id, title, html, history }
  var currentId = null;
  var nextId = 1;
  var history = []; // history for the active chat
  var busy = false;

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Formatting ---------- */

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Escape first, then add only the formatting we allow (bold, links, emails).
  // URLs and emails are matched in one pass so an email is never re-linked inside a URL.
  function formatInline(raw) {
    var out = escapeHtml(raw).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return out.replace(
      /(https?:\/\/[^\s<]+[^\s<.,;:!?)])|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
      function (m, url, email) {
        if (url) return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + "</a>";
        return '<a href="mailto:' + email + '">' + email + "</a>";
      }
    );
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

  /* ---------- Offline fallback ----------
   * Used when the live AI endpoint is unreachable (not deployed with an API key,
   * opened from disk, network down). Answers come from the same public facts as
   * the site, and the reply is clearly labelled so nobody mistakes it for the AI.
   */
  var KB = [
    {
      re: /job\s*interview|interviewpro|system[- ]making|contest/i,
      a: "**JobInterviewPro** is an AI-assisted interview practice platform. Shan was the backend developer, working with the Groq API, Firebase, and MySQL. It won the **2025 System-Making Contest**.\n\nLive demo: https://interviewprox.rf.gd/job-interview/public/"
    },
    {
      re: /devkit|dev\s*kit/i,
      a: "**DevKit** is an AI-powered toolkit for students and developers. It formats JSON, edits Markdown, generates READMEs, and explains errors.\n\nLive: https://devkit-five-livid.vercel.app/"
    },
    {
      re: /aether/i,
      a: "**Aether** is an interactive web experience where the visitor's words become memory and reshape a responsive field.\n\nLive: https://aether-nine-dun.vercel.app/"
    },
    {
      re: /thesis|eco[- ]?smart|rainergy|rainwater|esp32|filtrat/i,
      a: "The thesis is **Eco-Smart Station (RainErgy)**, built by a team of five, with Shan as a co-author. It is an ESP32-based rainwater harvesting station with multi-stage filtration, hybrid solar and microturbine power, and coin-operated water and device charging.\n\nShan developed the automatic chlorine doser as a local app that reads input from the water level sensor. The thesis followed the ADDIE model, from analysis through evaluation. For more on the team split, email bachainshanwesleyb@gmail.com."
    },
    {
      re: /hire|hiring|convince|recruit|candidate|why\s+(should|choose|pick)|worth/i,
      a: "Shan is a fourth-year Computer Engineering student who ships real work. He was the backend developer on **JobInterviewPro**, winner of the 2025 System-Making Contest, and he developed the automatic chlorine doser app for his ESP32 thesis.\n\nHe is a Top Performing Student in the College of Engineering, a SM Foundation Scholar, and a former valedictorian. Teammates and panelists would describe him as a clear communicator who takes ownership.\n\nResume and contact details are on the Contact tab: bachainshanwesleyb@gmail.com"
    },
    {
      re: /intern|available|availab|open\s+to|freelance|collab|job|opportunit|work\s+for|when\s+can/i,
      a: "Yes. Shan is **open to internships, collaborations, and freelance work**, and graduates in 2027. He is looking for roles in software development, AI applications, or embedded systems.\n\nEmail: bachainshanwesleyb@gmail.com"
    },
    {
      re: /\b(skills?|tech|technologies|stack|languages?|python|php|javascript|databases?|tools?|good at|programming|expertise)\b/i,
      a: "Shan works across web, data, hardware, and AI:\n\n- **Programming and web:** Python, PHP, JavaScript, HTML, CSS\n- **Databases:** MySQL, NoSQL, Firebase\n- **Hardware:** Arduino, ESP32, sensors, IoT\n- **AI and tools:** Groq API, AI prompting, GitHub, VS Code, Vercel"
    },
    {
      re: /educat|school|universit|college|study|studying|course|degree|graduat|valedict|year level|campus/i,
      a: "Shan is a fourth-year **B.S. Computer Engineering** student at the University of Rizal System, Antipolo Campus (2023 to 2027), and a Top Performing Student in the College of Engineering.\n\nHe was Senior High STEM valedictorian (With Highest Honors) at Sumulong College of Arts and Sciences, and Junior High valedictorian (With Honors) at Carlos \"Botong\" Francisco Memorial National High School."
    },
    {
      re: /\b(awards?|achievements?|honou?rs?|scholar(ship)?|winner|won|win|quiz|recognition)\b/i,
      a: "- **Winner**, 2025 System-Making Contest (JobInterviewPro)\n- **SM Foundation Scholar**, 2023 to 2027\n- **Top Performing Student**, College of Engineering, URS\n- Third Place, Provincial Statistics Quiz Bee, 2023\n- BRITE Program Research Seminar, URS, 2025"
    },
    {
      re: /contact|email|e-mail|mail|phone|number|call|reach|github|linkedin|message/i,
      a: "You can reach Shan at **bachainshanwesleyb@gmail.com** or 0976 265 2310. His GitHub is https://github.com/shanxwesley. He usually replies within a day."
    },
    {
      re: /resume|cv|curriculum/i,
      a: "His one-page resume is on the Contact tab, and you can download it from the Home tab too. It covers his education, projects, skills, and honors."
    },
    {
      re: /\b(projects?|built|build|made|portfolio|work|apps?|applications?)\b/i,
      a: "Shan has built four projects:\n\n- **JobInterviewPro:** AI interview practice platform, winner of the 2025 System-Making Contest\n- **Eco-Smart Station (RainErgy):** ESP32 rainwater harvesting thesis\n- **DevKit:** AI-powered toolkit for developers and students\n- **Aether:** interactive web experience\n\nSee the Projects tab for live demos."
    },
    {
      re: /\b(where|location|based|angono|rizal|philippines|age|old|birthday)\b/i,
      a: "Shan is based in Angono, Rizal, Philippines, and is a fourth-year Computer Engineering student graduating in 2027."
    },
    {
      re: /^\s*(hi|hello|hey|good\s+(morning|afternoon|evening)|yo)\b/i,
      a: "Hello! I can tell you about Shan's projects, skills, education, thesis, or availability. What would you like to know?"
    }
  ];

  function localAnswer(question) {
    for (var i = 0; i < KB.length; i++) {
      if (KB[i].re.test(question)) return KB[i].a;
    }
    return "I can answer questions about Shan's projects, skills, education, thesis, and availability. Try one of the suggested questions, or email him at bachainshanwesleyb@gmail.com.";
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

  function addBotMessage(text, note) {
    var el = document.createElement("div");
    el.className = "msg-bot";
    el.innerHTML = formatBotReply(text);
    if (note) {
      var n = document.createElement("p");
      n.className = "msg-note";
      n.textContent = note;
      el.appendChild(n);
    }
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
    el.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Thinking</span>';
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
    go("chat");
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
    go("chat");
    setTimeout(function () {
      input.focus();
    }, 30);
  }

  // The first question becomes the title of the chat in Recents.
  function titleFrom(text) {
    var t = text.replace(/\s+/g, " ").trim();
    return t.length > 42 ? t.slice(0, 40).trim() + "…" : t;
  }

  /* ---------- Views, panels, and URL hash ---------- */

  function setNavCurrent(view, panel) {
    var items = document.querySelectorAll(".nav-item[data-view]");
    for (var i = 0; i < items.length; i++) {
      var btn = items[i];
      var active = view === "portfolio" && (btn.getAttribute("data-panel") || "home") === panel;
      btn.setAttribute("aria-current", active ? "true" : "false");
      // On mobile the nav is a scrolling row: keep the active tab visible.
      if (active && btn.scrollIntoView) btn.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function showPanel(name) {
    if (PANELS.indexOf(name) === -1) name = "home";
    PANELS.forEach(function (p) {
      var el = document.getElementById(p);
      if (el) el.hidden = p !== name;
    });
    // Scroll only the panel area, never the whole page.
    pfScroll.scrollTop = 0;
    return name;
  }

  function showView(view, panel) {
    var toChat = view === "chat";
    viewChat.hidden = !toChat;
    viewPortfolio.hidden = toChat;
    if (toChat) {
      setNavCurrent("chat");
      document.title = "Ask my AI | " + SITE;
    } else {
      var name = showPanel(panel || "home");
      setNavCurrent("portfolio", name);
      document.title = (name === "home" ? SITE : PANEL_TITLES[name] + " | " + SITE);
    }
  }

  // Navigate and record it in the browser history so Back/Forward and #links work.
  function go(view, panel) {
    showView(view, panel);
    var name = view === "chat" ? "chat" : PANELS.indexOf(panel) === -1 ? "home" : panel;
    if (location.hash !== "#" + name) {
      try {
        // window.history explicitly: the local `history` variable is the chat history.
        window.history.pushState(null, "", "#" + name);
      } catch (e) {}
    }
    if (view === "chat") {
      setTimeout(function () {
        input.focus();
      }, 30);
    }
  }

  function routeFromHash() {
    var h = (location.hash || "").replace(/^#/, "");
    if (h === "chat") showView("chat");
    else showView("portfolio", PANELS.indexOf(h) === -1 ? "home" : h);
  }

  /* ---------- Sending ---------- */

  function requestReply(messages) {
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;
    return fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
      signal: controller ? controller.signal : undefined
    }).then(
      function (res) {
        if (timer) clearTimeout(timer);
        return res.json().then(
          function (data) { return { res: res, data: data || {} }; },
          function () { return { res: res, data: {} }; }
        );
      },
      function (err) {
        if (timer) clearTimeout(timer);
        throw err;
      }
    );
  }

  async function ask(rawText) {
    var text = String(rawText || "").trim().slice(0, MAX_INPUT);
    if (!text || busy) return;

    go("chat");

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
      var result = await requestReply(history);
      waiting.remove();

      if (result.res.ok && result.data.reply) {
        addBotMessage(result.data.reply);
        history.push({ role: "assistant", content: result.data.reply });
        history = history.slice(-MAX_HISTORY);
      } else if (result.res.status === 429) {
        history.pop();
        addError(result.data.error || "Too many messages. Please wait a minute and try again.");
      } else {
        // Endpoint missing, not configured, or the model is down: answer from saved facts.
        history.pop();
        addBotMessage(localAnswer(text), "Quick answer from Shan's saved profile. The live AI assistant is unavailable right now.");
      }
    } catch (err) {
      waiting.remove();
      history.pop();
      addBotMessage(localAnswer(text), "Quick answer from Shan's saved profile. The live AI assistant could not be reached.");
    } finally {
      busy = false;
      sendBtn.disabled = false;
      saveCurrent();
      scrollChatToEnd();
      if (!viewChat.hidden) input.focus();
    }
  }

  function autoGrow() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 180) + "px";
  }

  /* ---------- Events ---------- */

  function submitOnEnter(e, formEl) {
    // Enter sends, Shift+Enter adds a new line.
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      if (formEl.requestSubmit) formEl.requestSubmit();
      else formEl.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  }

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
      submitOnEnter(e, heroForm);
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
    submitOnEnter(e, form);
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
      go(navEl.getAttribute("data-view"), navEl.getAttribute("data-panel"));
      return;
    }
  });

  window.addEventListener("popstate", routeFromHash);

  renderChips();
  renderRecents();
  updateWelcome();
  routeFromHash();
})();
