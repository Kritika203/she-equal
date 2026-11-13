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

  const Bang = () => <span className="shrink-0 w-6 h-6 rounded-full bg-[#FAF0EE] text-[#C73E33] text-sm font-bold flex items-center justify-center mt-0.5" aria-hidden="true">!</span>;
  const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 ${className}`}>
      <h2 className="font-semibold text-[22px] mb-5">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="max-w-[800px] mx-auto space-y-8">
      {/* A1 header */}
      <div>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{t('ex_title')}</h1>
        <p className="text-lg text-[#4A4744]">{t('ex_intro')}</p>
      </div>

      {/* A2 how it works */}
      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('ex_how_title')}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
              <span className="w-9 h-9 rounded-full bg-[#FAF0EE] text-[#AE332A] flex items-center justify-center font-semibold mb-3">{num(n)}</span>
              <p className="text-base text-[#1C1B1A] font-medium">{t('ex_s' + n)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* A3 practice simulation */}
      <div>
        <h2 className="font-semibold text-[22px] mb-2">{t('ex_try_title')}</h2>
        <p className="text-base text-[#4A4744] mb-4">{t('ex_try_line')}</p>

        <div className="inline-flex bg-[#F0EEE9] rounded-full p-1 mb-4" role="group">
          {[['job', 'ex_tab_job'], ['chat', 'ex_tab_chat']].map(([k, label]) => (
            <button key={k} onClick={() => switchTab(k)} aria-pressed={tab === k}
              className={`rounded-full px-5 py-2 text-[15px] font-medium min-h-[44px] transition-all ${tab === k ? 'bg-white text-[#1C1B1A] shadow-[0_1px_2px_rgba(28,27,26,0.08)]' : 'text-[#8A8580] hover:text-[#4A4744]'}`}>
              {t(label)}
            </button>
          ))}
        </div>

        {/* fake browser window */}
        <div className={`relative bg-white border border-[#EAE7E1] rounded-[20px] overflow-hidden `}>
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F0EEE9] border-b border-[#EAE7E1]">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8D4CC]" /><span className="w-2.5 h-2.5 rounded-full bg-[#D8D4CC]" /><span className="w-2.5 h-2.5 rounded-full bg-[#D8D4CC]" />
            </div>
            <div className="flex-1 min-w-0 bg-white rounded-full px-4 py-1.5 text-sm text-[#8A8580] truncate">{t(isJob ? 'ex_addr_job' : 'ex_addr_chat')}</div>
          </div>
          <div className="sm:flex sm:items-start sm:gap-4 sm:p-6">
          <div className="p-5 sm:p-0 sm:flex-1 sm:min-w-0">
            <div className="text-sm text-[#8A8580] mb-3">{t(isJob ? 'ex_label_job' : 'ex_label_chat')}</div>
            {isJob ? (
              <div className="border border-[#EAE7E1] rounded-[14px] p-4 ">
                <p className="text-base text-[#1C1B1A] leading-relaxed"><span className={result ? 'bg-[#FAF0EE] underline decoration-[#C73E33]/40' : ''}>{mockText}</span></p>
              </div>
            ) : (
              <div className="bg-[#F0EEE9] rounded-[20px] rounded-tl-md px-4 py-3 ">
                <p className="text-base text-[#1C1B1A] leading-relaxed"><span className={result ? 'bg-[#FAF0EE] underline decoration-[#C73E33]/40' : ''}>{mockText}</span></p>
              </div>
            )}
          </div>

          {/* extension-style popup overlay (sits beside the post on wide screens, below it on phones) */}
          {result && (
            <div className="m-3 sm:m-0 sm:w-[360px] sm:shrink-0 bg-white border border-[#EAE7E1] rounded-[14px] p-4 shadow-[0_2px_10px_rgba(28,27,26,0.08)]" role="dialog" aria-label="WorkShield">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={22} className="text-[#C73E33]" />
                <span className="font-semibold">WorkShield</span>
                <span className="text-sm text-[#8A8580]">{t('ex_pop_by')}</span>
              </div>
              {result.kind === 'job' ? (
                <>
                  <h3 className="text-lg font-semibold leading-snug mb-3">{t('sh_v_' + result.verdict)}</h3>
                  <div className="space-y-3 mb-4">
                    {result.findings.red.map(id => <div key={id} className="flex items-start gap-3 text-base"><Bang /><span>{t('sh_f_' + id)}</span></div>)}
                    {result.findings.yellow.map(id => <div key={id} className="flex items-start gap-3 text-base"><Bang /><span>{t('sh_f_' + id)}</span></div>)}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold leading-snug mb-3">{t(result.cats.length ? 'sf_cross_title' : 'sf_ok_title')}</h3>
                  <div className="space-y-3 mb-4">
                    {result.cats.map(id => (
                      <div key={id} className="flex items-start gap-3 text-base"><Bang />
                        <span><span className="block font-semibold text-[#1C1B1A]">{SAFETY_DATA[id].name[lang]}</span>{SAFETY_DATA[id].expl[lang]}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <p className="text-sm text-[#8A8580] mb-4 flex items-center gap-1.5"><Lock size={14} className="shrink-0" /> {t('sh_private')}</p>
              <div className="flex gap-2">
                <button onClick={() => navTo(result.kind === 'job' ? 'shield' : 'safety')} className="flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[44px] px-3">{t(result.kind === 'job' ? 'ex_open_full' : 'ex_open_safety')}</button>
                <button onClick={() => setResult(null)} className="bg-white border border-[#E3E0D9] text-[#1C1B1A] rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[44px] px-5">{t('ex_close')}</button>
              </div>
            </div>
          )}
          </div>
        </div>

        <button onClick={runCheck} className="mt-4 w-full sm:w-auto sm:px-10 bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-5">{t(isJob ? 'ex_btn_job' : 'ex_btn_chat')}</button>
      </div>

      {/* A4 install steps */}
      <Card title={t('ex_inst_title')}>
        <ol className="space-y-4 text-base text-[#1C1B1A]">
          {[1, 2, 3, 4].map(n => (
            <li key={n} className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#F0EEE9] flex items-center justify-center text-sm font-semibold">{num(n)}</span>
              <span className="flex-1">{t('ex_i' + n)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-base font-semibold text-[#1C1B1A] flex items-center gap-2"><Check size={20} className="text-[#C73E33] shrink-0" /> {t('ex_i_note')}</p>
      </Card>

      {/* A5 privacy */}
      <div>
        <Card title={t('ex_priv_title')}>
          <div className="space-y-4 text-base text-[#1C1B1A]">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex items-start gap-3"><Lock size={20} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('ex_p' + n)}</span></div>
            ))}
          </div>
        </Card>
        <Disclaimer t={t} k="disc_ext" className="mt-4" />
      </div>
    </div>
  );
}
