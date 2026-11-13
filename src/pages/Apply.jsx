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
  const matchedSkills = job.skillsRequired.filter(s => user.skills.includes(s)).join(", ");
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
  const fmtNum = (n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const fillRange = (str) => str.replace('{lo}', fmtNum(rangeLo)).replace('{hi}', fmtNum(rangeHi));
  const priceMsg = price < rangeLo ? t('price_low') + ' ' + fillRange(t('price_hint')) : price > rangeHi ? t('price_high') + ' ' + fillRange(t('price_hint')) : fillRange(t('price_fair'));
  const npr = price * 133;

  const handleSend = () => {
    sentRef.current = true;
    if (applyDraft && applyDraft.jobId === job.id) setApplyDraft(null);
    setAppliedJobs(prev => [{ jobId: job.id, price, npr, date: new Date().toISOString(), status: 'waiting' }, ...prev]);
    setStep(5);
  };

  if (step === 5) {
    return (
      <div className="max-w-[650px] mx-auto bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 text-center">
        <CheckCircle2 size={64} strokeWidth={1.5} className="mx-auto mb-6 text-[#C73E33]" />
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-4">{t('app_sent')}</h1>
        <p className="text-lg text-[#4A4744] mb-10 leading-relaxed max-w-md mx-auto">{t('app_sent_desc')}</p>
        <div className="space-y-4 max-w-sm mx-auto">
          <button onClick={() => navTo('opportunities', { tab: 'applied' })} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-lg rounded-full hover:bg-[#AE332A] min-h-[52px]">{t('view_opps')}</button>
          <button onClick={() => navTo('firstwork')} className="w-full py-3.5 border border-[#E3E0D9] font-semibold text-lg rounded-full hover:bg-[#F6F4EF] min-h-[52px] bg-white">{t('back_to_jobs')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => step === 1 ? navTo('job-detail', {id: job.id}) : setStep(step - 1)} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2">
          <ChevronLeft size={20} /> {t('back')}
        </button>
        <div className="text-sm font-semibold bg-[#F0EEE9] px-4 py-2 rounded-full border border-[#EAE7E1]">{t('step')} {step} {t('of')} 4</div>
      </div>
      
      <div className="h-2 bg-[#EAE7E1] rounded-full mb-10 overflow-hidden">
        <div className="h-full bg-[#C73E33] transition-all" style={{width: `${(step/4)*100}%`}}></div>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in">
          <h2 className="text-[28px] sm:text-[30px] font-semibold mb-6">{t('apply_step1')}</h2>
          <p className="text-base text-[#4A4744] mb-6 font-medium">Write a short message to the client. We started it for you based on your skills.</p>
          <div className="mb-3"><span className="inline-flex items-center rounded-full bg-[#F0EEE9] px-2.5 py-1 text-[13px] font-medium text-[#6E6963]">{t('ai_label')}</span></div>
          <div className="relative mb-3">
            <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-72 p-5 border border-[#EAE7E1] rounded-[14px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 resize-none text-base leading-relaxed bg-[#F6F4EF]" />
            <div className="absolute bottom-4 right-4 text-sm font-semibold text-[#8A8580]">{text.length} chars</div>
          </div>
          <Disclaimer t={t} k="disc_proposal" className="mb-6" />
          <div className="flex justify-start mb-10">
            <button onClick={() => setText(`Hello ${job.clientName.split(' ')[0]},

I carefully read your job for ${job.title}. I am a great fit because I have strong skills in ${matchedSkills}.

I am a fast learner, reliable, and ready to start immediately. Please let me know if you have any questions.

Best regards,
${user.name}`)} className="text-sm font-semibold border border-[#EAE7E1] bg-white px-5 py-3 rounded-full hover:border-[#DDD8CE] min-h-[48px] flex items-center gap-2 text-[#1C1B1A]"><Sparkles size={20} /> {t('make_better')}</button>
          </div>
          <button onClick={() => setStep(2)} disabled={text.length < 40} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-lg rounded-full hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('next')}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in">
          <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">{t('apply_step2')}</h2>
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3">Price (USD)</label>
            <div className="flex items-center">
              <span className="bg-[#F6F4EF] border border-[#EAE7E1] border-r-0 px-6 py-4 rounded-l-[14px] text-[#8A8580] font-semibold text-xl">$</span>
              <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border border-[#EAE7E1] px-6 py-4 rounded-r-[14px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-2xl font-semibold bg-white" />
            </div>
          </div>
          <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] p-5 mb-3 text-base font-medium text-[#1C1B1A] flex gap-3">
            <ShieldCheck className="shrink-0 mt-0.5" /> <span>{priceMsg}</span>
          </div>
          <Disclaimer t={t} k="disc_price" className="mb-10" />
          
          <div className="mb-10">
            <label className="block text-lg font-semibold mb-4">{t('delivery_time')}</label>
            <div className="grid grid-cols-2 gap-4">
              {[2, 3, 5, 7].map(d => (
                <button key={d} onClick={() => setDays(d)} className={`py-3.5 border rounded-full text-lg font-semibold transition-colors min-h-[52px] ${days === d ? 'border-[#C73E33] bg-[#FAF0EE] text-[#AE332A]' : 'border-[#EAE7E1] bg-white text-[#4A4744] hover:border-[#DDD8CE]'}`}>
                  {d} {t('days')}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(3)} disabled={!price || price <= 0} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-lg rounded-full hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('next')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in">
          <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">{t('apply_step3')}</h2>
          
          <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 mb-8">
            <div className="flex justify-between items-center mb-4 text-base font-medium">
              <span className="text-[#4A4744]">{t('job_price')}</span>
              <span className="font-semibold text-lg">${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-base font-medium pb-6 border-b-2 border-dashed border-[#EAE7E1]">
              <span className="text-[#4A4744]">{t('platform_fee')}</span>
              <span className="text-[#AE332A] font-semibold bg-[#FAF0EE] px-3 py-1 rounded-[12px]">{t('free')}</span>
            </div>
            <div className="text-sm font-semibold text-[#8A8580] mb-2">1 USD = NPR 133</div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xl">{t('you_receive')}</span>
              <span className="font-semibold text-3xl">≈ NPR {fmtMoney(npr)}</span>
            </div>
            <Disclaimer t={t} k="receive_note" className="mt-6" />
          </div>

          <div className="border border-[#E3E0D9] rounded-[20px] p-6 sm:p-6 mb-10 bg-white">
            <div className="font-semibold text-lg mb-6 flex items-center gap-2"><CheckSquare size={24} /> {t('confirm_client')}</div>
            <label className="flex items-center gap-4 mb-4 cursor-pointer text-base font-medium hover:bg-[#F6F4EF] p-2 min-h-[44px] -ml-2 rounded-[12px] transition-colors">
              <input type="checkbox" checked={chkPay} onChange={e => setChkPay(e.target.checked)} className="accent-[#C73E33] w-6 h-6" /> {t('chk_pay')}
            </label>
            <label className="flex items-center gap-4 mb-4 cursor-pointer text-base font-medium hover:bg-[#F6F4EF] p-2 min-h-[44px] -ml-2 rounded-[12px] transition-colors">
              <input type="checkbox" checked={chkMile} onChange={e => setChkMile(e.target.checked)} className="accent-[#C73E33] w-6 h-6" /> {t('chk_mile')}
            </label>
            <label className="flex items-center gap-4 cursor-pointer text-base font-medium hover:bg-[#F6F4EF] p-2 min-h-[44px] -ml-2 rounded-[12px] transition-colors">
              <input type="checkbox" checked={chkDead} onChange={e => setChkDead(e.target.checked)} className="accent-[#C73E33] w-6 h-6" /> {t('chk_dead')}
            </label>
          </div>

          <button onClick={() => setStep(4)} disabled={!chkPay || !chkMile || !chkDead} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-lg rounded-full hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('next')}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="animate-in fade-in">
          <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">{t('apply_step4')}</h2>
          
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 mb-8 text-base space-y-6">
            <div>
              <div className="text-[#8A8580] text-sm font-semibold mb-1 uppercase tracking-wider">Job</div>
              <div className="font-semibold text-xl">{job.title}</div>
            </div>
            <div>
              <div className="text-[#8A8580] text-sm font-semibold mb-2 uppercase tracking-wider">Message</div>
              <div className="bg-[#F6F4EF] p-4 border border-[#EAE7E1] rounded-[14px] font-medium line-clamp-4 leading-relaxed">{text}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t border-[#EAE7E1]">
              <div>
                <div className="text-[#8A8580] text-sm font-semibold mb-1 uppercase tracking-wider">Terms</div>
                <div className="font-semibold text-xl">${price} in {days} days</div>
              </div>
              <div className="sm:text-right">
                <div className="text-[#8A8580] text-sm font-semibold mb-1 uppercase tracking-wider">You get</div>
                <div className="font-semibold text-2xl text-[#1C1B1A]">NPR {fmtMoney(npr)}</div>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-4 mb-10 cursor-pointer p-5 border border-[#E3E0D9] rounded-[20px] bg-[#F6F4EF] hover:bg-[#EDEAE4] transition-colors">
            <div className="shrink-0"><input type="checkbox" checked={finalCheck} onChange={e => setFinalCheck(e.target.checked)} className="accent-[#C73E33] w-6 h-6" /></div>
            <div className="text-base font-semibold flex items-center gap-2"><ShieldCheck size={20} className="text-[#1C1B1A]" /> {t('ws_confirm')}</div>
          </label>

          <div className="mb-10"><NetPayPreview usd={job.budgetUSD} t={t} /></div>

          <button onClick={handleSend} disabled={!finalCheck} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-xl rounded-full hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-3">
            {t('send_app')} <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
