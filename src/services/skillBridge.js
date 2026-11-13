// Compare user skills with sample jobs.



export const GAP_GUIDE = {
  "Excel / Spreadsheets": { name: "GCFGlobal — Excel basics (free)", url: "https://edu.gcfglobal.org/en/excel/", task: "Make a price list for 10 products: name, price and SKU — the same work as real data-entry jobs." },
  "Customer Chat Support": { name: "HubSpot Academy — free customer service courses", url: "https://academy.hubspot.com/", task: "Write kind replies to 3 common customer questions: the price, the delivery time, and a late order." },
  "Video Editing": { name: "CapCut — free video editor", url: "https://www.capcut.com/", task: "Cut one 30-second video for a local shop: add text, music and the shop's name." },
  "Nepali Writing": { name: "YouTube — Nepali typing practice videos (free)", url: "https://www.youtube.com/results?search_query=nepali+typing+practice", task: "Write a 5-line product description in Nepali for something sold near your home." },
  "Translation": { name: "YouTube — Nepali typing practice videos (free)", url: "https://www.youtube.com/results?search_query=nepali+typing+practice", task: "Translate a short English notice (about 10 lines) into Nepali. Ask a friend to read it and tell you if it is clear." },
};

export const GAP_FALLBACK = { name: "GCFGlobal — free lessons", url: "https://edu.gcfglobal.org/", task: "Practise with one small real task, then save your work as proof." };

export function computeSkillBridge(jobs, userSkills) {
  const mine = new Set(userSkills || []);
  const reqs = jobs.map(j => [...new Set(j.skillsRequired || [])]);
  const total = reqs.length;
  const matched = reqs.filter(r => r.every(s => mine.has(s))).length;
  const demand = {}, unlock = {}, pair = {}, joint = {};
  const key = (a, b) => (a < b ? a + '\u0000' + b : b + '\u0000' + a);
  reqs.forEach(r => {
    const missing = r.filter(s => !mine.has(s));
    r.forEach(s => { demand[s] = (demand[s] || 0) + 1; });
    if (missing.length === 1) unlock[missing[0]] = (unlock[missing[0]] || 0) + 1;
    for (let i = 0; i < r.length; i++) for (let k = i + 1; k < r.length; k++) {
      const kk = key(r[i], r[k]);
      pair[kk] = (pair[kk] || 0) + 1;
      if (missing.length === 2 && missing.includes(r[i]) && missing.includes(r[k])) joint[kk] = (joint[kk] || 0) + 1;
    }
  });
  const gaps = Object.keys(demand).filter(s => !mine.has(s)).map(s => ({ skill: s, demand: demand[s], unlock: unlock[s] || 0 }))
    .sort((a, b) => b.unlock - a.unlock || b.demand - a.demand || a.skill.localeCompare(b.skill));
  const gapNames = gaps.map(g => g.skill);
  gaps.forEach(g => {
    g.partner = null;
    if (g.unlock === 0) {
      gapNames.filter(o => o !== g.skill && (pair[key(g.skill, o)] || 0) >= 2 && (joint[key(g.skill, o)] || 0) > 0)
        .map(o => ({ other: o, joint: joint[key(g.skill, o)] }))
        .sort((a, b) => b.joint - a.joint || a.other.localeCompare(b.other))
        .slice(0, 1).forEach(x => { g.partner = x; });
    }
  });
  const bundles = Object.keys(pair).filter(k => pair[k] >= 2).map(k => { const [a, b] = k.split('\u0000'); return { a, b, n: pair[k] }; })
    .sort((x, y) => y.n - x.n || x.a.localeCompare(y.a) || x.b.localeCompare(y.b)).slice(0, 5);
  return { total, matched, gaps, bundles };
}
