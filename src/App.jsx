import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Shield, ShieldCheck, ShieldAlert, CheckCircle2, Bookmark, MapPin, 
  Search, SlidersHorizontal, ChevronLeft, Flag, Volume2, User, 
  LogOut, Check, ArrowRight, Lock, Bell, ChevronDown, CheckSquare, Square, X, Info, AlertTriangle, Sparkles, MessageSquare, Send, Wallet,
  EyeOff, Sun, MoreVertical, BellOff, Ban, ClipboardList, ImagePlus, Link2, Trash2, Download, HeartHandshake, Plus
} from 'lucide-react';

// --- TRANSLATIONS DICTIONARY ---
const DICT = {
  en: {
    nav_shield_safety: "WorkShield & Safety",
    sfs_banner_title: "Safety — if someone is harassing you",
    sfs_banner_intro: "If a client sends messages that make you uncomfortable, check them here. Set your boundaries, get help to reply, and save proof.",
    pr_title: "Your proof",
    pr_count: "{n} proof items",
    pr_chip_you: "Added by you",
    pr_chip_freelancer: "Added by the freelancer",
    pr_add_photo: "Add a photo",
    pr_add_link: "Add a link",
    pr_note_label: "Note (optional)",
    pr_note_ph: "What is this work?",
    pr_photo_err: "That photo could not be read. Try another one.",
    pr_storage_err: "Storage is full on this device. Delete an old photo and try again.",
    pr_link_label: "Portfolio link",
    pr_link_err: "Please paste a full link, starting with http",
    pr_none: "No proof added yet. Add a photo or a link of your work.",
    pr_gallery_title: "Work samples",
    pr_honesty: "Proof added by the freelancer. The badges show what has been checked.",
    pdf_btn: "Download PDF",
    pdf_skills_proof: "Skills and proof",
    pdf_footer: "Badges show how each skill was checked. Proof photos and links were added by the freelancer.",
    pdf_made_on: "Made on {date}",
    sf_title: "Stay safe in client chats",
    sf_intro: "If a client's message feels wrong, paste it here. We will show you what is wrong, what you can reply, and what to do next.",
    sf_three_title: "Three things to remember",
    sf_r1: "You can stop any job that feels wrong. You do not need a big reason.",
    sf_r2: "You never owe a client photos, calls or personal details.",
    sf_r3: "Saving a screenshot or the message keeps proof if you need help later.",
    sf_check_title: "Check a client message",
    sf_placeholder: "Paste the client's message here…",
    sf_check: "Check message",
    sf_private: "The message stays on this device.",
    sf_ex1: "Example: night photo ask",
    sf_ex2: "Example: call pressure",
    sf_ex3: "Example: normal message",
    sf_ok_title: "No boundary problems found in this message.",
    sf_ok_line: "If it still feels wrong to you, trust your feeling. You can always use the replies and steps below.",
    sf_cross_title: "This message crosses a line.",
    sf_cross_line: "You did nothing wrong. Here is what we found:",
    sf_breaks: "Breaks your rule: {rule}",
    sf_no_one: "No one may speak to you like this.",
    sf_off_note: " (This rule is off in your Passport — you can turn it back on.)",
    sf_reply_title: "Help me reply",
    sf_reply_intro: "Copy a reply and paste it in the chat. Change any words you want — they are a starting point.",
    sf_exit_label: "If you want to leave the job",
    disc_reply: "These replies are suggestions to help you. Read before you send and change any words you like — you know the situation best. WorkPassport is not responsible for what happens after you send a message.",
    sf_next_title: "What to do next",
    sf_step1: "Do not reply in a hurry or in anger. It is okay to wait.",
    sf_step2: "Save proof before you block: take a screenshot, or save the message below.",
    sf_save_proof: "Save this message as proof",
    sf_step3: "To report on this app: open the job and tap Report. On other apps, use Block. You do not owe anyone a reply.",
    sf_step4: "If you ever feel in danger, tell a person you trust, or call Nepal Police at 100.",
    sf_saved_toast: "Saved to your proof",
    sf_deleted: "Deleted",
    sf_delete: "Delete",
    sf_on: "On",
    sf_off: "Off",
    sf_edit_rules: "Edit in my WorkPassport",
    sf_proof_title: "Your saved proof",
    sf_proof_empty: "Nothing saved yet. If a message crosses a line, save it here as proof.",
    sf_proof_private: "Proof is saved only on this device.",
    ev_title: "Evidence Vault",
    ev_open: "Open Evidence Vault",
    ev_private: "Only you can see this page. Nothing here is shared unless you export it yourself.",
    ev_count: "{n} saved items",
    ev_empty: "Nothing saved yet. When you check a message and tap \"Save as proof\", it will be kept here.",
    ev_src_chat: "From chat: {jobTitle}",
    ev_src_page: "From a safety check",
    ev_src_none: "Saved earlier",
    ev_hidden: "Message hidden in Shared Device Mode",
    ev_pdf: "Download report (PDF)",
    ev_copy: "Copy report as text",
    ev_caution: "The report includes the full text of your saved messages. Share it only with people you trust.",
    ev_rep_title: "Evidence Report",
    ev_intro: "This report was made by {name} from messages saved in the Evidence Vault.",
    ev_item: "Item {n}",
    ev_foot: "These messages were saved by the user. WorkPassport did not check or change them.",
    sh_title: "Check a job or message",
    sh_intro: "Paste a job post or a client's message. WorkShield looks for warning signs and explains them in simple words.",
    sh_placeholder: "Paste the job post or message here…",
    sh_check: "Check it",
    sh_private: "Your text stays on this device. Nothing is sent anywhere.",
    sh_try: "Try an example",
    sh_ex1: "Example: scam message",
    sh_ex2: "Example: unclear job",
    sh_ex3: "Example: clear job",
    sh_or_job: "Or check a FirstWork job",
    sh_v_danger: "Danger signs found — be very careful",
    sh_v_warning: "Some warning signs — check before you reply",
    sh_v_ok: "No danger signs found",
    sh_s_danger: "Do not send money, photos or codes. Do not reply in a hurry.",
    sh_s_warning: "Ask the questions below before you agree to anything.",
    sh_s_ok: "This looks normal. Still keep chat inside the app and confirm pay before you start.",
    sh_f_fee: "It asks you to pay money first. Real clients pay you — never pay to get a job.",
    sh_f_otp: "It asks for an OTP, password or bank PIN. Never share these with anyone.",
    sh_f_crypto: "It talks about gift cards or crypto payment. This is a common scam sign.",
    sh_f_highpay: "The pay sounds too good for simple work. Very high pay for easy work is a common trick.",
    sh_f_offplatform: "It asks you to chat outside the app (WhatsApp, Telegram or a personal number). Chatting inside the app is safer.",
    sh_f_photo: "It asks for your personal photo. You never need to send personal photos for work.",
    sh_f_urgency: "It pressures you to act fast. Scammers rush you so you cannot think.",
    sh_f_freetrial: "It asks you to do free work first. A tiny sample is okay, but full work should be paid.",
    sh_f_vague: "The work is not clearly described. Ask exactly what you must deliver before you start.",
    sh_f_nopay: "Payment is not mentioned. Ask the amount and how you will be paid before you start.",
    sh_f_lowpay: "The pay looks very low for this work. Compare with similar jobs in FirstWork.",
    sh_f_unverified: "This client is not verified. Be extra careful, and keep all chat inside the app.",
    sh_f_clearwork: "The work is clearly described.",
    sh_f_paymethod: "Pay and how you will be paid are mentioned.",
    sh_f_deadline: "A deadline or time is mentioned.",
    sh_f_verified: "This client is verified on WorkPassport.",
    sh_f_normalpay: "The pay is in the normal range for FirstWork jobs.",
    sh_next_title: "What to do next",
    sh_n_danger1: "Do not pay anything or send any code or photo.",
    sh_n_danger2: "Stop chatting with this client.",
    sh_n_danger3: "You can report this from the job page or just walk away — walking away is always okay.",
    sh_n_warning1: "Ask the questions below and wait for clear answers.",
    sh_n_warning2: "Do not start work until pay and tasks are clear.",
    sh_n_warning3: "Keep all chat inside the app.",
    sh_n_ok1: "Reply politely and confirm the work and pay in writing.",
    sh_n_ok2: "Keep all chat inside the app.",
    sh_n_ok3: "When you finish, ask the client to confirm your work for your Passport.",
    sh_q_title: "Questions you can ask the client",
    sh_q_nopay: "Could you please confirm the payment amount and how I will be paid before I start?",
    sh_q_vague: "Could you please list exactly what I need to deliver?",
    sh_q_lowpay: "This is below the usual rate for this kind of work. Could we discuss the price?",
    sh_copy: "Copy",
    sh_copied: "Copied",
    sh_check_another: "Check another",
    sh_save: "Save this check",
    sh_saved_toast: "Saved to your past checks",
    disc_shield: "WorkShield checks for common warning signs. It cannot see everything. A check with no danger signs is not a promise that a job is safe. The final decision is always yours.",
    sh_hist_title: "Your past checks",
    sh_hist_empty: "You have not saved any checks yet.",
    sh_clear: "Clear history",
    sh_cleared: "History cleared",
    sh_pill_danger: "Danger",
    sh_pill_warning: "Careful",
    sh_pill_ok: "No signs",
    pp_beginner: "Beginner",
    pp_progress: "Your progress",
    pp_enc1: "Your Passport is just starting. Prove one skill to grow it.",
    pp_enc2: "Good progress. Real client work makes it much stronger.",
    pp_enc3: "Strong Passport. Clients can trust this proof.",
    pp_stat_skills: "Skills proven",
    pp_stat_jobs: "Jobs completed",
    pp_stat_earned: "Earned so far",
    pp_share: "Share my Passport",
    pp_see_clients: "See what clients see",
    pp_institute_pending: "Institute: {name} — verification pending",
    pp_share_desc: "Anyone with this link can see your public Passport. Your phone number and earnings stay private.",
    pp_copy_link: "Copy link",
    pp_link_copied: "Link copied",
    pp_whatsapp: "Share on WhatsApp",
    pp_close: "Close",
    pp_skills_title: "Your skills and proof",
    pp_lvl_self: "Self-added",
    pp_lvl_demonstrated: "Skill demonstrated",
    pp_lvl_institution: "Institution-verified",
    pp_lvl_client: "Client-confirmed",
    pp_lvl_platform: "Platform-verified",
    pp_desc_self: "You added this yourself. No proof yet.",
    pp_desc_demonstrated: "You passed a small test task in this app.",
    pp_desc_institution: "Your training institute confirmed your course.",
    pp_desc_client: "A real client confirmed your finished work.",
    pp_desc_platform: "Work finished and checked on WorkPassport.",
    pp_source: "Source:",
    pp_src_demo: "Small test passed in this app",
    pp_take_test: "Take a small test",
    pp_next_demo: "Next: get a client job to reach Client-confirmed.",
    pp_next_inst: "Strong proof. Client work can raise it further.",
    pp_top: "Top-level proof.",
    pp_how_title: "How proof works",
    pp_test_title: "Small test: {s}",
    pp_test_sub: "3 short questions. Pass 2 to prove this skill.",
    pp_q_of: "Question {n} of 3",
    pp_next: "Next",
    pp_finish: "See my result",
    pp_type_here: "Type here",
    pp_col_name: "Name",
    pp_col_phone: "Phone",
    pp_pass: "Test passed! {s} is now Skill demonstrated.",
    pp_pass_toast: "Skill demonstrated: {s}",
    pp_fail: "Not yet — you got {n} of 3. Read the job tips and try again.",
    pp_try_again: "Try again",
    pp_back_my: "Back to my Passport",
    pp_work_title: "Completed work",
    pp_work_empty: "No completed work yet. Your finished, client-confirmed jobs will live here as your strongest proof.",
    pp_find_job: "Find a safe first job",
    pp_applied_head: "Applied jobs",
    pp_done_head: "Completed jobs",
    pp_demo_confirm: "Demo: mark as client-confirmed",
    pp_confirm_toast: "Added to your Passport as Client-confirmed proof.",
    pp_earned_line: "Earned ≈ NPR {n}",
    pp_confirmed_demo: "Confirmed by the client (demo)",
    pp_completed_status: "Completed — added to Passport",
    pp_pay_title: "Getting paid",
    pp_pay_1: "I have a bank account in my name",
    pp_pay_2: "I have a mobile wallet (eSewa or Khalti)",
    pp_pay_3: "I have a citizenship card or ID for verification",
    pp_pay_4: "I know the client pays through a licensed payment partner — WorkPassport never holds my money",
    np_title: "What you will actually receive",
    np_bank: "Bank transfer",
    np_price: "Job price",
    np_rupees: "In rupees",
    np_fees: "Estimated fees",
    np_receive: "You receive (about)",
    np_warn: "The fees are more than the pay. Ask for a different payment way.",
    np_calc_label: "Job price (USD)",
    disc_paynet: "These fees are sample estimates for this prototype. Real fees depend on the payment service and the bank. Always check the real fee before you agree.",
    disc_pay: "This checklist is guidance only. WorkPassport does not move or hold money; a licensed payment partner does. Always confirm the payment method with the client before you start work.",
    pp_rules_title: "My safety rules",
    pp_preview_note: "Preview: this is what clients see.",
    pp_public_strip: "Verified proof first — this freelancer is judged by their work.",
    pp_public_empty: "New freelancer — no client jobs yet, skills proven by tests and institute.",
    pp_working_rules: "Working rules:",
    pp_about: "About this freelancer",
    pp_public_footer: "Shared from WorkPassport — a working title prototype.",
    // Welcome & Login
    lang_en: "English",
    lang_ne: "नेपाली",
    welcome_title: "Your skills deserve a first chance.",
    welcome_sub: "Safe first jobs and a work record that proves what you can do — made for first-time freelancers in Nepal.",
    btn_new: "I am new — Create my WorkPassport",
    btn_login: "I have an account — Log in",
    btn_demo: "Continue as Maya (demo)",
    privacy_note: "Using a family or shared laptop? Your details stay private. Always log out when you finish.",
    login_step1_title: "Log in",
    phone_label: "Mobile number",
    phone_err: "Please enter a correct mobile number.",
    btn_send_code: "Send code",
    login_step2_title: "Enter the 4-digit code",
    code_hint: "Demo: enter any 4-digit code.",
    btn_verify: "Verify and Log in",
    back: "Back",
    welcome_toast: "Welcome back, Maya.",
    // Setup Wizard
    setup_step1: "About you",
    full_name: "Full name",
    name_placeholder: "e.g. Maya Shrestha",
    district: "District",
    work_wanted: "What work do you want?",
    next: "Next step",
    setup_step2: "Your skills",
    skills_note: "Choose honestly. Later you can prove skills with small test tasks and they become verified.",
    institute_label: "Where did you learn? (optional)",
    institute_placeholder: "e.g. ABC Training Institute, Biratnagar",
    setup_step3: "Your safety rules",
    safety_note: "Set your boundaries. Clients will see these rules, and WorkShield will protect them.",
    rule_chat: "Only talk about work in chat",
    rule_calls: "No phone or video calls",
    rule_time: "No work messages after 8 PM",
    rule_photo: "Never send personal photos",
    rule_hours: "I decide my own working hours",
    btn_create_wp: "Create my WorkPassport",
    setup_success_title: "Your WorkPassport is ready",
    setup_success_sub: "Right now your skills are marked 'Self-added'. Finish small test tasks and real jobs to make them verified proof.",
    btn_find_job: "Find my first job",
    btn_see_wp: "See my WorkPassport",
    // Nav & Shell
    nav_firstwork: "FirstWork",
    nav_passport: "My WorkPassport",
    nav_shield: "WorkShield",
    nav_safety: "Safety",
    nav_ext: "Extension",
    nav_logout: "Log out",
    nav_logout_toast: "You are logged out. Your details are hidden on this device.",
    fw_banner: "Every job on FirstWork is checked by our team before it appears here.",
    footer_text: "WorkPassport — prototype. Dummy data for demonstration.",
    // FirstWork Feed
    fw_title: "FirstWork",
    fw_sub: "Safe first jobs, checked for beginners.",
    search_placeholder: "Search jobs, skills, clients...",
    filters: "Filters",
    cat_all: "All Categories",
    budget_all: "All Budgets",
    budget_fixed: "Fixed price",
    budget_hourly: "Per hour",
    tog_beginner: "Beginner Friendly only",
    tog_verified: "Payment Verified only",
    tog_match: "Matches my skills",
    sort_by: "Sort by",
    sort_new: "Newest",
    sort_high: "Budget: High to Low",
    sort_low: "Budget: Low to High",
    sort_match: "Best skill match",
    no_jobs: "No jobs match these filters.",
    clear_filters: "Clear filters",
    // Job Card & Detail
    payment_verified: "Payment Verified",
    payment_unverified: "Payment not verified",
    beginner_friendly: "Beginner Friendly",
    applied_count: "applied",
    view_job: "View Job",
    listen: "Listen",
    caution: "Caution",
    back_to_jobs: "Back to jobs",
    save: "Save",
    saved: "Saved",
    report: "Report",
    sample_rate: "Sample rate: 1 USD = NPR 133. Final rate depends on the payment provider.",
    about_job: "About this job",
    deliver_title: "What you will deliver",
    client_gives_title: "What the client gives you",
    skills_needed: "Skills needed",
    skill_has: "You have this",
    skill_lacks: "New skill for you",
    match_count: "You match {m} of {t} skills for this job.",
    ws_checked: "WorkShield checked this job",
    ws_ok_scam: "No scam signs found",
    ws_ok_pay: "No payment-before-work request",
    ws_ok_id: "Client identity verified",
    ws_warn_id: "Client payment method NOT verified — ask for milestone payment before starting",
    ws_ok_scope: "Scope matches the pay",
    client_trust: "Client Trust",
    member_since: "Member since",
    jobs_posted: "Jobs posted",
    hire_rate: "Hire rate",
    rating: "Rating",
    about_client: "About the client",
    before_apply: "Before you apply — check this fits you",
    needs_laptop: "Needs own laptop",
    no_laptop: "Smartphone is enough",
    apply_now: "Apply Now",
    job_en_note: "Note: The job details are written in English by the client.",
    // Apply Wizard
    step: "Step",
    of: "of",
    apply_step1: "Why are you right for this job?",
    make_better: "Make it better (AI)",
    apply_step2: "Your price",
    price_fair: "Beginners usually charge ${lo}–${hi} for this kind of job. Your price is in the fair range.",
    price_hint: "Suggested range for this job: ${lo}–${hi}.",
    price_low: "This is quite low. You can ask for more.",
    price_high: "This is higher than usual for a beginner. The client may not reply.",
    delivery_time: "Delivery time",
    days: "days",
    apply_step3: "Your payment preview",
    job_price: "Job price",
    platform_fee: "Platform fee for freelancers",
    free: "Free",
    you_receive: "You will receive",
    receive_note: "This is an estimate to help you plan, not a promise. The real amount depends on the live rate and the licensed payment partner. WorkPassport does not move money and is not responsible for payment delays or losses.",
    confirm_client: "Before you start, confirm with the client:",
    chk_pay: "Payment method agreed",
    chk_mile: "First milestone agreed",
    chk_dead: "Deadline agreed",
    apply_step4: "Review and send",
    ws_confirm: "I checked this job with WorkShield and I want to apply.",
    send_app: "Send Application",
    app_sent: "Application sent!",
    app_sent_desc: "Your application was sent to the client. If they reply, the work will be added to your WorkPassport.",
    view_opps: "View in My Opportunities",
    // Opportunities
    my_opps: "My Opportunities",
    tab_saved: "Saved",
    tab_applied: "Applied",
    no_saved: "You have not saved any jobs yet.",
    no_applied: "You have not applied to any jobs yet.",
    remove: "Remove",
    applied_status: "Applied — waiting for reply",
    // Placeholder
    proto_section: "Prototype section — built next.",
    // Notifications (demo) + form hint
    nt_title: "Notifications",
    nt_demo: "Demo content",
    nt_empty: "No new notifications.",
    nt_dismiss: "Dismiss",
    nt_1: "A client may reply soon. Remember to check your applications.",
    nt_2: "Tip: A real client never asks you to pay first. If a job asks for money, check it in WorkShield.",
    nt_3: "Tip: Pass a skill test to move that skill up in your WorkPassport.",
    err_paste_first: "Paste some text first, then tap the check button.",
    // Extension page
    ex_title: "WorkShield in your browser",
    ex_intro: "Jobs are everywhere — Facebook, job sites, chats. The extension takes WorkShield with you, so you can check a post before you reply.",
    ex_how_title: "How it works",
    ex_s1: "Find a job or message anywhere",
    ex_s2: "Select the text and click 'Check with WorkShield'",
    ex_s3: "See the warning signs in simple words",
    ex_try_title: "Try it here (practice)",
    ex_try_line: "This is a practice copy of the extension. It uses the real checker.",
    ex_tab_job: "Job post",
    ex_tab_chat: "Chat message",
    ex_addr_job: "facebook.com — job post",
    ex_addr_chat: "chat — client message",
    ex_label_job: "Example job post (practice)",
    ex_label_chat: "Example message (practice)",
    ex_btn_job: "Select this post and check it",
    ex_btn_chat: "Select this message and check it",
    ex_open_full: "Open full check",
    ex_open_safety: "Open Safety page",
    ex_close: "Close",
    ex_pop_by: "by WorkPassport",
    ex_inst_title: "How to install (prototype)",
    ex_i1: "In the real app, you would add it from the Chrome Web Store in one click. For this prototype, the extension is a folder named extension inside this project.",
    ex_i2: "Open chrome://extensions in Chrome and turn on Developer mode (top right).",
    ex_i3: "Click 'Load unpacked' and choose the extension folder.",
    ex_i4: "Pin WorkShield from the puzzle-piece menu. Now select text on any page, right-click, and choose 'Check with WorkShield' — or click the WorkShield icon and paste text.",
    ex_i_note: "No account is needed and it works offline.",
    ex_priv_title: "Your privacy",
    ex_p1: "The extension reads text only when you select it and click. It never reads a page on its own.",
    ex_p2: "Checks happen on your device. Your text is never sent to a server.",
    ex_p3: "It asks only for the smallest permissions: reading your selection when you click, and saving your checks on this device.",
    disc_ext: "The extension gives the same checks as WorkShield and Safety in this app. A check with no danger signs is not a promise that a job or message is safe. The final decision is always yours.",
    // Report
    report_title: "Report this job",
    rep_1: "Scam or fake job",
    rep_2: "Asked for money first",
    rep_3: "Bad or personal messages",
    rep_4: "Unpaid test work",
    rep_5: "Other",
    send_report: "Send Report",
    cancel: "Cancel",
    report_toast: "Thank you. Our team will check this job.",
    // Disclaimers
    ai_label: "AI suggestion",
    disc_proposal: "Written with AI help. Please read it and change it in your own words before sending. You are responsible for what you send to the client.",
    disc_price: "This price is only a suggestion from similar jobs. The final price is always your decision.",
    disc_ws: "WorkShield can miss things or be wrong sometimes. If anything feels unsafe, stop — do not send money, passwords, or personal details to anyone.",
    tc_title: "About this client",
    tc_facts: "Checked facts",
    tc_since: "On this platform since {year}",
    tc_pay_ok: "Payment method verified",
    tc_pay_no: "Payment method not verified",
    tc_jobs: "Jobs posted: {n}",
    tc_hire: "Hire rate: {n}%",
    tc_rating: "Client rating: {n} / 5",
    tc_new: "New client — no hires yet",
    tc_warn_h: "Warnings — check before you apply",
    tc_warn_pay: "The payment method is not verified. Do not pay any fee to get this job, and ask for milestone payment before you start.",
    tc_none: "No warnings from the automatic checks.",
    disc_trust: "Facts come from the client's profile. Warnings come from automatic checks — they help you decide, but they are not proof that a client is good or bad.",
    sm_title: "Your skills for this job",
    sm_all: "You have every skill this job asks for.",
    sm_some: "You have {x} of the {y} skills for this job.",
    sm_have: "You have this",
    sm_new: "New for you",
    sm_apply: "You can still apply. Many clients accept beginners who are learning.",
    oc_title: "Does this job fit your life?",
    oc_meet: "Live meetings (Nepal time)",
    oc_laptop: "Your own laptop needed",
    oc_yes: "Yes",
    oc_no: "No",
    oc_net: "Internet needed",
    oc_time: "Time to finish",
    disc_footer: "WorkPassport gives suggestions and safety warnings to help you decide. Final decisions — what you send, what price you accept, and which jobs you take — are yours.",
    chat_msg_client: "Message client",
    chat_check: "Check",
    chat_check_msg: "Check this message",
    chat_write: "Write a message…",
    chat_send: "Send",
    chat_close: "Close",
    chat_modal_title: "Check before you reply",
    chat_check_now: "Check now",
    chat_chip1: "Night photo ask",
    chat_chip2: "Call pressure",
    chat_chip3: "Scam message",
    chat_danger_line: "Do not send money, photos or codes.",
    chat_calm_title: "No problems found in this message.",
    chat_calm_line: "If it still feels wrong, trust your feeling.",
    sc_title: "Scope check",
    sc_flag: "This may be extra work. It is not in your agreement for this job.",
    sc_reason: "Words that ask for more work:",
    sc_agreed: "What you agreed to:",
    sc_ok: "This message looks like it is about the agreed work.",
    sc_accept_h: "Reply: I can do it",
    sc_accept_b: "Thank you, I can do this extra work as well. I will add it to my plan and let you know when it is ready.",
    sc_ask_h: "Reply: ask first",
    sc_ask_b: "Thank you for asking. This work is not in our agreement, so it is not included in the agreed price. I am happy to do it as an extra paid milestone. Shall I add it?",
    sc_create: "Create an additional milestone",
    sc_name: "Milestone name",
    sc_price: "Price (USD)",
    sc_save: "Save milestone",
    sc_err: "Please write a name and a price above 0.",
    sc_done: "Added to your Workroom. Open the Workroom to see it.",
    sc_extra_default: "Extra work",
    disc_scope: "This scope check is a suggestion to help you decide. Only you and the client know everything you agreed. The final decision is always yours.",
    chat_open_shield: "Open WorkShield",
    chat_open_safety: "Open Safety page",
    chat_thread_label: "Messages with this client",
    disc_chat: "This check is a suggestion to help you decide. It cannot see everything, and WorkPassport is not responsible for what happens after you reply. The final decision is always yours.",
    pv_title: "Privacy and ease",
    pv_shared_label: "Shared Device Mode",
    pv_shared_desc: "Use this if other people also use your phone. The app asks for a PIN, hides your earnings, and notifications stay private.",
    pv_pin_create: "Create a 4-digit PIN",
    pv_pin_again: "Write it again",
    pv_pin_mismatch: "The two PINs are not the same. Try again.",
    pv_pin_digits: "Use exactly 4 numbers for your PIN.",
    pv_pin_turnoff: "Turn off",
    pv_lock_title: "Enter your PIN",
    pv_lock_open: "Open",
    pv_lock_wrong: "Wrong PIN. Try again.",
    pv_lock_now: "Lock now",
    pv_quick_hide: "Quick hide",
    pv_notif_private: "You have an update",
    pv_weather_title: "Weather in Biratnagar",
    pv_weather_now: "Sunny, 24°",
    pv_weather_return: "Tap here to return",
    pv_simple_label: "Low-Data / Simple Mode",
    pv_simple_desc: "Bigger text, and your drafts are saved on this device if the internet stops.",
    pv_draft_saved: "Draft saved on this device",
    pv_unfinished: "You have an unfinished application",
    ca_options: "Client options",
    ca_mute: "Mute client",
    ca_unmute: "Unmute client",
    ca_block: "Block client",
    ca_unblock: "Unblock",
    ca_report: "Report client",
    ca_muted_note: "You muted this client. New messages will not arrive here.",
    ca_blocked_bar: "You blocked this client. You can unblock any time.",
    ca_report_title: "Report this client",
    ca_r_scam: "Scam",
    ca_r_harassment: "Harassment",
    ca_r_photos: "Asked for personal photos",
    ca_r_other: "Other",
    ca_send_report: "Send report",
    ca_report_toast: "Report sent. Thank you — please also save proof messages.",
    wr_open: "Open workroom",
    wr_title: "Workroom",
    wr_sim_note: "Demo only: these payment states are simulated. In the real WorkPassport, a licensed payment partner moves the money — the app only shows the state.",
    wr_agreement: "Your agreement",
    wr_price: "Price",
    wr_deadline: "Deadline",
    wr_days: "{days} days",
    wr_deliver: "You will deliver",
    wr_provides: "The client provides",
    wr_milestones: "Milestones and payment",
    cl_entry: "Post a job — client demo",
    cl_demo_note: "Demo: this is the client's side of WorkPassport. In the real product, clients sign up with their own accounts.",
    cl_my_jobs: "My posted jobs",
    cl_none: "No jobs posted yet.",
    cl_f_name: "Your name or business",
    cl_f_title: "Job title",
    cl_f_category: "Category",
    cl_f_desc: "Describe the work",
    cl_f_deliv: "Deliverables — what will the freelancer give you?",
    cl_add_one: "Add one more",
    cl_f_skills: "Skills needed",
    cl_f_budget: "Budget (USD)",
    cl_f_deadline: "Deadline (days)",
    cl_f_revisions: "Revisions included",
    cl_req_head: "Requirements",
    cl_f_laptop: "Freelancer needs their own laptop",
    cl_f_internet: "Internet needed",
    cl_f_meeting: "Meeting time (Nepal time)",
    cl_f_beginners: "Beginners can apply",
    cl_submit: "Post this job",
    cl_error: "Please fill the title, at least one deliverable, at least one skill, a budget above 0, and a deadline of at least 1 day.",
    cl_toast_posted: "Job posted.",
    cl_posted_chip: "Posted by you",
    cl_view_applicants: "View applicants",
    cl_applicants: "Applicants",
    cl_demo_applicants: "Demo applicants for this prototype.",
    cl_asks: "Asks",
    cl_availability: "Availability",
    cl_completed: "Jobs completed",
    cl_accept: "Accept",
    ag_title: "Agreement",
    ag_parties: "{client} and {name}",
    ag_price: "Agreed price",
    ag_revisions: "Revisions",
    ag_confirm: "Confirm agreement",
    ag_made: "Agreement made with {name}",
    ag_full_product: "In the full product, the freelancer sees this agreement in her Workroom, and the milestones appear there.",
    disc_agree: "This agreement is a simple summary for this demo. In the real product, both sides confirm it before work starts.",
    wr_progress: "Milestones released: {done} of {total}",
    wr_released_so_far: "Released so far: NPR {x} of NPR {y}",
    wr_s_not_funded: "Not funded",
    wr_s_funded: "Funded",
    wr_s_submitted: "Submitted",
    wr_s_released: "Released",
    wr_demo_fund: "Demo: client funds this",
    wr_submit: "Submit work",
    wr_waiting: "Work submitted. Waiting for the client to confirm.",
    wr_demo_release: "Demo: client confirms and releases",
    wr_complete: "This job is complete. It has been added to your WorkPassport as client-confirmed work."
  },
  ne: {
    nav_shield_safety: "WorkShield र सुरक्षा",
    sfs_banner_title: "सुरक्षा — कसैले तपाईंलाई दुःख दिइरहेको छ भने",
    sfs_banner_intro: "ग्राहकले तपाईंलाई असहज बनाउने सन्देश पठाए भने यहाँ जाँच्नुहोस्। आफ्ना सीमा तोक्नुहोस्, जवाफ दिन मद्दत लिनुहोस्, र प्रमाण सेभ गर्नुहोस्।",
    pr_title: "तपाईंको प्रमाण",
    pr_count: "{n} वटा प्रमाण",
    pr_chip_you: "तपाईंले थप्नुभएको",
    pr_chip_freelancer: "फ्रिलान्सरले थप्नुभएको",
    pr_add_photo: "फोटो थप्नुहोस्",
    pr_add_link: "लिङ्क थप्नुहोस्",
    pr_note_label: "टिप्पणी (ऐच्छिक)",
    pr_note_ph: "यो के काम हो?",
    pr_photo_err: "त्यो फोटो पढ्न सकिएन। अर्को प्रयास गर्नुहोस्।",
    pr_storage_err: "यो उपकरणमा ठाउँ भरिएको छ। पुरानो फोटो मेटाएर फेरि प्रयास गर्नुहोस्।",
    pr_link_label: "पोर्टफोलियो लिङ्क",
    pr_link_err: "कृपया http बाट सुरु हुने पूरा लिङ्क टाँस्नुहोस्।",
    pr_none: "अहिलेसम्म प्रमाण थपिएको छैन। आफ्नो कामको फोटो वा लिङ्क थप्नुहोस्।",
    pr_gallery_title: "कामका नमुनाहरू",
    pr_honesty: "फ्रिलान्सरले थपेको प्रमाण। ब्याजहरूले के जाँच भएको छ भन्ने देखाउँछन्।",
    pdf_btn: "PDF डाउनलोड गर्नुहोस्",
    pdf_skills_proof: "सीप र प्रमाण",
    pdf_footer: "ब्याजहरूले प्रत्येक सीप कसरी जाँच भयो भन्ने देखाउँछन्। प्रमाणका फोटो र लिङ्क फ्रिलान्सर आफैंले थपेका हुन्।",
    pdf_made_on: "{date} मा बनाइएको",
    sf_title: "ग्राहकसँगको च्याटमा सुरक्षित रहनुहोस्",
    sf_intro: "ग्राहकको सन्देश गलत लाग्यो भने यहाँ टाँस्नुहोस्। के गलत छ, के जवाफ दिन सकिन्छ र अब के गर्ने, हामी देखाउँछौं।",
    sf_three_title: "तीन कुरा याद राख्नुहोस्",
    sf_r1: "गलत लागेको जुनसुकै काम तपाईं रोक्न सक्नुहुन्छ। ठूलो कारण चाहिँदैन।",
    sf_r2: "तपाईंले ग्राहकलाई फोटो, कल वा व्यक्तिगत विवरण दिनु पर्दैन।",
    sf_r3: "स्क्रिनसट वा सन्देश सेभ गरेर राख्दा पछि मद्दत चाहिँदा प्रमाण हुन्छ।",
    sf_check_title: "ग्राहकको सन्देश जाँच्नुहोस्",
    sf_placeholder: "ग्राहकको सन्देश यहाँ टाँस्नुहोस्…",
    sf_check: "सन्देश जाँच्नुहोस्",
    sf_private: "सन्देश यही डिभाइसमा रहन्छ।",
    sf_ex1: "उदाहरण: राति फोटो माग्ने",
    sf_ex2: "उदाहरण: कलका लागि दबाब",
    sf_ex3: "उदाहरण: सामान्य सन्देश",
    sf_ok_title: "यस सन्देशमा सीमा नाघेको देखिएन",
    sf_ok_line: "यदि तपाईंलाई अझै गलत लाग्छ भने, आफ्नो मनको कुरा पत्याउनुहोस्। तलका जवाफ र कदमहरू तपाईं जहिले पनि प्रयोग गर्न सक्नुहुन्छ।",
    sf_cross_title: "यो सन्देशले सीमा नाघेको छ।",
    sf_cross_line: "तपाईंले केही गलत गर्नुभएन। हामीले यी कुरा भेट्यौं:",
    sf_breaks: "तपाईंको यो नियम तोड्छ: {rule}",
    sf_no_one: "कसैले पनि तपाईंसँग यसरी कुरा गर्नु हुँदैन।",
    sf_off_note: " (यो नियम तपाईंको WorkPassport मा बन्द छ — तपाईं फेरि खोल्न सक्नुहुन्छ।)",
    sf_reply_title: "जवाफ दिन मद्दत",
    sf_reply_intro: "जवाफ कपि गरेर च्याटमा टाँस्नुहोस्। चाहेका शब्द बदल्न सक्नुहुन्छ — यी सुरुवातका लागि मात्र हुन्।",
    sf_exit_label: "काम छोड्न चाहनुहुन्छ भने",
    disc_reply: "यी जवाफहरू तपाईंलाई मद्दत गर्ने सुझाव मात्र हुन्। पठाउनुअघि पढ्नुहोस् र चाहिने शब्दहरू बदल्नुहोस् — अवस्था तपाईंलाई नै सबैभन्दा राम्ररी थाहा हुन्छ। सन्देश पठाएपछि के हुन्छ, त्यसको जिम्मेवारी WorkPassport ले लिँदैन।",
    sf_next_title: "अब के गर्ने",
    sf_step1: "हतारमा वा रिसमा जवाफ नदिनुहोस्। पर्खनु ठीक हो।",
    sf_step2: "ब्लक गर्नुअघि प्रमाण सेभ गर्नुहोस्: स्क्रिनसट लिनुहोस्, वा सन्देश तल सेभ गर्नुहोस्।",
    sf_save_proof: "यो सन्देश प्रमाणका रूपमा सेभ गर्नुहोस्",
    sf_step3: "यही एपमा रिपोर्ट गर्न: कामको पेज खोलेर 'रिपोर्ट गर्नुहोस्' थिच्नुहोस्। अरू एपमा 'ब्लक' प्रयोग गर्नुहोस्। कसैलाई जवाफ दिन तपाईं बाध्य हुनुहुन्न।",
    sf_step4: "तपाईंलाई कहिल्यै खतरा लागेमा, विश्वास गर्ने मान्छेलाई भन्नुहोस्, वा नेपाल प्रहरीलाई १०० मा फोन गर्नुहोस्।",
    sf_saved_toast: "प्रमाणमा सेभ भयो",
    sf_deleted: "हटाइयो",
    sf_delete: "हटाउनुहोस्",
    sf_on: "चालु",
    sf_off: "बन्द",
    sf_edit_rules: "मेरो WorkPassport मा मिलाउनुहोस्",
    sf_proof_title: "तपाईंले सेभ गरेको प्रमाण",
    sf_proof_empty: "अहिलेसम्म केही सेभ गरिएको छैन। कुनै सन्देशले सीमा नाघेमा, प्रमाणका रूपमा यहाँ सेभ गर्नुहोस्।",
    sf_proof_private: "प्रमाण यही डिभाइसमा मात्र सेभ हुन्छ।",
    ev_title: "प्रमाण भल्ट",
    ev_open: "प्रमाण भल्ट खोल्नुहोस्",
    ev_private: "यो पृष्ठ तपाईं मात्र देख्न सक्नुहुन्छ। तपाईं आफैंले बाहिर नपठाएसम्म यहाँको केही पनि साझा हुँदैन।",
    ev_count: "{n} वटा प्रमाण सेभ छन्",
    ev_empty: "अहिलेसम्म केही सेभ गरिएको छैन। तपाईंले सन्देश जाँचेर \"प्रमाणका रूपमा सेभ गर्नुहोस्\" थिच्दा, त्यो यहाँ रहन्छ।",
    ev_src_chat: "च्याटबाट: {jobTitle}",
    ev_src_page: "सुरक्षा जाँचबाट",
    ev_src_none: "पहिले सेभ गरिएको",
    ev_hidden: "साझा उपकरण मोडमा सन्देश लुकाइएको छ",
    ev_pdf: "प्रतिवेदन डाउनलोड गर्नुहोस् (PDF)",
    ev_copy: "प्रतिवेदन पाठका रूपमा कपि गर्नुहोस्",
    ev_caution: "प्रतिवेदनमा तपाईंले सेभ गरेका सन्देशहरूको पूरा पाठ हुन्छ। विश्वास लागेका मानिसहरूसँग मात्र साझा गर्नुहोस्।",
    ev_rep_title: "प्रमाण प्रतिवेदन",
    ev_intro: "यो प्रतिवेदन {name} ले प्रमाण भल्टमा सेभ गरेका सन्देशहरूबाट बनाएका हुन्।",
    ev_item: "प्रमाण {n}",
    ev_foot: "यी सन्देशहरू प्रयोगकर्ताले सेभ गरेका हुन्। WorkPassport ले तिनीहरूलाई जाँचेको वा बदलेको छैन।",
    sh_title: "काम वा सन्देश जाँच्नुहोस्",
    sh_intro: "कामको पोस्ट वा ग्राहकको सन्देश टाँस्नुहोस्। WorkShield ले चेतावनीका सङ्केत खोज्छ र सजिलो शब्दमा बुझाउँछ।",
    sh_placeholder: "कामको पोस्ट वा सन्देश यहाँ टाँस्नुहोस्…",
    sh_check: "जाँच्नुहोस्",
    sh_private: "तपाईंको लेख यही डिभाइसमा रहन्छ। कतै पठाइँदैन।",
    sh_try: "उदाहरण हेर्नुहोस्",
    sh_ex1: "उदाहरण: ठगी सन्देश",
    sh_ex2: "उदाहरण: अस्पष्ट काम",
    sh_ex3: "उदाहरण: प्रष्ट काम",
    sh_or_job: "वा FirstWork को काम जाँच्नुहोस्",
    sh_v_danger: "खतराका सङ्केत भेटिए — धेरै सावधान हुनुहोस्",
    sh_v_warning: "केही चेतावनीका सङ्केत छन् — जवाफ दिनुअघि बुझ्नुहोस्",
    sh_v_ok: "खतराका सङ्केत भेटिएनन्",
    sh_s_danger: "पैसा, फोटो वा कोड नपठाउनुहोस्। हतारमा जवाफ नदिनुहोस्।",
    sh_s_warning: "कुनै कुरामा सहमत हुनुअघि तलका प्रश्नहरू सोध्नुहोस्।",
    sh_s_ok: "यो सामान्य देखिन्छ। तैपनि कुराकानी एपभित्रै राख्नुहोस् र सुरु गर्नुअघि भुक्तानी पक्का गर्नुहोस्।",
    sh_f_fee: "यसले पहिले पैसा तिर्न भन्छ। साँचो ग्राहकले तपाईंलाई तिर्छन् — काम पाउन पैसा कहिल्यै नतिर्नुहोस्।",
    sh_f_otp: "यसले OTP, पासवर्ड वा बैंक PIN माग्छ। यी कसैसँग कहिल्यै नबाँड्नुहोस्।",
    sh_f_crypto: "यसमा गिफ्ट कार्ड वा क्रिप्टो भुक्तानीको कुरा छ। यो ठगीको सामान्य सङ्केत हो।",
    sh_f_highpay: "सजिलो कामका लागि ज्याला असाध्यै धेरै सुनिन्छ। सजिलो काममा धेरै पैसा दिन्छु भन्नु सामान्य ठगी हो।",
    sh_f_offplatform: "यसले एप बाहिर कुरा गर्न भन्छ (WhatsApp, Telegram वा व्यक्तिगत नम्बर)। एपभित्रै कुरा गर्नु सुरक्षित हुन्छ।",
    sh_f_photo: "यसले तपाईंको व्यक्तिगत फोटो माग्छ। कामका लागि व्यक्तिगत फोटो पठाउनु पर्दैन।",
    sh_f_urgency: "यसले हतार गर्न दबाब दिन्छ। ठगहरूले सोच्न नपाओस् भनेर हतार गराउँछन्।",
    sh_f_freetrial: "यसले पहिले सित्तैमा काम गर्न भन्छ। सानो नमुना ठीक छ, तर पूरा कामको पैसा पाउनुपर्छ।",
    sh_f_vague: "काम के हो, प्रष्ट लेखिएको छैन। सुरु गर्नुअघि के-के बनाउनुपर्छ, ठ्याक्कै सोध्नुहोस्।",
    sh_f_nopay: "भुक्तानीको कुरा छैन। सुरु गर्नुअघि कति र कसरी पाइन्छ, सोध्नुहोस्।",
    sh_f_lowpay: "यो कामका लागि ज्याला असाध्यै कम देखिन्छ। FirstWork का उस्तै कामहरूसँग तुलना गर्नुहोस्।",
    sh_f_unverified: "यो ग्राहक प्रमाणित छैन। थप सावधान हुनुहोस् र सबै कुराकानी एपभित्रै राख्नुहोस्।",
    sh_f_clearwork: "काम प्रष्टसँग बुझाइएको छ।",
    sh_f_paymethod: "ज्याला र भुक्तानीको तरिका उल्लेख छ।",
    sh_f_deadline: "समयसीमा वा समय उल्लेख छ।",
    sh_f_verified: "यो ग्राहक WorkPassport मा प्रमाणित छ।",
    sh_f_normalpay: "यो ज्याला FirstWork का कामहरूको सामान्य दायरामा छ।",
    sh_next_title: "अब के गर्ने",
    sh_n_danger1: "कुनै पैसा नतिर्नुहोस्, कुनै कोड वा फोटो नपठाउनुहोस्।",
    sh_n_danger2: "यो ग्राहकसँग कुरा गर्न छोड्नुहोस्।",
    sh_n_danger3: "तपाईं यसबारे कामको पेजबाट रिपोर्ट गर्न सक्नुहुन्छ वा छोडेर हिँड्न सक्नुहुन्छ — छोडेर हिँड्नु सधैं ठीक हो।",
    sh_n_warning1: "तलका प्रश्नहरू सोध्नुहोस् र प्रष्ट जवाफको पर्खाइ गर्नुहोस्।",
    sh_n_warning2: "भुक्तानी र काम प्रष्ट नभएसम्म काम सुरु नगर्नुहोस्।",
    sh_n_warning3: "सबै कुराकानी एपभित्रै राख्नुहोस्।",
    sh_n_ok1: "नम्रतापूर्वक जवाफ दिनुहोस् र काम र भुक्तानी लिखित रूपमा पक्का गर्नुहोस्।",
    sh_n_ok2: "सबै कुराकानी एपभित्रै राख्नुहोस्।",
    sh_n_ok3: "काम सकेपछि, तपाईंको WorkPassport का लागि ग्राहकलाई तपाईंको काम पुष्टि गर्न भन्नुहोस्।",
    sh_q_title: "ग्राहकलाई सोध्न सकिने प्रश्नहरू",
    sh_q_nopay: "मैले काम सुरु गर्नुअघि, भुक्तानी कति र कसरी पाइन्छ, कृपया पक्का गरिदिनुहोस्।",
    sh_q_vague: "मैले ठ्याक्कै के-के बनाउनुपर्छ, कृपया सूची दिनुहोस्।",
    sh_q_lowpay: "यो यस्तो कामको सामान्य दरभन्दा कम छ। के हामी मूल्यबारे कुरा गर्न सक्छौं?",
    sh_copy: "कपि गर्नुहोस्",
    sh_copied: "कपि भयो",
    sh_check_another: "अर्को जाँच्नुहोस्",
    sh_save: "यो जाँच सेभ गर्नुहोस्",
    sh_saved_toast: "तपाईंका अघिल्ला जाँचहरूमा सेभ भयो",
    disc_shield: "WorkShield ले सामान्य चेतावनीका सङ्केतहरू खोज्छ। यसले सबै कुरा देख्न सक्दैन। खतराका सङ्केत नभेटिनु भनेको काम पक्का सुरक्षित छ भन्ने होइन। अन्तिम निर्णय सधैं तपाईंको हो।",
    sh_hist_title: "तपाईंका अघिल्ला जाँचहरू",
    sh_hist_empty: "तपाईंले अहिलेसम्म कुनै जाँच सेभ गर्नुभएको छैन।",
    sh_clear: "इतिहास हटाउनुहोस्",
    sh_cleared: "इतिहास हटाइयो",
    sh_pill_danger: "खतरा",
    sh_pill_warning: "सावधान",
    sh_pill_ok: "सङ्केत छैन",
    pp_beginner: "सुरुवाती",
    pp_progress: "तपाईंको प्रगति",
    pp_enc1: "तपाईंको WorkPassport भर्खर सुरु भएको छ। एउटा सीप प्रमाणित गरेर यसलाई बढाउनुहोस्।",
    pp_enc2: "राम्रो प्रगति भइरहेको छ। साँचो ग्राहकको काम गरेपछि यो धेरै बलियो हुन्छ।",
    pp_enc3: "बलियो WorkPassport। ग्राहकहरूले यो प्रमाणमा भरोसा गर्न सक्छन्।",
    pp_stat_skills: "प्रमाणित सीपहरू",
    pp_stat_jobs: "सकिएका कामहरू",
    pp_stat_earned: "अहिलेसम्मको आम्दानी",
    pp_share: "मेरो WorkPassport सेयर गर्नुहोस्",
    pp_see_clients: "ग्राहकले के देख्छन्, हेर्नुहोस्",
    pp_institute_pending: "संस्था: {name} — प्रमाणीकरण बाँकी छ",
    pp_share_desc: "यो लिङ्क भएका सबैले तपाईंको सार्वजनिक WorkPassport हेर्न सक्छन्। तपाईंको फोन नम्बर र आम्दानी निजी रहन्छ।",
    pp_copy_link: "लिङ्क कपि गर्नुहोस्",
    pp_link_copied: "लिङ्क कपि भयो",
    pp_whatsapp: "WhatsApp मा सेयर गर्नुहोस्",
    pp_close: "बन्द गर्नुहोस्",
    pp_skills_title: "तपाईंका सीपहरू र प्रमाण",
    pp_lvl_self: "आफैंले थपेको",
    pp_lvl_demonstrated: "सीप देखाएको",
    pp_lvl_institution: "संस्थाले प्रमाणित गरेको",
    pp_lvl_client: "ग्राहकले पुष्टि गरेको",
    pp_lvl_platform: "प्लेटफर्मले प्रमाणित गरेको",
    pp_desc_self: "तपाईंले आफैं थप्नुभएको हो। अहिलेसम्म प्रमाण छैन।",
    pp_desc_demonstrated: "तपाईंले यो एपमा सानो परीक्षण काम पास गर्नुभयो।",
    pp_desc_institution: "तपाईंको तालिम संस्थाले तपाईंको कोर्स पुष्टि गर्‍यो।",
    pp_desc_client: "साँचो ग्राहकले तपाईंले सकेको काम पुष्टि गर्‍यो।",
    pp_desc_platform: "काम WorkPassport मा सकियो र जाँचियो।",
    pp_source: "स्रोत:",
    pp_src_demo: "यो एपमा सानो परीक्षण पास गरियो",
    pp_take_test: "सानो परीक्षण दिनुहोस्",
    pp_next_demo: "अर्को: ग्राहकको काम पाएर 'ग्राहकले पुष्टि गरेको' स्तरमा पुग्नुहोस्।",
    pp_next_inst: "बलियो प्रमाण। ग्राहकको काम गरेपछि यो अझ माथि जान्छ।",
    pp_top: "सबैभन्दा माथिल्लो स्तरको प्रमाण।",
    pp_how_title: "प्रमाण कसरी काम गर्छ",
    pp_test_title: "सानो परीक्षण: {s}",
    pp_test_sub: "३ छोटा प्रश्न। यो सीप प्रमाणित गर्न २ वटा सही गर्नुहोस्।",
    pp_q_of: "प्रश्न {n} / ३",
    pp_next: "अर्को",
    pp_finish: "मेरो नतिजा हेर्नुहोस्",
    pp_type_here: "यहाँ टाइप गर्नुहोस्",
    pp_col_name: "नाम",
    pp_col_phone: "फोन",
    pp_pass: "परीक्षण पास भयो! {s} अब 'सीप देखाएको' भयो।",
    pp_pass_toast: "सीप देखाएको: {s}",
    pp_fail: "अहिले होइन — तपाईंले ३ मध्ये {n} सही गर्नुभयो। कामका सुझाव पढेर फेरि प्रयास गर्नुहोस्।",
    pp_try_again: "फेरि प्रयास गर्नुहोस्",
    pp_back_my: "मेरो WorkPassport मा फर्कनुहोस्",
    pp_work_title: "सकिएको काम",
    pp_work_empty: "अहिलेसम्म कुनै काम सकिएको छैन। ग्राहकले पुष्टि गरेका तपाईंका सकिएका कामहरू यहाँ तपाईंको सबैभन्दा बलियो प्रमाण बनेर रहनेछन्।",
    pp_find_job: "सुरक्षित पहिलो काम खोज्नुहोस्",
    pp_applied_head: "आवेदन दिएका कामहरू",
    pp_done_head: "सकिएका कामहरू",
    pp_demo_confirm: "डेमो: ग्राहकले पुष्टि गर्‍यो भनेर राख्नुहोस्",
    pp_confirm_toast: "ग्राहकले पुष्टि गरेको प्रमाणका रूपमा तपाईंको WorkPassport मा थपियो।",
    pp_earned_line: "आम्दानी ≈ NPR {n}",
    pp_confirmed_demo: "ग्राहकले पुष्टि गर्‍यो (डेमो)",
    pp_completed_status: "काम सकियो — WorkPassport मा थपियो",
    pp_pay_title: "भुक्तानी पाउने तरिका",
    pp_pay_1: "मेरो नाममा बैंक खाता छ",
    pp_pay_2: "मसँग मोबाइल वालेट (eSewa वा Khalti) छ",
    pp_pay_3: "प्रमाणीकरणका लागि मसँग नागरिकता वा परिचयपत्र छ",
    pp_pay_4: "ग्राहकले आधिकारिक भुक्तानी साझेदार मार्फत पैसा तिर्छन् भन्ने मलाई थाहा छ — WorkPassport ले मेरो पैसा कहिल्यै राख्दैन",
    np_title: "तपाईंले वास्तवमा कति पाउनुहुन्छ",
    np_bank: "बैंक स्थानान्तरण",
    np_price: "कामको मूल्य",
    np_rupees: "रुपैयाँमा",
    np_fees: "अनुमानित शुल्क",
    np_receive: "तपाईंले पाउनुहुन्छ (करिब)",
    np_warn: "शुल्क नै आम्दानीभन्दा बढी भयो। अर्को भुक्तानी तरिका माग्नुहोस्।",
    np_calc_label: "कामको मूल्य (डलरमा)",
    disc_paynet: "यी शुल्कहरू यो नमुना संस्करणका लागि अनुमान मात्र हुन्। वास्तविक शुल्क भुक्तानी सेवा र बैंकअनुसार फरक हुन्छ। सहमत हुनुअघि सधैं वास्तविक शुल्क बुझ्नुहोस्।",
    disc_pay: "यो सूची मार्गदर्शनका लागि मात्र हो। WorkPassport ले पैसा सार्दैन वा राख्दैन; आधिकारिक भुक्तानी साझेदारले गर्छ। काम सुरु गर्नुअघि ग्राहकसँग भुक्तानीको तरिका सधैं पक्का गर्नुहोस्।",
    pp_rules_title: "मेरा सुरक्षा नियमहरू",
    pp_preview_note: "पूर्वावलोकन: ग्राहकले यही देख्छन्।",
    pp_public_strip: "पहिले प्रमाणित प्रमाण — यो फ्रिल्यान्सरलाई उनको कामले चिनिन्छ।",
    pp_public_empty: "नयाँ फ्रिल्यान्सर — अहिलेसम्म ग्राहकको काम छैन, सीपहरू परीक्षण र संस्थाबाट प्रमाणित छन्।",
    pp_working_rules: "कामका नियमहरू:",
    pp_about: "यी फ्रिल्यान्सरको बारेमा",
    pp_public_footer: "WorkPassport बाट सेयर गरिएको — कार्यशील नामको प्रोटोटाइप।",
    // Welcome & Login
    lang_en: "English",
    lang_ne: "नेपाली",
    welcome_title: "तपाईंको सीपले पहिलो मौका पाउनुपर्छ।",
    welcome_sub: "नेपालका नयाँ फ्रिलान्सरहरूका लागि — सुरक्षित पहिलो काम, र तपाईंको सीप देखाउने कामको रेकर्ड।",
    btn_new: "म नयाँ हुँ — मेरो WorkPassport बनाउनुहोस्",
    btn_login: "मेरो खाता छ — लग इन गर्नुहोस्",
    btn_demo: "मायाको रूपमा डेमो हेर्नुहोस्",
    privacy_note: "परिवारसँग एउटै ल्यापटप चलाउनुहुन्छ? तपाईंको जानकारी गोप्य रहन्छ। काम सकिएपछि लग आउट गर्न नबिर्सनुहोस्।",
    login_step1_title: "लग इन गर्नुहोस्",
    phone_label: "मोबाइल नम्बर",
    phone_err: "कृपया सही मोबाइल नम्बर हाल्नुहोस्।",
    btn_send_code: "कोड पठाउनुहोस्",
    login_step2_title: "४ अंकको कोड हाल्नुहोस्",
    code_hint: "डेमो हो — जुनसुकै ४ अंकको कोड हाल्नुहोस्।",
    btn_verify: "जाँच गरी लग इन गर्नुहोस्",
    back: "पछाडि",
    welcome_toast: "फेरि स्वागत छ, माया!",
    // Setup Wizard
    setup_step1: "तपाईंको बारेमा",
    full_name: "पूरा नाम",
    name_placeholder: "जस्तै: माया श्रेष्ठ",
    district: "जिल्ला",
    work_wanted: "कस्तो काम गर्न चाहनुहुन्छ?",
    next: "अर्को",
    setup_step2: "तपाईंका सीपहरू",
    skills_note: "इमानदारीसाथ छान्नुहोस्। पछि साना परीक्षण कामहरू गरेर तपाईं आफ्नो सीप प्रमाणित गर्न सक्नुहुन्छ।",
    institute_label: "कहाँ सिक्नुभयो? (नलेखे पनि हुन्छ)",
    institute_placeholder: "जस्तै: एबीसी तालिम केन्द्र, विराटनगर",
    setup_step3: "तपाईंका सुरक्षा नियमहरू",
    safety_note: "आफ्नो सीमा तोक्नुहोस्। ग्राहकहरूले यी नियमहरू देख्नेछन्, र WorkShield ले यसको रक्षा गर्नेछ।",
    rule_chat: "च्याटमा कामको कुरा मात्र",
    rule_calls: "फोन वा भिडियो कल छैन",
    rule_time: "राति ८ बजेपछि कामको मेसेज छैन",
    rule_photo: "व्यक्तिगत फोटो कहिल्यै नपठाउनुहोस्",
    rule_hours: "मेरो कामको समय म आफैं तोक्छु",
    btn_create_wp: "मेरो WorkPassport बनाउनुहोस्",
    setup_success_title: "तपाईंको WorkPassport तयार भयो",
    setup_success_sub: "अहिले तपाईंका सीपहरू 'आफैंले थपेको' देखिन्छन्। साना परीक्षण काम र साँचो कामहरू पूरा गरेपछि ती प्रमाणित हुन्छन्।",
    btn_find_job: "मेरो पहिलो काम खोज्नुहोस्",
    btn_see_wp: "मेरो WorkPassport हेर्नुहोस्",
    // Nav & Shell
    nav_firstwork: "FirstWork",
    nav_passport: "मेरो WorkPassport",
    nav_shield: "WorkShield",
    nav_safety: "सुरक्षा",
    nav_ext: "एक्सटेन्सन",
    nav_logout: "लग आउट गर्नुहोस्",
    nav_logout_toast: "तपाईं लग आउट हुनुभयो। यो डिभाइसमा तपाईंको जानकारी लुकेको छ।",
    fw_banner: "FirstWork मा देखिनुअघि हरेक काम हाम्रो टोलीले जाँचेको हुन्छ।",
    footer_text: "WorkPassport — नमुना संस्करण। देखाउनका लागि बनाइएको नक्कली डाटा।",
    // FirstWork Feed
    fw_title: "FirstWork",
    fw_sub: "नयाँ सुरु गर्नेहरूका लागि जाँचिएका सुरक्षित पहिलो कामहरू।",
    search_placeholder: "काम, सीप वा ग्राहक खोज्नुहोस्...",
    filters: "फिल्टर",
    cat_all: "सबै किसिम",
    budget_all: "सबै बजेट",
    budget_fixed: "तय गरिएको मूल्य",
    budget_hourly: "घण्टाको दर",
    tog_beginner: "नयाँ सुरु गर्नेका लागि मात्र",
    tog_verified: "भुक्तानी पक्का भएका मात्र",
    tog_match: "मेरो सीपसँग मिल्ने",
    sort_by: "क्रमबद्ध",
    sort_new: "सबैभन्दा नयाँ",
    sort_high: "बजेट: धेरैदेखि थोरै",
    sort_low: "बजेट: थोरैदेखि धेरै",
    sort_match: "सीप सबैभन्दा मिल्ने",
    no_jobs: "यी फिल्टरसँग मिल्ने कुनै काम भेटिएन।",
    clear_filters: "फिल्टर हटाउनुहोस्",
    // Job Card & Detail
    payment_verified: "भुक्तानी पक्का भएको",
    payment_unverified: "भुक्तानी पक्का भएको छैन",
    beginner_friendly: "नयाँ सुरु गर्नेका लागि ठिक",
    applied_count: "जनाले आवेदन दिए",
    view_job: "काम हेर्नुहोस्",
    listen: "सुन्नुहोस्",
    caution: "सावधानी",
    back_to_jobs: "कामहरूमा फर्कनुहोस्",
    save: "सुरक्षित राख्नुहोस्",
    saved: "राखियो",
    report: "रिपोर्ट गर्नुहोस्",
    sample_rate: "नमूना दर: १ USD = NPR १३३। अन्तिम दर भुक्तानी साझेदारमा भर पर्छ।",
    about_job: "यो कामको बारेमा",
    deliver_title: "तपाईंले दिनुपर्ने काम",
    client_gives_title: "ग्राहकले दिने कुराहरू",
    skills_needed: "चाहिने सीपहरू",
    skill_has: "तपाईंसँग छ",
    skill_lacks: "तपाईंका लागि नयाँ सीप",
    match_count: "यो कामका {t} सीपमध्ये {m} तपाईंसँग छन्।",
    ws_checked: "WorkShield ले यो काम जाँचेको छ",
    ws_ok_scam: "ठगीको कुनै संकेत भेटिएन",
    ws_ok_pay: "काम गर्नुअघि पैसा मागेको छैन",
    ws_ok_id: "ग्राहकको पहिचान प्रमाणित भएको छ",
    ws_warn_id: "ग्राहकको भुक्तानी विधि प्रमाणित भएको छैन — काम सुरु गर्नुअघि किस्ताबन्दीमा भुक्तानी माग्नुहोस्",
    ws_ok_scope: "कामको मात्रा र पैसा मिल्छ",
    client_trust: "ग्राहकको भरोसा",
    member_since: "सदस्य भएको वर्ष",
    jobs_posted: "राखेका कामहरू",
    hire_rate: "काम दिने दर",
    rating: "रेटिङ",
    about_client: "ग्राहकको बारेमा",
    before_apply: "आवेदन दिनुअघि — यो काम तपाईंलाई मिल्छ कि हेर्नुहोस्",
    needs_laptop: "आफ्नै ल्यापटप चाहिन्छ",
    no_laptop: "स्मार्टफोनले पुग्छ",
    apply_now: "अहिले आवेदन दिनुहोस्",
    job_en_note: "ध्यान दिनुहोस्: कामको विवरण ग्राहकले अंग्रेजीमा लेखेका हुन्।",
    // Apply Wizard
    step: "चरण",
    of: "/",
    apply_step1: "तपाईं यो कामका लागि किन ठिक हुनुहुन्छ?",
    make_better: "अझ राम्रो बनाउनुहोस् (AI)",
    apply_step2: "तपाईंको मूल्य",
    price_fair: "यस्तो काममा नयाँ सुरु गर्नेहरूले प्रायः ${lo}–${hi} लिन्छन्। तपाईंको मूल्य ठिक दायरामा छ।",
    price_hint: "यो कामका लागि सुझाव गरिएको दायरा: ${lo}–${hi}।",
    price_low: "यो निकै कम हो। तपाईं अझ बढी माग्न सक्नुहुन्छ।",
    price_high: "नयाँ सुरु गर्नेका लागि यो सामान्यभन्दा बढी हो। ग्राहकले जवाफ नदिन सक्छन्।",
    delivery_time: "कति दिनमा दिनुहुन्छ?",
    days: "दिन",
    apply_step3: "तपाईंले पाउने रकमको झलक",
    job_price: "कामको मूल्य",
    platform_fee: "फ्रिलान्सरका लागि प्लेटफर्म शुल्क",
    free: "निःशुल्क",
    you_receive: "तपाईंले पाउनुहुने",
    receive_note: "यो योजना बनाउनका लागि गरिएको अनुमान हो, वाचा होइन। वास्तविक रकम त्यो दिनको दर र आधिकारिक भुक्तानी साझेदारमा भर पर्छ। WorkPassport ले पैसा सार्दैन, र भुक्तानी ढिलो भएमा वा नोक्सान भएमा जिम्मेवार हुँदैन।",
    confirm_client: "सुरु गर्नुअघि ग्राहकसँग यी कुरा पक्का गर्नुहोस्:",
    chk_pay: "भुक्तानी कसरी हुने भन्ने मिल्यो",
    chk_mile: "पहिलो किस्ता मिल्यो",
    chk_dead: "म्याद मिल्यो",
    apply_step4: "हेर्नुहोस् र पठाउनुहोस्",
    ws_confirm: "मैले यो काम WorkShield बाट जाँचें र म आवेदन दिन चाहन्छु।",
    send_app: "आवेदन पठाउनुहोस्",
    app_sent: "आवेदन पठाइयो!",
    app_sent_desc: "तपाईंको आवेदन ग्राहकलाई पठाइयो। उहाँले जवाफ दिनुभयो भने, यो काम तपाईंको WorkPassport मा थपिनेछ।",
    view_opps: "मेरा अवसरहरूमा हेर्नुहोस्",
    // Opportunities
    my_opps: "मेरा अवसरहरू",
    tab_saved: "सुरक्षित राखेका",
    tab_applied: "आवेदन दिएका",
    no_saved: "तपाईंले अहिलेसम्म कुनै काम सुरक्षित राख्नुभएको छैन।",
    no_applied: "तपाईंले अहिलेसम्म कुनै कामको आवेदन दिनुभएको छैन।",
    remove: "हटाउनुहोस्",
    applied_status: "आवेदन दिइयो — जवाफको पर्खाइमा",
    // Placeholder
    proto_section: "यो भाग अर्को चरणमा बनाइनेछ।",
    // Notifications (demo) + form hint
    nt_title: "सूचनाहरू",
    nt_demo: "नमुना सामग्री",
    nt_empty: "नयाँ सूचना छैन।",
    nt_dismiss: "हटाउनुहोस्",
    nt_1: "ग्राहकले चाँडै जवाफ दिन सक्छन्। आफ्ना आवेदनहरू हेर्न नबिर्सनुहोस्।",
    nt_2: "सुझाव: साँचो ग्राहकले पहिले पैसा तिर्न भन्दैनन्। कुनै कामले पैसा माग्छ भने WorkShield मा जाँच्नुहोस्।",
    nt_3: "सुझाव: सीपको परीक्षा पास गरेर त्यो सीप आफ्नो WorkPassport मा माथि लैजानुहोस्।",
    err_paste_first: "पहिले टेक्स्ट टाँस्नुहोस्, अनि जाँच्ने बटन थिच्नुहोस्।",
    // Extension page
    ex_title: "तपाईंको ब्राउजरमा WorkShield",
    ex_intro: "काम जताततै हुन्छ — Facebook, जागिरका साइट र च्याटमा। एक्सटेन्सनले WorkShield लाई तपाईंसँगै लैजान्छ, ताकि जवाफ दिनुअघि तपाईं पोस्ट जाँच्न सक्नुहुन्छ।",
    ex_how_title: "यसले कसरी काम गर्छ",
    ex_s1: "जुनसुकै ठाउँमा काम वा सन्देश भेट्नुहोस्",
    ex_s2: "टेक्स्ट छान्नुहोस् र 'WorkShield ले जाँच्नुहोस्' थिच्नुहोस्",
    ex_s3: "चेतावनीका सङ्केतहरू सजिलो भाषामा हेर्नुहोस्",
    ex_try_title: "यहाँ अभ्यास गर्नुहोस्",
    ex_try_line: "यो एक्सटेन्सनको अभ्यास प्रति हो। यसले साँचो जाँचकर्ता प्रयोग गर्छ।",
    ex_tab_job: "कामको पोस्ट",
    ex_tab_chat: "च्याट सन्देश",
    ex_addr_job: "facebook.com — कामको पोस्ट",
    ex_addr_chat: "च्याट — ग्राहकको सन्देश",
    ex_label_job: "उदाहरण कामको पोस्ट (अभ्यास)",
    ex_label_chat: "उदाहरण सन्देश (अभ्यास)",
    ex_btn_job: "यो पोस्ट छानेर जाँच्नुहोस्",
    ex_btn_chat: "यो सन्देश छानेर जाँच्नुहोस्",
    ex_open_full: "पूरा जाँच खोल्नुहोस्",
    ex_open_safety: "सुरक्षा पेज खोल्नुहोस्",
    ex_close: "बन्द गर्नुहोस्",
    ex_pop_by: "WorkPassport बाट",
    ex_inst_title: "कसरी इन्स्टल गर्ने (प्रोटोटाइप)",
    ex_i1: "असली एपमा तपाईंले Chrome Web Store बाट एक क्लिकमै यो थप्नुहुन्थ्यो। यो प्रोटोटाइपमा एक्सटेन्सन भनेको यही प्रोजेक्टभित्रको extension नामको फोल्डर हो।",
    ex_i2: "Chrome मा chrome://extensions खोल्नुहोस् र Developer mode (माथि दायाँतिर) अन गर्नुहोस्।",
    ex_i3: "'Load unpacked' थिच्नुहोस् र extension फोल्डर छान्नुहोस्।",
    ex_i4: "पजलको टुक्रा जस्तो मेनुबाट WorkShield पिन गर्नुहोस्। अब कुनै पनि पेजमा टेक्स्ट छान्नुहोस्, राइट-क्लिक गर्नुहोस् र 'Check with WorkShield' छान्नुहोस् — वा WorkShield को आइकन थिचेर टेक्स्ट टाँस्नुहोस्।",
    ex_i_note: "खाता चाहिँदैन र इन्टरनेट बिना पनि चल्छ।",
    ex_priv_title: "तपाईंको गोपनीयता",
    ex_p1: "एक्सटेन्सनले तपाईंले टेक्स्ट छानेर क्लिक गर्दा मात्र त्यो पढ्छ। यसले आफैं कुनै पेज कहिल्यै पढ्दैन।",
    ex_p2: "जाँच तपाईंकै डिभाइसमा हुन्छ। तपाईंको टेक्स्ट कुनै सर्भरमा कहिल्यै पठाइँदैन।",
    ex_p3: "यसले सबैभन्दा थोरै अनुमति मात्र माग्छ: तपाईंले क्लिक गर्दा छानिएको टेक्स्ट पढ्न, र तपाईंका जाँचहरू यही डिभाइसमा राख्न।",
    disc_ext: "यो एक्सटेन्सनले यस एपको WorkShield र Safety जस्तै जाँच दिन्छ। खतराका सङ्केत नभेटिनु भनेको काम वा सन्देश पक्का सुरक्षित छ भन्ने होइन। अन्तिम निर्णय सधैं तपाईंको हो।",
    // Report
    report_title: "यो कामबारे रिपोर्ट गर्नुहोस्",
    rep_1: "ठगी वा नक्कली काम",
    rep_2: "पहिले पैसा मागियो",
    rep_3: "खराब वा व्यक्तिगत मेसेज",
    rep_4: "पैसा नदिई परीक्षण काम गराउन खोज्यो",
    rep_5: "अन्य",
    send_report: "रिपोर्ट पठाउनुहोस्",
    cancel: "रद्द गर्नुहोस्",
    report_toast: "धन्यवाद। हाम्रो टोलीले यो काम जाँच गर्नेछ।",
    // Disclaimers
    ai_label: "AI सुझाव",
    disc_proposal: "यो AI को सहयोगमा तयार गरिएको हो। पठाउनुअघि राम्ररी पढ्नुहोस् र आफ्नै शब्दमा मिलाउनुहोस्। ग्राहकलाई पठाएको कुराको जिम्मेवारी तपाईंको हुनेछ।",
    disc_price: "यो मूल्य यस्तै कामहरू हेरेर दिइएको सुझाव मात्र हो। अन्तिम मूल्य सधैं तपाईं आफैंले तोक्नुहोस्।",
    disc_ws: "WorkShield ले कहिलेकाहीं छुटाउन वा गलत बताउन सक्छ। केही असुरक्षित लागेमा रोकिनुहोस् — कसैलाई पनि पैसा, पासवर्ड वा व्यक्तिगत जानकारी नदिनुहोस्।",
    tc_title: "यस ग्राहकबारे",
    tc_facts: "जाँच गरिएका तथ्यहरू",
    tc_since: "यस प्लेटफर्ममा {year} देखि",
    tc_pay_ok: "भुक्तानी तरिका प्रमाणित छ",
    tc_pay_no: "भुक्तानी तरिका प्रमाणित छैन",
    tc_jobs: "पोस्ट गरिएका काम: {n}",
    tc_hire: "काम दिने दर: {n}%",
    tc_rating: "ग्राहकको मूल्याङ्कन: {n} / ५",
    tc_new: "नयाँ ग्राहक — अहिलेसम्म कसैलाई काम दिएका छैनन्",
    tc_warn_h: "चेतावनीहरू — आवेदन दिनुअघि हेर्नुहोस्",
    tc_warn_pay: "भुक्तानी तरिका प्रमाणित छैन। यो काम पाउन कुनै शुल्क नतिर्नुहोस्, र काम सुरु गर्नुअघि चरणबद्ध भुक्तानी माग्नुहोस्।",
    tc_none: "स्वचालित जाँचबाट कुनै चेतावनी छैन।",
    disc_trust: "तथ्यहरू ग्राहकको प्रोफाइलबाट आउँछन्। चेतावनीहरू स्वचालित जाँचबाट आउँछन् — तिनीहरूले निर्णय गर्न मद्दत गर्छन्, तर ग्राहक राम्रो वा नराम्रो छ भन्ने प्रमाण होइनन्।",
    sm_title: "यस कामका लागि तपाईंका सीप",
    sm_all: "यस कामले मागेका सबै सीप तपाईंसँग छन्।",
    sm_some: "यस कामका लागि चाहिने {y} सीपमध्ये तपाईंसँग {x} वटा छन्।",
    sm_have: "तपाईंसँग यो छ",
    sm_new: "तपाईंका लागि नयाँ",
    sm_apply: "तपाईं अझै आवेदन दिन सक्नुहुन्छ। धेरै ग्राहकहरूले सिक्दै गरेका नयाँ मान्छेलाई पनि मौका दिन्छन्।",
    oc_title: "यो काम तपाईंको जीवनमा मिल्छ?",
    oc_meet: "लाइभ बैठक (नेपालको समयमा)",
    oc_laptop: "आफ्नै ल्यापटप चाहिन्छ",
    oc_yes: "चाहिन्छ",
    oc_no: "चाहिँदैन",
    oc_net: "चाहिने इन्टरनेट",
    oc_time: "सक्नुपर्ने समय",
    disc_footer: "WorkPassport ले तपाईंलाई निर्णय गर्न सघाउन सुझाव र सुरक्षा चेतावनी दिन्छ। अन्तिम निर्णय — के पठाउने, कति मूल्य लिने, कुन काम गर्ने — तपाईंको आफ्नै हो।",
    chat_msg_client: "ग्राहकलाई सन्देश पठाउनुहोस्",
    chat_check: "जाँच्नुहोस्",
    chat_check_msg: "यो सन्देश जाँच्नुहोस्",
    chat_write: "सन्देश लेख्नुहोस्…",
    chat_send: "पठाउनुहोस्",
    chat_close: "बन्द गर्नुहोस्",
    chat_modal_title: "जवाफ दिनुअघि जाँच्नुहोस्",
    chat_check_now: "अहिले जाँच्नुहोस्",
    chat_chip1: "राति फोटो माग्ने",
    chat_chip2: "कलका लागि दबाब",
    chat_chip3: "ठगी सन्देश",
    chat_danger_line: "पैसा, फोटो वा कोड नपठाउनुहोस्।",
    chat_calm_title: "यस सन्देशमा समस्या भेटिएन",
    chat_calm_line: "यदि तपाईंलाई अझै गलत लाग्छ भने, आफ्नो मनको कुरा पत्याउनुहोस्।",
    sc_title: "कामको दायरा जाँच",
    sc_flag: "यो थप काम हुन सक्छ। यो यस कामको सम्झौतामा छैन।",
    sc_reason: "थप काम माग्ने शब्दहरू:",
    sc_agreed: "तपाईंले सहमति गरेको काम:",
    sc_ok: "यो सन्देश सहमति भएको कामकै बारेमा देखिन्छ।",
    sc_accept_h: "जवाफ: म गर्न सक्छु",
    sc_accept_b: "धन्यवाद, म यो थप काम पनि गर्न सक्छु। म यसलाई मेरो योजनामा थप्छु र तयार भएपछि तपाईंलाई खबर गर्छु।",
    sc_ask_h: "जवाफ: पहिले सोध्छु",
    sc_ask_b: "सोध्नुभएकोमा धन्यवाद। यो काम हाम्रो सम्झौतामा छैन, त्यसैले यो सहमत मूल्यमा पर्दैन। म यसलाई थप सशुल्क चरणका रूपमा गर्न खुसी छु। के म यसलाई थपूँ?",
    sc_create: "थप चरण बनाउनुहोस्",
    sc_name: "चरणको नाम",
    sc_price: "मूल्य (डलरमा)",
    sc_save: "चरण सेभ गर्नुहोस्",
    sc_err: "कृपया नाम लेख्नुहोस् र ० भन्दा बढी मूल्य हाल्नुहोस्।",
    sc_done: "तपाईंको वर्करूममा थपियो। हेर्न वर्करूम खोल्नुहोस्।",
    sc_extra_default: "Extra work",
    disc_scope: "यो दायरा जाँच तपाईंलाई निर्णय गर्न मद्दत गर्ने सुझाव हो। तपाईंहरूबीच के सहमति भयो भन्ने तपाईं र ग्राहकलाई मात्र थाहा हुन्छ। अन्तिम निर्णय सधैं तपाईंको हो।",
    chat_open_shield: "WorkShield खोल्नुहोस्",
    chat_open_safety: "सुरक्षा पेज खोल्नुहोस्",
    chat_thread_label: "यो ग्राहकसँगका सन्देशहरू",
    disc_chat: "यो जाँच तपाईंलाई निर्णय गर्न मद्दत गर्ने सुझाव हो। यसले सबै कुरा देख्न सक्दैन, र तपाईंले जवाफ दिएपछि के हुन्छ त्यसको जिम्मेवारी WorkPassport ले लिँदैन। अन्तिम निर्णय सधैं तपाईंको हो।",
    pv_title: "गोपनीयता र सजिलो",
    pv_shared_label: "साझा उपकरण मोड",
    pv_shared_desc: "तपाईंको फोन अरूले पनि चलाउँछन् भने यो खोल्नुहोस्। एपले PIN माग्छ, तपाईंको आम्दानी लुकाउँछ, र सूचनाहरू गोप्य रहन्छन्।",
    pv_pin_create: "4 अङ्कको PIN बनाउनुहोस्",
    pv_pin_again: "फेरि लेख्नुहोस्",
    pv_pin_mismatch: "दुई PIN मिलेनन्। फेरि प्रयास गर्नुहोस्।",
    pv_pin_digits: "PIN मा ठ्याक्कै 4 अङ्क लेख्नुहोस्।",
    pv_pin_turnoff: "बन्द गर्नुहोस्",
    pv_lock_title: "तपाईंको PIN हाल्नुहोस्",
    pv_lock_open: "खोल्नुहोस्",
    pv_lock_wrong: "PIN मिलेन। फेरि प्रयास गर्नुहोस्।",
    pv_lock_now: "अहिले लक गर्नुहोस्",
    pv_quick_hide: "तुरुन्त लुकाउनुहोस्",
    pv_notif_private: "तपाईंका लागि नयाँ सूचना छ",
    pv_weather_title: "विराटनगरको मौसम",
    pv_weather_now: "घाम लागेको, 24°",
    pv_weather_return: "फर्कन यहाँ ट्याप गर्नुहोस्",
    pv_simple_label: "कम डाटा / सजिलो मोड",
    pv_simple_desc: "ठूलो अक्षर, र इन्टरनेट रोकिए पनि तपाईंका ड्राफ्टहरू यसै उपकरणमा सेभ रहन्छन्।",
    pv_draft_saved: "ड्राफ्ट यसै उपकरणमा सेभ भयो",
    pv_unfinished: "तपाईंको अधुरो आवेदन छ",
    ca_options: "ग्राहकका विकल्प",
    ca_mute: "ग्राहकलाई म्युट गर्नुहोस्",
    ca_unmute: "अनम्युट गर्नुहोस्",
    ca_block: "ग्राहकलाई ब्लक गर्नुहोस्",
    ca_unblock: "अनब्लक गर्नुहोस्",
    ca_report: "ग्राहकको उजुरी गर्नुहोस्",
    ca_muted_note: "तपाईंले यो ग्राहकलाई म्युट गर्नुभयो। यहाँ नयाँ सन्देश आउँदैन।",
    ca_blocked_bar: "तपाईंले यो ग्राहकलाई ब्लक गर्नुभयो। जुनसुकै बेला अनब्लक गर्न सक्नुहुन्छ।",
    ca_report_title: "यो ग्राहकको उजुरी गर्नुहोस्",
    ca_r_scam: "ठगी",
    ca_r_harassment: "दुर्व्यवहार",
    ca_r_photos: "व्यक्तिगत फोटो मागेको",
    ca_r_other: "अन्य",
    ca_send_report: "उजुरी पठाउनुहोस्",
    ca_report_toast: "उजुरी पठाइयो। धन्यवाद — प्रमाणका सन्देश पनि सेभ गर्नुहोस्।",
    wr_open: "वर्करूम खोल्नुहोस्",
    wr_title: "वर्करूम",
    wr_sim_note: "नमुना मात्र: यी भुक्तानी अवस्था नक्कली हुन्। वास्तविक WorkPassport मा इजाजतपत्र भएको भुक्तानी साझेदारले पैसा सार्छ — एपले अवस्था मात्र देखाउँछ।",
    wr_agreement: "तपाईंको सम्झौता",
    wr_price: "मूल्य",
    wr_deadline: "अन्तिम मिति",
    wr_days: "{days} दिन",
    wr_deliver: "तपाईंले बुझाउने काम",
    wr_provides: "ग्राहकले दिने कुरा",
    wr_milestones: "चरणहरू र भुक्तानी",
    cl_entry: "काम पोस्ट गर्नुहोस् — ग्राहक नमुना",
    cl_demo_note: "नमुना: यो WorkPassport को ग्राहकतर्फको भाग हो। वास्तविक उत्पादनमा, ग्राहकहरूले आफ्नै खाताबाट साइन अप गर्छन्।",
    cl_my_jobs: "मैले पोस्ट गरेका कामहरू",
    cl_none: "अहिलेसम्म कुनै काम पोस्ट गरिएको छैन।",
    cl_f_name: "तपाईंको नाम वा व्यवसाय",
    cl_f_title: "कामको शीर्षक",
    cl_f_category: "वर्ग",
    cl_f_desc: "कामको वर्णन गर्नुहोस्",
    cl_f_deliv: "बुझाउनुपर्ने काम — फ्रिलान्सरले तपाईंलाई के दिन्छन्?",
    cl_add_one: "अर्को थप्नुहोस्",
    cl_f_skills: "चाहिने सीप",
    cl_f_budget: "बजेट (डलरमा)",
    cl_f_deadline: "अन्तिम मिति (दिनमा)",
    cl_f_revisions: "समावेश गरिएका संशोधन",
    cl_req_head: "आवश्यकताहरू",
    cl_f_laptop: "फ्रिलान्सरलाई आफ्नै ल्यापटप चाहिन्छ",
    cl_f_internet: "चाहिने इन्टरनेट",
    cl_f_meeting: "बैठकको समय (नेपालको समय)",
    cl_f_beginners: "नयाँहरूले आवेदन दिन सक्छन्",
    cl_submit: "यो काम पोस्ट गर्नुहोस्",
    cl_error: "कृपया शीर्षक, कम्तीमा एउटा बुझाउने काम, कम्तीमा एउटा सीप, ० भन्दा बढी बजेट, र कम्तीमा १ दिनको मिति भर्नुहोस्।",
    cl_toast_posted: "काम पोस्ट गरियो।",
    cl_posted_chip: "तपाईंले पोस्ट गरेको",
    cl_view_applicants: "आवेदकहरू हेर्नुहोस्",
    cl_applicants: "आवेदकहरू",
    cl_demo_applicants: "यस नमुनाका लागि बनाइएका आवेदकहरू।",
    cl_asks: "मागेको मूल्य",
    cl_availability: "उपलब्धता",
    cl_completed: "सकाएका कामहरू",
    cl_accept: "स्वीकार गर्नुहोस्",
    ag_title: "सम्झौता",
    ag_parties: "{client} र {name}",
    ag_price: "सहमत मूल्य",
    ag_revisions: "संशोधन",
    ag_confirm: "सम्झौता पुष्टि गर्नुहोस्",
    ag_made: "{name} सँग सम्झौता भयो",
    ag_full_product: "पूर्ण उत्पादनमा, फ्रिलान्सरले यो सम्झौता उनको वर्करूममा देख्छिन्, र चरणहरू त्यहीँ देखिन्छन्।",
    disc_agree: "यो सम्झौता यस नमुनाका लागि सरल सारांश हो। वास्तविक उत्पादनमा, काम सुरु हुनुअघि दुवै पक्षले यसलाई पुष्टि गर्छन्।",
    wr_progress: "खुलेका चरण: {total} मध्ये {done}",
    wr_released_so_far: "अहिलेसम्म खुलेको: NPR {y} मध्ये NPR {x}",
    wr_s_not_funded: "रकम जम्मा भएको छैन",
    wr_s_funded: "रकम जम्मा भयो",
    wr_s_submitted: "काम बुझाइयो",
    wr_s_released: "भुक्तानी खुल्यो",
    wr_demo_fund: "नमुना: ग्राहकले रकम जम्मा गर्छन्",
    wr_submit: "काम बुझाउनुहोस्",
    wr_waiting: "काम बुझाइयो। ग्राहकको पुष्टिको प्रतीक्षामा।",
    wr_demo_release: "नमुना: ग्राहकले पुष्टि गरी भुक्तानी खोल्छन्",
    wr_complete: "यो काम सकियो। यो तपाईंको WorkPassport मा ग्राहकले पुष्टि गरेको कामका रूपमा थपिएको छ।"
  }
};

