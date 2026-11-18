// App state and navigation live here.

import { Briefcase, CheckCircle2, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ChatMissing } from './components/chat/ChatMissing.jsx';
import { Disclaimer } from './components/common/Disclaimer.jsx';
import { Toast } from './components/common/Feedback.jsx';
import { LangToggle, NavLink, NotificationBell, PassportShieldIcon, UserDropdown } from './components/layout/Header.jsx';
import { LockScreen, QuickHideScreen } from './components/privacy/Privacy.jsx';
import { CLIENT_PROFILE, CLIENT_SEED_JOB, DEMO_APPLICANTS, MAYA_PROFILE } from './data/demo.js';
import { DUMMY_JOBS } from './data/jobs.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { DICT } from './i18n/translations.js';
import { ApplyWizard } from './pages/Apply.jsx';
import { BringView } from './pages/Bring.jsx';
import { BringQueue } from './pages/BringQueue.jsx';
import { ChatView } from './pages/Chat.jsx';
import { ClientView } from './pages/Client.jsx';
import { ClientAgreement } from './pages/ClientAgreement.jsx';
import { ClientApplicants } from './pages/ClientApplicants.jsx';
import { EvidenceVaultPage } from './pages/EvidenceVault.jsx';
import { ExtensionPage } from './pages/Extension.jsx';
import { FirstWorkFeed } from './pages/FirstWork.jsx';
import { InstitutionInsight } from './pages/InstitutionInsight.jsx';
import { JobDetail } from './pages/JobDetail.jsx';
import { LoginFlow, SetupFlow } from './pages/Onboarding.jsx';
import { MyOpportunities } from './pages/Opportunities.jsx';
import { PassportPage } from './pages/Passport.jsx';
import { ShieldSafetyPage } from './pages/ShieldSafety.jsx';
import { SkillBridgePage } from './pages/SkillBridge.jsx';
import { WorkroomView } from './pages/Workroom.jsx';
import { buildBringSeeds } from './services/bring.js';
import { makeEvidenceSeed } from './services/evidence.js';
import { QUIET_DEFAULT, normQuiet } from './services/quietHours.js';
import { isDemoUser } from './utils/profile.js';



