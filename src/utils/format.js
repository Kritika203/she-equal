// Number, date and text helpers.



export const fmtMoney = (n) => Number(n).toLocaleString('en-US');

export const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const fmt = (str, vars) => Object.keys(vars).reduce((acc, k) => acc.split('{' + k + '}').join(vars[k]), str);

export const slugify = (name) => (name || 'freelancer').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'freelancer';

export const initialsOf = (name) => (name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

const o = (en, ne) => ({ en, ne: ne || en });

export const spDigits = (lang, v) => lang === 'ne' ? String(v).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(v);

export const spClock = (iso, lang) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return spDigits(lang, d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }));
};

export const telHref = (phone) => 'tel:' + String(phone || '').replace(/[^\d+]/g, '');

export const toDigits = (n, lang) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
