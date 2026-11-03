// WorkShield popup — plain script (no modules). All checks run on the device; no network calls.
// Uses rules.js (loaded first): runShieldCheck, runSafetyCheck, FINDINGS, SAFETY_TEXT, HEADLINES,
// SAFETY_REPLIES, priceGuideFor, nprFor, buildProposal, improveProposal.
//
// chrome.storage.local keys used:
//   pendingCheck (set by background.js), ext_name, ext_passport_link, ext_evidence, ext_history,
//   ext_skills, ext_saved_jobs, ext_lang (added in 1.2.0)

// Prototype address of the web app. Change this when the app is hosted somewhere else.
const APP_URL = "http://localhost:5173/";

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var mode = "job"; // "job" | "msg"
  var lastText = "", lastCats = []; // last Message check (used by "Save as proof")

  var input = $("input"), checkBtn = $("check"), hint = $("hint");
  var result = $("result"), headline = $("headline"), headlineNe = $("headline-ne"), findings = $("findings");

  // ---------- small helpers ----------
  function sGet(key, cb) {
    chrome.storage.local.get(key, function (d) { cb(d ? d[key] : undefined); });
  }
  function sSet(key, val, cb) {
    var o = {}; o[key] = val;
    chrome.storage.local.set(o, cb || function () {});
  }
  function asList(v) { return Array.isArray(v) ? v : []; }

  function copyText(text, btn) {
    var label = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", label);
    function ok() {
      btn.textContent = "Copied";
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.textContent = label; }, 1500);
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { if (document.execCommand("copy")) ok(); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else { fallback(); }
  }

  function snippetOf(text, n) { return String(text || "").replace(/\s+/g, " ").trim().slice(0, n || 50); }
  function dateLabel(iso) {
    var d = new Date(iso);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  // ---------- main tabs ----------
  var PANELS = { check: "panel-check", job: "panel-job", apply: "panel-apply", passport: "panel-passport" };
  function showTab(name) {
    Object.keys(PANELS).forEach(function (k) {
      $(PANELS[k]).hidden = (k !== name);
      $("mtab-" + k).classList.toggle("active", k === name);
      $("mtab-" + k).setAttribute("aria-pressed", String(k === name));
    });
  }

  // ---------- TAB 1: CHECK ----------
  var CHIPS = [
    { id: "photo", label: "Photo ask" },
    { id: "call", label: "Call pressure" },
    { id: "night", label: "Late night" },
    { id: "personal", label: "Personal questions" },
    { id: "meeting", label: "Meeting ask" },
    { id: "pressure", label: "Rude / threats" },
    { id: "exit", label: "Leave the job" }
  ];
  var EXIT_LABEL = "If you want to leave the job";

  function replyCard(label, text) {
    var card = document.createElement("div");
    card.className = "reply-card";
    var l = document.createElement("div"); l.className = "reply-label"; l.textContent = label;
    var p = document.createElement("p"); p.className = "reply-text"; p.textContent = text;
    var b = document.createElement("button"); b.type = "button"; b.className = "copy-btn"; b.textContent = "Copy";
    b.addEventListener("click", function () { copyText(text, b); });
    card.appendChild(l); card.appendChild(p); card.appendChild(b);
    return card;
  }

  function clearChips() {
    $("chip-reply").textContent = "";
    Array.prototype.forEach.call($("chips").children, function (c) { c.classList.remove("active"); });
  }

  function buildChips() {
    CHIPS.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = c.label; b.setAttribute("data-id", c.id);
      b.addEventListener("click", function () {
        clearChips();
        b.classList.add("active");
        $("chip-reply").appendChild(replyCard(c.id === "exit" ? EXIT_LABEL : c.label, SAFETY_REPLIES[c.id]));
      });
      $("chips").appendChild(b);
    });
  }

  function hideResults() {
    result.hidden = true;
    $("replies").hidden = true;
    $("save-proof").hidden = true;
    lastText = ""; lastCats = [];
  }

  function setMode(m) {
    mode = m;
    $("tab-job").classList.toggle("active", m === "job");
    $("tab-msg").classList.toggle("active", m === "msg");
    $("tab-job").setAttribute("aria-pressed", String(m === "job"));
    $("tab-msg").setAttribute("aria-pressed", String(m === "msg"));
    $("situations").hidden = (m !== "msg");
    $("proof-box").hidden = (m !== "msg");
    clearChips();
    hideResults();
  }

  function syncButton() { checkBtn.disabled = input.value.trim() === ""; }

  function row(kind, name, text) {
    var li = document.createElement("li");
    var dot = document.createElement("span");
    dot.className = "dot" + (kind === "ok" ? " ok" : "");
    dot.textContent = kind === "ok" ? "OK" : "!";
    if (kind === "ok") { dot.style.fontSize = "10px"; }
    var body = document.createElement("span");
    if (name) {
      var n = document.createElement("span");
      n.className = "name";
      n.textContent = name;
      body.appendChild(n);
    }
    body.appendChild(document.createTextNode(text));
    li.appendChild(dot);
    li.appendChild(body);
    return li;
  }

  function showResult() {
    var text = input.value;
    if (!text.trim()) return;
    findings.textContent = "";
    result.className = "result";
    clearChips();
    var historyLabel;
    if (mode === "job") {
      var r = runShieldCheck(text);
      headline.textContent = HEADLINES[r.verdict].en;
      headlineNe.textContent = HEADLINES[r.verdict].ne;
      if (r.verdict === "danger") result.classList.add("danger");
      r.red.forEach(function (id) { findings.appendChild(row("warn", "", FINDINGS[id])); });
      r.yellow.forEach(function (id) { findings.appendChild(row("warn", "", FINDINGS[id])); });
      // Display only: no green "good sign" rows on a danger result.
      if (r.verdict !== "danger") {
        r.green.forEach(function (id) { findings.appendChild(row("ok", "", FINDINGS[id])); });
      }
      historyLabel = r.verdict === "danger" ? "Danger" : r.verdict === "warning" ? "Warning" : "No danger signs";
      $("replies").hidden = true;
      $("save-proof").hidden = true;
    } else {
      var cats = runSafetyCheck(text);
      var key = cats.length ? "safetyMatched" : "safetyClear";
      headline.textContent = HEADLINES[key].en;
      headlineNe.textContent = HEADLINES[key].ne;
      if (cats.length) result.classList.add("danger");
      cats.forEach(function (id) { findings.appendChild(row("warn", SAFETY_TEXT[id].name, SAFETY_TEXT[id].expl)); });
      historyLabel = cats.length ? SAFETY_TEXT[cats[0]].name : "No problems";

      // Help me reply: one card per matched category, then the exit card (always last).
      var cards = $("reply-cards");
      cards.textContent = "";
      cats.forEach(function (id) { cards.appendChild(replyCard(SAFETY_TEXT[id].name, SAFETY_REPLIES[id])); });
      cards.appendChild(replyCard(EXIT_LABEL, SAFETY_REPLIES.exit));
      $("replies").hidden = false;

      // Save as proof: only when at least one category matched.
      lastText = text; lastCats = cats.slice();
      var sp = $("save-proof");
      sp.textContent = "Save as proof"; sp.disabled = false;
      sp.hidden = cats.length === 0;
    }
    result.hidden = false;
    addHistory({ snippet: snippetOf(text, 50), label: historyLabel, date: new Date().toISOString() });
  }

  // Read the current selection of the active tab. Only runs when the user clicks the button (activeTab).
  // Calls onText(selection) when there is one, onNone() when there is not.
  function readSelection(onText, onNone) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs || !tabs[0]) { onNone(); return; }
      chrome.scripting.executeScript(
        { target: { tabId: tabs[0].id }, func: function () { return String(window.getSelection()); } },
        function (res) {
          var sel = (!chrome.runtime.lastError && res && res[0] && res[0].result) ? String(res[0].result).trim() : "";
          if (!sel) { onNone(); return; }
          onText(sel);
        }
      );
    });
  }

  function useSelected() {
    hint.hidden = true;
    readSelection(function (sel) {
      input.value = sel;
      syncButton();
      combinedCheck();
    }, function () { hint.hidden = false; });
  }

  // Auto-check: run BOTH engines. Boundary problem found -> Message result; otherwise -> Job result.
  function combinedCheck() {
    var text = input.value;
    if (!text.trim()) return;
    setMode(runSafetyCheck(text).length ? "msg" : "job");
    showResult();
  }

  // ---- Saved proof (ext_evidence: newest first, max 10) ----
  function saveProof() {
    if (!lastCats.length) return;
    var item = { text: lastText, categories: lastCats.slice(), date: new Date().toISOString() };
    sGet("ext_evidence", function (v) {
      var list = asList(v);
      list.unshift(item);
      list = list.slice(0, 10);
      sSet("ext_evidence", list, function () {
        var sp = $("save-proof");
        sp.textContent = "Saved"; sp.disabled = true;
        renderProof();
      });
    });
  }

  function renderProof() {
    sGet("ext_evidence", function (v) {
      var list = asList(v), box = $("proof-list");
      box.textContent = "";
      if (!list.length) {
        var e = document.createElement("p"); e.className = "proof-empty"; e.textContent = "Nothing saved yet.";
        box.appendChild(e);
        return;
      }
      list.forEach(function (it, i) {
        var d = document.createElement("div"); d.className = "proof-item";
        var meta = document.createElement("div"); meta.className = "proof-meta"; meta.textContent = dateLabel(it.date);
        var cats = document.createElement("div"); cats.className = "proof-cats";
        cats.textContent = asList(it.categories).map(function (id) { return SAFETY_TEXT[id] ? SAFETY_TEXT[id].name : id; }).join(", ");
        var t = document.createElement("div"); t.className = "proof-text";
        var full = String(it.text || "");
        t.textContent = snippetOf(full, 50) + (full.replace(/\s+/g, " ").trim().length > 50 ? "\u2026" : "");
        var del = document.createElement("button"); del.type = "button"; del.className = "link"; del.textContent = "Delete";
        del.addEventListener("click", function () {
          sGet("ext_evidence", function (cur) {
            var l = asList(cur); l.splice(i, 1);
            sSet("ext_evidence", l, renderProof);
          });
        });
        d.appendChild(meta); d.appendChild(cats); d.appendChild(t); d.appendChild(del);
        box.appendChild(d);
      });
    });
  }

  // ---- Recent checks (ext_history: newest first, max 5) ----
  function addHistory(entry) {
    sGet("ext_history", function (v) {
      var list = asList(v);
      list.unshift(entry);
      list = list.slice(0, 5);
      sSet("ext_history", list, renderHistory);
    });
  }

  function renderHistory() {
    sGet("ext_history", function (v) {
      var list = asList(v), ul = $("history");
      ul.textContent = "";
      $("clear-history").hidden = list.length === 0;
      if (!list.length) {
        var li = document.createElement("li"); li.className = "none"; li.textContent = "No checks yet.";
        ul.appendChild(li);
        return;
      }
      list.forEach(function (it) {
        var li = document.createElement("li");
        var verb = document.createElement("span"); verb.className = "verb"; verb.textContent = it.label || "";
        var snip = document.createElement("span"); snip.className = "snip"; snip.textContent = it.snippet || "";
        li.appendChild(verb); li.appendChild(snip);
        ul.appendChild(li);
      });
    });
  }


  // ---------- TAB 2: JOB TOOLS (v1.2.0) ----------
  var lang = "en"; // "en" | "ne" (saved in ext_lang)
  function T(en, ne) { return lang === "ne" ? ne : en; }

  var DEMO_SKILLS = ["Photoshop", "Canva", "Logo Design", "Social Media Posts", "English Writing", "Typing/Data Entry"];
  var mySkills = DEMO_SKILLS.slice(); // skills that are switched ON
  var jtLast = "";                    // "skills" | "price" | "explain" | ""
  var jtMethod = "bank";              // payment method for the mini net preview
  var METHODS = [
    { key: "bank", en: "Bank transfer", ne: "बैंक ट्रान्सफर" },
    { key: "payoneer", en: "Payoneer", ne: "Payoneer" },
    { key: "wise", en: "Wise", ne: "Wise" }
  ];
  var jtInput = $("jt-input"), jtResult = $("jt-result");

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function applyLang() {
    document.documentElement.lang = lang === "ne" ? "ne" : "en";
    Array.prototype.forEach.call(document.querySelectorAll("[data-en]"), function (n) {
      n.textContent = n.getAttribute(lang === "ne" ? "data-ne" : "data-en");
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-ph-en]"), function (n) {
      n.placeholder = n.getAttribute(lang === "ne" ? "data-ph-ne" : "data-ph-en");
    });
    $("jt-skill-add").placeholder = T("Add a skill, e.g. Figma", "सीप थप्नुहोस्, जस्तै Figma");
    $("lang-en").classList.toggle("active", lang === "en");
    $("lang-ne").classList.toggle("active", lang === "ne");
    $("lang-en").setAttribute("aria-pressed", String(lang === "en"));
    $("lang-ne").setAttribute("aria-pressed", String(lang === "ne"));
    $("jt-skill-error").hidden = true;
    $("jt-hint").hidden = true;
    renderSkillEditor();
    renderSaved();
    renderJobResult();
  }

  function setLang(l) {
    lang = l;
    sSet("ext_lang", l);
    applyLang();
  }

  // ---- Your skills (ext_skills: names that are ON; never set -> the 6 demo skills) ----
  function renderSkillEditor() {
    var box = $("jt-skill-chips");
    box.textContent = "";
    var shown = DEMO_SKILLS.slice();
    mySkills.forEach(function (n) { if (shown.indexOf(n) === -1) shown.push(n); });
    shown.forEach(function (name) {
      var on = mySkills.indexOf(name) !== -1;
      var b = el("button", "chip", name);
      b.type = "button";
      b.setAttribute("aria-pressed", String(on));
      b.addEventListener("click", function () {
        var i = mySkills.indexOf(name);
        if (i === -1) mySkills.push(name); else mySkills.splice(i, 1);
        sSet("ext_skills", mySkills.slice());
        renderSkillEditor();
        if (jtLast === "skills") renderJobResult();
      });
      box.appendChild(b);
    });
    var dl = $("jt-skill-list");
    dl.textContent = "";
    SKILL_DETECT.forEach(function (s) {
      if (shown.indexOf(s.name) === -1) { var o = document.createElement("option"); o.value = s.name; dl.appendChild(o); }
    });
  }

  function addSkill() {
    var v = $("jt-skill-add").value.trim().toLowerCase();
    var err = $("jt-skill-error");
    if (!v) { err.hidden = true; return; }
    var found = null;
    SKILL_DETECT.forEach(function (s) { if (s.name.toLowerCase() === v) found = s.name; });
    if (!found) {
      err.textContent = T("Choose a skill name from the list.", "सूचीबाट सीपको नाम छान्नुहोस्।");
      err.hidden = false;
      return;
    }
    err.hidden = true;
    if (mySkills.indexOf(found) === -1) { mySkills.push(found); sSet("ext_skills", mySkills.slice()); }
    $("jt-skill-add").value = "";
    renderSkillEditor();
    if (jtLast === "skills") renderJobResult();
  }

  // ---- results (one area; last action wins) ----
  function chipList(names, cls) {
    var w = el("div", "skill-chips");
    names.forEach(function (n) { w.appendChild(el("span", "skill-chip" + (cls ? " " + cls : ""), n)); });
    return w;
  }

  function resultSkills(box, text) {
    var r = checkSkills(text, mySkills);
    box.appendChild(el("h3", "res-sub", T("Skills you have", "तपाईंसँग भएका सीप")));
    if (r.has.length) box.appendChild(chipList(r.has));
    else box.appendChild(el("p", "res-line", T("This job does not name skills from the list.", "यो कामले सूचीका सीप उल्लेख गरेको छैन।")));
    if (r.missing.length) {
      box.appendChild(el("h3", "res-sub", T("Skills you do not have yet", "तपाईंसँग नभएका सीप")));
      r.missing.forEach(function (name) {
        var n = sampleCountFor(name);
        var item = el("div", "missing-item");
        item.appendChild(chipList([name], "white"));
        item.appendChild(el("p", "count", T(name + " is asked in " + n + " of the 12 sample jobs", name + " — 12 नमुना काममध्ये " + n + " वटामा मागिएको छ")));
        box.appendChild(item);
      });
    }
    box.appendChild(el("p", "muted-note", T("Counts come from 12 sample jobs saved in the extension.", "यो गणना एक्सटेन्सनमा भएका 12 नमुना कामबाट आएको हो।")));
  }

  function resultPrice(box, text) {
    var amounts = extractAmounts(text);
    if (!amounts.length) {
      box.appendChild(el("p", "res-line", T("No dollar price found in this text.", "यसमा डलरमा मूल्य भेटिएन।")));
      return;
    }
    var usd = amounts[0], g = priceGuideFor(text), range = "US $" + g[0] + "\u2013$" + g[1];
    var msg;
    if (usd < g[0]) {
      msg = T("This price is below the usual range (" + range + ") for this kind of work. You can ask for more.",
        "यो मूल्य यस किसिमको कामको सामान्य दायरा (" + range + ") भन्दा कम छ। तपाईंले बढी माग्न सक्नुहुन्छ।");
    } else if (usd <= g[1]) {
      msg = T("This price is inside the usual range (" + range + ").", "यो मूल्य सामान्य दायरा (" + range + ") भित्र छ।");
    } else {
      msg = T("This price is above the usual range (" + range + "). Check the job carefully \u2014 very high pay can be a scam sign.",
        "यो मूल्य सामान्य दायरा (" + range + ") भन्दा बढी छ। काम राम्ररी जाँच्नुहोस् \u2014 धेरै बढी तलब ठगीको सङ्केत हुन सक्छ।");
    }
    box.appendChild(el("p", "res-line ink", msg));

    var pills = el("div", "pills");
    METHODS.forEach(function (m) {
      var b = el("button", "pill", T(m.en, m.ne));
      b.type = "button";
      b.setAttribute("aria-pressed", String(jtMethod === m.key));
      b.addEventListener("click", function () { jtMethod = m.key; renderJobResult(); });
      pills.appendChild(b);
    });
    box.appendChild(pills);

    var n = netPreviewFor(usd, jtMethod);
    if (n.net <= 0) {
      box.appendChild(el("p", "res-line", T("The fees are more than the pay. Ask for a different payment way.", "शुल्क नै आम्दानीभन्दा बढी भयो। अर्को भुक्तानी तरिका माग्नुहोस्।")));
    } else {
      box.appendChild(el("p", "res-line", T("In rupees: NPR ", "रुपैयाँमा: NPR ") + formatWithCommas(n.gross)));
      box.appendChild(el("p", "res-line", T("Estimated fees: \u2212 NPR ", "अनुमानित शुल्क: \u2212 NPR ") + formatWithCommas(n.fee)));
      box.appendChild(el("p", "res-line ink", T("You receive (about): NPR ", "तपाईंले पाउनुहुन्छ (करिब): NPR ") + formatWithCommas(n.net)));
    }
    box.appendChild(el("p", "small", T("These are suggestions to help you. Read and change anything before you send \u2014 the final decision is always yours.",
      "यी तपाईंलाई मद्दत गर्ने सुझाव हुन्। पठाउनुअघि पढेर जे पनि बदल्नुहोस् \u2014 अन्तिम निर्णय सधैं तपाईंकै हो।")));
  }

  function resultExplain(box, text) {
    box.appendChild(el("h3", "res-title", T("The main points", "मुख्य कुराहरू")));
    var amounts = extractAmounts(text);
    if (amounts.length) {
      var usd = amounts[0], npr = nprFor(usd);
      box.appendChild(el("p", "res-line", T("Pay: $" + usd + " \u2014 about NPR " + npr + " before fees.", "तलब: $" + usd + " \u2014 शुल्कअघि करिब NPR " + npr + "\u0964")));
    }
    var dl = findDeadline(text);
    box.appendChild(el("p", "res-line", dl ? T("Deadline: " + dl, "अन्तिम मिति: " + dl) : T("No deadline found in the text.", "यसमा अन्तिम मिति भेटिएन।")));
    var v = runShieldCheck(text).verdict;
    var watch = v === "ok" ? T("No danger signs found in this job.", "यस काममा खतराका सङ्केत भेटिएनन्।") : T(HEADLINES[v].en, HEADLINES[v].ne);
    box.appendChild(el("p", "res-line" + (v === "danger" ? " ink" : ""), watch));

    var terms = findGlossaryTerms(text);
    if (terms.length) {
      box.appendChild(el("h3", "res-sub", T("Words you may not know", "तपाईंलाई थाहा नहुन सक्ने शब्दहरू")));
      terms.forEach(function (g) {
        var row = el("div", "gloss");
        row.appendChild(el("div", "term", g.term === "nda" ? "NDA" : g.term));
        row.appendChild(el("p", "big", T(g.en, g.ne)));
        row.appendChild(el("p", "alt", T(g.ne, g.en)));
        box.appendChild(row);
      });
    }
  }

  function renderJobResult() {
    if (!jtLast) { jtResult.hidden = true; return; }
    var text = jtInput.value;
    jtResult.textContent = "";
    jtResult.className = "result";
    if (jtLast === "skills") resultSkills(jtResult, text);
    else if (jtLast === "price") resultPrice(jtResult, text);
    else resultExplain(jtResult, text);
    jtResult.hidden = false;
  }

  function runJobTool(which) {
    if (!jtInput.value.trim()) { showJtHint(T("Paste a job first", "पहिले काम टाँस्नुहोस्")); return; }
    $("jt-hint").hidden = true;
    jtLast = which;
    renderJobResult();
  }

  function showJtHint(msg) {
    var h = $("jt-hint");
    h.textContent = msg;
    h.hidden = false;
  }

  function useSelectedJob() {
    $("jt-hint").hidden = true;
    readSelection(function (sel) { jtInput.value = sel; }, function () {
      showJtHint(T("Select some text on the page first, then try again.", "पहिले पेजमा केही पाठ चयन गर्नुहोस्, अनि फेरि प्रयास गर्नुहोस्।"));
    });
  }

  // ---- Save this job (ext_saved_jobs: newest first, max 20) ----
  function saveJob() {
    var text = jtInput.value;
    if (!text.trim()) { showJtHint(T("Paste a job first", "पहिले काम टाँस्नुहोस्")); return; }
    $("jt-hint").hidden = true;
    var firstLine = "";
    text.split(/\r?\n/).some(function (l) { if (l.trim()) { firstLine = l.trim(); return true; } return false; });
    var title = firstLine.slice(0, 60).trim() || "Saved job";
    function finish(url) {
      var item = { title: title, url: url || "", date: new Date().toISOString() };
      sGet("ext_saved_jobs", function (v) {
        var list = asList(v);
        list.unshift(item);
        list = list.slice(0, 20);
        sSet("ext_saved_jobs", list, function () {
          var b = $("jt-save");
          b.textContent = T("Saved", "सेभ भयो");
          b.disabled = true;
          clearTimeout(b._t);
          b._t = setTimeout(function () { b.textContent = T("Save this job", "यो काम सेभ गर्नुहोस्"); b.disabled = false; }, 1500);
          renderSaved();
        });
      });
    }
    // The tab address is only readable after the user opened the popup (activeTab); "" if it cannot be read.
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var u = (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].url) ? String(tabs[0].url) : "";
        finish(/^https?:\/\//i.test(u) ? u : "");
      });
    } catch (e) { finish(""); }
  }

  function renderSaved() {
    sGet("ext_saved_jobs", function (v) {
      var list = asList(v), ul = $("jt-saved");
      ul.textContent = "";
      if (!list.length) {
        ul.appendChild(el("li", "none", T("No saved jobs yet.", "अहिलेसम्म कुनै काम सेभ गरिएको छैन।")));
        return;
      }
      list.forEach(function (it, i) {
        var li = document.createElement("li");
        li.appendChild(el("div", "s-title", it.title || "Saved job"));
        li.appendChild(el("div", "s-date", dateLabel(it.date)));
        var acts = el("div", "s-actions");
        if (it.url) {
          var open = el("button", "link", T("Open", "खोल्नुहोस्"));
          open.type = "button";
          open.addEventListener("click", function () { chrome.tabs.create({ url: it.url }); });
          acts.appendChild(open);
        }
        var rm = el("button", "link", T("Remove", "हटाउनुहोस्"));
        rm.type = "button";
        rm.addEventListener("click", function () {
          sGet("ext_saved_jobs", function (cur) {
            var l = asList(cur); l.splice(i, 1);
            sSet("ext_saved_jobs", l, renderSaved);
          });
        });
        acts.appendChild(rm);
        li.appendChild(acts);
        ul.appendChild(li);
      });
    });
  }

  // ---------- TAB 3: APPLY HELP ----------
  function updatePriceInfo() {
    var g = priceGuideFor($("f-title").value);
    $("price-guide").textContent =
      "Beginners usually charge $" + g[0] + "\u2013$" + g[1] + " for this kind of work. This is a rough guide.";
    var p = parseFloat($("f-price").value);
    if (isFinite(p) && p > 0) {
      $("price-npr").textContent = "\u2248 NPR " + nprFor(p);
      $("price-npr").hidden = false;
    } else {
      $("price-npr").hidden = true;
    }
  }

  function makeApplication() {
    var title = $("f-title").value.trim(), skills = $("f-skills").value.trim();
    if (!title || !skills) {
      $("apply-error").hidden = false;
      return;
    }
    $("apply-error").hidden = true;
    var name = $("f-name").value.trim();
    sSet("ext_name", name);
    $("output").value = buildProposal({ name: name, jobTitle: title, skills: skills, priceUSD: $("f-price").value });
    $("improve-status").hidden = true;
    $("output-wrap").hidden = false;
  }

  function improveIt() {
    var before = $("output").value;
    var after = improveProposal(before);
    $("output").value = after;
    var s = $("improve-status");
    s.textContent = after === before ? "Nothing more to add. Your application already has these lines." : "Improved. Read it and change anything you like.";
    s.hidden = false;
  }

  // ---------- TAB 4: PASSPORT ----------
  function renderPassport(link, justSaved) {
    var has = !!link;
    $("passport-empty").hidden = has;
    $("passport-saved").hidden = !has;
    if (has) {
      $("link-view").textContent = link;
      $("link-view").title = link;
    }
    var st = $("passport-status");
    st.textContent = "Saved";
    st.hidden = !justSaved;
  }

  function saveLink() {
    var v = $("p-link").value.trim();
    if (!v) return;
    sSet("ext_passport_link", v, function () { renderPassport(v, true); });
  }

  // ---------- wiring ----------
  $("mtab-check").addEventListener("click", function () { showTab("check"); });
  $("mtab-job").addEventListener("click", function () { showTab("job"); });
  $("mtab-apply").addEventListener("click", function () { showTab("apply"); });
  $("mtab-passport").addEventListener("click", function () { showTab("passport"); });

  $("tab-job").addEventListener("click", function () { setMode("job"); });
  $("tab-msg").addEventListener("click", function () { setMode("msg"); });
  input.addEventListener("input", function () { syncButton(); hint.hidden = true; });
  checkBtn.addEventListener("click", showResult);
  $("use-selected").addEventListener("click", useSelected);
  $("save-proof").addEventListener("click", saveProof);
  $("clear-history").addEventListener("click", function () { sSet("ext_history", [], renderHistory); });

  $("f-title").addEventListener("input", updatePriceInfo);
  $("f-price").addEventListener("input", updatePriceInfo);
  $("f-name").addEventListener("input", function () { sSet("ext_name", $("f-name").value.trim()); });
  $("make-app").addEventListener("click", makeApplication);
  $("improve").addEventListener("click", improveIt);
  $("copy-app").addEventListener("click", function () { copyText($("output").value, $("copy-app")); });

  $("lang-en").addEventListener("click", function () { setLang("en"); });
  $("lang-ne").addEventListener("click", function () { setLang("ne"); });
  $("jt-skill-add-btn").addEventListener("click", addSkill);
  $("jt-skill-add").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addSkill(); } });
  $("jt-skills").addEventListener("click", function () { runJobTool("skills"); });
  $("jt-price").addEventListener("click", function () { runJobTool("price"); });
  $("jt-explain").addEventListener("click", function () { runJobTool("explain"); });
  $("jt-use-selected").addEventListener("click", useSelectedJob);
  $("jt-save").addEventListener("click", saveJob);
  jtInput.addEventListener("input", function () { $("jt-hint").hidden = true; });

  $("save-link").addEventListener("click", saveLink);
  $("copy-link").addEventListener("click", function () {
    sGet("ext_passport_link", function (v) { if (v) copyText(v, $("copy-link")); });
  });
  $("open-passport").addEventListener("click", function () { chrome.tabs.create({ url: APP_URL }); });
  $("change-link").addEventListener("click", function () {
    $("p-link").value = "";
    $("passport-status").hidden = true;
    $("passport-saved").hidden = true;
    $("passport-empty").hidden = false;
  });
  $("open-app").addEventListener("click", function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: APP_URL });
  });

  // ---------- start (tab state resets on every open: always start on "Check") ----------
  buildChips();
  showTab("check");
  setMode("job");
  updatePriceInfo();
  renderProof();
  renderHistory();
  sGet("ext_name", function (v) { if (v) $("f-name").value = v; });
  sGet("ext_passport_link", function (v) { renderPassport(v || "", false); });
  applyLang();
  sGet("ext_lang", function (v) { if (v === "ne" || v === "en") { lang = v; applyLang(); } });
  sGet("ext_skills", function (v) {
    if (Array.isArray(v)) { mySkills = v.filter(function (n) { return typeof n === "string"; }); renderSkillEditor(); }
  });

  // Pick up text saved by the right-click menu, then clear it and the badge.
  chrome.storage.local.get("pendingCheck", function (data) {
    if (data && data.pendingCheck) {
      setMode("job");
      input.value = data.pendingCheck;
      syncButton();
      combinedCheck();
      chrome.storage.local.remove("pendingCheck");
      chrome.action.setBadgeText({ text: "" });
    }
  });
})();
