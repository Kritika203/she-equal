// Safety check-ins and chat controls.

import { Check, CheckCircle2, ChevronLeft, EyeOff, HeartHandshake, Info, Moon, Phone, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNow } from '../../hooks/useNow.js';
import { isQuietActive } from '../../services/quietHours.js';
import { copyToClipboard } from '../../utils/clipboard.js';
import { fmt, spClock, spDigits, telHref } from '../../utils/format.js';
import { Disclaimer } from '../common/Disclaimer.jsx';
import { ToggleKnob } from '../privacy/Privacy.jsx';



const SP_INPUT = "w-full border border-[#E8E5E0] bg-white rounded-xl px-3.5 text-[13px] h-10 outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/20 disabled:bg-[#F9F9F7] transition-all";

const SP_PRIMARY = "inline-flex items-center justify-center gap-1.5 bg-[#C73E33] text-white rounded-full font-semibold text-[13px] hover:bg-[#AE332A] h-9 px-5 disabled:opacity-50 disabled:hover:bg-[#C73E33] transition-colors";

const SP_SECONDARY = "inline-flex items-center justify-center gap-1.5 border border-[#E8E5E0] bg-white text-[#374151] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 px-5 disabled:opacity-50 transition-all";

export function TrustedContactCard({ t, lang, user, allJobs, appliedJobs, trusted, setTrusted, checkin, setCheckin, showToast }) {
  const [editing, setEditing] = useState(false);
  const [nm, setNm] = useState("");
  const [ph, setPh] = useState("");
  const [jobId, setJobId] = useState("");
  const [mins, setMins] = useState(30);
  const [clientTyped, setClientTyped] = useState("");
  const planRef = useRef(null);
  const now = useNow(20000);

  const seen = new Set();
  const options = [];
  (Array.isArray(appliedJobs) ? appliedJobs : []).forEach(a => {
    if (!a || seen.has(a.jobId)) return;
    seen.add(a.jobId);
    const j = (allJobs || []).find(x => x.id === a.jobId);
    const title = (j && j.title) || a.title || '';
    const client = (j && j.clientName) || a.clientName || '';
    if (title || client) options.push({ id: a.jobId, title, client });
  });
  const hasJobs = options.length > 0;
  const selected = options.find(o => o.id === jobId) || options[0] || null;
  const clientName = hasJobs ? selected.client : clientTyped.trim();
  const jobTitle = hasJobs ? selected.title : "";
  const userName = (user && user.name) || '';

  const showForm = !trusted || editing;
  const saveContact = (e) => {
    e.preventDefault();
    if (!nm.trim() || ph.replace(/[^\d]/g, '').length < 3) return;
    setTrusted({ name: nm.trim(), phone: ph.trim() });
    setEditing(false);
  };
  const startEdit = () => { setNm(trusted.name); setPh(trusted.phone); setEditing(true); };

  const ck = checkin && typeof checkin === 'object' && checkin.byISO ? checkin : null;
  const waiting = !!ck && ck.status === 'waiting';
  const overdue = waiting && now > Date.parse(ck.byISO);
  const safe = !!ck && ck.status === 'safe';

  const controlsOff = !trusted || (!hasJobs && !clientName);
  const sig = `${selected ? selected.id : ''}|${clientName}|${mins}`;
  const planIso = () => {
    const c = planRef.current;
    if (c && c.sig === sig && Date.parse(c.iso) > Date.now()) return c.iso;
    const iso = new Date(Date.now() + mins * 60000).toISOString();
    planRef.current = { sig, iso };
    return iso;
  };
  const buildMsg = (iso) => fmt(t(jobTitle ? 'sp_ci_msg_job' : 'sp_ci_msg_nojob'), { contactName: trusted.name, clientName, jobTitle, time: spClock(iso, lang), userName });
  const copyPlan = async () => {
    if (controlsOff) return;
    await copyToClipboard(buildMsg(planIso()));
    showToast(t('sh_copied'));
  };
  const startCheckin = () => {
    if (controlsOff) return;
    const iso = planIso();
    planRef.current = null;
    setCheckin({ clientName, jobTitle, contactName: trusted.name, byISO: iso, status: 'waiting' });
  };
  const imSafe = () => setCheckin({ ...ck, status: 'safe' });

  const DURS = [[2, 'sp_ci_d2'], [30, 'sp_ci_d30'], [60, 'sp_ci_d60'], [120, 'sp_ci_d120']];
  const lbl = "block text-[13px] font-semibold text-[#111827] mb-1.5";
  return (
    <div>
      <div className={`rounded-xl p-4 border ${overdue ? 'bg-[#FFF5F5] border-[#C73E33]' : 'bg-white border-[#E8E5E0]'}`} role={overdue ? 'alert' : undefined}>
        <h2 className="font-semibold text-[17px] mb-1.5 flex items-center gap-2 text-[#111827]"><HeartHandshake size={20} className="text-[#C73E33] shrink-0" /> {t('sp_tc_title')}</h2>
        <p className="text-[13px] text-[#6B7280] mb-4">{t('sp_tc_intro')}</p>

        {showForm ? (
          <form onSubmit={saveContact} className="space-y-3">
            <div>
              <label htmlFor="sp-tc-name" className={lbl}>{t('sp_tc_name')}</label>
              <input id="sp-tc-name" type="text" autoComplete="off" value={nm} onChange={e => setNm(e.target.value)} className={SP_INPUT} />
            </div>
            <div>
              <label htmlFor="sp-tc-phone" className={lbl}>{t('sp_tc_phone')}</label>
              <input id="sp-tc-phone" type="tel" inputMode="tel" autoComplete="off" value={ph} onChange={e => setPh(e.target.value)} className={SP_INPUT} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button type="submit" disabled={!nm.trim() || ph.replace(/[^\d]/g, '').length < 3} className={SP_PRIMARY}>{t('save')}</button>
              {trusted && <button type="button" onClick={() => setEditing(false)} className={SP_SECONDARY}>{t('cancel')}</button>}
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2 border border-[#E8E5E0] bg-white rounded-xl p-3">
            <p className="min-w-0 text-[13px] font-medium text-[#111827] break-words">{trusted.name} — {trusted.phone}</p>
            <button type="button" onClick={startEdit} className="shrink-0 text-[12px] font-semibold text-[#6B7280] underline underline-offset-2 hover:text-[#374151] h-8 px-1 transition-colors">{t('sp_tc_edit')}</button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
          <h3 className="font-semibold text-[15px] text-[#111827] mb-3">{t('sp_ci_sub')}</h3>
          {!trusted && <p className="text-[13px] text-[#6B7280] mb-3">{t('sp_ci_add_first')}</p>}

          {overdue ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-[15px] text-[#111827]">{t('sp_ci_over_title')}</h4>
              <p className="text-[13px] text-[#374151]">{fmt(t(ck.jobTitle ? 'sp_ci_over_line' : 'sp_ci_over_line_nojob'), { clientName: ck.clientName, jobTitle: ck.jobTitle, time: spClock(ck.byISO, lang) })}</p>
              <a href={telHref(trusted ? trusted.phone : '')} className="w-full flex items-center justify-center gap-2 bg-[#C73E33] text-white rounded-full font-semibold text-[15px] hover:bg-[#AE332A] h-12 px-5 text-center transition-colors"><Phone size={18} className="shrink-0" /> <span>{fmt(t('sp_ci_call'), { contactName: ck.contactName })}</span></a>
              <button type="button" onClick={imSafe} className="w-full border border-[#E8E5E0] bg-white text-[#374151] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 px-5 transition-all">{t('sp_ci_safe_now')}</button>
            </div>
          ) : waiting ? (
            <div className="space-y-3">
              <p className="text-[13px] text-[#374151]">{fmt(t('sp_ci_wait'), { time: spClock(ck.byISO, lang) })}</p>
              <button type="button" onClick={imSafe} className={SP_PRIMARY + " w-full sm:w-auto"}><Check size={15} /> {t('sp_ci_safe_btn')}</button>
            </div>
          ) : (
            <>
              {safe && <p className="flex items-center gap-2 text-[13px] font-medium text-[#111827] bg-[#FFF5F5] border border-[#FED7D7] rounded-xl p-3 mb-4"><CheckCircle2 size={16} className="shrink-0 text-[#C73E33]" /> <span>{t('sp_ci_safe_done')}</span></p>}
              <fieldset disabled={!trusted} className={`space-y-4 min-w-0 ${!trusted ? 'opacity-60' : ''}`}>
                {hasJobs ? (
                  <div>
                    <label htmlFor="sp-ci-job" className={lbl}>{t('sp_ci_job')}</label>
                    <select id="sp-ci-job" value={selected.id} onChange={e => setJobId(e.target.value)} className={SP_INPUT}>
                      {options.map(o => <option key={o.id} value={o.id}>{[o.title, o.client].filter(Boolean).join(' — ')}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="sp-ci-client" className={lbl}>{t('sp_ci_client')}</label>
                    <input id="sp-ci-client" type="text" autoComplete="off" value={clientTyped} onChange={e => setClientTyped(e.target.value)} className={SP_INPUT} />
                  </div>
                )}
                <div role="group" aria-labelledby="sp-ci-in">
                  <div id="sp-ci-in" className={lbl}>{t('sp_ci_in')}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {DURS.map(([m, k]) => (
                      <button key={m} type="button" aria-pressed={mins === m} onClick={() => setMins(m)} className={`rounded-full border px-3.5 h-9 text-[13px] font-medium transition-all ${mins === m ? 'border-[#C73E33] bg-[#FFF5F5] text-[#C73E33]' : 'border-[#E8E5E0] bg-white text-[#374151] hover:bg-[#F9F9F7]'}`}>{t(k)}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button type="button" onClick={copyPlan} disabled={controlsOff} className={SP_SECONDARY}>{t('sp_ci_copy')}</button>
                  <button type="button" onClick={startCheckin} disabled={controlsOff} className={SP_PRIMARY}>{t('sp_ci_start')}</button>
                </div>
              </fieldset>
            </>
          )}
        </div>
      </div>
      <Disclaimer t={t} k="sp_disc_plan" className="mt-2 px-1" />
    </div>
  );
}

export function QuietHoursCard({ t, lang, quiet, setQuiet }) {
  const now = useNow(20000);
  const active = isQuietActive(quiet, now);
  const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
  const opts = (cur) => {
    const list = hours.includes(cur) ? hours : [...hours, cur].sort();
    return list.map(h => <option key={h} value={h}>{spDigits(lang, h)}</option>);
  };
  const lbl = "block text-[13px] font-semibold text-[#111827] mb-1.5";
  return (
    <div className="bg-white border border-[#E8E5E0] rounded-xl p-4">
      <h2 className="font-semibold text-[17px] mb-3 flex items-center gap-2 text-[#111827]"><Moon size={20} className="text-[#C73E33] shrink-0" /> {t('sp_qh_title')}</h2>
      <button type="button" onClick={() => setQuiet({ ...quiet, on: !quiet.on })} role="switch" aria-checked={quiet.on} aria-describedby="sp-qh-desc" className="w-full flex items-center justify-between gap-3 p-3 text-left border border-[#E8E5E0] rounded-xl hover:border-[#D1D5DB] transition-all">
        <span id="sp-qh-desc" className="text-[13px] text-[#374151]">{t('sp_qh_line')}</span>
        <ToggleKnob on={quiet.on} />
      </button>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label htmlFor="sp-qh-from" className={lbl}>{t('sp_qh_from')}</label>
          <select id="sp-qh-from" value={quiet.from} onChange={e => setQuiet({ ...quiet, from: e.target.value })} className={SP_INPUT}>{opts(quiet.from)}</select>
        </div>
        <div>
          <label htmlFor="sp-qh-to" className={lbl}>{t('sp_qh_to')}</label>
          <select id="sp-qh-to" value={quiet.to} onChange={e => setQuiet({ ...quiet, to: e.target.value })} className={SP_INPUT}>{opts(quiet.to)}</select>
        </div>
      </div>
      {quiet.on && (
        <p id="sp-qh-status" role="status" className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#374151]">
          {active ? <Moon size={15} className="shrink-0 text-[#C73E33]" /> : <Info size={15} className="shrink-0 text-[#9CA3AF]" />}
          <span>{active ? t('sp_qh_on_now') : fmt(t('sp_qh_starts'), { from: spDigits(lang, quiet.from) })}</span>
        </p>
      )}
    </div>
  );
}

export function EmergencyView({ t, trusted, onBack, onHide }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const big = "w-full flex items-center justify-center gap-2 rounded-full font-semibold text-[16px] h-14 px-5 text-center transition-colors";
  return (
    <div className="max-w-[700px] mx-auto space-y-4">
      <div className="bg-white border border-[#E8E5E0] rounded-xl p-4">
        <h1 className="text-[22px] font-semibold mb-2 text-[#111827]">{t('sp_em_title')}</h1>
        <p className="text-[13px] text-[#6B7280]">{t('sp_em_line')}</p>
      </div>
      <div className="space-y-3">
        <a href="tel:100" className={`${big} bg-[#C73E33] text-white hover:bg-[#AE332A]`}><Phone size={20} className="shrink-0" /> <span>{t('sp_em_police')}</span></a>
        <a href="tel:1145" className={`${big} border border-[#E8E5E0] bg-white text-[#374151] hover:bg-[#F9F9F7]`}><Phone size={20} className="shrink-0 text-[#C73E33]" /> <span>{t('sp_em_women')}</span></a>
        {trusted ? (
          <a href={telHref(trusted.phone)} className={`${big} border border-[#E8E5E0] bg-white text-[#374151] hover:bg-[#F9F9F7]`}><Phone size={20} className="shrink-0 text-[#C73E33]" /> <span className="min-w-0 break-words">{fmt(t('sp_em_call'), { contactName: trusted.name, phone: trusted.phone })}</span></a>
        ) : (
          <p className="text-[13px] text-[#6B7280] bg-white border border-[#E8E5E0] rounded-xl p-3.5">{t('sp_em_none')}</p>
        )}
      </div>
      <div className="space-y-2 pt-1">
        <button type="button" onClick={onHide} className="w-full flex items-center justify-center gap-1.5 border border-[#E8E5E0] bg-white text-[#374151] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 px-5 transition-all"><EyeOff size={15} /> {t('sp_em_hide')}</button>
        <button type="button" onClick={onBack} className="w-full flex items-center justify-center gap-1.5 text-[#6B7280] rounded-full font-semibold text-[13px] hover:bg-[#F3F4F6] h-9 px-5 transition-colors"><ChevronLeft size={15} /> {t('back')}</button>
      </div>
    </div>
  );
}

export function SafeTalkCard({ t, job }) {
  if (String(job.meetingTimeNepal || '').toLowerCase().includes('no meetings')) return null;
  return (
    <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 mb-6">
      <h3 className="font-semibold text-[15px] mb-3 flex items-center gap-2 text-[#111827]"><ShieldCheck size={18} className="text-[#C73E33] shrink-0" /> {t('sp_tm_title')}</h3>
      <ul className="space-y-2">
        {['sp_tm_1', 'sp_tm_2', 'sp_tm_3', 'sp_tm_4'].map(k => (
          <li key={k} className="flex items-start gap-2 text-[13px] text-[#374151]"><Check size={15} className="mt-0.5 shrink-0 text-[#C73E33]" /> <span>{t(k)}</span></li>
        ))}
      </ul>
    </div>
  );
}

export function EndChatModal({ t, onConfirm, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="fixed inset-0 z-[60] bg-black/30 flex items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="sp-es-title" className="bg-white rounded-xl border border-[#E8E5E0] p-5 w-full max-w-[360px] max-h-[90vh] overflow-y-auto">
        <h2 id="sp-es-title" className="font-semibold text-[17px] mb-2 text-[#111827]">{t('sp_es_title')}</h2>
        <p className="text-[13px] text-[#6B7280] mb-4">{t('sp_es_expl')}</p>
        <div className="space-y-2">
          <button type="button" onClick={onConfirm} className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-[13px] hover:bg-[#AE332A] h-9 px-5 transition-colors">{t('sp_es_confirm')}</button>
          <button type="button" onClick={onClose} className="w-full border border-[#E8E5E0] bg-white text-[#374151] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 px-5 transition-all">{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
}
