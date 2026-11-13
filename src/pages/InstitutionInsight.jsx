// Sample skill demand for institutions.

import { ChevronLeft, Lock } from 'lucide-react';
import { useMemo } from 'react';
import { CL_CARD } from '../components/client/ClientControls.jsx';
import { DEMO_COHORT } from '../data/demo.js';
import { fmt, toDigits } from '../utils/format.js';



export function InstitutionInsight({ allJobs, t, lang, navTo }) {
  const digits = (n) => toDigits(n, lang);
  const { total, demand } = useMemo(() => {
    const d = {};
    allJobs.forEach(j => { [...new Set(j.skillsRequired || [])].forEach(sk => { d[sk] = (d[sk] || 0) + 1; }); });
    return { total: allJobs.length, demand: d };
  }, [allJobs]);
  const cohort = DEMO_COHORT.learners;
  const names = [...new Set([...Object.keys(DEMO_COHORT.verified), ...Object.keys(demand)])];
  const rows = names.map(skill => ({ skill, have: DEMO_COHORT.verified[skill] || 0, demand: demand[skill] || 0 }))
    .sort((a, b) => b.demand - a.demand || a.skill.localeCompare(b.skill));
  const gap = rows.filter(r => r.demand >= 2)
    .sort((a, b) => (a.have / cohort) - (b.have / cohort) || b.demand - a.demand || a.skill.localeCompare(b.skill))[0];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button onClick={() => navTo('bring')} className="flex items-center gap-2 text-base text-[#4A4744] mb-4 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
          <ChevronLeft size={20} /> {t('back')}
        </button>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-1">{t('ii_title')}</h1>
        <h2 className="text-xl font-semibold text-[#1C1B1A] break-words">{DEMO_COHORT.institute}</h2>
        <p className="text-base text-[#4A4744] mt-1">{fmt(t('ii_cohort'), { n: digits(cohort) })}</p>
      </div>

      <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
        <Lock size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
        <p className="text-base text-[#1C1B1A]">{t('ii_privacy')}</p>
      </div>

      <div className={CL_CARD}>
        <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 pb-3 border-b border-[#EAE7E1] text-sm font-semibold text-[#6E6963]">
          <div>{t('ii_col_skill')}</div>
          <div>{t('ii_col_have')}</div>
          <div>{t('ii_col_demand')}</div>
        </div>
        {rows.map(r => (
          <div key={r.skill} className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 py-3 border-b border-[#EAE7E1] last:border-b-0 items-center">
            <div className="text-base font-semibold text-[#1C1B1A] break-words">{r.skill}</div>
            <div className="text-base text-[#1C1B1A]">{fmt(t('ii_have_of'), { have: digits(r.have), cohort: digits(cohort) })}</div>
            <div className="text-base text-[#1C1B1A]">{digits(r.demand)}</div>
          </div>
        ))}
      </div>

      {gap && (
        <div className={CL_CARD}>
          <h2 className="text-xl font-semibold mb-2">{t('ii_gap_title')}</h2>
          <div className="text-lg font-semibold text-[#C73E33] mb-2">{gap.skill}</div>
          <p className="text-base text-[#4A4744]">
            {fmt(t(gap.have > 0 ? 'ii_gap_have' : 'ii_gap_none'), { skill: gap.skill, demand: digits(gap.demand), total: digits(total), have: digits(gap.have), cohort: digits(cohort) })}
          </p>
        </div>
      )}

      <p className="text-sm text-[#6E6963]">{t('ii_sample')}</p>
    </div>
  );
}
