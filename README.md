# WorkPassport — prototype

WorkPassport helps first-time freelancers (mostly young women in Nepal) get a first online job safely. It is a frontend-only prototype: no backend, dummy data, everything stays in the browser. The app is fully bilingual (English / नेपाली).

## What is inside

1. **FirstWork** — 18 curated beginner jobs with search, filters, job detail, a 4-step Guided Apply and My Opportunities.
2. **My WorkPassport** — a proof record with evidence levels, per-skill proof of work (photos and portfolio links), a share link, a public proof-first view, client confirmation (demo) and a Getting Paid checklist.
3. **WorkShield & Safety** — ONE page. WorkShield (paste a job post, get a rule-based scam check with explained findings) comes first; below it a banner (`#safety-section`) introduces Safety (paste a client chat message, get a rule-based boundary check, ready-made replies, saved proof, emergency contacts). In-app buttons that used to open Safety open this page scrolled to the banner.
4. **Proof of work and PDF** — on My WorkPassport each skill has a "Your proof" area: up to 6 photos (downscaled to 1000px JPEG) and portfolio links, stored in `wp_skill_evidence`. Proof is labelled "Added by you" and never changes a badge. The public view shows a "Work samples" gallery first. "Download PDF" prints a clean print-only document (`.passport-print`, styled in `src/index.css`) via the browser's Save as PDF.
5. **Client chat** — in My Opportunities → Applied, tap *Message client*. Inside the chat, a shield button (or *Check this message* under any client bubble) opens a pop-up that runs both WorkShield and Safety checks, shows ready replies to copy, and can save a message as proof. Threads are stored in `wp_chats`.
6. **Extension** — a practice page that uses the real checkers, plus the real Chrome extension in `extension/`.

7. **Privacy and ease** — on My WorkPassport, after the safety rules. *Shared Device Mode* (PIN lock on load, hidden earnings, private notifications, Quick hide, "Lock now" in the user menu) and *Low-Data / Simple Mode* (112.5% text, chat and application drafts kept on the device). Stored in `wp_settings`, `wp_chat_drafts`, `wp_apply_draft`.
8. **Client options** — in a chat, mute, block or report the client (also inside the check pop-up). Stored in `wp_client_actions`.

9. **Workroom** — in My Opportunities → Applied, tap *Open workroom* on any applied job. It shows the agreement, a milestone checklist (one milestone per deliverable) with payment states Not funded → Funded → Submitted → Released, and a link to the existing chat. Payment states are **simulated** with clearly-labelled demo buttons. When every milestone is released, the job is added to the Passport as client-confirmed work (same effect as the Passport demo button, never counted twice). Stored in `wp_workrooms`.

10. **Scope check** — inside the chat's check pop-up (a third section after Safety and WorkShield). It compares a client message with the agreed work (the Workroom milestones if one exists, otherwise the job's deliverables) using a transparent phrase list (`checkScope` in `src/App.jsx`) and shows the exact words that triggered it. If flagged, she can copy an *I can do it* reply, copy an *ask first* reply, or create an additional milestone that is added to the job's Workroom (`wp_workrooms`, same shape, no new keys). Demo: apply to "30 Instagram posts for clothing store", open its chat and tap *Check this message* on the second message.

11. **Safety pack (women-safety while working with a client)** — all on the Safety side of the merged page, in chat and on job detail. Nothing here sends a message or calls anyone: buttons only copy text or open the phone dialler (`tel:`).
    - **Emergency screen** — a button under the Safety banner opens a full view with big `tel:100` (Nepal Police), `tel:1145` (National Women Commission) and trusted-person buttons, plus *Hide this app* (same Quick hide screen as the header button, also when Shared Device Mode is off).
    - **Trusted person + safe check-in** — after the safety-rules card. Save one name and number (`wp_trusted_contact`), pick an applied job and a time, copy a plan message to send yourself, and start a check-in (`wp_checkin`). When the time passes (checked on open and every 20 seconds) the card turns into an alert with a *Call* button. Tip: choose "2 minutes (to try it)".
    - **End this chat safely** — in a client chat that has at least one client message: saves the whole chat as one Evidence Vault item (`wp_evidence`), blocks the client (`wp_client_actions`) and shows a report you can copy.
    - **If you talk or meet** — a checklist on job detail, shown only when the job's meeting time does not say "no meetings".
    - **Quiet hours** — a settings row after the trusted-person card (`wp_quiet`). While active (toggle on and inside the From–To window, which may cross midnight) chats show a calm card with a ready reply above the composer. To try it, set From to the current hour. It is independent of the "No work messages after 8 PM" rule.

## Run the web app

Steps: unzip → npm install → npm run dev

```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

On the welcome screen choose a language, then "Continue as Maya (demo)".

## Chrome extension

The `extension/` folder is a Manifest V3 extension (plain HTML/CSS/JS, no build step).

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose the `extension` folder.
3. Select text on any page, right-click → **Check with WorkShield**, or click the toolbar icon and paste text.

All checks run on the device; nothing is sent anywhere. See `extension/README.md` for details.

> WorkPassport gives suggestions and safety warnings. A check with no danger signs is not a promise of safety. The final decision is always yours.

## Net Payment Preview (added in v11)
Shows what a freelancer actually receives in NPR after estimated payment fees (Bank transfer, Payoneer, Wise).
Appears on the job detail page, in the final step of Guided Apply (before "Send Application"),
and as a small calculator in My WorkPassport > Getting paid. Fees are sample estimates (see NetPayPreview in src/App.jsx).

## Hosting notes (e.g. Vercel)

- Build command `npm run build`, output folder `dist`. No environment variables and no backend.
- Shared Device Mode is prototype-level privacy only: the PIN is stored as plain text in the browser's localStorage and is not real security.
- The Chrome extension opens `http://localhost:5173/` (`APP_URL` at the top of `extension/popup.js`). Once the hosted address is known, update that one line and reload the extension. The extension folder was intentionally left unchanged.


## Client demo (post a job, applicants, agreement)

On the FirstWork page, tap "Post a job — client demo". This opens a clearly-labelled client side of WorkPassport:

1. Fill the guided form and tap "Post this job". The job is saved in the browser (localStorage key `wp_client_jobs`) and appears at the top of the FirstWork feed with a "Posted by you" chip. Its detail page, apply wizard, chat and workroom work like any other job.
2. In "My posted jobs", tap "View applicants" to see three demo applicants as Passport-style cards (same three for every job).
3. Tap "Accept" to open a simple agreement (deliverables, agreed price, deadline, revisions, milestones). "Confirm agreement" saves it on the job.

A fresh demo job is deliberately marked "Payment method not verified". The `extension/` folder is unchanged.

## SkillBridge

Open it from My WorkPassport (SkillBridge card) or from the link at the bottom of a job page's Skill Match card. It compares the current user's skills with the combined job list (client-posted jobs plus the 18 sample jobs) and shows an Opportunity Counter, skill gaps with a free resource and a small practice task, and skills often asked together. Everything is computed on open (`computeSkillBridge` in `src/App.jsx`); no new localStorage keys. Proof of a practice task is a photo or link added in the Passport.

## Institution Insight (aggregate-only)

Open Bring an Opportunity, then the "Institution Insight" card. The page shows group numbers only for a partner training institute: sample cohort skills (code constant `DEMO_COHORT`) against job demand counted live from the combined job list, plus the biggest gap and a suggested response. It holds no learner names, no per-person rows and no earnings. No new localStorage keys.
