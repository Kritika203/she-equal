// Rules for checking jobs and messages.



const SHIELD_RULES = {
  red: [
    { id: "fee", triggers: ["registration fee", "pay first", "deposit", "training fee", "send money", "processing fee", "activation fee"] },
    { id: "otp", triggers: ["otp", "password", "pin code", "bank pin", "cvv"] },
    { id: "crypto", triggers: ["gift card", "bitcoin", "crypto", "usdt"] },
    { id: "offplatform", triggers: ["whatsapp", "telegram", "viber", "personal number", "call me at night"] },
    { id: "photo", triggers: ["send your photo", "send a selfie", "your picture", "personal photo"] },
    { id: "urgency", triggers: ["urgent", "act now", "only today", "immediately", "last chance", "hurry"] },
  ],
  freetrial: ["free sample", "free work", "do one free", "unpaid trial", "trial work"],
  deliverables: ["logo", "poster", "design", "posts", "rows", "words", "article", "video", "photo edit", "file", "files", "page", "banner", "translation", "type", "typing", "label", "labels"],
  payWords: ["pay", "paid", "payment", "$", "rs", "npr", "salary", "rate"],
  payMethod: ["bank transfer", "esewa", "khalti", "milestone"],
  deadline: ["deadline", "days", "by friday", "by monday", "within a week", "tomorrow"],
};

const RED_ORDER = ["fee", "otp", "crypto", "highpay", "offplatform", "photo", "urgency"];

