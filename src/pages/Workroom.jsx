// Agreement and milestone demo.

import { Check, CheckCircle2, ChevronLeft, Info, MessageSquare } from 'lucide-react';
import { useEffect } from 'react';
import { MASK } from '../constants/privacy.js';
import { buildWorkroomMilestones } from '../services/workroom.js';
import { fmt, fmtMoney, initialsOf } from '../utils/format.js';



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
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${state === 'released' ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]' : 'border-[#EAE7E1] bg-[#F6F4EF] text-[#1C1B1A]'}`}>{state === 'released' && <Check size={14} />}{t('wr_s_' + state)}</span>
  );
  const bullets = (arr) => (
    <ul className="space-y-1.5">
      {(arr || []).map((x, i) => <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-[#4A4744]"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#8A8580]" /><span>{x}</span></li>)}
    </ul>
  );
  const label = "mb-1 text-sm font-semibold text-[#777777]";
  const demoBtn = "w-full sm:w-auto rounded-full border border-dashed border-[#D8D4CC] bg-white px-5 text-sm font-semibold text-[#4A4744] hover:border-[#8A8580] min-h-[44px]";

  return (
    <div className="mx-auto max-w-[880px] space-y-4 sm:space-y-5">
      <section className="rounded-2xl border border-[#EAE7E1] bg-white p-4 sm:p-5">
        <div className="mb-3">
          <button onClick={() => navTo('opportunities', { tab: 'applied' })} aria-label={t('back')} className="-ml-1 flex min-h-[44px] shrink-0 items-center gap-1 pr-1 text-sm font-semibold text-[#4A4744] hover:text-[#1C1B1A]"><ChevronLeft size={20} /><span>{t('back')}</span></button>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1 text-sm font-semibold text-[#777777]">{t('wr_title')}</p>
            <h1 className="text-xl font-semibold leading-snug text-[#252525] sm:text-2xl">{job.title}</h1>
            <div className="mt-3 flex items-center gap-2.5 text-sm font-medium text-[#4A4744]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F2DBD7] bg-[#FCF0EE] text-xs font-semibold text-[#AE332A]">{initialsOf((job.clientName || '').replace(/[()]/g, ''))}</span>
              <span className="truncate">{job.clientName}</span>
            </div>
          </div>
          <button onClick={() => navTo('chat', { id: job.id })} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#E3E0D9] bg-white px-5 text-sm font-semibold text-[#1C1B1A] hover:border-[#DDD8CE] sm:w-auto"><MessageSquare size={17} /> {t('chat_msg_client')}</button>
        </div>
      </section>

      <div className="flex items-start gap-2.5 rounded-xl border border-[#F2DBD7] bg-[#FCF0EE] p-3.5">
        <Info size={18} className="mt-0.5 shrink-0 text-[#C73E33]" />
        <p className="text-sm leading-relaxed text-[#4A4744]">{t('wr_sim_note')}</p>
      </div>

      <section className="rounded-2xl border border-[#EAE7E1] bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">{t('wr_agreement')}</h2>
        <div className="flex items-center gap-3 border-b border-[#EAE7E1] pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F2DBD7] bg-[#FCF0EE] text-sm font-semibold text-[#AE332A]">{initialsOf((job.clientName || '').replace(/[()]/g, ''))}</span>
          <div className="min-w-0">
            <div className={label}>{t('sp_ci_client')}</div>
            <div className="truncate text-base font-semibold text-[#252525]">{job.clientName}</div>
            <div className="mt-0.5 truncate text-sm text-[#777777]">{job.title}</div>
          </div>
        </div>
        <div className="grid gap-4 border-b border-[#EAE7E1] py-4 sm:grid-cols-2 sm:gap-6">
          <div>
            <div className={label}>{t('wr_price')}</div>
            <div className="text-base font-semibold text-[#252525]">{hideMoney ? `${MASK} (NPR ${MASK})` : `$${fmtMoney(job.budgetUSD)} (NPR ${fmtMoney(job.budgetUSD * 133)})`}</div>
          </div>
          <div>
            <div className={label}>{t('wr_deadline')}</div>
            <div className="text-base font-semibold text-[#252525]">{fmt(t('wr_days'), { days: job.deadlineDays })}</div>
          </div>
        </div>
        <div className="grid gap-5 pt-4 sm:grid-cols-2 sm:gap-6">
          <div>
            <div className={label}>{t('wr_deliver')}</div>
            {bullets(job.deliverables)}
          </div>
          <div>
            <div className={label}>{t('wr_provides')}</div>
            {bullets(job.clientProvides)}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#EAE7E1] bg-white p-5 sm:p-6">
        {complete && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#166534]" />
            <p className="text-sm font-semibold text-[#166534]">{t('wr_complete')}</p>
          </div>
        )}
        <h2 className="mb-4 text-lg font-semibold">{t('wr_milestones')}</h2>
        <div className="mb-2 text-sm font-semibold text-[#252525]">{fmt(t('wr_progress'), { done, total })}</div>
        <div className="h-2.5 rounded-full bg-[#F0EEE9] overflow-hidden mb-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <div className="h-full rounded-full bg-[#C73E33] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mb-5 text-sm text-[#777777]">{fmt(t('wr_released_so_far'), { x: nprOf(releasedUSD), y: nprOf(totalUSD) })}</div>

        <div className="space-y-3">
          {milestones.map(m => (
            <div key={m.id} className="rounded-xl border border-[#EAE7E1] p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#252525]">{m.title}</div>
                  <div className="text-sm text-[#777777]">{money(m.amountUSD)} · NPR {nprOf(m.amountUSD)}</div>
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
              {m.state === 'released' && <div className="flex items-center gap-2 text-sm font-semibold text-[#166534]"><Check size={18} /> {t('wr_s_released')}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
