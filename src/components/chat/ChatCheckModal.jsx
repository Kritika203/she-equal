// Check a message without leaving chat.

import { AlertTriangle, Check, ClipboardList, Shield, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_RULES } from '../../constants/skills.js';
import { checkChatText } from '../../services/chat.js';
import { SAFETY_DATA, SAFETY_EXAMPLES, SAFETY_EXIT, SAFETY_RULE_OF, SHIELD_EXAMPLES, checkScope } from '../../services/safety.js';
import { buildWorkroomMilestones } from '../../services/workroom.js';
import { fmt } from '../../utils/format.js';
import { Disclaimer } from '../common/Disclaimer.jsx';



export function ChatCheckModal({ t, lang, user, navTo, showToast, setEvidence, initialText = "", autoRun = false, onClose, clientApi = null, job = null, workrooms = {}, setWorkrooms = () => {} }) {
  const other = lang === 'ne' ? 'en' : 'ne';
  const rules = (user && user.safetyRules) || DEFAULT_RULES;
  const [text, setText] = useState(initialText);
  const [checked, setChecked] = useState(autoRun && initialText.trim() ? initialText.trim() : null);
  const [emptyErr, setEmptyErr] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scopeForm, setScopeForm] = useState(false);
  const [scopeName, setScopeName] = useState("");
  const [scopePrice, setScopePrice] = useState("10");
  const [scopeErr, setScopeErr] = useState(false);
  const [scopeDone, setScopeDone] = useState(false);
  const resultRef = useRef(null);
  const textRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    if (autoRun && initialText.trim()) { if (closeRef.current) closeRef.current.focus(); }
    else if (textRef.current) textRef.current.focus();
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    if (checked !== null && resultRef.current) resultRef.current.scrollIntoView({ block: 'start' });
  }, [checked]);

  const res = useMemo(() => (checked === null ? null : checkChatText(checked)), [checked]);

  const run = () => {
    if (!text.trim()) { setEmptyErr(true); return; }
    setEmptyErr(false); setSaved(false); setScopeForm(false); setScopeErr(false); setScopeDone(false); setChecked(text.trim());
  };
  const fill = (str) => { setText(str); setEmptyErr(false); };
  const copy = async (str) => {
    try { await navigator.clipboard.writeText(str); } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = str; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('sh_copied'));
  };
  const saveProof = () => {
    if (!res || saved) return;
    setEvidence(prev => [{ text: checked.slice(0, 500), categories: res.cats, date: new Date().toISOString(), source: 'chat', jobTitle: job ? job.title : '', clientName: job ? job.clientName : '' }, ...(Array.isArray(prev) ? prev : [])].slice(0, 20));
    setSaved(true);
    showToast(t('sf_saved_toast'));
  };

  const scope = useMemo(() => (checked === null ? null : checkScope(checked)), [checked]);
  const wrStored = job ? workrooms[job.id] : null;
  const agreed = job
    ? ((wrStored && Array.isArray(wrStored.milestones) && wrStored.milestones.length) ? wrStored.milestones.map(m => m.title) : (job.deliverables || []))
    : [];
  const openScopeForm = () => { setScopeName(t('sc_extra_default')); setScopePrice("10"); setScopeErr(false); setScopeForm(true); };
  const saveMilestone = () => {
    const price = Number(scopePrice);
    if (!scopeName.trim() || scopePrice === "" || !Number.isFinite(price) || !(price > 0)) { setScopeErr(true); return; }
    const base = (wrStored && Array.isArray(wrStored.milestones) && wrStored.milestones.length) ? wrStored.milestones : buildWorkroomMilestones(job);
    const extra = { id: job.id + "-x" + Date.now(), title: scopeName.trim(), amountUSD: price, state: 'not_funded' };
    setWorkrooms({ ...workrooms, [job.id]: { milestones: [...base, extra] } });
    setScopeErr(false); setScopeForm(false); setScopeDone(true);
  };

  const hasSafety = !!res && res.cats.length > 0;
  const hasShield = !!res && (res.red.length > 0 || res.yellow.length > 0);
  const calm = !!res && !hasSafety && !hasShield;
  const questions = res ? ['nopay', 'vague', 'lowpay'].filter(id => res.yellow.includes(id)) : [];
  const chips = [
    { label: 'chat_chip1', text: SAFETY_EXAMPLES[0].text },
    { label: 'chat_chip2', text: SAFETY_EXAMPLES[1].text },
    { label: 'chat_chip3', text: SHIELD_EXAMPLES[0].text },
  ];
  const ShieldVerdictIcon = res && res.verdict === 'danger' ? ShieldAlert : AlertTriangle;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1B1A]/40 flex items-end sm:items-center justify-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="chat-check-title" className="bg-white w-full sm:max-w-[480px] max-h-[92vh] sm:max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-t-[20px] sm:rounded-[20px] border border-[#EAE7E1]">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between gap-3 px-5 sm:px-6 pt-4 pb-3 border-b border-[#EAE7E1]">
          <h2 id="chat-check-title" className="text-xl font-semibold flex items-center gap-2 min-w-0"><Shield size={22} className="shrink-0 text-[#C73E33]" /> <span>{t('chat_modal_title')}</span></h2>
          <button ref={closeRef} onClick={onClose} aria-label={t('chat_close')} className="shrink-0 w-12 h-12 -mr-2 rounded-full flex items-center justify-center text-[#4A4744] hover:bg-[#F0EEE9]"><X size={22} /></button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <textarea ref={textRef} value={text} onChange={e => { setText(e.target.value); setEmptyErr(false); }} aria-label={t('chat_modal_title')} placeholder={t('sf_placeholder')} className="w-full min-h-[104px] border border-[#EAE7E1] bg-white rounded-[14px] px-4 py-3 text-base outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 mb-3" />
            {emptyErr && <p role="alert" className="text-[#AE332A] text-sm mb-3 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><ShieldAlert size={18} className="shrink-0 mt-0.5" /> <span>{t('err_paste_first')}</span></p>}
            <button onClick={run} className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-6">{t('chat_check_now')}</button>
            <div className="flex flex-wrap gap-2 mt-3">
              {chips.map(c => (
                <button key={c.label} onClick={() => fill(c.text)} className="border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-4 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{t(c.label)}</button>
              ))}
            </div>
          </div>

          {res && (
            <div ref={resultRef} className="space-y-5 scroll-mt-[76px]">
              {hasSafety && (
                <div className="space-y-4">
                  <div className="bg-[#FAF0EE] border border-[#C73E33] rounded-[20px] p-4 flex items-start gap-3">
                    <ShieldAlert size={32} className="shrink-0 text-[#C73E33]" />
                    <div>
                      <h3 className="text-lg leading-snug font-semibold mb-1">{t('sf_cross_title')}</h3>
                      <p className="text-base text-[#4A4744]">{t('sf_cross_line')}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {res.cats.map(id => {
                      const ruleKey = SAFETY_RULE_OF[id];
                      const off = ruleKey && !rules[ruleKey];
                      return (
                        <div key={id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                          <div className="font-semibold text-base mb-1 flex items-start gap-2"><AlertTriangle size={18} className="shrink-0 mt-1" /> <span>{SAFETY_DATA[id].name[lang]}</span></div>
                          <p className="text-base text-[#4A4744] mb-2">{SAFETY_DATA[id].expl[lang]}</p>
                          <p className="text-sm font-semibold text-[#1C1B1A]">
                            {ruleKey ? fmt(t('sf_breaks'), { rule: t('rule_' + ruleKey) }) : t('sf_no_one')}
                            {off && <span className="font-normal text-[#8A8580]">{t('sf_off_note')}</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">{t('sf_reply_title')}</h3>
                    <div className="space-y-3">
                      {[...res.cats.map(id => ({ id, label: SAFETY_DATA[id].name[lang], reply: SAFETY_DATA[id].reply })), { id: 'exit', label: t('sf_exit_label'), reply: SAFETY_EXIT }].map(r => (
                        <div key={r.id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                          <div className="text-sm font-semibold text-[#8A8580] mb-2">{r.label}</div>
                          <p className="text-base text-[#1C1B1A] mb-2">{r.reply[lang]}</p>
                          <p className="text-sm text-[#8A8580] mb-3">{r.reply[other]}</p>
                          <button onClick={() => copy(r.reply[lang])} className="border border-[#E3E0D9] bg-white rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t('sh_copy')}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={saveProof} disabled={saved} className={`w-full rounded-full font-semibold text-base min-h-[52px] px-6 ${saved ? 'bg-[#F0EEE9] text-[#4A4744]' : 'bg-[#C73E33] text-white hover:bg-[#AE332A]'}`}>{saved ? t('sf_saved_toast') : t('sf_save_proof')}</button>
                </div>
              )}

              {hasShield && (
                <div className="space-y-4">
                  <div className={`rounded-[20px] border p-4 flex items-start gap-3 ${res.verdict === 'danger' ? 'bg-[#FAF0EE] border-[#C73E33]' : 'bg-white border-[#EAE7E1]'}`}>
                    <ShieldVerdictIcon size={32} className={`shrink-0 ${res.verdict === 'danger' ? 'text-[#C73E33]' : 'text-[#1C1B1A]'}`} />
                    <div>
                      <h3 className="text-lg leading-snug font-semibold">{t('sh_v_' + res.verdict)}</h3>
                      {res.verdict === 'danger' && <p className="text-base font-semibold text-[#AE332A] mt-2">{t('chat_danger_line')}</p>}
                    </div>
                  </div>
                  <div className="bg-white border border-[#EAE7E1] rounded-[14px] p-4 space-y-3">
                    {res.red.map(id => <div key={id} className="flex items-start gap-3 text-base"><ShieldAlert size={20} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sh_f_' + id)}</span></div>)}
                    {res.yellow.map(id => <div key={id} className="flex items-start gap-3 text-base"><AlertTriangle size={20} className="shrink-0 mt-0.5 text-[#1C1B1A]" /> <span>{t('sh_f_' + id)}</span></div>)}
                  </div>
                  {questions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">{t('sh_q_title')}</h3>
                      <div className="space-y-3">
                        {questions.map(id => (
                          <div key={id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                            <p className="text-base mb-3">{t('sh_q_' + id)}</p>
                            <button onClick={() => copy(t('sh_q_' + id))} className="border border-[#E3E0D9] bg-white rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t('sh_copy')}</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {calm && (
                <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4 flex items-start gap-3">
                  <ShieldCheck size={32} className="shrink-0 text-[#1C1B1A]" />
                  <div>
                    <h3 className="text-lg leading-snug font-semibold mb-1">{t('chat_calm_title')}</h3>
                    <p className="text-base text-[#4A4744]">{t('chat_calm_line')}</p>
                  </div>
                </div>
              )}

              {job && scope && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><ClipboardList size={22} className="shrink-0 text-[#C73E33]" /> <span>{t('sc_title')}</span></h3>
                  {scope.flagged ? (
                    <div className="bg-[#FAF0EE] border border-[#C73E33] rounded-[20px] p-4 space-y-2">
                      <p className="text-base font-semibold text-[#1C1B1A]">{t('sc_flag')}</p>
                      <p className="text-base text-[#4A4744]">{t('sc_reason')} {scope.matched.map((p, i) => <span key={p}>{i > 0 ? ', ' : ''}<span className="font-semibold text-[#1C1B1A]">“{p}”</span></span>)}</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4">
                      <p className="text-base text-[#4A4744]">{t('sc_ok')}</p>
                    </div>
                  )}
                  <div className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                    <div className="text-sm font-semibold text-[#6E6963] mb-2">{t('sc_agreed')}</div>
                    <ul className="space-y-1.5">
                      {agreed.map((x, i) => <li key={i} className="flex items-start gap-2 text-base text-[#4A4744]"><span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#8A8580] shrink-0" /><span>{x}</span></li>)}
                    </ul>
                  </div>
                  {scope.flagged && (
                    <div className="space-y-3">
                      {[{ id: 'accept', h: t('sc_accept_h'), b: t('sc_accept_b') }, { id: 'ask', h: t('sc_ask_h'), b: t('sc_ask_b') }].map(r => (
                        <div key={r.id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                          <div className="text-sm font-semibold text-[#8A8580] mb-2">{r.h}</div>
                          <p className="text-base text-[#1C1B1A] mb-3">{r.b}</p>
                          <button onClick={() => copy(r.b)} className="border border-[#E3E0D9] bg-white rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t('sh_copy')}</button>
                        </div>
                      ))}
                      {scopeDone ? (
                        <p role="status" className="flex items-start gap-2 text-base text-[#1C1B1A] bg-[#F0EEE9] rounded-[14px] p-4"><Check size={20} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sc_done')}</span></p>
                      ) : scopeForm ? (
                        <div className="bg-white border border-[#EAE7E1] rounded-[14px] p-4 space-y-3">
                          <div>
                            <label htmlFor="sc-name" className="block text-sm font-semibold text-[#6E6963] mb-1">{t('sc_name')}</label>
                            <input id="sc-name" type="text" value={scopeName} onChange={e => { setScopeName(e.target.value); setScopeErr(false); }} className="w-full border border-[#EAE7E1] bg-white rounded-[14px] px-4 text-base min-h-[48px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30" />
                          </div>
                          <div>
                            <label htmlFor="sc-price" className="block text-sm font-semibold text-[#6E6963] mb-1">{t('sc_price')}</label>
                            <input id="sc-price" type="number" inputMode="decimal" min="0" step="any" value={scopePrice} onChange={e => { setScopePrice(e.target.value); setScopeErr(false); }} className="w-full border border-[#EAE7E1] bg-white rounded-[14px] px-4 text-base min-h-[48px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30" />
                          </div>
                          {scopeErr && <p role="alert" className="text-[#AE332A] text-sm flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><ShieldAlert size={18} className="shrink-0 mt-0.5" /> <span>{t('sc_err')}</span></p>}
                          <button onClick={saveMilestone} className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-6">{t('sc_save')}</button>
                        </div>
                      ) : (
                        <button onClick={openScopeForm} className="w-full border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[52px] flex items-center justify-center gap-2"><ClipboardList size={18} /> {t('sc_create')}</button>
                      )}
                    </div>
                  )}
                  <Disclaimer t={t} k="disc_scope" />
                </div>
              )}

              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {(hasShield || calm) && <button onClick={() => navTo('shield')} className="text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px]">{t('chat_open_shield')}</button>}
                {(hasSafety || calm) && <button onClick={() => navTo('safety')} className="text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px]">{t('chat_open_safety')}</button>}
              </div>
              {clientApi && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={clientApi.toggleMute} className="flex-1 min-w-[140px] border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-4 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{clientApi.muted ? t('ca_unmute') : t('ca_mute')}</button>
                  <button onClick={clientApi.toggleBlock} className="flex-1 min-w-[140px] border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-4 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{clientApi.blocked ? t('ca_unblock') : t('ca_block')}</button>
                  <button onClick={clientApi.openReport} className="flex-1 min-w-[140px] border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-4 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{t('ca_report')}{clientApi.hasReport ? ' ✓' : ''}</button>
                </div>
              )}
              <Disclaimer t={t} k="disc_chat" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
