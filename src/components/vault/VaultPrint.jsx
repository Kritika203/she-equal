// Print layout for saved evidence.

import { createPortal } from 'react-dom';
import { VAULT_MASK, evCats, evDateTime, evDigits, evSource, evToday } from '../../services/vault.js';
import { fmt } from '../../utils/format.js';



export function VaultPrint({ t, lang, name, items, masked }) {
  return createPortal(
    <div className="vault-print">
      <div className="pp-brand">WorkPassport</div>
      <h1 className="pp-name">{t('ev_rep_title')}</h1>
      <p>{fmt(t('pdf_made_on'), { date: evToday(lang) })}</p>
      <p>{fmt(t('ev_intro'), { name })}</p>
      {items.map((e, i) => {
        const cats = evCats(e, lang);
        return (
          <div key={i} className="vp-item">
            <h2>{fmt(t('ev_item'), { n: evDigits(lang, i + 1) })}</h2>
            <div>{evDateTime(e.date, lang)}</div>
            {cats.length > 0 && <div>{cats.join(', ')}</div>}
            <div>{evSource(e, t)}</div>
            <p className="vp-text">{masked ? <>{VAULT_MASK}<br />{t('ev_hidden')}</> : e.text}</p>
          </div>
        );
      })}
      <p className="pp-foot">{t('ev_foot')}</p>
    </div>,
    document.body
  );
}
