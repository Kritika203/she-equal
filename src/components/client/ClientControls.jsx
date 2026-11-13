// Form controls for the client demo.



export const CL_CARD = "bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6";

export const CL_INPUT = "w-full border border-[#EAE7E1] rounded-[14px] px-4 py-3 text-base min-h-[48px] bg-white outline-none focus:border-[#C73E33]";

export const CL_LABEL = "block text-base font-semibold text-[#1C1B1A] mb-2";

export function ClientToggle({ label, on, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="w-full flex items-center justify-between gap-4 min-h-[48px] text-left">
      <span className="text-base text-[#1C1B1A] font-medium">{label}</span>
      <span className={`shrink-0 w-12 h-7 rounded-full p-1 flex transition-colors ${on ? 'bg-[#C73E33] justify-end' : 'bg-[#F0EEE9] border border-[#EAE7E1] justify-start'}`}>
        <span className="w-5 h-5 rounded-full bg-white" />
      </span>
    </button>
  );
}
