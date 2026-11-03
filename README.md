# WorkPassport — prototype

WorkPassport helps first-time freelancers (mostly young women in Nepal) get a first online job safely. It is a frontend-only prototype: no backend, dummy data, everything stays in the browser. The app is fully bilingual (English / नेपाली).

## What is inside

1. **FirstWork** — 18 curated beginner jobs with search, filters, job detail, a 4-step Guided Apply and My Opportunities.
2. **My WorkPassport** — a proof record with evidence levels, micro-task skill tests, a share link, a public proof-first view, client confirmation (demo) and a Getting Paid checklist.
3. **WorkShield** — paste a job post and get a rule-based scam check with explained findings.
4. **Safety** — paste a client chat message and get a rule-based boundary check, ready-made replies and saved proof.
5. **Client chat** — in My Opportunities → Applied, tap *Message client*. Inside the chat, a shield button (or *Check this message* under any client bubble) opens a pop-up that runs both WorkShield and Safety checks, shows ready replies to copy, and can save a message as proof. Threads are stored in `wp_chats`.
6. **Extension** — a practice page that uses the real checkers, plus the real Chrome extension in `extension/`.

7. **Privacy and ease** — on My WorkPassport, after the safety rules. *Shared Device Mode* (PIN lock on load, hidden earnings, private notifications, Quick hide, "Lock now" in the user menu) and *Low-Data / Simple Mode* (112.5% text, chat and application drafts kept on the device). Stored in `wp_settings`, `wp_chat_drafts`, `wp_apply_draft`.
8. **Client options** — in a chat, mute, block or report the client (also inside the check pop-up). Stored in `wp_client_actions`.

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
