// Edit the freelancer's profile.

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PF_LANG_OPTIONS, PF_TOOL_OPTIONS } from '../../data/demo.js';
import { profileHasDetails } from '../../utils/profile.js';
import { PROOF_BTN, PROOF_INPUT } from './Proof.jsx';



export function ProfileFieldsList({ t, user }) {
  const langs = Array.isArray(user.languages) ? user.languages : [];
  const tools = Array.isArray(user.tools) ? user.tools : [];
  const training = Array.isArray(user.training) ? user.training.filter(x => x && x.title) : [];
  const chipRow = (arr) => (
    <div className="flex flex-wrap gap-1.5">
      {arr.map(x => <span key={x} className="bg-white border border-[#E8E5E0] text-[#374151] font-medium text-[12px] px-2.5 py-1 rounded-full">{x}</span>)}
    </div>
  );
  const row = (label, content) => (
    <div key={label}>
      <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">{label}</div>
      {content}
    </div>
  );
  return (
    <div className="space-y-4">
      {user.about && <p className="text-[13px] text-[#374151] leading-[1.6]">{user.about}</p>}
      {langs.length > 0 && row(t('pf_languages'), chipRow(langs))}
      {user.availability && row(t('pf_availability'), <p className="text-[13px] text-[#374151]">{user.availability}</p>)}
      {user.rateNote && row(t('pf_rate'), <p className="text-[13px] text-[#374151]">{user.rateNote}</p>)}
      {tools.length > 0 && row(t('pf_tools'), chipRow(tools))}
      {training.length > 0 && row(t('pf_training'), (
        <div className="space-y-1">
          {training.map((tr, i) => (
            <p key={i} className="text-[13px] text-[#374151]"><span className="font-semibold">{tr.title}</span>{tr.where ? ` — ${tr.where}` : ''}{tr.year ? ` (${tr.year})` : ''}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProfileDetails({ t, user, setUser, showToast }) {
  const [editing, setEditing] = useState(false);
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [languages, setLanguages] = useState([]);
  const [availability, setAvailability] = useState('');
  const [rateNote, setRateNote] = useState('');
  const [tools, setTools] = useState([]);
  const [training, setTraining] = useState([]);
  const startEdit = () => {
    setHeadline(user.headline || '');
    setAbout(user.about || '');
    setLanguages(Array.isArray(user.languages) ? user.languages : []);
    setAvailability(user.availability || '');
    setRateNote(user.rateNote || '');
    setTools(Array.isArray(user.tools) ? user.tools : []);
    setTraining(Array.isArray(user.training) && user.training.length ? user.training.map(x => ({ title: x.title || '', where: x.where || '', year: x.year || '' })) : [{ title: '', where: '', year: '' }]);
    setEditing(true);
  };
  const save = () => {
    setUser({ ...user, headline: headline.trim(), about: about.trim(), languages, availability: availability.trim(), rateNote: rateNote.trim(), tools, training: training.filter(x => x.title.trim()).map(x => ({ title: x.title.trim(), where: x.where.trim(), year: x.year.trim() })) });
    setEditing(false);
    showToast(t('pf_saved_toast'));
  };
  const chipBtn = (label, on, toggle) => (
    <button key={label} type="button" aria-pressed={on} onClick={toggle} className={`h-9 px-3.5 rounded-full border text-[13px] font-medium transition-all ${on ? 'bg-[#FFF5F5] border-[#C73E33] text-[#C73E33]' : 'bg-white border-[#E8E5E0] text-[#374151] hover:bg-[#F9F9F7]'}`}>{label}</button>
  );
  const labelCls = "block text-[13px] font-semibold text-[#111827] mb-1.5";
  return (
    <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="font-semibold text-[17px] text-[#111827]">{t('pf_head')}</h2>
        {!editing && (
          <button onClick={startEdit} className={PROOF_BTN}>{t('pf_edit')}</button>
        )}
      </div>
      {!editing ? (
        profileHasDetails(user) ? <ProfileFieldsList t={t} user={user} /> : <p className="text-[13px] text-[#9CA3AF]">{t('pf_empty')}</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="pf-headline" className={labelCls}>{t('pf_headline')}</label>
            <input id="pf-headline" type="text" value={headline} onChange={e => setHeadline(e.target.value)} className={PROOF_INPUT} />
          </div>
          <div>
            <label htmlFor="pf-about" className={labelCls}>{t('pf_about_label')}</label>
            <textarea id="pf-about" rows={3} value={about} onChange={e => setAbout(e.target.value)} className={PROOF_INPUT + " !h-auto py-2.5"} />
          </div>
          <div>
            <div className={labelCls}>{t('pf_languages')}</div>
            <div className="flex flex-wrap gap-1.5">
              {PF_LANG_OPTIONS.map(l => chipBtn(l, languages.includes(l), () => setLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])))}
            </div>
          </div>
          <div>
            <label htmlFor="pf-avail" className={labelCls}>{t('pf_availability')}</label>
            <input id="pf-avail" type="text" value={availability} onChange={e => setAvailability(e.target.value)} className={PROOF_INPUT} />
          </div>
          <div>
            <label htmlFor="pf-rate" className={labelCls}>{t('pf_rate')}</label>
            <input id="pf-rate" type="text" value={rateNote} onChange={e => setRateNote(e.target.value)} className={PROOF_INPUT} />
          </div>
          <div>
            <div className={labelCls}>{t('pf_tools')}</div>
            <div className="flex flex-wrap gap-1.5">
              {PF_TOOL_OPTIONS.map(x => chipBtn(x, tools.includes(x), () => setTools(prev => prev.includes(x) ? prev.filter(y => y !== x) : [...prev, x])))}
            </div>
          </div>
          <div>
            <div className={labelCls}>{t('pf_training')}</div>
            <div className="space-y-2">
              {training.map((tr, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-1.5">
                  <input type="text" aria-label={t('pf_tr_title')} placeholder={t('pf_tr_title')} value={tr.title} onChange={e => setTraining(prev => prev.map((x, k) => k === i ? { ...x, title: e.target.value } : x))} className={`${PROOF_INPUT} flex-1`} />
                  <input type="text" aria-label={t('pf_tr_where')} placeholder={t('pf_tr_where')} value={tr.where} onChange={e => setTraining(prev => prev.map((x, k) => k === i ? { ...x, where: e.target.value } : x))} className={`${PROOF_INPUT} flex-1`} />
                  <input type="text" aria-label={t('pf_tr_year')} placeholder={t('pf_tr_year')} value={tr.year} onChange={e => setTraining(prev => prev.map((x, k) => k === i ? { ...x, year: e.target.value } : x))} className={`${PROOF_INPUT} sm:w-24`} />
                  {training.length > 1 && (
                    <button type="button" aria-label="Remove" onClick={() => setTraining(prev => prev.filter((_, k) => k !== i))} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E8E5E0] bg-white hover:bg-[#F9F9F7] transition-colors"><Trash2 size={14} /></button>
                  )}
                </div>
              ))}
              {training.length < 3 && (
                <button type="button" onClick={() => setTraining(prev => [...prev, { title: '', where: '', year: '' }])} className={PROOF_BTN}><Plus size={14} /> {t('cl_add_one')}</button>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={save} className="flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-[13px] hover:bg-[#AE332A] h-9 px-4 transition-colors">{t('save')}</button>
            <button onClick={() => setEditing(false)} className="flex-1 border border-[#E8E5E0] bg-white text-[#374151] rounded-full font-semibold text-[13px] hover:border-[#D1D5DB] h-9 px-4 transition-all">{t('cancel')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