function extractAmounts(text) {
  const out = [];
  const re = /\$\s?(\d+(?:,\d{3})*(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push(parseFloat(m[1].replace(/,/g, '')));
  return out;
}

export function analyzeText(text, structural = true) {
  const low = (text || "").toLowerCase();
  const has = (list) => list.some(w => low.includes(w));
  const amounts = extractAmounts(text || "");
  const maxAmt = amounts.length ? Math.max(...amounts) : 0;
  const hourWording = has(["/hour", "per hour", "an hour"]);
  const found = new Set();
  SHIELD_RULES.red.forEach(r => { if (has(r.triggers)) found.add(r.id); });
  let highpay = false;
  if (structural && amounts.length) {
    if (hourWording && maxAmt >= 40) highpay = true;
    if (maxAmt >= 1000 && has(["easy", "simple", "no experience"])) highpay = true;
  }
  if (highpay) found.add("highpay");
  const red = RED_ORDER.filter(id => found.has(id));

  const yellow = [];
  if (has(SHIELD_RULES.freetrial)) yellow.push("freetrial");
  const vague = !has(SHIELD_RULES.deliverables);
  if (vague) yellow.push("vague");
  if (!has(SHIELD_RULES.payWords)) yellow.push("nopay");
  if (structural && amounts.length && !highpay) {
    if ((hourWording && maxAmt < 3) || (!hourWording && maxAmt < 10)) yellow.push("lowpay");
  }

  const green = [];
  if (!vague) green.push("clearwork");
  if (has(SHIELD_RULES.payMethod) || (amounts.length > 0 && low.includes("paid"))) green.push("paymethod");
  if (has(SHIELD_RULES.deadline)) green.push("deadline");
  return { red, yellow, green };
}

export function verdictOf(f) {
  return f.red.length >= 1 ? "danger" : f.yellow.length >= 1 ? "warning" : "ok";
}

export function analyzeJob(job) {
  const text = job.title + " " + job.description + " " + (job.deliverables || []).join(" ");
  const f = analyzeText(text, false);
  f.yellow = f.yellow.filter(id => id !== "nopay" && id !== "vague");
  if (!f.green.includes("clearwork")) f.green.unshift("clearwork");
  const clientVerified = job.clientVerified !== undefined ? job.clientVerified : job.paymentVerified;
  if (clientVerified === false) f.yellow.push("unverified");
  if (clientVerified === true) f.green.push("verified");
  if (job.paymentVerified === true && !f.green.includes("paymethod")) f.green.push("paymethod");
  f.green.push("normalpay");
  return f;
}

const SAFETY_ORDER = ["photo", "meeting", "pressure", "call", "personal", "flirty", "night"];

const SAFETY_TRIGGERS = {
  photo: ["selfie", "send your photo", "send a photo", "send me a photo", "your photo", "your picture", "send pic", "photo of you", "personal photo"],
  call: ["video call", "voice call", "call me now", "call me", "phone call", "come on video"],
  night: ["are you still up", "still awake", "are you awake", "up late", "midnight", "so late at night"],
  personal: ["are you single", "boyfriend", "are you married", "how old are you", "your home address", "where do you live exactly", "send your number", "your phone number", "personal number"],
  meeting: ["meet me", "meet alone", "come to my office", "come to my home", "visit me", "meet in person", "hotel"],
  pressure: ["stupid", "idiot", "useless", "waste my time", "bad review if", "i will report you", "do it now or", "last warning", "shut up"],
  flirty: ["sweetheart", "beautiful girl", "pretty girl", "i like you", "you are cute"],
};

export const SAFETY_RULE_OF = { photo: "photo", call: "calls", night: "time", personal: "chat", meeting: "chat", flirty: "chat", pressure: null };

const SCOPE_PHRASES = ["can you also", "could you also", "please also", "one more thing", "also make", "also create", "also write", "also design", "also add", "extra work", "for free", "quick favour", "quick favor", "while you're at it", "while you are at it", "not in our list", "not in the list", "not in the agreement", "add one more", "in addition to"];

export function checkScope(text) {
  const low = String(text || '').toLowerCase();
  const found = [];
  SCOPE_PHRASES.forEach((p, order) => { const idx = low.indexOf(p); if (idx !== -1) found.push({ p, idx, order }); });
  found.sort((a, b) => a.idx - b.idx || a.order - b.order);
  const matched = found.slice(0, 3).map(f => f.p);
  return { flagged: found.length > 0, matched };
}

export function analyzeMessage(text) {
  const low = (text || "").toLowerCase();
  return SAFETY_ORDER.filter(id => SAFETY_TRIGGERS[id].some(w => low.includes(w)));
}

export const SAFETY_DATA = {
  photo: {
    name: { en: "Asks for personal photos", ne: "व्यक्तिगत फोटो मागेको" },
    expl: { en: "Work never needs your personal photo. Asking for photos is a common trick to misuse them.", ne: "कामका लागि तपाईंको व्यक्तिगत फोटो चाहिँदैन। फोटो माग्नु भनेको दुरुपयोग गर्ने सामान्य चाल हो।" },
    reply: { en: "I am sorry, I do not share personal photos. I am happy to share my work samples instead.", ne: "माफ गर्नुहोस्, म व्यक्तिगत फोटो बाँड्दिनँ। बरु म मेरा कामका नमुनाहरू पठाउन सक्छु।" },
  },
  call: {
    name: { en: "Pushes for phone or video calls", ne: "फोन वा भिडियो कलका लागि दबाब" },
    expl: { en: "Chat keeps a written record. On a call, there is no proof of what was said.", ne: "च्याटमा लेखिएको रेकर्ड रहन्छ। कलमा के भनियो भन्ने प्रमाण रहँदैन।" },
    reply: { en: "I prefer to keep all our communication in chat, so everything about the work is written down. Please message me here.", ne: "म सबै कुराकानी च्याटमै राख्न चाहन्छु, ताकि कामबारे सबै कुरा लेखिएर रहोस्। कृपया यहीँ सन्देश पठाउनुहोस्।" },
  },
  night: {
    name: { en: "Messages late at night", ne: "राति अबेर सन्देश" },
    expl: { en: "Late-night work messages often become personal. Your rest time is yours.", ne: "रातिका कामका सन्देशहरू प्रायः व्यक्तिगत बन्न जान्छन्। तपाईंको आरामको समय तपाईंको हो।" },
    reply: { en: "I do not reply to work messages after 8 PM. I will reply tomorrow morning. Thank you for understanding.", ne: "म राति ८ बजेपछि कामका सन्देशको जवाफ दिन्नँ। भोलि बिहान जवाफ दिनेछु। बुझिदिनुभएकोमा धन्यवाद।" },
  },
  personal: {
    name: { en: "Asks personal questions", ne: "व्यक्तिगत प्रश्न सोधेको" },
    expl: { en: "Your age, address, phone number and relationship are not part of any job.", ne: "तपाईंको उमेर, ठेगाना, फोन नम्बर र सम्बन्ध कुनै पनि कामको भाग होइनन्।" },
    reply: { en: "I like to keep our conversation about the work only. Please let me know about the task.", ne: "म हाम्रो कुराकानी काममा मात्र सीमित राख्न चाहन्छु। कृपया कामबारे बताइदिनुहोस्।" },
  },
  meeting: {
    name: { en: "Asks to meet in person", ne: "भेट्न बोलाएको" },
    expl: { en: "Online work does not need in-person meetings — especially not alone.", ne: "अनलाइन कामका लागि भेट्नु पर्दैन — झन् एक्लै त हुँदै होइन।" },
    reply: { en: "I work online only and do not meet clients in person. We can discuss everything here in chat.", ne: "म अनलाइन मात्र काम गर्छु र ग्राहकलाई भेट्दिनँ। सबै कुरा हामी यही च्याटमा गर्न सक्छौं।" },
  },
  pressure: {
    name: { en: "Rude, insulting or threatening", ne: "असभ्य, अपमानजनक वा धम्कीपूर्ण" },
    expl: { en: "No client has the right to insult or threaten you. You can stop the job.", ne: "कुनै ग्राहकलाई तपाईंलाई अपमान गर्ने वा धम्क्याउने अधिकार छैन। तपाईं काम रोक्न सक्नुहुन्छ।" },
    reply: { en: "Please speak respectfully. If we cannot work respectfully, I will have to stop this job.", ne: "कृपया सम्मानपूर्वक कुरा गरिदिनुहोस्। सम्मानपूर्वक काम गर्न सकिएन भने मैले यो काम रोक्नुपर्ने हुन्छ।" },
  },
  flirty: {
    name: { en: "Romantic or flirty words", ne: "रोमान्टिक वा जिस्किने शब्दहरू" },
    expl: { en: "Flirty talk is not professional. You do not have to reply to it.", ne: "जिस्किने कुरा व्यावसायिक होइन। त्यसको जवाफ दिन तपाईं बाध्य हुनुहुन्न।" },
    reply: { en: "I am here for professional work only. Let us keep our conversation about the project.", ne: "म यहाँ व्यावसायिक कामका लागि मात्र छु। कृपया हाम्रो कुराकानी काममा मात्र राखौं।" },
  },
};

export const SAFETY_EXIT = { en: "Thank you for the opportunity. I will not be able to continue this job. I wish you the best.", ne: "अवसरका लागि धन्यवाद। म यो काम अगाडि बढाउन सक्दिनँ। तपाईंलाई शुभकामना।" };

export const SAFETY_EXAMPLES = [
  { label: 'sf_ex1', text: "Hi, are you still up? Send me a selfie so I know you are real, then we talk about the work." },
  { label: 'sf_ex2', text: "Why are you not calling? I said video call me now, don't waste my time." },
  { label: 'sf_ex3', text: "Hi Maya, the first logo draft looks good. Please change the color to dark green and send the second version by Friday." },
];

export const SHIELD_EXAMPLES = [
  { label: 'sh_ex1', text: "URGENT!!! Easy money from home. Earn $100 per hour just by liking videos. No experience needed. To start, pay a small registration fee of $20 and send your bank OTP to confirm your account. Message me on Telegram fast, only today!" },
  { label: 'sh_ex2', text: "Need someone to design some posts for my shop. Message me if interested." },
  { label: 'sh_ex3', text: "We need a logo for our coffee shop in Pokhara. Please design 2 logo options and send PNG files. Fixed pay $60, paid by bank transfer after delivery. Deadline: 5 days. Our shop is Himal Coffee, you can see our page online." },
];
