// Saved and applied job lists.

import { Bookmark, CheckCircle2, CheckSquare, ClipboardList, MessageSquare, User, X } from 'lucide-react';
import { useState } from 'react';
import { MASK } from '../constants/privacy.js';
import { DUMMY_JOBS } from '../data/jobs.js';
import { fmtDate, fmtMoney } from '../utils/format.js';



export function MyOpportunities({ allJobs = DUMMY_JOBS, t, navTo, savedJobs, setSavedJobs, appliedJobs, initialTab, confirmedJobs = [], hideMoney = false, draftJobId = null }) {
  const [tab, setTab] = useState(initialTab === 'applied' ? 'applied' : 'saved');

  return (
    <div className="max-w-[900px] mx-auto">
      <h1 className="text-[28px] sm:text-[30px] font-semibold mb-8">{t('my_opps')}</h1>
      
      <div className="flex gap-4 border-b-2 border-[#EAE7E1] mb-8">
        <button onClick={() => setTab('saved')} className={`pb-3 font-semibold text-lg border-b-2 transition-colors min-h-[48px] px-2 ${tab === 'saved' ? 'border-[#C73E33] text-[#1C1B1A]' : 'border-transparent text-[#8A8580] hover:text-[#1C1B1A]'}`}>{t('tab_saved')} ({savedJobs.length})</button>
        <button onClick={() => setTab('applied')} className={`pb-3 font-semibold text-lg border-b-2 transition-colors min-h-[48px] px-2 ${tab === 'applied' ? 'border-[#C73E33] text-[#1C1B1A]' : 'border-transparent text-[#8A8580] hover:text-[#1C1B1A]'}`}>{t('tab_applied')} ({appliedJobs.length})</button>
      </div>

      {tab === 'saved' && (
        <div className="space-y-4">
          {savedJobs.length === 0 ? (
            <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-center text-lg font-medium text-[#8A8580] flex flex-col items-center gap-4">
               <Bookmark size={48} className="text-[#D8D4CC]" />
               {t('no_saved')}
            </div>
          ) : (
            savedJobs.map(id => {
              const job = allJobs.find(j => j.id === id);
              if (!job) return null;
              return (
                <div key={id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-[#DDD8CE] transition-colors">
                  <div className="flex-1 cursor-pointer w-full" onClick={() => navTo('job-detail', {id})}>
                    <div className="font-semibold text-xl mb-2 line-clamp-1 group-hover:underline">{job.title}</div>
                    <div className="text-base text-[#4A4744] font-medium flex items-center gap-3"><User size={20}/> {job.clientName} <span className="text-[#D8D4CC]">|</span> <span className="font-semibold text-[#1C1B1A]">${job.budgetUSD}</span></div>
                    {draftJobId === id && <div className="text-sm font-semibold text-[#AE332A] mt-2">{t('pv_unfinished')}</div>}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => setSavedJobs(savedJobs.filter(s => s !== id))} className="flex-1 sm:flex-none px-4 py-3 border border-[#EAE7E1] rounded-full text-base font-semibold text-[#1C1B1A] hover:border-[#DDD8CE] min-h-[48px] flex justify-center items-center gap-2"><X size={18}/> {t('remove')}</button>
                    <button onClick={() => navTo('apply', {id})} className="flex-1 sm:flex-none px-6 py-3 bg-[#C73E33] text-white rounded-full text-base font-semibold hover:bg-[#AE332A] min-h-[52px]">{t('apply_now')}</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'applied' && (
        <div className="space-y-4">
          {appliedJobs.length === 0 ? (
            <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-center text-lg font-medium text-[#8A8580] flex flex-col items-center gap-4">
              <CheckSquare size={48} className="text-[#D8D4CC]" />
              {t('no_applied')}
            </div>
          ) : (
            appliedJobs.map((app, idx) => {
              const job = allJobs.find(j => j.id === app.jobId);
              return (
                <div key={idx} className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 hover:border-[#DDD8CE] transition-colors cursor-pointer" onClick={() => navTo('job-detail', {id: app.jobId})}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <div className="font-semibold text-xl sm:text-2xl mb-2 line-clamp-1">{job?.title || "Job Unavailable"}</div>
                      <div className="text-base text-[#4A4744] font-medium flex items-center gap-2"><User size={20}/> {job?.clientName}</div>
                    </div>
                    <div className="sm:text-right bg-[#F6F4EF] p-4 rounded-[14px] border border-[#EAE7E1] w-full sm:w-auto">
                      <div className="font-semibold text-2xl mb-1">{hideMoney ? MASK : `$${app.price}`}</div>
                      <div className="text-sm font-semibold text-[#8A8580]">{hideMoney ? `NPR ${MASK}` : `NPR ${fmtMoney(app.npr)}`}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-[#EAE7E1]">
                    <span className="bg-[#F0EEE9] border border-[#EAE7E1] px-4 py-2 rounded-[12px] text-[#1C1B1A] font-semibold text-sm flex items-center gap-2"><CheckCircle2 size={16}/> {confirmedJobs.includes(app.jobId) ? t('pp_completed_status') : t('applied_status')}</span>
                    <span className="text-base font-semibold text-[#8A8580]">{fmtDate(app.date)}</span>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button onClick={(e) => { e.stopPropagation(); navTo('chat', { id: app.jobId }); }} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] flex items-center justify-center gap-2"><MessageSquare size={18} /> {t('chat_msg_client')}</button>
                    <button onClick={(e) => { e.stopPropagation(); navTo('workroom', { id: app.jobId }); }} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] flex items-center justify-center gap-2"><ClipboardList size={18} /> {t('wr_open')}</button>
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
