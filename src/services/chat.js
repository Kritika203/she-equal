// Start demo chats and check messages.

import { analyzeMessage, analyzeText } from './safety.js';



export const CHAT_CANNED = [
  "Okay, thank you. Please start with the first part.",
  "Can you finish it by tomorrow?",
  "Please send the first draft when it is ready.",
];

export function seedThread(job) {
  const now = Date.now();
  const texts = job.id === 'j2'
    ? [
        "Hello, thank you for starting. The photos for the first posts are in the folder I shared.",
        "One more thing — can you also make 3 short videos for TikTok? That was not in our list, but it should be quick.",
      ]
    : job.id === 'j3'
    ? [
        "Hi Maya, thank you for applying. I will send you the product file today.",
        "The file has 500 rows. Please copy name, price and SKU carefully.",
        "Also, are you still up? Send me a selfie so I know you are real, then we continue.",
      ]
    : [
        "Hi, thank you for applying for " + job.title + ".",
        "Please start with the first part and tell me if you have any questions.",
      ];
  return texts.map((text, i) => ({ from: 'client', text, ts: now - (texts.length - i) * 60000 }));
}

export function checkChatText(text) {
  const cats = analyzeMessage(text);
  const f = analyzeText(text);
  const yellow = f.yellow.filter(id => id !== 'vague' && id !== 'nopay');
  const verdict = f.red.length ? 'danger' : yellow.length ? 'warning' : 'ok';
  return { cats, red: f.red, yellow, verdict };
}
