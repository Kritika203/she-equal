// Freelancer Passport screen.

import { ArrowRight, Check, CheckCircle2, CheckSquare, ChevronLeft, Download, Lock, MapPin, ShieldCheck, Square, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Disclaimer } from '../components/common/Disclaimer.jsx';
import { LevelBadge, RuleToggle } from '../components/passport/Badges.jsx';
import { ProfileDetails, ProfileFieldsList } from '../components/passport/ProfileFields.jsx';
import { PROOF_BTN, PassportPrint, ProofArea, WorkSamples } from '../components/passport/Proof.jsx';
import { NetPayCalculator } from '../components/payment/Payment.jsx';
import { PrivacySection } from '../components/privacy/Privacy.jsx';
import { MASK } from '../constants/privacy.js';
import { DEFAULT_RULES, LEVEL_ORDER, LEVEL_WEIGHT, RULE_KEYS } from '../constants/skills.js';
import { DEMO_INSTITUTE } from '../data/demo.js';
import { DUMMY_JOBS } from '../data/jobs.js';
import { EVIDENCE_KEY, MAX_PROOF, evidenceGroups } from '../services/evidence.js';
import { printDocument } from '../services/print.js';
import { fmt, fmtMoney, initialsOf, slugify } from '../utils/format.js';
import { getLevel, isDemoUser, profileHasDetails } from '../utils/profile.js';



