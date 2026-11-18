// Navigation and header controls.

import { Bell, ChevronDown, Globe, Lock, LogOut, Menu, Shield, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';



export function LangToggle({ lang, setLang, compact = false }) {
  const opt = (code, label) => (
    <button
      key={code}
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`relative rounded-full font-medium transition-all ${
        compact ? 'px-2.5 py-1 text-[12px]' : 'px-5 py-1.5 text-[13px]'
      } ${
        lang === code
          ? 'bg-white text-[#111827] shadow-sm font-semibold'
          : 'text-[#6B7280] hover:text-[#374151]'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex items-center gap-0.5 p-0.5 rounded-full bg-[#F3F4F6] border border-[#E5E7EB]">
      {opt('en', compact ? 'EN' : 'English')}
      {opt('ne', compact ? 'ने' : 'नेपाली')}
    </div>
  );
}

export function PassportShieldIcon({ color = 'black', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
    </svg>
  );
}

export function NavLink({ label, active, onClick, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex min-h-[44px] items-center border-b-2 font-medium transition-all ${
        compact
          ? 'min-w-0 justify-center whitespace-normal px-0 py-2 text-center text-[11px] leading-tight'
          : 'whitespace-nowrap px-1.5 py-[22px] text-[13.5px]'
      } ${
        active
          ? 'border-[#C73E33] text-[#C73E33] font-semibold'
          : 'border-transparent text-[#6B7280] hover:text-[#111827] hover:border-[#E5E7EB]'
      }`}
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
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={t('nt_title')}
        className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151] border border-transparent hover:border-[#E5E7EB] transition-all"
      >
        <Bell size={17} strokeWidth={1.75} />
        {items.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#C73E33] rounded-full ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-[-80px] sm:right-0 mt-2 w-[min(360px,calc(100vw-24px))] bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden z-50"
          role="dialog"
          aria-label={t('nt_title')}
        >
          <div className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-[#F3F4F6]">
            <div>
              <div className="font-semibold text-[14px] text-[#111827]">{t('nt_title')}</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5">{t('nt_demo')}</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t('pp_close')}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151]"
            >
              <X size={16} />
            </button>
          </div>
          {priv ? (
            <p className="px-5 py-5 text-[13px] text-[#374151]">{t('pv_notif_private')}</p>
          ) : items.length === 0 ? (
            <p className="px-5 py-5 text-[13px] text-[#9CA3AF]">{t('nt_empty')}</p>
          ) : (
            <ul className="divide-y divide-[#F3F4F6] max-h-[60vh] overflow-y-auto">
              {items.map(k => (
                <li key={k} className="px-5 py-4">
                  <p className="text-[13px] text-[#111827] leading-relaxed mb-2">{t(k)}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[11px] font-semibold text-[#6B7280]">
                      {t('nt_demo')}
                    </span>
                    <button
                      onClick={() => setItems(prev => prev.filter(x => x !== k))}
                      className="text-[12px] font-semibold text-[#9CA3AF] hover:text-[#374151] underline underline-offset-2"
                    >
                      {t('nt_dismiss')}
                    </button>
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
    const handleClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full pl-1 pr-2.5 py-1 hover:bg-[#F9F9F7] hover:border-[#D1D5DB] transition-all"
      >
        {/* avatar */}
        <div className="w-7 h-7 bg-[#FFF5F5] text-[#C73E33] border border-[#FED7D7] rounded-full flex items-center justify-center text-[11px] font-bold">
          {initials}
        </div>
        <div className="text-left hidden sm:block leading-tight">
          <div className="text-[12px] font-semibold text-[#111827] leading-tight">{user.name.split(' ')[0]}</div>
          <div className="text-[10px] text-[#9CA3AF] leading-tight">{user.badge || 'Beginner'}</div>
        </div>
        <ChevronDown
          size={13}
          className={`text-[#9CA3AF] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden z-50">
          {/* user info header */}
          <div className="px-4 py-3.5 border-b border-[#F3F4F6]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#FFF5F5] text-[#C73E33] border border-[#FED7D7] rounded-full flex items-center justify-center text-[13px] font-bold shrink-0">
                {initials}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#111827] leading-tight">{user.name}</div>
                <div className="text-[11px] text-[#9CA3AF] leading-tight mt-0.5">{user.badge || 'Beginner'}</div>
              </div>
            </div>
          </div>

          {/* menu items */}
          <div className="py-1.5">
            <button
              onClick={() => { navTo('passport'); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F9F9F7] transition-colors"
            >
              <User size={15} className="text-[#9CA3AF] shrink-0" />
              {t('nav_passport')}
            </button>
            <button
              onClick={() => { setLang(lang === 'en' ? 'ne' : 'en'); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F9F9F7] transition-colors"
            >
              <Globe size={15} className="text-[#9CA3AF] shrink-0" />
              Language: {lang === 'en' ? 'नेपाली' : 'English'}
            </button>
            {showLock && (
              <button
                onClick={() => { setOpen(false); onLock(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F9F9F7] transition-colors"
              >
                <Lock size={15} className="text-[#9CA3AF] shrink-0" />
                {t('pv_lock_now')}
              </button>
            )}
          </div>
          <div className="border-t border-[#F3F4F6] py-1.5">
            <button
              onClick={() => { onLogout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#C73E33] font-semibold hover:bg-[#FFF5F5] transition-colors"
            >
              <LogOut size={15} className="shrink-0" />
              {t('nav_logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