export default function App() {
  const [lang, setLang] = useLocalStorage('wp_language', 'en');
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('wp_logged_in', false);
  const [userProfile, setUserProfile] = useLocalStorage('wp_user_profile', null);
  const [savedJobs, setSavedJobs] = useLocalStorage('wp_saved', []);
  const [appliedJobs, setAppliedJobs] = useLocalStorage('wp_applied', []);
  const [skillLevels, setSkillLevels] = useLocalStorage('wp_skill_levels', {});
  const [confirmedJobs, setConfirmedJobs] = useLocalStorage('wp_confirmed', []);
  const [payChecklist, setPayChecklist] = useLocalStorage('wp_pay_checklist', [false, false, false, false]);
  const [shieldHistory, setShieldHistory] = useLocalStorage('wp_shield_history', []);
  const [evidence, setEvidence] = useLocalStorage('wp_evidence', []);
  const [trustedRaw, setTrusted] = useLocalStorage('wp_trusted_contact', null);
  const trusted = trustedRaw && typeof trustedRaw === 'object' && typeof trustedRaw.name === 'string' && typeof trustedRaw.phone === 'string' && trustedRaw.name && trustedRaw.phone ? trustedRaw : null;
  const [checkinRaw, setCheckin] = useLocalStorage('wp_checkin', null);
  const checkin = checkinRaw && typeof checkinRaw === 'object' && !Array.isArray(checkinRaw) ? checkinRaw : null;
  const [quietRaw, setQuiet] = useLocalStorage('wp_quiet', QUIET_DEFAULT);
  const quiet = normQuiet(quietRaw);
  const [skillEvidenceRaw, setSkillEvidence] = useLocalStorage('wp_skill_evidence', {});
  const skillEvidence = skillEvidenceRaw && typeof skillEvidenceRaw === 'object' && !Array.isArray(skillEvidenceRaw) ? skillEvidenceRaw : {};
  const [chatsRaw, setChats] = useLocalStorage('wp_chats', {});
  const chats = chatsRaw && typeof chatsRaw === 'object' && !Array.isArray(chatsRaw) ? chatsRaw : {};
  const chatsRef = useRef(chats);
  chatsRef.current = chats;
  const updateChat = (jobId, fn) => {
    const cur = chatsRef.current || {};
    const next = { ...cur, [jobId]: fn(cur[jobId]) };
    chatsRef.current = next;
    setChats(next);
  };
  const [settingsRaw, setSettings] = useLocalStorage('wp_settings', { shared: false, pin: "", simple: false });
  const settings = { shared: !!(settingsRaw && settingsRaw.shared), pin: (settingsRaw && typeof settingsRaw.pin === 'string') ? settingsRaw.pin : "", simple: !!(settingsRaw && settingsRaw.simple), lowdata: !!(settingsRaw && settingsRaw.lowdata) };
  const [clientActionsRaw, setClientActionsRaw] = useLocalStorage('wp_client_actions', {});
  const clientActions = clientActionsRaw && typeof clientActionsRaw === 'object' && !Array.isArray(clientActionsRaw) ? clientActionsRaw : {};
  const actionsRef = useRef(clientActions);
  actionsRef.current = clientActions;
  const getClientAction = (jobId) => ({ muted: false, blocked: false, report: null, ...((actionsRef.current || {})[jobId] || {}) });
  const setClientAction = (jobId, patch) => {
    const next = { ...(actionsRef.current || {}), [jobId]: { ...getClientAction(jobId), ...patch } };
    actionsRef.current = next;
    setClientActionsRaw(next);
  };
  const [chatDraftsRaw, setChatDrafts] = useLocalStorage('wp_chat_drafts', {});
  const chatDrafts = chatDraftsRaw && typeof chatDraftsRaw === 'object' && !Array.isArray(chatDraftsRaw) ? chatDraftsRaw : {};
  const [applyDraft, setApplyDraft] = useLocalStorage('wp_apply_draft', null);
  const [workroomsRaw, setWorkrooms] = useLocalStorage('wp_workrooms', {});
  const workrooms = workroomsRaw && typeof workroomsRaw === 'object' && !Array.isArray(workroomsRaw) ? workroomsRaw : {};
  const [clientModeRaw, setClientMode] = useLocalStorage('wp_client_mode', null);
  const clientMode = clientModeRaw === 'client';
  const [clientProfileRaw, setClientProfile] = useLocalStorage('wp_client_profile', null);
  const clientProfile = clientProfileRaw && typeof clientProfileRaw === 'object' ? clientProfileRaw : null;
  const [clientJobsRaw, setClientJobs] = useLocalStorage('wp_client_jobs', []);
  const clientJobs = Array.isArray(clientJobsRaw) ? clientJobsRaw : [];
  const [curatedJobsRaw, setCuratedJobs] = useLocalStorage('wp_curated_jobs', []);
  const curatedJobs = Array.isArray(curatedJobsRaw) ? curatedJobsRaw : [];
  const [bringRaw, setBringSubmissions] = useLocalStorage('wp_bring_submissions', null);
  const bringSubmissions = Array.isArray(bringRaw) ? bringRaw : [];
  const allJobs = [...clientJobs, ...curatedJobs, ...DUMMY_JOBS];
  const approvedInsights = bringSubmissions.filter(x => x.type === 'insight' && x.status === 'approved');
  const submitBring = (sub) => setBringSubmissions([...bringSubmissions, sub]);
  const decideBring = (id, action) => {
    const sub = bringSubmissions.find(x => x.id === id);
    if (!sub || sub.status !== 'pending') return;
    if (action === 'approve' && sub.type === 'opportunity') {
      if (!curatedJobs.some(j => j.id === 'bj-' + sub.id)) {
        const job = {
          id: 'bj-' + sub.id,
          title: sub.title,
          category: sub.category,
          clientName: sub.organisation,
          clientCountry: sub.country,
          clientType: 'Partner organisation',
          paymentVerified: true,
          beginnerFriendly: !!sub.beginnerFriendly,
          description: sub.description,
          skillsRequired: sub.skillsRequired,
          budgetUSD: sub.budgetMax,
          budgetType: 'fixed',
          postedHoursAgo: 0,
          applicants: 0,
          jobsPostedByClient: 0,
          hireRate: 0,
          memberSince: 2026,
          clientRating: null,
          aboutClient: 'Brought through Bring Opportunity by ' + sub.organisation + '. Checked by the WorkPassport team before listing.',
          needsOwnLaptop: !!sub.needsOwnLaptop,
          internetNeed: sub.internetNeed,
          meetingTimeNepal: 'Flexible — no meetings',
          deadlineDays: sub.deadlineDays,
          caution: null,
          deliverables: sub.deliverables,
          clientProvides: [],
        };
        setCuratedJobs([...curatedJobs, job]);
      }
      setBringSubmissions(bringSubmissions.map(x => x.id === id ? { ...x, status: 'listed' } : x));
    } else if (action === 'approve') {
      setBringSubmissions(bringSubmissions.map(x => x.id === id ? { ...x, status: 'approved' } : x));
    } else {
      setBringSubmissions(bringSubmissions.map(x => x.id === id ? { ...x, status: 'rejected' } : x));
    }
  };
  const confirmAgreement = (jobId, applicant) => {
    setClientJobs(clientJobs.map(j => j.id === jobId ? { ...j, accepted: { applicantName: applicant.name, price: applicant.asks } } : j));
    navTo('client', { scrollTo: 'mine' });
  };
  const sharedOn = settings.shared && settings.pin.length === 4;
  const simpleOn = settings.simple;
  const [unlocked, setUnlocked] = useState(false);
  const [quickHidden, setQuickHidden] = useState(false);
  const [currentView, setCurrentView] = useState('welcome');
  const [viewParams, setViewParams] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (simpleOn) { root.style.fontSize = '112.5%'; root.classList.add('wp-simple-on'); }
    else { root.style.fontSize = ''; root.classList.remove('wp-simple-on'); }
    return () => { root.style.fontSize = ''; root.classList.remove('wp-simple-on'); };
  }, [simpleOn]);

  useEffect(() => {
    if (clientMode && currentView === 'welcome') setCurrentView('client');
    else if (isLoggedIn && currentView === 'welcome') setCurrentView('firstwork');
  }, [isLoggedIn, clientMode, currentView]);

  const clientSeededRef = useRef(false);
  useEffect(() => {
    if (!clientMode || currentView !== 'client' || clientSeededRef.current) return;
    clientSeededRef.current = true;
    if (clientJobs.length === 0) setClientJobs([CLIENT_SEED_JOB]);
  }, [clientMode, currentView, clientJobs]);

  useEffect(() => {
    if (!isLoggedIn || !isDemoUser(userProfile)) return;
    if (Object.keys(skillEvidence).length === 0) setSkillEvidence(makeEvidenceSeed());
  }, [isLoggedIn, userProfile, skillEvidenceRaw]);

  const t = (key) => DICT[lang][key] || key;

  const toastTimer = useRef(null);
  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const navTo = (view, params = {}) => {
    if (view === 'safety') { view = 'shield'; params = { ...params, scrollTo: 'safety', n: Date.now() }; }
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (currentView !== 'bring' && currentView !== 'bring-queue') return;
    try {
      if (window.localStorage.getItem('wp_bring_submissions') === null) setBringSubmissions(buildBringSeeds());
    } catch (e) { /* storage unavailable */ }
  }, [currentView]);

  const handleLogout = () => {
    setUnlocked(false);
    setQuickHidden(false);
    setIsLoggedIn(false);
    navTo('welcome');
    showToast(t('nav_logout_toast'));
  };

  const enterClientMode = () => {
    setClientProfile(CLIENT_PROFILE);
    setClientMode('client');
    navTo('client');
  };
  const exitClientToMaya = () => {
    setClientMode(null);
    setClientProfile(null);
    setUserProfile(MAYA_PROFILE);
    setIsLoggedIn(true);
    navTo('firstwork');
  };
  const clientLogout = () => {
    setClientMode(null);
    setClientProfile(null);
    setIsLoggedIn(false);
    navTo('welcome');
    showToast(t('nav_logout_toast'));
  };

  const successOverlay = currentView === 'setup_success' ? (
           <div className="fixed inset-0 bg-[#FAF9F7] z-50 flex flex-col items-center justify-center p-5 text-center">
              <div className="w-full max-w-[380px] mx-auto">
                <div className="w-14 h-14 bg-[#FFF5F5] border border-[#FED7D7] rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={28} strokeWidth={1.75} className="text-[#C73E33]" />
                </div>
                <h1 className="text-[22px] font-semibold text-[#111827] mb-2 leading-tight">{t('setup_success_title')}, {userProfile?.name?.split(' ')[0]}!</h1>
                <p className="text-[13px] text-[#6B7280] mb-8 leading-relaxed">{t('setup_success_sub')}</p>
                
                <div className="flex flex-col gap-2.5">
                  <button onClick={() => navTo('firstwork')} className="w-full h-10 bg-[#C73E33] text-white rounded-full font-semibold text-[13px] hover:bg-[#AE332A] transition-colors">
                    {t('btn_find_job')}
                  </button>
                  <button onClick={() => navTo('passport')} className="w-full h-10 bg-white text-[#374151] border border-[#E8E5E0] rounded-full font-semibold text-[13px] hover:bg-[#F9F9F7] transition-colors">
                    {t('btn_see_wp')}
                  </button>
                </div>
              </div>
           </div>
  ) : null;

  if (!isLoggedIn && !clientMode) {
    return (
      <div className={`min-h-screen bg-[#FAF9F7] font-sans text-[#111827] flex flex-col items-center justify-center px-5 py-8 ${lang === 'ne' ? 'leading-relaxed' : ''}`}>
        <div className="w-full max-w-[380px] relative">
          <div className="flex justify-center mb-8"><LangToggle lang={lang} setLang={setLang} /></div>

          {currentView === 'welcome' ? (
            <div className="flex flex-col items-center text-center">
              {/* Brand */}
              <div className="flex items-center gap-2 mb-6">
                <PassportShieldIcon />
                <span className="text-[16px] font-bold tracking-tight text-[#111827]">WorkPassport</span>
              </div>

              {/* Headline */}
              <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-[1.3] mb-3 text-[#111827]">{t('welcome_title')}</h1>
              <p className="text-[13px] text-[#6B7280] mb-8 leading-[1.7] max-w-[340px]">{t('welcome_sub')}</p>

              {/* CTA Buttons */}
              <div className="w-full flex flex-col gap-2.5 mb-5">
                <button onClick={() => navTo('setup')} className="w-full h-10 rounded-full bg-[#C73E33] text-white text-[13px] font-semibold hover:bg-[#AE332A] transition-colors flex items-center justify-center">
                  {t('btn_new')}
                </button>
                <button onClick={() => navTo('login')} className="w-full h-10 rounded-full bg-white text-[#374151] border border-[#E8E5E0] text-[13px] font-semibold hover:bg-[#F9F9F7] transition-colors flex items-center justify-center">
                  {t('btn_login')}
                </button>
              </div>

              {/* Demo link */}
              <button onClick={() => { if (userProfile && userProfile.name !== MAYA_PROFILE.name) { setSkillLevels({}); setConfirmedJobs([]); setPayChecklist([false, false, false, false]); setSkillEvidence({}); } setUserProfile(MAYA_PROFILE); setIsLoggedIn(true); navTo('firstwork'); showToast(t('welcome_toast')); }} className="text-[12px] text-[#9CA3AF] underline underline-offset-4 hover:text-[#374151] mb-8 py-2 px-4 transition-colors">
                {t('btn_demo')}
              </button>

              {/* Client demo card */}
              <div className="w-full bg-white border border-[#E8E5E0] rounded-xl p-4 text-left mb-6">
                <div className="flex items-start gap-2.5 mb-3">
                  <div className="w-8 h-8 bg-[#FFF5F5] border border-[#FED7D7] rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase size={14} className="text-[#C73E33]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] text-[#111827]">{t('cm_welcome_q')}</div>
                    <div className="text-[12px] text-[#6B7280] mt-0.5 leading-[1.5]">{t('cm_welcome_line')}</div>
                  </div>
                </div>
                <button onClick={enterClientMode} className="w-full h-9 rounded-full bg-white text-[#374151] border border-[#E8E5E0] text-[13px] font-semibold hover:bg-[#F9F9F7] transition-colors flex items-center justify-center">
                  {t('cm_enter')}
                </button>
              </div>

              {/* Privacy note */}
              <div className="flex items-start gap-2 text-[11px] leading-[1.6] text-[#9CA3AF] text-left">
                <Lock size={12} className="mt-[2px] shrink-0" />
                <span>{t('privacy_note')}</span>
              </div>
            </div>

          ) : currentView === 'login' ? (
            <LoginFlow t={t} onBack={() => navTo('welcome')} onLogin={() => { if (userProfile && userProfile.name !== MAYA_PROFILE.name) { setSkillLevels({}); setConfirmedJobs([]); setPayChecklist([false, false, false, false]); setSkillEvidence({}); } setUserProfile(MAYA_PROFILE); setIsLoggedIn(true); navTo('firstwork'); showToast(t('welcome_toast')); }} />
          ) : currentView === 'setup' ? (
            <SetupFlow t={t} onBack={() => navTo('welcome')} onComplete={(profile) => { setSkillLevels({}); setConfirmedJobs([]); setPayChecklist([false, false, false, false]); setSkillEvidence({}); setUserProfile(profile); setIsLoggedIn(true); navTo('setup_success'); }} />
          ) : null}
        </div>
        
        {successOverlay}

        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  if (quickHidden) {
    return <QuickHideScreen t={t} onReturn={() => { setUnlocked(false); setQuickHidden(false); }} />;
  }
  if (sharedOn && !unlocked) {
    return <LockScreen t={t} pin={settings.pin} onUnlock={() => setUnlocked(true)} />;
  }

  if (clientMode) {
    return (
      <div className={`wp-app min-h-screen flex flex-col bg-[#FBFAF8] font-sans text-base text-[#1C1B1A] ${lang === 'ne' ? 'leading-relaxed' : ''}`}>
        <nav className="sticky top-0 z-40 border-b border-[#E8E5E0] bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
            <button onClick={() => navTo('client')} className="flex shrink-0 items-center gap-2.5">
              <PassportShieldIcon color="#C73E33" size={26} />
              <span className="hidden text-[16px] font-bold tracking-tight text-[#111827] sm:block">WorkPassport</span>
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <LangToggle lang={lang} setLang={setLang} compact />
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE7E1] bg-[#F0EEE9] text-[13px] font-semibold" title={clientProfile ? clientProfile.name : 'Client'}>BT</div>
            </div>
          </div>
          <div className="border-t border-[#F3F4F6]">
            <div className="mx-auto grid max-w-[1100px] grid-cols-4 px-2 sm:flex sm:items-center sm:gap-1 sm:px-6">
              <button onClick={() => navTo('client')} className={`relative flex min-h-[48px] min-w-0 items-center justify-center border-b-2 px-1 text-center text-[10px] leading-tight transition-colors sm:min-h-[46px] sm:whitespace-nowrap sm:px-2 sm:text-[13px] ${['client', 'client-applicants', 'client-agreement'].includes(currentView) ? 'border-[#C73E33] font-semibold text-[#C73E33]' : 'border-transparent font-medium text-[#6B7280] hover:border-[#E5E7EB] hover:text-[#111827]'}`}>
                {t('cm_home')}
              </button>
              <button onClick={() => navTo('client', { scrollTo: 'form', n: Date.now() })} className="relative flex min-h-[48px] min-w-0 items-center justify-center border-b-2 border-transparent px-1 text-center text-[10px] font-medium leading-tight text-[#6B7280] transition-colors hover:border-[#E5E7EB] hover:text-[#111827] sm:min-h-[46px] sm:whitespace-nowrap sm:px-2 sm:text-[13px]">
                {t('cm_post')}
              </button>
              <button onClick={exitClientToMaya} className="relative flex min-h-[48px] min-w-0 items-center justify-center border-b-2 border-transparent px-1 text-center text-[10px] font-medium leading-tight text-[#6B7280] transition-colors hover:border-[#E5E7EB] hover:text-[#111827] sm:min-h-[46px] sm:whitespace-nowrap sm:px-2 sm:text-[13px]">
                {t('cm_switch_maya')}
              </button>
              <button onClick={clientLogout} className="relative flex min-h-[48px] min-w-0 items-center justify-center border-b-2 border-transparent px-1 text-center text-[10px] font-medium leading-tight text-[#6B7280] transition-colors hover:border-[#E5E7EB] hover:text-[#111827] sm:min-h-[46px] sm:whitespace-nowrap sm:px-2 sm:text-[13px]">
                {t('nav_logout')}
              </button>
            </div>
          </div>
        </nav>

        <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 pb-16 sm:px-6 sm:py-7">
          {currentView === 'client-applicants' ? (
            <ClientApplicants t={t} lang={lang} navTo={navTo} job={clientJobs.find(j => j.id === viewParams.id)} />
          ) : currentView === 'client-agreement' ? (
            <ClientAgreement t={t} lang={lang} navTo={navTo} job={clientJobs.find(j => j.id === viewParams.id)} applicant={DEMO_APPLICANTS.find(x => x.id === viewParams.applicantId)} onConfirm={confirmAgreement} />
          ) : (
            <ClientView t={t} lang={lang} navTo={navTo} showToast={showToast} clientJobs={clientJobs} setClientJobs={setClientJobs} scrollTo={viewParams.scrollTo} clientMode clientProfile={clientProfile || CLIENT_PROFILE} />
          )}
        </main>

        <footer className="border-t border-[#EAE7E1] py-10 px-4">
          <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-3 text-center">
            <div className="max-w-2xl text-left"><Disclaimer t={t} k="disc_footer" /></div>
            <div className="text-[13px] text-[#8A8580]">{t('footer_text')}</div>
          </div>
        </footer>

        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  return (
    <div className={`wp-app ${simpleOn ? 'wp-simple' : ''} min-h-screen flex flex-col bg-[#FAF9F7] font-sans text-base text-[#111827] ${lang === 'ne' ? 'leading-relaxed' : ''}`}>
      {/* ── Navbar ── */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-[#E8E5E0] sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-4">
          {/* Logo + nav links */}
          <div className="flex items-center gap-7">
            <button onClick={() => navTo('firstwork')} className="flex items-center gap-2.5 shrink-0">
              <PassportShieldIcon color="#C73E33" size={26} />
              <span className="font-bold text-[16px] tracking-tight text-[#111827] hidden sm:block">WorkPassport</span>
            </button>
            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-2">
              <NavLink label={t('nav_firstwork')} active={['firstwork', 'job-detail', 'apply', 'opportunities', 'chat', 'workroom', 'client', 'client-applicants', 'client-agreement', 'bring', 'bring-queue', 'institution-insight'].includes(currentView)} onClick={() => navTo('firstwork')} />
              <NavLink label={t('nav_passport')} active={currentView === 'passport'} onClick={() => navTo('passport')} />
              <NavLink label={t('nav_shield_safety')} active={currentView === 'shield'} onClick={() => navTo('shield')} />
              <NavLink label={t('nav_ext')} active={currentView === 'ext'} onClick={() => navTo('ext')} />
            </div>
          </div>
          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LangToggle lang={lang} setLang={setLang} compact />
            <NotificationBell t={t} priv={sharedOn} />
            {sharedOn && (
              <button
                onClick={() => setQuickHidden(true)}
                aria-label={t('pv_quick_hide')}
                title={t('pv_quick_hide')}
                className="w-9 h-9 flex items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151] border border-transparent hover:border-[#E5E7EB] transition-all"
              >
                <EyeOff size={17} strokeWidth={1.75} />
              </button>
            )}
            <UserDropdown user={userProfile} onLogout={handleLogout} t={t} navTo={navTo} lang={lang} setLang={setLang} showLock={sharedOn} onLock={() => setUnlocked(false)} />
          </div>
        </div>
        {/* Mobile tab bar */}
        <div className="lg:hidden border-t border-[#F3F4F6]">
          <div className="grid w-full min-w-0 grid-cols-4 px-2">
            <NavLink compact label={t('nav_firstwork')} active={['firstwork', 'job-detail', 'apply', 'opportunities', 'chat', 'workroom', 'client', 'client-applicants', 'client-agreement', 'bring', 'bring-queue', 'institution-insight'].includes(currentView)} onClick={() => navTo('firstwork')} />
            <NavLink compact label={t('nav_passport')} active={currentView === 'passport'} onClick={() => navTo('passport')} />
            <NavLink compact label={t('nav_shield_safety')} active={currentView === 'shield'} onClick={() => navTo('shield')} />
            <NavLink compact label={t('nav_ext')} active={currentView === 'ext'} onClick={() => navTo('ext')} />
          </div>
        </div>
      </nav>

      {/* ── Verification banner ── */}
      {(currentView === 'firstwork' || currentView === 'opportunities') && (
        <div className="bg-white border-b border-[#E8E5E0] py-2.5 px-4 flex justify-center items-center gap-2">
          <ShieldCheck size={14} className="text-[#166534] shrink-0" />
          <span className="text-[12px] font-medium text-[#374151]">{t('fw_banner')}</span>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1">
        {currentView === 'firstwork' && <FirstWorkFeed allJobs={allJobs} t={t} navTo={navTo} user={userProfile} savedJobs={savedJobs} setSavedJobs={setSavedJobs} lang={lang} lowdata={settings.lowdata} onSwitchClient={() => { setUnlocked(false); setIsLoggedIn(false); navTo('welcome'); }} />}
        {currentView === 'job-detail' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><JobDetail t={t} navTo={navTo} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} skillLevels={skillLevels} savedJobs={savedJobs} setSavedJobs={setSavedJobs} lang={lang} showToast={showToast} hasDraft={simpleOn && !!applyDraft && applyDraft.jobId === viewParams.id} /></div>}
        {currentView === 'apply' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><ApplyWizard key={viewParams.id} t={t} navTo={navTo} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} setAppliedJobs={setAppliedJobs} lang={lang} simple={simpleOn} applyDraft={applyDraft} setApplyDraft={setApplyDraft} /></div>}
        {currentView === 'opportunities' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><MyOpportunities allJobs={allJobs} key={viewParams.tab || 'saved'} initialTab={viewParams.tab} t={t} navTo={navTo} savedJobs={savedJobs} setSavedJobs={setSavedJobs} appliedJobs={appliedJobs} confirmedJobs={confirmedJobs} hideMoney={sharedOn} draftJobId={simpleOn && applyDraft ? applyDraft.jobId : null} /></div>}
        {currentView === 'passport' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><PassportPage allJobs={allJobs} t={t} lang={lang} user={userProfile} setUser={setUserProfile} navTo={navTo} showToast={showToast} skillLevels={skillLevels} setSkillLevels={setSkillLevels} confirmedJobs={confirmedJobs} setConfirmedJobs={setConfirmedJobs} payChecklist={payChecklist} setPayChecklist={setPayChecklist} appliedJobs={appliedJobs} skillEvidence={skillEvidence} setSkillEvidence={setSkillEvidence} hideMoney={sharedOn} settings={settings} setSettings={setSettings} onSharedEnabled={() => setUnlocked(true)} evidence={evidence} /></div>}
        {currentView === 'shield' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><ShieldSafetyPage t={t} lang={lang} user={userProfile} navTo={navTo} showToast={showToast} history={shieldHistory} setHistory={setShieldHistory} evidence={evidence} setEvidence={setEvidence} scrollKey={viewParams.n} scrollTo={viewParams.scrollTo} allJobs={allJobs} appliedJobs={appliedJobs} trusted={trusted} setTrusted={setTrusted} checkin={checkin} setCheckin={setCheckin} quiet={quiet} setQuiet={setQuiet} onQuickHide={() => setQuickHidden(true)} /></div>}
        {currentView === 'ext' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><ExtensionPage t={t} lang={lang} navTo={navTo} /></div>}
        {currentView === 'skillbridge' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><SkillBridgePage allJobs={allJobs} t={t} lang={lang} user={userProfile} navTo={navTo} insights={approvedInsights} /></div>}
        {currentView === 'bring' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><BringView t={t} lang={lang} navTo={navTo} onSubmit={submitBring} /></div>}
        {currentView === 'institution-insight' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><InstitutionInsight allJobs={allJobs} t={t} lang={lang} navTo={navTo} /></div>}
        {currentView === 'bring-queue' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><BringQueue t={t} lang={lang} navTo={navTo} submissions={bringSubmissions} onDecide={decideBring} /></div>}
        {currentView === 'vault' && <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><EvidenceVaultPage t={t} lang={lang} user={userProfile} navTo={navTo} showToast={showToast} evidence={evidence} setEvidence={setEvidence} masked={sharedOn} /></div>}
        {currentView === 'chat' && (appliedJobs.some(a => a.jobId === viewParams.id) && allJobs.find(j => j.id === viewParams.id)
          ? <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4"><ChatView key={viewParams.id} t={t} lang={lang} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} navTo={navTo} showToast={showToast} chats={chats} updateChat={updateChat} setEvidence={setEvidence} workrooms={workrooms} setWorkrooms={setWorkrooms} simple={simpleOn} chatDrafts={chatDrafts} setChatDrafts={setChatDrafts} getClientAction={getClientAction} clientAction={getClientAction(viewParams.id)} setClientAction={setClientAction} quiet={quiet} /></div>
          : <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><ChatMissing t={t} navTo={navTo} /></div>)}
        {currentView === 'workroom' && (appliedJobs.some(a => a.jobId === viewParams.id) && allJobs.find(j => j.id === viewParams.id)
          ? <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><WorkroomView key={viewParams.id} t={t} lang={lang} job={allJobs.find(j => j.id === viewParams.id)} navTo={navTo} showToast={showToast} workrooms={workrooms} setWorkrooms={setWorkrooms} confirmedJobs={confirmedJobs} setConfirmedJobs={setConfirmedJobs} hideMoney={sharedOn} /></div>
          : <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"><ChatMissing t={t} navTo={navTo} /></div>)}
      </main>

      {/* ── Footer ── */}
      <footer className={`border-t border-[#E8E5E0] bg-white px-4 ${currentView === 'chat' ? 'mt-0 py-3' : 'mt-6 py-6'}`}>
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PassportShieldIcon color="#C73E33" size={18} />
            <span className="text-[13px] font-semibold text-[#374151]">WorkPassport</span>
          </div>
          <div className="text-[11px] text-[#9CA3AF] max-w-2xl text-left sm:text-right leading-relaxed">
            <Disclaimer t={t} k="disc_footer" className="!text-xs" />
            <div className="mt-1">{t('footer_text')}</div>
          </div>
        </div>
      </footer>

      {successOverlay}
      {toast && <Toast msg={toast} />}
    </div>
  );
}
