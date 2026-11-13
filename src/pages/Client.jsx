// Client demo job posting screen.

import { AlertTriangle, CheckCircle2, Info, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CL_CARD, CL_INPUT, CL_LABEL, ClientToggle } from '../components/client/ClientControls.jsx';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { ALL_CATEGORIES } from '../data/demo.js';
import { DUMMY_JOBS } from '../data/jobs.js';
import { fmt, fmtMoney, toDigits } from '../utils/format.js';



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
    <div className="max-w-2xl mx-auto space-y-6">
      {clientMode ? (
        <div>
          <h1 className="text-[28px] sm:text-[30px] font-semibold mb-2">{t('cm_home')}</h1>
          <p className="text-lg font-semibold mb-1">{t('cm_greeting')}</p>
          <p className="text-base text-[#4A4744] mb-4 leading-[1.6]">{t('cm_profile_line')}</p>
          <button onClick={() => { if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="bg-[#C73E33] text-white px-6 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] mb-4">
            {t('cm_post_new')}
          </button>
          <Disclaimer t={t} k="disc_client" />
        </div>
      ) : (
        <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
          <Info size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
          <p className="text-base text-[#1C1B1A]">{t('cl_demo_note')}</p>
        </div>
      )}

      <div ref={formRef} className={`${CL_CARD} space-y-5 scroll-mt-32`}>
        <div>
          <label htmlFor="cl-name" className={CL_LABEL}>{t('cl_f_name')}</label>
          <input id="cl-name" type="text" value={name} onChange={e => setName(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="cl-title" className={CL_LABEL}>{t('cl_f_title')}</label>
          <input id="cl-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="cl-cat" className={CL_LABEL}>{t('cl_f_category')}</label>
          <select id="cl-cat" value={category} onChange={e => setCategory(e.target.value)} className={CL_INPUT}>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cl-desc" className={CL_LABEL}>{t('cl_f_desc')}</label>
          <textarea id="cl-desc" rows={4} value={desc} onChange={e => setDesc(e.target.value)} className={CL_INPUT} />
        </div>
      </div>

      <div className={`${CL_CARD} space-y-3`}>
        <div className={CL_LABEL}>{t('cl_f_deliv')}</div>
        {deliverables.map((d, i) => (
          <input key={i} type="text" aria-label={`${t('cl_f_deliv')} ${digits(i + 1)}`} value={d} onChange={e => setDeliverables(prev => prev.map((x, k) => k === i ? e.target.value : x))} className={CL_INPUT} />
        ))}
        {deliverables.length < 5 && (
          <button type="button" onClick={() => setDeliverables(prev => [...prev, ''])} className="min-h-[48px] px-5 rounded-full bg-white border border-[#E3E0D9] text-[#1C1B1A] font-semibold text-base hover:bg-[#F6F4EF] flex items-center gap-2">
            <Plus size={20} /> {t('cl_add_one')}
          </button>
        )}
      </div>

      <div className={CL_CARD}>
        <div className={CL_LABEL}>{t('cl_f_skills')}</div>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map(sk => {
            const on = skills.includes(sk);
            return (
              <button key={sk} type="button" aria-pressed={on} onClick={() => setSkills(prev => prev.includes(sk) ? prev.filter(x => x !== sk) : [...prev, sk])}
                className={`min-h-[44px] px-4 rounded-full border text-base font-medium ${on ? 'bg-[#FAF0EE] border-[#C73E33] text-[#AE332A]' : 'bg-white border-[#EAE7E1] text-[#4A4744] hover:bg-[#F6F4EF]'}`}>
                {sk}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`${CL_CARD} space-y-5`}>
        <div>
          <label htmlFor="cl-budget" className={CL_LABEL}>{t('cl_f_budget')}</label>
          <input id="cl-budget" type="number" inputMode="numeric" min="1" value={budget} onChange={e => setBudget(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="cl-deadline" className={CL_LABEL}>{t('cl_f_deadline')}</label>
          <input id="cl-deadline" type="number" inputMode="numeric" min="1" value={deadline} onChange={e => setDeadline(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="cl-rev" className={CL_LABEL}>{t('cl_f_revisions')}</label>
          <input id="cl-rev" type="number" inputMode="numeric" min="0" value={revisions} onChange={e => setRevisions(e.target.value)} className={CL_INPUT} />
        </div>
      </div>

      <div className={`${CL_CARD} space-y-4`}>
        <h2 className="text-xl font-semibold">{t('cl_req_head')}</h2>
        <ClientToggle label={t('cl_f_laptop')} on={laptop} onChange={setLaptop} />
        <div>
          <label htmlFor="cl-net" className={CL_LABEL}>{t('cl_f_internet')}</label>
          <select id="cl-net" value={internet} onChange={e => setInternet(e.target.value)} className={CL_INPUT}>
            <option value="Basic">Basic</option>
            <option value="Good">Good</option>
          </select>
        </div>
        <div>
          <label htmlFor="cl-meet" className={CL_LABEL}>{t('cl_f_meeting')}</label>
          <input id="cl-meet" type="text" value={meeting} onChange={e => setMeeting(e.target.value)} className={CL_INPUT} />
        </div>
        <ClientToggle label={t('cl_f_beginners')} on={beginners} onChange={setBeginners} />
      </div>

      {error && (
        <div role="alert" className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[14px] p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
          <p className="text-base text-[#1C1B1A]">{t('cl_error')}</p>
        </div>
      )}
      <button type="button" onClick={submit} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
        {t('cl_submit')}
      </button>

      <div ref={mineRef} className="pt-4 scroll-mt-24">
        <h2 className="text-[22px] font-semibold mb-4">{t('cl_my_jobs')}</h2>
        {clientJobs.length === 0 ? (
          <p className="text-base text-[#4A4744]">{t('cl_none')}</p>
        ) : (
          <div className="space-y-4">
            {clientJobs.map(j => (
              <div key={j.id} className={CL_CARD}>
                <div className="font-semibold text-xl mb-1 break-words">{j.title}</div>
                {j.seededDemo && (
                  <span className="inline-block bg-[#F0EEE9] text-[#1C1B1A] px-3 py-1 rounded-full text-[13px] font-semibold mb-2">{t('cm_seed_chip')}</span>
                )}
                <div className="text-base text-[#4A4744] mb-4">{j.clientName} · ${fmtMoney(j.budgetUSD)} (NPR {fmtMoney(j.budgetUSD * 133)}) · {fmt(t('wr_days'), { days: digits(j.deadlineDays) })}</div>
                {j.accepted && (
                  <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[14px] p-4 mb-4 space-y-2">
                    <div className="flex items-start gap-2 text-base font-semibold text-[#1C1B1A]"><CheckCircle2 size={20} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{fmt(t('ag_made'), { name: j.accepted.applicantName })}</span></div>
                    <p className="text-base text-[#4A4744]">{t('ag_full_product')}</p>
                  </div>
                )}
                <button onClick={() => navTo('client-applicants', { id: j.id })} className="w-full sm:w-auto bg-[#C73E33] text-white px-6 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">
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
