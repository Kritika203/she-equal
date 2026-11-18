// Find beginner-friendly jobs.

import { Briefcase, HeartHandshake, Moon, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CompactSelect } from '../components/client/ClientControls.jsx';
import { JobCard } from '../components/jobs/JobCard.jsx';
import { ALL_CATEGORIES, ALL_SKILLS } from '../data/demo.js';
import { DUMMY_JOBS } from '../data/jobs.js';

/* ─── small reusable toggle ─── */
function Toggle({ on, onToggle, label }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-between gap-3 py-1.5 group cursor-pointer"
      onClick={onToggle}
    >
      <span className="text-[13px] font-medium text-[#374151] group-hover:text-[#C73E33] transition-colors leading-tight">
        {label}
      </span>
      <div
        className={`shrink-0 relative w-9 h-5 rounded-full transition-colors duration-200 ${on ? 'bg-[#C73E33]' : 'bg-[#D1D5DB]'}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </div>
    </button>
  );
}

/* ─── filter section heading ─── */
function FilterHeading({ label, id }) {
  return (
    <p id={id} className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2.5">
      {label}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export function FirstWorkFeed({
  t,
  navTo,
  user,
  savedJobs,
  setSavedJobs,
  lang,
  allJobs = DUMMY_JOBS,
  lowdata = false,
  onSwitchClient = () => { },
}) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [budgetType, setBudgetType] = useState('All');
  const [togBeginner, setTogBeginner] = useState(false);
  const [togVerified, setTogVerified] = useState(false);
  const [togMatch, setTogMatch] = useState(false);
  const [sort, setSort] = useState('Best match for me');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* ── filtering + sorting ── */
  const filtered = useMemo(() => {
    let res = [...allJobs];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.clientName.toLowerCase().includes(q) ||
          j.skillsRequired.some(s => s.toLowerCase().includes(q))
      );
    }
    if (cat !== 'All') res = res.filter(j => j.category === cat);
    if (skillsFilter.length > 0) res = res.filter(j => skillsFilter.some(s => j.skillsRequired.includes(s)));
    if (budgetType !== 'All') res = res.filter(j => (budgetType === 'fixed' ? j.budgetType === 'fixed' : j.budgetType === 'hourly'));
    if (togBeginner) res = res.filter(j => j.beginnerFriendly);
    if (togVerified) res = res.filter(j => j.paymentVerified);
    if (togMatch) res = res.filter(j => j.skillsRequired.some(s => user.skills.includes(s)));

    res.sort((a, b) => {
      if (sort === 'Newest') return a.postedHoursAgo - b.postedHoursAgo;
      if (sort === 'Best match for me') {
        const rank = j => {
          const n = j.skillsRequired.filter(s => user.skills.includes(s)).length;
          return n > 0 && n === j.skillsRequired.length ? Infinity : n;
        };
        const ra = rank(a), rb = rank(b);
        if (ra !== rb) return rb > ra ? 1 : -1;
        return a.postedHoursAgo - b.postedHoursAgo;
      }
      if (sort === 'Budget: High to Low') return b.budgetUSD - a.budgetUSD;
      if (sort === 'Budget: Low to High') return a.budgetUSD - b.budgetUSD;
      if (sort === 'Best skill match') {
        return b.skillsRequired.filter(s => user.skills.includes(s)).length -
          a.skillsRequired.filter(s => user.skills.includes(s)).length;
      }
      return 0;
    });
    return res;
  }, [search, cat, skillsFilter, budgetType, togBeginner, togVerified, togMatch, sort, user, allJobs]);

  const activeFiltersCount = [
    cat !== 'All',
    skillsFilter.length > 0,
    budgetType !== 'All',
    togBeginner,
    togVerified,
    togMatch,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCat('All');
    setSkillsFilter([]);
    setBudgetType('All');
    setTogBeginner(false);
    setTogVerified(false);
    setTogMatch(false);
    setSort('Best match for me');
  };

  /* ── sidebar content (shared between desktop + mobile overlay) ── */
  const SidebarContent = ({ mobile = false }) => (
    <div className="space-y-6">
      {/* mobile close header */}
      {mobile && (
        <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
          <span className="font-semibold text-[15px] text-[#111827]">{t('filters')}</span>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E8E5E0] text-[#6B7280] hover:bg-[#F9F9F7]"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Category */}
      <div>
        <FilterHeading id="fw-category-label" label="Category" />
        <CompactSelect
          id="fw-category"
          labelId="fw-category-label"
          value={cat}
          onChange={setCat}
          options={[
            { value: 'All', label: t('cat_all') },
            ...ALL_CATEGORIES.map(c => ({ value: c, label: c })),
          ]}
        />
      </div>

      {/* Budget type */}
      <div>
        <FilterHeading label="Budget type" />
        <div className="space-y-0.5">
          {[
            { val: 'All', label: t('budget_all') },
            { val: 'fixed', label: t('budget_fixed') },
            { val: 'hourly', label: t('budget_hourly') },
          ].map(({ val, label }) => (
            <label
              key={val}
              className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-2 hover:bg-[#F9F9F7] transition-colors"
            >
              <input
                type="radio"
                checked={budgetType === val}
                onChange={() => setBudgetType(val)}
                className="accent-[#C73E33] w-3.5 h-3.5 shrink-0"
              />
              <span className="text-[13px] font-medium text-[#374151]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <FilterHeading label="Skills" />
        <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1 -mr-1">
          {ALL_SKILLS.map(s => (
            <label
              key={s}
              className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-2 hover:bg-[#F9F9F7] transition-colors"
            >
              <input
                type="checkbox"
                checked={skillsFilter.includes(s)}
                onChange={e => {
                  if (e.target.checked) setSkillsFilter([...skillsFilter, s]);
                  else setSkillsFilter(skillsFilter.filter(x => x !== s));
                }}
                className="accent-[#C73E33] w-3.5 h-3.5 shrink-0 rounded"
              />
              <span className="text-[13px] font-medium text-[#374151]">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="border-t border-[#F3F4F6] pt-5 space-y-2">
        <FilterHeading label="Quick filters" />
        <Toggle on={togBeginner} onToggle={() => setTogBeginner(!togBeginner)} label={t('tog_beginner')} />
        <Toggle on={togVerified} onToggle={() => setTogVerified(!togVerified)} label={t('tog_verified')} />
        <Toggle on={togMatch} onToggle={() => setTogMatch(!togMatch)} label={t('tog_match')} />
      </div>

      {/* Clear filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full text-[13px] font-semibold text-[#C73E33] border border-[#FED7D7] bg-[#FFF5F5] rounded-xl py-2.5 hover:bg-[#FECACA]/30 transition-colors"
        >
          {t('clear_all_filters')} ({activeFiltersCount})
        </button>
      )}

      {/* Mobile: apply */}
      {mobile && (
        <button
          onClick={() => setShowMobileFilters(false)}
          className="w-full bg-[#C73E33] text-white py-3 rounded-xl font-semibold text-[14px] hover:bg-[#AE332A] transition-colors"
        >
          {t('show_n_jobs').replace('{n}', filtered.length)}
        </button>
      )}
    </div>
  );

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-7">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#111827] leading-tight tracking-tight">
            {t('fw_title')}
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1 leading-relaxed">{t('fw_sub')}</p>
        </div>
        {/* action buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onSwitchClient}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#374151] bg-white border border-[#E8E5E0] rounded-full px-4 py-2 hover:bg-[#F9F9F7] hover:border-[#D1D5DB] transition-all"
          >
            <Briefcase size={14} className="text-[#C73E33] shrink-0" />
            {t('cm_welcome_q')}
          </button>
          <button
            onClick={() => navTo('bring')}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#374151] bg-white border border-[#E8E5E0] rounded-full px-4 py-2 hover:bg-[#F9F9F7] hover:border-[#D1D5DB] transition-all"
          >
            <HeartHandshake size={14} className="text-[#C73E33] shrink-0" />
            {t('br_entry')}
          </button>
        </div>
      </div>

      {/* ── Prominent search bar ── */}
      <div className="relative flex items-stretch gap-2">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search_placeholder')}
            aria-label={t('search_placeholder')}
            className="w-full border border-[#E8E5E0] rounded-2xl pl-11 pr-4 py-3.5 text-[14px] bg-white outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/15 placeholder-[#B0ADA8] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button className="shrink-0 inline-flex items-center gap-2 bg-[#C73E33] text-white text-[14px] font-semibold px-5 py-3.5 rounded-2xl hover:bg-[#AE332A] active:scale-[0.98] transition-all">
          <Search size={15} />
          <span className="hidden sm:inline">Search jobs</span>
        </button>
      </div>

      {/* ── Low-data notice ── */}
      {lowdata && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-4 py-3 text-[13px] font-medium text-[#92400E] flex items-center gap-2">
          <Moon size={15} className="shrink-0" /> {t('ld_on_line')}
        </div>
      )}

      {/* ── Main two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden lg:block w-[220px] shrink-0">
          <div className="sticky top-20 bg-white border border-[#E8E5E0] rounded-2xl p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-5">Filters</p>
            <SidebarContent />
          </div>
        </aside>

        {/* ── MOBILE FILTER DRAWER ── */}
        {showMobileFilters && (
          <>
            {/* backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* panel */}
            <div className="fixed inset-y-0 right-0 z-50 w-[min(340px,90vw)] bg-white shadow-2xl overflow-y-auto lg:hidden">
              <div className="p-5">
                <SidebarContent mobile />
              </div>
            </div>
          </>
        )}

        {/* ── JOB FEED ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Tabs + sort row */}
          <div className="bg-white border border-[#E8E5E0] rounded-2xl px-5 py-3.5">
            <div className="flex items-center justify-between gap-4">

              {/* Tabs */}
              <div className="flex items-center gap-1">
                <button className="relative px-4 py-2 text-[13px] font-semibold text-[#C73E33] rounded-xl bg-[#FFF5F5]">
                  Jobs
                  <span className="ml-2 text-[11px] font-semibold bg-[#C73E33] text-white rounded-full px-1.5 py-0.5">
                    {filtered.length}
                  </span>
                </button>
                <button
                  onClick={() => navTo('opportunities')}
                  className="px-4 py-2 text-[13px] font-semibold text-[#6B7280] rounded-xl hover:bg-[#F9F9F7] hover:text-[#374151] transition-colors"
                >
                  {t('my_opps')}
                </button>
              </div>

              {/* Right side: sort + mobile filter trigger */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Sort */}
                <div className="hidden sm:flex items-center gap-1.5 border border-[#E8E5E0] rounded-xl px-2.5 py-1 bg-[#F9F9F7]">
                  <span id="fw-sort-label" className="text-[12px] text-[#9CA3AF] font-medium">Sort:</span>
                  <CompactSelect
                    id="fw-sort"
                    labelId="fw-sort-label"
                    value={sort}
                    onChange={setSort}
                    compact
                    align="end"
                    options={[
                      { value: 'Best match for me', label: t('sort_best') },
                      { value: 'Newest', label: t('sort_new') },
                      { value: 'Budget: High to Low', label: t('sort_high') },
                      { value: 'Budget: Low to High', label: t('sort_low') },
                      { value: 'Best skill match', label: t('sort_match') },
                    ]}
                  />
                </div>
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 border border-[#E8E5E0] rounded-xl px-3 py-2 bg-[#F9F9F7] text-[12px] font-semibold text-[#374151] hover:bg-[#F3F4F6]"
                >
                  <SlidersHorizontal size={13} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#C73E33] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Job cards ── */}
          <div className="space-y-3.5">
            {filtered.length === 0 ? (
              <div className="bg-white border border-[#E8E5E0] rounded-2xl p-12 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-[#F9F9F7] border border-[#E8E5E0] rounded-full flex items-center justify-center mb-4">
                  <Search size={22} className="text-[#9CA3AF]" />
                </div>
                <p className="text-[15px] font-semibold text-[#111827] mb-1">{t('no_jobs')}</p>
                <p className="text-[13px] text-[#9CA3AF] mb-6">Try different keywords or adjust your filters.</p>
                <button
                  onClick={clearFilters}
                  className="border border-[#E8E5E0] px-5 py-2.5 rounded-xl text-[13px] font-semibold text-[#374151] hover:bg-[#F9F9F7] transition-colors"
                >
                  {t('clear_filters')}
                </button>
              </div>
            ) : (
              filtered.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  t={t}
                  navTo={navTo}
                  saved={savedJobs.includes(job.id)}
                  onToggleSave={() =>
                    setSavedJobs(prev =>
                      prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id]
                    )
                  }
                  lang={lang}
                  compact={lowdata}
                />
              ))
            )}
          </div>

          {/* ── Bottom CTA ── */}
          {filtered.length > 0 && (
            <div className="bg-white border border-[#E8E5E0] rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#111827]">Have an opportunity to share?</p>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5 leading-relaxed">
                  For partners and Nepalis abroad — share a job or what employers ask for.
                </p>
                <button
                  onClick={() => navTo('bring')}
                  className="mt-1.5 text-[13px] font-semibold text-[#C73E33] hover:underline underline-offset-2 transition-all"
                >
                  Bring an Opportunity →
                </button>
              </div>
              <button
                onClick={onSwitchClient}
                className="shrink-0 inline-flex items-center gap-2 text-[13px] font-semibold text-[#374151] bg-[#F9F9F7] border border-[#E8E5E0] rounded-xl px-4 py-2.5 hover:bg-[#F3F4F6] hover:border-[#D1D5DB] transition-all"
              >
                <Plus size={14} className="text-[#C73E33]" />
                Post a job — client demo
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
