// Client confirms a demo agreement.

import { ChevronLeft, Info } from 'lucide-react';
import { CL_CARD } from '../components/client/ClientControls.jsx';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { buildWorkroomMilestones } from '../services/workroom.js';
import { fmt, fmtMoney, toDigits } from '../utils/format.js';



export function ClientAgreement({ t, lang, navTo, job, applicant, onConfirm }) {
  const digits = (n) => toDigits(n, lang);
  if (!job || !applicant) return null;
  const milestones = buildWorkroomMilestones({ id: job.id, title: job.title, deliverables: job.deliverables, budgetUSD: applicant.asks });
  const labelCls = "text-sm text-[#6E6963]";
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <button onClick={() => navTo('client-applicants', { id: job.id })} className="flex items-center gap-2 text-base text-[#4A4744] mb-6 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
          <ChevronLeft size={20} /> {t('back')}
        </button>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-1">{t('ag_title')}</h1>
        <p className="text-base text-[#4A4744] break-words">{fmt(t('ag_parties'), { client: job.clientName, name: applicant.name })}</p>
      </div>

      <div className={`${CL_CARD} space-y-4`}>
        <div className="text-lg font-semibold text-[#1C1B1A] break-words">{job.title}</div>
        <div>
          <div className={labelCls}>{t('wr_deliver')}</div>
          <ul className="list-disc pl-5 text-base text-[#1C1B1A] space-y-1">
            {job.deliverables.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
        <div><div className={labelCls}>{t('ag_price')}</div><div className="text-base font-semibold text-[#1C1B1A]">${fmtMoney(applicant.asks)} (NPR {fmtMoney(applicant.asks * 133)})</div></div>
        <div><div className={labelCls}>{t('wr_deadline')}</div><div className="text-base text-[#1C1B1A]">{fmt(t('wr_days'), { days: digits(job.deadlineDays) })}</div></div>
        <div><div className={labelCls}>{t('ag_revisions')}</div><div className="text-base text-[#1C1B1A]">{digits(job.revisionsIncluded ?? 1)}</div></div>
      </div>

      <div className={CL_CARD}>
        <h2 className="text-xl font-semibold mb-4">{t('wr_milestones')}</h2>
        <div className="space-y-3">
          {milestones.map(m => (
            <div key={m.id} className="border border-[#EAE7E1] rounded-[14px] p-4">
              <div className="text-base font-semibold text-[#1C1B1A] break-words">{m.title}</div>
              <div className="text-sm text-[#6E6963]">${fmtMoney(m.amountUSD)} · NPR {fmtMoney(m.amountUSD * 133)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
        <Info size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
        <p className="text-base text-[#1C1B1A]">{t('wr_sim_note')}</p>
      </div>
      <Disclaimer t={t} k="disc_agree" />
      <button onClick={() => onConfirm(job.id, applicant)} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
        {t('ag_confirm')}
      </button>
    </div>
  );
}
