// Login and account setup screens.

import { ChevronLeft, Shield, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { ALL_CATEGORIES, ALL_SKILLS, DISTRICTS } from '../data/demo.js';



function PlaceholderSection({ t, title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-[#EAE7E1] rounded-[20px] flex items-center justify-center mb-6">
        <User size={40} className="text-[#8A8580]" />
      </div>
      <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{title}</h1>
      <p className="text-lg text-[#8A8580]">{t('proto_section')}</p>
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
      <button onClick={step === 1 ? onBack : () => setStep(1)} className="flex items-center gap-2 text-base text-[#4A4744] mb-8 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
        <ChevronLeft size={20} /> {t('back')}
      </button>
      <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">{step === 1 ? t('login_step1_title') : t('login_step2_title')}</h2>
      
      {step === 1 ? (
        <>
          <div className="mb-8">
            <label className="block text-base font-semibold mb-3">{t('phone_label')}</label>
            <div className="flex">
              <div className="bg-[#F6F4EF] border border-[#EAE7E1] border-r-0 px-4 py-4 rounded-l-[14px] text-[#4A4744] font-medium">+977</div>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="98XXXXXXXX" className="flex-1 border border-[#EAE7E1] px-4 py-4 rounded-r-[14px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-lg font-medium" />
            </div>
            {err && (
              <div className="text-[#AE332A] text-sm mt-3 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px] border border-[#FAF0EE]">
                <ShieldAlert size={20} className="shrink-0 mt-0.5" /> <span>{err}</span>
              </div>
            )}
          </div>
          <button onClick={handlePhoneSubmit} disabled={!phone} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('btn_send_code')}
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 text-[#4A4744] text-base font-medium">Sending to: +977 {phone}</div>
          <div className="flex gap-4 mb-4 justify-between">
            {[0, 1, 2, 3].map(i => (
              <input key={i} ref={codeRefs[i]} type="tel" inputMode="numeric" aria-label={`${t('btn_verify')} ${i + 1}`} maxLength={1} value={code[i]} onChange={e => handleCodeChange(i, e.target.value)} className="w-16 h-16 sm:w-20 sm:h-20 text-center text-3xl font-semibold border border-[#EAE7E1] rounded-[14px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30" />
            ))}
          </div>
          <div className="text-sm text-[#8A8580] mb-10 bg-[#F6F4EF] p-3 rounded-[12px] text-center border border-[#EAE7E1]">{t('code_hint')}</div>
          <button onClick={onLogin} disabled={code.join('').length < 4} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
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

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="flex items-center gap-2 text-base text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
          <ChevronLeft size={20} /> {t('back')}
        </button>
        <div className="text-[13px] text-[#8A8580] font-semibold bg-[#F0EEE9] px-3 py-1 rounded-full">{t('step')} {step} {t('of')} 3</div>
      </div>
      
      <div className="h-2 bg-[#EAE7E1] rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-[#C73E33] transition-all" style={{width: `${(step/3)*100}%`}}></div>
      </div>

      <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">
        {step === 1 && t('setup_step1')}
        {step === 2 && t('setup_step2')}
        {step === 3 && t('setup_step3')}
      </h2>

      {step === 1 && (
        <div className="space-y-8">
          <div>
            <label className="block text-base font-semibold mb-3">{t('full_name')}</label>
            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder={t('name_placeholder')} className="w-full border border-[#EAE7E1] px-4 py-4 rounded-[12px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-lg" />
          </div>
          <div>
            <label className="block text-base font-semibold mb-3">{t('district')}</label>
            <select value={profile.district} onChange={e => setProfile({...profile, district: e.target.value})} className="w-full border border-[#EAE7E1] px-4 py-4 rounded-[12px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 bg-white text-lg min-h-[48px]">
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold mb-3">{t('work_wanted')}</label>
            <div className="flex flex-wrap gap-3">
              {ALL_CATEGORIES.map(c => (
                <button key={c} onClick={() => setProfile({...profile, workWanted: toggleArray(profile.workWanted, c)})} className={`px-5 py-2.5 rounded-full text-base min-h-[44px] font-medium border transition-colors ${profile.workWanted.includes(c) ? 'bg-[#FAF0EE] text-[#AE332A] border-[#C73E33]' : 'bg-white text-[#4A4744] border-[#EAE7E1] hover:border-[#DDD8CE]'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <button onClick={() => setStep(2)} disabled={!profile.name || profile.workWanted.length === 0} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="bg-[#F6F4EF] border border-[#EAE7E1] p-4 rounded-[12px] flex gap-3 text-[#4A4744]">
            <ShieldCheck className="shrink-0 text-[#1C1B1A]" />
            <p className="text-sm">{t('skills_note')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ALL_SKILLS.map(s => (
              <button key={s} onClick={() => setProfile({...profile, skills: toggleArray(profile.skills, s)})} className={`px-5 py-2.5 rounded-full text-base min-h-[44px] font-medium border transition-colors ${profile.skills.includes(s) ? 'bg-[#FAF0EE] text-[#AE332A] border-[#C73E33]' : 'bg-white text-[#4A4744] border-[#EAE7E1] hover:border-[#DDD8CE]'}`}>{s}</button>
            ))}
          </div>
          <div className="pt-6 border-t border-[#EAE7E1]">
            <label className="block text-base font-semibold mb-3">{t('institute_label')}</label>
            <input type="text" value={profile.institute} onChange={e => setProfile({...profile, institute: e.target.value})} placeholder={t('institute_placeholder')} className="w-full border border-[#EAE7E1] px-4 py-4 rounded-[12px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-lg" />
          </div>
          <button onClick={() => setStep(3)} disabled={profile.skills.length === 0} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('next')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-[#F6F4EF] border border-[#EAE7E1] p-4 rounded-[12px] flex gap-3 text-[#4A4744]">
             <Shield className="shrink-0 text-[#1C1B1A]" />
             <p className="text-sm">{t('safety_note')}</p>
          </div>
          
          <div className="space-y-3">
            {Object.keys(profile.safetyRules).map((rule, idx) => (
              <button key={rule} className="w-full flex items-center justify-between p-5 border border-[#EAE7E1] rounded-[14px] hover:border-[#DDD8CE] transition-colors bg-white min-h-[48px] text-left" onClick={() => setProfile({...profile, safetyRules: {...profile.safetyRules, [rule]: !profile.safetyRules[rule]}})}>
                <span className="text-base font-medium pr-4">{t(['rule_chat', 'rule_calls', 'rule_time', 'rule_photo', 'rule_hours'][idx])}</span>
                <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${profile.safetyRules[rule] ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${profile.safetyRules[rule] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-6">
            <button onClick={() => onComplete(profile)} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
              {t('btn_create_wp')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
