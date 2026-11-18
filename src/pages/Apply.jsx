// Step-by-step job application.

import { ArrowRight, CheckCircle2, CheckSquare, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { NetPayPreview } from '../components/payment/Payment.jsx';
import { fmtMoney } from '../utils/format.js';



export function ApplyWizard({ job, t, navTo, user, setAppliedJobs, lang, simple = false, applyDraft = null, setApplyDraft = () => {} }) {
  const saved = simple && applyDraft && applyDraft.jobId === job.id && applyDraft.answers && typeof applyDraft.answers === 'object' ? applyDraft : null;
  const sa = saved ? saved.answers : {};
  const [step, setStep] = useState(saved && saved.step >= 1 && saved.step <= 4 ? saved.step : 1);
  const sentRef = useRef(false);
  const matchedSkills = job.skillsRequired.filter(s => user.skills.includes(s)).join(', ');
  const initialText = `Hello,

I saw your job for ${job.title}. I can help because I have skills in ${matchedSkills || 'various tools'}.

I am ready to start.

Thanks,
${user.name}`;

  const [text, setText] = useState(typeof sa.text === 'string' ? sa.text : initialText);
  const [price, setPrice] = useState(typeof sa.price === 'number' ? sa.price : job.budgetUSD);
  const [days, setDays] = useState(typeof sa.days === 'number' ? sa.days : (job.deadlineDays || 3));
  const [chkPay, setChkPay] = useState(!!sa.chkPay);
  const [chkMile, setChkMile] = useState(!!sa.chkMile);
  const [chkDead, setChkDead] = useState(!!sa.chkDead);
  const [finalCheck, setFinalCheck] = useState(!!sa.finalCheck);

  useEffect(() => {
    if (!simple || sentRef.current || step >= 5) return;
    const dirty = step > 1 || text !== initialText || price !== job.budgetUSD || days !== (job.deadlineDays || 3) || chkPay || chkMile || chkDead || finalCheck;
    if (dirty) setApplyDraft({ jobId: job.id, step, answers: { text, price, days, chkPay, chkMile, chkDead, finalCheck } });
    else if (applyDraft && applyDraft.jobId === job.id) setApplyDraft(null);
  }, [simple, step, text, price, days, chkPay, chkMile, chkDead, finalCheck]);

  const isHourly = job.budgetType === 'hourly';
  const rangeLo = isHourly ? Math.max(1, job.budgetUSD - 1) : Math.round(job.budgetUSD * 0.75);
  const rangeHi = isHourly ? job.budgetUSD : Math.round(job.budgetUSD);
  const fmtNum = n => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const fillRange = str => str.replace('{lo}', fmtNum(rangeLo)).replace('{hi}', fmtNum(rangeHi));
  const priceMsg = price < rangeLo ? t('price_low') + ' ' + fillRange(t('price_hint')) : price > rangeHi ? t('price_high') + ' ' + fillRange(t('price_hint')) : fillRange(t('price_fair'));
  const npr = price * 133;

  const handleSend = () => {
    sentRef.current = true;
    if (applyDraft && applyDraft.jobId === job.id) setApplyDraft(null);
    setAppliedJobs(prev => [{ jobId: job.id, price, npr, date: new Date().toISOString(), status: 'waiting' }, ...prev]);
    setStep(5);
  };

  /* ── Progress bar ── */
  const ProgressBar = () => (
    <div className="flex gap-1.5 mb-6">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[#C73E33]' : 'bg-[#E5E7EB]'}`}
        />
      ))}
    </div>
  );

  /* ═════════════════════
     SUCCESS SCREEN
  ═════════════════════ */
  if (step === 5) {
    return (
      <div className="max-w-[460px] mx-auto py-16 text-center">
        <div className="bg-white border border-[#E8E5E0] rounded-2xl p-8 sm:p-10">
          <div className="w-14 h-14 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-[#166534]" />
          </div>
          <h1 className="text-[20px] font-bold text-[#111827] mb-2">{t('app_sent')}</h1>
          <p className="text-[13px] text-[#6B7280] leading-relaxed mb-8 max-w-xs mx-auto">{t('app_sent_desc')}</p>
          <div className="space-y-2.5">
            <button
              onClick={() => navTo('opportunities', { tab: 'applied' })}
              className="w-full py-3 bg-[#C73E33] text-white font-semibold text-[14px] rounded-xl hover:bg-[#AE332A] active:scale-[0.98] transition-all"
            >
              {t('view_opps')}
            </button>
            <button
              onClick={() => navTo('firstwork')}
              className="w-full py-3 border border-[#E8E5E0] font-semibold text-[14px] rounded-xl text-[#374151] hover:bg-[#F9F9F7] bg-white transition-colors"
            >
              {t('back_to_jobs')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════
     WIZARD STEPS
  ═════════════════════ */
  return (
    <div className="max-w-[520px] mx-auto py-6">
      <div className="bg-white border border-[#E8E5E0] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
          <button
            onClick={() => step === 1 ? navTo('job-detail', { id: job.id }) : setStep(step - 1)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ChevronLeft size={15} /> {t('back')}
          </button>
          <span className="text-[11px] font-semibold text-[#6B7280] bg-[#F3F4F6] px-3 py-1.5 rounded-full">
            {t('step')} {step} {t('of')} 4
          </span>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4">
          <ProgressBar />
        </div>

        {/* Content */}
        <div className="px-5 pb-6">

          {/* ── Step 1: Cover letter ── */}
          {step === 1 && (
            <div>
              <h2 className="text-[17px] font-bold text-[#111827] mb-1">{t('apply_step1')}</h2>
              <p className="text-[13px] text-[#6B7280] mb-5 leading-relaxed">
                Write a short message to the client. We started it for you based on your skills.
              </p>

              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[11px] font-semibold text-[#6B7280]">
                  {t('ai_label')}
                </span>
              </div>
              <div className="relative mb-2">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="w-full h-52 p-4 border border-[#E8E5E0] rounded-xl outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/15 resize-none text-[13px] leading-relaxed bg-[#F9F9F7]"
                />
                <div className="absolute bottom-3 right-3 text-[11px] font-medium text-[#9CA3AF]">
                  {text.length} chars
                </div>
              </div>
              <Disclaimer t={t} k="disc_proposal" className="mb-4" />

              <button
                onClick={() => setText(`Hello ${job.clientName.split(' ')[0]},

I carefully read your job for ${job.title}. I am a great fit because I have strong skills in ${matchedSkills}.

I am a fast learner, reliable, and ready to start immediately. Please let me know if you have any questions.

Best regards,
${user.name}`)}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold border border-[#E8E5E0] bg-white px-3.5 py-2 rounded-xl hover:bg-[#F9F9F7] hover:border-[#D1D5DB] text-[#374151] mb-5 transition-all"
              >
                <Sparkles size={13} /> {t('make_better')}
              </button>

              <button
                onClick={() => setStep(2)}
                disabled={text.length < 40}
                className="w-full py-3 bg-[#C73E33] text-white font-semibold text-[14px] rounded-xl hover:bg-[#AE332A] disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                {t('next')}
              </button>
            </div>
          )}

          {/* ── Step 2: Price + delivery ── */}
          {step === 2 && (
            <div>
              <h2 className="text-[17px] font-bold text-[#111827] mb-6">{t('apply_step2')}</h2>

              {/* Price input */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-[#111827] mb-2">Price (USD)</label>
                <div className="flex items-stretch">
                  <span className="bg-[#F3F4F6] border border-[#E8E5E0] border-r-0 px-4 flex items-center rounded-l-xl text-[#9CA3AF] font-semibold text-[15px]">
                    $
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="flex-1 border border-[#E8E5E0] px-4 py-3 rounded-r-xl outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/15 text-[16px] font-bold text-[#111827] bg-white"
                  />
                </div>
              </div>

              {/* Price feedback */}
              <div className="bg-[#F9F9F7] border border-[#E8E5E0] rounded-xl p-4 mb-2 flex items-start gap-2.5">
                <ShieldCheck size={15} className="shrink-0 mt-0.5 text-[#166534]" />
                <span className="text-[12px] font-medium text-[#374151] leading-relaxed">{priceMsg}</span>
              </div>
              <Disclaimer t={t} k="disc_price" className="mb-6" />

              {/* Delivery time */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-[#111827] mb-3">{t('delivery_time')}</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[2, 3, 5, 7].map(d => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`py-2.5 border rounded-xl text-[13px] font-semibold transition-all ${
                        days === d
                          ? 'border-[#C73E33] bg-[#FFF5F5] text-[#C73E33]'
                          : 'border-[#E8E5E0] bg-white text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9F9F7]'
                      }`}
                    >
                      {d} {t('days')}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!price || price <= 0}
                className="w-full py-3 bg-[#C73E33] text-white font-semibold text-[14px] rounded-xl hover:bg-[#AE332A] disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                {t('next')}
              </button>
            </div>
          )}

          {/* ── Step 3: Confirm terms ── */}
          {step === 3 && (
            <div>
              <h2 className="text-[17px] font-bold text-[#111827] mb-6">{t('apply_step3')}</h2>

              {/* Summary card */}
              <div className="bg-[#F9F9F7] border border-[#E8E5E0] rounded-xl p-4 mb-5 space-y-3">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#6B7280]">{t('job_price')}</span>
                  <span className="font-bold text-[#111827]">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#6B7280]">{t('platform_fee')}</span>
                  <span className="text-[#166534] font-semibold bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded-full text-[11px]">
                    {t('free')}
                  </span>
                </div>
                <div className="border-t border-dashed border-[#E5E7EB] pt-3">
                  <div className="text-[11px] text-[#9CA3AF] mb-1">1 USD = NPR 133</div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[13px] font-semibold text-[#111827]">{t('you_receive')}</span>
                    <span className="text-[20px] font-bold text-[#111827]">≈ NPR {fmtMoney(npr)}</span>
                  </div>
                </div>
                <Disclaimer t={t} k="receive_note" />
              </div>

              {/* Checklist */}
              <div className="border border-[#E8E5E0] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare size={15} className="text-[#C73E33]" />
                  <span className="text-[13px] font-bold text-[#111827]">{t('confirm_client')}</span>
                </div>
                <div className="space-y-2">
                  {[
                    { checked: chkPay, set: setChkPay, label: t('chk_pay') },
                    { checked: chkMile, set: setChkMile, label: t('chk_mile') },
                    { checked: chkDead, set: setChkDead, label: t('chk_dead') },
                  ].map(({ checked, set, label }, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-[#F9F9F7] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => set(e.target.checked)}
                        className="accent-[#C73E33] w-4 h-4 mt-0.5 shrink-0"
                      />
                      <span className="text-[13px] font-medium text-[#374151] leading-snug">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                disabled={!chkPay || !chkMile || !chkDead}
                className="w-full py-3 bg-[#C73E33] text-white font-semibold text-[14px] rounded-xl hover:bg-[#AE332A] disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                {t('next')}
              </button>
            </div>
          )}

          {/* ── Step 4: Review + send ── */}
          {step === 4 && (
            <div>
              <h2 className="text-[17px] font-bold text-[#111827] mb-5">{t('apply_step4')}</h2>

              {/* Review summary */}
              <div className="border border-[#E8E5E0] rounded-xl overflow-hidden mb-5">
                {/* Job */}
                <div className="px-4 py-3 border-b border-[#F3F4F6]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">Job</div>
                  <div className="text-[14px] font-semibold text-[#111827]">{job.title}</div>
                </div>
                {/* Message preview */}
                <div className="px-4 py-3 border-b border-[#F3F4F6]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">Message</div>
                  <div className="bg-[#F9F9F7] border border-[#E8E5E0] rounded-lg px-3 py-2.5 text-[12px] text-[#374151] leading-relaxed line-clamp-4">
                    {text}
                  </div>
                </div>
                {/* Terms + amount */}
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">Terms</div>
                    <div className="text-[14px] font-bold text-[#111827]">${price} in {days} days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">You get</div>
                    <div className="text-[18px] font-bold text-[#111827]">NPR {fmtMoney(npr)}</div>
                  </div>
                </div>
              </div>

              {/* Final confirmation */}
              <label className="flex items-start gap-3 cursor-pointer p-4 border border-[#E8E5E0] rounded-xl bg-[#F9F9F7] hover:bg-[#F3F4F6] transition-colors mb-5">
                <input
                  type="checkbox"
                  checked={finalCheck}
                  onChange={e => setFinalCheck(e.target.checked)}
                  className="accent-[#C73E33] w-4 h-4 mt-0.5 shrink-0"
                />
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#374151]">
                  <ShieldCheck size={14} className="text-[#C73E33] shrink-0" /> {t('ws_confirm')}
                </div>
              </label>

              {/* Pay preview (compact) */}
              <div className="mb-5">
                <NetPayPreview usd={job.budgetUSD} t={t} />
              </div>

              <button
                onClick={handleSend}
                disabled={!finalCheck}
                className="w-full py-3 bg-[#C73E33] text-white font-bold text-[15px] rounded-xl hover:bg-[#AE332A] disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {t('send_app')} <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
