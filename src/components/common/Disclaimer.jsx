// Small note shown below guidance.

import { Info } from 'lucide-react';



export function Disclaimer({ t, k, className = "" }) {
  return (
    <p className={`flex items-start gap-1.5 text-[13px] leading-[1.5] text-[#8A8580] ${className}`}>
      <Info size={14} className="mt-[3px] shrink-0" />
      <span>{t(k)}</span>
    </p>
  );
}
