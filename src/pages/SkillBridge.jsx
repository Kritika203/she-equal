// Skill gaps and learning suggestions.

import { ChevronLeft, ExternalLink, TrendingUp } from 'lucide-react';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { DUMMY_JOBS } from '../data/jobs.js';
import { GAP_FALLBACK, GAP_GUIDE, computeSkillBridge } from '../services/skillBridge.js';
import { fmt } from '../utils/format.js';



export function SkillBridgePage({ allJobs = DUMMY_JOBS, t, lang, user, navTo, insights = [] }) {
  const digits = (n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const { total, matched, gaps, bundles } = computeSkillBridge(allJobs, user.skills);
  const top = gaps[0];
  return (
    <div className="max-w-[800px] mx-auto space-y-8">
      <div>
        <button onClick={() => navTo('passport')} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] mb-2"><ChevronLeft size={20} /> {t('pp_back_my')}</button>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-4">{t('sb_title')}</h1>
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6">
          <h2 className="font-semibold text-[22px] mb-3">{fmt(t('sb_headline'), { matched: digits(matched), total: digits(total) })}</h2>
          {top && top.unlock > 0 && (
            <p className="flex items-start gap-2 text-base font-medium text-[#1C1B1A] mb-3"><TrendingUp size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{fmt(t('sb_top'), { skill: top.skill, n: digits(top.unlock) })}</span></p>
          )}
          <p className="text-sm text-[#6E6963] mb-3">{fmt(t('sb_sample'), { total: digits(total) })}</p>
          <Disclaimer t={t} k="disc_bridge" />
        </div>
      </div>

      {gaps.length > 0 && (
        <div>
          <h2 className="font-semibold text-[22px] mb-4">{t('sb_gaps_title')}</h2>
          <div className="space-y-4">
            {gaps.map(g => {
              const guide = GAP_GUIDE[g.skill] || GAP_FALLBACK;
              return (
                <div key={g.skill} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                  <div className="font-semibold text-xl mb-2 break-words">{g.skill}</div>
                  <p className="text-base text-[#4A4744]">{fmt(t('sb_asked'), { demand: digits(g.demand), total: digits(total) })}</p>
                  {g.unlock > 0 && <p className="text-base font-medium text-[#1C1B1A] mt-1">{fmt(t('sb_unlock'), { n: digits(g.unlock) })}</p>}
                  {g.unlock === 0 && g.partner && <p className="text-base font-medium text-[#1C1B1A] mt-1">{fmt(t('sb_together'), { other: g.partner.other, joint: digits(g.partner.joint) })}</p>}
                  <div className="mt-4 pt-4 border-t border-[#EAE7E1] space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-[#6E6963] mb-1">{t('sb_free')}</div>
                      <a href={guide.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-base font-semibold text-[#1C1B1A] underline underline-offset-4 min-h-[44px]"><span className="break-words">{guide.name}</span><ExternalLink size={16} className="shrink-0" /></a>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#6E6963] mb-1">{t('sb_practice')}</div>
                      <p className="text-base text-[#4A4744]">{guide.task}</p>
                    </div>
                    <div>
                      <p className="text-base text-[#4A4744] mb-3">{t('sb_proof')}</p>
                      <button onClick={() => navTo('passport')} className="border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-5 font-semibold text-base hover:bg-[#F6F4EF] min-h-[48px]">{t('sb_open_wp')}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {bundles.length > 0 && (
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6">
          <h2 className="font-semibold text-[22px] mb-4">{t('sb_bundles_title')}</h2>
          <ul className="divide-y divide-[#EAE7E1]">
            {bundles.map(b => <li key={b.a + b.b} className="py-3 text-base text-[#1C1B1A] break-words">{fmt(t('sb_bundle_line'), { a: b.a, b: b.b, n: digits(b.n) })}</li>)}
          </ul>
        </div>
      )}

      {insights.length > 0 && (
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6">
          <h2 className="font-semibold text-[22px] mb-4">{t('br_signals')}</h2>
          <ul className="divide-y divide-[#EAE7E1]">
            {insights.map(x => (
              <li key={x.id} className="py-3">
                <p className="text-base text-[#1C1B1A] break-words">{x.text}</p>
                <p className="text-sm text-[#6E6963] mt-1 break-words">{x.organisation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
