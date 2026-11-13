// Details and checks for one job.

import { AlertTriangle, Bookmark, Check, CheckCircle2, CheckSquare, ChevronLeft, ClipboardList, Flag, HeartHandshake, MapPin, ShieldCheck, User, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { NetPayPreview } from '../components/payment/Payment.jsx';
import { SafeTalkCard } from '../components/safety/SafetyTools.jsx';
import { fmt, fmtMoney } from '../utils/format.js';
import { getLevel } from '../utils/profile.js';



export function JobDetail({ job, t, navTo, user, savedJobs, setSavedJobs, lang, showToast, hasDraft = false, skillLevels = {} }) {
  const isEn = lang === 'en';
  const saved = savedJobs.includes(job.id);
  const digits = (n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const haveCount = job.skillsRequired.filter(sk => user.skills.includes(sk)).length;
  const [reportOpen, setReportOpen] = useState(false);

  const handleListen = () => {
    const text = `${job.title}. ${job.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-[850px] mx-auto bg-white border border-[#EAE7E1] rounded-[20px] overflow-hidden relative">
      <div className="p-5 sm:p-6 pb-32">
        <button onClick={() => navTo('firstwork')} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] mb-8 min-h-[48px] px-2 -ml-2">
          <ChevronLeft size={20} /> {t('back_to_jobs')}
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-[28px] sm:text-[30px] font-semibold mb-4 leading-tight">{job.title}</h1>
            {String(job.id).startsWith('bj-') && (
              <div className="mb-4"><span className="bg-[#F0EEE9] text-[#1C1B1A] px-3 py-1 rounded-full text-[13px] font-semibold inline-flex items-center gap-1.5"><HeartHandshake size={16} /> {t('br_chip')}</span></div>
            )}
            <div className="flex flex-wrap items-center gap-4 text-base text-[#4A4744] font-medium">
              <span className="flex items-center gap-2 bg-[#F6F4EF] px-3 py-1.5 rounded-[12px] border border-[#EAE7E1]"><User size={20} className="text-[#8A8580]"/> {job.clientName}</span>
              <span className="flex items-center gap-2 bg-[#F6F4EF] px-3 py-1.5 rounded-[12px] border border-[#EAE7E1]"><MapPin size={20} className="text-[#8A8580]"/> {job.clientCountry}</span>
              <span className="text-[#8A8580] px-2">{job.postedHoursAgo}h ago</span>
              <span className="text-[#8A8580] px-2">• {job.applicants} {t('applied_count')}</span>
            </div>
            {!isEn && <div className="text-sm font-semibold text-[#8A8580] mt-4 flex items-center gap-2"><Flag size={16}/> {t('job_en_note')}</div>}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
             <button onClick={handleListen} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 border border-[#EAE7E1] rounded-full hover:border-[#DDD8CE] text-[#1C1B1A] font-semibold min-h-[48px]">
              <Volume2 size={20} /> <span className="md:hidden lg:inline">{t('listen')}</span>
            </button>
            <button onClick={() => setReportOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 border border-[#EAE7E1] rounded-full hover:border-[#DDD8CE] text-[#1C1B1A] font-semibold min-h-[48px]">
              <Flag size={20} /> <span className="md:hidden lg:inline">{t('report')}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] p-6 sm:p-6 mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-4xl font-semibold mb-1">${job.budgetUSD} <span className="text-2xl font-medium text-[#4A4744]">{job.budgetType === 'fixed' ? 'fixed' : '/ hr'}</span></div>
            <div className="text-xl font-medium text-[#4A4744]">≈ NPR {fmtMoney(job.budgetUSD * 133)}</div>
          </div>
          <div className="text-sm text-[#8A8580] max-w-xs font-medium leading-relaxed">{t('sample_rate')}</div>
        </div>

        <div className="mb-10 -mt-4"><NetPayPreview usd={job.budgetUSD} t={t} /></div>

        {/* Card 1: Client Trust Card. Checked facts are kept apart from automatic warnings. */}
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 mb-6">
          <h3 className="font-semibold text-xl mb-5 flex items-center gap-3"><ShieldCheck size={24} className="text-[#C73E33] shrink-0" /> {t('tc_title')}</h3>
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-[#6E6963] mb-3">{t('tc_facts')}</h4>
            <ul className="space-y-3 text-base text-[#1C1B1A]">
              <li>
                <div className="font-semibold">{job.clientType} · {job.clientCountry}</div>
                <p className="text-[#4A4744] mt-1">{job.aboutClient}</p>
              </li>
              <li>{fmt(t('tc_since'), { year: digits(job.memberSince) })}</li>
              <li className="flex items-start gap-2">
                {job.paymentVerified && <Check size={20} className="mt-0.5 shrink-0 text-[#1C1B1A]" />}
                <span>{job.paymentVerified ? t('tc_pay_ok') : t('tc_pay_no')}</span>
              </li>
              <li>{fmt(t('tc_jobs'), { n: digits(job.jobsPostedByClient) })}</li>
              {job.hireRate > 0 ? (
                <>
                  <li>{fmt(t('tc_hire'), { n: digits(job.hireRate) })}</li>
                  {job.clientRating > 0 && <li>{fmt(t('tc_rating'), { n: digits(job.clientRating.toFixed(1)) })}</li>}
                </>
              ) : (
                <li>{t('tc_new')}</li>
              )}
            </ul>
          </div>
          {(!job.paymentVerified || job.caution) ? (
            <div className="bg-[#FAF0EE] rounded-[14px] p-4">
              <h4 className="font-semibold text-base text-[#AE332A] flex items-start gap-2 mb-3"><AlertTriangle size={20} className="mt-0.5 shrink-0" /> <span>{t('tc_warn_h')}</span></h4>
              <div className="space-y-3 text-base text-[#1C1B1A]">
                {!job.paymentVerified && <p>{t('tc_warn_pay')}</p>}
                {job.caution && <p>{job.caution}</p>}
              </div>
            </div>
          ) : (
            <p className="text-base text-[#4A4744]">{t('tc_none')}</p>
          )}
          <Disclaimer t={t} k="disc_trust" className="mt-4" />
        </div>

        {/* Card 2: Skill Match against her own WorkPassport */}
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 mb-6">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-3"><CheckSquare size={24} className="text-[#C73E33] shrink-0" /> {t('sm_title')}</h3>
          <p className="text-base text-[#1C1B1A] font-medium mb-4">
            {haveCount === job.skillsRequired.length ? t('sm_all') : fmt(t('sm_some'), { x: digits(haveCount), y: digits(job.skillsRequired.length) })}
          </p>
          <ul className="divide-y divide-[#EAE7E1]">
            {job.skillsRequired.map(sk => {
              const has = user.skills.includes(sk);
              return (
                <li key={sk} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 min-h-[44px]">
                  <span className="flex items-start gap-2 min-w-0 text-base">
                    {has && <Check size={20} className="mt-0.5 shrink-0 text-[#1C1B1A]" />}
                    <span className="min-w-0 break-words"><span className="font-semibold text-[#1C1B1A]">{sk}</span>{has && <span className="text-[#6E6963]"> — {t('pp_lvl_' + getLevel(user, skillLevels, sk))}</span>}</span>
                  </span>
                  {has ? (
                    <span className="shrink-0 bg-[#F0EEE9] text-[#4A4744] px-3 py-1 rounded-full text-[13px] font-semibold">{t('sm_have')}</span>
                  ) : (
                    <span className="shrink-0 bg-[#FAF0EE] text-[#AE332A] px-3 py-1 rounded-full text-[13px] font-semibold">{t('sm_new')}</span>
                  )}
                </li>
              );
            })}
          </ul>
          {haveCount < job.skillsRequired.length && <p className="text-base text-[#4A4744] mt-4">{t('sm_apply')}</p>}
          <button onClick={() => navTo('skillbridge')} className="mt-3 text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px] text-left">{t('sb_link')}</button>
        </div>

        {/* Card 3: Opportunity Compatibility */}
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 mb-10">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-3"><ClipboardList size={24} className="text-[#C73E33] shrink-0" /> {t('oc_title')}</h3>
          <dl className="divide-y divide-[#EAE7E1] text-base">
            {[
              [t('oc_meet'), job.meetingTimeNepal],
              [t('oc_laptop'), job.needsOwnLaptop ? t('oc_yes') : t('oc_no')],
              [t('oc_net'), job.internetNeed],
              [t('oc_time'), fmt(t('wr_days'), { days: digits(job.deadlineDays) })],
            ].map(([k, v]) => (
              <div key={k} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                <dt className="text-[#6E6963]">{k}</dt>
                <dd className="font-semibold text-[#1C1B1A] sm:text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <SafeTalkCard t={t} job={job} />

        <div className="mb-10">
          <h3 className="font-semibold text-2xl mb-4">{t('about_job')}</h3>
          <p className="text-lg text-[#1C1B1A] whitespace-pre-wrap leading-relaxed bg-white">{job.description}</p>
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div>
              <h4 className="font-semibold text-lg mb-3">{t('deliver_title')}</h4>
              <ul className="space-y-2 text-base text-[#4A4744]">
                {job.deliverables.map(d => <li key={d} className="flex items-start gap-2"><Check size={20} className="mt-1 shrink-0 text-[#1C1B1A]" /> <span>{d}</span></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">{t('client_gives_title')}</h4>
              <ul className="space-y-2 text-base text-[#4A4744]">
                {job.clientProvides.map(d => <li key={d} className="flex items-start gap-2"><Check size={20} className="mt-1 shrink-0 text-[#1C1B1A]" /> <span>{d}</span></li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 mb-10">
          <h3 className="font-semibold text-xl mb-6 flex items-center gap-3"><ShieldCheck size={28} className="text-[#C73E33]" /> {t('ws_checked')}</h3>
          <div className="space-y-4 text-base font-medium">
            <div className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-0.5 text-[#1C1B1A]" /> <span>{t('ws_ok_scam')}</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-0.5 text-[#1C1B1A]" /> <span>{t('ws_ok_pay')}</span></div>
            {job.paymentVerified && <div className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-0.5 text-[#1C1B1A]" /> <span>{t('ws_ok_id')}</span></div>}
            <div className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-0.5 text-[#1C1B1A]" /> <span>{t('ws_ok_scope')}</span></div>
          </div>
          <Disclaimer t={t} k="disc_ws" className="mt-6" />
        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-[#EAE7E1] p-4 sm:p-6 flex flex-row gap-4 items-center justify-between sm:justify-end">
        {hasDraft && <div className="absolute bottom-full left-0 right-0 bg-[#FAF0EE] text-[#AE332A] text-sm font-semibold px-4 py-2 text-center sm:text-right sm:px-6">{t('pv_unfinished')}</div>}
        <button onClick={() => setSavedJobs(prev => prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id])} className={`px-6 py-3.5 rounded-full border font-semibold flex items-center justify-center gap-3 min-h-[52px] transition-colors ${saved ? 'bg-[#FAF0EE] text-[#AE332A] border-[#C73E33]' : 'bg-white border-[#E3E0D9] text-[#1C1B1A] hover:bg-[#F6F4EF]'}`}>
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} /> <span className="hidden sm:inline">{saved ? t('saved') : t('save')}</span>
        </button>
        <button onClick={() => navTo('apply', { id: job.id })} className="flex-1 sm:flex-none sm:w-64 py-3.5 bg-[#C73E33] text-white rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
          {t('apply_now')}
        </button>
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-[#1C1B1A]/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-[20px] w-full max-w-[450px]">
            <h3 className="font-semibold text-2xl mb-2 flex items-center gap-3"><Flag size={24} className="text-[#AE332A]" /> {t('report_title')}</h3>
            <p className="text-[#8A8580] font-medium mb-6">Tell us what is wrong. This is kept private.</p>
            <div className="space-y-4 mb-8">
              {[t('rep_1'), t('rep_2'), t('rep_3'), t('rep_4'), t('rep_5')].map((r, i) => (
                <label key={i} className="flex items-center gap-4 text-base font-medium cursor-pointer p-4 border border-[#EAE7E1] rounded-[14px] hover:border-[#DDD8CE] bg-[#F6F4EF]">
                  <input type="radio" name="report_reason" className="accent-[#C73E33] w-5 h-5" /> {r}
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setReportOpen(false)} className="flex-1 py-3.5 border border-[#E3E0D9] rounded-full font-semibold text-lg bg-white hover:bg-[#F6F4EF] min-h-[52px]">{t('cancel')}</button>
              <button onClick={() => { setReportOpen(false); showToast(t('report_toast')); }} className="flex-1 py-3.5 bg-[#C73E33] text-white rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">{t('send_report')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
