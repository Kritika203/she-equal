// Client demo job posting screen.

import { AlertTriangle, CheckCircle2, Info, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CL_CARD, CL_COMPACT_CARD, CL_COMPACT_INPUT, CL_COMPACT_LABEL, ClientToggle } from '../components/client/ClientControls.jsx';
import { ALL_CATEGORIES } from '../data/demo.js';
import { DUMMY_JOBS } from '../data/jobs.js';
import { fmt, fmtMoney, toDigits } from '../utils/format.js';

const CLIENT_HOME_SECTION = 'border-t border-[#F0EEE9] pt-4';


export function ClientView({ t, lang, navTo, showToast, clientJobs, setClientJobs, scrollTo, clientMode = false, clientProfile = null }) {
  const digits = (n) => toDigits(n, lang);
  const skillOptions = useMemo(() => [...new Set(DUMMY_JOBS.flatMap(j => j.skillsRequired))], []);
  const [name, setName] = useState(clientMode && clientProfile ? `${clientProfile.name} (${clientProfile.business})` : '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [desc, setDesc] = useState('');
  const [deliverables, setDeliverables] = useState(['', '']);
  const [skills, setSkills] = useState([]);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [revisions, setRevisions] = useState('1');
  const [laptop, setLaptop] = useState(false);
  const [internet, setInternet] = useState('Basic');
  const [meeting, setMeeting] = useState('Flexible — no meetings');
  const [beginners, setBeginners] = useState(true);
  const [error, setError] = useState(false);
  const mineRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (scrollTo === 'mine' && mineRef.current) mineRef.current.scrollIntoView({ block: 'start' });
    if (scrollTo === 'form' && formRef.current) formRef.current.scrollIntoView({ block: 'start' });
  }, [scrollTo]);

  const submit = () => {
    const dl = deliverables.map(d => d.trim()).filter(Boolean);
    const b = Number(budget);
    const d = Number(deadline);
    if (!title.trim() || dl.length < 1 || skills.length < 1 || !(Math.round(b) >= 1) || !(d >= 1)) { setError(true); return; }
    const r = Number(revisions);
    const job = {
      id: 'c' + Date.now(),
      title: title.trim(),
      category,
      clientName: name.trim() || 'Client (demo)',
      clientCountry: 'Nepal',
      clientType: 'Client (demo)',
      paymentVerified: false,
      beginnerFriendly: beginners,
      description: desc.trim(),
      skillsRequired: skillOptions.filter(x => skills.includes(x)),
      budgetUSD: Math.round(b),
      budgetType: 'fixed',
      postedHoursAgo: 0,
      applicants: 3,
      jobsPostedByClient: 1,
      hireRate: 0,
      memberSince: 2026,
      clientRating: 0,
      aboutClient: 'Posted from the client demo.',
      needsOwnLaptop: laptop,
      internetNeed: internet,
      meetingTimeNepal: meeting.trim() || 'Flexible — no meetings',
      deadlineDays: Math.round(d),
      caution: null,
      deliverables: dl,
      clientProvides: [],
      revisionsIncluded: revisions !== '' && r >= 0 ? Math.floor(r) : 1,
      accepted: null,
    };
    setClientJobs([job, ...clientJobs]);
    setError(false);
    setName(''); setTitle(''); setCategory(ALL_CATEGORIES[0]); setDesc(''); setDeliverables(['', '']); setSkills([]);
    setBudget(''); setDeadline(''); setRevisions('1'); setLaptop(false); setInternet('Basic'); setMeeting('Flexible — no meetings'); setBeginners(true);
    showToast(t('cl_toast_posted'));
    setTimeout(() => { if (mineRef.current) mineRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-5">
      {clientMode ? (
        <div className="space-y-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-[24px] font-semibold tracking-tight text-[#111827]">{t('cm_home')}</h1>
              <p className="mt-1 text-[14px] font-medium text-[#374151]">{t('cm_greeting')}</p>
              <p className="mt-1 max-w-[660px] text-[13px] leading-[1.55] text-[#6B7280]">{t('cm_profile_line')}</p>
            </div>
            <button onClick={() => { if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="min-h-[42px] shrink-0 rounded-full bg-[#C73E33] px-5 text-[13px] font-semibold text-white hover:bg-[#AE332A]">
              {t('cm_post_new')}
            </button>
          </div>
          <div className="flex items-start gap-2 rounded-[10px] border border-[#EAE7E1] bg-[#F6F4EF] px-3 py-2.5 text-[12px] leading-[1.5] text-[#5F5A55]">
            <Info size={15} className="mt-0.5 shrink-0 text-[#746D66]" />
            <p>{t('disc_client')}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-[10px] border border-[#EAE7E1] bg-[#F6F4EF] px-3 py-2.5 text-[13px] leading-[1.5] text-[#5F5A55]">
          <Info size={16} className="mt-0.5 shrink-0 text-[#746D66]" />
          <p>{t('cl_demo_note')}</p>
        </div>
      )}

      <div ref={formRef} className={`${CL_COMPACT_CARD} scroll-mt-24`}>
        <div className="mb-4">
          <h2 className="text-[18px] font-semibold tracking-tight text-[#111827]">{t('cl_entry')}</h2>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="cl-name" className={CL_COMPACT_LABEL}>{t('cl_f_name')}</label>
            <input id="cl-name" type="text" value={name} onChange={e => setName(e.target.value)} className={CL_COMPACT_INPUT} />
          </div>
          <div>
            <label htmlFor="cl-title" className={CL_COMPACT_LABEL}>{t('cl_f_title')}</label>
            <input id="cl-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={CL_COMPACT_INPUT} />
          </div>
          <div>
            <label htmlFor="cl-cat" className={CL_COMPACT_LABEL}>{t('cl_f_category')}</label>
            <select id="cl-cat" value={category} onChange={e => setCategory(e.target.value)} className={CL_COMPACT_INPUT}>
              {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cl-desc" className={CL_COMPACT_LABEL}>{t('cl_f_desc')}</label>
            <textarea id="cl-desc" rows={3} value={desc} onChange={e => setDesc(e.target.value)} className={`${CL_COMPACT_INPUT} min-h-[88px] resize-y`} />
          </div>

          <div className={`${CLIENT_HOME_SECTION} space-y-2.5 sm:col-span-2`}>
            <div className={CL_COMPACT_LABEL}>{t('cl_f_deliv')}</div>
            {deliverables.map((d, i) => (
              <input key={i} type="text" aria-label={`${t('cl_f_deliv')} ${digits(i + 1)}`} value={d} onChange={e => setDeliverables(prev => prev.map((x, k) => k === i ? e.target.value : x))} className={CL_COMPACT_INPUT} />
            ))}
            {deliverables.length < 5 && (
              <button type="button" onClick={() => setDeliverables(prev => [...prev, ''])} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#E3E0D9] bg-white px-3.5 text-[13px] font-semibold text-[#374151] hover:bg-[#F6F4EF]">
                <Plus size={16} /> {t('cl_add_one')}
              </button>
            )}
          </div>

          <div className={`${CLIENT_HOME_SECTION} sm:col-span-2`}>
            <div className={CL_COMPACT_LABEL}>{t('cl_f_skills')}</div>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(sk => {
                const on = skills.includes(sk);
                return (
                  <button key={sk} type="button" aria-pressed={on} onClick={() => setSkills(prev => prev.includes(sk) ? prev.filter(x => x !== sk) : [...prev, sk])}
                    className={`min-h-[36px] rounded-full border px-3 text-[13px] font-medium ${on ? 'bg-[#FAF0EE] border-[#C73E33] text-[#AE332A]' : 'bg-white border-[#EAE7E1] text-[#4A4744] hover:bg-[#F6F4EF]'}`}>
                    {sk}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`${CLIENT_HOME_SECTION} grid grid-cols-1 gap-3.5 sm:col-span-2 sm:grid-cols-3`}>
            <div>
              <label htmlFor="cl-budget" className={CL_COMPACT_LABEL}>{t('cl_f_budget')}</label>
              <input id="cl-budget" type="number" inputMode="numeric" min="1" value={budget} onChange={e => setBudget(e.target.value)} className={CL_COMPACT_INPUT} />
            </div>
            <div>
              <label htmlFor="cl-deadline" className={CL_COMPACT_LABEL}>{t('cl_f_deadline')}</label>
              <input id="cl-deadline" type="number" inputMode="numeric" min="1" value={deadline} onChange={e => setDeadline(e.target.value)} className={CL_COMPACT_INPUT} />
            </div>
            <div>
              <label htmlFor="cl-rev" className={CL_COMPACT_LABEL}>{t('cl_f_revisions')}</label>
              <input id="cl-rev" type="number" inputMode="numeric" min="0" value={revisions} onChange={e => setRevisions(e.target.value)} className={CL_COMPACT_INPUT} />
            </div>
          </div>

          <div className={`${CLIENT_HOME_SECTION} grid grid-cols-1 gap-x-6 gap-y-2 sm:col-span-2 sm:grid-cols-2`}>
            <h3 className="text-[14px] font-semibold text-[#1C1B1A] sm:col-span-2">{t('cl_req_head')}</h3>
            <ClientToggle label={t('cl_f_laptop')} on={laptop} onChange={setLaptop} />
            <ClientToggle label={t('cl_f_beginners')} on={beginners} onChange={setBeginners} />
            <div>
              <label htmlFor="cl-net" className={CL_COMPACT_LABEL}>{t('cl_f_internet')}</label>
              <select id="cl-net" value={internet} onChange={e => setInternet(e.target.value)} className={CL_COMPACT_INPUT}>
                <option value="Basic">Basic</option>
                <option value="Good">Good</option>
              </select>
            </div>
            <div>
              <label htmlFor="cl-meet" className={CL_COMPACT_LABEL}>{t('cl_f_meeting')}</label>
              <input id="cl-meet" type="text" value={meeting} onChange={e => setMeeting(e.target.value)} className={CL_COMPACT_INPUT} />
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-[10px] border border-[#F3E1DD] bg-[#FAF0EE] px-3 py-2.5">
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#AE332A]" />
            <p className="text-[13px] leading-[1.5] text-[#1C1B1A]">{t('cl_error')}</p>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={submit} className="min-h-[42px] w-full rounded-full bg-[#C73E33] px-6 text-[14px] font-semibold text-white hover:bg-[#AE332A] sm:w-auto">
            {t('cl_submit')}
          </button>
        </div>
      </div>

      <div ref={mineRef} className="scroll-mt-24 pt-2">
        <h2 className="mb-3 text-[18px] font-semibold tracking-tight text-[#111827]">{t('cl_my_jobs')}</h2>
        {clientJobs.length === 0 ? (
          <p className="text-[14px] text-[#6B7280]">{t('cl_none')}</p>
        ) : (
          <div className="space-y-3">
            {clientJobs.map(j => (
              <div key={j.id} className={CL_CARD}>
                <div className="mb-1 break-words text-[16px] font-semibold">{j.title}</div>
                {j.seededDemo && (
                  <span className="inline-block bg-[#F0EEE9] text-[#1C1B1A] px-3 py-1 rounded-full text-[13px] font-semibold mb-2">{t('cm_seed_chip')}</span>
                )}
                <div className="mb-3 text-[13px] text-[#6B7280]">{j.clientName} · ${fmtMoney(j.budgetUSD)} (NPR {fmtMoney(j.budgetUSD * 133)}) · {fmt(t('wr_days'), { days: digits(j.deadlineDays) })}</div>
                {j.accepted && (
                  <div className="mb-3 space-y-2 rounded-[12px] border border-[#F3E1DD] bg-[#FAF0EE] p-3">
                    <div className="flex items-start gap-2 text-[14px] font-semibold text-[#1C1B1A]"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#C73E33]" /> <span>{fmt(t('ag_made'), { name: j.accepted.applicantName })}</span></div>
                    <p className="text-[13px] text-[#4A4744]">{t('ag_full_product')}</p>
                  </div>
                )}
                <button onClick={() => navTo('client-applicants', { id: j.id })} className="min-h-[40px] w-full rounded-full bg-[#C73E33] px-5 text-[13px] font-semibold text-white hover:bg-[#AE332A] sm:w-auto">
                  {t('cl_view_applicants')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
