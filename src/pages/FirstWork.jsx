// Find beginner-friendly jobs.

import { Briefcase, HeartHandshake, Moon, Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { JobCard } from '../components/jobs/JobCard.jsx';
import { ALL_CATEGORIES, ALL_SKILLS } from '../data/demo.js';
import { DUMMY_JOBS } from '../data/jobs.js';



export function FirstWorkFeed({ t, navTo, user, savedJobs, setSavedJobs, lang, allJobs = DUMMY_JOBS, lowdata = false, onSwitchClient = () => {} }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [budgetType, setBudgetType] = useState("All");
  const [togBeginner, setTogBeginner] = useState(false);
  const [togVerified, setTogVerified] = useState(false);
  const [togMatch, setTogMatch] = useState(false);
  const [sort, setSort] = useState("Best match for me");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    let res = [...allJobs];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(j => j.title.toLowerCase().includes(q) || j.clientName.toLowerCase().includes(q) || j.skillsRequired.some(s => s.toLowerCase().includes(q)));
    }
    if (cat !== "All") res = res.filter(j => j.category === cat);
    if (skillsFilter.length > 0) res = res.filter(j => skillsFilter.some(s => j.skillsRequired.includes(s)));
    if (budgetType !== "All") res = res.filter(j => budgetType === "fixed" ? j.budgetType === "fixed" : j.budgetType === "hourly");
    if (togBeginner) res = res.filter(j => j.beginnerFriendly);
    if (togVerified) res = res.filter(j => j.paymentVerified);
    if (togMatch) res = res.filter(j => j.skillsRequired.some(s => user.skills.includes(s)));

    res.sort((a, b) => {
      if (sort === "Newest") return a.postedHoursAgo - b.postedHoursAgo;
      if (sort === "Best match for me") {
        const rank = (j) => { const n = j.skillsRequired.filter(s => user.skills.includes(s)).length; return n > 0 && n === j.skillsRequired.length ? Infinity : n; };
        const ra = rank(a), rb = rank(b);
        if (ra !== rb) return rb > ra ? 1 : -1;
        return a.postedHoursAgo - b.postedHoursAgo;
      }
      if (sort === "Budget: High to Low") return b.budgetUSD - a.budgetUSD;
      if (sort === "Budget: Low to High") return a.budgetUSD - b.budgetUSD;
      if (sort === "Best skill match") {
        const matchA = a.skillsRequired.filter(s => user.skills.includes(s)).length;
        const matchB = b.skillsRequired.filter(s => user.skills.includes(s)).length;
        return matchB - matchA;
      }
      return 0;
    });
    return res;
  }, [search, cat, skillsFilter, budgetType, togBeginner, togVerified, togMatch, sort, user, allJobs]);

  const clearFilters = () => {
    setSearch(""); setCat("All"); setSkillsFilter([]); setBudgetType("All"); setTogBeginner(false); setTogVerified(false); setTogMatch(false); setSort("Best match for me");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className={`md:w-72 shrink-0 ${showMobileFilters ? 'fixed inset-0 z-50 bg-[#FBFAF8] p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:bg-transparent md:p-0 md:z-auto`}>
        <div className="sticky top-20">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h3 className="font-semibold text-2xl">{t('filters')}</h3>
            <button onClick={() => setShowMobileFilters(false)} className="flex items-center gap-2 font-semibold text-[#AE332A] min-h-[48px] px-4 border border-[#C73E33] rounded-full">
              <X size={20} /> Close
            </button>
          </div>
          
          <div className="space-y-8 text-base">
            <div>
              <label className="font-semibold block mb-3">{t('cat_all')}</label>
              <select value={cat} onChange={e => setCat(e.target.value)} className="w-full border border-[#EAE7E1] rounded-[12px] p-3 bg-white min-h-[48px] font-medium outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30">
                <option value="All">{t('cat_all')}</option>
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="font-semibold block mb-3">{t('budget_all')}</label>
              <div className="space-y-3">
                {["All", "fixed", "hourly"].map(b => (
                  <label key={b} className="flex items-center gap-3 cursor-pointer p-2 min-h-[44px] border border-transparent hover:bg-white rounded-[12px] -ml-2">
                    <input type="radio" checked={budgetType === b} onChange={() => setBudgetType(b)} className="accent-[#C73E33] w-5 h-5" />
                    <span className="font-medium">{b === "All" ? t('budget_all') : b === "fixed" ? t('budget_fixed') : t('budget_hourly')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-3">Skills</label>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
                {ALL_SKILLS.map(s => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer p-2 min-h-[44px] border border-transparent hover:bg-white rounded-[12px] -ml-2">
                    <input type="checkbox" checked={skillsFilter.includes(s)} onChange={(e) => {
                      if(e.target.checked) setSkillsFilter([...skillsFilter, s]);
                      else setSkillsFilter(skillsFilter.filter(x => x !== s));
                    }} className="accent-[#C73E33] w-5 h-5" />
                    <span className="font-medium">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#EAE7E1]">
              <button className="w-full flex items-center justify-between cursor-pointer group min-h-[44px]" onClick={() => setTogBeginner(!togBeginner)}>
                <span className="font-medium group-hover:text-[#AE332A] transition-colors">{t('tog_beginner')}</span>
                <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${togBeginner ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${togBeginner ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between cursor-pointer group min-h-[44px]" onClick={() => setTogVerified(!togVerified)}>
                <span className="font-medium group-hover:text-[#AE332A] transition-colors">{t('tog_verified')}</span>
                <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${togVerified ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${togVerified ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between cursor-pointer group min-h-[44px]" onClick={() => setTogMatch(!togMatch)}>
                <span className="font-medium group-hover:text-[#AE332A] transition-colors">{t('tog_match')}</span>
                <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${togMatch ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${togMatch ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>
            
            {showMobileFilters && (
              <button onClick={() => setShowMobileFilters(false)} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg mt-8 min-h-[52px] md:hidden">
                Apply Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-[#EAE7E1] pb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-[28px] sm:text-[30px] font-semibold">{t('fw_title')}</h1>
            </div>
            <p className="text-lg text-[#4A4744]">{t('fw_sub')}</p>
            <div className="text-[13px] font-semibold bg-[#F0EEE9] px-3 py-1 rounded-full mt-3 inline-block">
              {filtered.length} beginner jobs open now
            </div>
          </div>
          <div className="flex gap-2">
            <button className="min-h-[48px] px-4 font-semibold text-[#1C1B1A] border-b-2 border-[#C73E33]">Jobs</button>
            <button onClick={() => navTo('opportunities')} className="min-h-[48px] px-4 font-semibold text-[#8A8580] border-b-2 border-transparent hover:text-[#1C1B1A]">{t('my_opps')}</button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-stretch gap-3">
          <button onClick={onSwitchClient} className="min-h-[48px] px-5 py-3 rounded-[20px] bg-white border border-[#EAE7E1] text-left hover:bg-[#F6F4EF] flex items-start gap-3 w-full sm:max-w-md">
            <Briefcase size={22} className="shrink-0 mt-0.5 text-[#C73E33]" />
            <span>
              <span className="block font-semibold text-base text-[#1C1B1A]">{t('cm_welcome_q')}</span>
              <span className="block text-sm text-[#6E6963] mt-0.5">{t('cm_switch_btn')}</span>
            </span>
          </button>
          <button onClick={() => navTo('bring')} className="min-h-[48px] px-5 py-3 rounded-[20px] bg-white border border-[#EAE7E1] text-left hover:bg-[#F6F4EF] flex items-start gap-3 w-full sm:max-w-md">
            <HeartHandshake size={22} className="shrink-0 mt-0.5 text-[#C73E33]" />
            <span>
              <span className="block font-semibold text-base text-[#1C1B1A]">{t('br_entry')}</span>
              <span className="block text-sm text-[#6E6963] mt-0.5">{t('br_entry_sub')}</span>
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-3.5 text-[#8A8580]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} aria-label={t('search_placeholder')} placeholder={t('search_placeholder')} className="w-full border border-[#EAE7E1] rounded-[14px] pl-12 pr-4 py-3 outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-base min-h-[48px]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowMobileFilters(true)} className="md:hidden flex-1 flex items-center justify-center gap-2 border border-[#EAE7E1] rounded-full px-4 py-3 bg-white font-semibold min-h-[48px]">
              <SlidersHorizontal size={20} /> {t('filters')}
            </button>
            <div className="flex items-center border border-[#EAE7E1] rounded-full bg-white px-3">
              <span className="text-[#8A8580] pl-2 text-sm font-medium hidden sm:inline">Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent pl-2 pr-4 py-3 outline-none font-semibold min-h-[48px] cursor-pointer text-base">
                <option value="Best match for me">{t('sort_best')}</option>
                <option value="Newest">{t('sort_new')}</option>
                <option value="Budget: High to Low">{t('sort_high')}</option>
                <option value="Budget: Low to High">{t('sort_low')}</option>
                <option value="Best skill match">{t('sort_match')}</option>
              </select>
            </div>
          </div>
        </div>

        {lowdata && (
          <div className="mb-6 bg-[#F0EEE9] border border-[#EAE7E1] rounded-[14px] px-4 py-3 text-base font-medium text-[#1C1B1A] flex items-center gap-2">
            <Moon size={18} className="shrink-0" /> {t('ld_on_line')}
          </div>
        )}

        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#EAE7E1] rounded-[14px] p-6 text-center flex flex-col items-center">
              <Search size={48} className="text-[#D8D4CC] mb-4" />
              <p className="text-lg font-semibold mb-6">{t('no_jobs')}</p>
              <button onClick={clearFilters} className="border border-[#E3E0D9] px-6 py-3 rounded-full font-semibold hover:bg-[#F6F4EF] min-h-[52px]">
                {t('clear_filters')}
              </button>
            </div>
          ) : (
            filtered.map(job => (
              <JobCard key={job.id} job={job} t={t} navTo={navTo} saved={savedJobs.includes(job.id)} onToggleSave={() => {
                setSavedJobs(prev => prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id]);
              }} lang={lang} compact={lowdata} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
