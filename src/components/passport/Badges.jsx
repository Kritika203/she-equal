// Skill badges and safety switches.

import { Check } from 'lucide-react';



export function LevelBadge({ level, t }) {
  const style = level === 'self' ? 'bg-[#F3F4F6] text-[#6B7280] border border-[#F3F4F6]'
    : level === 'demonstrated' ? 'bg-[#FFF5F5] text-[#C73E33] border border-[#FED7D7]'
    : 'bg-white text-[#111827] border border-[#111827]';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${style}`}>
      {(level === 'institution' || level === 'client' || level === 'platform') && <Check size={12} />}
      {t('pp_lvl_' + level)}
    </span>
  );
}

export function RuleToggle({ label, on, onClick }) {
  return (
    <button onClick={onClick} className="w-full min-h-[44px] flex items-center justify-between gap-3 px-3 py-2.5 border border-[#E8E5E0] rounded-xl hover:border-[#D1D5DB] transition-colors bg-white text-left" role="switch" aria-checked={on}>
      <span className="text-[13px] font-medium pr-3 text-[#374151]">{label}</span>
      <div className={`shrink-0 w-10 h-[22px] rounded-full flex items-center px-0.5 transition-colors ${on ? 'bg-[#C73E33]' : 'bg-[#D1D5DB]'}`}>
        <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${on ? 'translate-x-[18px]' : 'translate-x-0'}`}></div>
      </div>
    </button>
  );
}