// --- DUMMY DATA ---
const ALL_SKILLS = ["Canva", "Photoshop", "Logo Design", "Social Media Posts", "English Writing", "Nepali Writing", "Typing / Data Entry", "Translation", "Video Editing", "Excel / Spreadsheets", "Customer Chat Support"];
const ALL_CATEGORIES = ["Design", "Writing", "Data Entry", "Social Media", "Translation", "Virtual Assistant", "Video"];
const DISTRICTS = ["Kathmandu", "Lalitpur", "Bhaktapur", "Morang", "Kaski", "Chitwan", "Sunsari", "Rupandehi", "Banke", "Other"];

const MAYA_PROFILE = {
  name: "Maya Shrestha",
  district: "Morang",
  workWanted: ["Design", "Social Media", "Data Entry"],
  skills: ["Canva", "Photoshop", "Logo Design", "Social Media Posts", "English Writing", "Typing / Data Entry"],
  safetyRules: { chat: true, calls: true, time: true, photo: true, hours: true },
  badge: "Beginner"
};

const DUMMY_JOBS = [
  {
    id: "j1", title: "Logo design for new Sydney cafe", category: "Design", clientName: "Rajesh (Himalayan Brew)", clientCountry: "Australia", clientType: "Diaspora Nepali business", paymentVerified: true, beginnerFriendly: true, description: "I am opening a new Nepali-style cafe in Sydney. I need a simple, clean logo that shows a coffee cup and mountains. Colors should be warm. Need it in PNG and SVG formats.", skillsRequired: ["Logo Design", "Canva", "Photoshop"], budgetUSD: 80, budgetType: "fixed", postedHoursAgo: 2, applicants: 6, jobsPostedByClient: 3, hireRate: 100, memberSince: 2023, clientRating: 5.0, aboutClient: "Runs a small business in Australia. Always pays on time.", needsOwnLaptop: true, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 5, caution: null, deliverables: ["Logo in PNG format","Logo in SVG format","One round of small changes"], clientProvides: ["Café name and story","Colour and style ideas"]
  },
  {
    id: "j2", title: "30 Instagram posts for clothing store", category: "Social Media", clientName: "Kathmandu Styles", clientCountry: "Nepal", clientType: "Small business", paymentVerified: true, beginnerFriendly: true, description: "We need 30 simple Instagram posts for our summer collection. We will provide the photos. You just need to add text, prices, and our logo using Canva.", skillsRequired: ["Canva", "Social Media Posts"], budgetUSD: 60, budgetType: "fixed", postedHoursAgo: 5, applicants: 12, jobsPostedByClient: 15, hireRate: 85, memberSince: 2021, clientRating: 4.8, aboutClient: "Local boutique in Thamel. Very clear requirements.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 7, caution: null, deliverables: ["30 finished Instagram posts","Text, prices and logo added","Files sized for Instagram"], clientProvides: ["All product photos","Logo and price list"]
  },
  {
    id: "j3", title: "Data entry of 500 product rows", category: "Data Entry", clientName: "TechGear Shop", clientCountry: "USA", clientType: "Small business", paymentVerified: true, beginnerFriendly: false, description: "I have a PDF catalog of 500 products. I need you to copy the product name, price, and SKU into an Excel spreadsheet. Accuracy is very important.", skillsRequired: ["Typing / Data Entry", "Excel / Spreadsheets"], budgetUSD: 50, budgetType: "fixed", postedHoursAgo: 1, applicants: 2, jobsPostedByClient: 1, hireRate: 0, memberSince: 2024, clientRating: 0, aboutClient: "New client on the platform.", needsOwnLaptop: true, internetNeed: "Good", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 3, caution: null, deliverables: ["Excel sheet with 500 rows","Name, price and SKU filled in","A quick check for mistakes"], clientProvides: ["The PDF catalog","A sample row to copy"]
  },
  {
    id: "j4", title: "Translate restaurant menu (Nepali to English)", category: "Translation", clientName: "Prakash M.", clientCountry: "UK", clientType: "Individual", paymentVerified: false, beginnerFriendly: true, description: "I need someone to translate a 4-page restaurant menu from Nepali to English. Needs to sound appetizing. Simple task for someone with good English.", skillsRequired: ["English Writing", "Nepali Writing", "Translation"], budgetUSD: 20, budgetType: "fixed", postedHoursAgo: 8, applicants: 4, jobsPostedByClient: 0, hireRate: 0, memberSince: 2024, clientRating: 0, aboutClient: "First time posting a job.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 2, caution: "Client payment method NOT verified — ask for milestone payment before starting.", deliverables: ["Full 4-page menu in English","Dish names that sound tasty","A clean Word or PDF file"], clientProvides: ["The Nepali menu file","Notes on special dishes"]
  },
  {
    id: "j5", title: "Write 5 product descriptions for handmade soaps", category: "Writing", clientName: "Maple & Lye Soaps", clientCountry: "USA", clientType: "Etsy seller", paymentVerified: true, beginnerFriendly: true, description: "I sell handmade soaps on Etsy and need five short product descriptions. Each one should be about 80 words and sound warm and natural. I will send you the scent, colour and ingredients of each soap. Please use simple English and no copied text.", skillsRequired: ["English Writing"], budgetUSD: 40, budgetType: "fixed", postedHoursAgo: 9, applicants: 7, jobsPostedByClient: 22, hireRate: 90, memberSince: 2022, clientRating: 4.9, aboutClient: "Small Etsy shop owner. Replies fast and pays on time.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 4, caution: null, deliverables: ["5 product descriptions, about 80 words each", "Simple English, no copied text", "One round of small changes"], clientProvides: ["Scent, colour and ingredient list", "Photos of each soap"]
  },
  {
    id: "j6", title: "Virtual assistant, 5 hours a week for an online tutor", category: "Virtual Assistant", clientName: "Claire Thompson", clientCountry: "Australia", clientType: "Individual", paymentVerified: true, beginnerFriendly: true, description: "I am an online maths tutor and I need help with simple tasks for about 5 hours each week. You will reply to parent emails, update my class timetable and type up lesson notes. I will show you how I like things done in the first week. Work can be done at any time of day.", skillsRequired: ["English Writing", "Typing / Data Entry"], budgetUSD: 5, budgetType: "hourly", postedHoursAgo: 18, applicants: 11, jobsPostedByClient: 6, hireRate: 83, memberSince: 2023, clientRating: 4.7, aboutClient: "Online tutor with students in three countries. Gives clear instructions.", needsOwnLaptop: true, internetNeed: "Good", meetingTimeNepal: "One short call each week (evening in Nepal)", deadlineDays: 7, caution: null, deliverables: ["Replies to parent emails", "Updated class timetable", "Typed lesson notes"], clientProvides: ["Email templates to follow", "Access to the timetable sheet"]
  },
  {
    id: "j7", title: "Make 10 YouTube thumbnails for a study channel", category: "Video", clientName: "Rohit Verma", clientCountry: "India", clientType: "Small business", paymentVerified: true, beginnerFriendly: true, description: "I run a YouTube channel that helps students prepare for exams. I need 10 eye-catching thumbnails, one for each new video. I will send the title and a photo for each. The size must be 1280 by 720 pixels and the text must be easy to read on a phone.", skillsRequired: ["Canva", "Photoshop"], budgetUSD: 70, budgetType: "fixed", postedHoursAgo: 26, applicants: 14, jobsPostedByClient: 9, hireRate: 78, memberSince: 2022, clientRating: 4.6, aboutClient: "Education YouTuber with a growing channel. Likes bright, clean designs.", needsOwnLaptop: true, internetNeed: "Good", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 6, caution: null, deliverables: ["10 thumbnails at 1280 x 720", "Easy-to-read text", "PNG files, ready to upload"], clientProvides: ["Video titles and photos", "One example thumbnail he likes"]
  },
  {
    id: "j8", title: "Menu design for a restaurant in Pokhara", category: "Design", clientName: "Lakeview Kitchen", clientCountry: "Nepal (Pokhara)", clientType: "Small business", paymentVerified: true, beginnerFriendly: true, description: "We are a small lakeside restaurant in Pokhara and our old menu looks tired. We need a new two-page menu that is easy to read and shows our dishes in a neat way. We will give you the dish names, prices and our logo. The final file must be ready to print on A4 paper.", skillsRequired: ["Canva", "Logo Design"], budgetUSD: 35, budgetType: "fixed", postedHoursAgo: 31, applicants: 9, jobsPostedByClient: 5, hireRate: 80, memberSince: 2022, clientRating: 4.8, aboutClient: "Family-run restaurant near Phewa Lake. Clear and friendly to work with.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 6, caution: null, deliverables: ["2-page menu design", "Print-ready A4 PDF", "Editable Canva file"], clientProvides: ["Dish names and prices", "Restaurant logo and photos"]
  },
  {
    id: "j9", title: "TikTok captions and a 2-week posting plan for a beauty brand", category: "Social Media", clientName: "Glow Nepal", clientCountry: "Nepal (Kathmandu)", clientType: "Small business", paymentVerified: true, beginnerFriendly: true, description: "We sell skincare and make-up in Kathmandu and want to grow on TikTok. We need 14 short captions with hashtags, plus a simple two-week plan that says what to post each day. Captions should be fun and friendly, in English and easy Nepali words. We will share our product list and brand style.", skillsRequired: ["Social Media Posts", "English Writing"], budgetUSD: 45, budgetType: "fixed", postedHoursAgo: 14, applicants: 16, jobsPostedByClient: 8, hireRate: 75, memberSince: 2023, clientRating: 4.5, aboutClient: "Beauty brand with two shops. Wants fresh ideas and replies quickly.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 7, caution: null, deliverables: ["14 captions with hashtags", "2-week posting plan in a table", "Short notes on the best time to post"], clientProvides: ["Product list and prices", "Brand colours and sample posts"]
  },
  {
    id: "j10", title: "Copy 300 business contacts into a spreadsheet", category: "Data Entry", clientName: "Daniel Reeves", clientCountry: "UK", clientType: "Small business", paymentVerified: true, beginnerFriendly: false, description: "I have a pile of business cards and screenshots with contact details. I need all 300 contacts copied into one clean spreadsheet. Each row should have the name, company, phone number, email and city. Please be careful, as wrong numbers will cost me clients.", skillsRequired: ["Typing / Data Entry", "Excel / Spreadsheets"], budgetUSD: 4, budgetType: "hourly", postedHoursAgo: 40, applicants: 21, jobsPostedByClient: 12, hireRate: 88, memberSince: 2021, clientRating: 4.8, aboutClient: "Runs a small consulting firm. Pays every week on time.", needsOwnLaptop: true, internetNeed: "Good", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 5, caution: null, deliverables: ["Spreadsheet with 300 contacts", "5 columns filled in correctly", "A final check for double entries"], clientProvides: ["Photos and screenshots of contacts", "A blank spreadsheet to fill in"]
  },
  {
    id: "j11", title: "Translate 10 certificates, English to Nepali", category: "Translation", clientName: "Gurung Family", clientCountry: "Nepal", clientType: "Diaspora Nepali family", paymentVerified: true, beginnerFriendly: true, description: "Our family is moving back to Nepal and needs ten school and work certificates translated from English to Nepali. Each one is about one page. The words must be exact, including names, dates and numbers. We will send clear scans of every certificate.", skillsRequired: ["Translation", "Nepali Writing"], budgetUSD: 30, budgetType: "fixed", postedHoursAgo: 20, applicants: 6, jobsPostedByClient: 2, hireRate: 100, memberSince: 2024, clientRating: 5.0, aboutClient: "Family living abroad who are moving home. Polite and clear.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 6, caution: null, deliverables: ["10 certificates translated into Nepali", "Names, dates and numbers checked", "Typed Word file for each one"], clientProvides: ["Clear scans of all 10 certificates", "Correct spelling of every name"]
  },
  {
    id: "j12", title: "Write one 800-word blog post about trekking in Nepal", category: "Writing", clientName: "Wanderpath Blog", clientCountry: "Germany", clientType: "Individual", paymentVerified: true, beginnerFriendly: true, description: "I run a small travel blog and want a fresh post about trekking in Nepal for first-time visitors. The post should be around 800 words, easy to read and full of useful tips. Please write about the best season, what to pack and one or two popular routes. The writing must be your own and not copied from other websites.", skillsRequired: ["English Writing"], budgetUSD: 55, budgetType: "fixed", postedHoursAgo: 48, applicants: 13, jobsPostedByClient: 4, hireRate: 75, memberSince: 2021, clientRating: 4.7, aboutClient: "Travel blogger who has visited Nepal twice. Gives helpful feedback.", needsOwnLaptop: true, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 6, caution: null, deliverables: ["One 800-word blog post", "Short title and 3 subheadings", "Simple tips list at the end"], clientProvides: ["Short outline of what he wants", "Examples of posts he likes"]
  },
  {
    id: "j13", title: "Wedding invitation card design", category: "Design", clientName: "Sunita Rai", clientCountry: "Nepal (Biratnagar)", clientType: "Individual", paymentVerified: true, beginnerFriendly: true, description: "My sister is getting married in Biratnagar and we need a beautiful invitation card. I would like soft colours and some flowers. The card needs the names, date, time and place in both Nepali and English. We want one file for printing and one to share on phone.", skillsRequired: ["Canva", "Photoshop"], budgetUSD: 25, budgetType: "fixed", postedHoursAgo: 6, applicants: 3, jobsPostedByClient: 1, hireRate: 100, memberSince: 2025, clientRating: 0, aboutClient: "Looking for her first designer on the platform. Will send all details soon.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 4, caution: null, deliverables: ["One invitation card design", "Print-ready PDF file", "Small version for phone sharing"], clientProvides: ["Names, date, time and place", "Colour and flower ideas"]
  },
  {
    id: "j14", title: "Reply to customer chat messages, 1 hour daily", category: "Virtual Assistant", clientName: "Oliver Grant", clientCountry: "UK", clientType: "Small business", paymentVerified: true, beginnerFriendly: true, description: "I own a small online shop selling phone cases. I need someone to answer customer chat messages for one hour each day. Most questions are about delivery, sizes and returns, and I will give you ready-made answers. If you are not sure, you pass the message to me.", skillsRequired: ["English Writing", "Customer Chat Support"], budgetUSD: 6, budgetType: "hourly", postedHoursAgo: 36, applicants: 19, jobsPostedByClient: 5, hireRate: 80, memberSince: 2023, clientRating: 4.6, aboutClient: "Online shop owner. Gives ready-made answers and is easy to reach.", needsOwnLaptop: true, internetNeed: "Good", meetingTimeNepal: "Same hour each day (morning in Nepal)", deadlineDays: 14, caution: null, deliverables: ["Replies to customers, 1 hour a day", "List of questions you could not answer", "Short daily note for the owner"], clientProvides: ["Ready-made answers to common questions", "Access to the shop chat"]
  },
  {
    id: "j15", title: "Add English subtitles to 3 short videos", category: "Video", clientName: "Maria Alvarez", clientCountry: "USA", clientType: "Small business", paymentVerified: true, beginnerFriendly: false, description: "I make short cooking videos and want English subtitles on three of them. Each video is about two minutes long and has a clear voice. I will send the video files and a simple script. The subtitles need to match the speech and be easy to read.", skillsRequired: ["Video Editing", "English Writing"], budgetUSD: 6, budgetType: "hourly", postedHoursAgo: 55, applicants: 10, jobsPostedByClient: 7, hireRate: 70, memberSince: 2022, clientRating: 4.4, aboutClient: "Home cook who posts videos for her followers. Sends clear files.", needsOwnLaptop: true, internetNeed: "Good", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 5, caution: null, deliverables: ["3 videos with English subtitles", "Subtitle file (.srt) for each video", "Final videos in MP4 format"], clientProvides: ["The 3 video files", "A written script for each video"]
  },
  {
    id: "j16", title: "Pack of 10 Instagram story templates for a gym", category: "Design", clientName: "Anil Shahi (FitZone Dubai)", clientCountry: "UAE", clientType: "Diaspora Nepali business", paymentVerified: true, beginnerFriendly: true, description: "I own a small gym in Dubai and am a Nepali living abroad. I need 10 Instagram story templates that I can use again and again for offers, classes and tips. Please use bold colours that match my logo. I want to edit the text myself in Canva.", skillsRequired: ["Canva"], budgetUSD: 38, budgetType: "fixed", postedHoursAgo: 62, applicants: 5, jobsPostedByClient: 3, hireRate: 67, memberSince: 2024, clientRating: 5.0, aboutClient: "Gym owner in Dubai. Wants simple designs he can edit himself.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 6, caution: null, deliverables: ["10 story templates in Canva", "Colours matched to his logo", "Short note on how to edit them"], clientProvides: ["Gym logo and brand colours", "List of offers and classes"]
  },
  {
    id: "j17", title: "Facebook posts for a bakery in Butwal", category: "Social Media", clientName: "Fresh Crumbs Bakery", clientCountry: "Nepal (Butwal)", clientType: "Small business", paymentVerified: true, beginnerFriendly: true, description: "We are a new bakery in Butwal and want to get more customers from Facebook. We need 12 simple posts with our cake and bread photos and a short caption for each. Captions can be in Nepali or English. We will share the photos and our price list.", skillsRequired: ["Social Media Posts", "Canva"], budgetUSD: 42, budgetType: "fixed", postedHoursAgo: 72, applicants: 2, jobsPostedByClient: 1, hireRate: 100, memberSince: 2025, clientRating: 0, aboutClient: "New bakery that is just starting online. Friendly and quick to answer.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 7, caution: null, deliverables: ["12 Facebook posts, ready to upload", "Short caption for each post", "Bakery logo added on every post"], clientProvides: ["Photos of cakes and bread", "Price list and opening hours"]
  },
  {
    id: "j18", title: "Promote our app on Telegram — earn $200 per week", category: "Social Media", clientName: "Quick Earn Team", clientCountry: "Online", clientType: "Individual", paymentVerified: false, beginnerFriendly: false, description: "We need people to promote our new app in Telegram groups. You will post our message in as many groups as you can. You can earn up to $200 every week. We will explain more once you message us on Telegram.", skillsRequired: ["Social Media Posts"], budgetUSD: 200, budgetType: "fixed", postedHoursAgo: 3, applicants: 25, jobsPostedByClient: 0, hireRate: 0, memberSince: 2025, clientRating: 0, aboutClient: "New account with no work history. Gives very few details.", needsOwnLaptop: false, internetNeed: "Basic", meetingTimeNepal: "Flexible — no meetings", deadlineDays: 7, caution: "Client wants to chat only on Telegram and the payment method is not verified — be careful.", deliverables: ["Posts in Telegram groups", "Daily list of groups you posted in", "Reply to people who ask questions"], clientProvides: ["A message to copy and post", "Link to the app"]
  }
];

