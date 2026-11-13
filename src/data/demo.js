// Demo users and options for sample forms.



export const ALL_SKILLS = ["Canva", "Photoshop", "Logo Design", "Social Media Posts", "English Writing", "Nepali Writing", "Typing / Data Entry", "Translation", "Video Editing", "Excel / Spreadsheets", "Customer Chat Support"];

export const ALL_CATEGORIES = ["Design", "Writing", "Data Entry", "Social Media", "Translation", "Virtual Assistant", "Video"];

export const DISTRICTS = ["Kathmandu", "Lalitpur", "Bhaktapur", "Morang", "Kaski", "Chitwan", "Sunsari", "Rupandehi", "Banke", "Other"];

export const MAYA_PROFILE = {
  name: "Maya Shrestha",
  district: "Morang",
  workWanted: ["Design", "Social Media", "Data Entry"],
  skills: ["Canva", "Photoshop", "Logo Design", "Social Media Posts", "English Writing", "Typing / Data Entry"],
  safetyRules: { chat: true, calls: true, time: true, photo: true, hours: true },
  badge: "Beginner",
  headline: "Design graduate — logos, social media posts and Canva designs",
  about: "I am a design graduate from Biratnagar. I make logos, invitation cards and social media posts. I work carefully, show drafts early, and send finished work on time.",
  languages: ["Nepali", "English", "Hindi"],
  availability: "Weekdays and Saturday, about 15 hours a week",
  rateNote: "Most small design jobs: NPR 3,000 – 8,000",
  tools: ["Laptop", "Smartphone", "Canva (free)", "Photoshop"],
  training: [
    { title: "Graphic Design course", where: "ABC Training Institute, Biratnagar", year: "2026" },
    { title: "Higher secondary — computer science", where: "Biratnagar", year: "2024" }
  ]
};

export const CLIENT_PROFILE = { name: "Bikash Tamang", business: "Tamang Trek Gear", town: "Kathmandu" };

export const CLIENT_SEED_JOB = {
  id: "cj-seed-1",
  title: "Design a logo and shop tags for a trekking gear shop",
  category: "Design",
  clientName: "Bikash Tamang (Tamang Trek Gear)",
  clientCountry: "Nepal",
  clientType: "Small business",
  paymentVerified: false,
  beginnerFriendly: true,
  description: "Our trekking shop in Kathmandu needs a simple logo and matching price tags for the shop. The logo should show mountains and be easy to print in one colour. Tags should be clean and easy to read.",
  skillsRequired: ["Logo Design", "Video Editing"],
  budgetUSD: 60,
  budgetType: "fixed",
  postedHoursAgo: 5,
  applicants: 3,
  jobsPostedByClient: 1,
  hireRate: 0,
  memberSince: 2026,
  clientRating: 0,
  aboutClient: "Posted from the client demo.",
  needsOwnLaptop: true,
  internetNeed: "Basic",
  meetingTimeNepal: "Flexible — no meetings",
  deadlineDays: 7,
  caution: null,
  deliverables: ["One logo (PNG and source file)", "10 price tag designs"],
  clientProvides: ["Shop name and colours"],
  revisionsIncluded: 1,
  accepted: null,
  seededDemo: true
};

export const PF_LANG_OPTIONS = ["Nepali", "English", "Hindi", "Maithili", "Tharu", "Newari", "Tamang", "Other"];

export const PF_TOOL_OPTIONS = ["Laptop", "Smartphone", "Canva (free)", "Photoshop", "MS Excel", "Google Docs", "CapCut", "Printer access"];

export const DEMO_SEED = { Photoshop: 'institution', Canva: 'demonstrated' };

export const DEMO_INSTITUTE = "ABC Training Institute, Biratnagar — Graphic Design course";

export const DEMO_COHORT = { institute: "ABC Training Institute, Biratnagar", learners: 48, verified: { "Photoshop": 32, "Canva": 28, "Typing / Data Entry": 21, "English Writing": 18, "Logo Design": 15, "Social Media Posts": 12, "Excel / Spreadsheets": 3, "Video Editing": 2, "Nepali Writing": 0, "Translation": 0, "Customer Chat Support": 0 } };

export const DEMO_APPLICANTS = [
  { id: 'a1', name: 'Sunita Rai', place: 'Kathmandu', skills: [{ name: 'Canva', level: 'demonstrated' }, { name: 'Social Media Posts', level: 'self' }], proofs: 2, asks: 55, availability: 'Available now', completed: 0 },
  { id: 'a2', name: 'Prerana Shrestha', place: 'Pokhara', skills: [{ name: 'Photoshop', level: 'institution' }, { name: 'Logo Design', level: 'demonstrated' }], proofs: 4, asks: 70, availability: 'Available from Monday', completed: 1 },
  { id: 'a3', name: 'Anisha Tamang', place: 'Dharan', skills: [{ name: 'Typing / Data Entry', level: 'demonstrated' }, { name: 'Excel / Spreadsheets', level: 'self' }], proofs: 1, asks: 45, availability: 'Available now', completed: 0 },
];
