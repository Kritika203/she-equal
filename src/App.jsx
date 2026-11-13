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
           <div className="fixed inset-0 bg-[#FBFAF8] z-50 flex flex-col items-center justify-center p-6 text-center">
              <CheckCircle2 size={64} strokeWidth={1.5} className="text-[#C73E33] mx-auto mb-6" />
              <h1 className="text-[28px] sm:text-[30px] font-semibold mb-4">{t('setup_success_title')}, {userProfile?.name?.split(' ')[0]}!</h1>
              <p className="text-lg text-[#4A4744] mb-10 max-w-md">{t('setup_success_sub')}</p>
              
              <div className="w-full max-w-sm flex flex-col gap-4">
                <button onClick={() => navTo('firstwork')} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] transition-colors min-h-[52px]">
                  {t('btn_find_job')}
                </button>
                <button onClick={() => navTo('passport')} className="w-full bg-white text-[#1C1B1A] border border-[#E3E0D9] py-3.5 rounded-full font-semibold text-lg hover:bg-[#F6F4EF] transition-colors min-h-[52px]">
                  {t('btn_see_wp')}
                </button>
              </div>
           </div>
  ) : null;

  if (!isLoggedIn && !clientMode) {
    return (
      <div className={`min-h-screen bg-[#FBFAF8] font-sans text-[#1C1B1A] flex flex-col items-center justify-center px-5 py-12 ${lang === 'ne' ? 'leading-relaxed' : ''}`}>
        <div className="w-full max-w-[400px] relative">
          <div className="flex justify-center mb-12"><LangToggle lang={lang} setLang={setLang} /></div>

          {currentView === 'welcome' ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex flex-col items-center gap-3 mb-10">
                <span className="text-xl font-semibold tracking-tight text-[#1C1B1A]">WorkPassport</span>
              </div>
              <h1 className="text-[30px] font-semibold tracking-[-0.02em] leading-[1.25] mb-5 text-[#1C1B1A]">{t('welcome_title')}</h1>
              <p className="text-base text-[#4A4744] mb-10 leading-[1.6]">{t('welcome_sub')}</p>

              <div className="w-full flex flex-col gap-3 mb-6">
                <button onClick={() => navTo('setup')} className="w-full h-[52px] px-6 rounded-full bg-[#C73E33] text-white text-base font-medium hover:bg-[#AE332A] transition-colors flex items-center justify-center">
                  {t('btn_new')}
                </button>
                <button onClick={() => navTo('login')} className="w-full h-[52px] px-6 rounded-full bg-white text-[#1C1B1A] border border-[#E3E0D9] text-base font-medium hover:bg-[#F6F4EF] transition-colors flex items-center justify-center">
                  {t('btn_login')}
                </button>
              </div>

              <button onClick={() => { if (userProfile && userProfile.name !== MAYA_PROFILE.name) { setSkillLevels({}); setConfirmedJobs([]); setPayChecklist([false, false, false, false]); setSkillEvidence({}); } setUserProfile(MAYA_PROFILE); setIsLoggedIn(true); navTo('firstwork'); showToast(t('welcome_toast')); }} className="text-sm text-[#8A8580] underline underline-offset-4 hover:text-[#1C1B1A] mb-14 min-h-[44px] flex items-center justify-center px-4">
                {t('btn_demo')}
              </button>

              <div className="w-full bg-white border border-[#EAE7E1] rounded-[20px] p-5 text-left mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <Briefcase size={22} className="shrink-0 mt-0.5 text-[#C73E33]" />
                  <div>
                    <div className="font-semibold text-base text-[#1C1B1A]">{t('cm_welcome_q')}</div>
                    <div className="text-sm text-[#6E6963] mt-0.5 leading-[1.5]">{t('cm_welcome_line')}</div>
                  </div>
                </div>
                <button onClick={enterClientMode} className="w-full h-[52px] px-6 rounded-full bg-white text-[#1C1B1A] border border-[#E3E0D9] text-base font-medium hover:bg-[#F6F4EF] transition-colors flex items-center justify-center">
                  {t('cm_enter')}
                </button>
              </div>

              <div className="flex items-start gap-2.5 text-[13px] leading-[1.6] text-[#8A8580] text-left">
                <Lock size={15} className="mt-[3px] shrink-0" />
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
        <nav className="bg-[#FBFAF8]/90 backdrop-blur border-b border-[#EAE7E1] sticky top-0 z-40">
          <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => navTo('client')} className="flex items-center gap-2 min-h-[48px]">
              <PassportShieldIcon color="#C73E33" size={26} />
              <span className="font-semibold text-lg tracking-tight hidden sm:block">WorkPassport</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
              <LangToggle lang={lang} setLang={setLang} compact />
              <div className="w-10 h-10 rounded-full bg-[#F0EEE9] border border-[#EAE7E1] flex items-center justify-center font-semibold text-sm" title={clientProfile ? clientProfile.name : 'Client'}>BT</div>
            </div>
          </div>
          <div className="border-t border-[#EAE7E1] overflow-x-auto">
            <div className="flex gap-6 px-4 w-max min-w-full max-w-[1200px] mx-auto">
              <NavLink label={t('cm_home')} active={['client', 'client-applicants', 'client-agreement'].includes(currentView)} onClick={() => navTo('client')} />
              <NavLink label={t('cm_post')} active={false} onClick={() => navTo('client', { scrollTo: 'form', n: Date.now() })} />
              <NavLink label={t('cm_switch_maya')} active={false} onClick={exitClientToMaya} />
              <NavLink label={t('nav_logout')} active={false} onClick={clientLogout} />
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-6 pb-28">
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
    <div className={`wp-app ${simpleOn ? 'wp-simple' : ''} min-h-screen flex flex-col bg-[#FBFAF8] font-sans text-base text-[#1C1B1A] ${lang === 'ne' ? 'leading-relaxed' : ''}`}>
      {/* Navbar */}
      <nav className="bg-[#FBFAF8]/90 backdrop-blur border-b border-[#EAE7E1] sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => navTo('firstwork')} className="flex items-center gap-2 min-h-[48px]">
              <PassportShieldIcon color="#C73E33" size={26} />
              <span className="font-semibold text-lg tracking-tight hidden sm:block">WorkPassport</span>
            </button>
            <div className="hidden md:flex gap-6">
              <NavLink label={t('nav_firstwork')} active={['firstwork', 'job-detail', 'apply', 'opportunities', 'chat', 'workroom', 'client', 'client-applicants', 'client-agreement', 'bring', 'bring-queue', 'institution-insight'].includes(currentView)} onClick={() => navTo('firstwork')} />
              <NavLink label={t('nav_passport')} active={currentView === 'passport'} onClick={() => navTo('passport')} />
              <NavLink label={t('nav_shield_safety')} active={currentView === 'shield'} onClick={() => navTo('shield')} />
              <NavLink label={t('nav_ext')} active={currentView === 'ext'} onClick={() => navTo('ext')} />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LangToggle lang={lang} setLang={setLang} compact />
            <NotificationBell t={t} priv={sharedOn} />
            {sharedOn && (
              <button onClick={() => setQuickHidden(true)} aria-label={t('pv_quick_hide')} title={t('pv_quick_hide')} className="min-h-[48px] min-w-[44px] px-2 flex items-center justify-center rounded-full hover:bg-[#F0EEE9]">
                <EyeOff size={24} className="text-[#4A4744]" />
              </button>
            )}
            <UserDropdown user={userProfile} onLogout={handleLogout} t={t} navTo={navTo} lang={lang} setLang={setLang} showLock={sharedOn} onLock={() => setUnlocked(false)} />
          </div>
        </div>
        <div className="md:hidden border-t border-[#EAE7E1] overflow-x-auto">
          <div className="flex gap-6 px-4 w-max min-w-full">
            <NavLink label={t('nav_firstwork')} active={['firstwork', 'job-detail', 'apply', 'opportunities', 'chat', 'workroom', 'client', 'client-applicants', 'client-agreement', 'bring', 'bring-queue', 'institution-insight'].includes(currentView)} onClick={() => navTo('firstwork')} />
            <NavLink label={t('nav_passport')} active={currentView === 'passport'} onClick={() => navTo('passport')} />
            <NavLink label={t('nav_shield_safety')} active={currentView === 'shield'} onClick={() => navTo('shield')} />
            <NavLink label={t('nav_ext')} active={currentView === 'ext'} onClick={() => navTo('ext')} />
          </div>
        </div>
      </nav>

      {/* Info Strip */}
      {(currentView === 'firstwork' || currentView === 'opportunities') && (
        <div className="bg-[#FAF0EE] text-[#AE332A] py-3 px-4 flex justify-center items-center gap-2 text-sm border-b border-[#F3E1DD]">
          <ShieldCheck size={18} />
          <span>{t('fw_banner')}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-6 pb-28">
        {currentView === 'firstwork' && <FirstWorkFeed allJobs={allJobs} t={t} navTo={navTo} user={userProfile} savedJobs={savedJobs} setSavedJobs={setSavedJobs} lang={lang} lowdata={settings.lowdata} onSwitchClient={() => { setUnlocked(false); setIsLoggedIn(false); navTo('welcome'); }} />}
        {currentView === 'job-detail' && <JobDetail t={t} navTo={navTo} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} skillLevels={skillLevels} savedJobs={savedJobs} setSavedJobs={setSavedJobs} lang={lang} showToast={showToast} hasDraft={simpleOn && !!applyDraft && applyDraft.jobId === viewParams.id} />}
        {currentView === 'apply' && <ApplyWizard key={viewParams.id} t={t} navTo={navTo} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} setAppliedJobs={setAppliedJobs} lang={lang} simple={simpleOn} applyDraft={applyDraft} setApplyDraft={setApplyDraft} />}
        {currentView === 'opportunities' && <MyOpportunities allJobs={allJobs} key={viewParams.tab || 'saved'} initialTab={viewParams.tab} t={t} navTo={navTo} savedJobs={savedJobs} setSavedJobs={setSavedJobs} appliedJobs={appliedJobs} confirmedJobs={confirmedJobs} hideMoney={sharedOn} draftJobId={simpleOn && applyDraft ? applyDraft.jobId : null} />}
        {currentView === 'passport' && <PassportPage allJobs={allJobs} t={t} lang={lang} user={userProfile} setUser={setUserProfile} navTo={navTo} showToast={showToast} skillLevels={skillLevels} setSkillLevels={setSkillLevels} confirmedJobs={confirmedJobs} setConfirmedJobs={setConfirmedJobs} payChecklist={payChecklist} setPayChecklist={setPayChecklist} appliedJobs={appliedJobs} skillEvidence={skillEvidence} setSkillEvidence={setSkillEvidence} hideMoney={sharedOn} settings={settings} setSettings={setSettings} onSharedEnabled={() => setUnlocked(true)} evidence={evidence} />}
        {currentView === 'shield' && <ShieldSafetyPage t={t} lang={lang} user={userProfile} navTo={navTo} showToast={showToast} history={shieldHistory} setHistory={setShieldHistory} evidence={evidence} setEvidence={setEvidence} scrollKey={viewParams.n} scrollTo={viewParams.scrollTo} allJobs={allJobs} appliedJobs={appliedJobs} trusted={trusted} setTrusted={setTrusted} checkin={checkin} setCheckin={setCheckin} quiet={quiet} setQuiet={setQuiet} onQuickHide={() => setQuickHidden(true)} />}
        {currentView === 'ext' && <ExtensionPage t={t} lang={lang} navTo={navTo} />}
        {currentView === 'skillbridge' && <SkillBridgePage allJobs={allJobs} t={t} lang={lang} user={userProfile} navTo={navTo} insights={approvedInsights} />}
        {currentView === 'bring' && <BringView t={t} lang={lang} navTo={navTo} onSubmit={submitBring} />}
        {currentView === 'institution-insight' && <InstitutionInsight allJobs={allJobs} t={t} lang={lang} navTo={navTo} />}
        {currentView === 'bring-queue' && <BringQueue t={t} lang={lang} navTo={navTo} submissions={bringSubmissions} onDecide={decideBring} />}
        {currentView === 'vault' && <EvidenceVaultPage t={t} lang={lang} user={userProfile} navTo={navTo} showToast={showToast} evidence={evidence} setEvidence={setEvidence} masked={sharedOn} />}
        {currentView === 'chat' && (appliedJobs.some(a => a.jobId === viewParams.id) && allJobs.find(j => j.id === viewParams.id)
          ? <ChatView key={viewParams.id} t={t} lang={lang} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} navTo={navTo} showToast={showToast} chats={chats} updateChat={updateChat} setEvidence={setEvidence} workrooms={workrooms} setWorkrooms={setWorkrooms} simple={simpleOn} chatDrafts={chatDrafts} setChatDrafts={setChatDrafts} getClientAction={getClientAction} clientAction={getClientAction(viewParams.id)} setClientAction={setClientAction} quiet={quiet} />
          : <ChatMissing t={t} navTo={navTo} />)}
        {currentView === 'workroom' && (appliedJobs.some(a => a.jobId === viewParams.id) && allJobs.find(j => j.id === viewParams.id)
          ? <WorkroomView key={viewParams.id} t={t} lang={lang} job={allJobs.find(j => j.id === viewParams.id)} navTo={navTo} showToast={showToast} workrooms={workrooms} setWorkrooms={setWorkrooms} confirmedJobs={confirmedJobs} setConfirmedJobs={setConfirmedJobs} hideMoney={sharedOn} />
          : <ChatMissing t={t} navTo={navTo} />)}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE7E1] py-10 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-3 text-center">
          <div className="max-w-2xl text-left"><Disclaimer t={t} k="disc_footer" /></div>
          <div className="text-[13px] text-[#8A8580]">{t('footer_text')}</div>
        </div>
      </footer>

      {successOverlay}
      {toast && <Toast msg={toast} />}
    </div>
  );
}
