// Details and checks for one job.

import { AlertTriangle, ArrowLeft, Bookmark, Check, CheckCircle2, ChevronDown, ClipboardList, Flag, HeartHandshake, Info, Laptop, MapPin, ShieldCheck, User, Wifi, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { NetPayPreview } from '../components/payment/Payment.jsx';
import { SafeTalkCard } from '../components/safety/SafetyTools.jsx';
import { fmt, fmtMoney } from '../utils/format.js';
import { getLevel } from '../utils/profile.js';



/* ── small section-card wrapper ── */
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-[#E8E5E0] rounded-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ── card heading ── */
function CardHeading({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#F3F4F6]">
      {Icon && <Icon size={16} className="text-[#C73E33] shrink-0" />}
      <h3 className="font-semibold text-[14px] text-[#111827]">{label}</h3>
    </div>
  );
}

/* ── key-value row ── */
function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#F3F4F6] last:border-0">
      <span className="text-[13px] text-[#6B7280]">{label}</span>
      <span className="text-[13px] font-semibold text-[#111827] text-right max-w-[55%]">{value}</span>
    </div>
  );
}

/* ── checklist item ── */
function CheckItem({ text, variant = 'neutral' }) {
  const colors = {
    green: 'text-[#166534]',
    neutral: 'text-[#374151]',
  };
  return (
    <div className={`flex items-start gap-2.5 ${colors[variant]}`}>
      <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-[#166534]" />
      <span className="text-[13px] font-medium">{text}</span>
    </div>
  );
}

export function JobDetail({ job, t, navTo, user, savedJobs, setSavedJobs, lang, showToast, hasDraft = false, skillLevels = {} }) {
  const isEn = lang === 'en';
  const saved = savedJobs.includes(job.id);
  const digits = n => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const haveCount = job.skillsRequired.filter(sk => user.skills.includes(sk)).length;
  const [reportOpen, setReportOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const handleListen = () => {
    const text = `${job.title}. ${job.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleSave = () =>
    setSavedJobs(prev => prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 pb-28">

      {/* ── Back link ── */}
      <button
        onClick={() => navTo('firstwork')}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        {t('back_to_jobs')}
      </button>

      {/* ════════════════════════════════════════
          TWO-COLUMN GRID
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ══════════════════════════
            LEFT COLUMN — main content
        ══════════════════════════ */}
        <div className="space-y-5 min-w-0">

          {/* ── Hero card: title + meta ── */}
          <Card>
            <div className="p-5 sm:p-6">
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.paymentVerified && (
                  <span className="inline-flex items-center gap-1.5 text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] font-semibold px-2.5 py-[5px] rounded-full">
                    <CheckCircle2 size={11} /> Payment Verified
                  </span>
                )}
                {job.beginnerFriendly && (
                  <span className="inline-flex items-center gap-1.5 text-[#9B2C2C] bg-[#FFF5F5] border border-[#FED7D7] text-[11px] font-semibold px-2.5 py-[5px] rounded-full">
                    <ShieldCheck size={11} /> {t('beginner_friendly')}
                  </span>
                )}
                {String(job.id).startsWith('bj-') && (
                  <span className="inline-flex items-center gap-1.5 text-[#374151] bg-[#F9FAFB] border border-[#E5E7EB] text-[11px] font-semibold px-2.5 py-[5px] rounded-full">
                    <HeartHandshake size={11} /> {t('br_chip')}
                  </span>
                )}
              </div>

              {/* Title row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <h1 className="text-[22px] sm:text-[24px] font-bold text-[#111827] leading-tight flex-1">
                  {job.title}
                </h1>
                {/* Utility buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleListen}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#374151] border border-[#E8E5E0] rounded-xl px-3 py-2 hover:bg-[#F9F9F7] transition-colors"
                  >
                    <Volume2 size={13} /> {t('listen')}
                  </button>
                  <button
                    onClick={() => setReportOpen(true)}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#374151] border border-[#E8E5E0] rounded-xl px-3 py-2 hover:bg-[#F9F9F7] transition-colors"
                  >
                    <Flag size={13} /> {t('report')}
                  </button>
                </div>
              </div>

              {/* Client + meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#6B7280] mb-5">
                <span className="flex items-center gap-1.5 font-medium">
                  <User size={13} className="text-[#9CA3AF]" /> {job.clientName}
                </span>
                <span className="text-[#D1D5DB]">·</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={13} className="text-[#9CA3AF]" /> {job.clientCountry}
                </span>
                <span className="text-[#D1D5DB]">·</span>
                <span className="font-medium">{job.postedHoursAgo}h ago</span>
                <span className="text-[#D1D5DB]">·</span>
                <span className="font-medium">{job.applicants} applied</span>
              </div>

              {/* Budget highlight */}
              <div className="bg-[#F9F9F7] border border-[#E8E5E0] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[28px] font-bold text-[#111827]">${job.budgetUSD}</span>
                    <span className="text-[15px] font-medium text-[#9CA3AF]">
                      {job.budgetType === 'fixed' ? 'fixed price' : '/ hour'}
                    </span>
                  </div>
                  <div className="text-[13px] text-[#9CA3AF] mt-0.5">≈ NPR {fmtMoney(job.budgetUSD * 133)}</div>
                </div>
                <div className="text-[11px] text-[#9CA3AF] max-w-[220px] leading-relaxed">
                  {t('sample_rate')}
                </div>
              </div>
            </div>
          </Card>

          {/* ── About the job ── */}
          <Card>
            <CardHeading label={t('about_job')} />
            <div className="p-5 sm:p-6">
              <p className="text-[14px] text-[#374151] leading-[1.75] whitespace-pre-wrap">
                {job.description}
              </p>

              {/* Skills */}
              {job.skillsRequired.length > 0 && (
                <div className="mt-5 pt-5 border-t border-[#F3F4F6]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">Skills needed</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map(s => (
                      <span
                        key={s}
                        className={`text-[12px] font-medium px-3 py-1.5 rounded-full border ${
                          user.skills.includes(s)
                            ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151]'
                        }`}
                      >
                        {s} {user.skills.includes(s) ? '✓' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* ── Deliverables + what client gives ── */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Card>
              <CardHeading label={t('deliver_title')} />
              <ul className="p-5 space-y-3">
                {job.deliverables.map(d => (
                  <li key={d} className="flex items-start gap-2.5 text-[13px] text-[#374151]">
                    <Check size={14} className="mt-0.5 shrink-0 text-[#166534]" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardHeading label={t('client_gives_title')} />
              <ul className="p-5 space-y-3">
                {job.clientProvides.map(d => (
                  <li key={d} className="flex items-start gap-2.5 text-[13px] text-[#374151]">
                    <Check size={14} className="mt-0.5 shrink-0 text-[#166534]" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* ── WorkShield check ── */}
          <Card>
            <CardHeading icon={ShieldCheck} label={t('ws_checked')} />
            <div className="p-5 space-y-3">
              <CheckItem text={t('ws_ok_scam')} variant="green" />
              <CheckItem text={t('ws_ok_pay')} variant="green" />
              {job.paymentVerified && <CheckItem text={t('ws_ok_id')} variant="green" />}
              <CheckItem text={t('ws_ok_scope')} variant="green" />
              <div className="pt-3 border-t border-[#F3F4F6]">
                <Disclaimer t={t} k="disc_ws" />
              </div>
            </div>
          </Card>

          {/* ── Skill match ── */}
          <Card>
            <CardHeading icon={CheckCircle2} label={t('sm_title')} />
            <div className="p-5">
              <p className="text-[13px] text-[#374151] mb-4 font-medium">
                {haveCount === job.skillsRequired.length
                  ? t('sm_all')
                  : fmt(t('sm_some'), { x: digits(haveCount), y: digits(job.skillsRequired.length) })}
              </p>
              <div className="space-y-2">
                {job.skillsRequired.map(sk => {
                  const has = user.skills.includes(sk);
                  return (
                    <div
                      key={sk}
                      className="flex items-center justify-between gap-3 py-2.5 border-b border-[#F3F4F6] last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {has
                          ? <Check size={13} className="shrink-0 text-[#166534]" />
                          : <div className="w-3.5 h-3.5 rounded-full border-2 border-[#D1D5DB] shrink-0" />}
                        <span className="text-[13px] font-medium text-[#111827] truncate">{sk}</span>
                        {has && (
                          <span className="text-[11px] text-[#9CA3AF] truncate hidden sm:inline">
                            — {t('pp_lvl_' + getLevel(user, skillLevels, sk))}
                          </span>
                        )}
                      </div>
                      <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        has
                          ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                          : 'bg-[#FFF5F5] text-[#9B2C2C] border border-[#FED7D7]'
                      }`}>
                        {has ? t('sm_have') : t('sm_new')}
                      </span>
                    </div>
                  );
                })}
              </div>
              {haveCount < job.skillsRequired.length && (
                <p className="text-[13px] text-[#6B7280] mt-4">{t('sm_apply')}</p>
              )}
              <button
                onClick={() => navTo('skillbridge')}
                className="mt-3 text-[13px] font-semibold text-[#C73E33] hover:underline underline-offset-2"
              >
                {t('sb_link')} →
              </button>
            </div>
          </Card>

          {/* ── Pay breakdown (collapsible on mobile) ── */}
          <Card>
            <button
              onClick={() => setPayOpen(!payOpen)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#F9F9F7] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#C73E33] shrink-0" />
                <span className="font-semibold text-[14px] text-[#111827]">{t('np_title')}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-[#9CA3AF] transition-transform duration-200 ${payOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {payOpen && (
              <div className="px-5 pb-5">
                <NetPayPreview usd={job.budgetUSD} t={t} />
              </div>
            )}
          </Card>

          {/* ── Safe talk ── */}
          <SafeTalkCard t={t} job={job} />

        </div>

        {/* ══════════════════════════
            RIGHT COLUMN — sidebar
        ══════════════════════════ */}
        <div className="space-y-5 lg:sticky lg:top-20">

          {/* ── Apply CTA card ── */}
          <Card>
            <div className="p-5">
              {hasDraft && (
                <div className="mb-4 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[12px] font-semibold rounded-xl px-3 py-2.5 flex items-center gap-2">
                  <Info size={13} className="shrink-0" /> {t('pv_unfinished')}
                </div>
              )}
              <button
                onClick={() => navTo('apply', { id: job.id })}
                className="w-full bg-[#C73E33] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#AE332A] active:scale-[0.98] transition-all mb-3"
              >
                {t('apply_now')}
              </button>
              <button
                onClick={toggleSave}
                className={`w-full font-semibold text-[14px] py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  saved
                    ? 'bg-[#FFF5F5] text-[#C73E33] border-[#FED7D7]'
                    : 'bg-white text-[#374151] border-[#E8E5E0] hover:bg-[#F9F9F7]'
                }`}
              >
                <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
                {saved ? t('saved') : t('save')}
              </button>
              {/* quick stats */}
              <div className="mt-4 pt-4 border-t border-[#F3F4F6] grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-[18px] font-bold text-[#111827]">{job.applicants}</div>
                  <div className="text-[11px] text-[#9CA3AF]">applied</div>
                </div>
                <div className="text-center">
                  <div className="text-[18px] font-bold text-[#111827]">{job.deadlineDays}d</div>
                  <div className="text-[11px] text-[#9CA3AF]">to complete</div>
                </div>
              </div>
            </div>
          </Card>

          {/* ── About the client ── */}
          <Card>
            <CardHeading icon={ShieldCheck} label={t('tc_title')} />
            <div className="p-5 space-y-4">
              {/* Client type + about */}
              <div>
                <p className="text-[13px] font-semibold text-[#111827] mb-1">
                  {job.clientType} · {job.clientCountry}
                </p>
                <p className="text-[12px] text-[#6B7280] leading-relaxed">{job.aboutClient}</p>
              </div>
              {/* Facts */}
              <div className="space-y-0">
                <InfoRow label="Member since" value={digits(job.memberSince)} />
                <InfoRow label="Jobs posted" value={digits(job.jobsPostedByClient)} />
                {job.hireRate > 0 && (
                  <>
                    <InfoRow label="Hire rate" value={`${digits(job.hireRate)}%`} />
                    {job.clientRating > 0 && (
                      <InfoRow label="Rating" value={`${digits(job.clientRating.toFixed(1))} / 5`} />
                    )}
                  </>
                )}
                <InfoRow
                  label="Payment"
                  value={job.paymentVerified ? '✓ Verified' : 'Not verified'}
                />
              </div>
              {/* Warning */}
              {(!job.paymentVerified || job.caution) && (
                <div className="bg-[#FFF5F5] border border-[#FED7D7] rounded-xl p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle size={14} className="text-[#C73E33] shrink-0 mt-0.5" />
                    <span className="text-[12px] font-semibold text-[#9B2C2C]">{t('tc_warn_h')}</span>
                  </div>
                  <div className="space-y-1.5 text-[12px] text-[#374151]">
                    {!job.paymentVerified && <p>{t('tc_warn_pay')}</p>}
                    {job.caution && <p>{job.caution}</p>}
                  </div>
                </div>
              )}
              <Disclaimer t={t} k="disc_trust" />
            </div>
          </Card>

          {/* ── Job compatibility ── */}
          <Card>
            <CardHeading icon={ClipboardList} label={t('oc_title')} />
            <div className="p-5 space-y-0">
              <InfoRow label={t('oc_laptop')} value={job.needsOwnLaptop ? t('oc_yes') : t('oc_no')} />
              <InfoRow label={t('oc_net')} value={job.internetNeed} />
              <InfoRow label={t('oc_time')} value={fmt(t('wr_days'), { days: digits(job.deadlineDays) })} />
              <InfoRow label={t('oc_meet')} value={job.meetingTimeNepal} />
            </div>
          </Card>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          REPORT MODAL
      ══════════════════════════════════════════ */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-[420px] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2.5 mb-1">
                <Flag size={16} className="text-[#C73E33]" />
                <h3 className="font-bold text-[16px] text-[#111827]">{t('report_title')}</h3>
              </div>
              <p className="text-[13px] text-[#9CA3AF]">Tell us what is wrong. This is kept private.</p>
            </div>
            <div className="px-6 py-5 space-y-2.5">
              {[t('rep_1'), t('rep_2'), t('rep_3'), t('rep_4'), t('rep_5')].map((r, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 text-[13px] font-medium text-[#374151] cursor-pointer p-3.5 border border-[#E8E5E0] rounded-xl hover:bg-[#F9F9F7] hover:border-[#D1D5DB] transition-all"
                >
                  <input type="radio" name="report_reason" className="accent-[#C73E33] w-4 h-4 shrink-0" />
                  {r}
                </label>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setReportOpen(false)}
                className="flex-1 py-3 border border-[#E8E5E0] rounded-xl text-[14px] font-semibold text-[#374151] hover:bg-[#F9F9F7] transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => { setReportOpen(false); showToast(t('report_toast')); }}
                className="flex-1 py-3 bg-[#C73E33] text-white rounded-xl text-[14px] font-semibold hover:bg-[#AE332A] transition-colors"
              >
                {t('send_report')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
