// Saved message evidence screen.

import { ChevronLeft, Download, Info, Lock, Trash2 } from 'lucide-react';
import { VaultPrint } from '../components/vault/VaultPrint.jsx';
import { printDocument } from '../services/print.js';
import { VAULT_MASK, buildEvidenceText, evCats, evDateTime, evDigits, evSource } from '../services/vault.js';
import { fmt } from '../utils/format.js';



export function EvidenceVaultPage({ t, lang, user, navTo, showToast, evidence, setEvidence, masked }) {
  const list = Array.isArray(evidence) ? evidence : [];
  const items = list.map((e, idx) => ({ e, idx })).filter(x => x.e && typeof x.e === 'object')
    .sort((a, b) => (new Date(b.e.date).getTime() || 0) - (new Date(a.e.date).getTime() || 0));
  const plain = items.map(x => x.e);
  const name = (user && user.name) || 'WorkPassport user';
  const del = (idx) => { setEvidence(prev => (Array.isArray(prev) ? prev : []).filter((_, i) => i !== idx)); showToast(t('sf_deleted')); };
  const copyReport = async () => {
    const str = buildEvidenceText({ t, lang, name, items: plain, masked });
    try { await navigator.clipboard.writeText(str); } catch (err) {
      try { const ta = document.createElement('textarea'); ta.value = str; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('sh_copied'));
  };
  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {plain.length > 0 && <VaultPrint t={t} lang={lang} name={name} items={plain} masked={masked} />}
      <button onClick={() => navTo('shield', { scrollTo: 'safety', n: Date.now() })} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] -ml-2 px-2"><ChevronLeft size={20} /> {t('sf_title')}</button>
      <div>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{t('ev_title')}</h1>
        <p className="text-base text-[#4A4744] flex items-start gap-2 mb-2"><Lock size={18} className="shrink-0 mt-1 text-[#C73E33]" /> <span>{t('ev_private')}</span></p>
        <p className="text-base font-semibold text-[#1C1B1A]">{fmt(t('ev_count'), { n: evDigits(lang, plain.length) })}</p>
      </div>

      {plain.length === 0 ? (
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-lg text-[#4A4744]">{t('ev_empty')}</div>
      ) : (
        <>
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => printDocument('vault')} className="flex-1 bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-5 inline-flex items-center justify-center gap-2"><Download size={20} /> {t('ev_pdf')}</button>
              <button onClick={copyReport} className="flex-1 bg-white border border-[#E3E0D9] text-[#1C1B1A] py-3.5 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-5">{t('ev_copy')}</button>
            </div>
            <p className="text-sm text-[#6E6963] mt-4 flex items-start gap-1.5"><Info size={14} className="mt-[3px] shrink-0" /> <span>{t('ev_caution')}</span></p>
          </div>
          <div className="space-y-4">
            {items.map(({ e, idx }) => {
              const cats = evCats(e, lang);
              return (
                <div key={idx} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-sm font-semibold text-[#6E6963]">{evDateTime(e.date, lang)}</span>
                    <button onClick={() => del(idx)} aria-label={t('sf_delete')} className="shrink-0 min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center rounded-full text-[#4A4744] hover:bg-[#F6F4EF]"><Trash2 size={20} /></button>
                  </div>
                  {cats.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cats.map(c => <span key={c} className="bg-[#FAF0EE] text-[#AE332A] px-3 py-1 rounded-full text-[13px] font-semibold">{c}</span>)}
                    </div>
                  )}
                  {masked ? (
                    <div className="mb-3">
                      <p className="text-base text-[#1C1B1A] tracking-widest">{VAULT_MASK}</p>
                      <p className="text-sm text-[#6E6963] mt-1">{t('ev_hidden')}</p>
                    </div>
                  ) : (
                    <p className="text-base text-[#1C1B1A] break-words whitespace-pre-wrap mb-3">{e.text}</p>
                  )}
                  <p className="text-sm text-[#6E6963] break-words">{evSource(e, t)}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
