// WorkShield and safety screen.

import { AlertTriangle, ArrowRight, Bookmark, Check, CheckCircle2, HeartHandshake, Lock, Phone, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { EmergencyView, QuietHoursCard, TrustedContactCard } from '../components/safety/SafetyTools.jsx';
import { DEFAULT_RULES, RULE_KEYS } from '../constants/skills.js';
import { DUMMY_JOBS } from '../data/jobs.js';
import { QUIET_DEFAULT } from '../services/quietHours.js';
import { SAFETY_DATA, SAFETY_EXAMPLES, SAFETY_EXIT, SAFETY_RULE_OF, SHIELD_EXAMPLES, analyzeJob, analyzeMessage, analyzeText, verdictOf } from '../services/safety.js';
import { fmt, fmtDate } from '../utils/format.js';



export function ShieldSafetyPage({ t, lang, user, navTo, showToast, history, setHistory, evidence, setEvidence, scrollTo, scrollKey, allJobs = [], appliedJobs = [], trusted = null, setTrusted = () => {}, checkin = null, setCheckin = () => {}, quiet = QUIET_DEFAULT, setQuiet = () => {}, onQuickHide = () => {} }) {
  const [emergency, setEmergency] = useState(false);
  useEffect(() => {
    if (scrollTo === 'safety') {
      const el = document.getElementById('safety-section');
      if (el) el.scrollIntoView({ block: 'start' });
    }
  }, [scrollTo, scrollKey]);

  const [text, setText] = useState("");
  const [wsResult, setWsResult] = useState(null);
  const [sfResult, setSfResult] = useState(null);
  const [emptyErr, setEmptyErr] = useState(false);
  const wsRef = useRef(null);
  const sfRef = useRef(null);
  const topRef = useRef(null);
  const other = lang === 'ne' ? 'en' : 'ne';
  const rules = (user && user.safetyRules) || DEFAULT_RULES;

  useEffect(() => {
    if (wsResult && wsRef.current) wsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [wsResult]);

  const runText = () => {
    if (!text.trim()) { setEmptyErr(true); return; }
    setEmptyErr(false);
    const f = analyzeText(text);
    setWsResult({ findings: f, verdict: verdictOf(f), snippet: text.trim().slice(0, 60) });
    setSfResult({ cats: analyzeMessage(text), text: text.trim() });
  };
  const runJob = (job) => {
    const f = analyzeJob(job);
    setWsResult({ findings: f, verdict: verdictOf(f), snippet: job.title });
    setSfResult(null);
  };
  const reset = () => {
    setText(""); setWsResult(null); setSfResult(null);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 0);
  };
  const save = () => {
    if (!wsResult) return;
    setHistory(prev => [{ snippet: wsResult.snippet, verdict: wsResult.verdict, date: new Date().toISOString() }, ...(Array.isArray(prev) ? prev : [])].slice(0, 10));
    showToast(t('sh_saved_toast'));
  };
  const copyQ = async (q) => {
    try { await navigator.clipboard.writeText(q); } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = q; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('sh_copied'));
  };
  const clearHistory = () => { setHistory([]); showToast(t('sh_cleared')); };
  const copy = copyQ;
  const saveProof = () => {
    if (!sfResult) return;
    setEvidence(prev => [{ text: sfResult.text.slice(0, 500), categories: sfResult.cats, date: new Date().toISOString(), source: 'page' }, ...(Array.isArray(prev) ? prev : [])].slice(0, 20));
    showToast(t('sf_saved_toast'));
  };
  const delProof = (index) => {
    setEvidence(prev => (Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []));
    showToast(t('sf_deleted'));
  };

  const VerdictIcon = wsResult ? (wsResult.verdict === 'danger' ? ShieldAlert : wsResult.verdict === 'warning' ? AlertTriangle : ShieldCheck) : null;
  const questions = wsResult ? ['nopay', 'vague', 'lowpay'].filter(id => wsResult.findings.yellow.includes(id)) : [];
  const pillStyle = { danger: 'bg-[#C73E33] text-white', warning: 'bg-[#FFF5F5] text-[#C73E33]', ok: 'bg-[#F3F4F6] text-[#374151]' };
  const crossed = sfResult && sfResult.cats.length > 0;
  const checked = !!(wsResult && sfResult);
  const examples = [...SHIELD_EXAMPLES, ...SAFETY_EXAMPLES];

  if (emergency) return <EmergencyView t={t} trusted={trusted} onBack={() => setEmergency(false)} onHide={onQuickHide} />;

  return (
    <div className="max-w-[780px] mx-auto space-y-6">
      {/* ── Check a Job or Message ── */}
      <div className="space-y-5">
        <div ref={topRef} className="scroll-mt-[128px] md:scroll-mt-24">
          <h1 className="text-[22px] font-semibold mb-2 text-[#111827]">{t('sh_title')}</h1>
          <p className="text-[13px] text-[#6B7280] mb-4">{t('ws_one_intro')}</p>
          <label htmlFor="ws-one-text" className="block font-semibold text-[13px] text-[#111827] mb-1.5">{t('ws_one_label')}</label>
          <textarea id="ws-one-text" value={text} onChange={e => { setText(e.target.value); setEmptyErr(false); }} placeholder={t('sh_placeholder')} className="w-full min-h-[110px] border border-[#E8E5E0] bg-white rounded-xl px-3.5 py-3 text-[13px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/20 mb-3 transition-all" />
          {emptyErr && <p role="alert" className="text-[#C73E33] text-[12px] mb-3 flex items-start gap-1.5 bg-[#FFF5F5] p-2.5 rounded-lg"><ShieldAlert size={14} className="shrink-0 mt-0.5" /> <span>{t('err_paste_first')}</span></p>}
          <button onClick={runText} className={`w-full sm:w-auto sm:px-8 rounded-full font-semibold text-[13px] h-9 transition-all ${!text.trim() ? 'opacity-60' : ''} ${checked ? 'bg-white border border-[#E8E5E0] text-[#374151] hover:bg-[#F9F9F7]' : 'bg-[#C73E33] text-white hover:bg-[#AE332A]'}`}>{t('sh_check')}</button>
          <p className="text-[11px] text-[#9CA3AF] mt-2 flex items-center gap-1"><Lock size={12} className="shrink-0" /> {t('sh_private')}</p>
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1.5">{t('sh_try')}</div>
            <div className="flex flex-wrap gap-1.5">
              {examples.map(ex => (
                <button key={ex.label} onClick={() => { setText(ex.text); setEmptyErr(false); }} className="border border-[#E8E5E0] bg-white text-[#374151] rounded-full px-3.5 font-medium text-[12px] hover:border-[#D1D5DB] hover:bg-[#F9F9F7] h-8 transition-all">{t(ex.label)}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── WorkShield result ── */}
        {wsResult && (
          <div ref={wsRef} className="scroll-mt-[128px] md:scroll-mt-24 space-y-4">
            <div className={`rounded-xl border p-4 flex items-start gap-3 ${wsResult.verdict === 'danger' ? 'bg-[#FFF5F5] border-[#C73E33]' : 'bg-white border-[#E8E5E0]'}`}>
              <VerdictIcon size={28} className={`shrink-0 ${wsResult.verdict === 'danger' ? 'text-[#C73E33]' : 'text-[#111827]'}`} />
              <div>
                <h2 className="text-[17px] leading-snug font-semibold mb-1 text-[#111827]">{t('sh_v_' + wsResult.verdict)}</h2>
                <p className="text-[13px] text-[#6B7280]">{t('sh_s_' + wsResult.verdict)}</p>
              </div>
            </div>

            <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 space-y-2.5">
              {wsResult.findings.red.map(id => <div key={id} className="flex items-start gap-2 text-[13px] text-[#374151]"><ShieldAlert size={16} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sh_f_' + id)}</span></div>)}
              {wsResult.findings.yellow.map(id => <div key={id} className="flex items-start gap-2 text-[13px] text-[#374151]"><AlertTriangle size={16} className="shrink-0 mt-0.5 text-[#111827]" /> <span>{t('sh_f_' + id)}</span></div>)}
              {wsResult.verdict !== 'danger' && wsResult.findings.green.map(id => <div key={id} className="flex items-start gap-2 text-[13px] text-[#374151]"><CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#111827]" /> <span>{t('sh_f_' + id)}</span></div>)}
            </div>

            <div className="bg-[#F9F9F7] border border-[#E8E5E0] rounded-xl p-4">
              <h3 className="font-semibold text-[15px] text-[#111827] mb-3">{t('sh_next_title')}</h3>
              <ul className="space-y-2 text-[13px] text-[#374151]">
                {[1, 2, 3].map(n => <li key={n} className="flex items-start gap-2"><ArrowRight size={14} className="shrink-0 mt-0.5" /> <span>{t(`sh_n_${wsResult.verdict}${wsResult.verdict === 'ok' ? n : n}`)}</span></li>)}
              </ul>
            </div>

            {questions.length > 0 && (
              <div>
                <h3 className="font-semibold text-[15px] text-[#111827] mb-2">{t('sh_q_title')}</h3>
                <div className="space-y-2">
                  {questions.map(id => (
                    <div key={id} className="bg-white border border-[#E8E5E0] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                      <p className="text-[13px] text-[#374151]">{t('sh_q_' + id)}</p>
                      <button onClick={() => copyQ(t('sh_q_' + id))} className="shrink-0 border border-[#E8E5E0] bg-white rounded-full px-3.5 font-semibold text-[12px] hover:border-[#D1D5DB] h-8 transition-all">{t('sh_copy')}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={reset} className="flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-[13px] hover:bg-[#AE332A] h-9 px-4 transition-colors">{t('sh_check_another')}</button>
              <button onClick={save} className="flex-1 bg-white border border-[#E8E5E0] text-[#374151] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 px-4 transition-all">{t('sh_save')}</button>
            </div>
            <Disclaimer t={t} k="disc_shield" />
          </div>
        )}

        {/* ── Safety result ── */}
        {sfResult && (
          <div ref={sfRef} className="scroll-mt-[128px] md:scroll-mt-24 space-y-4">
            {crossed ? (
              <>
                <div className="bg-[#FFF5F5] border border-[#C73E33] rounded-xl p-4 flex items-start gap-3">
                  <ShieldAlert size={24} className="shrink-0 text-[#C73E33]" />
                  <div>
                    <h2 className="text-[17px] leading-snug font-semibold mb-1 text-[#111827]">{t('sf_cross_title')}</h2>
                    <p className="text-[13px] text-[#6B7280]">{t('sf_cross_line')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {sfResult.cats.map(id => {
                    const ruleKey = SAFETY_RULE_OF[id];
                    const off = ruleKey && !rules[ruleKey];
                    return (
                      <div key={id} className="bg-white border border-[#E8E5E0] rounded-xl p-3.5">
                        <div className="font-semibold text-[14px] mb-1 flex items-start gap-1.5 text-[#111827]"><AlertTriangle size={15} className="shrink-0 mt-0.5" /> <span>{SAFETY_DATA[id].name[lang]}</span></div>
                        <p className="text-[13px] text-[#6B7280] mb-2">{SAFETY_DATA[id].expl[lang]}</p>
                        <p className="text-[12px] font-semibold text-[#374151]">
                          {ruleKey ? fmt(t('sf_breaks'), { rule: t('rule_' + ruleKey) }) : t('sf_no_one')}
                          {off && <span className="font-normal text-[#9CA3AF]">{t('sf_off_note')}</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck size={24} className="shrink-0 text-[#111827]" />
                <div>
                  <h2 className="text-[17px] leading-snug font-semibold mb-1 text-[#111827]">{t('sf_ok_title')}</h2>
                  <p className="text-[13px] text-[#6B7280]">{t('sf_ok_line')}</p>
                </div>
              </div>
            )}

            <div>
              <h2 className="font-semibold text-[17px] text-[#111827] mb-1.5">{t('sf_reply_title')}</h2>
              <p className="text-[13px] text-[#6B7280] mb-3">{t('sf_reply_intro')}</p>
              <div className="space-y-3">
                {[...sfResult.cats.map(id => ({ id, label: SAFETY_DATA[id].name[lang], reply: SAFETY_DATA[id].reply })), { id: 'exit', label: t('sf_exit_label'), reply: SAFETY_EXIT }].map(r => (
                  <div key={r.id} className="bg-white border border-[#E8E5E0] rounded-xl p-3.5">
                    <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">{r.label}</div>
                    <p className="text-[13px] text-[#374151] mb-1.5">{r.reply[lang]}</p>
                    <p className="text-[12px] text-[#9CA3AF] mb-2.5">{r.reply[other]}</p>
                    <button onClick={() => copy(r.reply[lang])} className="border border-[#E8E5E0] bg-white rounded-full px-3.5 font-semibold text-[12px] hover:border-[#D1D5DB] h-8 transition-all">{t('sh_copy')}</button>
                  </div>
                ))}
              </div>
              <Disclaimer t={t} k="disc_reply" className="mt-3" />
            </div>

            <div className="bg-[#F9F9F7] border border-[#E8E5E0] rounded-xl p-4">
              <h3 className="font-semibold text-[15px] text-[#111827] mb-3">{t('sf_next_title')}</h3>
              <ol className="space-y-3 text-[13px] text-[#374151]">
                {[1, 2, 3, 4].map(n => (
                  <li key={n} className="flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-white border border-[#E8E5E0] flex items-center justify-center text-[11px] font-semibold text-[#374151]">{lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : n}</span>
                    <span className="flex-1">
                      {t('sf_step' + n)}
                      {n === 2 && <button onClick={saveProof} className="mt-2 w-full sm:w-auto bg-[#C73E33] text-white px-4 rounded-full font-semibold text-[13px] hover:bg-[#AE332A] h-9 flex items-center justify-center transition-colors">{t('sf_save_proof')}</button>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* ── Check a FirstWork job ── */}
        <div>
          <h2 className="font-semibold text-[17px] text-[#111827] mb-3">{t('sh_or_job')}</h2>
          <div className="bg-white border border-[#E8E5E0] rounded-xl divide-y divide-[#F3F4F6] overflow-hidden">
            {DUMMY_JOBS.map(job => (
              <button key={job.id} onClick={() => runJob(job)} className="w-full text-left px-3.5 py-2.5 hover:bg-[#F9F9F7] flex items-center justify-between gap-2 transition-colors">
                <span className="min-w-0">
                  <span className="block font-semibold text-[13px] text-[#111827]">{job.title}</span>
                  <span className="block text-[12px] text-[#9CA3AF]">{job.clientName}</span>
                </span>
                {job.paymentVerified && <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[#166534]"><CheckCircle2 size={13} /> {t('payment_verified')}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── History ── */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="font-semibold text-[17px] text-[#111827]">{t('sh_hist_title')}</h2>
            {history.length > 0 && <button onClick={clearHistory} className="text-[12px] font-semibold text-[#9CA3AF] underline underline-offset-2 hover:text-[#374151] h-8 px-1 transition-colors">{t('sh_clear')}</button>}
          </div>
          {history.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF]">{t('sh_hist_empty')}</p>
          ) : (
            <div className="bg-white border border-[#E8E5E0] rounded-xl divide-y divide-[#F3F4F6]">
              {history.map((h, i) => (
                <div key={i} className="p-3 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                  <span className={`shrink-0 self-start px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${pillStyle[h.verdict]}`}>{t('sh_pill_' + h.verdict)}</span>
                  <span className="flex-1 min-w-0 text-[13px] text-[#374151] break-words">{h.snippet}</span>
                  <span className="text-[11px] text-[#9CA3AF] shrink-0">{fmtDate(h.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Safety & harassment support section ── */}
      <div id="safety-section" className="scroll-mt-[128px] md:scroll-mt-24 bg-[#FFF5F5] border border-[#FED7D7] rounded-xl p-4 flex items-start gap-3">
        <HeartHandshake size={22} className="text-[#C73E33] shrink-0 mt-0.5" />
        <div>
          <h2 className="font-semibold text-[17px] text-[#111827] mb-1">{t('sfs_banner_title')}</h2>
          <p className="text-[13px] text-[#6B7280]">{t('sfs_banner_intro')}</p>
        </div>
      </div>
      <button type="button" onClick={() => setEmergency(true)} className="w-full sm:w-auto flex items-center justify-center gap-1.5 border border-[#E8E5E0] bg-white text-[#374151] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 px-5 transition-all"><Phone size={15} className="text-[#C73E33]" /> {t('sp_em_btn')}</button>

      {/* ── Stay safe section ── */}
      <div className="space-y-5">
        <div>
          <h1 className="text-[22px] font-semibold mb-2 text-[#111827]">{t('sf_title')}</h1>
          <p className="text-[13px] text-[#6B7280] mb-4">{t('sf_intro')}</p>
          <div className="bg-[#FFF5F5] rounded-xl p-4">
            <h2 className="font-semibold text-[15px] text-[#111827] mb-3">{t('sf_three_title')}</h2>
            <div className="space-y-2.5 text-[13px] text-[#374151]">
              <div className="flex items-start gap-2"><Shield size={16} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r1')}</span></div>
              <div className="flex items-start gap-2"><Lock size={16} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r2')}</span></div>
              <div className="flex items-start gap-2"><Bookmark size={16} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r3')}</span></div>
            </div>
          </div>
        </div>

        {/* ── Safety rules ── */}
        <div className="bg-white border border-[#E8E5E0] rounded-xl p-4">
          <h2 className="font-semibold text-[17px] text-[#111827] mb-3">{t('pp_rules_title')}</h2>
          <div className="space-y-2 mb-4">
            {RULE_KEYS.map(k => (
              <div key={k} className="flex items-center justify-between gap-3 p-3 border border-[#E8E5E0] rounded-xl">
                <span className="text-[13px] font-medium text-[#374151]">{t('rule_' + k)}</span>
                <span className={`shrink-0 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${rules[k] ? 'bg-white border border-[#111827] text-[#111827]' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>{rules[k] && <Check size={11} />}{rules[k] ? t('sf_on') : t('sf_off')}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navTo('passport')} className="w-full sm:w-auto border border-[#E8E5E0] bg-white text-[#374151] rounded-full px-4 font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 transition-all">{t('sf_edit_rules')}</button>
        </div>

        {/* ── Trusted contact & check-in ── */}
        <TrustedContactCard t={t} lang={lang} user={user} allJobs={allJobs} appliedJobs={appliedJobs} trusted={trusted} setTrusted={setTrusted} checkin={checkin} setCheckin={setCheckin} showToast={showToast} />

        {/* ── Quiet hours ── */}
        <QuietHoursCard t={t} lang={lang} quiet={quiet} setQuiet={setQuiet} />

        {/* ── Saved proof / Evidence ── */}
        <div>
          <h2 className="font-semibold text-[17px] text-[#111827] mb-3">{t('sf_proof_title')}</h2>
          <button onClick={() => navTo('vault')} className="w-full sm:w-auto border border-[#E8E5E0] bg-white text-[#374151] rounded-full px-4 font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 mb-3 inline-flex items-center justify-center gap-1.5 transition-all"><Lock size={14} /> {t('ev_open')}</button>
          {evidence.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF] mb-2">{t('sf_proof_empty')}</p>
          ) : (
            <div className="space-y-3 mb-2">
              {evidence.map((e, i) => (
                <div key={i} className="bg-white border border-[#E8E5E0] rounded-xl p-3.5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-[#9CA3AF]">{fmtDate(e.date)}</span>
                    <button onClick={() => delProof(i)} className="text-[12px] font-semibold text-[#9CA3AF] underline underline-offset-2 hover:text-[#374151] h-7 px-1 -mt-1 -mr-1 transition-colors">{t('sf_delete')}</button>
                  </div>
                  {e.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {e.categories.map(id => <span key={id} className="bg-[#FFF5F5] text-[#C73E33] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">{SAFETY_DATA[id].name[lang]}</span>)}
                    </div>
                  )}
                  <p className="text-[13px] text-[#374151] break-words">{e.text.slice(0, 80)}{e.text.length > 80 ? '…' : ''}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1"><Lock size={12} className="shrink-0" /> {t('sf_proof_private')}</p>
        </div>
      </div>
    </div>
  );
}