// --- HOOKS ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

// --- MAIN APP ---
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
  const [skillEvidenceRaw, setSkillEvidence] = useLocalStorage('wp_skill_evidence', {});
  const skillEvidence = skillEvidenceRaw && typeof skillEvidenceRaw === 'object' && !Array.isArray(skillEvidenceRaw) ? skillEvidenceRaw : {};
  const [chatsRaw, setChats] = useLocalStorage('wp_chats', {});
  const chats = chatsRaw && typeof chatsRaw === 'object' && !Array.isArray(chatsRaw) ? chatsRaw : {};
  const chatsRef = useRef(chats);
  chatsRef.current = chats;
  // Functional update that always sees the latest threads (safe inside timers).
  const updateChat = (jobId, fn) => {
    const cur = chatsRef.current || {};
    const next = { ...cur, [jobId]: fn(cur[jobId]) };
    chatsRef.current = next;
    setChats(next);
  };
  const [settingsRaw, setSettings] = useLocalStorage('wp_settings', { shared: false, pin: "", simple: false });
  const settings = { shared: !!(settingsRaw && settingsRaw.shared), pin: (settingsRaw && typeof settingsRaw.pin === 'string') ? settingsRaw.pin : "", simple: !!(settingsRaw && settingsRaw.simple) };
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
  const [clientJobsRaw, setClientJobs] = useLocalStorage('wp_client_jobs', []);
  const clientJobs = Array.isArray(clientJobsRaw) ? clientJobsRaw : [];
  // ONE combined list: the user's posted jobs first, then the dummy jobs. Every job lookup uses this.
  const allJobs = [...clientJobs, ...DUMMY_JOBS];
  const confirmAgreement = (jobId, applicant) => {
    setClientJobs(clientJobs.map(j => j.id === jobId ? { ...j, accepted: { applicantName: applicant.name, price: applicant.asks } } : j));
    navTo('client', { scrollTo: 'mine' });
  };
  const sharedOn = settings.shared && settings.pin.length === 4;
  const simpleOn = settings.simple;
  // Session unlock flag. It starts false on every page load, is cleared on logout / Lock now / Quick hide,
  // and is never stored. While Shared Device Mode is on, the lock screen shows whenever this is false.
  // (Prototype-level privacy only: the PIN is kept as plain text in localStorage.)
  const [unlocked, setUnlocked] = useState(false);
  const [quickHidden, setQuickHidden] = useState(false);
  const [currentView, setCurrentView] = useState('welcome');
  const [viewParams, setViewParams] = useState({});
  const [toast, setToast] = useState(null);

  // Simple Mode: scale all text to 112.5% (rem-based sizes follow the root size).
  useEffect(() => {
    const root = document.documentElement;
    if (simpleOn) { root.style.fontSize = '112.5%'; root.classList.add('wp-simple-on'); }
    else { root.style.fontSize = ''; root.classList.remove('wp-simple-on'); }
    return () => { root.style.fontSize = ''; root.classList.remove('wp-simple-on'); };
  }, [simpleOn]);

  useEffect(() => {
    if (isLoggedIn && currentView === 'welcome') setCurrentView('firstwork');
  }, [isLoggedIn, currentView]);

  // Demo seed: only for Maya, and only while wp_skill_evidence is completely empty (no skills at all).
  useEffect(() => {
    if (!isLoggedIn || !isDemoUser(userProfile)) return;
    if (Object.keys(skillEvidence).length === 0) setSkillEvidence(makeEvidenceSeed());
  }, [isLoggedIn, userProfile, skillEvidenceRaw]);

  const t = (key) => DICT[lang][key] || key;

  const toastTimer = useRef(null);
  const showToast = (msg) => {
    // A new toast replaces the current one instead of stacking.
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const navTo = (view, params = {}) => {
    // WorkShield and Safety are ONE page now. The old 'safety' view opens the merged page scrolled to #safety-section;
    // the old 'shield' view opens it at the top. (n makes repeat taps re-run the scroll.)
    if (view === 'safety') { view = 'shield'; params = { ...params, scrollTo: 'safety', n: Date.now() }; }
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setUnlocked(false);
    setQuickHidden(false);
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

  // --- UNAUTHENTICATED VIEWS ---
  if (!isLoggedIn) {
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

  // --- PRIVACY GATES (Shared Device Mode) ---
  if (sharedOn && quickHidden) {
    return <QuickHideScreen t={t} onReturn={() => { setUnlocked(false); setQuickHidden(false); }} />;
  }
  if (sharedOn && !unlocked) {
    return <LockScreen t={t} pin={settings.pin} onUnlock={() => setUnlocked(true)} />;
  }

  // --- AUTHENTICATED SHELL ---
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
              <NavLink label={t('nav_firstwork')} active={['firstwork', 'job-detail', 'apply', 'opportunities', 'chat', 'workroom', 'client', 'client-applicants', 'client-agreement'].includes(currentView)} onClick={() => navTo('firstwork')} />
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
            <NavLink label={t('nav_firstwork')} active={['firstwork', 'job-detail', 'apply', 'opportunities', 'chat', 'workroom', 'client', 'client-applicants', 'client-agreement'].includes(currentView)} onClick={() => navTo('firstwork')} />
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
        {currentView === 'firstwork' && <FirstWorkFeed allJobs={allJobs} t={t} navTo={navTo} user={userProfile} savedJobs={savedJobs} setSavedJobs={setSavedJobs} lang={lang} />}
        {currentView === 'job-detail' && <JobDetail t={t} navTo={navTo} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} skillLevels={skillLevels} savedJobs={savedJobs} setSavedJobs={setSavedJobs} lang={lang} showToast={showToast} hasDraft={simpleOn && !!applyDraft && applyDraft.jobId === viewParams.id} />}
        {currentView === 'apply' && <ApplyWizard key={viewParams.id} t={t} navTo={navTo} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} setAppliedJobs={setAppliedJobs} lang={lang} simple={simpleOn} applyDraft={applyDraft} setApplyDraft={setApplyDraft} />}
        {currentView === 'opportunities' && <MyOpportunities allJobs={allJobs} key={viewParams.tab || 'saved'} initialTab={viewParams.tab} t={t} navTo={navTo} savedJobs={savedJobs} setSavedJobs={setSavedJobs} appliedJobs={appliedJobs} confirmedJobs={confirmedJobs} hideMoney={sharedOn} draftJobId={simpleOn && applyDraft ? applyDraft.jobId : null} />}
        {currentView === 'passport' && <PassportPage allJobs={allJobs} t={t} lang={lang} user={userProfile} setUser={setUserProfile} navTo={navTo} showToast={showToast} skillLevels={skillLevels} setSkillLevels={setSkillLevels} confirmedJobs={confirmedJobs} setConfirmedJobs={setConfirmedJobs} payChecklist={payChecklist} setPayChecklist={setPayChecklist} appliedJobs={appliedJobs} skillEvidence={skillEvidence} setSkillEvidence={setSkillEvidence} hideMoney={sharedOn} settings={settings} setSettings={setSettings} onSharedEnabled={() => setUnlocked(true)} evidence={evidence} />}
        {currentView === 'shield' && <ShieldSafetyPage t={t} lang={lang} user={userProfile} navTo={navTo} showToast={showToast} history={shieldHistory} setHistory={setShieldHistory} evidence={evidence} setEvidence={setEvidence} scrollKey={viewParams.n} scrollTo={viewParams.scrollTo} />}
        {currentView === 'ext' && <ExtensionPage t={t} lang={lang} navTo={navTo} />}
        {currentView === 'vault' && <EvidenceVaultPage t={t} lang={lang} user={userProfile} navTo={navTo} showToast={showToast} evidence={evidence} setEvidence={setEvidence} masked={sharedOn} />}
        {currentView === 'chat' && (appliedJobs.some(a => a.jobId === viewParams.id) && allJobs.find(j => j.id === viewParams.id)
          ? <ChatView key={viewParams.id} t={t} lang={lang} job={allJobs.find(j => j.id === viewParams.id)} user={userProfile} navTo={navTo} showToast={showToast} chats={chats} updateChat={updateChat} setEvidence={setEvidence} workrooms={workrooms} setWorkrooms={setWorkrooms} simple={simpleOn} chatDrafts={chatDrafts} setChatDrafts={setChatDrafts} getClientAction={getClientAction} clientAction={getClientAction(viewParams.id)} setClientAction={setClientAction} />
          : <ChatMissing t={t} navTo={navTo} />)}
        {currentView === 'workroom' && (appliedJobs.some(a => a.jobId === viewParams.id) && allJobs.find(j => j.id === viewParams.id)
          ? <WorkroomView key={viewParams.id} t={t} lang={lang} job={allJobs.find(j => j.id === viewParams.id)} navTo={navTo} showToast={showToast} workrooms={workrooms} setWorkrooms={setWorkrooms} confirmedJobs={confirmedJobs} setConfirmedJobs={setConfirmedJobs} hideMoney={sharedOn} />
          : <ChatMissing t={t} navTo={navTo} />)}
      {currentView === 'client' && <ClientView t={t} lang={lang} navTo={navTo} showToast={showToast} clientJobs={clientJobs} setClientJobs={setClientJobs} scrollTo={viewParams.scrollTo} />}
        {currentView === 'client-applicants' && <ClientApplicants t={t} lang={lang} navTo={navTo} job={clientJobs.find(j => j.id === viewParams.id)} />}
        {currentView === 'client-agreement' && <ClientAgreement t={t} lang={lang} navTo={navTo} job={clientJobs.find(j => j.id === viewParams.id)} applicant={DEMO_APPLICANTS.find(x => x.id === viewParams.applicantId)} onConfirm={confirmAgreement} />}
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

// --- SUBCOMPONENTS ---

// Reusable "suggestion only" note. Use it wherever the app or its AI suggests, writes or judges something.
function Disclaimer({ t, k, className = "" }) {
  return (
    <p className={`flex items-start gap-1.5 text-[13px] leading-[1.5] text-[#8A8580] ${className}`}>
      <Info size={14} className="mt-[3px] shrink-0" />
      <span>{t(k)}</span>
    </p>
  );
}

// --- NET PAYMENT PREVIEW ---
// SAMPLE ESTIMATES for this prototype only (not real fee quotes). Rate: 1 USD = NPR 133.
// fee in USD = amount * pct / 100 + flat. Net NPR is rounded to the nearest 10 for display.
const PAY_RATE = 133;
const PAY_METHODS = [
  { id: 'bank', pct: 2, flat: 15 },     // Bank transfer: 2% + $15 flat
  { id: 'payoneer', pct: 2, flat: 0 },  // Payoneer: 2% + $0
  { id: 'wise', pct: 1.5, flat: 1 },    // Wise: 1.5% + $1 flat
];

function NetPayPreview({ usd, t }) {
  const [method, setMethod] = useState('bank');
  const m = PAY_METHODS.find(x => x.id === method);
  const amount = Number(usd) || 0;
  const gross = amount * PAY_RATE;
  const fee = (amount * m.pct / 100 + m.flat) * PAY_RATE;
  const net = gross - fee;
  const netShown = Math.round(net / 10) * 10;
  const label = (id) => id === 'bank' ? t('np_bank') : id === 'payoneer' ? 'Payoneer' : 'Wise';
  return (
    <div>
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Wallet size={22} className="text-[#C73E33] shrink-0" /> {t('np_title')}</h3>
        <div className="flex flex-wrap gap-2 mb-5">
          {PAY_METHODS.map(x => (
            <button key={x.id} onClick={() => setMethod(x.id)} aria-pressed={method === x.id} className={`px-4 rounded-full border text-base font-semibold min-h-[44px] transition-colors ${method === x.id ? 'border-[#C73E33] bg-[#FAF0EE] text-[#AE332A]' : 'border-[#EAE7E1] bg-white text-[#4A4744] hover:border-[#DDD8CE]'}`}>
              {label(x.id)}
            </button>
          ))}
        </div>
        <div className="space-y-3 text-base">
          <div className="flex justify-between gap-4"><span className="text-[#4A4744]">{t('np_price')}</span><span className="font-semibold">${fmtMoney(amount)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#4A4744]">{t('np_rupees')}</span><span className="font-semibold">NPR {fmtMoney(Math.round(gross))}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#4A4744]">{t('np_fees')}</span><span className="font-semibold">− NPR {fmtMoney(Math.round(fee))}</span></div>
        </div>
        <div className="border-t border-[#EAE7E1] mt-4 pt-4">
          {net > 0 && netShown > 0 ? (
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <span className="font-semibold text-lg">{t('np_receive')}</span>
              <span className="font-semibold text-2xl">NPR {fmtMoney(netShown)}</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-[#AE332A] font-semibold text-base bg-[#FAF0EE] p-3 rounded-[12px]"><AlertTriangle size={20} className="mt-0.5 shrink-0" /> <span>{t('np_warn')}</span></div>
          )}
        </div>
      </div>
      <Disclaimer t={t} k="disc_paynet" className="mt-3" />
    </div>
  );
}

// Small calculator for the Passport "Getting paid" section
function NetPayCalculator({ t }) {
  const [val, setVal] = useState('60');
  return (
    <div className="mt-6 mb-8">
      <label htmlFor="np-calc" className="block text-base font-semibold mb-2">{t('np_calc_label')}</label>
      <input id="np-calc" type="number" inputMode="decimal" min="0" value={val} onChange={e => setVal(e.target.value)} className="w-full sm:w-48 mb-4 px-4 border border-[#EAE7E1] rounded-full text-base min-h-[48px] bg-white focus:outline-none focus:border-[#C73E33]" />
      <NetPayPreview usd={Math.max(0, parseFloat(val) || 0)} t={t} />
    </div>
  );
}

// Soft segmented language switch (white pill on a warm grey track)
function LangToggle({ lang, setLang, compact = false }) {
  const opt = (code, label) => (
    <button
      key={code}
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`relative rounded-full font-medium transition-all before:content-[''] before:absolute before:-inset-y-2 before:-inset-x-0.5 ${compact ? 'px-3 py-1.5 text-sm' : 'px-6 py-2 text-[15px] min-h-[44px]'} ${lang === code ? 'bg-white text-[#1C1B1A] shadow-[0_1px_2px_rgba(28,27,26,0.08)]' : 'text-[#8A8580] hover:text-[#4A4744]'}`}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-[#F0EEE9]">
      {opt('en', compact ? 'EN' : 'English')}
      {opt('ne', compact ? 'ने' : 'नेपाली')}
    </div>
  );
}

function PassportShieldIcon({ color = "black", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
    </svg>
  );
}

function NavLink({ label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`min-h-[48px] flex items-center whitespace-nowrap text-base font-medium border-b-2 transition-colors ${active ? 'border-[#C73E33] text-[#AE332A]' : 'border-transparent text-[#4A4744] hover:text-[#1C1B1A]'}`}
    >
      {label}
    </button>
  );
}

// Demo notifications (sample content only, kept in memory — nothing is stored)
function NotificationBell({ t, priv = false }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(['nt_1', 'nt_2', 'nt_3']);
  const ref = useRef();
  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={t('nt_title')} className="relative min-h-[48px] min-w-[44px] px-2 flex items-center justify-center rounded-full hover:bg-[#F0EEE9]">
        <Bell size={24} className="text-[#4A4744]" />
        {items.length > 0 && <div className="absolute top-3 right-2 w-2.5 h-2.5 bg-[#C73E33] rounded-full ring-2 ring-[#FBFAF8]"></div>}
      </button>
      {open && (
        <div className="absolute right-[-72px] sm:right-0 mt-2 w-[min(340px,calc(100vw-32px))] bg-white border border-[#EAE7E1] rounded-[20px] shadow-[0_8px_24px_rgba(28,27,26,0.08)] overflow-hidden z-50" role="dialog" aria-label={t('nt_title')}>
          <div className="flex items-center justify-between gap-2 pl-5 pr-2 py-1 border-b border-[#EAE7E1]">
            <div>
              <div className="font-semibold text-base">{t('nt_title')}</div>
              <div className="text-[13px] text-[#6E6963]">{t('nt_demo')}</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t('pp_close')} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-[#F6F4EF]"><X size={20} /></button>
          </div>
          {priv ? (
            <p className="px-5 py-6 text-base text-[#1C1B1A]">{t('pv_notif_private')}</p>
          ) : items.length === 0 ? (
            <p className="px-5 py-6 text-base text-[#4A4744]">{t('nt_empty')}</p>
          ) : (
            <ul className="divide-y divide-[#EAE7E1] max-h-[60vh] overflow-y-auto">
              {items.map(k => (
                <li key={k} className="px-5 py-4">
                  <p className="text-base text-[#1C1B1A] mb-2">{t(k)}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-[#F0EEE9] px-3 py-1 text-[13px] font-semibold text-[#6E6963]">{t('nt_demo')}</span>
                    <button onClick={() => setItems(prev => prev.filter(x => x !== k))} className="min-h-[44px] px-3 text-base font-semibold text-[#4A4744] underline underline-offset-4">{t('nt_dismiss')}</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function UserDropdown({ user, onLogout, t, navTo, lang, setLang, showLock = false, onLock }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    const handleClick = (e) => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 bg-[#F6F4EF] border border-[#EAE7E1] rounded-full pl-1.5 pr-3 py-1.5 hover:bg-[#EDEAE4] transition-colors min-h-[48px]">
        <div className="w-8 h-8 bg-[#FAF0EE] text-[#AE332A] rounded-full flex items-center justify-center text-sm font-semibold">{initials}</div>
        <div className="text-sm text-left hidden sm:block">
          <div className="font-semibold leading-tight text-[#1C1B1A]">{user.name.split(' ')[0]}</div>
          <div className="text-[#6E6963] leading-tight text-[13px]">{user.badge || "Beginner"}</div>
        </div>
        <ChevronDown size={16} className="text-[#4A4744]" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EAE7E1] rounded-[16px] shadow-[0_8px_24px_rgba(28,27,26,0.08)] overflow-hidden z-50">
          <div className="px-5 py-4 border-b border-[#EAE7E1] sm:hidden">
            <div className="font-semibold text-[#1C1B1A] text-lg">{user.name}</div>
            <div className="text-sm text-[#8A8580]">{user.badge || "Beginner"}</div>
          </div>
          <button onClick={() => { navTo('passport'); setOpen(false); }} className="w-full text-left px-5 py-4 min-h-[48px] text-base text-[#4A4744] hover:bg-[#F6F4EF] border-b border-[#EAE7E1]">{t('nav_passport')}</button>
          <button onClick={() => { setLang(lang === 'en' ? 'ne' : 'en'); setOpen(false); }} className="w-full text-left px-5 py-4 min-h-[48px] text-base text-[#4A4744] hover:bg-[#F6F4EF] border-b border-[#EAE7E1]">Language: {lang === 'en' ? 'नेपाली' : 'English'}</button>
          {showLock && <button onClick={() => { setOpen(false); onLock(); }} className="w-full text-left px-5 py-4 min-h-[48px] text-base text-[#4A4744] hover:bg-[#F6F4EF] border-b border-[#EAE7E1] flex items-center gap-3"><Lock size={20} /> {t('pv_lock_now')}</button>}
          <button onClick={() => { onLogout(); setOpen(false); }} className="w-full text-left px-5 py-4 min-h-[48px] text-base text-[#AE332A] hover:bg-[#F6F4EF] flex items-center gap-3 font-semibold"><LogOut size={20}/> {t('nav_logout')}</button>
        </div>
      )}
    </div>
  );
}

// --- PRIVACY AND EASE: LOCK SCREEN, QUICK HIDE SCREEN, PIN INPUT ---
const MASK = "••••";
// Print target: tells the print CSS which hidden document to show ("passport" or "vault"), then clears it afterwards.
function printDocument(target) {
  document.body.dataset.print = target;
  const clear = () => { delete document.body.dataset.print; window.removeEventListener('afterprint', clear); };
  window.addEventListener('afterprint', clear);
  window.print();
}
const PIN_INPUT_CLASS = "w-full min-h-[48px] border border-[#EAE7E1] bg-white rounded-[14px] px-4 text-base tracking-[0.3em] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30";
const onlyDigits = (v) => String(v).replace(/\D/g, '').slice(0, 4);

function LockScreen({ t, pin, onUnlock }) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);
  const submit = (e) => {
    e.preventDefault();
    if (value === pin) { onUnlock(); } else { setWrong(true); setValue(""); if (inputRef.current) inputRef.current.focus(); }
  };
  return (
    <div className="min-h-screen bg-[#FBFAF8] font-sans text-[#1C1B1A] flex items-center justify-center px-5 py-12">
      <form onSubmit={submit} className="w-full max-w-[360px] flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-10">
          <PassportShieldIcon color="#C73E33" size={28} />
          <span className="text-xl font-semibold tracking-tight">WorkPassport</span>
        </div>
        <label htmlFor="wp-lock-pin" className="text-lg font-semibold mb-3">{t('pv_lock_title')}</label>
        <input id="wp-lock-pin" ref={inputRef} type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={value} onChange={e => { setValue(onlyDigits(e.target.value)); setWrong(false); }} className={`${PIN_INPUT_CLASS} text-center text-2xl mb-3`} aria-invalid={wrong} aria-describedby={wrong ? 'wp-lock-err' : undefined} />
        {wrong && <p id="wp-lock-err" role="alert" className="w-full text-[#AE332A] text-base mb-3 bg-[#FAF0EE] rounded-[12px] px-4 py-3">{t('pv_lock_wrong')}</p>}
        <button type="submit" className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px] px-6 mt-2">{t('pv_lock_open')}</button>
      </form>
    </div>
  );
}

// A neutral screen to show if someone looks over her shoulder. Returning needs the PIN.
function QuickHideScreen({ t, onReturn }) {
  return (
    <div className="min-h-screen bg-[#FBFAF8] font-sans text-[#1C1B1A] flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[340px] bg-white border border-[#EAE7E1] rounded-[20px] p-8 text-center">
        <Sun size={48} strokeWidth={1.5} className="mx-auto mb-4 text-[#8A8580]" />
        <h1 className="text-xl font-semibold mb-2">{t('pv_weather_title')}</h1>
        <p className="text-2xl font-semibold text-[#4A4744]">{t('pv_weather_now')}</p>
      </div>
      <button onClick={onReturn} className="mt-6 min-h-[44px] px-4 text-base text-[#8A8580] underline underline-offset-4 hover:text-[#4A4744]">{t('pv_weather_return')}</button>
    </div>
  );
}

function ToggleKnob({ on }) {
  return (
    <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${on ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
  );
}

function PrivacySection({ t, settings, setSettings, onSharedEnabled = () => {} }) {
  const [mode, setMode] = useState(null); // null | 'setup' | 'off'
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [offPin, setOffPin] = useState("");
  const [err, setErr] = useState("");

  const reset = () => { setMode(null); setP1(""); setP2(""); setOffPin(""); setErr(""); };
  const toggleShared = () => {
    if (mode) { reset(); return; }
    setErr("");
    setMode(settings.shared ? 'off' : 'setup');
  };
  const savePin = (e) => {
    e.preventDefault();
    if (p1 !== p2) { setErr(t('pv_pin_mismatch')); return; }
    if (!/^\d{4}$/.test(p1)) { setErr(t('pv_pin_digits')); return; }
    setSettings({ ...settings, shared: true, pin: p1 });
    onSharedEnabled(); // she just set the PIN, so this session stays open
    reset();
  };
  const turnOff = (e) => {
    e.preventDefault();
    if (offPin !== settings.pin) { setErr(t('pv_lock_wrong')); setOffPin(""); return; }
    setSettings({ ...settings, shared: false, pin: "" });
    reset();
  };
  const errBox = err ? <p role="alert" className="text-[#AE332A] text-base bg-[#FAF0EE] rounded-[12px] px-4 py-3">{err}</p> : null;
  const secondaryBtn = "flex-1 border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] px-5";
  const primaryBtn = "flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px] px-5";

  return (
    <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
      <h2 className="font-semibold text-[22px] mb-5">{t('pv_title')}</h2>
      <div className="space-y-3">
        {/* Shared Device Mode */}
        <div className="border border-[#EAE7E1] rounded-[14px] bg-white">
          <button type="button" onClick={toggleShared} role="switch" aria-checked={settings.shared} aria-describedby="pv-shared-desc" className="w-full flex items-center justify-between p-5 pb-3 min-h-[48px] text-left rounded-[14px]">
            <span className="text-base font-medium pr-4">{t('pv_shared_label')}</span>
            <ToggleKnob on={settings.shared} />
          </button>
          <p id="pv-shared-desc" className="px-5 pb-5 text-base text-[#4A4744]">{t('pv_shared_desc')}</p>
          {mode === 'setup' && (
            <form onSubmit={savePin} className="px-5 pb-5 space-y-4 border-t border-[#EAE7E1] pt-5">
              <div>
                <label htmlFor="pv-pin-1" className="block text-base font-semibold mb-2">{t('pv_pin_create')}</label>
                <input id="pv-pin-1" type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={p1} onChange={e => { setP1(onlyDigits(e.target.value)); setErr(""); }} className={PIN_INPUT_CLASS} />
              </div>
              <div>
                <label htmlFor="pv-pin-2" className="block text-base font-semibold mb-2">{t('pv_pin_again')}</label>
                <input id="pv-pin-2" type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={p2} onChange={e => { setP2(onlyDigits(e.target.value)); setErr(""); }} className={PIN_INPUT_CLASS} />
              </div>
              {errBox}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className={primaryBtn}>{t('save')}</button>
                <button type="button" onClick={reset} className={secondaryBtn}>{t('cancel')}</button>
              </div>
            </form>
          )}
          {mode === 'off' && (
            <form onSubmit={turnOff} className="px-5 pb-5 space-y-4 border-t border-[#EAE7E1] pt-5">
              <div>
                <label htmlFor="pv-pin-off" className="block text-base font-semibold mb-2">{t('pv_lock_title')}</label>
                <input id="pv-pin-off" type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={offPin} onChange={e => { setOffPin(onlyDigits(e.target.value)); setErr(""); }} className={PIN_INPUT_CLASS} />
              </div>
              {errBox}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className={primaryBtn}>{t('pv_pin_turnoff')}</button>
                <button type="button" onClick={reset} className={secondaryBtn}>{t('cancel')}</button>
              </div>
            </form>
          )}
        </div>

        {/* Low-Data / Simple Mode */}
        <div className="border border-[#EAE7E1] rounded-[14px] bg-white">
          <button type="button" onClick={() => setSettings({ ...settings, simple: !settings.simple })} role="switch" aria-checked={settings.simple} aria-describedby="pv-simple-desc" className="w-full flex items-center justify-between p-5 pb-3 min-h-[48px] text-left rounded-[14px]">
            <span className="text-base font-medium pr-4">{t('pv_simple_label')}</span>
            <ToggleKnob on={settings.simple} />
          </button>
          <p id="pv-simple-desc" className="px-5 pb-5 text-base text-[#4A4744]">{t('pv_simple_desc')}</p>
        </div>
      </div>
    </div>
  );
}

// --- MUTE / BLOCK / REPORT ---
const REPORT_REASONS = [
  { id: 'scam', key: 'ca_r_scam' },
  { id: 'harassment', key: 'ca_r_harassment' },
  { id: 'photos', key: 'ca_r_photos' },
  { id: 'other', key: 'ca_r_other' },
];

function ReportClientModal({ t, initial, onSend, onClose }) {
  const [reason, setReason] = useState(initial || null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="fixed inset-0 z-[60] bg-[#1C1B1A]/40 flex items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="ca-report-title" className="bg-white rounded-[20px] border border-[#EAE7E1] p-6 w-full max-w-[420px] max-h-[90vh] overflow-y-auto">
        <h2 id="ca-report-title" className="font-semibold text-2xl mb-5">{t('ca_report_title')}</h2>
        <div role="radiogroup" aria-labelledby="ca-report-title" className="space-y-3 mb-6">
          {REPORT_REASONS.map(r => (
            <label key={r.id} className={`flex items-center gap-3 p-4 rounded-[14px] border cursor-pointer min-h-[52px] text-base font-medium ${reason === r.id ? 'border-[#C73E33] bg-[#FAF0EE]' : 'border-[#EAE7E1] bg-white hover:border-[#DDD8CE]'}`}>
              <input type="radio" name="ca-report-reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} className="accent-[#C73E33] w-5 h-5 shrink-0" />
              <span>{t(r.key)}</span>
            </label>
          ))}
        </div>
        <div className="space-y-3">
          <button onClick={() => onSend(reason)} disabled={!reason} className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px] px-6">{t('ca_send_report')}</button>
          <button onClick={onClose} className="w-full border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[48px] px-6">{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg }) {
  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-32px)] bg-[#1C1B1A] text-white px-6 py-3.5 rounded-full text-base font-medium z-50 flex items-center gap-3">
      <CheckCircle2 size={20} className="text-white shrink-0" />
      <span>{msg}</span>
    </div>
  );
}

// --- MY WORKPASSPORT ---
const LEVEL_WEIGHT = { self: 10, demonstrated: 40, institution: 70, client: 100, platform: 100 };
const LEVEL_ORDER = ['self', 'demonstrated', 'institution', 'client', 'platform'];
const DEMO_SEED = { Photoshop: 'institution', Canva: 'demonstrated' };
const DEMO_INSTITUTE = "ABC Training Institute, Biratnagar — Graphic Design course";
const DEFAULT_RULES = { chat: true, calls: true, time: true, photo: true, hours: true };
const RULE_KEYS = ['chat', 'calls', 'time', 'photo', 'hours'];

const isDemoUser = (u) => !!u && u.name === MAYA_PROFILE.name && !('institute' in u);
const getLevel = (user, stored, skill) => (stored && stored[skill]) || (isDemoUser(user) ? (DEMO_SEED[skill] || 'self') : 'self');
// One number format and one short date format for the whole app.
const fmtMoney = (n) => Number(n).toLocaleString('en-US');
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fmt = (str, vars) => Object.keys(vars).reduce((acc, k) => acc.split('{' + k + '}').join(vars[k]), str);
const slugify = (name) => (name || 'freelancer').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'freelancer';
const initialsOf = (name) => (name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
const o = (en, ne) => ({ en, ne: ne || en });

function LevelBadge({ level, t }) {
  const style = level === 'self' ? 'bg-[#F0EEE9] text-[#4A4744] border border-[#F0EEE9]'
    : level === 'demonstrated' ? 'bg-[#FAF0EE] text-[#AE332A] border border-[#FAF0EE]'
    : 'bg-white text-[#1C1B1A] border border-[#1C1B1A]';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold ${style}`}>
      {(level === 'institution' || level === 'client' || level === 'platform') && <Check size={14} />}
      {t('pp_lvl_' + level)}
    </span>
  );
}

function RuleToggle({ label, on, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 border border-[#EAE7E1] rounded-[14px] hover:border-[#DDD8CE] transition-colors bg-white min-h-[48px] text-left" role="switch" aria-checked={on}>
      <span className="text-base font-medium pr-4">{label}</span>
      <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${on ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}></div>
      </div>
    </button>
  );
}

// --- PROOF OF WORK (wp_skill_evidence = { [skill]: [{ id, type: "photo" | "link", src, note, date }] }, max 6 per skill) ---
const MAX_PROOF = 6;
const EVIDENCE_KEY = 'wp_skill_evidence';
const SEED_PHOTO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkJGQUY4Ii8+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI4MDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjQzczRTMzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iOTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI1MiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhJTUFMIENPRkZFRTwvdGV4dD4KPGNpcmNsZSBjeD0iNDAwIiBjeT0iMzMwIiByPSIxMDUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0M3M0UzMyIgc3Ryb2tlLXdpZHRoPSIxMCIvPgo8cGF0aCBkPSJNIDUwNSAzMDAgQSA2MCA2MCAwIDEgMSA1MDUgMzYwIiBmaWxsPSJub25lIiBzdHJva2U9IiNDNzNFMzMiIHN0cm9rZS13aWR0aD0iMTAiLz4KPHJlY3QgeD0iMzMwIiB5PSI0NTUiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHJ4PSI1IiBmaWxsPSIjQzczRTMzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNTIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiMxQzFCMUEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ28gYW5kIE1lbnUgRGVzaWduPC90ZXh0Pgo8dGV4dCB4PSI0MDAiIHk9IjU2MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmaWxsPSIjOEE4NTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TYW1wbGUgd29yayBieSBNYXlhPC90ZXh0Pgo8L3N2Zz4K";
const makeEvidenceSeed = () => {
  const d = new Date().toISOString();
  return {
    Photoshop: [
      { id: 'seed-ps-photo', type: 'photo', src: SEED_PHOTO, note: "Logo and menu for Himal Coffee", date: d },
      { id: 'seed-ps-link', type: 'link', src: "https://mayashrestha.myportfolio.com", note: "My logo designs", date: d },
    ],
    Canva: [
      { id: 'seed-canva-link', type: 'link', src: "https://mayashrestha.myportfolio.com/instagram-posts", note: "Instagram posts for a clothing store", date: d },
    ],
  };
};
const proofDomain = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } };
const safeHref = (u) => (/^https?:\/\//i.test(u || '') ? u : undefined);
// Flat list of [skill, items[]] for every skill that has proof (the user's skills first, in their order).
const evidenceGroups = (skills, ev) => {
  const keys = [...skills.filter(s => ev[s] && ev[s].length), ...Object.keys(ev).filter(k => !skills.includes(k) && ev[k] && ev[k].length)];
  return keys.map(k => [k, ev[k]]);
};
// Reads an image file, shrinks it so the longest side is at most 1000px, returns a JPEG (quality 0.82) data URL.
function resizeImageToJpeg(file, maxSide = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h); // JPEG has no transparency
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) { reject(e); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const PROOF_INPUT = "w-full min-h-[48px] border border-[#EAE7E1] bg-white rounded-[14px] px-4 text-base outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30";
const PROOF_BTN = "inline-flex items-center justify-center gap-2 border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-5 font-semibold text-base hover:border-[#DDD8CE] hover:bg-[#F6F4EF] min-h-[48px]";

function ProofChip({ children }) {
  return <span className="inline-flex items-center bg-[#F0EEE9] text-[#4A4744] px-2.5 py-0.5 rounded-full text-[13px] font-semibold">{children}</span>;
}

function ProofArea({ skill, items, t, digits, onAdd, onRemove }) {
  const [mode, setMode] = useState(null); // null | 'photo' | 'link'
  const [photo, setPhoto] = useState(null);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef(null);
  const full = items.length >= MAX_PROOF;
  const close = () => { setMode(null); setPhoto(null); setUrl(""); setNote(""); setErr(""); };

  const pickFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setErr("");
    try {
      const dataUrl = await resizeImageToJpeg(file);
      setPhoto(dataUrl); setMode('photo');
    } catch (ex) { setPhoto(null); setMode('photo'); setErr(t('pr_photo_err')); }
  };
  const savePhoto = () => {
    if (!photo) return;
    const res = onAdd(skill, { type: 'photo', src: photo, note: note.trim() });
    if (res === 'full') { setErr(t('pr_storage_err')); return; }
    close();
  };
  const saveLink = () => {
    const u = url.trim();
    if (!/^https?:\/\/\S+$/i.test(u)) { setErr(t('pr_link_err')); return; }
    const res = onAdd(skill, { type: 'link', src: u, note: note.trim() });
    if (res === 'full') { setErr(t('pr_storage_err')); return; }
    close();
  };

  return (
    <div className="mt-5 pt-5 border-t border-[#EAE7E1]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 mb-3">
        <h4 className="font-semibold text-base text-[#1C1B1A]">{t('pr_title')}</h4>
        {items.length > 0 && <span className="text-sm text-[#6E6963]">{fmt(t('pr_count'), { n: digits(items.length) })}</span>}
      </div>

      {items.length === 0 && <p className="text-base text-[#6E6963] mb-4">{t('pr_none')}</p>}

      {items.length > 0 && (
        <div className="space-y-3 mb-4">
          {items.map(it => (
            <div key={it.id} className="flex items-start gap-3 bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] p-3">
              {it.type === 'photo'
                ? <img src={it.src} alt={it.note || skill} className="w-16 h-16 rounded-[14px] object-cover shrink-0 border border-[#EAE7E1]" />
                : <div className="w-16 h-16 rounded-[14px] bg-[#FAF0EE] flex items-center justify-center shrink-0"><Link2 size={24} className="text-[#C73E33]" /></div>}
              <div className="min-w-0 flex-1">
                {it.type === 'link' && (
                  <a href={safeHref(it.src)} target="_blank" rel="noopener noreferrer" className="block min-h-[24px] break-all">
                    <span className="block font-semibold text-base text-[#1C1B1A] underline underline-offset-4">{proofDomain(it.src)}</span>
                    <span className="block text-sm text-[#6E6963]">{it.src}</span>
                  </a>
                )}
                {it.note && <p className="text-base text-[#4A4744] break-words">{it.note}</p>}
                <div className="mt-1.5"><ProofChip>{t('pr_chip_you')}</ProofChip></div>
              </div>
              <button onClick={() => onRemove(skill, it.id)} aria-label={t('sf_delete')} title={t('sf_delete')} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#4A4744] hover:bg-[#F0EEE9] shrink-0 -mt-1 -mr-1"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>
      )}

      {mode === 'photo' && (
        <div className="border border-[#EAE7E1] rounded-[14px] p-4 mb-4 bg-white">
          {photo && <img src={photo} alt="" className="w-24 h-24 rounded-[14px] object-cover border border-[#EAE7E1] mb-3" />}
          {photo && (<>
            <label className="block text-sm font-semibold text-[#4A4744] mb-1.5" htmlFor={'pn-' + skill}>{t('pr_note_label')}</label>
            <input id={'pn-' + skill} value={note} onChange={e => setNote(e.target.value)} maxLength={140} placeholder={t('pr_note_ph')} className={PROOF_INPUT + " mb-3"} />
          </>)}
          {err && <p role="alert" className="text-[#AE332A] text-sm mb-3 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><AlertTriangle size={18} className="shrink-0 mt-0.5" /> <span>{err}</span></p>}
          <div className="flex flex-wrap gap-3">
            {photo && <button onClick={savePhoto} className="bg-[#C73E33] text-white rounded-full px-6 font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">{t('save')}</button>}
            <button onClick={close} className={PROOF_BTN}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {mode === 'link' && (
        <div className="border border-[#EAE7E1] rounded-[14px] p-4 mb-4 bg-white">
          <label className="block text-sm font-semibold text-[#4A4744] mb-1.5" htmlFor={'pu-' + skill}>{t('pr_link_label')}</label>
          <input id={'pu-' + skill} type="url" inputMode="url" value={url} onChange={e => { setUrl(e.target.value); setErr(""); }} placeholder="https://" className={PROOF_INPUT + " mb-3"} />
          <label className="block text-sm font-semibold text-[#4A4744] mb-1.5" htmlFor={'pl-' + skill}>{t('pr_note_label')}</label>
          <input id={'pl-' + skill} value={note} onChange={e => setNote(e.target.value)} maxLength={140} placeholder={t('pr_note_ph')} className={PROOF_INPUT + " mb-3"} />
          {err && <p role="alert" className="text-[#AE332A] text-sm mb-3 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><AlertTriangle size={18} className="shrink-0 mt-0.5" /> <span>{err}</span></p>}
          <div className="flex flex-wrap gap-3">
            <button onClick={saveLink} className="bg-[#C73E33] text-white rounded-full px-6 font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">{t('save')}</button>
            <button onClick={close} className={PROOF_BTN}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {!full && mode === null && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => { setErr(""); setNote(""); fileRef.current && fileRef.current.click(); }} className={PROOF_BTN}><ImagePlus size={20} /> {t('pr_add_photo')}</button>
          <button onClick={() => { setErr(""); setNote(""); setUrl(""); setMode('link'); }} className={PROOF_BTN}><Link2 size={20} /> {t('pr_add_link')}</button>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} className="hidden" aria-label={t('pr_add_photo')} />
    </div>
  );
}

// Work samples shown first on the public view. Every item is chipped as added by the freelancer.
function WorkSamples({ groups, t }) {
  if (!groups.length) return null;
  return (
    <section className="mb-10">
      <h2 className="font-semibold text-[22px] mb-4">{t('pr_gallery_title')}</h2>
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6 space-y-6">
        {groups.map(([skill, items]) => (
          <div key={skill}>
            <h3 className="text-sm font-semibold text-[#6E6963] mb-3">{skill}</h3>
            <div className="space-y-3">
              {items.map(it => (
                <div key={it.id} className="flex items-start gap-4">
                  {it.type === 'photo'
                    ? <img src={it.src} alt={it.note || skill} className="w-[120px] h-[120px] rounded-[14px] object-cover shrink-0 border border-[#EAE7E1]" />
                    : null}
                  <div className="min-w-0 flex-1">
                    {it.type === 'link' && (
                      <a href={safeHref(it.src)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 min-h-[48px] bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] px-3 py-2 mb-1.5">
                        <span className="w-10 h-10 rounded-[12px] bg-[#FAF0EE] flex items-center justify-center shrink-0"><Link2 size={20} className="text-[#C73E33]" /></span>
                        <span className="min-w-0 font-semibold text-base text-[#1C1B1A] break-all">{proofDomain(it.src)}</span>
                      </a>
                    )}
                    {it.note && <p className="text-base text-[#4A4744] break-words mb-1.5">{it.note}</p>}
                    <ProofChip>{t('pr_chip_freelancer')}</ProofChip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-[#6E6963] mt-3">{t('pr_honesty')}</p>
    </section>
  );
}

// PDF: print-only document, rendered straight into <body> so print CSS can hide the whole app (#root).
function PassportPrint({ t, lang, user, levels, evidenceMap, confirmedList, provenCount, earned, hideMoney, digits }) {
  const today = new Date().toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const earnedTxt = hideMoney ? MASK : `NPR ${fmtMoney(earned)}`;
  return createPortal(
    <div className="passport-print">
      <div className="pp-brand">WorkPassport</div>
      <h1 className="pp-name">{user.name}</h1>
      <div className="pp-stats">
        <div><strong>{digits(provenCount)}</strong><span>{t('pp_stat_skills')}</span></div>
        <div><strong>{digits(confirmedList.length)}</strong><span>{t('pp_stat_jobs')}</span></div>
        <div><strong>{earnedTxt}</strong><span>{t('pp_stat_earned')}</span></div>
      </div>

      <h2>{t('pdf_skills_proof')}</h2>
      {levels.map(({ skill, level }) => {
        const items = evidenceMap[skill] || [];
        return (
          <div key={skill} className="pp-skill">
            <div className="pp-skill-head"><strong>{skill}</strong> — {t('pp_lvl_' + level)} — {fmt(t('pr_count'), { n: digits(items.length) })}</div>
            {items.map(it => (
              <div key={it.id} className="pp-item">
                {it.type === 'photo' && <img src={it.src} alt="" />}
                <div>
                  {it.type === 'link' && <div className="pp-url">{it.src}</div>}
                  {it.note && <div>{it.note}</div>}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      <h2>{t('pp_work_title')}</h2>
      {confirmedList.length === 0 ? <p>{t('pp_public_empty')}</p> : confirmedList.map(j => (
        <div key={j.id} className="pp-job"><strong>{j.title}</strong> — {j.clientName} — {hideMoney ? MASK : `NPR ${fmtMoney(j.budgetUSD * 133)}`}</div>
      ))}

      <p className="pp-foot">{t('pdf_footer')}</p>
      <p className="pp-foot">{fmt(t('pdf_made_on'), { date: today })}</p>
    </div>,
    document.body
  );
}

function PassportPage({ allJobs = DUMMY_JOBS, t, lang, user, setUser, navTo, showToast, skillLevels, setSkillLevels, confirmedJobs, setConfirmedJobs, payChecklist, setPayChecklist, appliedJobs, skillEvidence = {}, setSkillEvidence = () => {}, hideMoney = false, settings, setSettings, onSharedEnabled = () => {}, evidence = [] }) {
  const [view, setView] = useState('main'); // main | public
  const [shareOpen, setShareOpen] = useState(false);

  const skills = user.skills || [];
  const levels = skills.map(sk => ({ skill: sk, level: getLevel(user, skillLevels, sk) }));
  const progress = levels.length ? Math.round(levels.reduce((a, l) => a + LEVEL_WEIGHT[l.level], 0) / levels.length) : 0;
  const provenCount = levels.filter(l => l.level !== 'self').length;
  const confirmedList = confirmedJobs.map(id => allJobs.find(j => j.id === id)).filter(Boolean);
  const earned = confirmedList.reduce((a, j) => a + j.budgetUSD * 133, 0);
  const waiting = [];
  appliedJobs.forEach(a => { if (!confirmedJobs.includes(a.jobId) && !waiting.some(w => w.jobId === a.jobId)) waiting.push(a); });
  const rules = user.safetyRules || DEFAULT_RULES;
  const enc = progress <= 25 ? t('pp_enc1') : progress <= 60 ? t('pp_enc2') : t('pp_enc3');
  const link = `workpassport.app/p/${slugify(user.name)}`;
  const digits = (n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const evidenceMap = skillEvidence && typeof skillEvidence === 'object' ? skillEvidence : {};
  const groups = evidenceGroups(skills, evidenceMap);
  // Evidence is a separate record. It must NEVER touch wp_skill_levels or any badge: uploads are proof added by her, not verification.
  const addProof = (skill, item) => {
    const cur = Array.isArray(evidenceMap[skill]) ? evidenceMap[skill] : [];
    if (cur.length >= MAX_PROOF) return 'max';
    const next = { ...evidenceMap, [skill]: [...cur, { id: 'ev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7), date: new Date().toISOString(), ...item }] };
    try { window.localStorage.setItem(EVIDENCE_KEY, JSON.stringify(next)); } catch (e) { return 'full'; } // storage full: keep the app working, save nothing
    setSkillEvidence(next);
    showToast(t('sf_saved_toast'));
    return 'ok';
  };
  const removeProof = (skill, id) => {
    // Same rule: deleting evidence never changes skill levels.
    const next = { ...evidenceMap, [skill]: (evidenceMap[skill] || []).filter(x => x.id !== id) };
    setSkillEvidence(next);
    showToast(t('sf_deleted'));
  };
  const printDoc = <PassportPrint t={t} lang={lang} user={user} levels={levels} evidenceMap={evidenceMap} confirmedList={confirmedList} provenCount={provenCount} earned={earned} hideMoney={hideMoney} digits={digits} />;
  const instituteOf = (skill, level) => level === 'institution' ? (isDemoUser(user) ? DEMO_INSTITUTE : (user.institute || '')) : '';

  const confirmJob = (id) => {
    setConfirmedJobs(prev => prev.includes(id) ? prev : [...prev, id]);
    showToast(t('pp_confirm_toast'));
  };
  const togglePay = (i) => setPayChecklist(prev => { const a = [...(Array.isArray(prev) && prev.length === 4 ? prev : [false, false, false, false])]; a[i] = !a[i]; return a; });
  const toggleRule = (k) => setUser({ ...user, safetyRules: { ...rules, [k]: !rules[k] } });
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(link); } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = link; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('pp_link_copied'));
  };

  if (view === 'public') {
    return (
      <div className="max-w-[760px] mx-auto">
        {printDoc}
        <div className="flex flex-wrap items-center justify-between gap-x-4 mb-2">
          <button onClick={() => { setView('main'); window.scrollTo(0, 0); }} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px]"><ChevronLeft size={20} /> {t('pp_back_my')}</button>
          <button onClick={() => printDocument('passport')} className={PROOF_BTN}><Download size={20} /> {t('pdf_btn')}</button>
        </div>
        <p className="text-sm text-[#8A8580] mb-4">{t('pp_preview_note')}</p>
        <WorkSamples groups={groups} t={t} />
        <div className="bg-[#FAF0EE] text-[#AE332A] rounded-[14px] px-5 py-4 flex items-start gap-3 font-semibold mb-8"><ShieldCheck size={22} className="shrink-0 mt-0.5" /> <span>{t('pp_public_strip')}</span></div>

        <h2 className="font-semibold text-[22px] mb-4">{t('pp_work_title')}</h2>
        {confirmedList.length === 0 ? (
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-lg text-[#4A4744] mb-10">{t('pp_public_empty')}</div>
        ) : (
          <div className="space-y-4 mb-10">
            {confirmedList.map(j => (
              <div key={j.id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-6">
                <div className="font-semibold text-xl mb-1">{j.title}</div>
                <div className="text-base text-[#4A4744] mb-3">{j.clientName}</div>
                <LevelBadge level="client" t={t} />
              </div>
            ))}
          </div>
        )}

        <h2 className="font-semibold text-[22px] mb-4">{t('pp_skills_title')}</h2>
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] divide-y divide-[#EAE7E1] mb-10">
          {levels.map(({ skill, level }) => (
            <div key={skill} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-semibold text-lg">{skill}</span>
              <LevelBadge level={level} t={t} />
            </div>
          ))}
        </div>

        <div className="space-y-1 mb-10 text-base text-[#4A4744]">
          {RULE_KEYS.filter(k => rules[k]).map(k => <p key={k}><span className="font-semibold text-[#1C1B1A]">{t('pp_working_rules')}</span> {t('rule_' + k)}</p>)}
        </div>

        <h2 className="font-semibold text-[22px] mb-4">{t('pp_about')}</h2>
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#F0EEE9] border border-[#EAE7E1] flex items-center justify-center font-semibold text-xl text-[#1C1B1A] shrink-0">{initialsOf(user.name)}</div>
          <div>
            <div className="font-semibold text-xl">{user.name}</div>
            <div className="text-base text-[#4A4744]">{user.district}</div>
          </div>
        </div>
        <p className="text-sm text-[#8A8580] text-center">{t('pp_public_footer')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      {printDoc}
      {/* Section 1: header */}
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#F0EEE9] border border-[#EAE7E1] flex items-center justify-center font-semibold text-xl text-[#1C1B1A] shrink-0">{initialsOf(user.name)}</div>
          <div className="min-w-0">
            <h1 className="text-[28px] sm:text-[30px] font-semibold truncate">{user.name}</h1>
            <div className="text-base text-[#4A4744] flex flex-wrap items-center gap-x-3 gap-y-1"><span className="flex items-center gap-1.5"><MapPin size={20} /> {user.district}</span><span className="bg-[#F0EEE9] px-3 py-0.5 rounded-full text-sm font-semibold">{t('pp_beginner')}</span></div>
          </div>
        </div>
        {!isDemoUser(user) && user.institute && <p className="text-base text-[#4A4744] mb-6">{fmt(t('pp_institute_pending'), { name: user.institute })}</p>}

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2"><span className="font-semibold text-base">{t('pp_progress')}</span><span className="font-semibold text-base">{digits(progress)}%</span></div>
          <div className="h-2 bg-[#F0EEE9] rounded-full overflow-hidden"><div className="h-full bg-[#C73E33] rounded-full transition-all" style={{ width: `${progress}%` }}></div></div>
          <p className="text-base text-[#4A4744] mt-3">{enc}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[[t('pp_stat_skills'), digits(provenCount)], [t('pp_stat_jobs'), digits(confirmedList.length)], [t('pp_stat_earned'), hideMoney ? MASK : `NPR ${fmtMoney(earned)}`]].map(([label, val]) => (
            <div key={label} className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] p-3 sm:p-4">
              <div className="font-semibold text-lg sm:text-2xl break-words">{val}</div>
              <div className="text-sm text-[#4A4744] mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <button onClick={() => setShareOpen(true)} className="flex-1 bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-5">{t('pp_share')}</button>
          <button onClick={() => { setView('public'); window.scrollTo(0, 0); }} className="flex-1 bg-white border border-[#E3E0D9] text-[#1C1B1A] py-3.5 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-5">{t('pp_see_clients')}</button>
          <button onClick={() => printDocument('passport')} className="flex-1 bg-white border border-[#E3E0D9] text-[#1C1B1A] py-3.5 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-5 inline-flex items-center justify-center gap-2"><Download size={20} /> {t('pdf_btn')}</button>
        </div>
      </div>

      {/* Section 2: skills */}
      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('pp_skills_title')}</h2>
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] divide-y divide-[#EAE7E1] mb-6">
          {levels.map(({ skill, level }) => (
            <div key={skill} className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2"><span className="font-semibold text-lg">{skill}</span><LevelBadge level={level} t={t} /></div>
                <p className="text-base text-[#4A4744]">{t('pp_desc_' + level)}</p>
                {level === 'demonstrated' && <p className="text-sm text-[#8A8580] mt-1">{t('pp_source')} {t('pp_src_demo')}</p>}
                {level === 'institution' && instituteOf(skill, level) && <p className="text-sm text-[#8A8580] mt-1">{t('pp_source')} {instituteOf(skill, level)}</p>}
              </div>
              <div className="sm:max-w-[220px] sm:text-right shrink-0">
                {level === 'demonstrated' && <p className="text-sm text-[#8A8580]">{t('pp_next_demo')}</p>}
                {level === 'institution' && <p className="text-sm text-[#8A8580]">{t('pp_next_inst')}</p>}
                {(level === 'client' || level === 'platform') && <p className="text-sm text-[#8A8580] flex items-center gap-2 sm:justify-end"><Check size={16} className="text-[#1C1B1A]" /> {t('pp_top')}</p>}
              </div>
            </div>
            <ProofArea skill={skill} items={Array.isArray(evidenceMap[skill]) ? evidenceMap[skill] : []} t={t} digits={digits} onAdd={addProof} onRemove={removeProof} />
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
          <h3 className="font-semibold text-xl mb-5">{t('pp_how_title')}</h3>
          <ol className="relative border-l-2 border-[#EAE7E1] ml-3 space-y-5">
            {LEVEL_ORDER.map((lv, i) => (
              <li key={lv} className="pl-6 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#C73E33]"></span>
                <div className="flex flex-wrap items-center gap-3 mb-1"><span className="text-sm font-semibold text-[#8A8580]">{digits(i + 1)}</span><LevelBadge level={lv} t={t} /></div>
                <p className="text-base text-[#4A4744]">{t('pp_desc_' + lv)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Section 4: completed work */}
      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('pp_work_title')}</h2>
        {confirmedList.length === 0 && waiting.length === 0 && (
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-center flex flex-col items-center gap-5">
            <CheckSquare size={40} className="text-[#D8D4CC]" />
            <p className="text-lg text-[#4A4744] max-w-md">{t('pp_work_empty')}</p>
            <button onClick={() => navTo('firstwork')} className="bg-[#C73E33] text-white px-8 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px]">{t('pp_find_job')}</button>
          </div>
        )}
        {waiting.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">{t('pp_applied_head')}</h3>
            <div className="space-y-4">
              {waiting.map(a => {
                const j = allJobs.find(x => x.id === a.jobId);
                if (!j) return null;
                return (
                  <div key={a.jobId} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                    <div className="font-semibold text-lg mb-1">{j.title}</div>
                    <div className="text-base text-[#4A4744] mb-1">{j.clientName}</div>
                    <div className="text-base font-semibold mb-3">NPR {hideMoney ? MASK : fmtMoney(a.npr || a.price * 133)}</div>
                    <span className="bg-[#F0EEE9] border border-[#EAE7E1] px-4 py-2 rounded-[12px] text-[#1C1B1A] font-semibold text-sm inline-flex items-center gap-2 mb-4"><CheckCircle2 size={16} /> {t('applied_status')}</span>
                    <button onClick={() => confirmJob(j.id)} className="w-full border-2 border-dashed border-[#D8D4CC] text-[#4A4744] rounded-full px-5 font-semibold text-base hover:border-[#8A8580] min-h-[48px] bg-white">{t('pp_demo_confirm')}</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {confirmedList.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">{t('pp_done_head')}</h3>
            <div className="space-y-4">
              {confirmedList.map(j => (
                <div key={j.id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                  <div className="font-semibold text-lg mb-1">{j.title}</div>
                  <div className="text-base text-[#4A4744] mb-3">{j.clientName}</div>
                  <div className="mb-3"><LevelBadge level="client" t={t} /></div>
                  <div className="text-base font-semibold">{fmt(t('pp_earned_line'), { n: hideMoney ? MASK : fmtMoney(j.budgetUSD * 133) })}</div>
                  <div className="text-sm text-[#8A8580] mt-1">{t('pp_confirmed_demo')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Evidence Vault link card */}
      <button onClick={() => navTo('vault')} className="w-full text-left bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6 hover:border-[#DDD8CE] flex items-center gap-4 min-h-[64px]">
        <Lock size={28} className="shrink-0 text-[#C73E33]" />
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-xl text-[#1C1B1A]">{t('ev_title')}</span>
          <span className="block text-base text-[#4A4744]">{fmt(t('ev_count'), { n: digits(Array.isArray(evidence) ? evidence.length : 0) })}</span>
        </span>
        <ArrowRight size={22} className="shrink-0 text-[#8A8580]" />
      </button>

      {/* Section 5: getting paid + safety rules */}
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
        <h2 className="font-semibold text-[22px] mb-5">{t('pp_pay_title')}</h2>
        <div className="space-y-3 mb-5">
          {[0, 1, 2, 3].map(i => {
            const on = !!(payChecklist && payChecklist[i]);
            return (
              <button key={i} onClick={() => togglePay(i)} className={`w-full flex items-start gap-3 p-4 rounded-[14px] border text-left min-h-[48px] transition-colors ${on ? 'border-[#C73E33] bg-[#FAF0EE]' : 'border-[#EAE7E1] bg-white hover:border-[#DDD8CE]'}`} role="checkbox" aria-checked={on}>
                {on ? <CheckSquare size={24} className="shrink-0 text-[#C73E33]" /> : <Square size={24} className="shrink-0 text-[#8A8580]" />}
                <span className="text-base font-medium">{t('pp_pay_' + (i + 1))}</span>
              </button>
            );
          })}
        </div>
        <Disclaimer t={t} k="disc_pay" className="mt-0" />
        <NetPayCalculator t={t} />
        <h3 className="font-semibold text-xl mb-4">{t('pp_rules_title')}</h3>
        <div className="space-y-3">
          {RULE_KEYS.map(k => <RuleToggle key={k} label={t('rule_' + k)} on={!!rules[k]} onClick={() => toggleRule(k)} />)}
        </div>
      </div>

      {/* Section 6: privacy and ease */}
      <PrivacySection t={t} settings={settings} setSettings={setSettings} onSharedEnabled={onSharedEnabled} />

      {/* Share modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1B1A]/40 flex items-center justify-center p-4" onClick={() => setShareOpen(false)}>
          <div className="bg-white rounded-[20px] border border-[#EAE7E1] p-6 sm:p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-2xl mb-3">{t('pp_share')}</h3>
            <p className="text-base text-[#4A4744] mb-5">{t('pp_share_desc')}</p>
            <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] px-4 py-3 text-base font-semibold break-all mb-5">{link}</div>
            <div className="space-y-3">
              <button onClick={copyLink} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-base rounded-full hover:bg-[#AE332A] min-h-[52px]">{t('pp_copy_link')}</button>
              <a href={`https://wa.me/?text=${encodeURIComponent('https://' + link)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 border border-[#E3E0D9] bg-white text-[#1C1B1A] font-semibold text-base rounded-full hover:bg-[#F6F4EF] min-h-[52px] flex items-center justify-center">{t('pp_whatsapp')}</a>
              <button onClick={() => setShareOpen(false)} className="w-full py-3 text-[#4A4744] font-semibold text-base rounded-full hover:bg-[#F6F4EF] min-h-[48px]">{t('pp_close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- WORKSHIELD ENGINE START ---
const SHIELD_RULES = {
  red: [
    { id: "fee", triggers: ["registration fee", "pay first", "deposit", "training fee", "send money", "processing fee", "activation fee"] },
    { id: "otp", triggers: ["otp", "password", "pin code", "bank pin", "cvv"] },
    { id: "crypto", triggers: ["gift card", "bitcoin", "crypto", "usdt"] },
    { id: "offplatform", triggers: ["whatsapp", "telegram", "viber", "personal number", "call me at night"] },
    { id: "photo", triggers: ["send your photo", "send a selfie", "your picture", "personal photo"] },
    { id: "urgency", triggers: ["urgent", "act now", "only today", "immediately", "last chance", "hurry"] },
  ],
  freetrial: ["free sample", "free work", "do one free", "unpaid trial", "trial work"],
  deliverables: ["logo", "poster", "design", "posts", "rows", "words", "article", "video", "photo edit", "file", "files", "page", "banner", "translation", "type", "typing", "label", "labels"],
  payWords: ["pay", "paid", "payment", "$", "rs", "npr", "salary", "rate"],
  payMethod: ["bank transfer", "esewa", "khalti", "milestone"],
  deadline: ["deadline", "days", "by friday", "by monday", "within a week", "tomorrow"],
};
const RED_ORDER = ["fee", "otp", "crypto", "highpay", "offplatform", "photo", "urgency"];

function extractAmounts(text) {
  const out = [];
  const re = /\$\s?(\d+(?:,\d{3})*(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push(parseFloat(m[1].replace(/,/g, '')));
  return out;
}

// structural = false is used for FirstWork job checks (no highpay / lowpay)
function analyzeText(text, structural = true) {
  const low = (text || "").toLowerCase();
  const has = (list) => list.some(w => low.includes(w));
  const amounts = extractAmounts(text || "");
  const maxAmt = amounts.length ? Math.max(...amounts) : 0;
  const hourWording = has(["/hour", "per hour", "an hour"]);
  const found = new Set();
  SHIELD_RULES.red.forEach(r => { if (has(r.triggers)) found.add(r.id); });
  let highpay = false;
  if (structural && amounts.length) {
    if (hourWording && maxAmt >= 40) highpay = true;
    if (maxAmt >= 1000 && has(["easy", "simple", "no experience"])) highpay = true;
  }
  if (highpay) found.add("highpay");
  const red = RED_ORDER.filter(id => found.has(id));

  const yellow = [];
  if (has(SHIELD_RULES.freetrial)) yellow.push("freetrial");
  const vague = !has(SHIELD_RULES.deliverables);
  if (vague) yellow.push("vague");
  if (!has(SHIELD_RULES.payWords)) yellow.push("nopay");
  if (structural && amounts.length && !highpay) {
    if ((hourWording && maxAmt < 3) || (!hourWording && maxAmt < 10)) yellow.push("lowpay");
  }

  const green = [];
  if (!vague) green.push("clearwork");
  if (has(SHIELD_RULES.payMethod) || (amounts.length > 0 && low.includes("paid"))) green.push("paymethod");
  if (has(SHIELD_RULES.deadline)) green.push("deadline");
  return { red, yellow, green };
}

function verdictOf(f) {
  return f.red.length >= 1 ? "danger" : f.yellow.length >= 1 ? "warning" : "ok";
}

function analyzeJob(job) {
  const text = job.title + " " + job.description + " " + (job.deliverables || []).join(" ");
  const f = analyzeText(text, false);
  // A FirstWork job always has a budget and a structured deliverables list, so the text-only
  // "payment not mentioned" and "work not clear" rules do not apply to it.
  f.yellow = f.yellow.filter(id => id !== "nopay" && id !== "vague");
  if (!f.green.includes("clearwork")) f.green.unshift("clearwork");
  const clientVerified = job.clientVerified !== undefined ? job.clientVerified : job.paymentVerified;
  if (clientVerified === false) f.yellow.push("unverified");
  if (clientVerified === true) f.green.push("verified");
  if (job.paymentVerified === true && !f.green.includes("paymethod")) f.green.push("paymethod");
  f.green.push("normalpay");
  return f;
}
// --- WORKSHIELD ENGINE END ---

// --- SAFETY (CLIENT CHAT) ENGINE START ---
const SAFETY_ORDER = ["photo", "meeting", "pressure", "call", "personal", "flirty", "night"];
const SAFETY_TRIGGERS = {
  photo: ["selfie", "send your photo", "send a photo", "send me a photo", "your photo", "your picture", "send pic", "photo of you", "personal photo"],
  call: ["video call", "voice call", "call me now", "call me", "phone call", "come on video"],
  night: ["are you still up", "still awake", "are you awake", "up late", "midnight", "so late at night"],
  personal: ["are you single", "boyfriend", "are you married", "how old are you", "your home address", "where do you live exactly", "send your number", "your phone number", "personal number"],
  meeting: ["meet me", "meet alone", "come to my office", "come to my home", "visit me", "meet in person", "hotel"],
  pressure: ["stupid", "idiot", "useless", "waste my time", "bad review if", "i will report you", "do it now or", "last warning", "shut up"],
  flirty: ["sweetheart", "beautiful girl", "pretty girl", "i like you", "you are cute"],
};
// which of her safety rules (keys in profile.safetyRules) each category breaks; pressure has none
const SAFETY_RULE_OF = { photo: "photo", call: "calls", night: "time", personal: "chat", meeting: "chat", flirty: "chat", pressure: null };

// --- SCOPE CHECK (transparent phrase rules; the matched phrases are shown as the reason) ---
const SCOPE_PHRASES = ["can you also", "could you also", "please also", "one more thing", "also make", "also create", "also write", "also design", "also add", "extra work", "for free", "quick favour", "quick favor", "while you're at it", "while you are at it", "not in our list", "not in the list", "not in the agreement", "add one more", "in addition to"];
function checkScope(text) {
  const low = String(text || '').toLowerCase();
  const found = [];
  SCOPE_PHRASES.forEach((p, order) => { const idx = low.indexOf(p); if (idx !== -1) found.push({ p, idx, order }); });
  found.sort((a, b) => a.idx - b.idx || a.order - b.order);
  const matched = found.slice(0, 3).map(f => f.p);
  return { flagged: found.length > 0, matched };
}

function analyzeMessage(text) {
  const low = (text || "").toLowerCase();
  return SAFETY_ORDER.filter(id => SAFETY_TRIGGERS[id].some(w => low.includes(w)));
}

const SAFETY_DATA = {
  photo: {
    name: { en: "Asks for personal photos", ne: "व्यक्तिगत फोटो मागेको" },
    expl: { en: "Work never needs your personal photo. Asking for photos is a common trick to misuse them.", ne: "कामका लागि तपाईंको व्यक्तिगत फोटो चाहिँदैन। फोटो माग्नु भनेको दुरुपयोग गर्ने सामान्य चाल हो।" },
    reply: { en: "I am sorry, I do not share personal photos. I am happy to share my work samples instead.", ne: "माफ गर्नुहोस्, म व्यक्तिगत फोटो बाँड्दिनँ। बरु म मेरा कामका नमुनाहरू पठाउन सक्छु।" },
  },
  call: {
    name: { en: "Pushes for phone or video calls", ne: "फोन वा भिडियो कलका लागि दबाब" },
    expl: { en: "Chat keeps a written record. On a call, there is no proof of what was said.", ne: "च्याटमा लेखिएको रेकर्ड रहन्छ। कलमा के भनियो भन्ने प्रमाण रहँदैन।" },
    reply: { en: "I prefer to keep all our communication in chat, so everything about the work is written down. Please message me here.", ne: "म सबै कुराकानी च्याटमै राख्न चाहन्छु, ताकि कामबारे सबै कुरा लेखिएर रहोस्। कृपया यहीँ सन्देश पठाउनुहोस्।" },
  },
  night: {
    name: { en: "Messages late at night", ne: "राति अबेर सन्देश" },
    expl: { en: "Late-night work messages often become personal. Your rest time is yours.", ne: "रातिका कामका सन्देशहरू प्रायः व्यक्तिगत बन्न जान्छन्। तपाईंको आरामको समय तपाईंको हो।" },
    reply: { en: "I do not reply to work messages after 8 PM. I will reply tomorrow morning. Thank you for understanding.", ne: "म राति ८ बजेपछि कामका सन्देशको जवाफ दिन्नँ। भोलि बिहान जवाफ दिनेछु। बुझिदिनुभएकोमा धन्यवाद।" },
  },
  personal: {
    name: { en: "Asks personal questions", ne: "व्यक्तिगत प्रश्न सोधेको" },
    expl: { en: "Your age, address, phone number and relationship are not part of any job.", ne: "तपाईंको उमेर, ठेगाना, फोन नम्बर र सम्बन्ध कुनै पनि कामको भाग होइनन्।" },
    reply: { en: "I like to keep our conversation about the work only. Please let me know about the task.", ne: "म हाम्रो कुराकानी काममा मात्र सीमित राख्न चाहन्छु। कृपया कामबारे बताइदिनुहोस्।" },
  },
  meeting: {
    name: { en: "Asks to meet in person", ne: "भेट्न बोलाएको" },
    expl: { en: "Online work does not need in-person meetings — especially not alone.", ne: "अनलाइन कामका लागि भेट्नु पर्दैन — झन् एक्लै त हुँदै होइन।" },
    reply: { en: "I work online only and do not meet clients in person. We can discuss everything here in chat.", ne: "म अनलाइन मात्र काम गर्छु र ग्राहकलाई भेट्दिनँ। सबै कुरा हामी यही च्याटमा गर्न सक्छौं।" },
  },
  pressure: {
    name: { en: "Rude, insulting or threatening", ne: "असभ्य, अपमानजनक वा धम्कीपूर्ण" },
    expl: { en: "No client has the right to insult or threaten you. You can stop the job.", ne: "कुनै ग्राहकलाई तपाईंलाई अपमान गर्ने वा धम्क्याउने अधिकार छैन। तपाईं काम रोक्न सक्नुहुन्छ।" },
    reply: { en: "Please speak respectfully. If we cannot work respectfully, I will have to stop this job.", ne: "कृपया सम्मानपूर्वक कुरा गरिदिनुहोस्। सम्मानपूर्वक काम गर्न सकिएन भने मैले यो काम रोक्नुपर्ने हुन्छ।" },
  },
  flirty: {
    name: { en: "Romantic or flirty words", ne: "रोमान्टिक वा जिस्किने शब्दहरू" },
    expl: { en: "Flirty talk is not professional. You do not have to reply to it.", ne: "जिस्किने कुरा व्यावसायिक होइन। त्यसको जवाफ दिन तपाईं बाध्य हुनुहुन्न।" },
    reply: { en: "I am here for professional work only. Let us keep our conversation about the project.", ne: "म यहाँ व्यावसायिक कामका लागि मात्र छु। कृपया हाम्रो कुराकानी काममा मात्र राखौं।" },
  },
};
const SAFETY_EXIT = { en: "Thank you for the opportunity. I will not be able to continue this job. I wish you the best.", ne: "अवसरका लागि धन्यवाद। म यो काम अगाडि बढाउन सक्दिनँ। तपाईंलाई शुभकामना।" };
const SAFETY_EXAMPLES = [
  { label: 'sf_ex1', text: "Hi, are you still up? Send me a selfie so I know you are real, then we talk about the work." },
  { label: 'sf_ex2', text: "Why are you not calling? I said video call me now, don't waste my time." },
  { label: 'sf_ex3', text: "Hi Maya, the first logo draft looks good. Please change the color to dark green and send the second version by Friday." },
];
// --- SAFETY (CLIENT CHAT) ENGINE END ---

// --- WORKSHIELD PAGE ---
const SHIELD_EXAMPLES = [
  { label: 'sh_ex1', text: "URGENT!!! Easy money from home. Earn $100 per hour just by liking videos. No experience needed. To start, pay a small registration fee of $20 and send your bank OTP to confirm your account. Message me on Telegram fast, only today!" },
  { label: 'sh_ex2', text: "Need someone to design some posts for my shop. Message me if interested." },
  { label: 'sh_ex3', text: "We need a logo for our coffee shop in Pokhara. Please design 2 logo options and send PNG files. Fixed pay $60, paid by bank transfer after delivery. Deadline: 5 days. Our shop is Himal Coffee, you can see our page online." },
];

function WorkShieldPage({ t, lang, showToast, history, setHistory }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null); // { findings, verdict, snippet }
  const resultRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  const [emptyErr, setEmptyErr] = useState(false);
  const runText = () => {
    if (!text.trim()) { setEmptyErr(true); return; }
    setEmptyErr(false);
    const f = analyzeText(text);
    setResult({ findings: f, verdict: verdictOf(f), snippet: text.trim().slice(0, 60) });
  };
  const runJob = (job) => {
    const f = analyzeJob(job);
    setResult({ findings: f, verdict: verdictOf(f), snippet: job.title });
  };
  const reset = () => {
    setText(""); setResult(null);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 0);
  };
  const save = () => {
    if (!result) return;
    setHistory(prev => [{ snippet: result.snippet, verdict: result.verdict, date: new Date().toISOString() }, ...(Array.isArray(prev) ? prev : [])].slice(0, 10));
    showToast(t('sh_saved_toast'));
  };
  const copyQ = async (q) => {
    try { await navigator.clipboard.writeText(q); } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = q; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('sh_copied'));
  };
  const clearHistory = () => { setHistory([]); showToast(t('sh_cleared')); };

  const VerdictIcon = result ? (result.verdict === 'danger' ? ShieldAlert : result.verdict === 'warning' ? AlertTriangle : ShieldCheck) : null;
  const questions = result ? ['nopay', 'vague', 'lowpay'].filter(id => result.findings.yellow.includes(id)) : [];
  const pillStyle = { danger: 'bg-[#C73E33] text-white', warning: 'bg-[#FAF0EE] text-[#AE332A]', ok: 'bg-[#F0EEE9] text-[#1C1B1A]' };

  return (
    <div className="max-w-[800px] mx-auto space-y-8">
      <div ref={topRef} className="scroll-mt-[128px] md:scroll-mt-24">
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{t('sh_title')}</h1>
        <p className="text-lg text-[#4A4744] mb-6">{t('sh_intro')}</p>
        <textarea value={text} onChange={e => { setText(e.target.value); setEmptyErr(false); }} aria-label={t('sh_title')} placeholder={t('sh_placeholder')} className="w-full min-h-[140px] border border-[#EAE7E1] bg-white rounded-[14px] px-5 py-4 text-base outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 mb-4" />
        {emptyErr && <p role="alert" className="text-[#AE332A] text-sm mb-4 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><ShieldAlert size={18} className="shrink-0 mt-0.5" /> <span>{t('err_paste_first')}</span></p>}
        <button onClick={runText} className={`w-full sm:w-auto sm:px-12 py-3.5 rounded-full font-semibold text-base min-h-[52px] ${!text.trim() ? 'opacity-60' : ''} ${result ? 'bg-white border border-[#E3E0D9] text-[#1C1B1A] hover:bg-[#F6F4EF]' : 'bg-[#C73E33] text-white hover:bg-[#AE332A]'}`}>{t('sh_check')}</button>
        <p className="text-sm text-[#8A8580] mt-3 flex items-center gap-1.5"><Lock size={14} className="shrink-0" /> {t('sh_private')}</p>
        <div className="mt-6">
          <div className="text-sm font-semibold text-[#8A8580] mb-2">{t('sh_try')}</div>
          <div className="flex flex-wrap gap-2">
            {SHIELD_EXAMPLES.map(ex => (
              <button key={ex.label} onClick={() => { setText(ex.text); setEmptyErr(false); }} className="border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-5 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t(ex.label)}</button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div ref={resultRef} className="scroll-mt-[128px] md:scroll-mt-24 space-y-5">
          <div className={`rounded-[20px] border p-6 sm:p-6 flex items-start gap-4 ${result.verdict === 'danger' ? 'bg-[#FAF0EE] border-[#C73E33]' : 'bg-white border-[#EAE7E1]'}`}>
            <VerdictIcon size={44} className={`shrink-0 ${result.verdict === 'danger' ? 'text-[#C73E33]' : 'text-[#1C1B1A]'}`} />
            <div>
              <h2 className="text-[22px] leading-snug font-semibold mb-2">{t('sh_v_' + result.verdict)}</h2>
              <p className="text-base text-[#4A4744]">{t('sh_s_' + result.verdict)}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 space-y-4">
            {result.findings.red.map(id => <div key={id} className="flex items-start gap-3 text-base"><ShieldAlert size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sh_f_' + id)}</span></div>)}
            {result.findings.yellow.map(id => <div key={id} className="flex items-start gap-3 text-base"><AlertTriangle size={22} className="shrink-0 mt-0.5 text-[#1C1B1A]" /> <span>{t('sh_f_' + id)}</span></div>)}
            {result.verdict !== 'danger' && result.findings.green.map(id => <div key={id} className="flex items-start gap-3 text-base"><CheckCircle2 size={22} className="shrink-0 mt-0.5 text-[#1C1B1A]" /> <span>{t('sh_f_' + id)}</span></div>)}
          </div>

          <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
            <h3 className="font-semibold text-xl mb-4">{t('sh_next_title')}</h3>
            <ul className="space-y-3 text-base text-[#1C1B1A]">
              {[1, 2, 3].map(n => <li key={n} className="flex items-start gap-3"><ArrowRight size={20} className="shrink-0 mt-1" /> <span>{t(`sh_n_${result.verdict}${result.verdict === 'ok' ? n : n}`)}</span></li>)}
            </ul>
          </div>

          {questions.length > 0 && (
            <div>
              <h3 className="font-semibold text-xl mb-3">{t('sh_q_title')}</h3>
              <div className="space-y-3">
                {questions.map(id => (
                  <div key={id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <p className="text-base">{t('sh_q_' + id)}</p>
                    <button onClick={() => copyQ(t('sh_q_' + id))} className="shrink-0 border border-[#E3E0D9] bg-white rounded-full px-5 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{t('sh_copy')}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={reset} className="flex-1 bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-5">{t('sh_check_another')}</button>
            <button onClick={save} className="flex-1 bg-white border border-[#E3E0D9] text-[#1C1B1A] py-3.5 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-5">{t('sh_save')}</button>
          </div>
          <Disclaimer t={t} k="disc_shield" />
        </div>
      )}

      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('sh_or_job')}</h2>
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] divide-y divide-[#EAE7E1] overflow-hidden">
          {DUMMY_JOBS.map(job => (
            <button key={job.id} onClick={() => runJob(job)} className="w-full text-left px-5 py-4 hover:bg-[#F6F4EF] flex items-center justify-between gap-3 min-h-[56px]">
              <span className="min-w-0">
                <span className="block font-semibold text-base">{job.title}</span>
                <span className="block text-sm text-[#4A4744]">{job.clientName}</span>
              </span>
              {job.paymentVerified && <span className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#1C1B1A]"><CheckCircle2 size={16} /> {t('payment_verified')}</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-[22px]">{t('sh_hist_title')}</h2>
          {history.length > 0 && <button onClick={clearHistory} className="text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px] px-2">{t('sh_clear')}</button>}
        </div>
        {history.length === 0 ? (
          <p className="text-base text-[#8A8580]">{t('sh_hist_empty')}</p>
        ) : (
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] divide-y divide-[#EAE7E1]">
            {history.map((h, i) => (
              <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className={`shrink-0 self-start px-3 py-1 rounded-full text-[13px] font-semibold ${pillStyle[h.verdict]}`}>{t('sh_pill_' + h.verdict)}</span>
                <span className="flex-1 min-w-0 text-base break-words">{h.snippet}</span>
                <span className="text-sm text-[#8A8580] shrink-0">{fmtDate(h.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// --- MERGED PAGE: WorkShield first, then a banner, then Safety (both pages are unchanged inside) ---
function ShieldSafetyPage({ t, lang, user, navTo, showToast, history, setHistory, evidence, setEvidence, scrollTo, scrollKey }) {
  useEffect(() => {
    if (scrollTo === 'safety') {
      const el = document.getElementById('safety-section');
      if (el) el.scrollIntoView({ block: 'start' });
    }
  }, [scrollTo, scrollKey]);
  return (
    <div className="space-y-10">
      <WorkShieldPage t={t} lang={lang} showToast={showToast} history={history} setHistory={setHistory} />
      <div className="max-w-[800px] mx-auto">
        <div id="safety-section" className="scroll-mt-[128px] md:scroll-mt-24 bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-6 flex items-start gap-4">
          <HeartHandshake size={28} className="text-[#C73E33] shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-[22px] text-[#1C1B1A] mb-2">{t('sfs_banner_title')}</h2>
            <p className="text-base text-[#4A4744]">{t('sfs_banner_intro')}</p>
          </div>
        </div>
      </div>
      <SafetyPage t={t} lang={lang} user={user} navTo={navTo} showToast={showToast} evidence={evidence} setEvidence={setEvidence} />
    </div>
  );
}

// --- SAFETY PAGE ---
function SafetyPage({ t, lang, user, navTo, showToast, evidence, setEvidence }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null); // { cats, text }
  const resultRef = useRef(null);
  const other = lang === 'ne' ? 'en' : 'ne';
  const rules = (user && user.safetyRules) || DEFAULT_RULES;

  useEffect(() => {
    if (result && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  const [emptyErr, setEmptyErr] = useState(false);
  const run = () => { if (!text.trim()) { setEmptyErr(true); return; } setEmptyErr(false); setResult({ cats: analyzeMessage(text), text: text.trim() }); };
  const copy = async (str) => {
    try { await navigator.clipboard.writeText(str); } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = str; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('sh_copied'));
  };
  const saveProof = () => {
    if (!result) return;
    setEvidence(prev => [{ text: result.text.slice(0, 500), categories: result.cats, date: new Date().toISOString(), source: 'page' }, ...(Array.isArray(prev) ? prev : [])].slice(0, 20));
    showToast(t('sf_saved_toast'));
  };
  const delProof = (i) => { setEvidence(prev => prev.filter((_, idx) => idx !== i)); showToast(t('sf_deleted')); };

  const crossed = result && result.cats.length > 0;
  return (
    <div className="max-w-[800px] mx-auto space-y-8">
      <div>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{t('sf_title')}</h1>
        <p className="text-lg text-[#4A4744] mb-6">{t('sf_intro')}</p>
        <div className="bg-[#FAF0EE] rounded-[20px] p-6 sm:p-6">
          <h2 className="font-semibold text-xl mb-4 text-[#1C1B1A]">{t('sf_three_title')}</h2>
          <div className="space-y-4 text-base text-[#1C1B1A]">
            <div className="flex items-start gap-3"><Shield size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r1')}</span></div>
            <div className="flex items-start gap-3"><Lock size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r2')}</span></div>
            <div className="flex items-start gap-3"><Bookmark size={22} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sf_r3')}</span></div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('sf_check_title')}</h2>
        <textarea value={text} onChange={e => { setText(e.target.value); setEmptyErr(false); }} aria-label={t('sf_check_title')} placeholder={t('sf_placeholder')} className="w-full min-h-[120px] border border-[#EAE7E1] bg-white rounded-[14px] px-5 py-4 text-base outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 mb-4" />
        {emptyErr && <p role="alert" className="text-[#AE332A] text-sm mb-4 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><ShieldAlert size={18} className="shrink-0 mt-0.5" /> <span>{t('err_paste_first')}</span></p>}
        <button onClick={run} className={`w-full sm:w-auto sm:px-12 py-3.5 rounded-full font-semibold text-base min-h-[52px] ${!text.trim() ? 'opacity-60' : ''} ${result ? 'bg-white border border-[#E3E0D9] text-[#1C1B1A] hover:bg-[#F6F4EF]' : 'bg-[#C73E33] text-white hover:bg-[#AE332A]'}`}>{t('sf_check')}</button>
        <p className="text-sm text-[#8A8580] mt-3 flex items-center gap-1.5"><Lock size={14} className="shrink-0" /> {t('sf_private')}</p>
        <div className="mt-6">
          <div className="text-sm font-semibold text-[#8A8580] mb-2">{t('sh_try')}</div>
          <div className="flex flex-wrap gap-2">
            {SAFETY_EXAMPLES.map(ex => (
              <button key={ex.label} onClick={() => { setText(ex.text); setEmptyErr(false); }} className="border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-5 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t(ex.label)}</button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div ref={resultRef} className="scroll-mt-[128px] md:scroll-mt-24 space-y-6">
          {crossed ? (
            <>
              <div className="bg-[#FAF0EE] border border-[#C73E33] rounded-[20px] p-6 sm:p-6 flex items-start gap-4">
                <ShieldAlert size={40} className="shrink-0 text-[#C73E33]" />
                <div>
                  <h2 className="text-[22px] leading-snug font-semibold mb-2">{t('sf_cross_title')}</h2>
                  <p className="text-base text-[#4A4744]">{t('sf_cross_line')}</p>
                </div>
              </div>
              <div className="space-y-4">
                {result.cats.map(id => {
                  const ruleKey = SAFETY_RULE_OF[id];
                  const off = ruleKey && !rules[ruleKey];
                  return (
                    <div key={id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                      <div className="font-semibold text-lg mb-2 flex items-start gap-2"><AlertTriangle size={20} className="shrink-0 mt-1" /> <span>{SAFETY_DATA[id].name[lang]}</span></div>
                      <p className="text-base text-[#4A4744] mb-3">{SAFETY_DATA[id].expl[lang]}</p>
                      <p className="text-sm font-semibold text-[#1C1B1A]">
                        {ruleKey ? fmt(t('sf_breaks'), { rule: t('rule_' + ruleKey) }) : t('sf_no_one')}
                        {off && <span className="font-normal text-[#8A8580]">{t('sf_off_note')}</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 flex items-start gap-4">
              <ShieldCheck size={40} className="shrink-0 text-[#1C1B1A]" />
              <div>
                <h2 className="text-[22px] leading-snug font-semibold mb-2">{t('sf_ok_title')}</h2>
                <p className="text-base text-[#4A4744]">{t('sf_ok_line')}</p>
              </div>
            </div>
          )}

          <div>
            <h2 className="font-semibold text-[22px] mb-2">{t('sf_reply_title')}</h2>
            <p className="text-base text-[#4A4744] mb-4">{t('sf_reply_intro')}</p>
            <div className="space-y-4">
              {[...result.cats.map(id => ({ id, label: SAFETY_DATA[id].name[lang], reply: SAFETY_DATA[id].reply })), { id: 'exit', label: t('sf_exit_label'), reply: SAFETY_EXIT }].map(r => (
                <div key={r.id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                  <div className="text-sm font-semibold text-[#8A8580] mb-2">{r.label}</div>
                  <p className="text-base text-[#1C1B1A] mb-3">{r.reply[lang]}</p>
                  <p className="text-sm text-[#8A8580] mb-4">{r.reply[other]}</p>
                  <button onClick={() => copy(r.reply[lang])} className="border border-[#E3E0D9] bg-white rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t('sh_copy')}</button>
                </div>
              ))}
            </div>
            <Disclaimer t={t} k="disc_reply" className="mt-4" />
          </div>

          <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
            <h3 className="font-semibold text-xl mb-4">{t('sf_next_title')}</h3>
            <ol className="space-y-4 text-base text-[#1C1B1A]">
              {[1, 2, 3, 4].map(n => (
                <li key={n} className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-white border border-[#EAE7E1] flex items-center justify-center text-sm font-semibold">{lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : n}</span>
                  <span className="flex-1">
                    {t('sf_step' + n)}
                    {n === 2 && <button onClick={saveProof} className="mt-3 w-full sm:w-auto bg-[#C73E33] text-white px-6 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] flex items-center justify-center">{t('sf_save_proof')}</button>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
        <h2 className="font-semibold text-[22px] mb-5">{t('pp_rules_title')}</h2>
        <div className="space-y-3 mb-6">
          {RULE_KEYS.map(k => (
            <div key={k} className="flex items-center justify-between gap-4 p-4 border border-[#EAE7E1] rounded-[14px]">
              <span className="text-base font-medium">{t('rule_' + k)}</span>
              <span className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold ${rules[k] ? 'bg-white border border-[#1C1B1A] text-[#1C1B1A]' : 'bg-[#F0EEE9] text-[#4A4744]'}`}>{rules[k] && <Check size={14} />}{rules[k] ? t('sf_on') : t('sf_off')}</span>
            </div>
          ))}
        </div>
        <button onClick={() => navTo('passport')} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px]">{t('sf_edit_rules')}</button>
      </div>

      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('sf_proof_title')}</h2>
        <button onClick={() => navTo('vault')} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:bg-[#F6F4EF] min-h-[48px] mb-4 inline-flex items-center justify-center gap-2"><Lock size={18} /> {t('ev_open')}</button>
        {evidence.length === 0 ? (
          <p className="text-base text-[#8A8580] mb-3">{t('sf_proof_empty')}</p>
        ) : (
          <div className="space-y-4 mb-3">
            {evidence.map((e, i) => (
              <div key={i} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-sm font-semibold text-[#8A8580]">{fmtDate(e.date)}</span>
                  <button onClick={() => delProof(i)} className="text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px] px-2 -mt-2 -mr-2">{t('sf_delete')}</button>
                </div>
                {e.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {e.categories.map(id => <span key={id} className="bg-[#FAF0EE] text-[#AE332A] px-3 py-1 rounded-full text-[13px] font-semibold">{SAFETY_DATA[id].name[lang]}</span>)}
                  </div>
                )}
                <p className="text-base text-[#1C1B1A] break-words">{e.text.slice(0, 80)}{e.text.length > 80 ? '…' : ''}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-[#8A8580] flex items-center gap-1.5"><Lock size={14} className="shrink-0" /> {t('sf_proof_private')}</p>
      </div>
    </div>
  );
}


// --- EVIDENCE VAULT ---
const VAULT_MASK = "••••••••";
const evDigits = (lang, n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
const evDateTime = (iso, lang) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(lang === 'ne' ? 'ne-NP' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
const evSource = (e, t) => e.source === 'chat'
  ? fmt(t('ev_src_chat'), { jobTitle: e.jobTitle || e.clientName || '' }).replace(/:\s*$/, '')
  : e.source === 'page' ? t('ev_src_page') : t('ev_src_none');
const evCats = (e, lang) => (Array.isArray(e.categories) ? e.categories : []).filter(id => SAFETY_DATA[id]).map(id => SAFETY_DATA[id].name[lang]);
const evBody = (e, t, masked) => masked ? VAULT_MASK + '\n' + t('ev_hidden') : (e.text || '');
const evToday = (lang) => new Date().toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Plain-text version of the SAME report as the print document.
function buildEvidenceText({ t, lang, name, items, masked }) {
  const lines = ['WorkPassport', t('ev_rep_title'), fmt(t('pdf_made_on'), { date: evToday(lang) }), '', fmt(t('ev_intro'), { name }), ''];
  items.forEach((e, i) => {
    lines.push(fmt(t('ev_item'), { n: evDigits(lang, i + 1) }));
    lines.push(evDateTime(e.date, lang));
    const cats = evCats(e, lang);
    if (cats.length) lines.push(cats.join(', '));
    lines.push(evSource(e, t));
    lines.push(evBody(e, t, masked));
    lines.push('');
  });
  lines.push(t('ev_foot'));
  return lines.join('\n');
}

// Print-only document (class vault-print). Shown only when document.body.dataset.print === "vault".
function VaultPrint({ t, lang, name, items, masked }) {
  return createPortal(
    <div className="vault-print">
      <div className="pp-brand">WorkPassport</div>
      <h1 className="pp-name">{t('ev_rep_title')}</h1>
      <p>{fmt(t('pdf_made_on'), { date: evToday(lang) })}</p>
      <p>{fmt(t('ev_intro'), { name })}</p>
      {items.map((e, i) => {
        const cats = evCats(e, lang);
        return (
          <div key={i} className="vp-item">
            <h2>{fmt(t('ev_item'), { n: evDigits(lang, i + 1) })}</h2>
            <div>{evDateTime(e.date, lang)}</div>
            {cats.length > 0 && <div>{cats.join(', ')}</div>}
            <div>{evSource(e, t)}</div>
            <p className="vp-text">{masked ? <>{VAULT_MASK}<br />{t('ev_hidden')}</> : e.text}</p>
          </div>
        );
      })}
      <p className="pp-foot">{t('ev_foot')}</p>
    </div>,
    document.body
  );
}

function EvidenceVaultPage({ t, lang, user, navTo, showToast, evidence, setEvidence, masked }) {
  const list = Array.isArray(evidence) ? evidence : [];
  // newest first, keeping each item's index in the stored array for deletion
  const items = list.map((e, idx) => ({ e, idx })).filter(x => x.e && typeof x.e === 'object')
    .sort((a, b) => (new Date(b.e.date).getTime() || 0) - (new Date(a.e.date).getTime() || 0));
  const plain = items.map(x => x.e);
  const name = (user && user.name) || 'WorkPassport user';
  const del = (idx) => { setEvidence(prev => (Array.isArray(prev) ? prev : []).filter((_, i) => i !== idx)); showToast(t('sf_deleted')); };
  const copyReport = async () => {
    const str = buildEvidenceText({ t, lang, name, items: plain, masked });
    try { await navigator.clipboard.writeText(str); } catch (err) {
      try { const ta = document.createElement('textarea'); ta.value = str; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('sh_copied'));
  };
  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {plain.length > 0 && <VaultPrint t={t} lang={lang} name={name} items={plain} masked={masked} />}
      <button onClick={() => navTo('shield', { scrollTo: 'safety', n: Date.now() })} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] -ml-2 px-2"><ChevronLeft size={20} /> {t('sf_title')}</button>
      <div>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{t('ev_title')}</h1>
        <p className="text-base text-[#4A4744] flex items-start gap-2 mb-2"><Lock size={18} className="shrink-0 mt-1 text-[#C73E33]" /> <span>{t('ev_private')}</span></p>
        <p className="text-base font-semibold text-[#1C1B1A]">{fmt(t('ev_count'), { n: evDigits(lang, plain.length) })}</p>
      </div>

      {plain.length === 0 ? (
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-lg text-[#4A4744]">{t('ev_empty')}</div>
      ) : (
        <>
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => printDocument('vault')} className="flex-1 bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-5 inline-flex items-center justify-center gap-2"><Download size={20} /> {t('ev_pdf')}</button>
              <button onClick={copyReport} className="flex-1 bg-white border border-[#E3E0D9] text-[#1C1B1A] py-3.5 rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[52px] px-5">{t('ev_copy')}</button>
            </div>
            <p className="text-sm text-[#6E6963] mt-4 flex items-start gap-1.5"><Info size={14} className="mt-[3px] shrink-0" /> <span>{t('ev_caution')}</span></p>
          </div>
          <div className="space-y-4">
            {items.map(({ e, idx }) => {
              const cats = evCats(e, lang);
              return (
                <div key={idx} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-sm font-semibold text-[#6E6963]">{evDateTime(e.date, lang)}</span>
                    <button onClick={() => del(idx)} aria-label={t('sf_delete')} className="shrink-0 min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center rounded-full text-[#4A4744] hover:bg-[#F6F4EF]"><Trash2 size={20} /></button>
                  </div>
                  {cats.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cats.map(c => <span key={c} className="bg-[#FAF0EE] text-[#AE332A] px-3 py-1 rounded-full text-[13px] font-semibold">{c}</span>)}
                    </div>
                  )}
                  {masked ? (
                    <div className="mb-3">
                      <p className="text-base text-[#1C1B1A] tracking-widest">{VAULT_MASK}</p>
                      <p className="text-sm text-[#6E6963] mt-1">{t('ev_hidden')}</p>
                    </div>
                  ) : (
                    <p className="text-base text-[#1C1B1A] break-words whitespace-pre-wrap mb-3">{e.text}</p>
                  )}
                  <p className="text-sm text-[#6E6963] break-words">{evSource(e, t)}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// --- EXTENSION PAGE ---
// The practice simulation below runs the SAME analyzeText / analyzeMessage engines as the real pages.
function ExtensionPage({ t, lang, navTo }) {
  const [tab, setTab] = useState('job'); // 'job' | 'chat'
  const [result, setResult] = useState(null); // { kind, findings?, verdict?, cats? }
  const num = (n) => (lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : n);
  const isJob = tab === 'job';
  const mockText = isJob ? SHIELD_EXAMPLES[0].text : SAFETY_EXAMPLES[0].text;

  const switchTab = (k) => { setTab(k); setResult(null); };
  const runCheck = () => {
    if (isJob) {
      const f = analyzeText(mockText);
      setResult({ kind: 'job', findings: f, verdict: verdictOf(f) });
    } else {
      setResult({ kind: 'chat', cats: analyzeMessage(mockText) });
    }
  };

  const Bang = () => <span className="shrink-0 w-6 h-6 rounded-full bg-[#FAF0EE] text-[#C73E33] text-sm font-bold flex items-center justify-center mt-0.5" aria-hidden="true">!</span>;
  const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 ${className}`}>
      <h2 className="font-semibold text-[22px] mb-5">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="max-w-[800px] mx-auto space-y-8">
      {/* A1 header */}
      <div>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{t('ex_title')}</h1>
        <p className="text-lg text-[#4A4744]">{t('ex_intro')}</p>
      </div>

      {/* A2 how it works */}
      <div>
        <h2 className="font-semibold text-[22px] mb-4">{t('ex_how_title')}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
              <span className="w-9 h-9 rounded-full bg-[#FAF0EE] text-[#AE332A] flex items-center justify-center font-semibold mb-3">{num(n)}</span>
              <p className="text-base text-[#1C1B1A] font-medium">{t('ex_s' + n)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* A3 practice simulation */}
      <div>
        <h2 className="font-semibold text-[22px] mb-2">{t('ex_try_title')}</h2>
        <p className="text-base text-[#4A4744] mb-4">{t('ex_try_line')}</p>

        <div className="inline-flex bg-[#F0EEE9] rounded-full p-1 mb-4" role="group">
          {[['job', 'ex_tab_job'], ['chat', 'ex_tab_chat']].map(([k, label]) => (
            <button key={k} onClick={() => switchTab(k)} aria-pressed={tab === k}
              className={`rounded-full px-5 py-2 text-[15px] font-medium min-h-[44px] transition-all ${tab === k ? 'bg-white text-[#1C1B1A] shadow-[0_1px_2px_rgba(28,27,26,0.08)]' : 'text-[#8A8580] hover:text-[#4A4744]'}`}>
              {t(label)}
            </button>
          ))}
        </div>

        {/* fake browser window */}
        <div className={`relative bg-white border border-[#EAE7E1] rounded-[20px] overflow-hidden `}>
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F0EEE9] border-b border-[#EAE7E1]">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8D4CC]" /><span className="w-2.5 h-2.5 rounded-full bg-[#D8D4CC]" /><span className="w-2.5 h-2.5 rounded-full bg-[#D8D4CC]" />
            </div>
            <div className="flex-1 min-w-0 bg-white rounded-full px-4 py-1.5 text-sm text-[#8A8580] truncate">{t(isJob ? 'ex_addr_job' : 'ex_addr_chat')}</div>
          </div>
          <div className="sm:flex sm:items-start sm:gap-4 sm:p-6">
          <div className="p-5 sm:p-0 sm:flex-1 sm:min-w-0">
            <div className="text-sm text-[#8A8580] mb-3">{t(isJob ? 'ex_label_job' : 'ex_label_chat')}</div>
            {isJob ? (
              <div className="border border-[#EAE7E1] rounded-[14px] p-4 ">
                <p className="text-base text-[#1C1B1A] leading-relaxed"><span className={result ? 'bg-[#FAF0EE] underline decoration-[#C73E33]/40' : ''}>{mockText}</span></p>
              </div>
            ) : (
              <div className="bg-[#F0EEE9] rounded-[20px] rounded-tl-md px-4 py-3 ">
                <p className="text-base text-[#1C1B1A] leading-relaxed"><span className={result ? 'bg-[#FAF0EE] underline decoration-[#C73E33]/40' : ''}>{mockText}</span></p>
              </div>
            )}
          </div>

          {/* extension-style popup overlay (sits beside the post on wide screens, below it on phones) */}
          {result && (
            <div className="m-3 sm:m-0 sm:w-[360px] sm:shrink-0 bg-white border border-[#EAE7E1] rounded-[14px] p-4 shadow-[0_2px_10px_rgba(28,27,26,0.08)]" role="dialog" aria-label="WorkShield">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={22} className="text-[#C73E33]" />
                <span className="font-semibold">WorkShield</span>
                <span className="text-sm text-[#8A8580]">{t('ex_pop_by')}</span>
              </div>
              {result.kind === 'job' ? (
                <>
                  <h3 className="text-lg font-semibold leading-snug mb-3">{t('sh_v_' + result.verdict)}</h3>
                  <div className="space-y-3 mb-4">
                    {result.findings.red.map(id => <div key={id} className="flex items-start gap-3 text-base"><Bang /><span>{t('sh_f_' + id)}</span></div>)}
                    {result.findings.yellow.map(id => <div key={id} className="flex items-start gap-3 text-base"><Bang /><span>{t('sh_f_' + id)}</span></div>)}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold leading-snug mb-3">{t(result.cats.length ? 'sf_cross_title' : 'sf_ok_title')}</h3>
                  <div className="space-y-3 mb-4">
                    {result.cats.map(id => (
                      <div key={id} className="flex items-start gap-3 text-base"><Bang />
                        <span><span className="block font-semibold text-[#1C1B1A]">{SAFETY_DATA[id].name[lang]}</span>{SAFETY_DATA[id].expl[lang]}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <p className="text-sm text-[#8A8580] mb-4 flex items-center gap-1.5"><Lock size={14} className="shrink-0" /> {t('sh_private')}</p>
              <div className="flex gap-2">
                <button onClick={() => navTo(result.kind === 'job' ? 'shield' : 'safety')} className="flex-1 bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[44px] px-3">{t(result.kind === 'job' ? 'ex_open_full' : 'ex_open_safety')}</button>
                <button onClick={() => setResult(null)} className="bg-white border border-[#E3E0D9] text-[#1C1B1A] rounded-full font-semibold text-base hover:bg-[#F6F4EF] min-h-[44px] px-5">{t('ex_close')}</button>
              </div>
            </div>
          )}
          </div>
        </div>

        <button onClick={runCheck} className="mt-4 w-full sm:w-auto sm:px-10 bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-5">{t(isJob ? 'ex_btn_job' : 'ex_btn_chat')}</button>
      </div>

      {/* A4 install steps */}
      <Card title={t('ex_inst_title')}>
        <ol className="space-y-4 text-base text-[#1C1B1A]">
          {[1, 2, 3, 4].map(n => (
            <li key={n} className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#F0EEE9] flex items-center justify-center text-sm font-semibold">{num(n)}</span>
              <span className="flex-1">{t('ex_i' + n)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-base font-semibold text-[#1C1B1A] flex items-center gap-2"><Check size={20} className="text-[#C73E33] shrink-0" /> {t('ex_i_note')}</p>
      </Card>

      {/* A5 privacy */}
      <div>
        <Card title={t('ex_priv_title')}>
          <div className="space-y-4 text-base text-[#1C1B1A]">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex items-start gap-3"><Lock size={20} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('ex_p' + n)}</span></div>
            ))}
          </div>
        </Card>
        <Disclaimer t={t} k="disc_ext" className="mt-4" />
      </div>
    </div>
  );
}

function PlaceholderSection({ t, title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-[#EAE7E1] rounded-[20px] flex items-center justify-center mb-6">
        <User size={40} className="text-[#8A8580]" />
      </div>
      <h1 className="text-[28px] sm:text-[30px] font-semibold mb-3">{title}</h1>
      <p className="text-lg text-[#8A8580]">{t('proto_section')}</p>
    </div>
  );
}

// --- LOGIN FLOW ---
function LoginFlow({ t, onBack, onLogin }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const codeRefs = [useRef(), useRef(), useRef(), useRef()];

  const handlePhoneSubmit = () => {
    if (phone.length === 10 && phone.startsWith("9")) {
      setErr("");
      setStep(2);
    } else {
      setErr(t('phone_err'));
    }
  };

  const handleCodeChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 3) codeRefs[idx + 1].current.focus();
  };

  return (
    <div className="pb-4">
      <button onClick={step === 1 ? onBack : () => setStep(1)} className="flex items-center gap-2 text-base text-[#4A4744] mb-8 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
        <ChevronLeft size={20} /> {t('back')}
      </button>
      <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">{step === 1 ? t('login_step1_title') : t('login_step2_title')}</h2>
      
      {step === 1 ? (
        <>
          <div className="mb-8">
            <label className="block text-base font-semibold mb-3">{t('phone_label')}</label>
            <div className="flex">
              <div className="bg-[#F6F4EF] border border-[#EAE7E1] border-r-0 px-4 py-4 rounded-l-[14px] text-[#4A4744] font-medium">+977</div>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="98XXXXXXXX" className="flex-1 border border-[#EAE7E1] px-4 py-4 rounded-r-[14px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-lg font-medium" />
            </div>
            {err && (
              <div className="text-[#AE332A] text-sm mt-3 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px] border border-[#FAF0EE]">
                <ShieldAlert size={20} className="shrink-0 mt-0.5" /> <span>{err}</span>
              </div>
            )}
          </div>
          <button onClick={handlePhoneSubmit} disabled={!phone} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('btn_send_code')}
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 text-[#4A4744] text-base font-medium">Sending to: +977 {phone}</div>
          <div className="flex gap-4 mb-4 justify-between">
            {[0, 1, 2, 3].map(i => (
              <input key={i} ref={codeRefs[i]} type="tel" inputMode="numeric" aria-label={`${t('btn_verify')} ${i + 1}`} maxLength={1} value={code[i]} onChange={e => handleCodeChange(i, e.target.value)} className="w-16 h-16 sm:w-20 sm:h-20 text-center text-3xl font-semibold border border-[#EAE7E1] rounded-[14px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30" />
            ))}
          </div>
          <div className="text-sm text-[#8A8580] mb-10 bg-[#F6F4EF] p-3 rounded-[12px] text-center border border-[#EAE7E1]">{t('code_hint')}</div>
          <button onClick={onLogin} disabled={code.join('').length < 4} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('btn_verify')}
          </button>
        </>
      )}
    </div>
  );
}

// --- SETUP WIZARD ---
function SetupFlow({ t, onBack, onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ name: "", district: "Kathmandu", workWanted: [], skills: [], institute: "", safetyRules: { chat: true, calls: true, time: true, photo: true, hours: true }, badge: "Beginner" });

  const toggleArray = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="flex items-center gap-2 text-base text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
          <ChevronLeft size={20} /> {t('back')}
        </button>
        <div className="text-[13px] text-[#8A8580] font-semibold bg-[#F0EEE9] px-3 py-1 rounded-full">{t('step')} {step} {t('of')} 3</div>
      </div>
      
      <div className="h-2 bg-[#EAE7E1] rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-[#C73E33] transition-all" style={{width: `${(step/3)*100}%`}}></div>
      </div>

      <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">
        {step === 1 && t('setup_step1')}
        {step === 2 && t('setup_step2')}
        {step === 3 && t('setup_step3')}
      </h2>

      {step === 1 && (
        <div className="space-y-8">
          <div>
            <label className="block text-base font-semibold mb-3">{t('full_name')}</label>
            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder={t('name_placeholder')} className="w-full border border-[#EAE7E1] px-4 py-4 rounded-[12px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-lg" />
          </div>
          <div>
            <label className="block text-base font-semibold mb-3">{t('district')}</label>
            <select value={profile.district} onChange={e => setProfile({...profile, district: e.target.value})} className="w-full border border-[#EAE7E1] px-4 py-4 rounded-[12px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 bg-white text-lg min-h-[48px]">
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold mb-3">{t('work_wanted')}</label>
            <div className="flex flex-wrap gap-3">
              {ALL_CATEGORIES.map(c => (
                <button key={c} onClick={() => setProfile({...profile, workWanted: toggleArray(profile.workWanted, c)})} className={`px-5 py-2.5 rounded-full text-base min-h-[44px] font-medium border transition-colors ${profile.workWanted.includes(c) ? 'bg-[#FAF0EE] text-[#AE332A] border-[#C73E33]' : 'bg-white text-[#4A4744] border-[#EAE7E1] hover:border-[#DDD8CE]'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <button onClick={() => setStep(2)} disabled={!profile.name || profile.workWanted.length === 0} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="bg-[#F6F4EF] border border-[#EAE7E1] p-4 rounded-[12px] flex gap-3 text-[#4A4744]">
            <ShieldCheck className="shrink-0 text-[#1C1B1A]" />
            <p className="text-sm">{t('skills_note')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ALL_SKILLS.map(s => (
              <button key={s} onClick={() => setProfile({...profile, skills: toggleArray(profile.skills, s)})} className={`px-5 py-2.5 rounded-full text-base min-h-[44px] font-medium border transition-colors ${profile.skills.includes(s) ? 'bg-[#FAF0EE] text-[#AE332A] border-[#C73E33]' : 'bg-white text-[#4A4744] border-[#EAE7E1] hover:border-[#DDD8CE]'}`}>{s}</button>
            ))}
          </div>
          <div className="pt-6 border-t border-[#EAE7E1]">
            <label className="block text-base font-semibold mb-3">{t('institute_label')}</label>
            <input type="text" value={profile.institute} onChange={e => setProfile({...profile, institute: e.target.value})} placeholder={t('institute_placeholder')} className="w-full border border-[#EAE7E1] px-4 py-4 rounded-[12px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-lg" />
          </div>
          <button onClick={() => setStep(3)} disabled={profile.skills.length === 0} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('next')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-[#F6F4EF] border border-[#EAE7E1] p-4 rounded-[12px] flex gap-3 text-[#4A4744]">
             <Shield className="shrink-0 text-[#1C1B1A]" />
             <p className="text-sm">{t('safety_note')}</p>
          </div>
          
          <div className="space-y-3">
            {Object.keys(profile.safetyRules).map((rule, idx) => (
              <button key={rule} className="w-full flex items-center justify-between p-5 border border-[#EAE7E1] rounded-[14px] hover:border-[#DDD8CE] transition-colors bg-white min-h-[48px] text-left" onClick={() => setProfile({...profile, safetyRules: {...profile.safetyRules, [rule]: !profile.safetyRules[rule]}})}>
                <span className="text-base font-medium pr-4">{t(['rule_chat', 'rule_calls', 'rule_time', 'rule_photo', 'rule_hours'][idx])}</span>
                <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${profile.safetyRules[rule] ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${profile.safetyRules[rule] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-6">
            <button onClick={() => onComplete(profile)} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
              {t('btn_create_wp')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// --- FIRSTWORK MODULE ---
function FirstWorkFeed({ t, navTo, user, savedJobs, setSavedJobs, lang, allJobs = DUMMY_JOBS }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [budgetType, setBudgetType] = useState("All");
  const [togBeginner, setTogBeginner] = useState(false);
  const [togVerified, setTogVerified] = useState(false);
  const [togMatch, setTogMatch] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    let res = [...allJobs];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(j => j.title.toLowerCase().includes(q) || j.clientName.toLowerCase().includes(q) || j.skillsRequired.some(s => s.toLowerCase().includes(q)));
    }
    if (cat !== "All") res = res.filter(j => j.category === cat);
    if (skillsFilter.length > 0) res = res.filter(j => skillsFilter.some(s => j.skillsRequired.includes(s)));
    if (budgetType !== "All") res = res.filter(j => budgetType === "fixed" ? j.budgetType === "fixed" : j.budgetType === "hourly");
    if (togBeginner) res = res.filter(j => j.beginnerFriendly);
    if (togVerified) res = res.filter(j => j.paymentVerified);
    if (togMatch) res = res.filter(j => j.skillsRequired.some(s => user.skills.includes(s)));

    res.sort((a, b) => {
      if (sort === "Newest") return a.postedHoursAgo - b.postedHoursAgo;
      if (sort === "Budget: High to Low") return b.budgetUSD - a.budgetUSD;
      if (sort === "Budget: Low to High") return a.budgetUSD - b.budgetUSD;
      if (sort === "Best skill match") {
        const matchA = a.skillsRequired.filter(s => user.skills.includes(s)).length;
        const matchB = b.skillsRequired.filter(s => user.skills.includes(s)).length;
        return matchB - matchA;
      }
      return 0;
    });
    return res;
  }, [search, cat, skillsFilter, budgetType, togBeginner, togVerified, togMatch, sort, user, allJobs]);

  const clearFilters = () => {
    setSearch(""); setCat("All"); setSkillsFilter([]); setBudgetType("All"); setTogBeginner(false); setTogVerified(false); setTogMatch(false); setSort("Newest");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className={`md:w-72 shrink-0 ${showMobileFilters ? 'fixed inset-0 z-50 bg-[#FBFAF8] p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:bg-transparent md:p-0 md:z-auto`}>
        <div className="sticky top-20">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h3 className="font-semibold text-2xl">{t('filters')}</h3>
            <button onClick={() => setShowMobileFilters(false)} className="flex items-center gap-2 font-semibold text-[#AE332A] min-h-[48px] px-4 border border-[#C73E33] rounded-full">
              <X size={20} /> Close
            </button>
          </div>
          
          <div className="space-y-8 text-base">
            <div>
              <label className="font-semibold block mb-3">{t('cat_all')}</label>
              <select value={cat} onChange={e => setCat(e.target.value)} className="w-full border border-[#EAE7E1] rounded-[12px] p-3 bg-white min-h-[48px] font-medium outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30">
                <option value="All">{t('cat_all')}</option>
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="font-semibold block mb-3">{t('budget_all')}</label>
              <div className="space-y-3">
                {["All", "fixed", "hourly"].map(b => (
                  <label key={b} className="flex items-center gap-3 cursor-pointer p-2 min-h-[44px] border border-transparent hover:bg-white rounded-[12px] -ml-2">
                    <input type="radio" checked={budgetType === b} onChange={() => setBudgetType(b)} className="accent-[#C73E33] w-5 h-5" />
                    <span className="font-medium">{b === "All" ? t('budget_all') : b === "fixed" ? t('budget_fixed') : t('budget_hourly')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-3">Skills</label>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
                {ALL_SKILLS.map(s => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer p-2 min-h-[44px] border border-transparent hover:bg-white rounded-[12px] -ml-2">
                    <input type="checkbox" checked={skillsFilter.includes(s)} onChange={(e) => {
                      if(e.target.checked) setSkillsFilter([...skillsFilter, s]);
                      else setSkillsFilter(skillsFilter.filter(x => x !== s));
                    }} className="accent-[#C73E33] w-5 h-5" />
                    <span className="font-medium">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#EAE7E1]">
              <button className="w-full flex items-center justify-between cursor-pointer group min-h-[44px]" onClick={() => setTogBeginner(!togBeginner)}>
                <span className="font-medium group-hover:text-[#AE332A] transition-colors">{t('tog_beginner')}</span>
                <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${togBeginner ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${togBeginner ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between cursor-pointer group min-h-[44px]" onClick={() => setTogVerified(!togVerified)}>
                <span className="font-medium group-hover:text-[#AE332A] transition-colors">{t('tog_verified')}</span>
                <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${togVerified ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${togVerified ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between cursor-pointer group min-h-[44px]" onClick={() => setTogMatch(!togMatch)}>
                <span className="font-medium group-hover:text-[#AE332A] transition-colors">{t('tog_match')}</span>
                <div className={`shrink-0 w-12 h-7 rounded-full flex items-center p-1 transition-colors ${togMatch ? 'bg-[#C73E33]' : 'bg-[#E3E0D9]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${togMatch ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>
            
            {showMobileFilters && (
              <button onClick={() => setShowMobileFilters(false)} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg mt-8 min-h-[52px] md:hidden">
                Apply Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-[#EAE7E1] pb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-[28px] sm:text-[30px] font-semibold">{t('fw_title')}</h1>
            </div>
            <p className="text-lg text-[#4A4744]">{t('fw_sub')}</p>
            <div className="text-[13px] font-semibold bg-[#F0EEE9] px-3 py-1 rounded-full mt-3 inline-block">
              {filtered.length} beginner jobs open now
            </div>
          </div>
          <div className="flex gap-2">
            <button className="min-h-[48px] px-4 font-semibold text-[#1C1B1A] border-b-2 border-[#C73E33]">Jobs</button>
            <button onClick={() => navTo('opportunities')} className="min-h-[48px] px-4 font-semibold text-[#8A8580] border-b-2 border-transparent hover:text-[#1C1B1A]">{t('my_opps')}</button>
          </div>
        </div>

        <div className="mb-6">
          <button onClick={() => navTo('client')} className="min-h-[48px] px-6 rounded-full bg-white border border-[#E3E0D9] text-[#1C1B1A] font-semibold text-base hover:bg-[#F6F4EF] flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus size={20} /> {t('cl_entry')}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-3.5 text-[#8A8580]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} aria-label={t('search_placeholder')} placeholder={t('search_placeholder')} className="w-full border border-[#EAE7E1] rounded-[14px] pl-12 pr-4 py-3 outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-base min-h-[48px]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowMobileFilters(true)} className="md:hidden flex-1 flex items-center justify-center gap-2 border border-[#EAE7E1] rounded-full px-4 py-3 bg-white font-semibold min-h-[48px]">
              <SlidersHorizontal size={20} /> {t('filters')}
            </button>
            <div className="flex items-center border border-[#EAE7E1] rounded-full bg-white px-3">
              <span className="text-[#8A8580] pl-2 text-sm font-medium hidden sm:inline">Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent pl-2 pr-4 py-3 outline-none font-semibold min-h-[48px] cursor-pointer text-base">
                <option value="Newest">{t('sort_new')}</option>
                <option value="Budget: High to Low">{t('sort_high')}</option>
                <option value="Budget: Low to High">{t('sort_low')}</option>
                <option value="Best skill match">{t('sort_match')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#EAE7E1] rounded-[14px] p-6 text-center flex flex-col items-center">
              <Search size={48} className="text-[#D8D4CC] mb-4" />
              <p className="text-lg font-semibold mb-6">{t('no_jobs')}</p>
              <button onClick={clearFilters} className="border border-[#E3E0D9] px-6 py-3 rounded-full font-semibold hover:bg-[#F6F4EF] min-h-[52px]">
                {t('clear_filters')}
              </button>
            </div>
          ) : (
            filtered.map(job => (
              <JobCard key={job.id} job={job} t={t} navTo={navTo} saved={savedJobs.includes(job.id)} onToggleSave={() => {
                setSavedJobs(prev => prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id]);
              }} lang={lang} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, t, navTo, saved, onToggleSave, lang }) {
  const isEn = lang === 'en';
  return (
    <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 hover:border-[#DDD8CE] transition-colors flex flex-col sm:flex-row gap-6 relative overflow-hidden">
      <div className="flex-1 cursor-pointer group" onClick={() => navTo('job-detail', { id: job.id })}>
        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
          {job.paymentVerified ? (
            <span className="flex items-center gap-1.5 font-semibold bg-[#F0EEE9] px-3 py-1 rounded-full text-[13px]"><CheckCircle2 size={16} className="text-[#1C1B1A]" /> {t('payment_verified')}</span>
          ) : (
            <span className="flex items-center gap-1.5 font-semibold text-[#8A8580] px-3 py-1 rounded-full text-[13px] border border-[#EAE7E1]"><ShieldAlert size={16} /> {t('payment_unverified')}</span>
          )}
          {job.beginnerFriendly && (
            <span className="bg-[#FAF0EE] text-[#AE332A] border border-[#FAF0EE] px-3 py-1 rounded-full text-[13px] font-semibold flex items-center gap-1.5"><ShieldCheck size={16} /> {t('beginner_friendly')}</span>
          )}
          {String(job.id).startsWith('c') && (
            <span className="bg-[#F0EEE9] text-[#1C1B1A] px-3 py-1 rounded-full text-[13px] font-semibold flex items-center gap-1.5"><User size={16} /> {t('cl_posted_chip')}</span>
          )}
          <span className="text-[#8A8580] font-medium">{job.postedHoursAgo}h ago</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:underline line-clamp-2 leading-tight">{isEn ? job.title : (job.title)}</h2>
        <div className="text-base text-[#4A4744] mb-4 flex flex-wrap items-center gap-y-2">
          <span className="flex items-center gap-1.5 font-medium"><User size={20} className="text-[#8A8580]" /> {job.clientName}</span>
          <span className="mx-3 text-[#D8D4CC]">|</span>
          <span className="flex items-center gap-1.5 font-medium"><MapPin size={20} className="text-[#8A8580]" /> {job.clientCountry}</span>
        </div>
        
        <p className="text-base text-[#4A4744] line-clamp-2 mb-5 leading-relaxed">{isEn ? job.description : (job.description)}</p>
        
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
          {job.skillsRequired.slice(0, 4).map(s => <span key={s} className="bg-white border border-[#EAE7E1] text-[#4A4744] font-medium text-sm px-3 py-1.5 rounded-full">{s}</span>)}
          {job.skillsRequired.length > 4 && <span className="text-sm font-semibold text-[#8A8580] self-center px-2">+{job.skillsRequired.length - 4}</span>}
        </div>

        {job.caution && (
          <div className="text-[#AE332A] text-sm flex items-start gap-2 mt-4 font-semibold bg-[#FAF0EE] p-3 rounded-[12px] border border-[#FAF0EE]">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" /> 
            <span>{t('caution')}: {isEn ? job.caution : DICT.ne.ws_warn_id}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end shrink-0 sm:w-40 border-t sm:border-t-0 sm:border-l border-[#EAE7E1] pt-4 sm:pt-0 sm:pl-6">
        <div className="text-left sm:text-right w-full">
          <div className="font-semibold text-2xl mb-1">${job.budgetUSD} <span className="text-lg font-medium text-[#4A4744]">{job.budgetType === 'fixed' ? 'fixed' : '/ hr'}</span></div>
          <div className="text-[#8A8580] text-sm font-medium mb-4">≈ NPR {fmtMoney(job.budgetUSD * 133)}</div>
          <div className="text-sm text-[#4A4744] font-medium mb-4 hidden sm:block">{job.applicants} {t('applied_count')}</div>
        </div>
        
        <div className="flex items-center gap-3 w-full justify-end">
          <button onClick={(e) => { e.stopPropagation(); onToggleSave(); }} className={`min-h-[48px] w-12 shrink-0 flex items-center justify-center rounded-full border transition-colors ${saved ? 'bg-[#FAF0EE] text-[#AE332A] border-[#C73E33]' : 'border-[#EAE7E1] bg-white hover:border-[#DDD8CE] text-[#1C1B1A]'}`} aria-label="Save job">
            <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
          </button>
          <button onClick={() => navTo('job-detail', { id: job.id })} className="bg-[#C73E33] text-white px-5 rounded-full text-base font-semibold hover:bg-[#AE332A] min-h-[52px] flex-1 sm:flex-none flex items-center justify-center">
            {t('view_job')}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- JOB DETAIL MODULE ---
function JobDetail({ job, t, navTo, user, savedJobs, setSavedJobs, lang, showToast, hasDraft = false, skillLevels = {} }) {
  const isEn = lang === 'en';
  const saved = savedJobs.includes(job.id);
  const digits = (n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const haveCount = job.skillsRequired.filter(sk => user.skills.includes(sk)).length;
  const [reportOpen, setReportOpen] = useState(false);

  const handleListen = () => {
    const text = `${job.title}. ${job.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-[850px] mx-auto bg-white border border-[#EAE7E1] rounded-[20px] overflow-hidden relative">
      <div className="p-5 sm:p-6 pb-32">
        <button onClick={() => navTo('firstwork')} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] mb-8 min-h-[48px] px-2 -ml-2">
          <ChevronLeft size={20} /> {t('back_to_jobs')}
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-[28px] sm:text-[30px] font-semibold mb-4 leading-tight">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-base text-[#4A4744] font-medium">
              <span className="flex items-center gap-2 bg-[#F6F4EF] px-3 py-1.5 rounded-[12px] border border-[#EAE7E1]"><User size={20} className="text-[#8A8580]"/> {job.clientName}</span>
              <span className="flex items-center gap-2 bg-[#F6F4EF] px-3 py-1.5 rounded-[12px] border border-[#EAE7E1]"><MapPin size={20} className="text-[#8A8580]"/> {job.clientCountry}</span>
              <span className="text-[#8A8580] px-2">{job.postedHoursAgo}h ago</span>
              <span className="text-[#8A8580] px-2">• {job.applicants} {t('applied_count')}</span>
            </div>
            {!isEn && <div className="text-sm font-semibold text-[#8A8580] mt-4 flex items-center gap-2"><Flag size={16}/> {t('job_en_note')}</div>}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
             <button onClick={handleListen} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 border border-[#EAE7E1] rounded-full hover:border-[#DDD8CE] text-[#1C1B1A] font-semibold min-h-[48px]">
              <Volume2 size={20} /> <span className="md:hidden lg:inline">{t('listen')}</span>
            </button>
            <button onClick={() => setReportOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 border border-[#EAE7E1] rounded-full hover:border-[#DDD8CE] text-[#1C1B1A] font-semibold min-h-[48px]">
              <Flag size={20} /> <span className="md:hidden lg:inline">{t('report')}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] p-6 sm:p-6 mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-4xl font-semibold mb-1">${job.budgetUSD} <span className="text-2xl font-medium text-[#4A4744]">{job.budgetType === 'fixed' ? 'fixed' : '/ hr'}</span></div>
            <div className="text-xl font-medium text-[#4A4744]">≈ NPR {fmtMoney(job.budgetUSD * 133)}</div>
          </div>
          <div className="text-sm text-[#8A8580] max-w-xs font-medium leading-relaxed">{t('sample_rate')}</div>
        </div>

        <div className="mb-10 -mt-4"><NetPayPreview usd={job.budgetUSD} t={t} /></div>

        {/* Card 1: Client Trust Card. Checked facts are kept apart from automatic warnings. */}
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 mb-6">
          <h3 className="font-semibold text-xl mb-5 flex items-center gap-3"><ShieldCheck size={24} className="text-[#C73E33] shrink-0" /> {t('tc_title')}</h3>
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-[#6E6963] mb-3">{t('tc_facts')}</h4>
            <ul className="space-y-3 text-base text-[#1C1B1A]">
              <li>
                <div className="font-semibold">{job.clientType} · {job.clientCountry}</div>
                <p className="text-[#4A4744] mt-1">{job.aboutClient}</p>
              </li>
              <li>{fmt(t('tc_since'), { year: digits(job.memberSince) })}</li>
              <li className="flex items-start gap-2">
                {job.paymentVerified && <Check size={20} className="mt-0.5 shrink-0 text-[#1C1B1A]" />}
                <span>{job.paymentVerified ? t('tc_pay_ok') : t('tc_pay_no')}</span>
              </li>
              <li>{fmt(t('tc_jobs'), { n: digits(job.jobsPostedByClient) })}</li>
              {job.hireRate > 0 ? (
                <>
                  <li>{fmt(t('tc_hire'), { n: digits(job.hireRate) })}</li>
                  {job.clientRating > 0 && <li>{fmt(t('tc_rating'), { n: digits(job.clientRating.toFixed(1)) })}</li>}
                </>
              ) : (
                <li>{t('tc_new')}</li>
              )}
            </ul>
          </div>
          {(!job.paymentVerified || job.caution) ? (
            <div className="bg-[#FAF0EE] rounded-[14px] p-4">
              <h4 className="font-semibold text-base text-[#AE332A] flex items-start gap-2 mb-3"><AlertTriangle size={20} className="mt-0.5 shrink-0" /> <span>{t('tc_warn_h')}</span></h4>
              <div className="space-y-3 text-base text-[#1C1B1A]">
                {!job.paymentVerified && <p>{t('tc_warn_pay')}</p>}
                {job.caution && <p>{job.caution}</p>}
              </div>
            </div>
          ) : (
            <p className="text-base text-[#4A4744]">{t('tc_none')}</p>
          )}
          <Disclaimer t={t} k="disc_trust" className="mt-4" />
        </div>

        {/* Card 2: Skill Match against her own WorkPassport */}
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 mb-6">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-3"><CheckSquare size={24} className="text-[#C73E33] shrink-0" /> {t('sm_title')}</h3>
          <p className="text-base text-[#1C1B1A] font-medium mb-4">
            {haveCount === job.skillsRequired.length ? t('sm_all') : fmt(t('sm_some'), { x: digits(haveCount), y: digits(job.skillsRequired.length) })}
          </p>
          <ul className="divide-y divide-[#EAE7E1]">
            {job.skillsRequired.map(sk => {
              const has = user.skills.includes(sk);
              return (
                <li key={sk} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 min-h-[44px]">
                  <span className="flex items-start gap-2 min-w-0 text-base">
                    {has && <Check size={20} className="mt-0.5 shrink-0 text-[#1C1B1A]" />}
                    <span className="min-w-0 break-words"><span className="font-semibold text-[#1C1B1A]">{sk}</span>{has && <span className="text-[#6E6963]"> — {t('pp_lvl_' + getLevel(user, skillLevels, sk))}</span>}</span>
                  </span>
                  {has ? (
                    <span className="shrink-0 bg-[#F0EEE9] text-[#4A4744] px-3 py-1 rounded-full text-[13px] font-semibold">{t('sm_have')}</span>
                  ) : (
                    <span className="shrink-0 bg-[#FAF0EE] text-[#AE332A] px-3 py-1 rounded-full text-[13px] font-semibold">{t('sm_new')}</span>
                  )}
                </li>
              );
            })}
          </ul>
          {haveCount < job.skillsRequired.length && <p className="text-base text-[#4A4744] mt-4">{t('sm_apply')}</p>}
        </div>

        {/* Card 3: Opportunity Compatibility */}
        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 mb-10">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-3"><ClipboardList size={24} className="text-[#C73E33] shrink-0" /> {t('oc_title')}</h3>
          <dl className="divide-y divide-[#EAE7E1] text-base">
            {[
              [t('oc_meet'), job.meetingTimeNepal],
              [t('oc_laptop'), job.needsOwnLaptop ? t('oc_yes') : t('oc_no')],
              [t('oc_net'), job.internetNeed],
              [t('oc_time'), fmt(t('wr_days'), { days: digits(job.deadlineDays) })],
            ].map(([k, v]) => (
              <div key={k} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                <dt className="text-[#6E6963]">{k}</dt>
                <dd className="font-semibold text-[#1C1B1A] sm:text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mb-10">
          <h3 className="font-semibold text-2xl mb-4">{t('about_job')}</h3>
          <p className="text-lg text-[#1C1B1A] whitespace-pre-wrap leading-relaxed bg-white">{job.description}</p>
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div>
              <h4 className="font-semibold text-lg mb-3">{t('deliver_title')}</h4>
              <ul className="space-y-2 text-base text-[#4A4744]">
                {job.deliverables.map(d => <li key={d} className="flex items-start gap-2"><Check size={20} className="mt-1 shrink-0 text-[#1C1B1A]" /> <span>{d}</span></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">{t('client_gives_title')}</h4>
              <ul className="space-y-2 text-base text-[#4A4744]">
                {job.clientProvides.map(d => <li key={d} className="flex items-start gap-2"><Check size={20} className="mt-1 shrink-0 text-[#1C1B1A]" /> <span>{d}</span></li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 mb-10">
          <h3 className="font-semibold text-xl mb-6 flex items-center gap-3"><ShieldCheck size={28} className="text-[#C73E33]" /> {t('ws_checked')}</h3>
          <div className="space-y-4 text-base font-medium">
            <div className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-0.5 text-[#1C1B1A]" /> <span>{t('ws_ok_scam')}</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-0.5 text-[#1C1B1A]" /> <span>{t('ws_ok_pay')}</span></div>
            {job.paymentVerified && <div className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-0.5 text-[#1C1B1A]" /> <span>{t('ws_ok_id')}</span></div>}
            <div className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-0.5 text-[#1C1B1A]" /> <span>{t('ws_ok_scope')}</span></div>
          </div>
          <Disclaimer t={t} k="disc_ws" className="mt-6" />
        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-[#EAE7E1] p-4 sm:p-6 flex flex-row gap-4 items-center justify-between sm:justify-end">
        {hasDraft && <div className="absolute bottom-full left-0 right-0 bg-[#FAF0EE] text-[#AE332A] text-sm font-semibold px-4 py-2 text-center sm:text-right sm:px-6">{t('pv_unfinished')}</div>}
        <button onClick={() => setSavedJobs(prev => prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id])} className={`px-6 py-3.5 rounded-full border font-semibold flex items-center justify-center gap-3 min-h-[52px] transition-colors ${saved ? 'bg-[#FAF0EE] text-[#AE332A] border-[#C73E33]' : 'bg-white border-[#E3E0D9] text-[#1C1B1A] hover:bg-[#F6F4EF]'}`}>
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} /> <span className="hidden sm:inline">{saved ? t('saved') : t('save')}</span>
        </button>
        <button onClick={() => navTo('apply', { id: job.id })} className="flex-1 sm:flex-none sm:w-64 py-3.5 bg-[#C73E33] text-white rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
          {t('apply_now')}
        </button>
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-[#1C1B1A]/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-[20px] w-full max-w-[450px]">
            <h3 className="font-semibold text-2xl mb-2 flex items-center gap-3"><Flag size={24} className="text-[#AE332A]" /> {t('report_title')}</h3>
            <p className="text-[#8A8580] font-medium mb-6">Tell us what is wrong. This is kept private.</p>
            <div className="space-y-4 mb-8">
              {[t('rep_1'), t('rep_2'), t('rep_3'), t('rep_4'), t('rep_5')].map((r, i) => (
                <label key={i} className="flex items-center gap-4 text-base font-medium cursor-pointer p-4 border border-[#EAE7E1] rounded-[14px] hover:border-[#DDD8CE] bg-[#F6F4EF]">
                  <input type="radio" name="report_reason" className="accent-[#C73E33] w-5 h-5" /> {r}
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setReportOpen(false)} className="flex-1 py-3.5 border border-[#E3E0D9] rounded-full font-semibold text-lg bg-white hover:bg-[#F6F4EF] min-h-[52px]">{t('cancel')}</button>
              <button onClick={() => { setReportOpen(false); showToast(t('report_toast')); }} className="flex-1 py-3.5 bg-[#C73E33] text-white rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">{t('send_report')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- APPLY WIZARD ---
function ApplyWizard({ job, t, navTo, user, setAppliedJobs, lang, simple = false, applyDraft = null, setApplyDraft = () => {} }) {
  // Simple Mode: resume an unfinished application for this same job.
  const saved = simple && applyDraft && applyDraft.jobId === job.id && applyDraft.answers && typeof applyDraft.answers === 'object' ? applyDraft : null;
  const sa = saved ? saved.answers : {};
  const [step, setStep] = useState(saved && saved.step >= 1 && saved.step <= 4 ? saved.step : 1);
  const sentRef = useRef(false);
  const matchedSkills = job.skillsRequired.filter(s => user.skills.includes(s)).join(", ");
  const initialText = `Hello,

I saw your job for ${job.title}. I can help because I have skills in ${matchedSkills || 'various tools'}.

I am ready to start.

Thanks,
${user.name}`;
  
  const [text, setText] = useState(typeof sa.text === 'string' ? sa.text : initialText);
  const [price, setPrice] = useState(typeof sa.price === 'number' ? sa.price : job.budgetUSD);
  const [days, setDays] = useState(typeof sa.days === 'number' ? sa.days : (job.deadlineDays || 3));
  const [chkPay, setChkPay] = useState(!!sa.chkPay);
  const [chkMile, setChkMile] = useState(!!sa.chkMile);
  const [chkDead, setChkDead] = useState(!!sa.chkDead);
  const [finalCheck, setFinalCheck] = useState(!!sa.finalCheck);

  // Simple Mode: keep the current step and answers on this device until the application is sent.
  useEffect(() => {
    if (!simple || sentRef.current || step >= 5) return;
    const dirty = step > 1 || text !== initialText || price !== job.budgetUSD || days !== (job.deadlineDays || 3) || chkPay || chkMile || chkDead || finalCheck;
    if (dirty) setApplyDraft({ jobId: job.id, step, answers: { text, price, days, chkPay, chkMile, chkDead, finalCheck } });
    else if (applyDraft && applyDraft.jobId === job.id) setApplyDraft(null);
  }, [simple, step, text, price, days, chkPay, chkMile, chkDead, finalCheck]);

  const isHourly = job.budgetType === 'hourly';
  const rangeLo = isHourly ? Math.max(1, job.budgetUSD - 1) : Math.round(job.budgetUSD * 0.75);
  const rangeHi = isHourly ? job.budgetUSD : Math.round(job.budgetUSD);
  const fmtNum = (n) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
  const fillRange = (str) => str.replace('{lo}', fmtNum(rangeLo)).replace('{hi}', fmtNum(rangeHi));
  const priceMsg = price < rangeLo ? t('price_low') + ' ' + fillRange(t('price_hint')) : price > rangeHi ? t('price_high') + ' ' + fillRange(t('price_hint')) : fillRange(t('price_fair'));
  const npr = price * 133;

  const handleSend = () => {
    sentRef.current = true;
    if (applyDraft && applyDraft.jobId === job.id) setApplyDraft(null);
    setAppliedJobs(prev => [{ jobId: job.id, price, npr, date: new Date().toISOString(), status: 'waiting' }, ...prev]);
    setStep(5);
  };

  if (step === 5) {
    return (
      <div className="max-w-[650px] mx-auto bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 text-center">
        <CheckCircle2 size={64} strokeWidth={1.5} className="mx-auto mb-6 text-[#C73E33]" />
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-4">{t('app_sent')}</h1>
        <p className="text-lg text-[#4A4744] mb-10 leading-relaxed max-w-md mx-auto">{t('app_sent_desc')}</p>
        <div className="space-y-4 max-w-sm mx-auto">
          <button onClick={() => navTo('opportunities', { tab: 'applied' })} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-lg rounded-full hover:bg-[#AE332A] min-h-[52px]">{t('view_opps')}</button>
          <button onClick={() => navTo('firstwork')} className="w-full py-3.5 border border-[#E3E0D9] font-semibold text-lg rounded-full hover:bg-[#F6F4EF] min-h-[52px] bg-white">{t('back_to_jobs')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => step === 1 ? navTo('job-detail', {id: job.id}) : setStep(step - 1)} className="flex items-center gap-2 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2">
          <ChevronLeft size={20} /> {t('back')}
        </button>
        <div className="text-sm font-semibold bg-[#F0EEE9] px-4 py-2 rounded-full border border-[#EAE7E1]">{t('step')} {step} {t('of')} 4</div>
      </div>
      
      <div className="h-2 bg-[#EAE7E1] rounded-full mb-10 overflow-hidden">
        <div className="h-full bg-[#C73E33] transition-all" style={{width: `${(step/4)*100}%`}}></div>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in">
          <h2 className="text-[28px] sm:text-[30px] font-semibold mb-6">{t('apply_step1')}</h2>
          <p className="text-base text-[#4A4744] mb-6 font-medium">Write a short message to the client. We started it for you based on your skills.</p>
          <div className="mb-3"><span className="inline-flex items-center rounded-full bg-[#F0EEE9] px-2.5 py-1 text-[13px] font-medium text-[#6E6963]">{t('ai_label')}</span></div>
          <div className="relative mb-3">
            <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-72 p-5 border border-[#EAE7E1] rounded-[14px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 resize-none text-base leading-relaxed bg-[#F6F4EF]" />
            <div className="absolute bottom-4 right-4 text-sm font-semibold text-[#8A8580]">{text.length} chars</div>
          </div>
          <Disclaimer t={t} k="disc_proposal" className="mb-6" />
          <div className="flex justify-start mb-10">
            <button onClick={() => setText(`Hello ${job.clientName.split(' ')[0]},

I carefully read your job for ${job.title}. I am a great fit because I have strong skills in ${matchedSkills}.

I am a fast learner, reliable, and ready to start immediately. Please let me know if you have any questions.

Best regards,
${user.name}`)} className="text-sm font-semibold border border-[#EAE7E1] bg-white px-5 py-3 rounded-full hover:border-[#DDD8CE] min-h-[48px] flex items-center gap-2 text-[#1C1B1A]"><Sparkles size={20} /> {t('make_better')}</button>
          </div>
          <button onClick={() => setStep(2)} disabled={text.length < 40} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-lg rounded-full hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('next')}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in">
          <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">{t('apply_step2')}</h2>
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3">Price (USD)</label>
            <div className="flex items-center">
              <span className="bg-[#F6F4EF] border border-[#EAE7E1] border-r-0 px-6 py-4 rounded-l-[14px] text-[#8A8580] font-semibold text-xl">$</span>
              <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border border-[#EAE7E1] px-6 py-4 rounded-r-[14px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 text-2xl font-semibold bg-white" />
            </div>
          </div>
          <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[14px] p-5 mb-3 text-base font-medium text-[#1C1B1A] flex gap-3">
            <ShieldCheck className="shrink-0 mt-0.5" /> <span>{priceMsg}</span>
          </div>
          <Disclaimer t={t} k="disc_price" className="mb-10" />
          
          <div className="mb-10">
            <label className="block text-lg font-semibold mb-4">{t('delivery_time')}</label>
            <div className="grid grid-cols-2 gap-4">
              {[2, 3, 5, 7].map(d => (
                <button key={d} onClick={() => setDays(d)} className={`py-3.5 border rounded-full text-lg font-semibold transition-colors min-h-[52px] ${days === d ? 'border-[#C73E33] bg-[#FAF0EE] text-[#AE332A]' : 'border-[#EAE7E1] bg-white text-[#4A4744] hover:border-[#DDD8CE]'}`}>
                  {d} {t('days')}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(3)} disabled={!price || price <= 0} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-lg rounded-full hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('next')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in">
          <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">{t('apply_step3')}</h2>
          
          <div className="bg-[#F6F4EF] border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 mb-8">
            <div className="flex justify-between items-center mb-4 text-base font-medium">
              <span className="text-[#4A4744]">{t('job_price')}</span>
              <span className="font-semibold text-lg">${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-base font-medium pb-6 border-b-2 border-dashed border-[#EAE7E1]">
              <span className="text-[#4A4744]">{t('platform_fee')}</span>
              <span className="text-[#AE332A] font-semibold bg-[#FAF0EE] px-3 py-1 rounded-[12px]">{t('free')}</span>
            </div>
            <div className="text-sm font-semibold text-[#8A8580] mb-2">1 USD = NPR 133</div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xl">{t('you_receive')}</span>
              <span className="font-semibold text-3xl">≈ NPR {fmtMoney(npr)}</span>
            </div>
            <Disclaimer t={t} k="receive_note" className="mt-6" />
          </div>

          <div className="border border-[#E3E0D9] rounded-[20px] p-6 sm:p-6 mb-10 bg-white">
            <div className="font-semibold text-lg mb-6 flex items-center gap-2"><CheckSquare size={24} /> {t('confirm_client')}</div>
            <label className="flex items-center gap-4 mb-4 cursor-pointer text-base font-medium hover:bg-[#F6F4EF] p-2 min-h-[44px] -ml-2 rounded-[12px] transition-colors">
              <input type="checkbox" checked={chkPay} onChange={e => setChkPay(e.target.checked)} className="accent-[#C73E33] w-6 h-6" /> {t('chk_pay')}
            </label>
            <label className="flex items-center gap-4 mb-4 cursor-pointer text-base font-medium hover:bg-[#F6F4EF] p-2 min-h-[44px] -ml-2 rounded-[12px] transition-colors">
              <input type="checkbox" checked={chkMile} onChange={e => setChkMile(e.target.checked)} className="accent-[#C73E33] w-6 h-6" /> {t('chk_mile')}
            </label>
            <label className="flex items-center gap-4 cursor-pointer text-base font-medium hover:bg-[#F6F4EF] p-2 min-h-[44px] -ml-2 rounded-[12px] transition-colors">
              <input type="checkbox" checked={chkDead} onChange={e => setChkDead(e.target.checked)} className="accent-[#C73E33] w-6 h-6" /> {t('chk_dead')}
            </label>
          </div>

          <button onClick={() => setStep(4)} disabled={!chkPay || !chkMile || !chkDead} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-lg rounded-full hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px]">
            {t('next')}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="animate-in fade-in">
          <h2 className="text-[28px] sm:text-[30px] font-semibold mb-8">{t('apply_step4')}</h2>
          
          <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 mb-8 text-base space-y-6">
            <div>
              <div className="text-[#8A8580] text-sm font-semibold mb-1 uppercase tracking-wider">Job</div>
              <div className="font-semibold text-xl">{job.title}</div>
            </div>
            <div>
              <div className="text-[#8A8580] text-sm font-semibold mb-2 uppercase tracking-wider">Message</div>
              <div className="bg-[#F6F4EF] p-4 border border-[#EAE7E1] rounded-[14px] font-medium line-clamp-4 leading-relaxed">{text}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t border-[#EAE7E1]">
              <div>
                <div className="text-[#8A8580] text-sm font-semibold mb-1 uppercase tracking-wider">Terms</div>
                <div className="font-semibold text-xl">${price} in {days} days</div>
              </div>
              <div className="sm:text-right">
                <div className="text-[#8A8580] text-sm font-semibold mb-1 uppercase tracking-wider">You get</div>
                <div className="font-semibold text-2xl text-[#1C1B1A]">NPR {fmtMoney(npr)}</div>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-4 mb-10 cursor-pointer p-5 border border-[#E3E0D9] rounded-[20px] bg-[#F6F4EF] hover:bg-[#EDEAE4] transition-colors">
            <div className="shrink-0"><input type="checkbox" checked={finalCheck} onChange={e => setFinalCheck(e.target.checked)} className="accent-[#C73E33] w-6 h-6" /></div>
            <div className="text-base font-semibold flex items-center gap-2"><ShieldCheck size={20} className="text-[#1C1B1A]" /> {t('ws_confirm')}</div>
          </label>

          <div className="mb-10"><NetPayPreview usd={job.budgetUSD} t={t} /></div>

          <button onClick={handleSend} disabled={!finalCheck} className="w-full py-3.5 bg-[#C73E33] text-white font-semibold text-xl rounded-full hover:bg-[#AE332A] disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-3">
            {t('send_app')} <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

// --- CLIENT CHAT + IN-CHAT SAFETY CHECKER ---
const CHAT_CANNED = [
  "Okay, thank you. Please start with the first part.",
  "Can you finish it by tomorrow?",
  "Please send the first draft when it is ready.",
];

// Deterministic seed threads. Job j3 is the demo thread; every other job gets two messages built from its own title.
function seedThread(job) {
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

// Runs BOTH existing engines on one message. For chat messages the text-only job rules
// "work not clear" / "payment not mentioned" do not apply (a short chat line never describes a whole job),
// the same way analyzeJob drops them for FirstWork jobs.
function checkChatText(text) {
  const cats = analyzeMessage(text);
  const f = analyzeText(text);
  const yellow = f.yellow.filter(id => id !== 'vague' && id !== 'nopay');
  const verdict = f.red.length ? 'danger' : yellow.length ? 'warning' : 'ok';
  return { cats, red: f.red, yellow, verdict };
}

function ChatCheckModal({ t, lang, user, navTo, showToast, setEvidence, initialText = "", autoRun = false, onClose, clientApi = null, job = null, workrooms = {}, setWorkrooms = () => {} }) {
  const other = lang === 'ne' ? 'en' : 'ne';
  const rules = (user && user.safetyRules) || DEFAULT_RULES;
  const [text, setText] = useState(initialText);
  const [checked, setChecked] = useState(autoRun && initialText.trim() ? initialText.trim() : null);
  const [emptyErr, setEmptyErr] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scopeForm, setScopeForm] = useState(false);
  const [scopeName, setScopeName] = useState("");
  const [scopePrice, setScopePrice] = useState("10");
  const [scopeErr, setScopeErr] = useState(false);
  const [scopeDone, setScopeDone] = useState(false);
  const resultRef = useRef(null);
  const textRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    if (autoRun && initialText.trim()) { if (closeRef.current) closeRef.current.focus(); }
    else if (textRef.current) textRef.current.focus();
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    if (checked !== null && resultRef.current) resultRef.current.scrollIntoView({ block: 'start' });
  }, [checked]);

  const res = useMemo(() => (checked === null ? null : checkChatText(checked)), [checked]);

  const run = () => {
    if (!text.trim()) { setEmptyErr(true); return; }
    setEmptyErr(false); setSaved(false); setScopeForm(false); setScopeErr(false); setScopeDone(false); setChecked(text.trim());
  };
  const fill = (str) => { setText(str); setEmptyErr(false); };
  const copy = async (str) => {
    try { await navigator.clipboard.writeText(str); } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = str; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
    }
    showToast(t('sh_copied'));
  };
  const saveProof = () => {
    if (!res || saved) return;
    setEvidence(prev => [{ text: checked.slice(0, 500), categories: res.cats, date: new Date().toISOString(), source: 'chat', jobTitle: job ? job.title : '', clientName: job ? job.clientName : '' }, ...(Array.isArray(prev) ? prev : [])].slice(0, 20));
    setSaved(true);
    showToast(t('sf_saved_toast'));
  };

  const scope = useMemo(() => (checked === null ? null : checkScope(checked)), [checked]);
  const wrStored = job ? workrooms[job.id] : null;
  const agreed = job
    ? ((wrStored && Array.isArray(wrStored.milestones) && wrStored.milestones.length) ? wrStored.milestones.map(m => m.title) : (job.deliverables || []))
    : [];
  const openScopeForm = () => { setScopeName(t('sc_extra_default')); setScopePrice("10"); setScopeErr(false); setScopeForm(true); };
  const saveMilestone = () => {
    const price = Number(scopePrice);
    if (!scopeName.trim() || scopePrice === "" || !Number.isFinite(price) || !(price > 0)) { setScopeErr(true); return; }
    const base = (wrStored && Array.isArray(wrStored.milestones) && wrStored.milestones.length) ? wrStored.milestones : buildWorkroomMilestones(job);
    const extra = { id: job.id + "-x" + Date.now(), title: scopeName.trim(), amountUSD: price, state: 'not_funded' };
    setWorkrooms({ ...workrooms, [job.id]: { milestones: [...base, extra] } });
    setScopeErr(false); setScopeForm(false); setScopeDone(true);
  };

  const hasSafety = !!res && res.cats.length > 0;
  const hasShield = !!res && (res.red.length > 0 || res.yellow.length > 0);
  const calm = !!res && !hasSafety && !hasShield;
  const questions = res ? ['nopay', 'vague', 'lowpay'].filter(id => res.yellow.includes(id)) : [];
  const chips = [
    { label: 'chat_chip1', text: SAFETY_EXAMPLES[0].text },
    { label: 'chat_chip2', text: SAFETY_EXAMPLES[1].text },
    { label: 'chat_chip3', text: SHIELD_EXAMPLES[0].text },
  ];
  const ShieldVerdictIcon = res && res.verdict === 'danger' ? ShieldAlert : AlertTriangle;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1B1A]/40 flex items-end sm:items-center justify-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="chat-check-title" className="bg-white w-full sm:max-w-[480px] max-h-[92vh] sm:max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-t-[20px] sm:rounded-[20px] border border-[#EAE7E1]">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between gap-3 px-5 sm:px-6 pt-4 pb-3 border-b border-[#EAE7E1]">
          <h2 id="chat-check-title" className="text-xl font-semibold flex items-center gap-2 min-w-0"><Shield size={22} className="shrink-0 text-[#C73E33]" /> <span>{t('chat_modal_title')}</span></h2>
          <button ref={closeRef} onClick={onClose} aria-label={t('chat_close')} className="shrink-0 w-12 h-12 -mr-2 rounded-full flex items-center justify-center text-[#4A4744] hover:bg-[#F0EEE9]"><X size={22} /></button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <textarea ref={textRef} value={text} onChange={e => { setText(e.target.value); setEmptyErr(false); }} aria-label={t('chat_modal_title')} placeholder={t('sf_placeholder')} className="w-full min-h-[104px] border border-[#EAE7E1] bg-white rounded-[14px] px-4 py-3 text-base outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30 mb-3" />
            {emptyErr && <p role="alert" className="text-[#AE332A] text-sm mb-3 flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><ShieldAlert size={18} className="shrink-0 mt-0.5" /> <span>{t('err_paste_first')}</span></p>}
            <button onClick={run} className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-6">{t('chat_check_now')}</button>
            <div className="flex flex-wrap gap-2 mt-3">
              {chips.map(c => (
                <button key={c.label} onClick={() => fill(c.text)} className="border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-4 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{t(c.label)}</button>
              ))}
            </div>
          </div>

          {res && (
            <div ref={resultRef} className="space-y-5 scroll-mt-[76px]">
              {hasSafety && (
                <div className="space-y-4">
                  <div className="bg-[#FAF0EE] border border-[#C73E33] rounded-[20px] p-4 flex items-start gap-3">
                    <ShieldAlert size={32} className="shrink-0 text-[#C73E33]" />
                    <div>
                      <h3 className="text-lg leading-snug font-semibold mb-1">{t('sf_cross_title')}</h3>
                      <p className="text-base text-[#4A4744]">{t('sf_cross_line')}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {res.cats.map(id => {
                      const ruleKey = SAFETY_RULE_OF[id];
                      const off = ruleKey && !rules[ruleKey];
                      return (
                        <div key={id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                          <div className="font-semibold text-base mb-1 flex items-start gap-2"><AlertTriangle size={18} className="shrink-0 mt-1" /> <span>{SAFETY_DATA[id].name[lang]}</span></div>
                          <p className="text-base text-[#4A4744] mb-2">{SAFETY_DATA[id].expl[lang]}</p>
                          <p className="text-sm font-semibold text-[#1C1B1A]">
                            {ruleKey ? fmt(t('sf_breaks'), { rule: t('rule_' + ruleKey) }) : t('sf_no_one')}
                            {off && <span className="font-normal text-[#8A8580]">{t('sf_off_note')}</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">{t('sf_reply_title')}</h3>
                    <div className="space-y-3">
                      {[...res.cats.map(id => ({ id, label: SAFETY_DATA[id].name[lang], reply: SAFETY_DATA[id].reply })), { id: 'exit', label: t('sf_exit_label'), reply: SAFETY_EXIT }].map(r => (
                        <div key={r.id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                          <div className="text-sm font-semibold text-[#8A8580] mb-2">{r.label}</div>
                          <p className="text-base text-[#1C1B1A] mb-2">{r.reply[lang]}</p>
                          <p className="text-sm text-[#8A8580] mb-3">{r.reply[other]}</p>
                          <button onClick={() => copy(r.reply[lang])} className="border border-[#E3E0D9] bg-white rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t('sh_copy')}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={saveProof} disabled={saved} className={`w-full rounded-full font-semibold text-base min-h-[52px] px-6 ${saved ? 'bg-[#F0EEE9] text-[#4A4744]' : 'bg-[#C73E33] text-white hover:bg-[#AE332A]'}`}>{saved ? t('sf_saved_toast') : t('sf_save_proof')}</button>
                </div>
              )}

              {hasShield && (
                <div className="space-y-4">
                  <div className={`rounded-[20px] border p-4 flex items-start gap-3 ${res.verdict === 'danger' ? 'bg-[#FAF0EE] border-[#C73E33]' : 'bg-white border-[#EAE7E1]'}`}>
                    <ShieldVerdictIcon size={32} className={`shrink-0 ${res.verdict === 'danger' ? 'text-[#C73E33]' : 'text-[#1C1B1A]'}`} />
                    <div>
                      <h3 className="text-lg leading-snug font-semibold">{t('sh_v_' + res.verdict)}</h3>
                      {res.verdict === 'danger' && <p className="text-base font-semibold text-[#AE332A] mt-2">{t('chat_danger_line')}</p>}
                    </div>
                  </div>
                  <div className="bg-white border border-[#EAE7E1] rounded-[14px] p-4 space-y-3">
                    {res.red.map(id => <div key={id} className="flex items-start gap-3 text-base"><ShieldAlert size={20} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sh_f_' + id)}</span></div>)}
                    {res.yellow.map(id => <div key={id} className="flex items-start gap-3 text-base"><AlertTriangle size={20} className="shrink-0 mt-0.5 text-[#1C1B1A]" /> <span>{t('sh_f_' + id)}</span></div>)}
                  </div>
                  {questions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">{t('sh_q_title')}</h3>
                      <div className="space-y-3">
                        {questions.map(id => (
                          <div key={id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                            <p className="text-base mb-3">{t('sh_q_' + id)}</p>
                            <button onClick={() => copy(t('sh_q_' + id))} className="border border-[#E3E0D9] bg-white rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t('sh_copy')}</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {calm && (
                <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4 flex items-start gap-3">
                  <ShieldCheck size={32} className="shrink-0 text-[#1C1B1A]" />
                  <div>
                    <h3 className="text-lg leading-snug font-semibold mb-1">{t('chat_calm_title')}</h3>
                    <p className="text-base text-[#4A4744]">{t('chat_calm_line')}</p>
                  </div>
                </div>
              )}

              {job && scope && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><ClipboardList size={22} className="shrink-0 text-[#C73E33]" /> <span>{t('sc_title')}</span></h3>
                  {scope.flagged ? (
                    <div className="bg-[#FAF0EE] border border-[#C73E33] rounded-[20px] p-4 space-y-2">
                      <p className="text-base font-semibold text-[#1C1B1A]">{t('sc_flag')}</p>
                      <p className="text-base text-[#4A4744]">{t('sc_reason')} {scope.matched.map((p, i) => <span key={p}>{i > 0 ? ', ' : ''}<span className="font-semibold text-[#1C1B1A]">“{p}”</span></span>)}</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4">
                      <p className="text-base text-[#4A4744]">{t('sc_ok')}</p>
                    </div>
                  )}
                  <div className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                    <div className="text-sm font-semibold text-[#6E6963] mb-2">{t('sc_agreed')}</div>
                    <ul className="space-y-1.5">
                      {agreed.map((x, i) => <li key={i} className="flex items-start gap-2 text-base text-[#4A4744]"><span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#8A8580] shrink-0" /><span>{x}</span></li>)}
                    </ul>
                  </div>
                  {scope.flagged && (
                    <div className="space-y-3">
                      {[{ id: 'accept', h: t('sc_accept_h'), b: t('sc_accept_b') }, { id: 'ask', h: t('sc_ask_h'), b: t('sc_ask_b') }].map(r => (
                        <div key={r.id} className="bg-white border border-[#EAE7E1] rounded-[14px] p-4">
                          <div className="text-sm font-semibold text-[#8A8580] mb-2">{r.h}</div>
                          <p className="text-base text-[#1C1B1A] mb-3">{r.b}</p>
                          <button onClick={() => copy(r.b)} className="border border-[#E3E0D9] bg-white rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px]">{t('sh_copy')}</button>
                        </div>
                      ))}
                      {scopeDone ? (
                        <p role="status" className="flex items-start gap-2 text-base text-[#1C1B1A] bg-[#F0EEE9] rounded-[14px] p-4"><Check size={20} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{t('sc_done')}</span></p>
                      ) : scopeForm ? (
                        <div className="bg-white border border-[#EAE7E1] rounded-[14px] p-4 space-y-3">
                          <div>
                            <label htmlFor="sc-name" className="block text-sm font-semibold text-[#6E6963] mb-1">{t('sc_name')}</label>
                            <input id="sc-name" type="text" value={scopeName} onChange={e => { setScopeName(e.target.value); setScopeErr(false); }} className="w-full border border-[#EAE7E1] bg-white rounded-[14px] px-4 text-base min-h-[48px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30" />
                          </div>
                          <div>
                            <label htmlFor="sc-price" className="block text-sm font-semibold text-[#6E6963] mb-1">{t('sc_price')}</label>
                            <input id="sc-price" type="number" inputMode="decimal" min="0" step="any" value={scopePrice} onChange={e => { setScopePrice(e.target.value); setScopeErr(false); }} className="w-full border border-[#EAE7E1] bg-white rounded-[14px] px-4 text-base min-h-[48px] outline-none focus:border-[#C73E33] focus:ring-2 focus:ring-[#C73E33]/30" />
                          </div>
                          {scopeErr && <p role="alert" className="text-[#AE332A] text-sm flex items-start gap-2 bg-[#FAF0EE] p-3 rounded-[12px]"><ShieldAlert size={18} className="shrink-0 mt-0.5" /> <span>{t('sc_err')}</span></p>}
                          <button onClick={saveMilestone} className="w-full bg-[#C73E33] text-white rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[52px] px-6">{t('sc_save')}</button>
                        </div>
                      ) : (
                        <button onClick={openScopeForm} className="w-full border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[52px] flex items-center justify-center gap-2"><ClipboardList size={18} /> {t('sc_create')}</button>
                      )}
                    </div>
                  )}
                  <Disclaimer t={t} k="disc_scope" />
                </div>
              )}

              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {(hasShield || calm) && <button onClick={() => navTo('shield')} className="text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px]">{t('chat_open_shield')}</button>}
                {(hasSafety || calm) && <button onClick={() => navTo('safety')} className="text-base font-semibold text-[#4A4744] underline underline-offset-4 min-h-[44px]">{t('chat_open_safety')}</button>}
              </div>
              {clientApi && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={clientApi.toggleMute} className="flex-1 min-w-[140px] border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-4 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{clientApi.muted ? t('ca_unmute') : t('ca_mute')}</button>
                  <button onClick={clientApi.toggleBlock} className="flex-1 min-w-[140px] border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-4 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{clientApi.blocked ? t('ca_unblock') : t('ca_block')}</button>
                  <button onClick={clientApi.openReport} className="flex-1 min-w-[140px] border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-4 font-semibold text-sm hover:border-[#DDD8CE] min-h-[44px]">{t('ca_report')}{clientApi.hasReport ? ' ✓' : ''}</button>
                </div>
              )}
              <Disclaimer t={t} k="disc_chat" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Safety net: chats exist only for jobs she has applied to.
function ChatMissing({ t, navTo }) {
  useEffect(() => { navTo('opportunities', { tab: 'applied' }); }, []);
  return null;
}

function ChatView({ t, lang, job, user, navTo, showToast, chats, updateChat, setEvidence, workrooms = {}, setWorkrooms = () => {}, simple = false, chatDrafts = {}, setChatDrafts = () => {}, getClientAction, clientAction = {}, setClientAction = () => {} }) {
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
      // Pick the next canned reply "in order": by how many other threads already received one.
      const used = Object.keys(chats).filter(id => id !== job.id && (chats[id] || []).some(m => m.from === 'client' && CHAT_CANNED.includes(m.text))).length;
      const reply = CHAT_CANNED[used % CHAT_CANNED.length];
      setTimeout(() => {
        // Check mute / block again when the reply would arrive (it may have been scheduled before).
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
        <div className="mt-3 pt-3 border-t border-[#EAE7E1] flex justify-end relative" ref={menuRef}>
          <button type="button" onClick={() => setMenuOpen(o => !o)} aria-haspopup="menu" aria-expanded={menuOpen} className="flex items-center gap-2 rounded-full font-semibold text-base text-[#1C1B1A] border border-[#E3E0D9] bg-white hover:border-[#DDD8CE] min-h-[48px] px-4"><MoreVertical size={20} /> <span>{t('ca_options')}</span></button>
          {menuOpen && (
            <div role="menu" className="absolute right-0 top-full mt-2 w-[min(280px,calc(100vw-32px))] bg-white border border-[#EAE7E1] rounded-[16px] shadow-[0_8px_24px_rgba(28,27,26,0.08)] overflow-hidden z-40 text-left">
              <button role="menuitem" onClick={() => { setMenuOpen(false); toggleMute(); }} className="w-full text-left px-5 py-3 min-h-[48px] text-base text-[#1C1B1A] hover:bg-[#F6F4EF] border-b border-[#EAE7E1] flex items-center gap-3"><BellOff size={20} className="shrink-0" /> {muted ? t('ca_unmute') : t('ca_mute')}</button>
              <button role="menuitem" onClick={() => { setMenuOpen(false); toggleBlock(); }} className="w-full text-left px-5 py-3 min-h-[48px] text-base text-[#1C1B1A] hover:bg-[#F6F4EF] border-b border-[#EAE7E1] flex items-center gap-3"><Ban size={20} className="shrink-0" /> {blocked ? t('ca_unblock') : t('ca_block')}</button>
              <button role="menuitem" onClick={() => { setMenuOpen(false); setReportOpen(true); }} className="w-full text-left px-5 py-3 min-h-[48px] text-base text-[#1C1B1A] hover:bg-[#F6F4EF] flex items-center gap-3"><Flag size={20} className="shrink-0" /> {t('ca_report')}{report ? ' ✓' : ''}</button>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}

// --- WORKROOM MODULE ---
// One milestone per deliverable. Whole-dollar split; the LAST milestone takes the remainder so the sum equals the budget.
function buildWorkroomMilestones(job) {
  const items = (job.deliverables && job.deliverables.length) ? job.deliverables : [job.title];
  const n = items.length;
  const base = Math.floor(job.budgetUSD / n);
  const extra = job.budgetUSD - base * n; // leftover whole dollars go to the first milestones, one each
  let left = job.budgetUSD;
  return items.map((title, i) => {
    const amt = i === n - 1 ? left : base + (i < extra ? 1 : 0); // the last milestone takes whatever remains
    left -= amt;
    return { id: `${job.id}-m${i + 1}`, title, amountUSD: amt, state: 'not_funded' };
  });
}

function WorkroomView({ t, lang, job, navTo, showToast, workrooms, setWorkrooms, confirmedJobs, setConfirmedJobs, hideMoney = false }) {
  const stored = workrooms[job.id];
  const hasEntry = !!(stored && Array.isArray(stored.milestones) && stored.milestones.length);
  const milestones = hasEntry ? stored.milestones : buildWorkroomMilestones(job);

  // Create the workroom the first time it is opened (only reachable for applied jobs).
  useEffect(() => {
    if (!hasEntry) setWorkrooms({ ...workrooms, [job.id]: { milestones } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const money = (usd) => hideMoney ? MASK : `$${fmtMoney(usd)}`;
  const nprOf = (usd) => hideMoney ? MASK : fmtMoney(usd * 133);
  const total = milestones.length;
  const done = milestones.filter(m => m.state === 'released').length;
  const totalUSD = milestones.reduce((a, m) => a + m.amountUSD, 0);
  const releasedUSD = milestones.filter(m => m.state === 'released').reduce((a, m) => a + m.amountUSD, 0);
  const pct = totalUSD > 0 ? Math.round((releasedUSD / totalUSD) * 100) : 0;
  const complete = total > 0 && done === total;

  const setState = (id, state) => {
    const next = milestones.map(m => m.id === id ? { ...m, state } : m);
    setWorkrooms({ ...workrooms, [job.id]: { milestones: next } });
    if (state === 'released' && next.every(m => m.state === 'released')) {
      // Same mechanism as the Passport demo client-confirm: idempotent add to wp_confirmed.
      if (!confirmedJobs.includes(job.id)) {
        setConfirmedJobs(prev => (Array.isArray(prev) ? (prev.includes(job.id) ? prev : [...prev, job.id]) : [job.id]));
        showToast(t('pp_confirm_toast'));
      }
    }
  };

  const pill = (state) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${state === 'released' ? 'bg-[#FAF0EE] border-[#F3E1DD] text-[#AE332A]' : 'bg-[#F0EEE9] border-[#EAE7E1] text-[#1C1B1A]'}`}>{state === 'released' && <Check size={14} />}{t('wr_s_' + state)}</span>
  );
  const bullets = (arr) => (
    <ul className="space-y-1.5">
      {(arr || []).map((x, i) => <li key={i} className="flex items-start gap-2 text-base text-[#4A4744]"><span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#8A8580] shrink-0" /><span>{x}</span></li>)}
    </ul>
  );
  const label = "text-sm font-semibold text-[#6E6963] mb-1";
  const demoBtn = "w-full sm:w-auto border-2 border-dashed border-[#D8D4CC] text-[#4A4744] rounded-full px-5 font-semibold text-base hover:border-[#8A8580] min-h-[48px] bg-white";

  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navTo('opportunities', { tab: 'applied' })} aria-label={t('back')} className="shrink-0 flex items-center gap-1 text-base font-semibold text-[#4A4744] hover:text-[#1C1B1A] min-h-[48px] -ml-1 pr-1"><ChevronLeft size={20} /><span>{t('back')}</span></button>
        </div>
        <h1 className="text-[28px] sm:text-[30px] font-semibold leading-tight mb-2">{t('wr_title')}</h1>
        <div className="text-lg font-semibold text-[#1C1B1A]">{job.title}</div>
        <div className="text-base text-[#4A4744] flex items-center gap-2 mb-4"><User size={18} /> {job.clientName}</div>
        <button onClick={() => navTo('chat', { id: job.id })} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] flex items-center justify-center gap-2"><MessageSquare size={18} /> {t('chat_msg_client')}</button>
      </div>

      <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
        <Info size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
        <p className="text-base text-[#1C1B1A]">{t('wr_sim_note')}</p>
      </div>

      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">{t('wr_agreement')}</h2>
        <div className="space-y-4">
          <div><div className={label}>{job.clientName}</div><div className="text-base font-semibold text-[#1C1B1A]">{job.title}</div></div>
          <div><div className={label}>{t('wr_price')}</div><div className="text-base text-[#1C1B1A]">{hideMoney ? `${MASK} (NPR ${MASK})` : `$${fmtMoney(job.budgetUSD)} (NPR ${fmtMoney(job.budgetUSD * 133)})`}</div></div>
          <div><div className={label}>{t('wr_deadline')}</div><div className="text-base text-[#1C1B1A]">{fmt(t('wr_days'), { days: job.deadlineDays })}</div></div>
          <div><div className={label}>{t('wr_deliver')}</div>{bullets(job.deliverables)}</div>
          <div><div className={label}>{t('wr_provides')}</div>{bullets(job.clientProvides)}</div>
        </div>
      </div>

      <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6">
        {complete && (
          <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[14px] p-4 flex items-start gap-3 mb-5">
            <CheckCircle2 size={22} className="shrink-0 mt-0.5 text-[#C73E33]" />
            <p className="text-base font-semibold text-[#1C1B1A]">{t('wr_complete')}</p>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4">{t('wr_milestones')}</h2>
        <div className="text-base font-semibold text-[#1C1B1A] mb-2">{fmt(t('wr_progress'), { done, total })}</div>
        <div className="h-2.5 rounded-full bg-[#F0EEE9] overflow-hidden mb-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <div className="h-full rounded-full bg-[#C73E33] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-sm text-[#6E6963] mb-5">{fmt(t('wr_released_so_far'), { x: nprOf(releasedUSD), y: nprOf(totalUSD) })}</div>

        <div className="space-y-3">
          {milestones.map(m => (
            <div key={m.id} className="border border-[#EAE7E1] rounded-[14px] p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-[#1C1B1A]">{m.title}</div>
                  <div className="text-sm text-[#6E6963]">{money(m.amountUSD)} · NPR {nprOf(m.amountUSD)}</div>
                </div>
                <div className="shrink-0">{pill(m.state)}</div>
              </div>
              {m.state === 'not_funded' && <button onClick={() => setState(m.id, 'funded')} className={demoBtn}>{t('wr_demo_fund')}</button>}
              {m.state === 'funded' && <button onClick={() => setState(m.id, 'submitted')} className="w-full sm:w-auto bg-[#C73E33] text-white rounded-full px-6 font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">{t('wr_submit')}</button>}
              {m.state === 'submitted' && (
                <div className="space-y-3">
                  <p className="text-base text-[#4A4744]">{t('wr_waiting')}</p>
                  <button onClick={() => setState(m.id, 'released')} className={demoBtn}>{t('wr_demo_release')}</button>
                </div>
              )}
              {m.state === 'released' && <div className="flex items-center gap-2 text-base font-semibold text-[#AE332A]"><Check size={18} /> {t('wr_s_released')}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- MY OPPORTUNITIES MODULE ---
function MyOpportunities({ allJobs = DUMMY_JOBS, t, navTo, savedJobs, setSavedJobs, appliedJobs, initialTab, confirmedJobs = [], hideMoney = false, draftJobId = null }) {
  const [tab, setTab] = useState(initialTab === 'applied' ? 'applied' : 'saved');

  return (
    <div className="max-w-[900px] mx-auto">
      <h1 className="text-[28px] sm:text-[30px] font-semibold mb-8">{t('my_opps')}</h1>
      
      <div className="flex gap-4 border-b-2 border-[#EAE7E1] mb-8">
        <button onClick={() => setTab('saved')} className={`pb-3 font-semibold text-lg border-b-2 transition-colors min-h-[48px] px-2 ${tab === 'saved' ? 'border-[#C73E33] text-[#1C1B1A]' : 'border-transparent text-[#8A8580] hover:text-[#1C1B1A]'}`}>{t('tab_saved')} ({savedJobs.length})</button>
        <button onClick={() => setTab('applied')} className={`pb-3 font-semibold text-lg border-b-2 transition-colors min-h-[48px] px-2 ${tab === 'applied' ? 'border-[#C73E33] text-[#1C1B1A]' : 'border-transparent text-[#8A8580] hover:text-[#1C1B1A]'}`}>{t('tab_applied')} ({appliedJobs.length})</button>
      </div>

      {tab === 'saved' && (
        <div className="space-y-4">
          {savedJobs.length === 0 ? (
            <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-center text-lg font-medium text-[#8A8580] flex flex-col items-center gap-4">
               <Bookmark size={48} className="text-[#D8D4CC]" />
               {t('no_saved')}
            </div>
          ) : (
            savedJobs.map(id => {
              const job = allJobs.find(j => j.id === id);
              if (!job) return null;
              return (
                <div key={id} className="bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-[#DDD8CE] transition-colors">
                  <div className="flex-1 cursor-pointer w-full" onClick={() => navTo('job-detail', {id})}>
                    <div className="font-semibold text-xl mb-2 line-clamp-1 group-hover:underline">{job.title}</div>
                    <div className="text-base text-[#4A4744] font-medium flex items-center gap-3"><User size={20}/> {job.clientName} <span className="text-[#D8D4CC]">|</span> <span className="font-semibold text-[#1C1B1A]">${job.budgetUSD}</span></div>
                    {draftJobId === id && <div className="text-sm font-semibold text-[#AE332A] mt-2">{t('pv_unfinished')}</div>}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => setSavedJobs(savedJobs.filter(s => s !== id))} className="flex-1 sm:flex-none px-4 py-3 border border-[#EAE7E1] rounded-full text-base font-semibold text-[#1C1B1A] hover:border-[#DDD8CE] min-h-[48px] flex justify-center items-center gap-2"><X size={18}/> {t('remove')}</button>
                    <button onClick={() => navTo('apply', {id})} className="flex-1 sm:flex-none px-6 py-3 bg-[#C73E33] text-white rounded-full text-base font-semibold hover:bg-[#AE332A] min-h-[52px]">{t('apply_now')}</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'applied' && (
        <div className="space-y-4">
          {appliedJobs.length === 0 ? (
            <div className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 text-center text-lg font-medium text-[#8A8580] flex flex-col items-center gap-4">
              <CheckSquare size={48} className="text-[#D8D4CC]" />
              {t('no_applied')}
            </div>
          ) : (
            appliedJobs.map((app, idx) => {
              const job = allJobs.find(j => j.id === app.jobId);
              return (
                <div key={idx} className="bg-white border border-[#EAE7E1] rounded-[20px] p-6 sm:p-6 hover:border-[#DDD8CE] transition-colors cursor-pointer" onClick={() => navTo('job-detail', {id: app.jobId})}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <div className="font-semibold text-xl sm:text-2xl mb-2 line-clamp-1">{job?.title || "Job Unavailable"}</div>
                      <div className="text-base text-[#4A4744] font-medium flex items-center gap-2"><User size={20}/> {job?.clientName}</div>
                    </div>
                    <div className="sm:text-right bg-[#F6F4EF] p-4 rounded-[14px] border border-[#EAE7E1] w-full sm:w-auto">
                      <div className="font-semibold text-2xl mb-1">{hideMoney ? MASK : `$${app.price}`}</div>
                      <div className="text-sm font-semibold text-[#8A8580]">{hideMoney ? `NPR ${MASK}` : `NPR ${fmtMoney(app.npr)}`}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-[#EAE7E1]">
                    <span className="bg-[#F0EEE9] border border-[#EAE7E1] px-4 py-2 rounded-[12px] text-[#1C1B1A] font-semibold text-sm flex items-center gap-2"><CheckCircle2 size={16}/> {confirmedJobs.includes(app.jobId) ? t('pp_completed_status') : t('applied_status')}</span>
                    <span className="text-base font-semibold text-[#8A8580]">{fmtDate(app.date)}</span>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button onClick={(e) => { e.stopPropagation(); navTo('chat', { id: app.jobId }); }} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] flex items-center justify-center gap-2"><MessageSquare size={18} /> {t('chat_msg_client')}</button>
                    <button onClick={(e) => { e.stopPropagation(); navTo('workroom', { id: app.jobId }); }} className="w-full sm:w-auto border border-[#E3E0D9] bg-white text-[#1C1B1A] rounded-full px-6 font-semibold text-base hover:border-[#DDD8CE] min-h-[48px] flex items-center justify-center gap-2"><ClipboardList size={18} /> {t('wr_open')}</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}


// --- CLIENT DEMO FLOW ---
const DEMO_APPLICANTS = [
  { id: 'a1', name: 'Sunita Rai', place: 'Kathmandu', skills: [{ name: 'Canva', level: 'demonstrated' }, { name: 'Social Media Posts', level: 'self' }], proofs: 2, asks: 55, availability: 'Available now', completed: 0 },
  { id: 'a2', name: 'Prerana Shrestha', place: 'Pokhara', skills: [{ name: 'Photoshop', level: 'institution' }, { name: 'Logo Design', level: 'demonstrated' }], proofs: 4, asks: 70, availability: 'Available from Monday', completed: 1 },
  { id: 'a3', name: 'Anisha Tamang', place: 'Dharan', skills: [{ name: 'Typing / Data Entry', level: 'demonstrated' }, { name: 'Excel / Spreadsheets', level: 'self' }], proofs: 1, asks: 45, availability: 'Available now', completed: 0 },
];
const toDigits = (n, lang) => lang === 'ne' ? String(n).replace(/\d/g, d => '०१२३४५६७८९'[d]) : String(n);
const CL_CARD = "bg-white border border-[#EAE7E1] rounded-[20px] p-5 sm:p-6";
const CL_INPUT = "w-full border border-[#EAE7E1] rounded-[14px] px-4 py-3 text-base min-h-[48px] bg-white outline-none focus:border-[#C73E33]";
const CL_LABEL = "block text-base font-semibold text-[#1C1B1A] mb-2";

function ClientToggle({ label, on, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="w-full flex items-center justify-between gap-4 min-h-[48px] text-left">
      <span className="text-base text-[#1C1B1A] font-medium">{label}</span>
      <span className={`shrink-0 w-12 h-7 rounded-full p-1 flex transition-colors ${on ? 'bg-[#C73E33] justify-end' : 'bg-[#F0EEE9] border border-[#EAE7E1] justify-start'}`}>
        <span className="w-5 h-5 rounded-full bg-white" />
      </span>
    </button>
  );
}

function ClientView({ t, lang, navTo, showToast, clientJobs, setClientJobs, scrollTo }) {
  const digits = (n) => toDigits(n, lang);
  const skillOptions = useMemo(() => [...new Set(DUMMY_JOBS.flatMap(j => j.skillsRequired))], []);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [desc, setDesc] = useState('');
  const [deliverables, setDeliverables] = useState(['', '']);
  const [skills, setSkills] = useState([]);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [revisions, setRevisions] = useState('1');
  const [laptop, setLaptop] = useState(false);
  const [internet, setInternet] = useState('Basic');
  const [meeting, setMeeting] = useState('Flexible — no meetings');
  const [beginners, setBeginners] = useState(true);
  const [error, setError] = useState(false);
  const mineRef = useRef(null);

  useEffect(() => {
    if (scrollTo === 'mine' && mineRef.current) mineRef.current.scrollIntoView({ block: 'start' });
  }, [scrollTo]);

  const submit = () => {
    const dl = deliverables.map(d => d.trim()).filter(Boolean);
    const b = Number(budget);
    const d = Number(deadline);
    if (!title.trim() || dl.length < 1 || skills.length < 1 || !(Math.round(b) >= 1) || !(d >= 1)) { setError(true); return; }
    const r = Number(revisions);
    const job = {
      id: 'c' + Date.now(),
      title: title.trim(),
      category,
      clientName: name.trim() || 'Client (demo)',
      clientCountry: 'Nepal',
      clientType: 'Client (demo)',
      paymentVerified: false,
      beginnerFriendly: beginners,
      description: desc.trim(),
      skillsRequired: skillOptions.filter(x => skills.includes(x)),
      budgetUSD: Math.round(b),
      budgetType: 'fixed',
      postedHoursAgo: 0,
      applicants: 3,
      jobsPostedByClient: 1,
      hireRate: 0,
      memberSince: 2026,
      clientRating: 0,
      aboutClient: 'Posted from the client demo.',
      needsOwnLaptop: laptop,
      internetNeed: internet,
      meetingTimeNepal: meeting.trim() || 'Flexible — no meetings',
      deadlineDays: Math.round(d),
      caution: null,
      deliverables: dl,
      clientProvides: [],
      revisionsIncluded: revisions !== '' && r >= 0 ? Math.floor(r) : 1,
      accepted: null,
    };
    setClientJobs([job, ...clientJobs]);
    setError(false);
    setName(''); setTitle(''); setCategory(ALL_CATEGORIES[0]); setDesc(''); setDeliverables(['', '']); setSkills([]);
    setBudget(''); setDeadline(''); setRevisions('1'); setLaptop(false); setInternet('Basic'); setMeeting('Flexible — no meetings'); setBeginners(true);
    showToast(t('cl_toast_posted'));
    setTimeout(() => { if (mineRef.current) mineRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
        <Info size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
        <p className="text-base text-[#1C1B1A]">{t('cl_demo_note')}</p>
      </div>

      <div className={`${CL_CARD} space-y-5`}>
        <div>
          <label htmlFor="cl-name" className={CL_LABEL}>{t('cl_f_name')}</label>
          <input id="cl-name" type="text" value={name} onChange={e => setName(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="cl-title" className={CL_LABEL}>{t('cl_f_title')}</label>
          <input id="cl-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="cl-cat" className={CL_LABEL}>{t('cl_f_category')}</label>
          <select id="cl-cat" value={category} onChange={e => setCategory(e.target.value)} className={CL_INPUT}>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cl-desc" className={CL_LABEL}>{t('cl_f_desc')}</label>
          <textarea id="cl-desc" rows={4} value={desc} onChange={e => setDesc(e.target.value)} className={CL_INPUT} />
        </div>
      </div>

      <div className={`${CL_CARD} space-y-3`}>
        <div className={CL_LABEL}>{t('cl_f_deliv')}</div>
        {deliverables.map((d, i) => (
          <input key={i} type="text" aria-label={`${t('cl_f_deliv')} ${digits(i + 1)}`} value={d} onChange={e => setDeliverables(prev => prev.map((x, k) => k === i ? e.target.value : x))} className={CL_INPUT} />
        ))}
        {deliverables.length < 5 && (
          <button type="button" onClick={() => setDeliverables(prev => [...prev, ''])} className="min-h-[48px] px-5 rounded-full bg-white border border-[#E3E0D9] text-[#1C1B1A] font-semibold text-base hover:bg-[#F6F4EF] flex items-center gap-2">
            <Plus size={20} /> {t('cl_add_one')}
          </button>
        )}
      </div>

      <div className={CL_CARD}>
        <div className={CL_LABEL}>{t('cl_f_skills')}</div>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map(sk => {
            const on = skills.includes(sk);
            return (
              <button key={sk} type="button" aria-pressed={on} onClick={() => setSkills(prev => prev.includes(sk) ? prev.filter(x => x !== sk) : [...prev, sk])}
                className={`min-h-[44px] px-4 rounded-full border text-base font-medium ${on ? 'bg-[#FAF0EE] border-[#C73E33] text-[#AE332A]' : 'bg-white border-[#EAE7E1] text-[#4A4744] hover:bg-[#F6F4EF]'}`}>
                {sk}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`${CL_CARD} space-y-5`}>
        <div>
          <label htmlFor="cl-budget" className={CL_LABEL}>{t('cl_f_budget')}</label>
          <input id="cl-budget" type="number" inputMode="numeric" min="1" value={budget} onChange={e => setBudget(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="cl-deadline" className={CL_LABEL}>{t('cl_f_deadline')}</label>
          <input id="cl-deadline" type="number" inputMode="numeric" min="1" value={deadline} onChange={e => setDeadline(e.target.value)} className={CL_INPUT} />
        </div>
        <div>
          <label htmlFor="cl-rev" className={CL_LABEL}>{t('cl_f_revisions')}</label>
          <input id="cl-rev" type="number" inputMode="numeric" min="0" value={revisions} onChange={e => setRevisions(e.target.value)} className={CL_INPUT} />
        </div>
      </div>

      <div className={`${CL_CARD} space-y-4`}>
        <h2 className="text-xl font-semibold">{t('cl_req_head')}</h2>
        <ClientToggle label={t('cl_f_laptop')} on={laptop} onChange={setLaptop} />
        <div>
          <label htmlFor="cl-net" className={CL_LABEL}>{t('cl_f_internet')}</label>
          <select id="cl-net" value={internet} onChange={e => setInternet(e.target.value)} className={CL_INPUT}>
            <option value="Basic">Basic</option>
            <option value="Good">Good</option>
          </select>
        </div>
        <div>
          <label htmlFor="cl-meet" className={CL_LABEL}>{t('cl_f_meeting')}</label>
          <input id="cl-meet" type="text" value={meeting} onChange={e => setMeeting(e.target.value)} className={CL_INPUT} />
        </div>
        <ClientToggle label={t('cl_f_beginners')} on={beginners} onChange={setBeginners} />
      </div>

      {error && (
        <div role="alert" className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[14px] p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
          <p className="text-base text-[#1C1B1A]">{t('cl_error')}</p>
        </div>
      )}
      <button type="button" onClick={submit} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
        {t('cl_submit')}
      </button>

      <div ref={mineRef} className="pt-4 scroll-mt-24">
        <h2 className="text-[22px] font-semibold mb-4">{t('cl_my_jobs')}</h2>
        {clientJobs.length === 0 ? (
          <p className="text-base text-[#4A4744]">{t('cl_none')}</p>
        ) : (
          <div className="space-y-4">
            {clientJobs.map(j => (
              <div key={j.id} className={CL_CARD}>
                <div className="font-semibold text-xl mb-1 break-words">{j.title}</div>
                <div className="text-base text-[#4A4744] mb-4">{j.clientName} · ${fmtMoney(j.budgetUSD)} (NPR {fmtMoney(j.budgetUSD * 133)}) · {fmt(t('wr_days'), { days: digits(j.deadlineDays) })}</div>
                {j.accepted && (
                  <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[14px] p-4 mb-4 space-y-2">
                    <div className="flex items-start gap-2 text-base font-semibold text-[#1C1B1A]"><CheckCircle2 size={20} className="shrink-0 mt-0.5 text-[#C73E33]" /> <span>{fmt(t('ag_made'), { name: j.accepted.applicantName })}</span></div>
                    <p className="text-base text-[#4A4744]">{t('ag_full_product')}</p>
                  </div>
                )}
                <button onClick={() => navTo('client-applicants', { id: j.id })} className="w-full sm:w-auto bg-[#C73E33] text-white px-6 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">
                  {t('cl_view_applicants')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClientApplicants({ t, lang, navTo, job }) {
  const digits = (n) => toDigits(n, lang);
  const back = (
    <button onClick={() => navTo('client', { scrollTo: 'mine' })} className="flex items-center gap-2 text-base text-[#4A4744] mb-6 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
      <ChevronLeft size={20} /> {t('back')}
    </button>
  );
  if (!job) return <div className="max-w-2xl mx-auto">{back}<p className="text-base text-[#4A4744]">{t('cl_none')}</p></div>;
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        {back}
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-1">{t('cl_applicants')}</h1>
        <div className="text-lg font-semibold text-[#1C1B1A] break-words">{job.title}</div>
        <p className="text-base text-[#4A4744] mt-1">{t('cl_demo_applicants')}</p>
      </div>
      {job.accepted && (
        <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
          <CheckCircle2 size={22} className="shrink-0 mt-0.5 text-[#C73E33]" />
          <p className="text-base font-semibold text-[#1C1B1A]">{fmt(t('ag_made'), { name: job.accepted.applicantName })}</p>
        </div>
      )}
      {DEMO_APPLICANTS.map(a => (
        <div key={a.id} className={CL_CARD}>
          <div className="font-semibold text-xl break-words">{a.name}</div>
          <div className="text-base text-[#4A4744] flex items-center gap-1.5 mb-4"><MapPin size={18} className="text-[#8A8580]" /> {a.place}</div>
          <ul className="space-y-1 mb-3 text-base text-[#1C1B1A]">
            {a.skills.map(sk => (
              <li key={sk.name}><strong>{sk.name}</strong> — {t('pp_lvl_' + sk.level)}</li>
            ))}
          </ul>
          <div className="text-sm text-[#6E6963] mb-4">{fmt(t('pr_count'), { n: digits(a.proofs) })}</div>
          <dl className="space-y-3 mb-5">
            <div><dt className="text-sm text-[#6E6963]">{t('cl_asks')}</dt><dd className="text-base font-semibold text-[#1C1B1A]">${fmtMoney(a.asks)} (NPR {fmtMoney(a.asks * 133)})</dd></div>
            <div><dt className="text-sm text-[#6E6963]">{t('cl_availability')}</dt><dd className="text-base text-[#1C1B1A]">{a.availability}</dd></div>
            <div><dt className="text-sm text-[#6E6963]">{t('cl_completed')}</dt><dd className="text-base text-[#1C1B1A]">{digits(a.completed)}</dd></div>
          </dl>
          {!job.accepted && (
            <button onClick={() => navTo('client-agreement', { id: job.id, applicantId: a.id })} className="w-full bg-[#C73E33] text-white py-3 rounded-full font-semibold text-base hover:bg-[#AE332A] min-h-[48px]">
              {t('cl_accept')}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function ClientAgreement({ t, lang, navTo, job, applicant, onConfirm }) {
  const digits = (n) => toDigits(n, lang);
  if (!job || !applicant) return null;
  const milestones = buildWorkroomMilestones({ id: job.id, title: job.title, deliverables: job.deliverables, budgetUSD: applicant.asks });
  const labelCls = "text-sm text-[#6E6963]";
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <button onClick={() => navTo('client-applicants', { id: job.id })} className="flex items-center gap-2 text-base text-[#4A4744] mb-6 hover:text-[#1C1B1A] min-h-[48px] px-2 -ml-2 font-medium">
          <ChevronLeft size={20} /> {t('back')}
        </button>
        <h1 className="text-[28px] sm:text-[30px] font-semibold mb-1">{t('ag_title')}</h1>
        <p className="text-base text-[#4A4744] break-words">{fmt(t('ag_parties'), { client: job.clientName, name: applicant.name })}</p>
      </div>

      <div className={`${CL_CARD} space-y-4`}>
        <div className="text-lg font-semibold text-[#1C1B1A] break-words">{job.title}</div>
        <div>
          <div className={labelCls}>{t('wr_deliver')}</div>
          <ul className="list-disc pl-5 text-base text-[#1C1B1A] space-y-1">
            {job.deliverables.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
        <div><div className={labelCls}>{t('ag_price')}</div><div className="text-base font-semibold text-[#1C1B1A]">${fmtMoney(applicant.asks)} (NPR {fmtMoney(applicant.asks * 133)})</div></div>
        <div><div className={labelCls}>{t('wr_deadline')}</div><div className="text-base text-[#1C1B1A]">{fmt(t('wr_days'), { days: digits(job.deadlineDays) })}</div></div>
        <div><div className={labelCls}>{t('ag_revisions')}</div><div className="text-base text-[#1C1B1A]">{digits(job.revisionsIncluded ?? 1)}</div></div>
      </div>

      <div className={CL_CARD}>
        <h2 className="text-xl font-semibold mb-4">{t('wr_milestones')}</h2>
        <div className="space-y-3">
          {milestones.map(m => (
            <div key={m.id} className="border border-[#EAE7E1] rounded-[14px] p-4">
              <div className="text-base font-semibold text-[#1C1B1A] break-words">{m.title}</div>
              <div className="text-sm text-[#6E6963]">${fmtMoney(m.amountUSD)} · NPR {fmtMoney(m.amountUSD * 133)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FAF0EE] border border-[#F3E1DD] rounded-[20px] p-4 flex items-start gap-3">
        <Info size={20} className="shrink-0 mt-0.5 text-[#AE332A]" />
        <p className="text-base text-[#1C1B1A]">{t('wr_sim_note')}</p>
      </div>
      <Disclaimer t={t} k="disc_agree" />
      <button onClick={() => onConfirm(job.id, applicant)} className="w-full bg-[#C73E33] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#AE332A] min-h-[52px]">
        {t('ag_confirm')}
      </button>
    </div>
  );
}
