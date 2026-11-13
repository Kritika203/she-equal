// Format saved messages for evidence reports.

import { fmt } from '../utils/format.js';
import { SAFETY_DATA } from './safety.js';



export const VAULT_MASK = "••••••••";

export const evDigits = (lang, n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);

export const evDateTime = (iso, lang) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(lang === 'ne' ? 'ne-NP' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const evSource = (e, t) => e.source === 'chat'
  ? fmt(t('ev_src_chat'), { jobTitle: e.jobTitle || e.clientName || '' }).replace(/:\s*$/, '')
  : e.source === 'page' ? t('ev_src_page') : t('ev_src_none');

export const evCats = (e, lang) => (Array.isArray(e.categories) ? e.categories : []).filter(id => SAFETY_DATA[id]).map(id => SAFETY_DATA[id].name[lang]);

const evBody = (e, t, masked) => masked ? VAULT_MASK + '\n' + t('ev_hidden') : (e.text || '');

export const evToday = (lang) => new Date().toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function buildEvidenceText({ t, lang, name, items, masked }) {
  const lines = ['WorkPassport', t('ev_rep_title'), fmt(t('pdf_made_on'), { date: evToday(lang) }), '', fmt(t('ev_intro'), { name }), ''];
  items.forEach((e, i) => {
    lines.push(fmt(t('ev_item'), { n: evDigits(lang, i + 1) }));
    lines.push(evDateTime(e.date, lang));
    const cats = evCats(e, lang);
    if (cats.length) lines.push(cats.join(', '));
    lines.push(evSource(e, t));
    lines.push(evBody(e, t, masked));
    lines.push('');
  });
  lines.push(t('ev_foot'));
  return lines.join('\n');
}
