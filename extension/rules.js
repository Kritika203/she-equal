// WorkShield rules — copied from the web app (src/App.jsx): same trigger lists, same verdict logic.
// Plain script (no modules). Runs fully on the device. No network.

var SHIELD_RULES = {
  red: [
    { id: "fee", triggers: ["registration fee", "pay first", "deposit", "training fee", "send money", "processing fee", "activation fee"] },
    { id: "otp", triggers: ["otp", "password", "pin code", "bank pin", "cvv"] },
    { id: "crypto", triggers: ["gift card", "bitcoin", "crypto", "usdt"] },
    { id: "offplatform", triggers: ["whatsapp", "telegram", "viber", "personal number", "call me at night"] },
    { id: "photo", triggers: ["send your photo", "send a selfie", "your picture", "personal photo"] },
    { id: "urgency", triggers: ["urgent", "act now", "only today", "immediately", "last chance", "hurry"] }
  ],
  freetrial: ["free sample", "free work", "do one free", "unpaid trial", "trial work"],
  deliverables: ["logo", "poster", "design", "posts", "rows", "words", "article", "video", "photo edit", "file", "files", "page", "banner", "translation", "type", "typing", "label", "labels"],
  payWords: ["pay", "paid", "payment", "$", "rs", "npr", "salary", "rate"],
  payMethod: ["bank transfer", "esewa", "khalti", "milestone"],
  deadline: ["deadline", "days", "by friday", "by monday", "within a week", "tomorrow"]
};
var RED_ORDER = ["fee", "otp", "crypto", "highpay", "offplatform", "photo", "urgency"];

function extractAmounts(text) {
  var out = [];
  var re = /\$\s?(\d+(?:,\d{3})*(?:\.\d+)?)/g;
  var m;
  while ((m = re.exec(text)) !== null) out.push(parseFloat(m[1].replace(/,/g, "")));
  return out;
}

// Returns { verdict: "danger"|"warning"|"ok", red: [ids], yellow: [ids], green: [ids] }
// Includes the structural highpay / lowpay rules. Job-only rules (verified client etc.) are not included.
function runShieldCheck(text) {
  var low = (text || "").toLowerCase();
  var has = function (list) { return list.some(function (w) { return low.indexOf(w) !== -1; }); };
  var amounts = extractAmounts(text || "");
  var maxAmt = amounts.length ? Math.max.apply(null, amounts) : 0;
  var hourWording = has(["/hour", "per hour", "an hour"]);

  var found = {};
  SHIELD_RULES.red.forEach(function (r) { if (has(r.triggers)) found[r.id] = true; });
  var highpay = false;
  if (amounts.length) {
    if (hourWording && maxAmt >= 40) highpay = true;
    if (maxAmt >= 1000 && has(["easy", "simple", "no experience"])) highpay = true;
  }
  if (highpay) found.highpay = true;
  var red = RED_ORDER.filter(function (id) { return found[id]; });

  var yellow = [];
  if (has(SHIELD_RULES.freetrial)) yellow.push("freetrial");
  var vague = !has(SHIELD_RULES.deliverables);
  if (vague) yellow.push("vague");
  if (!has(SHIELD_RULES.payWords)) yellow.push("nopay");
  if (amounts.length && !highpay) {
    if ((hourWording && maxAmt < 3) || (!hourWording && maxAmt < 10)) yellow.push("lowpay");
  }

  var green = [];
  if (!vague) green.push("clearwork");
  if (has(SHIELD_RULES.payMethod) || (amounts.length > 0 && low.indexOf("paid") !== -1)) green.push("paymethod");
  if (has(SHIELD_RULES.deadline)) green.push("deadline");

  var verdict = red.length >= 1 ? "danger" : yellow.length >= 1 ? "warning" : "ok";
  return { verdict: verdict, red: red, yellow: yellow, green: green };
}

var SAFETY_ORDER = ["photo", "meeting", "pressure", "call", "personal", "flirty", "night"];
var SAFETY_TRIGGERS = {
  photo: ["selfie", "send your photo", "send a photo", "send me a photo", "your photo", "your picture", "send pic", "photo of you", "personal photo"],
  call: ["video call", "voice call", "call me now", "call me", "phone call", "come on video"],
  night: ["are you still up", "still awake", "are you awake", "up late", "midnight", "so late at night"],
  personal: ["are you single", "boyfriend", "are you married", "how old are you", "your home address", "where do you live exactly", "send your number", "your phone number", "personal number"],
  meeting: ["meet me", "meet alone", "come to my office", "come to my home", "visit me", "meet in person", "hotel"],
  pressure: ["stupid", "idiot", "useless", "waste my time", "bad review if", "i will report you", "do it now or", "last warning", "shut up"],
  flirty: ["sweetheart", "beautiful girl", "pretty girl", "i like you", "you are cute"]
};

