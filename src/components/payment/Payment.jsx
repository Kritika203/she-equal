// Show estimated payments and fees.

import { AlertTriangle, Wallet } from 'lucide-react';
import { useState } from 'react';
import { fmtMoney } from '../../utils/format.js';
import { Disclaimer } from '../common/Disclaimer.jsx';



const PAY_RATE = 133;

const PAY_METHODS = [
  { id: 'bank', pct: 2, flat: 15 },     // Bank transfer: 2% + $15 flat
  { id: 'payoneer', pct: 2, flat: 0 },  // Payoneer: 2% + $0
  { id: 'wise', pct: 1.5, flat: 1 },    // Wise: 1.5% + $1 flat
];

export function NetPayPreview({ usd, t }) {
  const [method, setMethod] = useState('bank');
  const m = PAY_METHODS.find(x => x.id === method);
  const amount = Number(usd) || 0;
  const gross = amount * PAY_RATE;
  const fee = (amount * m.pct / 100 + m.flat) * PAY_RATE;
  const net = gross - fee;
  const netShown = Math.round(net / 10) * 10;
  const label = id => id === 'bank' ? t('np_bank') : id === 'payoneer' ? 'Payoneer' : 'Wise';

  return (
    <div>
      <div className="bg-white border border-[#E8E5E0] rounded-xl p-3 sm:p-4">
        <h3 className="font-semibold text-[13px] text-[#111827] mb-3 flex items-center gap-2">
          <Wallet size={15} className="text-[#C73E33] shrink-0" /> {t('np_title')}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PAY_METHODS.map(x => (
            <button
              key={x.id}
              onClick={() => setMethod(x.id)}
              aria-pressed={method === x.id}
              className={`min-h-[36px] px-2.5 py-1 rounded-full border text-[12px] font-semibold transition-all ${
                method === x.id
                  ? 'border-[#C73E33] bg-[#FFF5F5] text-[#C73E33]'
                  : 'border-[#E8E5E0] bg-white text-[#374151] hover:border-[#D1D5DB]'
              }`}
            >
              {label(x.id)}
            </button>
          ))}
        </div>
        <div className="space-y-1.5 text-[13px]">
          <div className="flex justify-between gap-4">
            <span className="text-[#6B7280]">{t('np_price')}</span>
            <span className="font-semibold text-[#111827]">${fmtMoney(amount)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#6B7280]">{t('np_rupees')}</span>
            <span className="font-semibold text-[#111827]">NPR {fmtMoney(Math.round(gross))}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#6B7280]">{t('np_fees')}</span>
            <span className="font-semibold text-[#111827]">− NPR {fmtMoney(Math.round(fee))}</span>
          </div>
        </div>
        <div className="border-t border-[#F3F4F6] mt-2 pt-2">
          {net > 0 && netShown > 0 ? (
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <span className="text-[13px] font-semibold text-[#111827]">{t('np_receive')}</span>
              <span className="text-[18px] font-bold text-[#111827]">NPR {fmtMoney(netShown)}</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-[#9B2C2C] font-semibold text-[12px] bg-[#FFF5F5] border border-[#FED7D7] p-3 rounded-xl">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>{t('np_warn')}</span>
            </div>
          )}
        </div>
      </div>
      <Disclaimer t={t} k="disc_paynet" className="mt-1 text-[11px] leading-4" />
    </div>
  );
}

export function NetPayCalculator({ t }) {
  const [val, setVal] = useState('60');
  return (
    <div className="mt-4 mb-4">
      <label htmlFor="np-calc" className="block text-[13px] font-semibold text-[#111827] mb-2">{t('np_calc_label')}</label>
      <input
        id="np-calc"
        type="number"
        inputMode="decimal"
        min="0"
        value={val}
        onChange={e => setVal(e.target.value)}
        className="w-full sm:w-40 mb-3 px-3 py-2.5 border border-[#E8E5E0] rounded-xl text-[14px] font-medium bg-white outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/15"
      />
      <NetPayPreview usd={Math.max(0, parseFloat(val) || 0)} t={t} />
    </div>
  );
}