export function PassportPage({ allJobs = DUMMY_JOBS, t, lang, user, setUser, navTo, showToast, skillLevels, setSkillLevels, confirmedJobs, setConfirmedJobs, payChecklist, setPayChecklist, appliedJobs, skillEvidence = {}, setSkillEvidence = () => {}, hideMoney = false, settings, setSettings, onSharedEnabled = () => {}, evidence = [] }) {
  const [view, setView] = useState('main'); // main | public
  const [shareOpen, setShareOpen] = useState(false);

  const skills = user.skills || [];
  const levels = skills.map(sk => ({ skill: sk, level: getLevel(user, skillLevels, sk) }));
  const progress = levels.length ? Math.round(levels.reduce((a, l) => a + LEVEL_WEIGHT[l.level], 0) / levels.length) : 0;
  const provenCount = levels.filter(l => l.level !== 'self').length;
  const confirmedList = confirmedJobs.map(id => allJobs.find(j => j.id === id)).filter(Boolean);
  const earned = confirmedList.reduce((a, j) => a + j.budgetUSD * 133, 0);
  const waiting = [];
  appliedJobs.forEach(a => { if (!confirmedJobs.includes(a.jobId) && !waiting.some(w => w.jobId === a.jobId)) waiting.push(a); });
  const rules = user.safetyRules || DEFAULT_RULES;
  const enc = progress <= 25 ? t('pp_enc1') : progress <= 60 ? t('pp_enc2') : t('pp_enc3');
  const link = `workpassport.app/p/${slugify(user.name)}`;
  const digits = (n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const evidenceMap = skillEvidence && typeof skillEvidence === 'object' ? skillEvidence : {};
  const groups = evidenceGroups(skills, evidenceMap);
  const addProof = (skill, item) => {
    const cur = Array.isArray(evidenceMap[skill]) ? evidenceMap[skill] : [];
    if (cur.length >= MAX_PROOF) return 'max';
    const next = { ...evidenceMap, [skill]: [...cur, { id: 'ev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7), date: new Date().toISOString(), ...item }] };
    try { window.localStorage.setItem(EVIDENCE_KEY, JSON.stringify(next)); } catch (e) { return 'full'; } // storage full: keep the app working, save nothing
    setSkillEvidence(next);
    showToast(t('sf_saved_toast'));
    return 'ok';
  };
  const removeProof = (skill, id) => {
    const next = { ...evidenceMap, [skill]: (evidenceMap[skill] || []).filter(x => x.id !== id) };
    setSkillEvidence(next);
    showToast(t('sf_deleted'));
  };
  const printDoc = <PassportPrint t={t} lang={lang} user={user} levels={levels} evidenceMap={evidenceMap} confirmedList={confirmedList} provenCount={provenCount} earned={earned} hideMoney={hideMoney} digits={digits} />;
  const instituteOf = (skill, level) => level === 'institution' ? (isDemoUser(user) ? DEMO_INSTITUTE : (user.institute || '')) : '';

  const confirmJob = (id) => {
    setConfirmedJobs(prev => prev.includes(id) ? prev : [...prev, id]);
    showToast(t('pp_confirm_toast'));
  };
  const togglePay = (i) => setPayChecklist(prev => { const a = [...(Array.isArray(prev) && prev.length === 4 ? prev : [false, false, false, false])]; a[i] = !a[i]; return a; });
  const toggleRule = (k) => setUser({ ...user, safetyRules: { ...rules, [k]: !rules[k] } });
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(link); } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = link; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('pp_link_copied'));
  };

  if (view === 'public') {
    return (
      <div className="max-w-[680px] mx-auto">
        {printDoc}
        <div className="flex flex-wrap items-center justify-between gap-x-3 mb-2">
          <button onClick={() => { setView('main'); window.scrollTo(0, 0); }} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] h-9 transition-colors"><ChevronLeft size={16} /> {t('pp_back_my')}</button>
          <button onClick={() => printDocument('passport')} className={PROOF_BTN}><Download size={15} /> {t('pdf_btn')}</button>
        </div>
        <p className="text-[12px] text-[#9CA3AF] mb-3">{t('pp_preview_note')}</p>
        <WorkSamples groups={groups} t={t} />
        <div className="bg-[#FFF5F5] text-[#C73E33] rounded-xl px-4 py-3 flex items-start gap-2 font-semibold text-[13px] mb-6"><ShieldCheck size={16} className="shrink-0 mt-0.5" /> <span>{t('pp_public_strip')}</span></div>

        <h2 className="font-semibold text-[17px] mb-3 text-[#111827]">{t('pp_work_title')}</h2>
        {confirmedList.length === 0 ? (
          <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 text-[13px] text-[#9CA3AF] mb-8">{t('pp_public_empty')}</div>
        ) : (
          <div className="space-y-3 mb-8">
            {confirmedList.map(j => (
              <div key={j.id} className="bg-white border border-[#E8E5E0] rounded-xl p-4">
                <div className="font-semibold text-[15px] text-[#111827] mb-0.5">{j.title}</div>
                <div className="text-[13px] text-[#6B7280] mb-2">{j.clientName}</div>
                <LevelBadge level="client" t={t} />
              </div>
            ))}
          </div>
        )}

        <h2 className="font-semibold text-[17px] mb-3 text-[#111827]">{t('pp_skills_title')}</h2>
        <div className="bg-white border border-[#E8E5E0] rounded-xl divide-y divide-[#F3F4F6] mb-8">
          {levels.map(({ skill, level }) => (
            <div key={skill} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span className="font-semibold text-[14px] text-[#111827]">{skill}</span>
              <LevelBadge level={level} t={t} />
            </div>
          ))}
        </div>

        <div className="space-y-1 mb-8 text-[13px] text-[#374151]">
          {RULE_KEYS.filter(k => rules[k]).map(k => <p key={k}><span className="font-semibold text-[#111827]">{t('pp_working_rules')}</span> {t('rule_' + k)}</p>)}
        </div>

        <h2 className="font-semibold text-[17px] mb-3 text-[#111827]">{t('pp_about')}</h2>
        <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-[#F3F4F6] border border-[#E8E5E0] flex items-center justify-center font-semibold text-[14px] text-[#111827] shrink-0">{initialsOf(user.name)}</div>
          <div>
            <div className="font-semibold text-[15px] text-[#111827]">{user.name}</div>
            <div className="text-[13px] text-[#6B7280]">{user.district}</div>
            {user.headline && <div className="text-[13px] text-[#6B7280] mt-0.5">{user.headline}</div>}
          </div>
        </div>
        {profileHasDetails(user) && (
          <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 mb-6">
            <ProfileFieldsList t={t} user={user} />
          </div>
        )}
        <p className="text-[11px] text-[#9CA3AF] text-center">{t('pp_public_footer')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[780px] mx-auto space-y-5">
      {printDoc}
      {/* Section 1: header */}
      <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-1 w-12 h-12 rounded-full bg-[#F3F4F6] border border-[#E8E5E0] flex items-center justify-center font-semibold text-[16px] text-[#111827] shrink-0">{initialsOf(user.name)}</div>
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-[24px] font-semibold truncate text-[#111827]">{user.name}</h1>
            <div className="text-[13px] text-[#6B7280] flex flex-wrap items-center gap-x-2.5 gap-y-0.5"><span className="flex items-center gap-1"><MapPin size={14} /> {user.district}</span><span className="bg-[#F3F4F6] px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#6B7280]">{t('pp_beginner')}</span></div>
            {user.headline && <div className="text-[13px] text-[#6B7280] mt-1">{user.headline}</div>}
          </div>
        </div>
        {!isDemoUser(user) && user.institute && <p className="text-[13px] text-[#6B7280] mb-4">{fmt(t('pp_institute_pending'), { name: user.institute })}</p>}

        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1.5"><span className="font-semibold text-[13px] text-[#111827]">{t('pp_progress')}</span><span className="font-semibold text-[13px] text-[#111827]">{digits(progress)}%</span></div>
          <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden"><div className="h-full bg-[#C73E33] rounded-full transition-all" style={{ width: `${progress}%` }}></div></div>
          <p className="text-[12px] text-[#9CA3AF] mt-1.5">{enc}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[[t('pp_stat_skills'), digits(provenCount)], [t('pp_stat_jobs'), digits(confirmedList.length)], [t('pp_stat_earned'), hideMoney ? MASK : `NPR ${fmtMoney(earned)}`]].map(([label, val]) => (
            <div key={label} className="bg-[#F9F9F7] border border-[#E8E5E0] rounded-xl p-2.5 sm:p-3">
              <div className="font-semibold text-[16px] sm:text-[18px] text-[#111827] break-words">{val}</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          <button onClick={() => setShareOpen(true)} className="flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-[13px] hover:bg-[#AE332A] h-9 px-4 transition-colors">{t('pp_share')}</button>
          <button onClick={() => { setView('public'); window.scrollTo(0, 0); }} className="flex-1 bg-white border border-[#E8E5E0] text-[#374151] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 px-4 transition-all">{t('pp_see_clients')}</button>
          <button onClick={() => printDocument('passport')} className="flex-1 bg-white border border-[#E8E5E0] text-[#374151] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] h-9 px-4 inline-flex items-center justify-center gap-1.5 transition-all"><Download size={15} /> {t('pdf_btn')}</button>
        </div>
      </div>

      {/* Section 1b: richer profile fields */}
      <ProfileDetails t={t} user={user} setUser={setUser} showToast={showToast} />

      {/* Section 2: skills */}
      <div>
        <h2 className="font-semibold text-[17px] mb-3 text-[#111827]">{t('pp_skills_title')}</h2>
        <div className="bg-white border border-[#E8E5E0] rounded-xl divide-y divide-[#F3F4F6] mb-4">
          {levels.map(({ skill, level }) => (
            <div key={skill} className="p-3.5 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1"><span className="font-semibold text-[14px] text-[#111827]">{skill}</span><LevelBadge level={level} t={t} /></div>
                <p className="text-[13px] text-[#6B7280]">{t('pp_desc_' + level)}</p>
                {level === 'demonstrated' && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{t('pp_source')} {t('pp_src_demo')}</p>}
                {level === 'institution' && instituteOf(skill, level) && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{t('pp_source')} {instituteOf(skill, level)}</p>}
              </div>
              <div className="sm:max-w-[200px] sm:text-right shrink-0">
                {level === 'demonstrated' && <p className="text-[12px] text-[#9CA3AF]">{t('pp_next_demo')}</p>}
                {level === 'institution' && <p className="text-[12px] text-[#9CA3AF]">{t('pp_next_inst')}</p>}
                {(level === 'client' || level === 'platform') && <p className="text-[12px] text-[#9CA3AF] flex items-center gap-1.5 sm:justify-end"><Check size={13} className="text-[#111827]" /> {t('pp_top')}</p>}
              </div>
            </div>
            <ProofArea skill={skill} items={Array.isArray(evidenceMap[skill]) ? evidenceMap[skill] : []} t={t} digits={digits} onAdd={addProof} onRemove={removeProof} />
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold text-[15px] text-[#111827] mb-4">{t('pp_how_title')}</h3>
          <ol className="relative border-l-2 border-[#E8E5E0] ml-2.5 space-y-4">
            {LEVEL_ORDER.map((lv, i) => (
              <li key={lv} className="pl-5 relative">
                <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#C73E33]"></span>
                <div className="flex flex-wrap items-center gap-2 mb-0.5"><span className="text-[11px] font-semibold text-[#9CA3AF]">{digits(i + 1)}</span><LevelBadge level={lv} t={t} /></div>
                <p className="text-[13px] text-[#6B7280]">{t('pp_desc_' + lv)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Section 4: completed work */}
      <div>
        <h2 className="font-semibold text-[17px] mb-3 text-[#111827]">{t('pp_work_title')}</h2>
        {confirmedList.length === 0 && waiting.length === 0 && (
          <div className="bg-white border border-[#E8E5E0] rounded-xl p-5 text-center flex flex-col items-center gap-3">
            <CheckSquare size={28} className="text-[#D1D5DB]" />
            <p className="text-[13px] text-[#9CA3AF] max-w-sm">{t('pp_work_empty')}</p>
            <button onClick={() => navTo('firstwork')} className="bg-[#C73E33] text-white px-5 rounded-full font-semibold text-[13px] hover:bg-[#AE332A] h-9 transition-colors">{t('pp_find_job')}</button>
          </div>
        )}
        {waiting.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-[14px] text-[#111827] mb-2">{t('pp_applied_head')}</h3>
            <div className="space-y-3">
              {waiting.map(a => {
                const j = allJobs.find(x => x.id === a.jobId);
                if (!j) return null;
                return (
                  <div key={a.jobId} className="bg-white border border-[#E8E5E0] rounded-xl p-3.5 sm:p-4">
                    <div className="font-semibold text-[14px] text-[#111827] mb-0.5">{j.title}</div>
                    <div className="text-[13px] text-[#6B7280] mb-0.5">{j.clientName}</div>
                    <div className="text-[13px] font-semibold text-[#111827] mb-2">NPR {hideMoney ? MASK : fmtMoney(a.npr || a.price * 133)}</div>
                    <span className="bg-[#F3F4F6] border border-[#E8E5E0] px-3 py-1 rounded-full text-[#374151] font-semibold text-[12px] inline-flex items-center gap-1.5 mb-3"><CheckCircle2 size={13} /> {t('applied_status')}</span>
                    <button onClick={() => confirmJob(j.id)} className="w-full border-2 border-dashed border-[#D1D5DB] text-[#6B7280] rounded-full px-4 font-semibold text-[13px] hover:border-[#9CA3AF] h-9 bg-white transition-colors">{t('pp_demo_confirm')}</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {confirmedList.length > 0 && (
          <div>
            <h3 className="font-semibold text-[14px] text-[#111827] mb-2">{t('pp_done_head')}</h3>
            <div className="space-y-3">
              {confirmedList.map(j => (
                <div key={j.id} className="bg-white border border-[#E8E5E0] rounded-xl p-3.5 sm:p-4">
                  <div className="font-semibold text-[14px] text-[#111827] mb-0.5">{j.title}</div>
                  <div className="text-[13px] text-[#6B7280] mb-2">{j.clientName}</div>
                  <div className="mb-2"><LevelBadge level="client" t={t} /></div>
                  <div className="text-[13px] font-semibold text-[#111827]">{fmt(t('pp_earned_line'), { n: hideMoney ? MASK : fmtMoney(j.budgetUSD * 133) })}</div>
                  <div className="text-[11px] text-[#9CA3AF] mt-0.5">{t('pp_confirmed_demo')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Evidence Vault link card */}
      <button onClick={() => navTo('vault')} className="w-full text-left bg-white border border-[#E8E5E0] rounded-xl p-3.5 sm:p-4 hover:border-[#D1D5DB] flex items-center gap-3 transition-all">
        <Lock size={22} className="shrink-0 text-[#C73E33]" />
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-[15px] text-[#111827]">{t('ev_title')}</span>
          <span className="block text-[12px] text-[#9CA3AF]">{fmt(t('ev_count'), { n: digits(Array.isArray(evidence) ? evidence.length : 0) })}</span>
        </span>
        <ArrowRight size={16} className="shrink-0 text-[#9CA3AF]" />
      </button>

      {/* SkillBridge link card */}
      <button onClick={() => navTo('skillbridge')} className="w-full text-left bg-white border border-[#E8E5E0] rounded-xl p-3.5 sm:p-4 hover:border-[#D1D5DB] flex items-center gap-3 transition-all">
        <TrendingUp size={22} className="shrink-0 text-[#C73E33]" />
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-[15px] text-[#111827]">{t('sb_title')}</span>
          <span className="block text-[12px] text-[#9CA3AF]">{t('sb_card_line')}</span>
        </span>
        <ArrowRight size={16} className="shrink-0 text-[#9CA3AF]" />
      </button>

      {/* Section 5: getting paid + safety rules */}
      <div className="bg-white border border-[#E8E5E0] rounded-xl p-4 sm:p-5">
        <h2 className="font-semibold text-[17px] text-[#111827] mb-3">{t('pp_pay_title')}</h2>
        <div className="space-y-1.5 mb-3">
          {[0, 1, 2, 3].map(i => {
            const on = !!(payChecklist && payChecklist[i]);
            return (
              <button key={i} onClick={() => togglePay(i)} className={`w-full min-h-[44px] flex items-center gap-2 p-2 rounded-xl border text-left transition-colors ${on ? 'border-[#C73E33] bg-[#FFF5F5]' : 'border-[#E8E5E0] bg-white hover:border-[#D1D5DB]'}`} role="checkbox" aria-checked={on}>
                {on ? <CheckSquare size={16} className="shrink-0 text-[#C73E33]" /> : <Square size={16} className="shrink-0 text-[#9CA3AF]" />}
                <span className="text-[13px] font-medium text-[#374151]">{t('pp_pay_' + (i + 1))}</span>
              </button>
            );
          })}
        </div>
        <Disclaimer t={t} k="disc_pay" className="mt-0 text-[12px] leading-4" />
        <NetPayCalculator t={t} />
        <h3 className="font-semibold text-[15px] text-[#111827] mb-2">{t('pp_rules_title')}</h3>
        <div className="space-y-1.5">
          {RULE_KEYS.map(k => <RuleToggle key={k} label={t('rule_' + k)} on={!!rules[k]} onClick={() => toggleRule(k)} />)}
        </div>
      </div>

      {/* Section 6: privacy and ease */}
      <PrivacySection t={t} settings={settings} setSettings={setSettings} onSharedEnabled={onSharedEnabled} />

      {/* Share modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShareOpen(false)}>
          <div className="bg-white rounded-xl border border-[#E8E5E0] p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-[18px] text-[#111827] mb-2">{t('pp_share')}</h3>
            <p className="text-[13px] text-[#6B7280] mb-4">{t('pp_share_desc')}</p>
            <div className="bg-[#F9F9F7] border border-[#E8E5E0] rounded-lg px-3 py-2 text-[13px] font-semibold text-[#111827] break-all mb-4">{link}</div>
            <div className="space-y-2">
              <button onClick={copyLink} className="w-full bg-[#C73E33] text-white font-semibold text-[13px] rounded-full hover:bg-[#AE332A] h-9 transition-colors">{t('pp_copy_link')}</button>
              <a href={`https://wa.me/?text=${encodeURIComponent('https://' + link)}`} target="_blank" rel="noopener noreferrer" className="w-full border border-[#E8E5E0] bg-white text-[#374151] font-semibold text-[13px] rounded-full hover:bg-[#F9F9F7] h-9 flex items-center justify-center transition-all">{t('pp_whatsapp')}</a>
              <button onClick={() => setShareOpen(false)} className="w-full text-[#6B7280] font-semibold text-[13px] rounded-full hover:bg-[#F9F9F7] h-8 transition-colors">{t('pp_close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
