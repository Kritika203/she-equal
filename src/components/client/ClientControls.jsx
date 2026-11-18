// Form controls shared by client and freelancer pages.

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';


export const CL_CARD = "bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6";

export const CL_INPUT = "w-full border border-[#EAE7E1] rounded-[14px] px-4 py-3 text-base min-h-[48px] bg-white outline-none focus:border-[#C73E33]";

export const CL_LABEL = "block text-base font-semibold text-[#1C1B1A] mb-2";

export const CL_COMPACT_CARD = "bg-white border border-[#E8E5E0] rounded-2xl p-4 sm:p-5";

export const CL_COMPACT_INPUT = "w-full min-h-[44px] rounded-[10px] border border-[#E3E0D9] bg-white px-3 py-2 text-base text-[#1C1B1A] outline-none focus:border-[#C73E33]";

export const CL_COMPACT_LABEL = "mb-1.5 block text-[14px] font-medium text-[#373330]";

export function CompactSelect({ id, labelId, value, onChange, options, compact = false, align = 'start' }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const selectedIndex = options.findIndex(option => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = event => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const chooseOption = index => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        const selected = selectedIndex >= 0 ? selectedIndex : 0;
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex(Math.min(Math.max(selected + direction, 0), options.length - 1));
        setOpen(true);
      } else {
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex(index => (index + direction + options.length) % options.length);
      }
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) chooseOption(activeIndex);
      else openMenu();
    }
  };

  return (
    <div ref={rootRef} className={`relative ${compact ? 'w-auto' : 'w-full'}`} onBlur={event => {
      if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        aria-valuetext={selectedOption?.label}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => open ? setOpen(false) : openMenu()}
        onKeyDown={handleKeyDown}
        className={`flex items-center justify-between border text-left text-[#1C1B1A] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#C73E33]/20 ${compact ? 'min-h-[34px] min-w-[176px] gap-2 rounded-lg px-1.5 py-1 text-[12px] font-semibold' : 'min-h-[44px] w-full gap-3 rounded-[10px] px-3 py-2 text-base'} ${open ? 'border-[#C73E33] bg-white' : compact ? 'border-transparent bg-transparent hover:bg-white/70' : 'border-[#E3E0D9] bg-white hover:border-[#D1CCC5]'}`}
      >
        <span className="min-w-0 flex-1 truncate">{selectedOption?.label ?? value}</span>
        <ChevronDown size={compact ? 14 : 16} className={`shrink-0 text-[#6B7280] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          aria-labelledby={labelId}
          className={`absolute top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-[#E8E5E0] bg-white p-1 shadow-[0_8px_24px_rgba(17,24,39,0.12)] ${align === 'end' ? 'right-0 min-w-[208px]' : 'left-0 w-full'}`}
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;
            return (
              <div
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={selected}
                onMouseDown={event => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => chooseOption(index)}
                className={`flex min-h-[36px] cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-[14px] transition-colors ${selected ? 'bg-[#FFF5F5] font-medium text-[#AE332A]' : active ? 'bg-[#F9F9F7] text-[#1C1B1A]' : 'text-[#374151] hover:bg-[#F9F9F7]'}`}
              >
                <span>{option.label}</span>
                {selected && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C73E33]" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ClientToggle({ label, on, onChange, compact = false }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={`flex w-full items-center justify-between gap-4 text-left ${compact ? 'min-h-[40px]' : 'min-h-[48px]'}`}>
      <span className={`${compact ? 'text-[14px]' : 'text-base'} font-medium text-[#1C1B1A]`}>{label}</span>
      <span className={`flex shrink-0 rounded-full p-1 transition-colors ${compact ? 'h-6 w-10' : 'h-7 w-12'} ${on ? 'bg-[#C73E33] justify-end' : 'bg-[#F0EEE9] border border-[#EAE7E1] justify-start'}`}>
        <span className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} rounded-full bg-white`} />
      </span>
    </button>
  );
}
