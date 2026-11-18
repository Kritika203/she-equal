// Saved and applied job lists.

import { Bookmark, CheckCircle2, CheckSquare, ClipboardList, MessageSquare, User, X } from 'lucide-react';
import { useState } from 'react';
import { MASK } from '../constants/privacy.js';
import { DUMMY_JOBS } from '../data/jobs.js';
import { fmtDate, fmtMoney } from '../utils/format.js';



export function MyOpportunities({ allJobs = DUMMY_JOBS, t, navTo, savedJobs, setSavedJobs, appliedJobs, initialTab, confirmedJobs = [], hideMoney = false, draftJobId = null }) {
  const [tab, setTab] = useState(initialTab === 'applied' ? 'applied' : 'saved');

  return (
    <div className="mx-auto w-full max-w-[780px]">
      <h1 className="mb-2 text-[22px] font-semibold text-[#111827] leading-tight">{t('my_opps')}</h1>
      
      <div className="mb-4 flex gap-1 border-b border-[#E8E5E0]">
        <button aria-pressed={tab === 'saved'} onClick={() => setTab('saved')} className={`border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors ${tab === 'saved' ? 'border-[#C73E33] text-[#111827]' : 'border-transparent text-[#6B7280] hover:text-[#111827]'}`}>{t('tab_saved')} ({savedJobs.length})</button>
        <button aria-pressed={tab === 'applied'} onClick={() => setTab('applied')} className={`border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors ${tab === 'applied' ? 'border-[#C73E33] text-[#111827]' : 'border-transparent text-[#6B7280] hover:text-[#111827]'}`}>{t('tab_applied')} ({appliedJobs.length})</button>
      </div>

      {tab === 'saved' && (
        <div className="space-y-2.5">
          {savedJobs.length === 0 ? (
            <div className="bg-white border border-[#E8E5E0] rounded-xl p-6 text-center text-[13px] font-medium text-[#6B7280] flex flex-col items-center gap-2.5">
               <Bookmark size={28} className="text-[#D1D5DB]" />
               {t('no_saved')}
            </div>
          ) : (
            savedJobs.map(id => {
              const job = allJobs.find(j => j.id === id);
              if (!job) return null;
              return (
                <div key={id} className="bg-white border border-[#E8E5E0] rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 hover:shadow-md transition-all">
                  <div className="flex-1 cursor-pointer min-w-0" onClick={() => navTo('job-detail', {id})}>
                    <div className="font-semibold text-[14px] text-[#111827] mb-0.5 line-clamp-1">{job.title}</div>
                    <div className="text-[13px] text-[#6B7280] font-medium flex items-center gap-2">
                      <User size={14} className="text-[#9CA3AF]" />
                      <span className="truncate">{job.clientName}</span>
                      <span className="text-[#D1D5DB]">·</span>
                      <span className="font-semibold text-[#111827]">${job.budgetUSD}</span>
                    </div>
                    {draftJobId === id && <div className="text-[12px] font-semibold text-[#C73E33] mt-1.5">{t('pv_unfinished')}</div>}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button onClick={() => setSavedJobs(savedJobs.filter(s => s !== id))} className="flex-1 sm:flex-none h-9 px-3.5 border border-[#E8E5E0] rounded-full text-[13px] font-semibold text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] flex justify-center items-center gap-1.5 transition-colors"><X size={14} /> {t('remove')}</button>
                    <button onClick={() => navTo('apply', {id})} className="flex-1 sm:flex-none h-9 px-4 bg-[#C73E33] text-white rounded-full text-[13px] font-semibold hover:bg-[#AE332A] transition-colors">{t('apply_now')}</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'applied' && (
        <div className="space-y-2.5">
          {appliedJobs.length === 0 ? (
            <div className="bg-white border border-[#E8E5E0] rounded-xl p-6 text-center text-[13px] font-medium text-[#6B7280] flex flex-col items-center gap-2.5">
              <CheckSquare size={28} className="text-[#D1D5DB]" />
              {t('no_applied')}
            </div>
          ) : (
            appliedJobs.map((app, idx) => {
              const job = allJobs.find(j => j.id === app.jobId);
              return (
                <div key={idx} className="bg-white border border-[#E8E5E0] rounded-xl p-3.5 hover:shadow-md transition-all cursor-pointer" onClick={() => navTo('job-detail', {id: app.jobId})}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[14px] text-[#111827] mb-0.5 line-clamp-2">{job?.title || "Job Unavailable"}</div>
                      <div className="text-[13px] text-[#6B7280] font-medium flex items-center gap-1.5"><User size={13} className="text-[#9CA3AF]" /> {job?.clientName}</div>
                    </div>
                    <div className="sm:text-right bg-[#F9FAFB] px-2.5 py-1.5 rounded-lg border border-[#E8E5E0] w-fit shrink-0">
                      <div className="font-semibold text-[14px] text-[#111827]">{hideMoney ? MASK : `$${app.price}`}</div>
                      <div className="text-[11px] font-medium text-[#6B7280]">{hideMoney ? `NPR ${MASK}` : `NPR ${fmtMoney(app.npr)}`}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2.5 border-t border-[#F3F4F6]">
                    <span className="bg-[#F9FAFB] border border-[#E8E5E0] px-2.5 py-1 rounded-full text-[#111827] font-semibold text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-[#166534]" />
                      {confirmedJobs.includes(app.jobId) ? t('pp_completed_status') : t('applied_status')}
                    </span>
                    <span className="text-[11px] font-medium text-[#9CA3AF]">{fmtDate(app.date)}</span>
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <button onClick={(e) => { e.stopPropagation(); navTo('chat', { id: app.jobId }); }} className="w-full sm:w-auto h-8 border border-[#E8E5E0] bg-white text-[#374151] rounded-full px-3 font-semibold text-[12px] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] flex items-center justify-center gap-1.5 transition-colors"><MessageSquare size={13} /> {t('chat_msg_client')}</button>
                    <button onClick={(e) => { e.stopPropagation(); navTo('workroom', { id: app.jobId }); }} className="w-full sm:w-auto h-8 border border-[#E8E5E0] bg-white text-[#374151] rounded-full px-3 font-semibold text-[12px] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] flex items-center justify-center gap-1.5 transition-colors"><ClipboardList size={13} /> {t('wr_open')}</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
