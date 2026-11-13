// Agreement and milestone demo.

import { Check, CheckCircle2, ChevronLeft, Info, MessageSquare, User } from 'lucide-react';
import { useEffect } from 'react';
import { MASK } from '../constants/privacy.js';
import { buildWorkroomMilestones } from '../services/workroom.js';
import { fmt, fmtMoney } from '../utils/format.js';



export function WorkroomView({ t, lang, job, navTo, showToast, workrooms, setWorkrooms, confirmedJobs, setConfirmedJobs, hideMoney = false }) {
  const stored = workrooms[job.id];
  const hasEntry = !!(stored && Array.isArray(stored.milestones) && stored.milestones.length);
  const milestones = hasEntry ? stored.milestones : buildWorkroomMilestones(job);

  useEffect(() => {
    if (!hasEntry) setWorkrooms({ ...workrooms, [job.id]: { milestones } });
  }, []);

  const money = (usd) => hideMoney ? MASK : `$${fmtMoney(usd)}`;
  const nprOf = (usd) => hideMoney ? MASK : fmtMoney(usd * 133);
  const total = milestones.length;
  const done = milestones.filter(m => m.state === 'released').length;
  const totalUSD = milestones.reduce((a, m) => a + m.amountUSD, 0);
  const releasedUSD = milestones.filter(m => m.state === 'released').reduce((a, m) => a + m.amountUSD, 0);
  const pct = totalUSD > 0 ? Math.round((releasedUSD / totalUSD) * 100) : 0;
  const complete = total > 0 && done === total;

  const setState = (id, state) => {
    const next = milestones.map(m => m.id === id ? { ...m, state } : m);
    setWorkrooms({ ...workrooms, [job.id]: { milestones: next } });
    if (state === 'released' && next.every(m => m.state === 'released')) {
      if (!confirmedJobs.includes(job.id)) {
        setConfirmedJobs(prev => (Array.isArray(prev) ? (prev.includes(job.id) ? prev : [...prev, job.id]) : [job.id]));
        showToast(t('pp_confirm_toast'));
      }
    }
  };

  const pill = (state) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${state === 'released' ? 'bg-[#FAF0EE] border-[#F3E1DD] text-[#AE332A]' : 'bg-[#F0EEE9] border-[#EAE7E1] text-[#1C1B1A]'}`}>{state === 'released' && <Check size={14} />}{t('wr_s_' + state)}</span>
  );
  const bullets = (arr) => (
    <ul className="space-y-1.5">
      {(arr || []).map((x, i) => <li key={i} className="flex items-start gap-2 text-base text-[#4A4744]"><span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#8A8580] shrink-0" /><span>{x}</span></li>)}
    </ul>
  );
  const label = "text-sm font-semibold text-[#6E6963] mb-1";
  const demoBtn = "w-full sm:w-auto border-2 border-dashed border-[#D8D4CC] text-[#4A4744] rounded-full px-5 font-semibold text-base hover:border-[#8A8580] min-h-[48px] bg-white";

  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navTo('opportunities', { tab: 'applied' })} aria-label={t('back')} className="shrink-0 flex items-center gap-1 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] -ml-1 pr-1"><ChevronLeft size={20} /><span>{t('back')}</span></button>
        </div>
        <h1 className="text-[28px] sm:text-[30px] font-semibold leading-tight mb-2">{t('wr_title')}</h1>
        <div className="text-lg font-semibold text-[#1C1B1A]">{job.title}</div>
        <div className="text-base text-[#4A4744] flex items-center gap-2 mb-4"><User size={18} /> {job.clientName}</div>
        <button onClick={() => navTo('chat', { id: job.id })} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] flex items-center justify-center gap-2"><MessageSquare size={18} /> {t('chat_msg_client')}</button>
      </div>

      <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
        <Info size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
        <p className="text-base text-[#1C1B1A]">{t('wr_sim_note')}</p>
      </div>

      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">{t('wr_agreement')}</h2>
        <div className="space-y-4">
          <div><div className={label}>{job.clientName}</div><div className="text-base font-semibold text-[#1C1B1A]">{job.title}</div></div>
          <div><div className={label}>{t('wr_price')}</div><div className="text-base text-[#1C1B1A]">{hideMoney ? `${MASK} (NPR ${MASK})` : `$${fmtMoney(job.budgetUSD)} (NPR ${fmtMoney(job.budgetUSD * 133)})`}</div></div>
          <div><div className={label}>{t('wr_deadline')}</div><div className="text-base text-[#1C1B1A]">{fmt(t('wr_days'), { days: job.deadlineDays })}</div></div>
          <div><div className={label}>{t('wr_deliver')}</div>{bullets(job.deliverables)}</div>
          <div><div className={label}>{t('wr_provides')}</div>{bullets(job.clientProvides)}</div>
        </div>
      </div>

      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
        {complete && (
          <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[14px] p-4 flex items-start gap-3 mb-5">
            <CheckCircle2 size={22} className="shrink-0 mt-0.5 text-[#C73E33]" />
            <p className="text-base font-semibold text-[#1C1B1A]">{t('wr_complete')}</p>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4">{t('wr_milestones')}</h2>
        <div className="text-base font-semibold text-[#1C1B1A] mb-2">{fmt(t('wr_progress'), { done, total })}</div>
        <div className="h-2.5 rounded-full bg-[#F0EEE9] overflow-hidden mb-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <div className="h-full rounded-full bg-[#C73E33] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-sm text-[#6E6963] mb-5">{fmt(t('wr_released_so_far'), { x: nprOf(releasedUSD), y: nprOf(totalUSD) })}</div>

        <div className="space-y-3">
          {milestones.map(m => (
            <div key={m.id} className="border border-[#EAE7E1] rounded-[14px] p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-[#1C1B1A]">{m.title}</div>
                  <div className="text-sm text-[#6E6963]">{money(m.amountUSD)} · NPR {nprOf(m.amountUSD)}</div>
                </div>
                <div className="shrink-0">{pill(m.state)}</div>
              </div>
              {m.state === 'not_funded' && <button onClick={() => setState(m.id, 'funded')} className={demoBtn}>{t('wr_demo_fund')}</button>}
              {m.state === 'funded' && <button onClick={() => setState(m.id, 'submitted')} className="w-full sm:w-auto bg-[#C73E33] text-white rounded-full px-6 font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">{t('wr_submit')}</button>}
              {m.state === 'submitted' && (
                <div className="space-y-3">
                  <p className="text-base text-[#4A4744]">{t('wr_waiting')}</p>
                  <button onClick={() => setState(m.id, 'released')} className={demoBtn}>{t('wr_demo_release')}</button>
                </div>
              )}
              {m.state === 'released' && <div className="flex items-center gap-2 text-base font-semibold text-[#AE332A]"><Check size={18} /> {t('wr_s_released')}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
