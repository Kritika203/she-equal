// Submit a sample opportunity.

import { AlertTriangle, CheckCircle2, ChevronLeft, ClipboardList, Plus, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CL_CARD, CL_INPUT, CL_LABEL, ClientToggle } from '../components/client/ClientControls.jsx';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { ALL_CATEGORIES } from '../data/demo.js';
import { DUMMY_JOBS } from '../data/jobs.js';
import { BRING_PAY_METHODS } from '../services/bring.js';
import { toDigits } from '../utils/format.js';



export function BringView({ t, lang, navTo, onSubmit }) {
  const digits = (n) => toDigits(n, lang);
  const skillOptions = useMemo(() => [...new Set(DUMMY_JOBS.flatMap(j => j.skillsRequired))], []);
  const [type, setType] = useState('opportunity');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [desc, setDesc] = useState('');
  const [deliverables, setDeliverables] = useState(['', '']);
  const [skills, setSkills] = useState([]);
  const [bMin, setBMin] = useState('');
  const [bMax, setBMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [pay, setPay] = useState('Bank transfer');
  const [laptop, setLaptop] = useState(false);
  const [internet, setInternet] = useState('Basic');
  const [beginners, setBeginners] = useState(true);
  const [insight, setInsight] = useState('');

  const payLabel = (m) => m === 'Bank transfer' ? t('np_bank') : m === 'Other' ? t('br_pay_other') : m;
  const pickType = (v) => { setType(v); setError(false); };

  const submit = () => {
    const base = { name: name.trim(), organisation: org.trim(), country: country.trim(), email: email.trim() };
    const baseOk = base.name && base.organisation && base.country && base.email.includes('@');
    const id = 'b' + Date.now();
    const date = new Date().toISOString().slice(0, 10);
    if (type === 'insight') {
      if (!baseOk || !insight.trim()) { setError(true); return; }
      onSubmit({ id, type: 'insight', status: 'pending', date, ...base, text: insight.trim() });
    } else {
      const dl = deliverables.map(d => d.trim()).filter(Boolean);
      const lo = Math.round(Number(bMin));
      const hi = Math.round(Number(bMax));
      const d = Number(deadline);
      if (!baseOk || !title.trim() || !desc.trim() || dl.length < 1 || skills.length < 1 || !(lo >= 1) || !(hi >= lo) || !(d >= 1)) { setError(true); return; }
      onSubmit({
        id, type: 'opportunity', status: 'pending', date, ...base,
        title: title.trim(), category, description: desc.trim(), deliverables: dl,
        skillsRequired: skillOptions.filter(x => skills.includes(x)),
        budgetMin: lo, budgetMax: hi, deadlineDays: Math.round(d), paymentMethod: pay,
        needsOwnLaptop: laptop, internetNeed: internet, beginnerFriendly: beginners,
      });
    }
    setError(false);
    setDone(true);
    window.scrollTo(0, 0);
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`${CL_CARD} space-y-5`}>
          <div className="flex items-start gap-3">
            <CheckCircle2 size={24} className="shrink-0 mt-0.5 text-[#C73E33]" />
            <p className="text-base text-[#1C1B1A]">{t('br_thanks')}</p>
          </div>
          <button type="button" onClick={() => navTo('firstwork')} className="w-full sm:w-auto bg-[#C73E33] text-white px-8 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">
            {t('back_to_jobs')}
          </button>
        </div>
      </div>
    );
  }

  const pill = (on) => `min-h-[48px] px-5 py-2 rounded-full border text-base font-semibold text-left ${on ? 'bg-[#FAF0EE] border-[#C73E33] text-[#AE332A]' : 'bg-white border-[#EAE7E1] text-[#4A4744] hover:bg-[#F6F4EF]'}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button onClick={() => navTo('firstwork')} className="flex items-center gap-2 text-base text-[#4A4744] mb-4 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
          <ChevronLeft size={20} /> {t('back_to_jobs')}
        </button>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-2">{t('br_title')}</h1>
        <p className="text-base text-[#4A4744] mb-3">{t('br_intro')}</p>
        <button type="button" onClick={() => navTo('bring-queue')} className="inline-flex items-center gap-2 text-base font-semibold text-[#1C1B1A] underline underline-offset-4 min-h-[44px]">
          <ClipboardList size={20} className="shrink-0" /> {t('br_queue_link')}
        </button>
        <button type="button" onClick={() => navTo('institution-insight')} className="mt-3 w-full text-left bg-white border border-[#EAE7E1] rounded-[20px] p-4 hover:bg-[#F6F4EF] min-h-[44px] flex items-start gap-3">
          <TrendingUp size={22} className="shrink-0 mt-0.5 text-[#C73E33]" />
          <span>
            <span className="block text-base font-semibold text-[#1C1B1A]">{t('ii_entry')}</span>
            <span className="block text-base text-[#4A4744]">{t('ii_entry_sub')}</span>
          </span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3" role="group">
        <button type="button" aria-pressed={type === 'opportunity'} onClick={() => pickType('opportunity')} className={pill(type === 'opportunity')}>{t('br_type_opp')}</button>
        <button type="button" aria-pressed={type === 'insight'} onClick={() => pickType('insight')} className={pill(type === 'insight')}>{t('br_type_ins')}</button>
      </div>

      <Disclaimer t={t} k="disc_bring" />

      <div className={`${CL_CARD} space-y-5`}>
        <div>
          <label htmlFor="br-name" className={CL_LABEL}>{t('br_f_name')}</label>
          <input id="br-name" type="text" value={name} onChange={e => setName(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="br-org" className={CL_LABEL}>{t('br_f_org')}</label>
          <input id="br-org" type="text" value={org} onChange={e => setOrg(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="br-country" className={CL_LABEL}>{t('br_f_country')}</label>
          <input id="br-country" type="text" value={country} onChange={e => setCountry(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="br-email" className={CL_LABEL}>{t('br_f_email')}</label>
          <input id="br-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={CL_INPUT} />
        </div>
      </div>

      {type === 'insight' ? (
        <div className={CL_CARD}>
          <label htmlFor="br-insight" className={CL_LABEL}>{t('br_f_insight')}</label>
          <textarea id="br-insight" rows={5} value={insight} onChange={e => setInsight(e.target.value)} className={CL_INPUT} />
        </div>
      ) : (
        <>
          <div className={`${CL_CARD} space-y-5`}>
            <div>
              <label htmlFor="br-title" className={CL_LABEL}>{t('cl_f_title')}</label>
              <input id="br-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={CL_INPUT} />
            </div>
            <div>
              <label htmlFor="br-cat" className={CL_LABEL}>{t('cl_f_category')}</label>
              <select id="br-cat" value={category} onChange={e => setCategory(e.target.value)} className={CL_INPUT}>
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="br-desc" className={CL_LABEL}>{t('cl_f_desc')}</label>
              <textarea id="br-desc" rows={4} value={desc} onChange={e => setDesc(e.target.value)} className={CL_INPUT} />
            </div>
          </div>

          <div className={`${CL_CARD} space-y-3`}>
            <div className={CL_LABEL}>{t('cl_f_deliv')}</div>
            {deliverables.map((d, i) => (
              <input key={i} type="text" aria-label={`${t('cl_f_deliv')} ${digits(i + 1)}`} value={d} onChange={e => setDeliverables(prev => prev.map((x, k) => k === i ? e.target.value : x))} className={CL_INPUT} />
            ))}
            {deliverables.length < 3 && (
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
              <div className={CL_LABEL}>{t('br_f_budget')}</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="br-bmin" className="block text-sm text-[#6E6963] mb-1">{t('br_from')}</label>
                  <input id="br-bmin" type="number" inputMode="numeric" min="1" value={bMin} onChange={e => setBMin(e.target.value)} className={CL_INPUT} />
                </div>
                <div>
                  <label htmlFor="br-bmax" className="block text-sm text-[#6E6963] mb-1">{t('br_to')}</label>
                  <input id="br-bmax" type="number" inputMode="numeric" min="1" value={bMax} onChange={e => setBMax(e.target.value)} className={CL_INPUT} />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="br-deadline" className={CL_LABEL}>{t('cl_f_deadline')}</label>
              <input id="br-deadline" type="number" inputMode="numeric" min="1" value={deadline} onChange={e => setDeadline(e.target.value)} className={CL_INPUT} />
            </div>
            <div>
              <label htmlFor="br-pay" className={CL_LABEL}>{t('br_f_pay')}</label>
              <select id="br-pay" value={pay} onChange={e => setPay(e.target.value)} className={CL_INPUT}>
                {BRING_PAY_METHODS.map(m => <option key={m} value={m}>{payLabel(m)}</option>)}
              </select>
            </div>
          </div>

          <div className={`${CL_CARD} space-y-4`}>
            <h2 className="text-xl font-semibold">{t('cl_req_head')}</h2>
            <ClientToggle label={t('cl_f_laptop')} on={laptop} onChange={setLaptop} />
            <div>
              <label htmlFor="br-net" className={CL_LABEL}>{t('cl_f_internet')}</label>
              <select id="br-net" value={internet} onChange={e => setInternet(e.target.value)} className={CL_INPUT}>
                <option value="Basic">Basic</option>
                <option value="Good">Good</option>
              </select>
            </div>
            <ClientToggle label={t('cl_f_beginners')} on={beginners} onChange={setBeginners} />
          </div>
        </>
      )}

      {error && (
        <div role="alert" className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[14px] p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
          <p className="text-base text-[#1C1B1A]">{type === 'insight' ? t('br_error_ins') : t('br_error_opp')}</p>
        </div>
      )}
      <button type="button" onClick={submit} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
        {t('br_submit')}
      </button>
    </div>
  );
}
