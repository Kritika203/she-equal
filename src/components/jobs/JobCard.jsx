// One job shown in a listing.

import { Bookmark, CheckCircle2, HeartHandshake, MapPin, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { DICT } from '../../i18n/translations.js';
import { fmtMoney } from '../../utils/format.js';



export function JobCard({ job, t, navTo, saved, onToggleSave, lang, compact = false }) {
  const isEn = lang === 'en';
  return (
    <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 hover:border-[#DDD8CE] hover:shadow-[0_2px_16px_rgba(28,27,26,0.07)] transition flex flex-col sm:flex-row gap-6 relative overflow-hidden cursor-pointer group" onClick={() => navTo('job-detail', { id: job.id })}>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
          {job.paymentVerified ? (
            <span className="flex items-center gap-1.5 font-semibold bg-[#F0EEE9] px-3 py-1 rounded-full text-[13px]"><CheckCircle2 size={16} className="text-[#1C1B1A]" /> {t('payment_verified')}</span>
          ) : (
            <span className="flex items-center gap-1.5 font-semibold text-[#8A8580] px-3 py-1 rounded-full text-[13px] border border-[#EAE7E1]"><ShieldAlert size={16} /> {t('payment_unverified')}</span>
          )}
          {job.beginnerFriendly && (
            <span className="bg-[#FAF0EE] text-[#AE332A] border border-[#FAF0EE] px-3 py-1 rounded-full text-[13px] font-semibold flex items-center gap-1.5"><ShieldCheck size={16} /> {t('beginner_friendly')}</span>
          )}
          {String(job.id).startsWith('c') && (
            <span className="bg-[#F0EEE9] text-[#1C1B1A] px-3 py-1 rounded-full text-[13px] font-semibold flex items-center gap-1.5"><User size={16} /> {t('cl_posted_chip')}</span>
          )}
          {String(job.id).startsWith('bj-') && (
            <span className="bg-[#F0EEE9] text-[#1C1B1A] px-3 py-1 rounded-full text-[13px] font-semibold flex items-center gap-1.5"><HeartHandshake size={16} /> {t('br_chip')}</span>
          )}
          <span className="text-[#8A8580] font-medium">{job.postedHoursAgo}h ago</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:underline line-clamp-2 leading-tight">{isEn ? job.title : (job.title)}</h2>
        <div className="text-base text-[#4A4744] mb-4 flex flex-wrap items-center gap-y-2">
          <span className="flex items-center gap-1.5 font-medium"><User size={20} className="text-[#8A8580]" /> {job.clientName}</span>
          <span className="mx-3 text-[#D8D4CC]">|</span>
          <span className="flex items-center gap-1.5 font-medium"><MapPin size={20} className="text-[#8A8580]" /> {job.clientCountry}</span>
        </div>
        
        {!compact && (
          <>
            <p className="text-base text-[#4A4744] line-clamp-2 mb-5 leading-relaxed">{isEn ? job.description : (job.description)}</p>

            <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
              {job.skillsRequired.slice(0, 4).map(s => <span key={s} className="bg-white border border-[#EAE7E1] text-[#4A4744] font-medium text-sm px-3 py-1.5 rounded-full">{s}</span>)}
              {job.skillsRequired.length > 4 && <span className="text-sm font-semibold text-[#8A8580] self-center px-2">+{job.skillsRequired.length - 4}</span>}
            </div>
          </>
        )}

        {job.caution && (
          <div className="text-[#AE332A] text-sm flex items-start gap-2 mt-4 font-semibold bg-[#FAF0EE] p-3 rounded-[12px] border border-[#FAF0EE]">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" /> 
            <span>{t('caution')}: {isEn ? job.caution : DICT.ne.ws_warn_id}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end shrink-0 sm:w-40 border-t sm:border-t-0 sm:border-l border-[#EAE7E1] pt-4 sm:pt-0 sm:pl-6">
        <div className="text-left sm:text-right w-full">
          <div className="font-semibold text-2xl mb-1">${job.budgetUSD} <span className="text-lg font-medium text-[#4A4744]">{job.budgetType === 'fixed' ? 'fixed' : '/ hr'}</span></div>
          <div className="text-[#8A8580] text-sm font-medium mb-4">≈ NPR {fmtMoney(job.budgetUSD * 133)}</div>
          <div className="text-sm text-[#4A4744] font-medium mb-4 hidden sm:block">{job.applicants} {t('applied_count')}</div>
        </div>
        
        <div className="flex items-center gap-3 w-full justify-end">
          <button onClick={(e) => { e.stopPropagation(); onToggleSave(); }} className={`min-h-[48px] w-12 shrink-0 flex items-center justify-center rounded-full border transition-colors ${saved ? 'bg-[#FAF0EE] text-[#AE332A] border-[#C73E33]' : 'border-[#EAE7E1] bg-white hover:border-[#DDD8CE] text-[#1C1B1A]'}`} aria-label="Save job">
            <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); navTo('job-detail', { id: job.id }); }} className="bg-[#C73E33] text-white px-5 rounded-full text-base font-semibold hover:bg-[#AE332A] min-h-[52px] flex-1 sm:flex-none flex items-center justify-center">
            {t('view_job')}
          </button>
        </div>
      </div>
    </div>
  );
}
