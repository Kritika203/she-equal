// Messages and client actions.

import { Ban, BellOff, ChevronLeft, Flag, Moon, MoreVertical, Send, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ChatCheckModal } from '../components/chat/ChatCheckModal.jsx';
import { ReportClientModal } from '../components/common/Feedback.jsx';
import { EndChatModal } from '../components/safety/SafetyTools.jsx';
import { useNow } from '../hooks/useNow.js';
import { CHAT_CANNED, seedThread } from '../services/chat.js';
import { QUIET_DEFAULT, isQuietActive } from '../services/quietHours.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { initialsOf } from '../utils/format.js';



export function ChatView({ t, lang, job, user, navTo, showToast, chats, updateChat, setEvidence, workrooms = {}, setWorkrooms = () => {}, simple = false, chatDrafts = {}, setChatDrafts = () => {}, getClientAction, clientAction = {}, setClientAction = () => {}, quiet = QUIET_DEFAULT }) {
  const [endOpen, setEndOpen] = useState(false);
  const [endReport, setEndReport] = useState(null); // report text shown after "End this chat safely"
  const nowTick = useNow(20000);
  const [draft, setDraft] = useState(() => (simple && typeof chatDrafts[job.id] === 'string' ? chatDrafts[job.id] : ""));
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const menuRef = useRef(null);
  const muted = !!clientAction.muted;
  const blocked = !!clientAction.blocked;
  const report = clientAction.report || null;
  const savedDraft = simple && typeof chatDrafts[job.id] === 'string' && chatDrafts[job.id] !== "";
  useEffect(() => {
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);
  const changeDraft = (v) => {
    setDraft(v);
    if (!simple) return;
    setChatDrafts(prev => { const n = { ...(prev && typeof prev === 'object' && !Array.isArray(prev) ? prev : {}) }; if (v) n[job.id] = v; else delete n[job.id]; return n; });
  };
  const toggleMute = () => setClientAction(job.id, { muted: !getClientAction(job.id).muted });
  const toggleBlock = () => setClientAction(job.id, { blocked: !getClientAction(job.id).blocked });
  const sendReport = (reason) => {
    setClientAction(job.id, { report: { reason, date: new Date().toISOString() } });
    setReportOpen(false);
    showToast(t('ca_report_toast'));
  };
  const clientApi = { muted, blocked, hasReport: !!report, toggleMute, toggleBlock, openReport: () => setReportOpen(true) };
  const [checker, setChecker] = useState(null); // null | { text, auto, n }
  const endRef = useRef(null);
  const firstRender = useRef(true);
  const thread = chats[job.id] || seedThread(job);
  const hasClientMsg = thread.some(m => m.from === 'client');
  const quietNow = isQuietActive(quiet, nowTick);
  const endChatSafely = () => {
    const lines = thread.map(m => (m.from === 'client' ? 'Client: ' : 'Me: ') + m.text).join('\n');
    setEvidence(prev => [{ text: lines, categories: [], date: new Date().toISOString(), source: 'chat', jobTitle: job.title, clientName: job.clientName }, ...(Array.isArray(prev) ? prev : [])].slice(0, 20));
    setClientAction(job.id, { blocked: true });
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    setEndReport(`Report about ${job.clientName} (job: ${job.title}). I am reporting this client from my WorkPassport chat. The full chat is saved in my Evidence Vault. Date: ${date}.`);
    setEndOpen(false);
    showToast(t('sp_es_toast'));
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (!chats[job.id]) updateChat(job.id, () => seedThread(job));
  }, [job.id]);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [thread.length]);

  const send = (e) => {
    e.preventDefault();
    const msg = draft.trim();
    if (!msg) return;
    if (getClientAction(job.id).blocked) return;
    const cur = chats[job.id] || seedThread(job);
    const hasCanned = cur.some(m => m.from === 'client' && CHAT_CANNED.includes(m.text));
    updateChat(job.id, c => [...(c || seedThread(job)), { from: 'me', text: msg, ts: Date.now() }]);
    setDraft("");
    setChatDrafts(prev => { if (!prev || typeof prev !== 'object' || !(job.id in prev)) return prev; const n = { ...prev }; delete n[job.id]; return n; });
    const cs = getClientAction(job.id);
    if (!hasCanned && !cs.muted && !cs.blocked) {
      const used = Object.keys(chats).filter(id => id !== job.id && (chats[id] || []).some(m => m.from === 'client' && CHAT_CANNED.includes(m.text))).length;
      const reply = CHAT_CANNED[used % CHAT_CANNED.length];
      setTimeout(() => {
        const now = getClientAction(job.id);
        if (now.muted || now.blocked) return;
        updateChat(job.id, c => {
          const list = c || [];
          if (list.some(m => m.from === 'client' && CHAT_CANNED.includes(m.text))) return list;
          return [...list, { from: 'client', text: reply, ts: Date.now() }];
        });
      }, 900);
    }
  };

  const openChecker = (text = "", auto = false) => setChecker({ text, auto, n: Date.now() });
  const CheckBtn = ({ withLabel, className = "" }) => (
    <button type="button" onClick={() => openChecker()} aria-label={t('chat_check')} className={`shrink-0 flex items-center justify-center gap-2 rounded-full font-semibold text-base border border-[#E3E0D9] bg-white text-[#1C1B1A] hover:border-[#DDD8CE] min-h-[48px] ${withLabel ? 'px-4' : 'w-12'} ${className}`}>
      <Shield size={20} className="text-[#C73E33]" />{withLabel && <span>{t('chat_check')}</span>}
    </button>
  );

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4 sm:p-5 mb-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navTo('opportunities', { tab: 'applied' })} aria-label={t('back')} className="shrink-0 flex items-center gap-1 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] -ml-1 pr-1"><ChevronLeft size={20} /><span className="hidden sm:inline">{t('back')}</span></button>
        <div className="shrink-0 w-11 h-11 rounded-full bg-[#FAF0EE] text-[#AE332A] font-semibold text-base flex items-center justify-center">{initialsOf((job.clientName || '').replace(/[()]/g, ''))}</div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-lg leading-snug truncate">{job.clientName}</div>
          <div className="text-sm text-[#6E6963] truncate">{job.title}</div>
        </div>
        <CheckBtn withLabel />
      </div>
        <div className="mt-3 pt-3 border-t border-[#EAE7E1] flex flex-wrap items-center justify-between gap-2 relative" ref={menuRef}>
        {hasClientMsg && !blocked && <button type="button" onClick={() => setEndOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E3E0D9] bg-white text-[#1C1B1A] font-semibold text-base hover:bg-[#F6F4EF] min-h-[48px] px-4 text-left"><Ban size={18} className="shrink-0 text-[#C73E33]" /> <span>{t('sp_es_btn')}</span></button>}
          <button type="button" onClick={() => setMenuOpen(o => !o)} aria-haspopup="menu" aria-expanded={menuOpen} className="ml-auto flex items-center gap-2 rounded-full font-semibold text-base text-[#1C1B1A] border border-[#E3E0D9] bg-white hover:border-[#DDD8CE] min-h-[48px] px-4"><MoreVertical size={20} /> <span>{t('ca_options')}</span></button>
          {menuOpen && (
            <div role="menu" className="absolute right-0 top-full mt-2 w-[min(280px,calc(100vw-32px))] bg-white border border-[#EAE7E1] rounded-[16px] shadow-[0_8px_24px_rgba(28,27,26,0.08)] overflow-hidden z-40 text-left">
              <button role="menuitem" onClick={() => { setMenuOpen(false); toggleMute(); }} className="w-full text-left px-5 py-3 min-h-[48px] text-base text-[#1C1B1A] hover:bg-[#F6F4EF] border-b border-[#EAE7E1] flex items-center gap-3"><BellOff size={20} className="shrink-0" /> {muted ? t('ca_unmute') : t('ca_mute')}</button>
              <button role="menuitem" onClick={() => { setMenuOpen(false); toggleBlock(); }} className="w-full text-left px-5 py-3 min-h-[48px] text-base text-[#1C1B1A] hover:bg-[#F6F4EF] border-b border-[#EAE7E1] flex items-center gap-3"><Ban size={20} className="shrink-0" /> {blocked ? t('ca_unblock') : t('ca_block')}</button>
              <button role="menuitem" onClick={() => { setMenuOpen(false); setReportOpen(true); }} className="w-full text-left px-5 py-3 min-h-[48px] text-base text-[#1C1B1A] hover:bg-[#F6F4EF] flex items-center gap-3"><Flag size={20} className="shrink-0" /> {t('ca_report')}{report ? ' ✓' : ''}</button>
            </div>
          )}
        </div>
      </div>

      {endReport && (
        <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-5 mb-5">
          <h2 className="font-semibold text-lg mb-3">{t('sp_es_rep_title')}</h2>
          <p className="text-base text-[#1C1B1A] bg-white border border-[#EAE7E1] rounded-[14px] p-4 mb-4 break-words">{endReport}</p>
          <button type="button" onClick={async () => { await copyToClipboard(endReport); showToast(t('sh_copied')); }} className="inline-flex items-center justify-center gap-2 bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px] px-6">{t('sh_copy')}</button>
        </div>
      )}

      <div role="log" aria-label={t('chat_thread_label')} className="space-y-4 pb-4">
        {thread.map((m, i) => m.from === 'client' ? (
          <div key={i} className="flex flex-col items-start">
            <div className="max-w-[85%] bg-white border border-[#EAE7E1] rounded-[20px] rounded-bl-[6px] px-4 py-3 text-base text-[#1C1B1A] break-words">{m.text}</div>
            <button onClick={() => openChecker(m.text, true)} className="flex items-center gap-1.5 text-sm font-semibold text-[#6E6963] hover:text-[#1C1B1A] min-h-[44px] px-1"><Shield size={14} /> {t('chat_check_msg')}</button>
          </div>
        ) : (
          <div key={i} className="flex justify-end">
            <div className="max-w-[85%] bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] rounded-br-[6px] px-4 py-3 text-base text-[#1C1B1A] break-words">{m.text}</div>
          </div>
        ))}
        {muted && <p className="flex items-start justify-center gap-2 text-center text-base text-[#6E6963] bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] px-4 py-3"><BellOff size={18} className="shrink-0 mt-0.5" /> <span>{t('ca_muted_note')}</span></p>}
        <div ref={endRef} />
      </div>

      {blocked ? (
        <div className="sticky bottom-0 z-30 bg-[#FBFAF8] pt-3 pb-3 border-t border-[#EAE7E1]">
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="flex-1 flex items-start gap-3 text-base text-[#1C1B1A]"><Ban size={20} className="shrink-0 mt-0.5 text-[#6E6963]" /> <span>{t('ca_blocked_bar')}</span></p>
            <button type="button" onClick={toggleBlock} className="shrink-0 border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] px-6">{t('ca_unblock')}</button>
          </div>
        </div>
      ) : (
        <div className="sticky bottom-0 z-30 bg-[#FBFAF8] pt-3 pb-3 border-t border-[#EAE7E1]">
          {quietNow && (
            <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4 mb-3">
              <h2 className="font-semibold text-base mb-2 flex items-start gap-2"><Moon size={18} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sp_qh_card_title')}</span></h2>
              <p className="text-base text-[#4A4744] mb-3">{t('sp_qh_draft')}</p>
              <button type="button" onClick={async () => { await copyToClipboard(t('sp_qh_draft')); showToast(t('sh_copied')); }} className="border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[44px] px-5">{t('sh_copy')}</button>
            </div>
          )}
          <form onSubmit={send} className="flex items-center gap-2">
            <CheckBtn />
            <input value={draft} onChange={e => changeDraft(e.target.value)} placeholder={t('chat_write')} aria-label={t('chat_write')} className="flex-1 min-w-0 min-h-[48px] border border-[#EAE7E1] bg-white rounded-full px-4 text-base outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30" />
            <button type="submit" className="shrink-0 flex items-center justify-center gap-2 bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px] px-4 sm:px-6"><Send size={18} /> {t('chat_send')}</button>
          </form>
          {savedDraft && <p className="text-sm text-[#6E6963] mt-2 px-2">{t('pv_draft_saved')}</p>}
        </div>
      )}

      {checker && <ChatCheckModal key={checker.n} t={t} lang={lang} user={user} navTo={navTo} showToast={showToast} setEvidence={setEvidence} initialText={checker.text} autoRun={checker.auto} onClose={() => setChecker(null)} clientApi={clientApi} job={job} workrooms={workrooms} setWorkrooms={setWorkrooms} />}
      {reportOpen && <ReportClientModal t={t} initial={report ? report.reason : null} onSend={sendReport} onClose={() => setReportOpen(false)} />}
      {endOpen && <EndChatModal t={t} onConfirm={endChatSafely} onClose={() => setEndOpen(false)} />}
    </div>
  );
}
