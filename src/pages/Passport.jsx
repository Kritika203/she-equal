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
      <div className="max-w-[760px] mx-auto">
        {printDoc}
        <div className="flex flex-wrap items-center justify-between gap-x-4 mb-2">
          <button onClick={() => { setView('main'); window.scrollTo(0, 0); }} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px]"><ChevronLeft size={20} /> {t('pp_back_my')}</button>
          <button onClick={() => printDocument('passport')} className={PROOF_BTN}><Download size={20} /> {t('pdf_btn')}</button>
        </div>
        <p className="text-sm text-[#8A8580] mb-4">{t('pp_preview_note')}</p>
        <WorkSamples groups={groups} t={t} />
        <div className="bg-[#FAF0EE] text-[#AE332A] rounded-[14px] px-5 py-4 flex items-start gap-3 font-semibold mb-8"><ShieldCheck size={22} className="shrink-0 mt-0.5" /> <span>{t('pp_public_strip')}</span></div>

        <h2 className="font-semibold text-[22px] mb-4">{t('pp_work_title')}</h2>
        {confirmedList.length === 0 ? (
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-lg text-[#4A4744] mb-10">{t('pp_public_empty')}</div>
        ) : (
          <div className="space-y-4 mb-10">
            {confirmedList.map(j => (
              <div key={j.id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-6">
                <div className="font-semibold text-xl mb-1">{j.title}</div>
                <div className="text-base text-[#4A4744] mb-3">{j.clientName}</div>
                <LevelBadge level="client" t={t} />
              </div>
            ))}
          </div>
        )}

        <h2 className="font-semibold text-[22px] mb-4">{t('pp_skills_title')}</h2>
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] divide-y divide-[#EAE7E1] mb-10">
          {levels.map(({ skill, level }) => (
            <div key={skill} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-semibold text-lg">{skill}</span>
              <LevelBadge level={level} t={t} />
            </div>
          ))}
        </div>

        <div className="space-y-1 mb-10 text-base text-[#4A4744]">
          {RULE_KEYS.filter(k => rules[k]).map(k => <p key={k}><span className="font-semibold text-[#1C1B1A]">{t('pp_working_rules')}</span> {t('rule_' + k)}</p>)}
        </div>

        <h2 className="font-semibold text-[22px] mb-4">{t('pp_about')}</h2>
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#F0EEE9] border border-[#EAE7E1] flex items-center justify-center font-semibold text-xl text-[#1C1B1A] shrink-0">{initialsOf(user.name)}</div>
          <div>
            <div className="font-semibold text-xl">{user.name}</div>
            <div className="text-base text-[#4A4744]">{user.district}</div>
            {user.headline && <div className="text-base text-[#4A4744] mt-1">{user.headline}</div>}
          </div>
        </div>
        {profileHasDetails(user) && (
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 mb-8">
            <ProfileFieldsList t={t} user={user} />
          </div>
        )}
        <p className="text-sm text-[#8A8580] text-center">{t('pp_public_footer')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      {printDoc}
      {/* Section 1: header */}
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#F0EEE9] border border-[#EAE7E1] flex items-center justify-center font-semibold text-xl text-[#1C1B1A] shrink-0">{initialsOf(user.name)}</div>
          <div className="min-w-0">
            <h1 className="text-[28px] sm:text-[30px] font-semibold truncate">{user.name}</h1>
            <div className="text-base text-[#4A4744] flex flex-wrap items-center gap-x-3 gap-y-1"><span className="flex items-center gap-1.5"><MapPin size={20} /> {user.district}</span><span className="bg-[#F0EEE9] px-3 py-0.5 rounded-full text-sm font-semibold">{t('pp_beginner')}</span></div>
            {user.headline && <div className="text-base text-[#4A4744] mt-1.5">{user.headline}</div>}
          </div>
        </div>
        {!isDemoUser(user) && user.institute && <p className="text-base text-[#4A4744] mb-6">{fmt(t('pp_institute_pending'), { name: user.institute })}</p>}

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2"><span className="font-semibold text-base">{t('pp_progress')}</span><span className="font-semibold text-base">{digits(progress)}%</span></div>
          <div className="h-2 bg-[#F0EEE9] rounded-full overflow-hidden"><div className="h-full bg-[#C73E33] rounded-full transition-all" style={{ width: `${progress}%` }}></div></div>
          <p className="text-base text-[#4A4744] mt-3">{enc}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[[t('pp_stat_skills'), digits(provenCount)], [t('pp_stat_jobs'), digits(confirmedList.length)], [t('pp_stat_earned'), hideMoney ? MASK : `NPR ${fmtMoney(earned)}`]].map(([label, val]) => (
            <div key={label} className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] p-3 sm:p-4">
              <div className="font-semibold text-lg sm:text-2xl break-words">{val}</div>
              <div className="text-sm text-[#4A4744] mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <button onClick={() => setShareOpen(true)} className="flex-1 bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-5">{t('pp_share')}</button>
          <button onClick={() => { setView('public'); window.scrollTo(0, 0); }} className="flex-1 bg-white border border-[#E3E0D9] text-[#1C1B1A] py-3.5 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-5">{t('pp_see_clients')}</button>
          <button onClick={() => printDocument('passport')} className="flex-1 bg-white border border-[#E3E0D9] text-[#1C1B1A] py-3.5 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-5 inline-flex items-center justify-center gap-2"><Download size={20} /> {t('pdf_btn')}</button>
        </div>
      </div>

      {/* Section 1b: richer profile fields */}
      <ProfileDetails t={t} user={user} setUser={setUser} showToast={showToast} />

      {/* Section 2: skills */}
      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('pp_skills_title')}</h2>
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] divide-y divide-[#EAE7E1] mb-6">
          {levels.map(({ skill, level }) => (
            <div key={skill} className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2"><span className="font-semibold text-lg">{skill}</span><LevelBadge level={level} t={t} /></div>
                <p className="text-base text-[#4A4744]">{t('pp_desc_' + level)}</p>
                {level === 'demonstrated' && <p className="text-sm text-[#8A8580] mt-1">{t('pp_source')} {t('pp_src_demo')}</p>}
                {level === 'institution' && instituteOf(skill, level) && <p className="text-sm text-[#8A8580] mt-1">{t('pp_source')} {instituteOf(skill, level)}</p>}
              </div>
              <div className="sm:max-w-[220px] sm:text-right shrink-0">
                {level === 'demonstrated' && <p className="text-sm text-[#8A8580]">{t('pp_next_demo')}</p>}
                {level === 'institution' && <p className="text-sm text-[#8A8580]">{t('pp_next_inst')}</p>}
                {(level === 'client' || level === 'platform') && <p className="text-sm text-[#8A8580] flex items-center gap-2 sm:justify-end"><Check size={16} className="text-[#1C1B1A]" /> {t('pp_top')}</p>}
              </div>
            </div>
            <ProofArea skill={skill} items={Array.isArray(evidenceMap[skill]) ? evidenceMap[skill] : []} t={t} digits={digits} onAdd={addProof} onRemove={removeProof} />
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
          <h3 className="font-semibold text-xl mb-5">{t('pp_how_title')}</h3>
          <ol className="relative border-l-2 border-[#EAE7E1] ml-3 space-y-5">
            {LEVEL_ORDER.map((lv, i) => (
              <li key={lv} className="pl-6 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#C73E33]"></span>
                <div className="flex flex-wrap items-center gap-3 mb-1"><span className="text-sm font-semibold text-[#8A8580]">{digits(i + 1)}</span><LevelBadge level={lv} t={t} /></div>
                <p className="text-base text-[#4A4744]">{t('pp_desc_' + lv)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Section 4: completed work */}
      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('pp_work_title')}</h2>
        {confirmedList.length === 0 && waiting.length === 0 && (
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-center flex flex-col items-center gap-5">
            <CheckSquare size={40} className="text-[#D8D4CC]" />
            <p className="text-lg text-[#4A4744] max-w-md">{t('pp_work_empty')}</p>
            <button onClick={() => navTo('firstwork')} className="bg-[#C73E33] text-white px-8 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px]">{t('pp_find_job')}</button>
          </div>
        )}
        {waiting.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">{t('pp_applied_head')}</h3>
            <div className="space-y-4">
              {waiting.map(a => {
                const j = allJobs.find(x => x.id === a.jobId);
                if (!j) return null;
                return (
                  <div key={a.jobId} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                    <div className="font-semibold text-lg mb-1">{j.title}</div>
                    <div className="text-base text-[#4A4744] mb-1">{j.clientName}</div>
                    <div className="text-base font-semibold mb-3">NPR {hideMoney ? MASK : fmtMoney(a.npr || a.price * 133)}</div>
                    <span className="bg-[#F0EEE9] border border-[#EAE7E1] px-4 py-2 rounded-[12px] text-[#1C1B1A] font-semibold text-sm inline-flex items-center gap-2 mb-4"><CheckCircle2 size={16} /> {t('applied_status')}</span>
                    <button onClick={() => confirmJob(j.id)} className="w-full border-2 border-dashed border-[#D8D4CC] text-[#4A4744] rounded-full px-5 font-semibold text-base hover:border-[#8A8580] min-h-[48px] bg-white">{t('pp_demo_confirm')}</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {confirmedList.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">{t('pp_done_head')}</h3>
            <div className="space-y-4">
              {confirmedList.map(j => (
                <div key={j.id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                  <div className="font-semibold text-lg mb-1">{j.title}</div>
                  <div className="text-base text-[#4A4744] mb-3">{j.clientName}</div>
                  <div className="mb-3"><LevelBadge level="client" t={t} /></div>
                  <div className="text-base font-semibold">{fmt(t('pp_earned_line'), { n: hideMoney ? MASK : fmtMoney(j.budgetUSD * 133) })}</div>
                  <div className="text-sm text-[#8A8580] mt-1">{t('pp_confirmed_demo')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Evidence Vault link card */}
      <button onClick={() => navTo('vault')} className="w-full text-left bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6 hover:border-[#DDD8CE] flex items-center gap-4 min-h-[64px]">
        <Lock size={28} className="shrink-0 text-[#C73E33]" />
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-xl text-[#1C1B1A]">{t('ev_title')}</span>
          <span className="block text-base text-[#4A4744]">{fmt(t('ev_count'), { n: digits(Array.isArray(evidence) ? evidence.length : 0) })}</span>
        </span>
        <ArrowRight size={22} className="shrink-0 text-[#8A8580]" />
      </button>

      {/* SkillBridge link card */}
      <button onClick={() => navTo('skillbridge')} className="w-full text-left bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6 hover:border-[#DDD8CE] flex items-center gap-4 min-h-[64px]">
        <TrendingUp size={28} className="shrink-0 text-[#C73E33]" />
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-xl text-[#1C1B1A]">{t('sb_title')}</span>
          <span className="block text-base text-[#4A4744]">{t('sb_card_line')}</span>
        </span>
        <ArrowRight size={22} className="shrink-0 text-[#8A8580]" />
      </button>

      {/* Section 5: getting paid + safety rules */}
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
        <h2 className="font-semibold text-[22px] mb-5">{t('pp_pay_title')}</h2>
        <div className="space-y-3 mb-5">
          {[0, 1, 2, 3].map(i => {
            const on = !!(payChecklist && payChecklist[i]);
            return (
              <button key={i} onClick={() => togglePay(i)} className={`w-full flex items-start gap-3 p-4 rounded-[14px] border text-left min-h-[48px] transition-colors ${on ? 'border-[#C73E33] bg-[#FAF0EE]' : 'border-[#EAE7E1] bg-white hover:border-[#DDD8CE]'}`} role="checkbox" aria-checked={on}>
                {on ? <CheckSquare size={24} className="shrink-0 text-[#C73E33]" /> : <Square size={24} className="shrink-0 text-[#8A8580]" />}
                <span className="text-base font-medium">{t('pp_pay_' + (i + 1))}</span>
              </button>
            );
          })}
        </div>
        <Disclaimer t={t} k="disc_pay" className="mt-0" />
        <NetPayCalculator t={t} />
        <h3 className="font-semibold text-xl mb-4">{t('pp_rules_title')}</h3>
        <div className="space-y-3">
          {RULE_KEYS.map(k => <RuleToggle key={k} label={t('rule_' + k)} on={!!rules[k]} onClick={() => toggleRule(k)} />)}
        </div>
      </div>

      {/* Section 6: privacy and ease */}
      <PrivacySection t={t} settings={settings} setSettings={setSettings} onSharedEnabled={onSharedEnabled} />

      {/* Share modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1B1A]/40 flex items-center justify-center p-4" onClick={() => setShareOpen(false)}>
          <div className="bg-white rounded-[20px] border border-[#EAE7E1] p-6 sm:p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-2xl mb-3">{t('pp_share')}</h3>
            <p className="text-base text-[#4A4744] mb-5">{t('pp_share_desc')}</p>
            <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] px-4 py-3 text-base font-semibold break-all mb-5">{link}</div>
            <div className="space-y-3">
              <button onClick={copyLink} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-base rounded-full hover:bg-[#AE332A] min-h-[52px]">{t('pp_copy_link')}</button>
              <a href={`https://wa.me/?text=${encodeURIComponent('https://' + link)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 border border-[#E3E0D9] bg-white text-[#1C1B1A] font-semibold text-base rounded-full hover:bg-[#F6F4EF] min-h-[52px] flex items-center justify-center">{t('pp_whatsapp')}</a>
              <button onClick={() => setShareOpen(false)} className="w-full py-3 text-[#4A4744] font-semibold text-base rounded-full hover:bg-[#F6F4EF] min-h-[48px]">{t('pp_close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
