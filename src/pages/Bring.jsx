// Submit a sample opportunity.

import { AlertTriangle, CheckCircle2, ChevronLeft, ClipboardList, Plus, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CL_COMPACT_CARD, CL_COMPACT_INPUT, CL_COMPACT_LABEL, ClientToggle, CompactSelect } from '../components/client/ClientControls.jsx';
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
      <div className="mx-auto w-full max-w-[840px]">
        <div className={`${CL_COMPACT_CARD} space-y-4`}>
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#C73E33]" />
            <p className="text-[14px] leading-relaxed text-[#1C1B1A]">{t('br_thanks')}</p>
          </div>
          <button type="button" onClick={() => navTo('firstwork')} className="min-h-[42px] w-full rounded-full bg-[#C73E33] px-6 text-[13px] font-semibold text-white hover:bg-[#AE332A] sm:w-auto">
            {t('back_to_jobs')}
          </button>
        </div>
      </div>
    );
  }

  const pill = (on) => `min-h-[40px] rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${on ? 'border-[#EBC7C2] bg-[#FFF5F5] text-[#AE332A]' : 'border-[#E8E5E0] bg-white text-[#4A4744] hover:bg-[#F9F9F7]'}`;

  return (
    <div className="mx-auto w-full max-w-[840px] space-y-4 sm:space-y-5">
      <div className="space-y-3">
        <button onClick={() => navTo('firstwork')} className="-ml-2 inline-flex min-h-[36px] items-center gap-1.5 px-2 text-[13px] font-medium text-[#6B7280] hover:text-[#111827]">
          <ChevronLeft size={16} /> {t('back_to_jobs')}
        </button>
        <div>
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[#111827] sm:text-[28px]">{t('br_title')}</h1>
          <p className="mt-1.5 max-w-[740px] text-[14px] leading-[1.6] text-[#6B7280]">{t('br_intro')}</p>
        </div>
        <button type="button" onClick={() => navTo('bring-queue')} className="inline-flex min-h-[36px] items-center gap-2 text-[13px] font-semibold text-[#374151] hover:text-[#C73E33]">
          <ClipboardList size={16} className="shrink-0" /> {t('br_queue_link')}
        </button>
        <button type="button" onClick={() => navTo('institution-insight')} className="flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-[#E8E5E0] bg-white p-3.5 text-left hover:bg-[#F9F9F7] sm:p-4">
          <TrendingUp size={18} className="shrink-0 text-[#C73E33]" />
          <span>
            <span className="block text-[14px] font-semibold text-[#111827]">{t('ii_entry')}</span>
            <span className="mt-0.5 block text-[13px] leading-[1.45] text-[#6B7280]">{t('ii_entry_sub')}</span>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:flex" role="group">
        <button type="button" aria-pressed={type === 'opportunity'} onClick={() => pickType('opportunity')} className={`${pill(type === 'opportunity')} sm:flex-1`}>{t('br_type_opp')}</button>
        <button type="button" aria-pressed={type === 'insight'} onClick={() => pickType('insight')} className={`${pill(type === 'insight')} sm:flex-1`}>{t('br_type_ins')}</button>
      </div>

      <Disclaimer t={t} k="disc_bring" className="rounded-[10px] border border-[#E8E5E0] bg-white px-3 py-2.5 !text-[12px] leading-[1.5]" />

      <div className={CL_COMPACT_CARD}>
        <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="br-name" className={CL_COMPACT_LABEL}>{t('br_f_name')}</label>
            <input id="br-name" type="text" value={name} onChange={e => setName(e.target.value)} className={CL_COMPACT_INPUT} />
          </div>
          <div>
            <label htmlFor="br-org" className={CL_COMPACT_LABEL}>{t('br_f_org')}</label>
            <input id="br-org" type="text" value={org} onChange={e => setOrg(e.target.value)} className={CL_COMPACT_INPUT} />
          </div>
          <div>
            <label htmlFor="br-country" className={CL_COMPACT_LABEL}>{t('br_f_country')}</label>
            <input id="br-country" type="text" value={country} onChange={e => setCountry(e.target.value)} className={CL_COMPACT_INPUT} />
          </div>
          <div>
            <label htmlFor="br-email" className={CL_COMPACT_LABEL}>{t('br_f_email')}</label>
            <input id="br-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={CL_COMPACT_INPUT} />
          </div>
        </div>
      </div>

      {type === 'insight' ? (
        <div className={CL_COMPACT_CARD}>
          <label htmlFor="br-insight" className={CL_COMPACT_LABEL}>{t('br_f_insight')}</label>
          <textarea id="br-insight" rows={4} value={insight} onChange={e => setInsight(e.target.value)} className={`${CL_COMPACT_INPUT} min-h-[120px] resize-y`} />
        </div>
      ) : (
        <>
          <div className={`${CL_COMPACT_CARD} space-y-3.5`}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="br-title" className={CL_COMPACT_LABEL}>{t('cl_f_title')}</label>
                <input id="br-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={CL_COMPACT_INPUT} />
              </div>
              <div>
                <label id="br-cat-label" htmlFor="br-cat" className={CL_COMPACT_LABEL}>{t('cl_f_category')}</label>
                <CompactSelect id="br-cat" labelId="br-cat-label" value={category} onChange={setCategory} options={ALL_CATEGORIES.map(c => ({ value: c, label: c }))} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="br-desc" className={CL_COMPACT_LABEL}>{t('cl_f_desc')}</label>
                <textarea id="br-desc" rows={3} value={desc} onChange={e => setDesc(e.target.value)} className={`${CL_COMPACT_INPUT} min-h-[88px] resize-y`} />
              </div>
            </div>

            <div className="space-y-2.5 border-t border-[#F0EEE9] pt-3.5">
              <div className={CL_COMPACT_LABEL}>{t('cl_f_deliv')}</div>
              {deliverables.map((d, i) => (
                <input key={i} type="text" aria-label={`${t('cl_f_deliv')} ${digits(i + 1)}`} value={d} onChange={e => setDeliverables(prev => prev.map((x, k) => k === i ? e.target.value : x))} className={CL_COMPACT_INPUT} />
              ))}
              {deliverables.length < 3 && (
                <button type="button" onClick={() => setDeliverables(prev => [...prev, ''])} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#E3E0D9] bg-white px-3.5 text-[13px] font-semibold text-[#374151] hover:bg-[#F6F4EF]">
                  <Plus size={16} /> {t('cl_add_one')}
                </button>
              )}
            </div>

            <div className="border-t border-[#F0EEE9] pt-3.5">
              <div className={CL_COMPACT_LABEL}>{t('cl_f_skills')}</div>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(sk => {
                  const on = skills.includes(sk);
                  return (
                    <button key={sk} type="button" aria-pressed={on} onClick={() => setSkills(prev => prev.includes(sk) ? prev.filter(x => x !== sk) : [...prev, sk])}
                      className={`min-h-[36px] rounded-full border px-3 text-[13px] font-medium ${on ? 'bg-[#FFF5F5] border-[#C73E33] text-[#AE332A]' : 'bg-white border-[#EAE7E1] text-[#4A4744] hover:bg-[#F6F4EF]'}`}>
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={CL_COMPACT_CARD}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className={CL_COMPACT_LABEL}>{t('br_f_budget')}</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="br-bmin" className="mb-1 block text-[13px] text-[#6B7280]">{t('br_from')}</label>
                    <input id="br-bmin" type="number" inputMode="numeric" min="1" value={bMin} onChange={e => setBMin(e.target.value)} className={CL_COMPACT_INPUT} />
                  </div>
                  <div>
                    <label htmlFor="br-bmax" className="mb-1 block text-[13px] text-[#6B7280]">{t('br_to')}</label>
                    <input id="br-bmax" type="number" inputMode="numeric" min="1" value={bMax} onChange={e => setBMax(e.target.value)} className={CL_COMPACT_INPUT} />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="br-deadline" className={CL_COMPACT_LABEL}>{t('cl_f_deadline')}</label>
                <input id="br-deadline" type="number" inputMode="numeric" min="1" value={deadline} onChange={e => setDeadline(e.target.value)} className={CL_COMPACT_INPUT} />
              </div>
              <div>
                <label id="br-pay-label" htmlFor="br-pay" className={CL_COMPACT_LABEL}>{t('br_f_pay')}</label>
                <CompactSelect id="br-pay" labelId="br-pay-label" value={pay} onChange={setPay} options={BRING_PAY_METHODS.map(m => ({ value: m, label: payLabel(m) }))} />
              </div>
            </div>
          </div>

          <div className={`${CL_COMPACT_CARD} space-y-2`}>
            <h2 className="text-[15px] font-semibold text-[#1C1B1A]">{t('cl_req_head')}</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
              <ClientToggle compact label={t('cl_f_laptop')} on={laptop} onChange={setLaptop} />
              <ClientToggle compact label={t('cl_f_beginners')} on={beginners} onChange={setBeginners} />
              <fieldset className="min-w-0 sm:col-span-2">
                <legend className={CL_COMPACT_LABEL}>{t('cl_f_internet')}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {['Basic', 'Good'].map(option => (
                    <label key={option} className={`flex min-h-[42px] min-w-0 cursor-pointer items-center gap-2.5 rounded-[10px] border px-3 text-[14px] transition-colors ${internet === option ? 'border-[#C73E33] bg-[#FFF5F5] text-[#AE332A]' : 'border-[#E3E0D9] bg-white text-[#4A4744] hover:bg-[#F9F9F7]'}`}>
                      <input type="radio" name="br-internet" value={option} checked={internet === option} onChange={() => setInternet(option)} className="h-4 w-4 shrink-0 accent-[#C73E33]" />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-[10px] border border-[#F3E1DD] bg-[#FAF0EE] px-3 py-2.5">
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#AE332A]" />
          <p className="text-[13px] leading-[1.5] text-[#1C1B1A]">{type === 'insight' ? t('br_error_ins') : t('br_error_opp')}</p>
        </div>
      )}
      <div className="flex justify-end">
        <button type="button" onClick={submit} className="min-h-[42px] w-full rounded-full bg-[#C73E33] px-6 text-[14px] font-semibold text-white hover:bg-[#AE332A] sm:w-auto">
          {t('br_submit')}
        </button>
      </div>
    </div>
  );
}
