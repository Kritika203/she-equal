// Review demo opportunities.

import { ChevronLeft } from 'lucide-react';
import { CL_CARD } from '../components/client/ClientControls.jsx';
import { fmt, fmtMoney, toDigits } from '../utils/format.js';



export function BringQueue({ t, lang, navTo, submissions, onDecide }) {
  const digits = (n) => toDigits(n, lang);
  const pending = submissions.filter(x => x.status === 'pending').slice().reverse();
  const payLabel = (m) => m === 'Bank transfer' ? t('np_bank') : m === 'Other' ? t('br_pay_other') : m;
  const dt = "text-sm text-[#6E6963]";
  const dd = "text-base text-[#1C1B1A] break-words";
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button onClick={() => navTo('bring')} className="flex items-center gap-2 text-base text-[#4A4744] mb-4 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
          <ChevronLeft size={20} /> {t('back')}
        </button>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-2">{t('br_q_title')}</h1>
        <p className="text-base text-[#4A4744]">{t('br_q_line')}</p>
      </div>

      {pending.length === 0 ? (
        <p className="text-base text-[#4A4744]">{t('br_q_empty')}</p>
      ) : (
        <div className="space-y-4">
          {pending.map(x => (
            <div key={x.id} className={`${CL_CARD} space-y-4`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#F0EEE9] text-[#1C1B1A] px-3 py-1 rounded-full text-[13px] font-semibold">{x.type === 'opportunity' ? t('br_q_opp') : t('br_q_ins')}</span>
                <span className="text-sm font-semibold text-[#6E6963]">{t('br_q_waiting')}</span>
              </div>
              <div>
                <div className="font-semibold text-xl break-words">{x.name}</div>
                <div className="text-base text-[#4A4744] break-words">{x.organisation} · {x.country} · {x.email}</div>
              </div>
              {x.type === 'opportunity' ? (
                <dl className="space-y-3">
                  <div><dt className={dt}>{t('cl_f_title')}</dt><dd className={`${dd} font-semibold`}>{x.title}</dd></div>
                  <div><dt className={dt}>{t('cl_f_category')}</dt><dd className={dd}>{x.category}</dd></div>
                  <div><dt className={dt}>{t('cl_f_skills')}</dt><dd className={dd}>{(x.skillsRequired || []).join(', ')}</dd></div>
                  <div><dt className={dt}>{t('br_f_budget')}</dt><dd className={dd}>${fmtMoney(x.budgetMin)} – ${fmtMoney(x.budgetMax)}</dd></div>
                  <div><dt className={dt}>{t('cl_f_deadline')}</dt><dd className={dd}>{fmt(t('wr_days'), { days: digits(x.deadlineDays) })}</dd></div>
                  <div><dt className={dt}>{t('br_f_pay')}</dt><dd className={dd}>{payLabel(x.paymentMethod)}</dd></div>
                  <div><dt className={dt}>{t('cl_f_desc')}</dt><dd className={dd}>{x.description}</dd></div>
                  <div>
                    <dt className={dt}>{t('br_tasks')}</dt>
                    <dd><ul className="list-disc pl-5 text-base text-[#1C1B1A] space-y-1">{(x.deliverables || []).map((d, i) => <li key={i} className="break-words">{d}</li>)}</ul></dd>
                  </div>
                  <div><dt className={dt}>{t('cl_req_head')}</dt><dd className={dd}>{[x.needsOwnLaptop ? t('cl_f_laptop') : null, t('cl_f_internet') + ': ' + x.internetNeed, x.beginnerFriendly ? t('cl_f_beginners') : null].filter(Boolean).join(' · ')}</dd></div>
                </dl>
              ) : (
                <p className="text-base text-[#1C1B1A] break-words">{x.text}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button type="button" onClick={() => onDecide(x.id, 'approve')} className="bg-[#C73E33] text-white px-6 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px] py-2">
                  {t('br_approve')}
                </button>
                <button type="button" onClick={() => onDecide(x.id, 'reject')} className="bg-white border border-[#E3E0D9] text-[#1C1B1A] px-6 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[48px] py-2">
                  {t('br_reject')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
