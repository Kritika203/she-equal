# How the code is organised

The original project kept almost everything in `src/App.jsx`. It is now split by what each part does.

- **App.jsx:** Keeps the current page and shared state. It passes data to pages through props.
- **pages:** Full screens, such as FirstWork, Passport, Apply, Chat and WorkShield.
- **components:** UI parts used by pages, such as the header, job cards and privacy controls.
- **services:** Functions that do checks or calculations. Safety rules and SkillBridge logic are here instead of mixed into page JSX.
- **data:** Sample job listings and demo users.
- **i18n:** Separate English and Nepali strings.
- **hooks:** React hooks for saving browser data and updating the clock.
- **utils / constants:** Small helpers and shared settings.

To change a label, look in `src/i18n/`. To change a safety rule, look in `src/services/safety.js`. To change a screen, start in `src/pages/`. To add a reusable button or similar UI, use `src/components/`.

All existing localStorage key names were kept. The Chrome extension was not refactored, so it is identical to the supplied v22 version.

One small existing issue was fixed: deleting saved proof in the Safety screen now has the missing `delProof` handler.
