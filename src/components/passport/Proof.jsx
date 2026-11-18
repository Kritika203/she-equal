// Add and display work samples.

import { AlertTriangle, ImagePlus, Link2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MASK } from '../../constants/privacy.js';
import { MAX_PROOF, proofDomain, resizeImageToJpeg, safeHref } from '../../services/evidence.js';
import { fmt, fmtMoney } from '../../utils/format.js';



export const PROOF_INPUT = "w-full h-10 border border-[#E8E5E0] bg-white rounded-xl px-3.5 text-[13px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/20 transition-all";

export const PROOF_BTN = "inline-flex items-center justify-center gap-1.5 border border-[#E8E5E0] bg-white text-[#374151] rounded-full px-4 font-semibold text-[13px] hover:border-[#D1D5DB] hover:bg-[#F9F9F7] h-9 transition-all";

function ProofChip({ children }) {
  return <span className="inline-flex items-center bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full text-[11px] font-semibold">{children}</span>;
}

export function ProofArea({ skill, items, t, digits, onAdd, onRemove }) {
  const [mode, setMode] = useState(null); // null | 'photo' | 'link'
  const [photo, setPhoto] = useState(null);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef(null);
  const full = items.length >= MAX_PROOF;
  const close = () => { setMode(null); setPhoto(null); setUrl(""); setNote(""); setErr(""); };

  const pickFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setErr("");
    try {
      const dataUrl = await resizeImageToJpeg(file);
      setPhoto(dataUrl); setMode('photo');
    } catch (ex) { setPhoto(null); setMode('photo'); setErr(t('pr_photo_err')); }
  };
  const savePhoto = () => {
    if (!photo) return;
    const res = onAdd(skill, { type: 'photo', src: photo, note: note.trim() });
    if (res === 'full') { setErr(t('pr_storage_err')); return; }
    close();
  };
  const saveLink = () => {
    const u = url.trim();
    if (!/^https?:\/\/\S+$/i.test(u)) { setErr(t('pr_link_err')); return; }
    const res = onAdd(skill, { type: 'link', src: u, note: note.trim() });
    if (res === 'full') { setErr(t('pr_storage_err')); return; }
    close();
  };

  return (
    <div className="mt-3.5 pt-3.5 border-t border-[#F3F4F6]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 mb-2">
        <h4 className="font-semibold text-[13px] text-[#111827]">{t('pr_title')}</h4>
        {items.length > 0 && <span className="text-[12px] text-[#9CA3AF]">{fmt(t('pr_count'), { n: digits(items.length) })}</span>}
      </div>

      {items.length === 0 && <p className="text-[13px] text-[#9CA3AF] mb-3">{t('pr_none')}</p>}

      {items.length > 0 && (
        <div className="space-y-2 mb-3">
          {items.map(it => (
            <div key={it.id} className="flex items-start gap-2.5 bg-[#F9F9F7] border border-[#E8E5E0] rounded-xl p-2.5">
              {it.type === 'photo'
                ? <img src={it.src} alt={it.note || skill} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E8E5E0]" />
                : <div className="w-12 h-12 rounded-lg bg-[#FFF5F5] flex items-center justify-center shrink-0"><Link2 size={18} className="text-[#C73E33]" /></div>}
              <div className="min-w-0 flex-1">
                {it.type === 'link' && (
                  <a href={safeHref(it.src)} target="_blank" rel="noopener noreferrer" className="block min-h-[20px] break-all">
                    <span className="block font-semibold text-[13px] text-[#111827] underline underline-offset-2">{proofDomain(it.src)}</span>
                    <span className="block text-[11px] text-[#9CA3AF]">{it.src}</span>
                  </a>
                )}
                {it.note && <p className="text-[13px] text-[#374151] break-words">{it.note}</p>}
                <div className="mt-1"><ProofChip>{t('pr_chip_you')}</ProofChip></div>
              </div>
              <button onClick={() => onRemove(skill, it.id)} aria-label={t('sf_delete')} title={t('sf_delete')} className="w-8 h-8 flex items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151] shrink-0 transition-colors"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}

      {mode === 'photo' && (
        <div className="border border-[#E8E5E0] rounded-xl p-3 mb-3 bg-white">
          {photo && <img src={photo} alt="" className="w-20 h-20 rounded-lg object-cover border border-[#E8E5E0] mb-2.5" />}
          {photo && (<>
            <label className="block text-[12px] font-semibold text-[#6B7280] mb-1" htmlFor={'pn-' + skill}>{t('pr_note_label')}</label>
            <input id={'pn-' + skill} value={note} onChange={e => setNote(e.target.value)} maxLength={140} placeholder={t('pr_note_ph')} className={PROOF_INPUT + " mb-2.5"} />
          </>)}
          {err && <p role="alert" className="text-[#C73E33] text-[12px] mb-2.5 flex items-start gap-1.5 bg-[#FFF5F5] p-2.5 rounded-lg"><AlertTriangle size={14} className="shrink-0 mt-0.5" /> <span>{err}</span></p>}
          <div className="flex flex-wrap gap-2">
            {photo && <button onClick={savePhoto} className="bg-[#C73E33] text-white rounded-full px-4 font-semibold text-[13px] hover:bg-[#AE332A] h-9 transition-colors">{t('save')}</button>}
            <button onClick={close} className={PROOF_BTN}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {mode === 'link' && (
        <div className="border border-[#E8E5E0] rounded-xl p-3 mb-3 bg-white">
          <label className="block text-[12px] font-semibold text-[#6B7280] mb-1" htmlFor={'pu-' + skill}>{t('pr_link_label')}</label>
          <input id={'pu-' + skill} type="url" inputMode="url" value={url} onChange={e => { setUrl(e.target.value); setErr(""); }} placeholder="https://" className={PROOF_INPUT + " mb-2.5"} />
          <label className="block text-[12px] font-semibold text-[#6B7280] mb-1" htmlFor={'pl-' + skill}>{t('pr_note_label')}</label>
          <input id={'pl-' + skill} value={note} onChange={e => setNote(e.target.value)} maxLength={140} placeholder={t('pr_note_ph')} className={PROOF_INPUT + " mb-2.5"} />
          {err && <p role="alert" className="text-[#C73E33] text-[12px] mb-2.5 flex items-start gap-1.5 bg-[#FFF5F5] p-2.5 rounded-lg"><AlertTriangle size={14} className="shrink-0 mt-0.5" /> <span>{err}</span></p>}
          <div className="flex flex-wrap gap-2">
            <button onClick={saveLink} className="bg-[#C73E33] text-white rounded-full px-4 font-semibold text-[13px] hover:bg-[#AE332A] h-9 transition-colors">{t('save')}</button>
            <button onClick={close} className={PROOF_BTN}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {!full && mode === null && (
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={() => { setErr(""); setNote(""); fileRef.current && fileRef.current.click(); }} className={PROOF_BTN}><ImagePlus size={15} /> {t('pr_add_photo')}</button>
          <button onClick={() => { setErr(""); setNote(""); setUrl(""); setMode('link'); }} className={PROOF_BTN}><Link2 size={15} /> {t('pr_add_link')}</button>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} className="hidden" aria-label={t('pr_add_photo')} />
    </div>
  );
}

export function WorkSamples({ groups, t }) {
  if (!groups.length) return null;
  return (
    <section className="mb-8">
      <h2 className="font-semibold text-[18px] mb-3 text-[#111827]">{t('pr_gallery_title')}</h2>
      <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 space-y-5">
        {groups.map(([skill, items]) => (
          <div key={skill}>
            <h3 className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">{skill}</h3>
            <div className="space-y-2">
              {items.map(it => (
                <div key={it.id} className="flex items-start gap-3">
                  {it.type === 'photo'
                    ? <img src={it.src} alt={it.note || skill} className="w-[90px] h-[90px] rounded-lg object-cover shrink-0 border border-[#E8E5E0]" />
                    : null}
                  <div className="min-w-0 flex-1">
                    {it.type === 'link' && (
                      <a href={safeHref(it.src)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 bg-[#F9F9F7] border border-[#E8E5E0] rounded-lg px-2.5 py-2 mb-1">
                        <span className="w-8 h-8 rounded-lg bg-[#FFF5F5] flex items-center justify-center shrink-0"><Link2 size={15} className="text-[#C73E33]" /></span>
                        <span className="min-w-0 font-semibold text-[13px] text-[#111827] break-all">{proofDomain(it.src)}</span>
                      </a>
                    )}
                    {it.note && <p className="text-[13px] text-[#374151] break-words mb-1">{it.note}</p>}
                    <ProofChip>{t('pr_chip_freelancer')}</ProofChip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[#9CA3AF] mt-2">{t('pr_honesty')}</p>
    </section>
  );
}

export function PassportPrint({ t, lang, user, levels, evidenceMap, confirmedList, provenCount, earned, hideMoney, digits }) {
  const today = new Date().toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const earnedTxt = hideMoney ? MASK : `NPR ${fmtMoney(earned)}`;
  return createPortal(
    <div className="passport-print">
      <div className="pp-brand">WorkPassport</div>
      <h1 className="pp-name">{user.name}</h1>
      {user.headline && <p><strong>{user.headline}</strong></p>}
      {user.about && <p>{user.about}</p>}
      <div className="pp-stats">
        <div><strong>{digits(provenCount)}</strong><span>{t('pp_stat_skills')}</span></div>
        <div><strong>{digits(confirmedList.length)}</strong><span>{t('pp_stat_jobs')}</span></div>
        <div><strong>{earnedTxt}</strong><span>{t('pp_stat_earned')}</span></div>
      </div>

      <h2>{t('pdf_skills_proof')}</h2>
      {levels.map(({ skill, level }) => {
        const items = evidenceMap[skill] || [];
        return (
          <div key={skill} className="pp-skill">
            <div className="pp-skill-head"><strong>{skill}</strong> — {t('pp_lvl_' + level)} — {fmt(t('pr_count'), { n: digits(items.length) })}</div>
            {items.map(it => (
              <div key={it.id} className="pp-item">
                {it.type === 'photo' && <img src={it.src} alt="" />}
                <div>
                  {it.type === 'link' && <div className="pp-url">{it.src}</div>}
                  {it.note && <div>{it.note}</div>}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      <h2>{t('pp_work_title')}</h2>
      {confirmedList.length === 0 ? <p>{t('pp_public_empty')}</p> : confirmedList.map(j => (
        <div key={j.id} className="pp-job"><strong>{j.title}</strong> — {j.clientName} — {hideMoney ? MASK : `NPR ${fmtMoney(j.budgetUSD * 133)}`}</div>
      ))}

      {(user.availability || user.rateNote || (Array.isArray(user.languages) && user.languages.length) || (Array.isArray(user.tools) && user.tools.length) || (Array.isArray(user.training) && user.training.some(x => x && x.title))) && (
        <>
          <h2>{t('pf_details')}</h2>
          {(Array.isArray(user.languages) && user.languages.length > 0) && <p><strong>{t('pf_languages')}:</strong> {user.languages.join(', ')}</p>}
          {user.availability && <p><strong>{t('pf_availability')}:</strong> {user.availability}</p>}
          {user.rateNote && <p><strong>{t('pf_rate')}:</strong> {user.rateNote}</p>}
          {(Array.isArray(user.tools) && user.tools.length > 0) && <p><strong>{t('pf_tools')}:</strong> {user.tools.join(', ')}</p>}
          {(Array.isArray(user.training) ? user.training : []).filter(x => x && x.title).map((tr, i) => (
            <p key={i}><strong>{t('pf_training')}:</strong> {tr.title}{tr.where ? ` — ${tr.where}` : ''}{tr.year ? ` (${tr.year})` : ''}</p>
          ))}
        </>
      )}

      <p className="pp-foot">{t('pdf_footer')}</p>
      <p className="pp-foot">{fmt(t('pdf_made_on'), { date: today })}</p>
    </div>,
    document.body
  );
}
