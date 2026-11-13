// PIN lock, quick hide and privacy settings.

import { Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PassportShieldIcon } from '../layout/Header.jsx';



const PIN_INPUT_CLASS = "w-full min-h-[48px] border border-[#EAE7E1] bg-white rounded-[14px] px-4 text-base tracking-[0.3em] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30";

const onlyDigits = (v) => String(v).replace(/\D/g, '').slice(0, 4);

export function LockScreen({ t, pin, onUnlock }) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);
  const submit = (e) => {
    e.preventDefault();
    if (value === pin) { onUnlock(); } else { setWrong(true); setValue(""); if (inputRef.current) inputRef.current.focus(); }
  };
  return (
    <div className="min-h-screen bg-[#FBFAF8] font-sans text-[#1C1B1A] flex items-center justify-center px-5 py-12">
      <form onSubmit={submit} className="w-full max-w-[360px] flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-10">
          <PassportShieldIcon color="#C73E33" size={28} />
          <span className="text-xl font-semibold tracking-tight">WorkPassport</span>
        </div>
        <label htmlFor="wp-lock-pin" className="text-lg font-semibold mb-3">{t('pv_lock_title')}</label>
        <input id="wp-lock-pin" ref={inputRef} type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={value} onChange={e => { setValue(onlyDigits(e.target.value)); setWrong(false); }} className={`${PIN_INPUT_CLASS} text-center text-2xl mb-3`} aria-invalid={wrong} aria-describedby={wrong ? 'wp-lock-err' : undefined} />
        {wrong && <p id="wp-lock-err" role="alert" className="w-full text-[#AE332A] text-base mb-3 bg-[#FAF0EE] rounded-[12px] px-4 py-3">{t('pv_lock_wrong')}</p>}
        <button type="submit" className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px] px-6 mt-2">{t('pv_lock_open')}</button>
      </form>
    </div>
  );
}

export function QuickHideScreen({ t, onReturn }) {
  return (
    <div className="min-h-screen bg-[#FBFAF8] font-sans text-[#1C1B1A] flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[340px] bg-white border border-[#EAE7E1] rounded-[20px] p-8 text-center">
        <Sun size={48} strokeWidth={1.5} className="mx-auto mb-4 text-[#8A8580]" />
        <h1 className="text-xl font-semibold mb-2">{t('pv_weather_title')}</h1>
        <p className="text-2xl font-semibold text-[#4A4744]">{t('pv_weather_now')}</p>
      </div>
      <button onClick={onReturn} className="mt-6 min-h-[44px] px-4 text-base text-[#8A8580] underline underline-offset-4 hover:text-[#4A4744]">{t('pv_weather_return')}</button>
    </div>
  );
}

