# WorkShield — Chrome extension (WorkPassport prototype)

WorkShield for your browser. Beginners find most jobs outside the app — on Facebook, job sites and in chats. This extension takes the same help from the WorkPassport web app with you: a scam checker for job posts, a boundary checker for client messages with ready-made replies, job tools (skills, price, plain-words explainer, saved jobs), help writing an application, and quick access to your WorkPassport link.

It uses the same rules as the web app (`rules.js` holds a copy of the app's rule engines and texts).

## The four tabs

**Check**
- **Job check** — the WorkShield scam checker. Paste or select a job post and get a verdict with plain-language warning signs.
- **Message check** — the Safety boundary checker for client chat messages. It shows which boundary was crossed and, under **Help me reply**, a polite-but-firm reply you can copy. A reply for leaving the job is always shown last.
- **Or pick a situation** — seven chips (Photo ask, Call pressure, Late night, Personal questions, Meeting ask, Rude / threats, Leave the job). Tap one to get its reply straight away, with no message text needed.
- **Save as proof** — after a Message check that found a problem, save the message, so you have a record. Saved proof is listed under "Saved proof (on this device)" (newest first, up to 10, each can be deleted).
- **Recent checks** — your last 5 checks (both kinds), with a **Clear** button.
- **Auto-check (new in 1.2.0)** — when text arrives from the right-click menu, or from **Use selected text on this page**, WorkShield checks it straight away with both engines. If a message crosses a boundary you see the Message result (with reply cards and **Save as proof**); otherwise you see the Job result. The text stays in the box so you can edit it and tap **Check it** again. Typing or pasting and tapping **Check it** works as before.

**Job tools (new in 1.2.0)**
- Paste a job post (or use **Use selected text on this page**), then tap one of three buttons. The result appears in one area; the last button you tapped wins.
- **Your skills** — chips for the six skills of the demo WorkPassport (Photoshop, Canva, Logo Design, Social Media Posts, English Writing, Typing/Data Entry). Tap to switch a skill on or off. Type a name and tap **Add** to add one of the other known skills (Excel, Figma, Video Editing, Translation, WordPress, SEO). Saved on this device; at the start all six are on.
- **Check skills** — shows the skills the job asks for that you have, and those you do not have yet, with how many of the 12 sample jobs saved in the extension ask for each. The counts come from those 12 sample jobs only.
- **Check price** — finds the first dollar price, compares it with the rough beginner range, then shows a small net preview in rupees for Bank transfer, Payoneer or Wise (sample fee model: bank 2% + $15, Payoneer 2%, Wise 1.5% + $1; sample rate 1 USD = NPR 133). These are sample estimates.
- **Explain** — pay line (USD and NPR before fees), a deadline found in the text (a plain pattern match; nothing is rewritten), a watch-out line from the scam checker, and simple meanings for words like milestone, escrow, NDA, sample and deadline.
- **Save this job** — saves the first line of the text, the page address (when it can be read) and the date. Saved jobs are listed under the button (newest first, up to 20) with **Open** and **Remove**. They stay inside the extension; in the full WorkPassport, these would appear in My Opportunities.
- **EN / नेपाली** — a small switch at the top of the popup. It changes the Job tools tab (labels and results) between English and Nepali. The other tabs stay in English, with the Nepali line under the verdict headline.

**Apply help**
- A small version of the app's Guided Apply. Enter your name, the job title, your skills and your price in USD. You get a rough beginner price guide and the price in NPR (sample rate: 1 USD = NPR 133).
- **Make my application** builds a proposal in an editable box. **Improve it** adds a missing sample offer, deadline question or thank-you line (each at most once). **Copy application** copies the text. Always read and change it before you send.

**Passport**
- The extension cannot read the web app's data, so you save your WorkPassport link here once. Then **Copy my Passport link** to paste it into any application, or **Open WorkPassport**. **Change link** lets you save a different one.

## How to load it

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and choose this `extension` folder.
4. Pin WorkShield from the puzzle-piece menu in the toolbar.

(If you are updating from version 1.0, click the reload arrow on the WorkShield card.)

## How to use it

- **Right-click menu:** select text on any page, right-click, and choose **Check with WorkShield**. The text is saved for the popup. If the popup does not open by itself, click the WorkShield icon (it shows a small red "1").
- **Use selected text:** open the popup and click **Use selected text on this page**. The text is checked straight away.
- **Paste:** open the popup, paste text into the box, then click **Check it**.
- **Reply to a client:** in **Message check**, check the message and copy a reply, or pick a situation chip.
- **Apply for a job:** open **Apply help**, fill in the form, tap **Make my application**, improve it if you like, then copy it.
- **Share your Passport:** open **Passport**, save your link once, then copy it whenever you apply.

The popup always opens on the **Check** tab. If a right-click selection is waiting, it is checked as soon as the popup opens.

## Permissions, in plain words

| Permission | Why |
| --- | --- |
| `activeTab` | Lets the popup read the text you selected on the current page, only after you click the button. |
| `scripting` | Used for that one read of your selection. |
| `contextMenus` | Adds the right-click item "Check with WorkShield". |
| `storage` | Keeps a right-click selection for the popup, and your saved name, Passport link, saved proof, recent checks, chosen skills, saved jobs and language choice, on this device only. |

There are **no host permissions**. The extension cannot read any website on its own — it only sees text you select and click on.

## Privacy

- Text is read only when you select it and click.
- All checks run on your device. There are no network calls and no servers.
- Nothing is collected, tracked or sent anywhere.
- Saved proof, saved jobs, your skills, your Passport link, your name and recent checks are kept only in this browser's extension storage. Use **Delete** or **Clear**, or remove the extension, to erase them.

## Current limits (prototype)

- The Job tools tab can be switched to Nepali. The other tabs are in English, with a Nepali line under the verdict headline. The full English / Nepali experience is in the web app.
- Saved proof, your Passport link, your name and recent checks live only in this browser's extension storage. They do not sync to other devices or to the web app.
- The extension cannot read your WorkPassport from the web app; you paste your link once.
- The price guide, NPR amount, fee model and skill counts are rough sample values (1 USD = NPR 133; counts come from 12 sample jobs).
- Deadline and glossary matching are simple word patterns; they can miss unusual wording.
- The icon is Chrome's default (no icon files in this prototype).
- "Open WorkPassport" opens `http://localhost:5173/` (set at the top of `popup.js` as `APP_URL`).
- A check with no danger signs is not a promise that a job or message is safe. The final decision is always yours.
