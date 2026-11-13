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
    <div className="flex flex-wrap gap-2">
      {arr.map(x => <span key={x} className="bg-white border border-[#EAE7E1] text-[#4A4744] font-medium text-sm px-3 py-1.5 rounded-full">{x}</span>)}
    </div>
  );
  const row = (label, content) => (
    <div key={label}>
      <div className="text-sm font-semibold text-[#8A8580] mb-1.5">{label}</div>
      {content}
    </div>
  );
  return (
    <div className="space-y-5">
      {user.about && <p className="text-base text-[#4A4744] leading-[1.6]">{user.about}</p>}
      {langs.length > 0 && row(t('pf_languages'), chipRow(langs))}
      {user.availability && row(t('pf_availability'), <p className="text-base">{user.availability}</p>)}
      {user.rateNote && row(t('pf_rate'), <p className="text-base">{user.rateNote}</p>)}
      {tools.length > 0 && row(t('pf_tools'), chipRow(tools))}
      {training.length > 0 && row(t('pf_training'), (
        <div className="space-y-2">
          {training.map((tr, i) => (
            <p key={i} className="text-base"><span className="font-semibold">{tr.title}</span>{tr.where ? ` — ${tr.where}` : ''}{tr.year ? ` (${tr.year})` : ''}</p>
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
    <button key={label} type="button" aria-pressed={on} onClick={toggle} className={`min-h-[44px] px-4 rounded-full border text-base font-medium ${on ? 'bg-[#FAF0EE] border-[#C73E33] text-[#AE332A]' : 'bg-white border-[#EAE7E1] text-[#4A4744] hover:bg-[#F6F4EF]'}`}>{label}</button>
  );
  const labelCls = "block text-base font-semibold text-[#1C1B1A] mb-2";
  return (
    <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-semibold text-[22px]">{t('pf_head')}</h2>
        {!editing && (
          <button onClick={startEdit} className={PROOF_BTN}>{t('pf_edit')}</button>
        )}
      </div>
      {!editing ? (
        profileHasDetails(user) ? <ProfileFieldsList t={t} user={user} /> : <p className="text-base text-[#4A4744]">{t('pf_empty')}</p>
      ) : (
        <div className="space-y-5">
          <div>
            <label htmlFor="pf-headline" className={labelCls}>{t('pf_headline')}</label>
            <input id="pf-headline" type="text" value={headline} onChange={e => setHeadline(e.target.value)} className={PROOF_INPUT} />
          </div>
          <div>
            <label htmlFor="pf-about" className={labelCls}>{t('pf_about_label')}</label>
            <textarea id="pf-about" rows={4} value={about} onChange={e => setAbout(e.target.value)} className={PROOF_INPUT} />
          </div>
          <div>
            <div className={labelCls}>{t('pf_languages')}</div>
            <div className="flex flex-wrap gap-2">
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
            <div className="flex flex-wrap gap-2">
              {PF_TOOL_OPTIONS.map(x => chipBtn(x, tools.includes(x), () => setTools(prev => prev.includes(x) ? prev.filter(y => y !== x) : [...prev, x])))}
            </div>
          </div>
          <div>
            <div className={labelCls}>{t('pf_training')}</div>
            <div className="space-y-3">
              {training.map((tr, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2">
                  <input type="text" aria-label={t('pf_tr_title')} placeholder={t('pf_tr_title')} value={tr.title} onChange={e => setTraining(prev => prev.map((x, k) => k === i ? { ...x, title: e.target.value } : x))} className={`${PROOF_INPUT} flex-1`} />
                  <input type="text" aria-label={t('pf_tr_where')} placeholder={t('pf_tr_where')} value={tr.where} onChange={e => setTraining(prev => prev.map((x, k) => k === i ? { ...x, where: e.target.value } : x))} className={`${PROOF_INPUT} flex-1`} />
                  <input type="text" aria-label={t('pf_tr_year')} placeholder={t('pf_tr_year')} value={tr.year} onChange={e => setTraining(prev => prev.map((x, k) => k === i ? { ...x, year: e.target.value } : x))} className={`${PROOF_INPUT} sm:w-28`} />
                  {training.length > 1 && (
                    <button type="button" aria-label="Remove" onClick={() => setTraining(prev => prev.filter((_, k) => k !== i))} className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full border border-[#EAE7E1] bg-white hover:bg-[#F6F4EF]"><Trash2 size={18} /></button>
                  )}
                </div>
              ))}
              {training.length < 3 && (
                <button type="button" onClick={() => setTraining(prev => [...prev, { title: '', where: '', year: '' }])} className={PROOF_BTN}><Plus size={18} /> {t('cl_add_one')}</button>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={save} className="flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px] px-5">{t('save')}</button>
            <button onClick={() => setEditing(false)} className="flex-1 border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] px-5">{t('cancel')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
