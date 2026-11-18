// Login and account setup screens.

import { ChevronLeft, Shield, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { ALL_CATEGORIES, ALL_SKILLS, DISTRICTS } from '../data/demo.js';

/* ── shared input + button styles ── */
const INPUT = "w-full border border-[#E8E5E0] rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/15 bg-white placeholder-[#B0ADA8] transition-all";
const BTN_PRIMARY = "w-full h-10 bg-[#C73E33] text-white rounded-full font-semibold text-[13px] hover:bg-[#AE332A] disabled:opacity-40 transition-colors";
const BTN_BACK = "flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#111827] font-medium py-2 -ml-1 transition-colors";
const LABEL = "block text-[13px] font-semibold text-[#111827] mb-1.5";

function PlaceholderSection({ t, title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-14 h-14 bg-[#F3F4F6] border border-[#E8E5E0] rounded-2xl flex items-center justify-center mb-4">
        <User size={28} className="text-[#9CA3AF]" />
      </div>
      <h1 className="text-[22px] font-semibold mb-2 text-[#111827]">{title}</h1>
      <p className="text-[13px] text-[#9CA3AF]">{t('proto_section')}</p>
    </div>
  );
}

export function LoginFlow({ t, onBack, onLogin }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const codeRefs = [useRef(), useRef(), useRef(), useRef()];

  const handlePhoneSubmit = () => {
    if (phone.length === 10 && phone.startsWith("9")) {
      setErr("");
      setStep(2);
    } else {
      setErr(t('phone_err'));
    }
  };

  const handleCodeChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 3) codeRefs[idx + 1].current.focus();
  };

  return (
    <div className="pb-4">
      <button onClick={step === 1 ? onBack : () => setStep(1)} className={BTN_BACK}>
        <ChevronLeft size={16} /> {t('back')}
      </button>

      <h2 className="text-[22px] font-semibold text-[#111827] mt-4 mb-5 leading-tight">{step === 1 ? t('login_step1_title') : t('login_step2_title')}</h2>
      
      {step === 1 ? (
        <>
          <div className="mb-5">
            <label className={LABEL}>{t('phone_label')}</label>
            <div className="flex">
              <div className="bg-[#F9FAFB] border border-[#E8E5E0] border-r-0 px-3 py-2.5 rounded-l-xl text-[13px] text-[#6B7280] font-medium flex items-center">+977</div>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="98XXXXXXXX" className="flex-1 border border-[#E8E5E0] px-3.5 py-2.5 rounded-r-xl outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/15 text-[14px] font-medium placeholder-[#B0ADA8] transition-all" />
            </div>
            {err && (
              <div className="text-[#C73E33] text-[12px] mt-2 flex items-start gap-2 bg-[#FFF5F5] p-2.5 rounded-lg border border-[#FED7D7]">
                <ShieldAlert size={14} className="shrink-0 mt-0.5" /> <span>{err}</span>
              </div>
            )}
          </div>
          <button onClick={handlePhoneSubmit} disabled={!phone} className={BTN_PRIMARY}>
            {t('btn_send_code')}
          </button>
        </>
      ) : (
        <>
          <div className="mb-3 text-[12px] text-[#6B7280] font-medium">Sending to: +977 {phone}</div>
          <div className="flex gap-3 mb-3 justify-between">
            {[0, 1, 2, 3].map(i => (
              <input key={i} ref={codeRefs[i]} type="tel" inputMode="numeric" aria-label={`${t('btn_verify')} ${i + 1}`} maxLength={1} value={code[i]} onChange={e => handleCodeChange(i, e.target.value)} className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border border-[#E8E5E0] rounded-xl outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/15 transition-all" />
            ))}
          </div>
          <div className="text-[11px] text-[#9CA3AF] mb-6 bg-[#F9FAFB] p-2.5 rounded-lg text-center border border-[#E8E5E0]">{t('code_hint')}</div>
          <button onClick={onLogin} disabled={code.join('').length < 4} className={BTN_PRIMARY}>
            {t('btn_verify')}
          </button>
        </>
      )}
    </div>
  );
}

export function SetupFlow({ t, onBack, onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ name: "", district: "Kathmandu", workWanted: [], skills: [], institute: "", safetyRules: { chat: true, calls: true, time: true, photo: true, hours: true }, badge: "Beginner" });

  const toggleArray = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const chipBase = "px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer";
  const chipOn = "bg-[#FFF5F5] text-[#C73E33] border-[#FED7D7] shadow-sm";
  const chipOff = "bg-white text-[#374151] border-[#E8E5E0] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]";

  return (
    <div className="pb-4">
      {/* Header: back + step indicator */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className={BTN_BACK}>
          <ChevronLeft size={16} /> {t('back')}
        </button>
        <div className="text-[11px] text-[#6B7280] font-semibold bg-[#F3F4F6] px-2.5 py-1 rounded-full border border-[#E8E5E0]">{t('step')} {step} {t('of')} 3</div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1.5 bg-[#F3F4F6] rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-[#C73E33] rounded-full transition-all duration-300" style={{width: `${(step/3)*100}%`}}></div>
      </div>

      {/* Step heading */}
      <h2 className="text-[20px] font-semibold text-[#111827] mb-5 leading-tight">
        {step === 1 && t('setup_step1')}
        {step === 2 && t('setup_step2')}
        {step === 3 && t('setup_step3')}
      </h2>

      {/* ── Step 1: About You ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className={LABEL}>{t('full_name')}</label>
            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder={t('name_placeholder')} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>{t('district')}</label>
            <select value={profile.district} onChange={e => setProfile({...profile, district: e.target.value})} className={`${INPUT} cursor-pointer`}>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>{t('work_wanted')}</label>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map(c => (
                <button key={c} onClick={() => setProfile({...profile, workWanted: toggleArray(profile.workWanted, c)})} className={`${chipBase} ${profile.workWanted.includes(c) ? chipOn : chipOff}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => setStep(2)} disabled={!profile.name || profile.workWanted.length === 0} className={BTN_PRIMARY}>
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Your Skills ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-[#F9FAFB] border border-[#E8E5E0] p-3 rounded-xl flex gap-2.5 text-[#6B7280]">
            <ShieldCheck size={16} className="shrink-0 text-[#111827] mt-0.5" />
            <p className="text-[12px] leading-relaxed">{t('skills_note')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map(s => (
              <button key={s} onClick={() => setProfile({...profile, skills: toggleArray(profile.skills, s)})} className={`${chipBase} ${profile.skills.includes(s) ? chipOn : chipOff}`}>{s}</button>
            ))}
          </div>
          <div className="pt-3 border-t border-[#F3F4F6]">
            <label className={LABEL}>{t('institute_label')}</label>
            <input type="text" value={profile.institute} onChange={e => setProfile({...profile, institute: e.target.value})} placeholder={t('institute_placeholder')} className={INPUT} />
          </div>
          <button onClick={() => setStep(3)} disabled={profile.skills.length === 0} className={BTN_PRIMARY}>
            {t('next')}
          </button>
        </div>
      )}

      {/* ── Step 3: Safety Rules ── */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-[#F9FAFB] border border-[#E8E5E0] p-3 rounded-xl flex gap-2.5 text-[#6B7280]">
             <Shield size={16} className="shrink-0 text-[#111827] mt-0.5" />
             <p className="text-[12px] leading-relaxed">{t('safety_note')}</p>
          </div>
          
          <div className="space-y-2">
            {Object.keys(profile.safetyRules).map((rule, idx) => (
              <button key={rule} className="w-full flex items-center justify-between px-3.5 py-3 border border-[#E8E5E0] rounded-xl hover:border-[#D1D5DB] transition-colors bg-white text-left group" onClick={() => setProfile({...profile, safetyRules: {...profile.safetyRules, [rule]: !profile.safetyRules[rule]}})}>
                <span className="text-[13px] font-medium text-[#374151] pr-3 group-hover:text-[#111827] transition-colors">{t(['rule_chat', 'rule_calls', 'rule_time', 'rule_photo', 'rule_hours'][idx])}</span>
                <div className={`shrink-0 w-9 h-5 rounded-full flex items-center p-0.5 transition-colors duration-200 ${profile.safetyRules[rule] ? 'bg-[#C73E33]' : 'bg-[#D1D5DB]'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${profile.safetyRules[rule] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button onClick={() => onComplete(profile)} className={BTN_PRIMARY}>
              {t('btn_create_wp')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
