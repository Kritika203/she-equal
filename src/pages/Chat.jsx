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
import { initialsOf, spClock } from '../utils/format.js';
const messageTimestamp = (ts, lang) => {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return null;
  const dateTime = date.toISOString();
  return { dateTime, label: spClock(dateTime, lang) };
};

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
    <button type="button" onClick={() => openChecker()} aria-label={t('chat_check')} className={`shrink-0 flex items-center justify-center gap-1.5 rounded-full font-semibold text-[13px] border border-[#E8E5E0] bg-white text-[#1C1B1A] hover:border-[#D1D5DB] hover:bg-[#F9F9F7] transition-all ${withLabel ? 'h-9 px-3' : 'w-9 h-9'} ${className}`}>
      <Shield size={16} className="text-[#C73E33]" />{withLabel && <span className="hidden sm:inline">{t('chat_check')}</span>}
    </button>
  );

  return (
    <div className="mx-auto flex h-[calc(100dvh-9rem)] min-h-[320px] max-h-[720px] w-full max-w-[720px] flex-col sm:h-[calc(100dvh-9rem)]">
      {/* ── Client info header ── */}
      <div className="mb-2 shrink-0 rounded-xl border border-[#E8E5E0] bg-white">
        <div className="flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3">
          <button onClick={() => navTo('opportunities', { tab: 'applied' })} aria-label={t('back')} className="shrink-0 flex items-center gap-0.5 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors h-9 -ml-0.5 pr-1">
            <ChevronLeft size={18} /><span className="hidden sm:inline">{t('back')}</span>
          </button>
          <div className="shrink-0 w-9 h-9 rounded-full bg-[#FCF0EE] text-[#C73E33] font-semibold text-[13px] flex items-center justify-center">{initialsOf((job.clientName || '').replace(/[()]/g, ''))}</div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[14px] leading-snug truncate text-[#111827]">{job.clientName}</div>
            <div className="text-[12px] text-[#9CA3AF] truncate leading-snug">{job.title}</div>
          </div>
          <CheckBtn withLabel />
        </div>
        <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-[#F3F4F6] px-3 py-2 sm:px-4" ref={menuRef}>
          {hasClientMsg && !blocked && <button type="button" onClick={() => setEndOpen(true)} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-[#F2DBD7] bg-[#FFF5F5] px-3 text-left text-[12px] font-semibold text-[#C73E33] hover:bg-[#FEECEC] transition-colors">
            <Ban size={14} className="shrink-0" /> <span>{t('sp_es_btn')}</span>
          </button>}
          <button type="button" onClick={() => setMenuOpen(o => !o)} aria-haspopup="menu" aria-expanded={menuOpen} className="ml-auto flex h-8 items-center gap-1.5 rounded-full border border-[#E8E5E0] bg-white px-3 text-[12px] font-semibold text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9F9F7] transition-all">
            <MoreVertical size={15} /> <span>{t('ca_options')}</span>
          </button>
          {menuOpen && (
            <div role="menu" className="absolute right-0 top-full mt-1.5 w-[min(260px,calc(100vw-32px))] bg-white border border-[#E5E7EB] rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden z-40 text-left">
              <button role="menuitem" onClick={() => { setMenuOpen(false); toggleMute(); }} className="w-full text-left px-3.5 py-2.5 text-[13px] text-[#374151] hover:bg-[#F9F9F7] border-b border-[#F3F4F6] flex items-center gap-2.5 transition-colors"><BellOff size={15} className="shrink-0 text-[#9CA3AF]" /> {muted ? t('ca_unmute') : t('ca_mute')}</button>
              <button role="menuitem" onClick={() => { setMenuOpen(false); toggleBlock(); }} className="w-full text-left px-3.5 py-2.5 text-[13px] text-[#374151] hover:bg-[#F9F9F7] border-b border-[#F3F4F6] flex items-center gap-2.5 transition-colors"><Ban size={15} className="shrink-0 text-[#9CA3AF]" /> {blocked ? t('ca_unblock') : t('ca_block')}</button>
              <button role="menuitem" onClick={() => { setMenuOpen(false); setReportOpen(true); }} className="w-full text-left px-3.5 py-2.5 text-[13px] text-[#374151] hover:bg-[#F9F9F7] flex items-center gap-2.5 transition-colors"><Flag size={15} className="shrink-0 text-[#9CA3AF]" /> {t('ca_report')}{report ? ' ✓' : ''}</button>
            </div>
          )}
        </div>
      </div>

      {endReport && (
        <div className="mb-2 shrink-0 rounded-xl border border-[#F2DBD7] bg-[#FFF5F5] p-3">
          <h2 className="mb-2 font-semibold text-[14px] text-[#111827]">{t('sp_es_rep_title')}</h2>
          <p className="mb-2.5 break-words rounded-lg border border-[#E8E5E0] bg-white p-2.5 text-[13px] text-[#374151] leading-relaxed">{endReport}</p>
          <button type="button" onClick={async () => { await copyToClipboard(endReport); showToast(t('sh_copied')); }} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#C73E33] px-4 text-[13px] font-semibold text-white hover:bg-[#AE332A] transition-colors">{t('sh_copy')}</button>
        </div>
      )}

      {/* ── Conversation area ── */}
      <div role="log" aria-live="polite" aria-relevant="additions" aria-label={t('chat_thread_label')} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto scroll-smooth px-1 py-2 scrollbar-thin">
        {thread.map((m, i) => {
          const time = messageTimestamp(m.ts, lang);
          return m.from === 'client' ? (
            <div key={i} className="flex flex-col items-start">
              <div className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-sm border border-[#E8E5E0] bg-white px-3.5 py-2.5 text-[14px] leading-[1.6] text-[#252525]">{m.text}</div>
              <div className="flex items-center gap-2.5 px-1 mt-1">
                {time && <time dateTime={time.dateTime} className="text-[11px] text-[#9CA3AF]">{time.label}</time>}
                <button onClick={() => openChecker(m.text, true)} className="flex items-center gap-1 text-[11px] font-medium text-[#9CA3AF] hover:text-[#C73E33] transition-colors"><Shield size={12} /> {t('chat_check_msg')}</button>
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-end">
              <div className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-[#FCF0EE] border border-[#F2DBD7] px-3.5 py-2.5 text-[14px] leading-[1.6] text-[#252525]">{m.text}</div>
              {time && <time dateTime={time.dateTime} className="mt-1 px-1 text-[11px] text-[#9CA3AF]">{time.label}</time>}
            </div>
          );
        })}
        {muted && <p className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E8E5E0] bg-[#F9F9F7] px-3 py-2 text-center text-[12px] text-[#9CA3AF]"><BellOff size={14} className="shrink-0" /> <span>{t('ca_muted_note')}</span></p>}
        <div ref={endRef} />
      </div>

      {/* ── Message composer ── */}
      {blocked ? (
        <div className="sticky bottom-0 z-30 shrink-0 border-t border-[#E8E5E0] bg-[#FAF9F7]/95 py-2.5 backdrop-blur-sm">
          <div className="flex flex-col gap-2 rounded-xl border border-[#E8E5E0] bg-white p-2.5 sm:flex-row sm:items-center">
            <p className="flex flex-1 items-center gap-2 text-[13px] text-[#374151]"><Ban size={15} className="shrink-0 text-[#9CA3AF]" /> <span>{t('ca_blocked_bar')}</span></p>
            <button type="button" onClick={toggleBlock} className="h-8 shrink-0 rounded-full border border-[#E8E5E0] bg-white px-4 text-[13px] font-semibold text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9F9F7] transition-all">{t('ca_unblock')}</button>
          </div>
        </div>
      ) : (
        <div className="sticky bottom-0 z-30 shrink-0 border-t border-[#E8E5E0] bg-[#FAF9F7]/95 py-2.5 backdrop-blur-sm">
          {quietNow && (
            <div className="mb-2 rounded-xl border border-[#E8E5E0] bg-white p-2.5">
              <h2 className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#111827]"><Moon size={15} className="shrink-0 text-[#C73E33]" /> <span>{t('sp_qh_card_title')}</span></h2>
              <p className="mb-2 text-[12px] text-[#6B7280] leading-relaxed">{t('sp_qh_draft')}</p>
              <button type="button" onClick={async () => { await copyToClipboard(t('sp_qh_draft')); showToast(t('sh_copied')); }} className="h-8 rounded-full border border-[#E8E5E0] bg-white px-4 text-[12px] font-semibold text-[#374151] hover:bg-[#F9F9F7] transition-colors">{t('sh_copy')}</button>
            </div>
          )}
          <form onSubmit={send} className="flex items-center gap-2">
            <CheckBtn />
            <input value={draft} onChange={e => changeDraft(e.target.value)} placeholder={t('chat_write')} aria-label={t('chat_write')} className="h-10 min-w-0 flex-1 rounded-full border border-[#E8E5E0] bg-white px-4 text-[14px] outline-none placeholder:text-[#9CA3AF] focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/20 transition-all" />
            <button type="submit" className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#C73E33] px-4 text-[13px] font-semibold text-white hover:bg-[#AE332A] transition-colors sm:px-5"><Send size={15} /> {t('chat_send')}</button>
          </form>
          {savedDraft && <p className="text-[11px] text-[#9CA3AF] mt-1.5 px-2">{t('pv_draft_saved')}</p>}
        </div>
      )}

      {checker && <ChatCheckModal key={checker.n} t={t} lang={lang} user={user} navTo={navTo} showToast={showToast} setEvidence={setEvidence} initialText={checker.text} autoRun={checker.auto} onClose={() => setChecker(null)} clientApi={clientApi} job={job} workrooms={workrooms} setWorkrooms={setWorkrooms} />}
      {reportOpen && <ReportClientModal t={t} initial={report ? report.reason : null} onSend={sendReport} onClose={() => setReportOpen(false)} />}
      {endOpen && <EndChatModal t={t} onConfirm={endChatSafely} onClose={() => setEndOpen(false)} />}
    </div>
  );
}