// Returns an array of matched category ids (same order as the app).
function runSafetyCheck(text) {
  var low = (text || "").toLowerCase();
  return SAFETY_ORDER.filter(function (id) {
    return SAFETY_TRIGGERS[id].some(function (w) { return low.indexOf(w) !== -1; });
  });
}

// English finding sentences (exact copies of the app's sh_f_* strings).
var FINDINGS = {
  fee: "It asks you to pay money first. Real clients pay you — never pay to get a job.",
  otp: "It asks for an OTP, password or bank PIN. Never share these with anyone.",
  crypto: "It talks about gift cards or crypto payment. This is a common scam sign.",
  highpay: "The pay sounds too good for simple work. Very high pay for easy work is a common trick.",
  offplatform: "It asks you to chat outside the app (WhatsApp, Telegram or a personal number). Chatting inside the app is safer.",
  photo: "It asks for your personal photo. You never need to send personal photos for work.",
  urgency: "It pressures you to act fast. Scammers rush you so you cannot think.",
  freetrial: "It asks you to do free work first. A tiny sample is okay, but full work should be paid.",
  vague: "The work is not clearly described. Ask exactly what you must deliver before you start.",
  nopay: "Payment is not mentioned. Ask the amount and how you will be paid before you start.",
  lowpay: "The pay looks very low for this work. Compare with similar jobs in FirstWork.",
  clearwork: "The work is clearly described.",
  paymethod: "Pay and how you will be paid are mentioned.",
  deadline: "A deadline or time is mentioned."
};

// Safety categories: EN name + explanation (exact copies of SAFETY_DATA).
var SAFETY_TEXT = {
  photo: { name: "Asks for personal photos", expl: "Work never needs your personal photo. Asking for photos is a common trick to misuse them." },
  call: { name: "Pushes for phone or video calls", expl: "Chat keeps a written record. On a call, there is no proof of what was said." },
  night: { name: "Messages late at night", expl: "Late-night work messages often become personal. Your rest time is yours." },
  personal: { name: "Asks personal questions", expl: "Your age, address, phone number and relationship are not part of any job." },
  meeting: { name: "Asks to meet in person", expl: "Online work does not need in-person meetings — especially not alone." },
  pressure: { name: "Rude, insulting or threatening", expl: "No client has the right to insult or threaten you. You can stop the job." },
  flirty: { name: "Romantic or flirty words", expl: "Flirty talk is not professional. You do not have to reply to it." }
};

// Verdict headlines (EN + NE).
var HEADLINES = {
  danger: { en: "Danger signs found — be very careful", ne: "खतराका सङ्केत भेटिए — धेरै सावधान हुनुहोस्" },
  warning: { en: "Some warning signs — check before you reply", ne: "केही चेतावनीका सङ्केत छन् — जवाफ दिनुअघि बुझ्नुहोस्" },
  ok: { en: "No danger signs found", ne: "खतराका सङ्केत भेटिएनन्" },
  safetyMatched: { en: "This message crosses a line.", ne: "यो सन्देशले सीमा नाघेको छ।" },
  safetyClear: { en: "No boundary problems found", ne: "यस सन्देशमा सीमा नाघेको देखिएन" }
};

// ---------------------------------------------------------------------------
// Added in v1.1.0 — Apply help + Help me reply. Nothing above this line was changed.
// ---------------------------------------------------------------------------

// Help Me Reply texts (exact copies of the web app's texts). Polite but firm.
var SAFETY_REPLIES = {
  photo: "I am sorry, I do not share personal photos. I am happy to share my work samples instead.",
  call: "I prefer to keep all our communication in chat, so everything about the work is written down. Please message me here.",
  night: "I do not reply to work messages after 8 PM. I will reply tomorrow morning. Thank you for understanding.",
  personal: "I like to keep our conversation about the work only. Please let me know about the task.",
  meeting: "I work online only and do not meet clients in person. We can discuss everything here in chat.",
  pressure: "Please speak respectfully. If we cannot work respectfully, I will have to stop this job.",
  flirty: "I am here for professional work only. Let us keep our conversation about the project.",
  exit: "Thank you for the opportunity. I will not be able to continue this job. I wish you the best."
};

// Rough price guide for beginners (USD). Checked against the lowercased job title.
// FIRST match wins, in this order.
var PRICE_GUIDE = [
  { keywords: ["logo", "design", "poster", "banner", "thumbnail"], range: [40, 80] },
  { keywords: ["instagram", "social", "tiktok", "facebook", "posts"], range: [30, 60] },
  { keywords: ["data entry", "typing", "spreadsheet", "excel", "copy"], range: [30, 50] },
  { keywords: ["writing", "article", "blog", "translation", "content"], range: [25, 50] },
  { keywords: ["video", "subtitle", "editing"], range: [50, 100] }
];
var PRICE_GUIDE_DEFAULT = [30, 60];

