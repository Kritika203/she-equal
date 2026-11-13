// Navigation and header controls.

import { Bell, ChevronDown, Lock, LogOut, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';



export function LangToggle({ lang, setLang, compact = false }) {
  const opt = (code, label) => (
    <button
      key={code}
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`relative rounded-full font-medium transition-all before:content-[''] before:absolute before:-inset-y-2 before:-inset-x-0.5 ${compact ? 'px-3 py-1.5 text-sm' : 'px-6 py-2 text-[15px] min-h-[44px]'} ${lang === code ? 'bg-white text-[#1C1B1A] shadow-[0_1px_2px_rgba(28,27,26,0.08)]' : 'text-[#8A8580] hover:text-[#4A4744]'}`}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-[#F0EEE9]">
      {opt('en', compact ? 'EN' : 'English')}
      {opt('ne', compact ? 'ने' : 'नेपाली')}
    </div>
  );
}

export function PassportShieldIcon({ color = "black", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
    </svg>
  );
}

export function NavLink({ label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`min-h-[48px] flex items-center whitespace-nowrap text-base font-medium border-b-2 transition-colors ${active ? 'border-[#C73E33] text-[#AE332A]' : 'border-transparent text-[#4A4744] hover:text-[#1C1B1A]'}`}
    >
      {label}
    </button>
  );
}

export function NotificationBell({ t, priv = false }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(['nt_1', 'nt_2', 'nt_3']);
  const ref = useRef();
  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={t('nt_title')} className="relative min-h-[48px] min-w-[44px] px-2 flex items-center justify-center rounded-full hover:bg-[#F0EEE9]">
        <Bell size={24} className="text-[#4A4744]" />
        {items.length > 0 && <div className="absolute top-3 right-2 w-2.5 h-2.5 bg-[#C73E33] rounded-full ring-2 ring-[#FBFAF8]"></div>}
      </button>
      {open && (
        <div className="absolute right-[-72px] sm:right-0 mt-2 w-[min(340px,calc(100vw-32px))] bg-white border border-[#EAE7E1] rounded-[20px] shadow-[0_8px_24px_rgba(28,27,26,0.08)] overflow-hidden z-50" role="dialog" aria-label={t('nt_title')}>
          <div className="flex items-center justify-between gap-2 pl-5 pr-2 py-1 border-b border-[#EAE7E1]">
            <div>
              <div className="font-semibold text-base">{t('nt_title')}</div>
              <div className="text-[13px] text-[#6E6963]">{t('nt_demo')}</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t('pp_close')} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-[#F6F4EF]"><X size={20} /></button>
          </div>
          {priv ? (
            <p className="px-5 py-6 text-base text-[#1C1B1A]">{t('pv_notif_private')}</p>
          ) : items.length === 0 ? (
            <p className="px-5 py-6 text-base text-[#4A4744]">{t('nt_empty')}</p>
          ) : (
            <ul className="divide-y divide-[#EAE7E1] max-h-[60vh] overflow-y-auto">
              {items.map(k => (
                <li key={k} className="px-5 py-4">
                  <p className="text-base text-[#1C1B1A] mb-2">{t(k)}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-[#F0EEE9] px-3 py-1 text-[13px] font-semibold text-[#6E6963]">{t('nt_demo')}</span>
                    <button onClick={() => setItems(prev => prev.filter(x => x !== k))} className="min-h-[44px] px-3 text-base font-semibold text-[#4A4744] underline underline-offset-4">{t('nt_dismiss')}</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function UserDropdown({ user, onLogout, t, navTo, lang, setLang, showLock = false, onLock }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    const handleClick = (e) => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 bg-[#F6F4EF] border border-[#EAE7E1] rounded-full pl-1.5 pr-3 py-1.5 hover:bg-[#EDEAE4] transition-colors min-h-[48px]">
        <div className="w-8 h-8 bg-[#FAF0EE] text-[#AE332A] rounded-full flex items-center justify-center text-sm font-semibold">{initials}</div>
        <div className="text-sm text-left hidden sm:block">
          <div className="font-semibold leading-tight text-[#1C1B1A]">{user.name.split(' ')[0]}</div>
          <div className="text-[#6E6963] leading-tight text-[13px]">{user.badge || "Beginner"}</div>
        </div>
        <ChevronDown size={16} className="text-[#4A4744]" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EAE7E1] rounded-[16px] shadow-[0_8px_24px_rgba(28,27,26,0.08)] overflow-hidden z-50">
          <div className="px-5 py-4 border-b border-[#EAE7E1] sm:hidden">
            <div className="font-semibold text-[#1C1B1A] text-lg">{user.name}</div>
            <div className="text-sm text-[#8A8580]">{user.badge || "Beginner"}</div>
          </div>
          <button onClick={() => { navTo('passport'); setOpen(false); }} className="w-full text-left px-5 py-4 min-h-[48px] text-base text-[#4A4744] hover:bg-[#F6F4EF] border-b border-[#EAE7E1]">{t('nav_passport')}</button>
          <button onClick={() => { setLang(lang === 'en' ? 'ne' : 'en'); setOpen(false); }} className="w-full text-left px-5 py-4 min-h-[48px] text-base text-[#4A4744] hover:bg-[#F6F4EF] border-b border-[#EAE7E1]">Language: {lang === 'en' ? 'नेपाली' : 'English'}</button>
          {showLock && <button onClick={() => { setOpen(false); onLock(); }} className="w-full text-left px-5 py-4 min-h-[48px] text-base text-[#4A4744] hover:bg-[#F6F4EF] border-b border-[#EAE7E1] flex items-center gap-3"><Lock size={20} /> {t('pv_lock_now')}</button>}
          <button onClick={() => { onLogout(); setOpen(false); }} className="w-full text-left px-5 py-4 min-h-[48px] text-base text-[#AE332A] hover:bg-[#F6F4EF] flex items-center gap-3 font-semibold"><LogOut size={20}/> {t('nav_logout')}</button>
        </div>
      )}
    </div>
  );
}
