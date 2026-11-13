// Toast messages and report form.

import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';



const REPORT_REASONS = [
  { id: 'scam', key: 'ca_r_scam' },
  { id: 'harassment', key: 'ca_r_harassment' },
  { id: 'photos', key: 'ca_r_photos' },
  { id: 'other', key: 'ca_r_other' },
];

export function ReportClientModal({ t, initial, onSend, onClose }) {
  const [reason, setReason] = useState(initial || null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="fixed inset-0 z-[60] bg-[#1C1B1A]/40 flex items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="ca-report-title" className="bg-white rounded-[20px] border border-[#EAE7E1] p-6 w-full max-w-[420px] max-h-[90vh] overflow-y-auto">
        <h2 id="ca-report-title" className="font-semibold text-2xl mb-5">{t('ca_report_title')}</h2>
        <div role="radiogroup" aria-labelledby="ca-report-title" className="space-y-3 mb-6">
          {REPORT_REASONS.map(r => (
            <label key={r.id} className={`flex items-center gap-3 p-4 rounded-[14px] border cursor-pointer min-h-[52px] text-base font-medium ${reason === r.id ? 'border-[#C73E33] bg-[#FAF0EE]' : 'border-[#EAE7E1] bg-white hover:border-[#DDD8CE]'}`}>
              <input type="radio" name="ca-report-reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} className="accent-[#C73E33] w-5 h-5 shrink-0" />
              <span>{t(r.key)}</span>
            </label>
          ))}
        </div>
        <div className="space-y-3">
          <button onClick={() => onSend(reason)} disabled={!reason} className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px] px-6">{t('ca_send_report')}</button>
          <button onClick={onClose} className="w-full border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[48px] px-6">{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ msg }) {
  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-32px)] bg-[#1C1B1A] text-white px-6 py-3.5 rounded-full text-base font-medium z-50 flex items-center gap-3">
      <CheckCircle2 size={20} className="text-white shrink-0" />
      <span>{msg}</span>
    </div>
  );
}