// Sample rate used in the prototype: 1 USD = NPR 133.
var NPR_PER_USD = 133;

// Returns the [low, high] USD pair for a job title.
function priceGuideFor(title) {
  var low = String(title || "").toLowerCase();
  for (var i = 0; i < PRICE_GUIDE.length; i++) {
    var kws = PRICE_GUIDE[i].keywords;
    for (var j = 0; j < kws.length; j++) {
      if (low.indexOf(kws[j]) !== -1) return PRICE_GUIDE[i].range.slice();
    }
  }
  return PRICE_GUIDE_DEFAULT.slice();
}

// 7980 -> "7,980" (plain thousands separators, no locale needed).
function formatWithCommas(n) {
  return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// USD -> NPR text with separators, e.g. 60 -> "7,980".
function nprFor(usd) {
  return formatWithCommas(Number(usd) * NPR_PER_USD);
}

// Builds the application text. Simple and deterministic.
function buildProposal(opts) {
  opts = opts || {};
  var name = String(opts.name || "").trim();
  var jobTitle = String(opts.jobTitle || "").trim();
  var skills = String(opts.skills || "").trim();
  var price = parseFloat(opts.priceUSD);
  var hasPrice = isFinite(price) && price > 0;

  var first = name
    ? "Hello! My name is " + name + ", and I would like to apply for: " + jobTitle + "."
    : "Hello! I am a beginner freelancer, and I would like to apply for this work: " + jobTitle + ".";
  var priceLine = hasPrice
    ? "My price for this work is $" + price + " (\u2248 NPR " + nprFor(price) + ")."
    : "My price is fair for a beginner, and I am happy to discuss it with you.";

  return [
    first,
    "My skills: " + skills + ".",
    "I am new, but my skills are tested and proven in my WorkPassport \u2014 I can share the link so you can see my work record.",
    priceLine,
    "I can start today, and I will update you every day until the work is done.",
    "Thank you for considering a beginner. I will take great care with your work."
  ].join("\n");
}

// Adds each improvement ONLY if it is missing, so the same line can never be added twice.
function improveProposal(text) {
  var out = String(text || "");
  if (out.toLowerCase().indexOf("sample") === -1) {
    out += "\nIf you want, I can make a small sample first so you can see my work.";
  }
  if (out.toLowerCase().indexOf("deadline") === -1) {
    out += "\nCould you please tell me the deadline for this work?";
  }
  if (out.toLowerCase().indexOf("thank you") === -1) {
    out += "\nThank you for your time.";
  }
  return out;
}

// ---------------------------------------------------------------------------
// Added in v1.2.0 — Job tools (Check skills, Check price, Explain). Nothing above this line was changed.
// ---------------------------------------------------------------------------

// Skills a job post can ask for. A skill is "asked for" when any substring is in the lowercased text.
var SKILL_DETECT = [
  { name: "Photoshop", anyOf: ["photoshop"] },
  { name: "Canva", anyOf: ["canva"] },
  { name: "Logo Design", anyOf: ["logo"] },
  { name: "Social Media Posts", anyOf: ["social media", "instagram post", "facebook post", "social post"] },
  { name: "English Writing", anyOf: ["writing", "article", "blog", "content writ"] },
  { name: "Typing/Data Entry", anyOf: ["data entry", "typing", "copy typing"] },
  { name: "Excel", anyOf: ["excel", "spreadsheet"] },
  { name: "Figma", anyOf: ["figma"] },
  { name: "Video Editing", anyOf: ["video edit", "video editing", "reels", "capcut", "premiere"] },
  { name: "Translation", anyOf: ["translat"] },
  { name: "WordPress", anyOf: ["wordpress"] },
  { name: "SEO", anyOf: ["seo", "search engine"] }
];

// 12 sample jobs, used only for counting how often a skill is asked.
var SAMPLE_JOBS = [
  { title: "Logo design for a cafe", skills: ["Logo Design", "Photoshop", "Canva"] },
  { title: "Social media posts for a clothing shop", skills: ["Social Media Posts", "Canva"] },
  { title: "Data entry of 500 product rows", skills: ["Typing/Data Entry", "Excel"] },
  { title: "Blog article about travel in Nepal", skills: ["English Writing"] },
  { title: "Product photo editing", skills: ["Photoshop"] },
  { title: "Instagram reels for a restaurant", skills: ["Video Editing", "Social Media Posts"] },
  { title: "Nepali to English document translation", skills: ["Translation", "English Writing"] },
  { title: "Website banner design", skills: ["Canva", "Photoshop", "Figma"] },
  { title: "Spreadsheet cleanup and formatting", skills: ["Typing/Data Entry", "Excel"] },
  { title: "Facebook ad creatives", skills: ["Social Media Posts", "Canva", "Figma"] },
  { title: "Menu design for a cafe", skills: ["Logo Design", "Canva"] },
  { title: "Subtitles for YouTube videos", skills: ["Video Editing", "English Writing"] }
];

// Names of the skills asked for in a text (in SKILL_DETECT order).
function detectSkills(text) {
  var low = String(text || "").toLowerCase();
  return SKILL_DETECT.filter(function (s) {
    return s.anyOf.some(function (w) { return low.indexOf(w) !== -1; });
  }).map(function (s) { return s.name; });
}

// Compares the skills a job asks for with the skills the person has.
function checkSkills(text, mySkills) {
  var mine = (mySkills || []).map(function (n) { return String(n).toLowerCase(); });
  var has = [], missing = [];
  detectSkills(text).forEach(function (n) {
    if (mine.indexOf(n.toLowerCase()) !== -1) has.push(n); else missing.push(n);
  });
  return { has: has, missing: missing };
}

// How many of the 12 sample jobs include this skill.
function sampleCountFor(skill) {
  return SAMPLE_JOBS.filter(function (j) { return j.skills.indexOf(skill) !== -1; }).length;
}

// Sample fee model (same as the web app's Net Payment Preview). Sample estimates only.
var NET_FEES = {
  bank: { pct: 2, flat: 15 },
  payoneer: { pct: 2, flat: 0 },
  wise: { pct: 1.5, flat: 1 }
};

// usd + method key -> { gross, fee, net } in NPR. Fee: whole rupees. Net: nearest 10.
function netPreviewFor(usd, methodKey) {
  var f = NET_FEES[methodKey] || NET_FEES.bank;
  var u = Number(usd) || 0;
  var gross = u * NPR_PER_USD;
  var feeExact = (u * f.pct / 100 + f.flat) * NPR_PER_USD;
  return {
    gross: Math.round(gross),
    fee: Math.round(feeExact),
    net: Math.round((gross - feeExact) / 10) * 10
  };
}

// Plain-words meanings for the Explain result.
var GLOSSARY = [
  { term: "milestone", en: "The work is split into smaller parts. You get paid after each part.", ne: "काम साना भागमा बाँडिन्छ। हरेक भागपछि तपाईंले भुक्तानी पाउनुहुन्छ।" },
  { term: "revision", en: "The client asks you to change something in the work.", ne: "ग्राहकले काममा केही परिवर्तन गर्न भन्छन्।" },
  { term: "nda", en: "A paper that says you cannot share the client's secret information.", ne: "ग्राहकको गोप्य जानकारी अरूलाई नभन्ने सहमतिपत्र।" },
  { term: "escrow", en: "A safe middle place holds the money until the work is done.", ne: "काम नसकिँदासम्म पैसा सुरक्षित बीचको ठाउँमा रहन्छ।" },
  { term: "portfolio", en: "Examples of work you have done before.", ne: "तपाईंले पहिले गरेका कामका उदाहरणहरू।" },
  { term: "sample", en: "A small example of your work that you show the client.", ne: "ग्राहकलाई देखाउने तपाईंको कामको सानो उदाहरण।" },
  { term: "deadline", en: "The last day or time to finish the work.", ne: "काम सक्नुपर्ने अन्तिम दिन वा समय।" },
  { term: "budget", en: "The money the client plans to spend.", ne: "ग्राहकले खर्च गर्न खोजेको पैसा।" },
  { term: "contract", en: "A written agreement about the work and the pay.", ne: "काम र भुक्तानीबारे लिखित सहमति।" }
];

// Glossary entries whose term appears in the text (whole word, a plain plural "s" is accepted).
function findGlossaryTerms(text) {
  var t = String(text || "");
  return GLOSSARY.filter(function (g) {
    return new RegExp("\\b" + g.term + "(?:s|es)?\\b", "i").test(t);
  });
}

// Deterministic deadline extraction: "deadline is X", "deadline: X", "within X days", "in X days", "by <weekday>".
// Returns the matched words (a few words only) or "" when nothing is found. Never rewrites other sentences.
function findDeadline(text) {
  var t = String(text || ""), m;
  var NUM = "(?:\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|few)";
  m = /\bdeadline\s*(?:is|:)\s*([^.,;:!?\n()]+)/i.exec(t);
  if (m && m[1].trim()) return m[1].trim().split(/\s+/).slice(0, 4).join(" ");
  m = new RegExp("\\bwithin\\s+(" + NUM + "\\s+(?:days?|weeks?|hours?))\\b", "i").exec(t);
  if (m) return m[1];
  m = new RegExp("\\bin\\s+(" + NUM + "\\s+days?)\\b", "i").exec(t);
  if (m) return m[1];
  m = /\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.exec(t);
  if (m) return m[1];
  return "";
}
