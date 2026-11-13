// Check whether quiet hours are active.



export const QUIET_DEFAULT = { on: false, from: "20:00", to: "07:00" };

const hhmmToMin = (s) => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || '')); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };

export const normQuiet = (q) => ({
  on: !!(q && q.on),
  from: q && hhmmToMin(q.from) !== null ? q.from : QUIET_DEFAULT.from,
  to: q && hhmmToMin(q.to) !== null ? q.to : QUIET_DEFAULT.to,
});

export function isQuietActive(q, nowMs) {
  if (!q || !q.on) return false;
  const f = hhmmToMin(q.from), to = hhmmToMin(q.to);
  if (f === null || to === null || f === to) return false;
  const d = new Date(nowMs);
  const m = d.getHours() * 60 + d.getMinutes();
  return f < to ? (m >= f && m < to) : (m >= f || m < to);
}
