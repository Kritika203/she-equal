// Chrome extension guide.

import { Check, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { SAFETY_DATA, SAFETY_EXAMPLES, SHIELD_EXAMPLES, analyzeMessage, analyzeText, verdictOf } from '../services/safety.js';



export function ExtensionPage({ t, lang, navTo }) {
  const [tab, setTab] = useState('job'); // 'job' | 'chat'
  const [result, setResult] = useState(null); // { kind, findings?, verdict?, cats? }
  const num = (n) => (lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : n);
  const isJob = tab === 'job';
  const mockText = isJob ? SHIELD_EXAMPLES[0].text : SAFETY_EXAMPLES[0].text;

  const switchTab = (k) => { setTab(k); setResult(null); };
  const runCheck = () => {
    if (isJob) {
      const f = analyzeText(mockText);
      setResult({ kind: 'job', findings: f, verdict: verdictOf(f) });
    } else {
      setResult({ kind: 'chat', cats: analyzeMessage(mockText) });
    }
  };

  const Bang = () => <span className="shrink-0 w-5 h-5 rounded-full bg-[#FFF5F5] text-[#C73E33] text-[11px] font-bold flex items-center justify-center mt-0.5" aria-hidden="true">!</span>;

  return (
    <div className="max-w-[780px] mx-auto space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.5 text-[#111827]">{t('ex_title')}</h1>
        <p className="text-[13px] text-[#6B7280]">{t('ex_intro')}</p>
      </div>

      {/* ── How it works ── */}
      <div>
        <h2 className="font-semibold text-[17px] text-[#111827] mb-3">{t('ex_how_title')}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white border border-[#E8E5E0] rounded-xl p-3.5">
              <span className="w-7 h-7 rounded-full bg-[#FFF5F5] text-[#C73E33] flex items-center justify-center text-[13px] font-semibold mb-2">{num(n)}</span>
              <p className="text-[13px] text-[#374151] font-medium">{t('ex_s' + n)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Try it here (practice) ── */}
      <div>
        <h2 className="font-semibold text-[17px] text-[#111827] mb-1">{t('ex_try_title')}</h2>
        <p className="text-[12px] text-[#9CA3AF] mb-3">{t('ex_try_line')}</p>

        <div className="inline-flex bg-[#F3F4F6] rounded-full p-0.5 mb-3" role="group">
          {[['job', 'ex_tab_job'], ['chat', 'ex_tab_chat']].map(([k, label]) => (
            <button key={k} onClick={() => switchTab(k)} aria-pressed={tab === k}
              className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${tab === k ? 'bg-white text-[#111827] shadow-sm font-semibold' : 'text-[#9CA3AF] hover:text-[#374151]'}`}>
              {t(label)}
            </button>
          ))}
        </div>

        {/* fake browser window */}
        <div className="relative bg-white border border-[#E8E5E0] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-[#F3F4F6] border-b border-[#E8E5E0]">
            <div className="flex gap-1" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-[#D1D5DB]" /><span className="w-2 h-2 rounded-full bg-[#D1D5DB]" /><span className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
            </div>
            <div className="flex-1 min-w-0 bg-white rounded-full px-3 py-1 text-[11px] text-[#9CA3AF] truncate">{t(isJob ? 'ex_addr_job' : 'ex_addr_chat')}</div>
          </div>
          <div className="sm:flex sm:items-start sm:gap-3 sm:p-4">
            <div className="p-3.5 sm:p-0 sm:flex-1 sm:min-w-0">
              <div className="text-[11px] text-[#9CA3AF] mb-2">{t(isJob ? 'ex_label_job' : 'ex_label_chat')}</div>
              {isJob ? (
                <div className="border border-[#E8E5E0] rounded-lg p-3">
                  <p className="text-[13px] text-[#374151] leading-relaxed"><span className={result ? 'bg-[#FFF5F5] underline decoration-[#C73E33]/40' : ''}>{mockText}</span></p>
                </div>
              ) : (
                <div className="bg-[#F3F4F6] rounded-xl rounded-tl-sm px-3 py-2.5">
                  <p className="text-[13px] text-[#374151] leading-relaxed"><span className={result ? 'bg-[#FFF5F5] underline decoration-[#C73E33]/40' : ''}>{mockText}</span></p>
                </div>
              )}
            </div>

            {/* extension popup overlay */}
            {result && (
              <div className="m-2.5 sm:m-0 sm:w-[300px] sm:shrink-0 bg-white border border-[#E8E5E0] rounded-xl p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]" role="dialog" aria-label="WorkShield">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Shield size={16} className="text-[#C73E33]" />
                  <span className="font-semibold text-[13px] text-[#111827]">WorkShield</span>
                  <span className="text-[11px] text-[#9CA3AF]">{t('ex_pop_by')}</span>
                </div>
                {result.kind === 'job' ? (
                  <>
                    <h3 className="text-[14px] font-semibold leading-snug mb-2 text-[#111827]">{t('sh_v_' + result.verdict)}</h3>
                    <div className="space-y-2 mb-3">
                      {result.findings.red.map(id => <div key={id} className="flex items-start gap-2 text-[12px] text-[#374151]"><Bang /><span>{t('sh_f_' + id)}</span></div>)}
                      {result.findings.yellow.map(id => <div key={id} className="flex items-start gap-2 text-[12px] text-[#374151]"><Bang /><span>{t('sh_f_' + id)}</span></div>)}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-[14px] font-semibold leading-snug mb-2 text-[#111827]">{t(result.cats.length ? 'sf_cross_title' : 'sf_ok_title')}</h3>
                    <div className="space-y-2 mb-3">
                      {result.cats.map(id => (
                        <div key={id} className="flex items-start gap-2 text-[12px] text-[#374151]"><Bang />
                          <span><span className="block font-semibold text-[#111827]">{SAFETY_DATA[id].name[lang]}</span>{SAFETY_DATA[id].expl[lang]}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <p className="text-[11px] text-[#9CA3AF] mb-3 flex items-center gap-1"><Lock size={11} className="shrink-0" /> {t('sh_private')}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => navTo(result.kind === 'job' ? 'shield' : 'safety')} className="flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-[12px] hover:bg-[#AE332A] h-8 px-2.5 transition-colors">{t(result.kind === 'job' ? 'ex_open_full' : 'ex_open_safety')}</button>
                  <button onClick={() => setResult(null)} className="bg-white border border-[#E8E5E0] text-[#374151] rounded-full font-semibold text-[12px] hover:bg-[#F9F9F7] h-8 px-3.5 transition-all">{t('ex_close')}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={runCheck} className="mt-3 w-full sm:w-auto sm:px-6 bg-[#C73E33] text-white rounded-full font-semibold text-[13px] hover:bg-[#AE332A] h-9 px-4 transition-colors">{t(isJob ? 'ex_btn_job' : 'ex_btn_chat')}</button>
      </div>

      {/* ── How to install ── */}
      <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 sm:p-5">
        <h2 className="font-semibold text-[17px] text-[#111827] mb-4">{t('ex_inst_title')}</h2>
        <ol className="space-y-3 text-[13px] text-[#374151]">
          {[1, 2, 3, 4].map(n => (
            <li key={n} className="flex items-start gap-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[11px] font-semibold text-[#374151]">{num(n)}</span>
              <span className="flex-1">{t('ex_i' + n)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[13px] font-semibold text-[#111827] flex items-center gap-1.5"><Check size={15} className="text-[#C73E33] shrink-0" /> {t('ex_i_note')}</p>
      </div>

      {/* ── Your privacy ── */}
      <div>
        <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold text-[17px] text-[#111827] mb-4">{t('ex_priv_title')}</h2>
          <div className="space-y-2.5 text-[13px] text-[#374151]">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex items-start gap-2"><Lock size={15} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('ex_p' + n)}</span></div>
            ))}
          </div>
        </div>
        <Disclaimer t={t} k="disc_ext" className="mt-3" />
      </div>
    </div>
  );
}
