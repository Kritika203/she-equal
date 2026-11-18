// One job shown in a listing.

import { ArrowRight, Bookmark, CheckCircle2, HeartHandshake, MapPin, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { DICT } from '../../i18n/translations.js';
import { fmtMoney } from '../../utils/format.js';



export function JobCard({ job, t, navTo, saved, onToggleSave, lang, compact = false }) {
  const isEn = lang === 'en';
  return (
    <article
      className="bg-white border border-[#E8E5E0] rounded-2xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#D4D0CA] transition-all duration-200 cursor-pointer group"
      onClick={() => navTo('job-detail', { id: job.id })}
    >
      <div className="p-5 sm:p-6">

        {/* ── Row 1: badges + time + bookmark ── */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {job.paymentVerified ? (
              <span className="inline-flex items-center gap-1.5 text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] font-semibold px-2.5 py-[5px] rounded-full whitespace-nowrap">
                <CheckCircle2 size={11} className="shrink-0" /> Payment Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] text-[11px] font-semibold px-2.5 py-[5px] rounded-full whitespace-nowrap">
                <ShieldAlert size={11} className="shrink-0" /> {t('payment_unverified')}
              </span>
            )}
            {job.beginnerFriendly && (
              <span className="inline-flex items-center gap-1.5 text-[#9B2C2C] bg-[#FFF5F5] border border-[#FED7D7] text-[11px] font-semibold px-2.5 py-[5px] rounded-full whitespace-nowrap">
                <ShieldCheck size={11} className="shrink-0" /> {t('beginner_friendly')}
              </span>
            )}
            {String(job.id).startsWith('bj-') && (
              <span className="inline-flex items-center gap-1.5 text-[#374151] bg-[#F9FAFB] border border-[#E5E7EB] text-[11px] font-semibold px-2.5 py-[5px] rounded-full whitespace-nowrap">
                <HeartHandshake size={11} className="shrink-0" /> {t('br_chip')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-[#9CA3AF] font-medium whitespace-nowrap">{job.postedHoursAgo}h ago</span>
            <button
              onClick={e => { e.stopPropagation(); onToggleSave(); }}
              aria-label={saved ? "Remove from saved" : "Save job"}
              className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all shrink-0 ${
                saved
                  ? 'bg-[#FFF5F5] text-[#C73E33] border-[#FED7D7]'
                  : 'border-[#E8E5E0] bg-white hover:border-[#C73E33] hover:bg-[#FFF5F5] text-[#9CA3AF]'
              }`}
            >
              <Bookmark size={14} fill={saved ? "currentColor" : "none"} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Row 2: job title ── */}
        <h2 className="text-[16px] sm:text-[17px] font-semibold text-[#111827] leading-snug mb-2 group-hover:text-[#C73E33] transition-colors line-clamp-2">
          {job.title}
        </h2>

        {/* ── Row 3: client + location ── */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#6B7280] mb-3.5">
          <span className="flex items-center gap-1.5 font-medium">
            <User size={12} className="text-[#9CA3AF] shrink-0" />
            {job.clientName}
          </span>
          <span className="text-[#D1D5DB]">·</span>
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin size={12} className="text-[#9CA3AF] shrink-0" />
            {job.clientCountry}
          </span>
        </div>

        {/* ── Row 4: description ── */}
        {!compact && (
          <p className="text-[13px] text-[#6B7280] line-clamp-2 leading-[1.7] mb-4">
            {isEn ? job.description : job.description}
          </p>
        )}

        {/* ── Row 5: skill tags ── */}
        {!compact && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skillsRequired.slice(0, 4).map(s => (
              <span key={s} className="text-[11px] font-medium text-[#374151] bg-[#F3F4F6] px-2.5 py-[5px] rounded-full border border-[#E5E7EB]">
                {s}
              </span>
            ))}
            {job.skillsRequired.length > 4 && (
              <span className="text-[11px] font-semibold text-[#9CA3AF] self-center pl-0.5">
                +{job.skillsRequired.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* ── Caution banner ── */}
        {job.caution && (
          <div className="flex items-start gap-2 text-[12px] font-medium text-[#9B2C2C] bg-[#FFF5F5] border border-[#FED7D7] rounded-xl px-3 py-2.5 mb-4 leading-relaxed">
            <ShieldAlert size={13} className="shrink-0 mt-0.5 text-[#C73E33]" />
            <span>{t('caution')}: {isEn ? job.caution : DICT.ne.ws_warn_id}</span>
          </div>
        )}

        {/* ── Row 6: budget + applicants + CTA ── */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6] mt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-bold text-[#111827] leading-none">${job.budgetUSD}</span>
              <span className="text-[13px] font-medium text-[#9CA3AF]">
                {job.budgetType === 'fixed' ? 'fixed' : '/ hr'}
              </span>
            </div>
            <div className="text-[11px] text-[#9CA3AF] mt-1">≈ NPR {fmtMoney(job.budgetUSD * 133)}</div>
          </div>
          <div className="flex items-center gap-3">
            {job.applicants > 0 && (
              <span className="text-[12px] text-[#9CA3AF] font-medium hidden sm:block">
                {job.applicants} applied
              </span>
            )}
            <button
              onClick={e => { e.stopPropagation(); navTo('job-detail', { id: job.id }); }}
              className="inline-flex items-center gap-1.5 bg-[#C73E33] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-[#AE332A] active:scale-[0.97] transition-all"
            >
              {t('view_job')}
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </div>
    </article>
  );
}
