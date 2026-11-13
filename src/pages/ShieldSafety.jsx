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
  const [wsResult, setWsResult] = useState(null); // WorkShield: { findings, verdict, snippet }
  const [sfResult, setSfResult] = useState(null); // Safety: { cats, text }
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
    // Remove this message from the saved proof list.
    setEvidence(prev => (Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []));
    showToast(t('sf_deleted'));
  };

  const VerdictIcon = wsResult ? (wsResult.verdict === 'danger' ? ShieldAlert : wsResult.verdict === 'warning' ? AlertTriangle : ShieldCheck) : null;
  const questions = wsResult ? ['nopay', 'vague', 'lowpay'].filter(id => wsResult.findings.yellow.includes(id)) : [];
  const pillStyle = { danger: 'bg-[#C73E33] text-white', warning: 'bg-[#FAF0EE] text-[#AE332A]', ok: 'bg-[#F0EEE9] text-[#1C1B1A]' };
  const crossed = sfResult && sfResult.cats.length > 0;
  const checked = !!(wsResult && sfResult);
  const examples = [...SHIELD_EXAMPLES, ...SAFETY_EXAMPLES];

  if (emergency) return <EmergencyView t={t} trusted={trusted} onBack={() => setEmergency(false)} onHide={onQuickHide} />;

  return (
    <div className="space-y-10">
      <div className="max-w-[800px] mx-auto space-y-8">
        <div ref={topRef} className="scroll-mt-[128px] md:scroll-mt-24">
          <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{t('sh_title')}</h1>
          <p className="text-lg text-[#4A4744] mb-6">{t('ws_one_intro')}</p>
          <label htmlFor="ws-one-text" className="block font-semibold text-base mb-2">{t('ws_one_label')}</label>
          <textarea id="ws-one-text" value={text} onChange={e => { setText(e.target.value); setEmptyErr(false); }} placeholder={t('sh_placeholder')} className="w-full min-h-[140px] border border-[#EAE7E1] bg-white rounded-[14px] px-5 py-4 text-base outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 mb-4" />
          {emptyErr && <p role="alert" className="text-[#AE332A] text-sm mb-4 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><ShieldAlert size={18} className="shrink-0 mt-0.5" /> <span>{t('err_paste_first')}</span></p>}
          <button onClick={runText} className={`w-full sm:w-auto sm:px-12 py-3.5 rounded-full font-semibold text-base min-h-[52px] ${!text.trim() ? 'opacity-60' : ''} ${checked ? 'bg-white border border-[#E3E0D9] text-[#1C1B1A] hover:bg-[#F6F4EF]' : 'bg-[#C73E33] text-white hover:bg-[#AE332A]'}`}>{t('sh_check')}</button>
          <p className="text-sm text-[#8A8580] mt-3 flex items-center gap-1.5"><Lock size={14} className="shrink-0" /> {t('sh_private')}</p>
          <div className="mt-6">
            <div className="text-sm font-semibold text-[#8A8580] mb-2">{t('sh_try')}</div>
            <div className="flex flex-wrap gap-2">
              {examples.map(ex => (
                <button key={ex.label} onClick={() => { setText(ex.text); setEmptyErr(false); }} className="border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-5 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t(ex.label)}</button>
              ))}
            </div>
          </div>
        </div>

        {wsResult && (
          <div ref={wsRef} className="scroll-mt-[128px] md:scroll-mt-24 space-y-5">
            <div className={`rounded-[20px] border p-6 sm:p-6 flex items-start gap-4 ${wsResult.verdict === 'danger' ? 'bg-[#FAF0EE] border-[#C73E33]' : 'bg-white border-[#EAE7E1]'}`}>
              <VerdictIcon size={44} className={`shrink-0 ${wsResult.verdict === 'danger' ? 'text-[#C73E33]' : 'text-[#1C1B1A]'}`} />
              <div>
                <h2 className="text-[22px] leading-snug font-semibold mb-2">{t('sh_v_' + wsResult.verdict)}</h2>
                <p className="text-base text-[#4A4744]">{t('sh_s_' + wsResult.verdict)}</p>
              </div>
            </div>

            <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 space-y-4">
              {wsResult.findings.red.map(id => <div key={id} className="flex items-start gap-3 text-base"><ShieldAlert size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sh_f_' + id)}</span></div>)}
              {wsResult.findings.yellow.map(id => <div key={id} className="flex items-start gap-3 text-base"><AlertTriangle size={22} className="shrink-0 mt-0.5 text-[#1C1B1A]" /> <span>{t('sh_f_' + id)}</span></div>)}
              {wsResult.verdict !== 'danger' && wsResult.findings.green.map(id => <div key={id} className="flex items-start gap-3 text-base"><CheckCircle2 size={22} className="shrink-0 mt-0.5 text-[#1C1B1A]" /> <span>{t('sh_f_' + id)}</span></div>)}
            </div>

            <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
              <h3 className="font-semibold text-xl mb-4">{t('sh_next_title')}</h3>
              <ul className="space-y-3 text-base text-[#1C1B1A]">
                {[1, 2, 3].map(n => <li key={n} className="flex items-start gap-3"><ArrowRight size={20} className="shrink-0 mt-1" /> <span>{t(`sh_n_${wsResult.verdict}${wsResult.verdict === 'ok' ? n : n}`)}</span></li>)}
              </ul>
            </div>

            {questions.length > 0 && (
              <div>
                <h3 className="font-semibold text-xl mb-3">{t('sh_q_title')}</h3>
                <div className="space-y-3">
                  {questions.map(id => (
                    <div key={id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                      <p className="text-base">{t('sh_q_' + id)}</p>
                      <button onClick={() => copyQ(t('sh_q_' + id))} className="shrink-0 border border-[#E3E0D9] bg-white rounded-full px-5 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{t('sh_copy')}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={reset} className="flex-1 bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-5">{t('sh_check_another')}</button>
              <button onClick={save} className="flex-1 bg-white border border-[#E3E0D9] text-[#1C1B1A] py-3.5 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-5">{t('sh_save')}</button>
            </div>
            <Disclaimer t={t} k="disc_shield" />
          </div>
        )}

        {sfResult && (
          <div ref={sfRef} className="scroll-mt-[128px] md:scroll-mt-24 space-y-6">
            {crossed ? (
              <>
                <div className="bg-[#FAF0EE] border border-[#C73E33] rounded-[20px] p-6 sm:p-6 flex items-start gap-4">
                  <ShieldAlert size={40} className="shrink-0 text-[#C73E33]" />
                  <div>
                    <h2 className="text-[22px] leading-snug font-semibold mb-2">{t('sf_cross_title')}</h2>
                    <p className="text-base text-[#4A4744]">{t('sf_cross_line')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {sfResult.cats.map(id => {
                    const ruleKey = SAFETY_RULE_OF[id];
                    const off = ruleKey && !rules[ruleKey];
                    return (
                      <div key={id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                        <div className="font-semibold text-lg mb-2 flex items-start gap-2"><AlertTriangle size={20} className="shrink-0 mt-1" /> <span>{SAFETY_DATA[id].name[lang]}</span></div>
                        <p className="text-base text-[#4A4744] mb-3">{SAFETY_DATA[id].expl[lang]}</p>
                        <p className="text-sm font-semibold text-[#1C1B1A]">
                          {ruleKey ? fmt(t('sf_breaks'), { rule: t('rule_' + ruleKey) }) : t('sf_no_one')}
                          {off && <span className="font-normal text-[#8A8580]">{t('sf_off_note')}</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 flex items-start gap-4">
                <ShieldCheck size={40} className="shrink-0 text-[#1C1B1A]" />
                <div>
                  <h2 className="text-[22px] leading-snug font-semibold mb-2">{t('sf_ok_title')}</h2>
                  <p className="text-base text-[#4A4744]">{t('sf_ok_line')}</p>
                </div>
              </div>
            )}

            <div>
              <h2 className="font-semibold text-[22px] mb-2">{t('sf_reply_title')}</h2>
              <p className="text-base text-[#4A4744] mb-4">{t('sf_reply_intro')}</p>
              <div className="space-y-4">
                {[...sfResult.cats.map(id => ({ id, label: SAFETY_DATA[id].name[lang], reply: SAFETY_DATA[id].reply })), { id: 'exit', label: t('sf_exit_label'), reply: SAFETY_EXIT }].map(r => (
                  <div key={r.id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                    <div className="text-sm font-semibold text-[#8A8580] mb-2">{r.label}</div>
                    <p className="text-base text-[#1C1B1A] mb-3">{r.reply[lang]}</p>
                    <p className="text-sm text-[#8A8580] mb-4">{r.reply[other]}</p>
                    <button onClick={() => copy(r.reply[lang])} className="border border-[#E3E0D9] bg-white rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t('sh_copy')}</button>
                  </div>
                ))}
              </div>
              <Disclaimer t={t} k="disc_reply" className="mt-4" />
            </div>

            <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
              <h3 className="font-semibold text-xl mb-4">{t('sf_next_title')}</h3>
              <ol className="space-y-4 text-base text-[#1C1B1A]">
                {[1, 2, 3, 4].map(n => (
                  <li key={n} className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-white border border-[#EAE7E1] flex items-center justify-center text-sm font-semibold">{lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : n}</span>
                    <span className="flex-1">
                      {t('sf_step' + n)}
                      {n === 2 && <button onClick={saveProof} className="mt-3 w-full sm:w-auto bg-[#C73E33] text-white px-6 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] flex items-center justify-center">{t('sf_save_proof')}</button>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div>
          <h2 className="font-semibold text-[22px] mb-4">{t('sh_or_job')}</h2>
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] divide-y divide-[#EAE7E1] overflow-hidden">
            {DUMMY_JOBS.map(job => (
              <button key={job.id} onClick={() => runJob(job)} className="w-full text-left px-5 py-4 hover:bg-[#F6F4EF] flex items-center justify-between gap-3 min-h-[56px]">
                <span className="min-w-0">
                  <span className="block font-semibold text-base">{job.title}</span>
                  <span className="block text-sm text-[#4A4744]">{job.clientName}</span>
                </span>
                {job.paymentVerified && <span className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#1C1B1A]"><CheckCircle2 size={16} /> {t('payment_verified')}</span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-semibold text-[22px]">{t('sh_hist_title')}</h2>
            {history.length > 0 && <button onClick={clearHistory} className="text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px] px-2">{t('sh_clear')}</button>}
          </div>
          {history.length === 0 ? (
            <p className="text-base text-[#8A8580]">{t('sh_hist_empty')}</p>
          ) : (
            <div className="bg-white border border-[#EAE7E1] rounded-[20px] divide-y divide-[#EAE7E1]">
              {history.map((h, i) => (
                <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className={`shrink-0 self-start px-3 py-1 rounded-full text-[13px] font-semibold ${pillStyle[h.verdict]}`}>{t('sh_pill_' + h.verdict)}</span>
                  <span className="flex-1 min-w-0 text-base break-words">{h.snippet}</span>
                  <span className="text-sm text-[#8A8580] shrink-0">{fmtDate(h.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[800px] mx-auto">
        <div id="safety-section" className="scroll-mt-[128px] md:scroll-mt-24 bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-6 flex items-start gap-4">
          <HeartHandshake size={28} className="text-[#C73E33] shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-[22px] text-[#1C1B1A] mb-2">{t('sfs_banner_title')}</h2>
            <p className="text-base text-[#4A4744]">{t('sfs_banner_intro')}</p>
          </div>
        </div>
        <button type="button" onClick={() => setEmergency(true)} className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-6"><Phone size={20} className="text-[#C73E33]" /> {t('sp_em_btn')}</button>
      </div>

      <div className="max-w-[800px] mx-auto space-y-8">
        <div>
          <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{t('sf_title')}</h1>
          <p className="text-lg text-[#4A4744] mb-6">{t('sf_intro')}</p>
          <div className="bg-[#FAF0EE] rounded-[20px] p-6 sm:p-6">
            <h2 className="font-semibold text-xl mb-4 text-[#1C1B1A]">{t('sf_three_title')}</h2>
            <div className="space-y-4 text-base text-[#1C1B1A]">
              <div className="flex items-start gap-3"><Shield size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r1')}</span></div>
              <div className="flex items-start gap-3"><Lock size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r2')}</span></div>
              <div className="flex items-start gap-3"><Bookmark size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r3')}</span></div>
            </div>
          </div>
        </div>


        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
          <h2 className="font-semibold text-[22px] mb-5">{t('pp_rules_title')}</h2>
          <div className="space-y-3 mb-6">
            {RULE_KEYS.map(k => (
              <div key={k} className="flex items-center justify-between gap-4 p-4 border border-[#EAE7E1] rounded-[14px]">
                <span className="text-base font-medium">{t('rule_' + k)}</span>
                <span className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold ${rules[k] ? 'bg-white border border-[#1C1B1A] text-[#1C1B1A]' : 'bg-[#F0EEE9] text-[#4A4744]'}`}>{rules[k] && <Check size={14} />}{rules[k] ? t('sf_on') : t('sf_off')}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navTo('passport')} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px]">{t('sf_edit_rules')}</button>
        </div>

        <TrustedContactCard t={t} lang={lang} user={user} allJobs={allJobs} appliedJobs={appliedJobs} trusted={trusted} setTrusted={setTrusted} checkin={checkin} setCheckin={setCheckin} showToast={showToast} />

        <QuietHoursCard t={t} lang={lang} quiet={quiet} setQuiet={setQuiet} />

        <div>
          <h2 className="font-semibold text-[22px] mb-4">{t('sf_proof_title')}</h2>
          <button onClick={() => navTo('vault')} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:bg-[#F6F4EF] min-h-[48px] mb-4 inline-flex items-center justify-center gap-2"><Lock size={18} /> {t('ev_open')}</button>
          {evidence.length === 0 ? (
            <p className="text-base text-[#8A8580] mb-3">{t('sf_proof_empty')}</p>
          ) : (
            <div className="space-y-4 mb-3">
              {evidence.map((e, i) => (
                <div key={i} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-sm font-semibold text-[#8A8580]">{fmtDate(e.date)}</span>
                    <button onClick={() => delProof(i)} className="text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px] px-2 -mt-2 -mr-2">{t('sf_delete')}</button>
                  </div>
                  {e.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {e.categories.map(id => <span key={id} className="bg-[#FAF0EE] text-[#AE332A] px-3 py-1 rounded-full text-[13px] font-semibold">{SAFETY_DATA[id].name[lang]}</span>)}
                    </div>
                  )}
                  <p className="text-base text-[#1C1B1A] break-words">{e.text.slice(0, 80)}{e.text.length > 80 ? '…' : ''}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-[#8A8580] flex items-center gap-1.5"><Lock size={14} className="shrink-0" /> {t('sf_proof_private')}</p>
        </div>
      </div>
    </div>
  );
}
