// Applicants shown in the client demo.

import { CheckCircle2, ChevronLeft, MapPin } from 'lucide-react';
import { CL_CARD } from '../components/client/ClientControls.jsx';
import { DEMO_APPLICANTS } from '../data/demo.js';
import { fmt, fmtMoney, toDigits } from '../utils/format.js';



export function ClientApplicants({ t, lang, navTo, job }) {
  const digits = (n) => toDigits(n, lang);
  const back = (
    <button onClick={() => navTo('client', { scrollTo: 'mine' })} className="flex items-center gap-2 text-base text-[#4A4744] mb-6 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
      <ChevronLeft size={20} /> {t('back')}
    </button>
  );
  if (!job) return <div className="max-w-2xl mx-auto">{back}<p className="text-base text-[#4A4744]">{t('cl_none')}</p></div>;
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        {back}
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-1">{t('cl_applicants')}</h1>
        <div className="text-lg font-semibold text-[#1C1B1A] break-words">{job.title}</div>
        <p className="text-base text-[#4A4744] mt-1">{t('cl_demo_applicants')}</p>
      </div>
      {job.accepted && (
        <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
          <CheckCircle2 size={22} className="shrink-0 mt-0.5 text-[#C73E33]" />
          <p className="text-base font-semibold text-[#1C1B1A]">{fmt(t('ag_made'), { name: job.accepted.applicantName })}</p>
        </div>
      )}
      {DEMO_APPLICANTS.map(a => (
        <div key={a.id} className={CL_CARD}>
          <div className="font-semibold text-xl break-words">{a.name}</div>
          <div className="text-base text-[#4A4744] flex items-center gap-1.5 mb-4"><MapPin size={18} className="text-[#8A8580]" /> {a.place}</div>
          <ul className="space-y-1 mb-3 text-base text-[#1C1B1A]">
            {a.skills.map(sk => (
              <li key={sk.name}><strong>{sk.name}</strong> — {t('pp_lvl_' + sk.level)}</li>
            ))}
          </ul>
          <div className="text-sm text-[#6E6963] mb-4">{fmt(t('pr_count'), { n: digits(a.proofs) })}</div>
          <dl className="space-y-3 mb-5">
            <div><dt className="text-sm text-[#6E6963]">{t('cl_asks')}</dt><dd className="text-base font-semibold text-[#1C1B1A]">${fmtMoney(a.asks)} (NPR {fmtMoney(a.asks * 133)})</dd></div>
            <div><dt className="text-sm text-[#6E6963]">{t('cl_availability')}</dt><dd className="text-base text-[#1C1B1A]">{a.availability}</dd></div>
            <div><dt className="text-sm text-[#6E6963]">{t('cl_completed')}</dt><dd className="text-base text-[#1C1B1A]">{digits(a.completed)}</dd></div>
          </dl>
          {!job.accepted && (
            <button onClick={() => navTo('client-agreement', { id: job.id, applicantId: a.id })} className="w-full bg-[#C73E33] text-white py-3 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">
              {t('cl_accept')}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