export function ToggleKnob({ on }) {
  return (
    <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${on ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
  );
}

export function PrivacySection({ t, settings, setSettings, onSharedEnabled = () => {} }) {
  const [mode, setMode] = useState(null); // null | 'setup' | 'off'
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [offPin, setOffPin] = useState("");
  const [err, setErr] = useState("");

  const reset = () => { setMode(null); setP1(""); setP2(""); setOffPin(""); setErr(""); };
  const toggleShared = () => {
    if (mode) { reset(); return; }
    setErr("");
    setMode(settings.shared ? 'off' : 'setup');
  };
  const savePin = (e) => {
    e.preventDefault();
    if (p1 !== p2) { setErr(t('pv_pin_mismatch')); return; }
    if (!/^\d{4}$/.test(p1)) { setErr(t('pv_pin_digits')); return; }
    setSettings({ ...settings, shared: true, pin: p1 });
    onSharedEnabled(); // she just set the PIN, so this session stays open
    reset();
  };
  const turnOff = (e) => {
    e.preventDefault();
    if (offPin !== settings.pin) { setErr(t('pv_lock_wrong')); setOffPin(""); return; }
    setSettings({ ...settings, shared: false, pin: "" });
    reset();
  };
  const errBox = err ? <p role="alert" className="text-[#AE332A] text-base bg-[#FAF0EE] rounded-[12px] px-4 py-3">{err}</p> : null;
  const secondaryBtn = "flex-1 border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] px-5";
  const primaryBtn = "flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px] px-5";

  return (
    <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
      <h2 className="font-semibold text-[22px] mb-5">{t('pv_title')}</h2>
      <div className="space-y-3">
        {/* Shared Device Mode */}
        <div className="border border-[#EAE7E1] rounded-[14px] bg-white">
          <button type="button" onClick={toggleShared} role="switch" aria-checked={settings.shared} aria-describedby="pv-shared-desc" className="w-full flex items-center justify-between p-5 pb-3 min-h-[48px] text-left rounded-[14px]">
            <span className="text-base font-medium pr-4">{t('pv_shared_label')}</span>
            <ToggleKnob on={settings.shared} />
          </button>
          <p id="pv-shared-desc" className="px-5 pb-5 text-base text-[#4A4744]">{t('pv_shared_desc')}</p>
          {mode === 'setup' && (
            <form onSubmit={savePin} className="px-5 pb-5 space-y-4 border-t border-[#EAE7E1] pt-5">
              <div>
                <label htmlFor="pv-pin-1" className="block text-base font-semibold mb-2">{t('pv_pin_create')}</label>
                <input id="pv-pin-1" type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={p1} onChange={e => { setP1(onlyDigits(e.target.value)); setErr(""); }} className={PIN_INPUT_CLASS} />
              </div>
              <div>
                <label htmlFor="pv-pin-2" className="block text-base font-semibold mb-2">{t('pv_pin_again')}</label>
                <input id="pv-pin-2" type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={p2} onChange={e => { setP2(onlyDigits(e.target.value)); setErr(""); }} className={PIN_INPUT_CLASS} />
              </div>
              {errBox}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className={primaryBtn}>{t('save')}</button>
                <button type="button" onClick={reset} className={secondaryBtn}>{t('cancel')}</button>
              </div>
            </form>
          )}
          {mode === 'off' && (
            <form onSubmit={turnOff} className="px-5 pb-5 space-y-4 border-t border-[#EAE7E1] pt-5">
              <div>
                <label htmlFor="pv-pin-off" className="block text-base font-semibold mb-2">{t('pv_lock_title')}</label>
                <input id="pv-pin-off" type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={offPin} onChange={e => { setOffPin(onlyDigits(e.target.value)); setErr(""); }} className={PIN_INPUT_CLASS} />
              </div>
              {errBox}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className={primaryBtn}>{t('pv_pin_turnoff')}</button>
                <button type="button" onClick={reset} className={secondaryBtn}>{t('cancel')}</button>
              </div>
            </form>
          )}
        </div>

        {/* Low-Data / Simple Mode */}
        <div className="border border-[#EAE7E1] rounded-[14px] bg-white">
          <button type="button" onClick={() => setSettings({ ...settings, simple: !settings.simple })} role="switch" aria-checked={settings.simple} aria-describedby="pv-simple-desc" className="w-full flex items-center justify-between p-5 pb-3 min-h-[48px] text-left rounded-[14px]">
            <span className="text-base font-medium pr-4">{t('pv_simple_label')}</span>
            <ToggleKnob on={settings.simple} />
          </button>
          <p id="pv-simple-desc" className="px-5 pb-5 text-base text-[#4A4744]">{t('pv_simple_desc')}</p>
        </div>

        {/* Low-Data Mode (real behaviour: compact text-first job cards) */}
        <div className="border border-[#EAE7E1] rounded-[14px] bg-white">
          <button type="button" onClick={() => setSettings({ ...settings, lowdata: !settings.lowdata })} role="switch" aria-checked={!!settings.lowdata} aria-describedby="pv-lowdata-desc" className="w-full flex items-center justify-between p-5 pb-3 min-h-[48px] text-left rounded-[14px]">
            <span className="text-base font-medium pr-4">{t('ld_label')}</span>
            <ToggleKnob on={!!settings.lowdata} />
          </button>
          <p id="pv-lowdata-desc" className="px-5 pb-5 text-base text-[#4A4744]">{t('ld_desc')}</p>
        </div>
      </div>
    </div>
  );
}
