import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Settings, Copy, Check, RefreshCw, Sparkles, FileStack, Search,
  Trash2, Pencil, X, Plus, Clock, ChevronDown, ChevronRight,
  Save, ClipboardList, History as HistoryIcon, Send, AlertCircle,
  Sun, Moon, HeartHandshake, GraduationCap, ExternalLink, BookOpen
} from "lucide-react";

/* =========================================================================
   SPLASH SCREEN — shown on first load / hard refresh, cycles quotes
   ========================================================================= */

const SPLASH_QUOTES = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { text: "He who conquers others is strong; he who conquers himself is mighty.", author: "Lao Tzu" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.", author: "Charles Darwin" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Courage is resistance to fear, mastery of fear — not absence of fear.", author: "Mark Twain" },
  { text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell" },
  { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
  { text: "Leadership and learning are indispensable to each other.", author: "John F. Kennedy" },
  { text: "If your actions inspire others to dream more, learn more, do more and become more, you are a leader.", author: "John Quincy Adams" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Know thyself.", author: "Socrates" },
  { text: "Fortune favors the bold.", author: "Julius Caesar" },
  { text: "Well begun is half done.", author: "Aristotle" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Dream big and dare to fail.", author: "Norman Vincent Peale" },
];

function SplashScreen({ exiting }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * SPLASH_QUOTES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % SPLASH_QUOTES.length);
        setVisible(true);
      }, 380);
    }, 3400);
    return () => clearInterval(cycle);
  }, []);

  const quote = SPLASH_QUOTES[index];

  return (
    <div className={`cx-splash${exiting ? " cx-splash-exit" : ""}`}>
      <div className="cx-splash-glow" />
      <div className="cx-splash-mark">
        <HeartHandshake size={26} />
      </div>
      <div className="cx-splash-brand">Z-Client</div>
      <div className={`cx-splash-quote${visible ? " cx-splash-quote-in" : ""}`}>
        <p className="cx-splash-quote-text">&ldquo;{quote.text}&rdquo;</p>
        <p className="cx-splash-quote-author">— {quote.author}</p>
      </div>
      <div className="cx-splash-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

/* =========================================================================
   CONSTANTS
   ========================================================================= */

const SITUATIONS = [
  "General Update", "Backend Investigation", "Delay", "Follow-up",
  "Request for Information", "Request for Screenshot", "Request for Screen Recording",
  "Request for EML File", "Request for Error Logs", "Request for Import Details",
  "Request for Availability", "Callback Request", "Escalation", "Issue Resolved",
  "Issue Still Under Investigation", "Unable to Reproduce",
  "Additional Troubleshooting Required", "Incorrect Information / Clarification",
  "Access Required", "Other"
];

const TONES = ["Professional", "Polite & Simple", "Short & Direct", "Empathetic", "Friendly", "Formal"];

const CATEGORIES = ["Apology", "Backend Update", "Follow-up", "Information Request", "Troubleshooting", "Callback", "Escalation", "Resolution", "Other"];

const QUICK_KEYWORDS = [
  "Apology", "Backend Checking", "Follow-up", "Screenshot", "Screen Recording",
  "EML", "Error Log", "Callback", "Escalation", "Resolution", "Customer Frustrated", "Update Soon"
];

const ZOHO_PRODUCTS = ["Zoho CRM", "Zoho Desk", "Zoho People", "Zoho Payroll", "Zoho Campaigns",
  "Zoho Marketing Automation", "Zoho Books", "Zoho Inventory", "Zoho Analytics", "Zoho Projects",
  "Zoho Social", "Zoho Sign", "Zoho Cliq", "Zoho SalesIQ", "Zoho One"];

const DEFAULT_TEMPLATES = [
  {
    id: "dt_1",
    name: "Backend Investigation – Delay Apology",
    category: "Apology",
    content: "We understand you are waiting for news on this, and we apologize for the delay.\n\nWe are currently checking this issue with our backend engineering team. They are actively investigating the underlying cause, and we will update you as soon as we receive further details.\n\nWe appreciate your continued patience and understanding.",
    createdAt: 1700000000000,
  },
  {
    id: "dt_2",
    name: "Request for Error Screenshots",
    category: "Information Request",
    content: "Thank you for reaching out to us regarding this issue.\n\nCould you please share a full-screen screenshot showing the error, ensuring the browser URL bar is clearly visible? This will help our team pinpoint the exact page and state where the issue occurs.\n\nOnce we have this information, we will investigate further right away.",
    createdAt: 1700000000001,
  },
  {
    id: "dt_3",
    name: "Request for EML & Error Logs",
    category: "Information Request",
    content: "To help us investigate this email delivery issue, could you please export and share the EML file of the affected email along with any relevant error logs?\n\nThis will allow our team to inspect the full email headers and trace the exact failure reason.\n\nThank you for your assistance with this.",
    createdAt: 1700000000002,
  },
  {
    id: "dt_4",
    name: "Escalation to Engineering Team",
    category: "Escalation",
    content: "We wanted to let you know that your case has been escalated to our senior engineering team for an in-depth review.\n\nWe are monitoring the progress closely and will share an update with you as soon as the team provides feedback.\n\nThank you for your patience as we work through this for you.",
    createdAt: 1700000000003,
  },
  {
    id: "dt_5",
    name: "Issue Resolved Confirmation",
    category: "Resolution",
    content: "Great news — the issue you reported has now been resolved on our end.\n\nCould you please test this on your side and confirm if everything is working as expected?\n\nIf you experience any further trouble, please let us know and we will be glad to assist.",
    createdAt: 1700000000004,
  },
];

// Official Zoho help-portal index, grouped the way Jr SME presents them in the app selector.
// Used both to scope/ground the AI's search and to show a direct link when live lookup isn't available.
const ZOHO_HELP_CATEGORIES = {
  "Sales & CRM": [
    { name: "Zoho CRM", url: "https://help.zoho.com/portal/en/kb/crm" },
    { name: "Zoho Bigin", url: "https://help.zoho.com/portal/en/kb/bigin" },
    { name: "Zoho SalesIQ", url: "https://help.zoho.com/portal/en/kb/salesiq" },
    { name: "Zoho Bookings", url: "https://help.zoho.com/portal/en/kb/bookings" },
    { name: "Zoho Sign", url: "https://help.zoho.com/portal/en/kb/sign" },
    { name: "Zoho Forms", url: "https://help.zoho.com/portal/en/kb/forms" },
  ],
  "Marketing": [
    { name: "Zoho Campaigns", url: "https://help.zoho.com/portal/en/kb/campaigns" },
    { name: "Zoho Marketing Automation", url: "https://help.zoho.com/portal/en/kb/marketing-automation" },
    { name: "Zoho Social", url: "https://help.zoho.com/portal/en/kb/social" },
    { name: "Zoho Survey", url: "https://help.zoho.com/portal/en/kb/survey" },
    { name: "Zoho Sites", url: "https://help.zoho.com/portal/en/kb/sites" },
    { name: "Zoho Backstage", url: "https://help.zoho.com/portal/en/kb/backstage" },
  ],
  "Finance": [
    { name: "Zoho Books", url: "https://help.zoho.com/portal/en/kb/books" },
    { name: "Zoho Expense", url: "https://help.zoho.com/portal/en/kb/expense" },
    { name: "Zoho Inventory", url: "https://help.zoho.com/portal/en/kb/inventory" },
    { name: "Zoho Billing", url: "https://help.zoho.com/portal/en/kb/billing" },
    { name: "Zoho Invoice", url: "https://help.zoho.com/portal/en/kb/invoice" },
    { name: "Zoho Subscriptions", url: "https://help.zoho.com/portal/en/kb/subscriptions" },
    { name: "Zoho Checkout", url: "https://help.zoho.com/portal/en/kb/checkout" },
    { name: "Zoho Commerce", url: "https://help.zoho.com/portal/en/kb/commerce" },
  ],
  "Customer Support": [
    { name: "Zoho Desk", url: "https://help.zoho.com/portal/en/kb/desk" },
    { name: "Zoho Assist", url: "https://help.zoho.com/portal/en/kb/assist" },
    { name: "Zoho Lens", url: "https://help.zoho.com/portal/en/kb/lens" },
    { name: "Zoho FSM", url: "https://help.zoho.com/portal/en/kb/fsm" },
    { name: "Zoho Voice", url: "https://help.zoho.com/portal/en/kb/voice" },
    { name: "Zoho TeamInbox", url: "https://help.zoho.com/portal/en/kb/teaminbox" },
  ],
  "HR": [
    { name: "Zoho People", url: "https://help.zoho.com/portal/en/kb/people" },
    { name: "Zoho Recruit", url: "https://help.zoho.com/portal/en/kb/recruit" },
    { name: "Zoho Payroll", url: "https://help.zoho.com/portal/en/kb/payroll" },
    { name: "Zoho Learn", url: "https://help.zoho.com/portal/en/kb/learn" },
    { name: "Zoho Thrive", url: "https://help.zoho.com/portal/en/kb/thrive" },
  ],
  "Collaboration & Productivity": [
    { name: "Zoho Mail", url: "https://help.zoho.com/portal/en/kb/mail" },
    { name: "Zoho Cliq", url: "https://help.zoho.com/portal/en/kb/cliq" },
    { name: "Zoho WorkDrive", url: "https://help.zoho.com/portal/en/kb/workdrive" },
    { name: "Zoho Meeting", url: "https://help.zoho.com/portal/en/kb/meeting" },
    { name: "Zoho Calendar", url: "https://help.zoho.com/portal/en/kb/calendar" },
    { name: "Zoho Writer", url: "https://help.zoho.com/portal/en/kb/writer" },
    { name: "Zoho Sheet", url: "https://help.zoho.com/portal/en/kb/sheet" },
    { name: "Zoho Show", url: "https://help.zoho.com/portal/en/kb/show" },
    { name: "Zoho Notebook", url: "https://help.zoho.com/portal/en/kb/notebook" },
    { name: "Zoho Connect", url: "https://help.zoho.com/portal/en/kb/connect" },
  ],
  "Project & Process Management": [
    { name: "Zoho Projects", url: "https://help.zoho.com/portal/en/kb/projects" },
    { name: "Zoho Sprints", url: "https://help.zoho.com/portal/en/kb/sprints" },
    { name: "Zoho Qntrl", url: "https://help.zoho.com/portal/en/kb/qntrl" },
    { name: "Zoho Creator", url: "https://help.zoho.com/portal/en/kb/creator" },
    { name: "Zoho Flow", url: "https://help.zoho.com/portal/en/kb/flow" },
    { name: "Zoho DataPrep", url: "https://help.zoho.com/portal/en/kb/dataprep" },
  ],
  "Analytics & BI": [
    { name: "Zoho Analytics", url: "https://help.zoho.com/portal/en/kb/analytics" },
  ],
  "Security & IT": [
    { name: "Zoho Vault", url: "https://help.zoho.com/portal/en/kb/vault" },
    { name: "Zoho OneAuth", url: "https://help.zoho.com/portal/en/kb/oneauth" },
    { name: "Zoho Directory", url: "https://help.zoho.com/portal/en/kb/directory" },
    { name: "Zoho RPA", url: "https://help.zoho.com/portal/en/kb/rpa" },
    { name: "Zoho Catalyst", url: "https://help.zoho.com/portal/en/kb/catalyst" },
  ],
  "Other Zoho Apps": [
    { name: "Zoho Contracts", url: "https://help.zoho.com/portal/en/kb/contracts" },
    { name: "Zoho Office Suite", url: "https://help.zoho.com/portal/en/kb/office-suite" },
  ],
  "Zoho One": [
    { name: "Zoho One", url: "https://help.zoho.com/portal/en/kb/one" },
    { name: "Zoho One Admin Guide", url: "https://help.zoho.com/portal/en/kb/one/admin-guide" },
  ],
};

const ZOHO_APP_LOOKUP = Object.values(ZOHO_HELP_CATEGORIES).flat().reduce((acc, a) => {
  acc[a.name] = a.url;
  return acc;
}, {});

const KEYWORD_MAP = [
  { key: "Backend Investigation", terms: ["backend checking", "backend team checking", "concerned team checking", "concern team checking", "sme checking", "waiting for backend", "checking internally", "escalated to backend", "backend update"] },
  { key: "Delay", terms: ["delay", "late response", "apologi", "sorry for delay", "delayed update", "pending update"] },
  { key: "Request for Screenshot", terms: ["screenshot", "capture", "error screenshot"] },
  { key: "Request for Screen Recording", terms: ["screen recording", "screen record", "recording", "record the issue"] },
  { key: "Request for EML File", terms: ["eml", "email file", "affected email"] },
  { key: "Request for Error Logs", terms: ["error log", "error logs", "log file", "error details"] },
  { key: "Request for Import Details", terms: ["import id", "imported file", "field mapping", "sample record", "import detail"] },
  { key: "Request for Availability", terms: ["available slot", "availability", "preferred time", "time slot"] },
  { key: "Callback Request", terms: ["callback", "call back", "arrange a call"] },
  { key: "Follow-up", terms: ["follow up", "follow-up", "no update from customer", "checking in", "haven't heard"] },
  { key: "Escalation", terms: ["escalat"] },
  { key: "Issue Resolved", terms: ["resolved", "fixed now", "issue is fixed", "closing the ticket"] },
  { key: "Issue Still Under Investigation", terms: ["still checking", "still investigating", "still looking into", "under investigation"] },
  { key: "Unable to Reproduce", terms: ["unable to reproduce", "could not reproduce", "not able to replicate"] },
  { key: "Access Required", terms: ["support access", "remote access", "grant access"] },
  { key: "Incorrect Information / Clarification", terms: ["incorrect information", "clarif", "misunderstanding"] },
];

const FRUSTRATION_TERMS = ["frustrat", "angry", "upset", "unhappy", "disappointed", "repeatedly", "again and again", "multiple times", "no response", "still waiting", "third time"];
const PRIORITY_TERMS = ["high priority", "urgent", "critical", "top priority"];
const DEBUG_TERMS = ["debug access", "debug mode", "developer access"];

const CAT_FOR_SITUATION = {
  "General Update": "Other", "Backend Investigation": "Backend Update", "Delay": "Apology",
  "Follow-up": "Follow-up", "Request for Information": "Information Request",
  "Request for Screenshot": "Information Request", "Request for Screen Recording": "Information Request",
  "Request for EML File": "Information Request", "Request for Error Logs": "Information Request",
  "Request for Import Details": "Information Request", "Request for Availability": "Callback",
  "Callback Request": "Callback", "Escalation": "Escalation", "Issue Resolved": "Resolution",
  "Issue Still Under Investigation": "Backend Update", "Unable to Reproduce": "Troubleshooting",
  "Additional Troubleshooting Required": "Troubleshooting", "Incorrect Information / Clarification": "Other",
  "Access Required": "Information Request", "Other": "Other"
};

/* =========================================================================
   TEMPLATE ENGINE (fallback / offline generation)
   ========================================================================= */

// Tone-flavoured connective phrases, organised by role rather than by full sentence,
// so bodies stay situation-specific while openers/closers carry the tone.
const OPENERS = {
  update:     { Professional: ["Thank you for your patience while we look into this.", "We wanted to share a quick update on where things stand."], "Polite & Simple": ["Thanks for waiting on this.", "Here's a quick update."], "Short & Direct": ["Quick update on this.", "Here's where things stand."], Empathetic: ["We know waiting on this hasn't been easy, and we appreciate your patience.", "We understand you're hoping for news on this, so here's where we stand."], Friendly: ["Thanks so much for hanging in there with us!", "Wanted to pop in with a quick update."], Formal: ["We are writing to provide an update regarding your request.", "Please find below an update on the matter you raised."] },
  request:    { Professional: ["Thank you for reaching out to us regarding this.", "We'd like to get this resolved for you as quickly as possible."], "Polite & Simple": ["Thanks for letting us know about this.", "We'd like to help sort this out quickly."], "Short & Direct": ["To move this forward,", "One thing we'll need from you:"], Empathetic: ["We understand how important it is to get this sorted, and we're happy to help.", "We appreciate you bringing this to us so we can get it resolved."], Friendly: ["Thanks for flagging this!", "Happy to help get this sorted."], Formal: ["We refer to your recent request and would like to proceed with the investigation.", "In order to assist you further, we require the following."] },
  resolution: { Professional: ["Thank you for your patience while we worked through this.", "We'd like to share an update on the issue you reported."], "Polite & Simple": ["Good news on this one.", "Here's an update on your issue."], "Short & Direct": ["Update: this has been addressed.", "This should now be resolved."], Empathetic: ["Thank you for bearing with us while we worked this through.", "We appreciate your patience throughout this process."], Friendly: ["Good news — we've got an update for you!", "Great news on this one!"], Formal: ["We are pleased to inform you of the following update.", "We wish to confirm the status of the matter you raised."] },
  followup:   { Professional: ["We wanted to follow up regarding this request.", "We're following up as we haven't heard back from you yet."], "Polite & Simple": ["Just checking in on this.", "Wanted to follow up on this one."], "Short & Direct": ["Following up on this.", "Checking in — any update from your end?"], Empathetic: ["We wanted to check in, as we understand this is important to you.", "We haven't heard back yet and wanted to make sure this doesn't fall through the cracks."], Friendly: ["Just circling back on this!", "Wanted to check in on this one."], Formal: ["We are following up in relation to the matter referenced below.", "This is a follow-up regarding your outstanding request."] },
  escalation: { Professional: ["We wanted to update you on the status of your concern.", "Thank you for your patience as we work through this."], "Polite & Simple": ["Here's an update on where this stands.", "Wanted to let you know what's happening on our end."], "Short & Direct": ["Status update:", "Here's where things stand."], Empathetic: ["We know this has taken longer than you'd like, and we appreciate your patience.", "We understand this is important, so we wanted to keep you informed."], Friendly: ["Wanted to keep you posted on this!", "Here's the latest on your case."], Formal: ["We are writing to inform you of the current status of your concern.", "Please be advised of the following regarding your escalated request."] },
  general:    { Professional: ["Thank you for contacting us.", "We appreciate you reaching out."], "Polite & Simple": ["Thanks for reaching out.", "Thanks for getting in touch."], "Short & Direct": ["Thanks for the note.", "Got your message."], Empathetic: ["Thank you for reaching out, and we're happy to help.", "We appreciate you taking the time to share this with us."], Friendly: ["Thanks for reaching out!", "Great to hear from you."], Formal: ["We acknowledge receipt of your message.", "Thank you for your correspondence."] },
};

const CLOSERS = {
  update:     { Professional: ["We appreciate your patience and understanding.", "We'll keep you posted as soon as we know more."], "Polite & Simple": ["Thanks again for your patience.", "We'll let you know as soon as we hear more."], "Short & Direct": ["We'll update you shortly.", ""], Empathetic: ["Thank you again for your patience — we know the wait isn't easy.", "We're keeping a close eye on this and will update you as soon as we can."], Friendly: ["Thanks again for bearing with us!", "We'll be in touch again soon!"], Formal: ["We thank you for your continued patience in this matter.", "We shall revert with further details in due course."] },
  request:    { Professional: ["This will help us investigate the issue further.", "Once we receive this, we'll take a closer look right away."], "Polite & Simple": ["This will help us look into it faster.", "Once we have this, we'll get right on it."], "Short & Direct": ["This will help us dig in.", ""], Empathetic: ["This will really help us get to the bottom of things for you.", "We know this is an extra step, and we appreciate your help with it."], Friendly: ["This'll help us get to the bottom of it!", "Appreciate the help with this!"], Formal: ["This information will enable us to proceed with our investigation.", "Kindly share the same at your earliest convenience."] },
  resolution: { Professional: ["Please let us know if you notice anything unusual going forward.", "Do reach out if you run into any further issues."], "Polite & Simple": ["Let us know if anything comes up again.", "Feel free to reach out if you need anything else."], "Short & Direct": ["Let us know if it happens again.", ""], Empathetic: ["Please don't hesitate to reach back out if anything still feels off.", "We're glad this is sorted, and we're here if anything else comes up."], Friendly: ["Let us know if you need anything else!", "Here if you need anything else!"], Formal: ["Please do not hesitate to contact us should the issue recur.", "We remain available should any further assistance be required."] },
  followup:   { Professional: ["Please let us know if you're able to share this at your convenience.", "We look forward to hearing from you."], "Polite & Simple": ["Let us know whenever you get a chance.", "Whenever you're able to, that'd be great."], "Short & Direct": ["Let us know when you can.", ""], Empathetic: ["No rush at all — just wanted to check in.", "Take your time, we just wanted to make sure this wasn't forgotten."], Friendly: ["Whenever works for you!", "No worries if it's been busy — just checking in!"], Formal: ["We would appreciate a response at your earliest convenience.", "We look forward to your reply in due course."] },
  escalation: { Professional: ["We will update you as soon as we hear back from the team.", "We appreciate your patience while this is being investigated further."], "Polite & Simple": ["We'll keep you posted.", "We'll let you know as soon as we have news."], "Short & Direct": ["We'll follow up once we hear back.", ""], Empathetic: ["We understand the urgency and won't lose sight of it.", "We're staying on top of this and will update you as soon as possible."], Friendly: ["We'll keep you in the loop!", "More updates coming your way soon!"], Formal: ["We shall provide a further update upon receipt of information from the relevant team.", "We appreciate your continued patience while this is being addressed."] },
  general:    { Professional: ["Please let us know if you have any other questions.", "We're happy to help with anything else you need."], "Polite & Simple": ["Let us know if you need anything else.", "Happy to help further if needed."], "Short & Direct": ["Let us know if you need more help.", ""], Empathetic: ["We're here if you need anything else at all.", "Please reach out anytime — we're happy to help."], Friendly: ["Let us know if there's anything else!", "Here if you need us!"], Formal: ["Please do not hesitate to contact us for any further assistance.", "We remain at your disposal for any additional queries."] },
};

function pick(arr, i) { return arr && arr.length ? arr[i % arr.length] : ""; }

function extractContext(input) {
  const lower = input.toLowerCase();
  const frustrated = FRUSTRATION_TERMS.some(t => lower.includes(t));
  const priority = PRIORITY_TERMS.some(t => lower.includes(t));
  const debugAccess = DEBUG_TERMS.some(t => lower.includes(t));
  const durationMatch = input.match(/(\d+)\s*(day|days|hour|hours|week|weeks)/i);
  const duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : null;
  const products = ZOHO_PRODUCTS.filter(p => lower.includes(p.toLowerCase()));
  const urlBar = /url bar/i.test(input);
  return { frustrated, priority, debugAccess, duration, products, urlBar, raw: input };
}

function detectSituation(input) {
  const lower = input.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.terms.some(t => lower.includes(t))) return entry.key;
  }
  return "General Update";
}

function productClause(ctx) {
  return ctx.products.length ? ` in ${ctx.products.join(" and ")}` : "";
}

// Body content per situation: array of functions(ctx, variantIndex) -> sentence(s)
const BODIES = {
  "Backend Investigation": [
    ctx => `We are currently checking this with our concerned backend team${productClause(ctx)} and will share an update with you as soon as we receive further information.`,
    ctx => `Our backend team is currently looking into this${productClause(ctx)}, and we'll update you as soon as we have more details.`,
    ctx => `This has been shared with our concerned team for a closer look${productClause(ctx)}, and we'll come back to you with an update shortly.`,
  ],
  "Delay": [
    ctx => `We apologize for the delay in getting back to you${ctx.duration ? ` over the past ${ctx.duration}` : ""}. We are currently checking this with our concerned team and will share an update as soon as we receive further information.`,
    ctx => `We're sorry this has taken longer than expected${ctx.duration ? ` (${ctx.duration} now)` : ""}. Our team is actively looking into it, and we'll update you shortly.`,
    ctx => `Apologies for the delay here. We're following up with the relevant team and will share the next update as soon as it's available.`,
  ],
  "Follow-up": [
    () => `We haven't heard back from you on this yet, so we wanted to check in. Please let us know if you're still facing this issue or if you're able to share the requested details.`,
    () => `We're still waiting on a response from our end on this one and wanted to make sure it hasn't been missed. We'll share an update as soon as we hear back from the concerned team.`,
    () => `We wanted to check whether you had a chance to look into our previous message. Do let us know if you need anything from us in the meantime.`,
  ],
  "Request for Information": [
    () => `Could you help us with a few more details about the issue you're facing? This will help us understand the situation better and investigate further.`,
    () => `To look into this properly, could you share a bit more information about when this happens and what you were doing at the time?`,
  ],
  "Request for Screenshot": [
    ctx => `Could you please share a screenshot showing the error or issue${ctx.urlBar ? ", making sure the browser's URL bar is visible in the image" : ""}? This will help us understand exactly what you're seeing.`,
    ctx => `It would help us a lot if you could send over a screenshot of the error${ctx.urlBar ? ", with the URL bar included so we can confirm the exact page" : ""}.`,
  ],
  "Request for Screen Recording": [
    () => `Could you share a short screen recording showing the issue as it happens, with the complete browser window and URL bar visible? This will help us pinpoint exactly where things are going wrong.`,
    () => `A brief screen recording of the issue, including the full browser window and address bar, would really help us investigate this further.`,
  ],
  "Request for EML File": [
    () => `Could you share the EML file of the affected email? This will let our team examine the message headers and content in detail to investigate the issue.`,
    () => `To look into this further, could you export and send us the EML file for the email in question?`,
  ],
  "Request for Error Logs": [
    () => `Could you share the error logs or the exact error message you're seeing? This will help our team narrow down what's causing the issue.`,
    () => `It would help if you could send over the relevant error details or logs from your end so we can investigate the root cause.`,
  ],
  "Request for Import Details": [
    () => `Could you share the Import ID along with the file you tried to import, a screenshot of the field mapping, and the exact error message you received? A few sample records would also help us investigate this faster.`,
    () => `To look into the import issue, could you send us the Import ID, the imported file, and a screenshot of the field mapping along with the error shown?`,
  ],
  "Request for Availability": [
    () => `Could you please share your preferred time slots for a call? We'll coordinate accordingly and arrange this based on your availability.`,
    () => `Let us know a few time slots that work for you, and we'll set up a call around your availability.`,
  ],
  "Callback Request": [
    () => `Could you share a few convenient time slots for us to call you back? We'll make sure to reach out within that window.`,
    () => `Please let us know your preferred time for a callback, and we'll arrange for our team to get in touch accordingly.`,
  ],
  "Escalation": [
    () => `We've escalated this to our concerned team for further investigation. While we can't share an exact timeline just yet, we'll keep you updated as soon as we hear back.`,
    () => `This has been raised with the relevant team for a closer look. We'll follow up with you as soon as we have more information.`,
  ],
  "Issue Resolved": [
    () => `The issue you reported has now been addressed on our end. Could you please check on your side and confirm everything looks good?`,
    () => `We've made the necessary fix for this. Could you take a moment to verify and let us know if it's working as expected now?`,
  ],
  "Issue Still Under Investigation": [
    () => `We're still looking into this with our concerned team and don't have a resolution just yet. We'll update you as soon as we have more information.`,
    () => `This is still with our team for investigation. We'll be sure to follow up the moment we have something concrete to share.`,
  ],
  "Unable to Reproduce": [
    () => `We tried reproducing this on our end but weren't able to see the same behaviour. Could you share a few more details, such as the exact steps and a screenshot or recording, so we can take another look?`,
  ],
  "Additional Troubleshooting Required": [
    () => `We've gone through the initial checks, and a bit more troubleshooting is needed to get to the bottom of this. Could you help us with the additional details requested above so we can proceed?`,
  ],
  "Incorrect Information / Clarification": [
    () => `We'd like to clarify a detail from our previous message to make sure we're on the same page before proceeding further.`,
  ],
  "Access Required": [
    () => `Could you please enable support access on your account so our team can take a closer look? ${""}`.trim(),
  ],
  "General Update": [
    () => `We wanted to share a quick update on your request. Our team is looking into this, and we'll follow up shortly with more information.`,
    () => `Thank you for reaching out. We're currently reviewing this and will get back to you with an update soon.`,
  ],
  "Other": [
    () => `Thank you for reaching out to us. We're looking into this and will follow up with you shortly.`,
  ],
};

const SITUATION_CATEGORY_ROLE = {
  "Backend Investigation": "update", "Delay": "update", "Follow-up": "followup",
  "Request for Information": "request", "Request for Screenshot": "request",
  "Request for Screen Recording": "request", "Request for EML File": "request",
  "Request for Error Logs": "request", "Request for Import Details": "request",
  "Request for Availability": "request", "Callback Request": "request",
  "Escalation": "escalation", "Issue Resolved": "resolution",
  "Issue Still Under Investigation": "update", "Unable to Reproduce": "request",
  "Additional Troubleshooting Required": "request", "Incorrect Information / Clarification": "general",
  "Access Required": "request", "General Update": "general", "Other": "general",
};

function frustrationClause(tone) {
  const map = {
    Professional: "We understand this has taken longer than expected, and we're sorry for the inconvenience caused. ",
    "Polite & Simple": "We're sorry this has been frustrating, and we understand the inconvenience. ",
    "Short & Direct": "Sorry for the trouble this has caused. ",
    Empathetic: "We completely understand how frustrating this must be, and we're truly sorry for the inconvenience. ",
    Friendly: "We totally get how annoying this must be, and we're sorry for the hassle! ",
    Formal: "We regret the inconvenience this has caused you and understand your concern. ",
  };
  return map[tone] || map.Professional;
}

function priorityClause(tone) {
  const map = {
    Professional: "We've noted this as high priority and are treating it accordingly. ",
    "Polite & Simple": "We've marked this as high priority on our end. ",
    "Short & Direct": "This is marked high priority. ",
    Empathetic: "We understand this is urgent for you and have flagged it as high priority. ",
    Friendly: "We've flagged this as high priority so it gets extra attention! ",
    Formal: "This matter has been recorded as high priority and is being handled accordingly. ",
  };
  return map[tone] || map.Professional;
}

function generateTemplateResponses(rawInput, situationChoice, tone, count) {
  const ctx = extractContext(rawInput);
  const situation = (!situationChoice || situationChoice === "Other" || situationChoice === "General Update")
    ? detectSituation(rawInput)
    : situationChoice;
  const role = SITUATION_CATEGORY_ROLE[situation] || "general";
  const bodyBank = BODIES[situation] || BODIES["Other"];
  const openerBank = OPENERS[role][tone] || OPENERS[role].Professional;
  const closerBank = CLOSERS[role][tone] || CLOSERS[role].Professional;

  const results = [];
  for (let i = 0; i < count; i++) {
    // Paragraph 1: short opening line (email-style greeting/acknowledgement)
    const openingPara = pick(openerBank, i).trim();

    // Paragraph 2: the main explanation, with any frustration/priority acknowledgement folded in
    let bodyPara = "";
    if (ctx.frustrated) bodyPara += frustrationClause(tone);
    if (ctx.priority) bodyPara += priorityClause(tone);
    bodyPara += pick(bodyBank, i + Math.floor(i / bodyBank.length)).trim();
    bodyPara = bodyPara.replace(/\s+/g, " ").trim();

    // Paragraph 3: closing line
    const closingPara = pick(closerBank, i).trim();

    const paragraphs = [openingPara, bodyPara, closingPara].filter(Boolean);
    results.push(paragraphs.join("\n\n"));
  }
  return results;
}

/* =========================================================================
   AI GENERATION SERVICE (kept separate so the provider can change later)
   ========================================================================= */

const RULES_TEXT = `You write customer-facing support responses for a SaaS support engineer (Zoho products). Follow these rules strictly:
- Keep it customer-facing; never expose internal technical detail unless the user's notes explicitly say it should go to the customer.
- Never mention "AI".
- Avoid corporate jargon and robotic phrasing.
- Keep responses concise, natural, professional and human.
- Do not promise an exact resolution time unless the user provided one.
- Acknowledge delays politely without over-apologizing.
- If the customer seems frustrated, be more empathetic, without being defensive.
- If asking for information, explain briefly what is needed and why, when useful.
- Preserve exact product names and any exact navigation steps supplied by the user.
- Do not invent troubleshooting steps.
- Each variation must be noticeably different in wording while preserving the same meaning.
- Format every response as a ready-to-send email body: a short opening line as its own paragraph, then one or two short explanation paragraphs, then a short closing line as its own paragraph. Separate paragraphs with a blank line (\\n\\n). No greeting name, no sign-off/signature, no subject line — just the body paragraphs. Example shape:
"Thank you for your patience.\\n\\nWe are currently checking the reported concern with our concerned backend team to understand the issue in detail. We will share an update with you as soon as we receive further information from them.\\n\\nWe appreciate your patience and understanding while we work on this."`;

async function generateWithAI({ input, situation, tone, count, excludeTexts = [] }) {
  const prompt = `${RULES_TEXT}

Support engineer's notes: "${input}"
Situation: ${situation}
Tone: ${tone}
Number of variations to produce: ${count}
${excludeTexts.length ? `Produce wording clearly different from these previous versions:\n${excludeTexts.map((t, i) => `${i + 1}. ${t}`).join("\n")}` : ""}

Write like a real support engineer who has actually read these notes — reference the specific detail(s) the engineer gave instead of generic phrasing, and match the tone of the situation (e.g. an escalation reads differently than a routine update). Respond with ONLY a JSON array of ${count} strings, each a complete customer-ready response. No markdown, no preamble, no code fences.`;

  // Groq first (fast, fully free for plain text) — Gemini as a fallback if
  // Groq errors or rate-limits, so a single provider hiccup doesn't silently
  // drop this to the static template engine.
  try {
    return await generateWithGroq(prompt, count);
  } catch (err) {
    console.warn("Groq generation failed, falling back to Gemini:", err);
    return await generateWithGemini(prompt, count);
  }
}

async function generateWithGroq(prompt, count) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Groq request failed");
    const data = await response.json();
    const textBlock = data.choices?.[0]?.message?.content || "";
    return parseResponseArray(textBlock, count);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function generateWithGemini(prompt, count) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gemini-3.6-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Gemini request failed");
    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const textBlock = parts.map(p => p.text || "").join("");
    return parseResponseArray(textBlock, count);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

function parseResponseArray(textBlock, count) {
  const cleaned = textBlock.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Bad AI response shape");
  return parsed.map(String);
}

/* =========================================================================
   JR SME — grounded Q&A over Zoho's official help documentation
   Uses Gemini's server-side google_search grounding tool (live lookup)
   instead of a hand-built vector index, so there's no scraping/embeddings pipeline to
   host or keep in sync. The actual API call happens in /api/gemini.js
   so the API key never reaches the browser.
   ========================================================================= */

function extractAnswerAndSources(candidate) {
  const parts = candidate?.content?.parts || [];
  const text = parts.map(p => p.text || "").join("");

  const seen = new Map();
  const chunks = candidate?.groundingMetadata?.groundingChunks || [];
  for (const c of chunks) {
    let url = c.web?.uri;
    let title = c.web?.title || url;
    if (url) {
      if (url.includes("google.com/url?") && url.includes("url=")) {
        try {
          const match = url.match(/[?&]url=([^&]+)/);
          if (match) url = decodeURIComponent(match[1]);
        } catch { /* fallback */ }
      }
      seen.set(url, title);
    }
  }

  const searchQueries = candidate?.groundingMetadata?.webSearchQueries || [];
  return {
    text: text.trim(),
    sources: Array.from(seen, ([url, title]) => ({ url, title })),
    searchQueries
  };
}

const APP_SLUG_MAP = {
  "Zoho CRM": "crm", "Zoho Desk": "desk", "Zoho Books": "books",
  "Zoho People": "people", "Zoho Projects": "projects", "Zoho Mail": "mail",
  "Zoho Campaigns": "campaigns", "Zoho SalesIQ": "salesiq", "Zoho Cliq": "cliq",
  "Zoho Analytics": "analytics", "Zoho Inventory": "inventory", "Zoho Expense": "expense",
  "Zoho Forms": "forms", "Zoho Sign": "sign", "Zoho Recruit": "recruit",
  "Zoho Payroll": "payroll", "Zoho WorkDrive": "workdrive", "Zoho One": "one",
  "Zoho Bigin": "bigin", "Zoho Flow": "flow", "Zoho Creator": "creator",
  "Zoho Meeting": "meeting", "Zoho Vault": "vault"
};

function autoDetectZohoApp(query) {
  if (!query) return null;
  const lower = query.toLowerCase();
  for (const [appName, slug] of Object.entries(APP_SLUG_MAP)) {
    const coreTerm = appName.toLowerCase().replace("zoho ", "");
    if (lower.includes(appName.toLowerCase()) || lower.includes(coreTerm)) {
      return appName;
    }
  }
  return null;
}

const TOPIC_PATTERNS = [
  {
    key: "archive",
    terms: ["archive", "archiving", "unarchive", "close project", "deactivate project", "project operations"],
    searchQ: "archive+unarchive+records",
    title: "Archiving & Managing Records"
  },
  {
    key: "import",
    terms: ["import", "csv", "xls", "xlsx", "field mapping", "data import", "importing", "migrate", "migration"],
    searchQ: "import+data+csv+field+mapping",
    title: "Data Import & Field Mapping Guide"
  },
  {
    key: "export",
    terms: ["export", "backup", "data backup", "exporting", "csv export", "download data"],
    searchQ: "export+data+backup",
    title: "Data Export & Backup Procedures"
  },
  {
    key: "custom_field",
    terms: ["custom field", "add field", "field type", "formula field", "lookup field", "field label", "picklist", "multi-select"],
    searchQ: "custom+fields+configuration",
    title: "Creating & Managing Custom Fields"
  },
  {
    key: "workflow",
    terms: ["workflow", "automation", "trigger", "action", "alert", "field update", "webhooks", "macro", "rule"],
    searchQ: "workflow+rules+automation",
    title: "Workflow Rules & Process Automation"
  },
  {
    key: "blueprint",
    terms: ["blueprint", "stage transition", "state machine", "process builder", "pipeline step", "transition"],
    searchQ: "blueprint+process+management",
    title: "Blueprint Process Automation Guide"
  },
  {
    key: "email",
    terms: ["email", "smtp", "imap", "email integration", "template", "mail merge", "email opt out", "dkim", "spf", "bounce"],
    searchQ: "email+integration+configuration",
    title: "Email Integration & Settings"
  },
  {
    key: "roles",
    terms: ["role", "profile", "permission", "security control", "sharing rule", "access control", "user group", "hierarchy"],
    searchQ: "roles+profiles+permissions",
    title: "Roles, Profiles & Security Controls"
  },
  {
    key: "reports",
    terms: ["report", "dashboard", "analytics", "chart", "kpi", "pivot", "scheduled report", "insights"],
    searchQ: "reports+dashboards+analytics",
    title: "Reports & Dashboard Configuration"
  },
  {
    key: "api",
    terms: ["api", "webhook", "rest api", "sdk", "oauth", "access token", "integration", "developer", "deluge", "json", "coql"],
    searchQ: "api+developer+guide+webhooks",
    title: "API Reference & Developer Integration"
  },
  {
    key: "notifications",
    terms: ["notification", "alert", "push notification", "in-app notification", "email notification", "reminder"],
    searchQ: "notifications+alerts+reminders",
    title: "Notification & Alert Settings"
  },
  {
    key: "leads",
    terms: ["lead", "contact", "account", "convert lead", "lead assignment", "scoring", "assignment rule"],
    searchQ: "leads+contacts+conversion",
    title: "Lead & Contact Management"
  },
  {
    key: "deals",
    terms: ["deal", "potential", "opportunity", "pipeline", "stage", "forecast", "closing"],
    searchQ: "deals+pipeline+stages",
    title: "Deals & Pipeline Management"
  },
  {
    key: "tasks",
    terms: ["task", "activity", "call", "meeting", "event", "calendar", "follow up", "milestone", "timesheet"],
    searchQ: "tasks+activities+calendar",
    title: "Task & Activity Management"
  },
  {
    key: "invoices",
    terms: ["invoice", "estimate", "payment", "subscription", "recurring", "billing", "tax", "gst", "currency", "quote"],
    searchQ: "invoices+estimates+payments",
    title: "Invoices, Estimates & Billing"
  },
  {
    key: "tickets",
    terms: ["ticket", "sla", "escalation", "customer support", "agent", "dept", "department", "portal", "kb"],
    searchQ: "tickets+sla+support",
    title: "Support Tickets & SLA Rules"
  },
  {
    key: "users",
    terms: ["add user", "deactivate user", "sso", "2fa", "mfa", "login", "password reset", "domain authentication", "support access"],
    searchQ: "user+management+authentication",
    title: "User Management & Support Access"
  },
  {
    key: "templates",
    terms: ["template", "email template", "inventory template", "quote template", "print template", "pdf template"],
    searchQ: "templates+customization",
    title: "Templates Customization Guide"
  },
  {
    key: "layouts",
    terms: ["layout", "page layout", "canvas", "section", "layout assignment", "conditional field"],
    searchQ: "page+layouts+customization",
    title: "Page Layouts & UI Customization"
  },
  {
    key: "leave",
    terms: ["leave", "attendance", "shift", "timesheet", "check in", "holiday", "payroll", "time off"],
    searchQ: "leave+attendance+timesheets",
    title: "Leave & Attendance Management"
  },
  {
    key: "campaigns",
    terms: ["campaign", "mass email", "newsletter", "drip campaign", "subscriber", "mailing list", "open rate"],
    searchQ: "campaigns+email+marketing",
    title: "Email Campaigns & Subscribers"
  },
  {
    key: "formula",
    terms: ["deluge", "custom function", "script", "formula", "validation rule", "custom button"],
    searchQ: "deluge+scripts+custom+functions",
    title: "Deluge Scripting & Custom Functions"
  }
];

const SPECIFIC_ARTICLE_PATHS = {
  "Zoho CRM": {
    archive: "https://help.zoho.com/portal/en/kb/crm/data-administration/storage-space/articles/archive-data",
    import: "https://help.zoho.com/portal/en/kb/crm/data-administration/import-data",
    export: "https://help.zoho.com/portal/en/kb/crm/data-administration/export-data",
    custom_field: "https://help.zoho.com/portal/en/kb/crm/customization/custom-fields",
    workflow: "https://help.zoho.com/portal/en/kb/crm/automate-business-processes/workflow-management",
    blueprint: "https://help.zoho.com/portal/en/kb/crm/automate-business-processes/blueprint",
    roles: "https://help.zoho.com/portal/en/kb/crm/users-and-permissions/roles",
    email: "https://help.zoho.com/portal/en/kb/crm/email/email-configuration",
    reports: "https://help.zoho.com/portal/en/kb/crm/analytics-and-reports/reports",
    users: "https://help.zoho.com/portal/en/kb/crm/users-and-permissions/user-management",
    formula: "https://help.zoho.com/portal/en/kb/crm/developer-guide/custom-functions",
    api: "https://www.zoho.com/crm/developer/docs/api/v6/"
  },
  "Zoho Projects": {
    archive: "https://help.zoho.com/portal/en/kb/projects/projects/project-operations",
    tasks: "https://help.zoho.com/portal/en/kb/projects/tasks",
    custom_field: "https://help.zoho.com/portal/en/kb/projects/settings/customization/custom-fields",
    reports: "https://help.zoho.com/portal/en/kb/projects/reports",
    users: "https://help.zoho.com/portal/en/kb/projects/settings/users"
  },
  "Zoho Desk": {
    tickets: "https://help.zoho.com/portal/en/kb/desk/tickets",
    workflow: "https://help.zoho.com/portal/en/kb/desk/automation",
    custom_field: "https://help.zoho.com/portal/en/kb/desk/customization",
    reports: "https://help.zoho.com/portal/en/kb/desk/reports"
  },
  "Zoho Books": {
    invoices: "https://help.zoho.com/portal/en/kb/books/invoices",
    import: "https://help.zoho.com/portal/en/kb/books/items",
    reports: "https://help.zoho.com/portal/en/kb/books/reports"
  },
  "Zoho People": {
    leave: "https://help.zoho.com/portal/en/kb/people/leave-tracker",
    users: "https://help.zoho.com/portal/en/kb/people/organization/employee"
  }
};

function formatSourceTitle(s, appName) {
  if (s.title && typeof s.title === "string" && s.title.trim().length > 3) {
    let clean = s.title.replace(/\s*[-|]\s*Zoho\s*Cares.*$/i, "").replace(/\s*[-|]\s*Zoho Help.*$/i, "").trim();
    if (clean.length > 3) return clean;
  }
  if (s.url && s.url.includes("google.com/search")) {
    return `Search Official ${appName || "Zoho"} Help Portal`;
  }
  if (s.url && s.url.includes("developer/docs")) {
    return `${appName || "Zoho"} Developer & API Reference Documentation`;
  }
  if (s.url && s.url.includes("community")) {
    return `${appName || "Zoho"} Official Community Forum`;
  }
  return `${appName || "Zoho"} Official Help Documentation`;
}

function formatSourceUrl(urlStr) {
  if (!urlStr) return "help.zoho.com";
  let cleaned = urlStr.replace(/^https?:\/\//, "");
  if (cleaned.includes("google.com/search")) {
    return "help.zoho.com (Live Search)";
  }
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch { /* proceed */ }
  if (cleaned.length > 45) {
    return cleaned.slice(0, 42) + "…";
  }
  return cleaned;
}

function generateDynamicHelpSources({ query, appName, groundingSources = [] }) {
  const detectedApp = appName || autoDetectZohoApp(query) || "Zoho CRM";
  const slug = APP_SLUG_MAP[detectedApp] || "crm";
  const lowerQ = (query || "").toLowerCase();

  const finalSources = [];

  // 1. Process grounding sources returned by live web search
  for (const g of groundingSources) {
    if (g.url && !finalSources.some(s => s.url === g.url)) {
      let cleanTitle = formatSourceTitle(g, detectedApp);
      finalSources.push({
        url: g.url,
        title: cleanTitle,
        badge: "Official Article"
      });
    }
  }

  // 2. Add Developer & API Documentation link for technical / code / JSON queries
  const isDevQuery = lowerQ.includes("api") || lowerQ.includes("json") || lowerQ.includes("deluge") || lowerQ.includes("coql") || lowerQ.includes("sdk") || lowerQ.includes("webhook") || lowerQ.includes("rest");
  if (isDevQuery) {
    const devUrl = `https://www.zoho.com/${slug}/developer/docs/`;
    if (!finalSources.some(s => s.url === devUrl)) {
      finalSources.push({
        url: devUrl,
        title: `${detectedApp} Developer & API Reference Documentation`,
        badge: "Developer API Docs"
      });
    }
  }

  // 3. Detect topic matches from query
  const matchedTopics = [];
  for (const pattern of TOPIC_PATTERNS) {
    if (pattern.terms.some(term => lowerQ.includes(term))) {
      matchedTopics.push(pattern);
    }
  }

  const appSpecific = SPECIFIC_ARTICLE_PATHS[detectedApp];
  for (const topic of matchedTopics) {
    if (appSpecific && appSpecific[topic.key]) {
      const specificUrl = appSpecific[topic.key];
      if (!finalSources.some(s => s.url === specificUrl)) {
        finalSources.push({
          url: specificUrl,
          title: `${detectedApp} - ${topic.title} (Official Guide)`,
          badge: "Official Guide"
        });
      }
    } else {
      const topicSearchUrl = `https://help.zoho.com/portal/en/kb/zoho/${slug}`;
      if (!finalSources.some(s => s.url === topicSearchUrl)) {
        finalSources.push({
          url: topicSearchUrl,
          title: `${detectedApp} Knowledge Base: ${topic.title}`,
          badge: "Knowledge Base"
        });
      }
    }
    if (finalSources.length >= 4) break;
  }

  // 4. Guaranteed 100% Working Live Search Link across official Zoho Help Portal
  if (query && query.trim().length > 3) {
    const cleanQuery = query.replace(/[^\w\s]/gi, ' ').trim();
    const searchKeywords = encodeURIComponent(`${detectedApp} ${cleanQuery}`);
    const displayTitle = query.length > 38 ? query.slice(0, 38) + "…" : query;

    const directSearchUrl = `https://help.zoho.com/portal/en/search?searchModule=kb&query=${searchKeywords}`;
    if (!finalSources.some(s => s.url === directSearchUrl)) {
      finalSources.push({
        url: directSearchUrl,
        title: `Search Official ${detectedApp} Help Docs for "${displayTitle}"`,
        badge: "Live Search"
      });
    }
  }

  // 5. Official Knowledge Base Portal & Community Forum Links
  const mainKbUrl = ZOHO_APP_LOOKUP[detectedApp] || `https://help.zoho.com/portal/en/kb/zoho/${slug}`;
  if (!finalSources.some(s => s.url === mainKbUrl)) {
    finalSources.push({
      url: mainKbUrl,
      title: `${detectedApp} Official Knowledge Base Portal`,
      badge: "Knowledge Base"
    });
  }

  const communityUrl = `https://help.zoho.com/portal/en/community/zoho-${slug}`;
  if (finalSources.length < 6 && !finalSources.some(s => s.url === communityUrl)) {
    finalSources.push({
      url: communityUrl,
      title: `${detectedApp} Official Community & Support Forum`,
      badge: "Community Forum"
    });
  }

  return finalSources;
}



async function askJrSME({ query, appName }) {
  const targetApp = appName || autoDetectZohoApp(query) || "";
  const scopedUrl = targetApp ? ZOHO_APP_LOOKUP[targetApp] : null;

  const prompt = `You are "Jr SME", an internal knowledge assistant for a SaaS customer support engineer working across Zoho products.

Support engineer's question (in their own words): "${query}"
${targetApp ? `Relevant Zoho application: ${targetApp}\nIts official help portal: ${scopedUrl}` : "Infer the relevant Zoho application from the question."}

Instructions:
- Search help.zoho.com (Zoho's official help documentation) to find the accurate, current answer. Only use help.zoho.com as a source.
${scopedUrl ? `- Focus your search under ${scopedUrl} and official help.zoho.com pages for ${targetApp}.` : ""}

- Format your response using clean Markdown with these specific section headers:
  ### 🎯 Summary
  [1-2 sentences direct summary answer]

  ### 📋 Step-by-Step Solution
  [Numbered list (1., 2., 3.) with exact UI navigation paths highlighted using > separator, e.g. Setup > Customization > Modules and Fields]

  ### 💡 Key Notes & Requirements
  [Prerequisites, permissions required, or important caveats]

  ### 💬 Suggested Customer Response
  [A ready-to-send, polite, customer-facing email response that the engineer can copy and send directly to the customer]

- Preserve exact navigation steps, field names, and menu labels as documented in official Zoho help.
- Do not invent or guess steps. Skip generic disclaimers.`;

  let finalAnswerText = "";
  let rawGroundingSources = [];
  let mode = "search";

  // 1. Try grounded Google Search lookup via Gemini 3.6 Flash
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemini-3.6-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const { text, sources } = extractAnswerAndSources(data.candidates?.[0]);
      if (text) {
        finalAnswerText = text;
        rawGroundingSources = sources;
      }
    }
  } catch {
    /* Fallback to ungrounded Gemini query if grounding tool hits rate-limit/quota */
  }

  // 2. Fallback to standard Gemini 3.6 Flash query if google_search tool is rate-limited or fails
  if (!finalAnswerText) {
    const fallbackResponse = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemini-3.6-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    if (!fallbackResponse.ok) throw new Error("Jr SME lookup failed");
    const data = await fallbackResponse.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    finalAnswerText = parts.map(p => p.text || "").join("").trim();
    if (!finalAnswerText) throw new Error("Empty Jr SME response");
    mode = "fallback";
  }

  // Generate dynamic, query-specific help article links for any query and any Zoho app
  const finalSources = generateDynamicHelpSources({
    query,
    appName: targetApp,
    groundingSources: rawGroundingSources
  });

  return { text: finalAnswerText, sources: finalSources, mode };
}

/* =========================================================================
   STORAGE HELPERS (persistent, per-browser; standard localStorage)
   Note: this runs as a real hosted site now, not inside a Claude.ai artifact,
   so the sandboxed window.storage API isn't available — plain localStorage
   is the right tool here and persists per browser/device.
   ========================================================================= */

const STORAGE_PREFIX = "zcx:";

async function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
async function saveJSON(key, value) {
  try { window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); } catch { /* best effort */ }
}

/* =========================================================================
   CLIPBOARD HELPER (plain text + styled HTML for rich editors)
   ========================================================================= */

async function copyResponseText(text) {
  const html = `<div style="font-family:Verdana,sans-serif;font-size:10px;line-height:1.5;text-align:justify;color:#000000;">${text
    .split(/\n{2,}/)
    .map(p => `<p style="margin:0 0 10px 0;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("")}</div>`;
  try {
    if (window.ClipboardItem) {
      const item = new ClipboardItem({
        "text/plain": new Blob([text], { type: "text/plain" }),
        "text/html": new Blob([html], { type: "text/html" }),
      });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch { /* fall through to plain text */ }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* =========================================================================
   SMALL UI PRIMITIVES
   ========================================================================= */

function Field({ label, children }) {
  return (
    <label className="cx-field">
      <span className="cx-field-label">{label}</span>
      {children}
    </label>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button className={`cx-tab ${active ? "cx-tab-active" : ""}`} onClick={onClick} type="button">
      <Icon size={15} />
      <span>{children}</span>
    </button>
  );
}

function FormatInline({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\b(?:[A-Z][a-z0-9A-Z]+\s*>\s*)+[A-Z][a-z0-9A-Z]+\b)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={idx} className="jr-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={idx} className="jr-code">{part.slice(1, -1)}</code>;
        }
        if (part.includes(">")) {
          const crumbs = part.split(/\s*>\s*/);
          return (
            <span key={idx} className="jr-nav-crumbs">
              {crumbs.map((c, ci) => (
                <React.Fragment key={ci}>
                  {ci > 0 && <span className="jr-crumb-arrow">➔</span>}
                  <span className="jr-crumb">{c}</span>
                </React.Fragment>
              ))}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}

function tryParseJson(text) {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(\w+)?\n?/, "").replace(/\n?```$/, "").trim();
  }
  if ((cleaned.startsWith("{") && cleaned.endsWith("}")) || (cleaned.startsWith("[") && cleaned.endsWith("]"))) {
    try {
      const parsed = JSON.parse(cleaned);
      return { parsed, formatted: JSON.stringify(parsed, null, 2), raw: cleaned };
    } catch {
      return null;
    }
  }
  return null;
}

function parseMarkdownContentBlocks(contentStr) {
  if (!contentStr) return [];
  const blocks = [];
  const lines = contentStr.split("\n");
  let inCodeBlock = false;
  let codeLang = "";
  let codeLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const codeFenceMatch = line.match(/^```(\w+)?/);

    if (codeFenceMatch) {
      if (inCodeBlock) {
        blocks.push({
          type: "code",
          lang: codeLang || "code",
          code: codeLines.join("\n")
        });
        inCodeBlock = false;
        codeLang = "";
        codeLines = [];
      } else {
        inCodeBlock = true;
        codeLang = codeFenceMatch[1] || "json";
        codeLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    const stepMatch = trimmed.match(/^(\d+)[\.\)]\s+(.+)$/);
    const bulletMatch = trimmed.match(/^[\-\*]\s+(.+)$/);

    if (stepMatch) {
      blocks.push({ type: "step", num: stepMatch[1], text: stepMatch[2] });
    } else if (bulletMatch) {
      blocks.push({ type: "bullet", text: bulletMatch[1] });
    } else {
      blocks.push({ type: "paragraph", text: trimmed });
    }
  }

  if (inCodeBlock && codeLines.length > 0) {
    blocks.push({
      type: "code",
      lang: codeLang || "json",
      code: codeLines.join("\n")
    });
  }

  return blocks;
}

function CodeBlockView({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyResponseText(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="jr-codeblock-card">
      <div className="jr-codeblock-header">
        <span className="jr-codeblock-lang">{(lang || "CODE").toUpperCase()}</span>
        <button className="jr-codeblock-copy" onClick={handleCopy} type="button">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "Copied!" : "Copy Code"}</span>
        </button>
      </div>
      <pre className="jr-codeblock-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function JrSMEJsonViewer({ jsonInfo }) {
  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const handleCopyFormatted = async () => {
    const ok = await copyResponseText(jsonInfo.formatted);
    if (ok) {
      setCopiedFormatted(true);
      setTimeout(() => setCopiedFormatted(false), 1600);
    }
  };

  const handleCopyRaw = async () => {
    const ok = await copyResponseText(jsonInfo.raw);
    if (ok) {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 1600);
    }
  };

  return (
    <div className="jr-json-card">
      <div className="jr-json-header">
        <div className="jr-json-title-group">
          <Sparkles size={15} className="jr-sec-icon" />
          <span>Structured JSON Response</span>
          <span className="jr-json-badge">Valid JSON</span>
        </div>
        <div className="jr-json-actions">
          <button className="cx-action-btn" onClick={handleCopyFormatted} type="button">
            {copiedFormatted ? <Check size={14} /> : <Copy size={14} />}
            {copiedFormatted ? "Copied Formatted!" : "Copy Formatted JSON"}
          </button>
          <button className="cx-action-btn" onClick={handleCopyRaw} type="button">
            {copiedRaw ? <Check size={14} /> : <ClipboardList size={14} />}
            {copiedRaw ? "Copied Raw!" : "Copy Compact JSON"}
          </button>
        </div>
      </div>
      <pre className="jr-json-pre">
        <code>{jsonInfo.formatted}</code>
      </pre>
    </div>
  );
}

function JrSMEResponseView({ answer }) {
  const [copiedCustomerDraft, setCopiedCustomerDraft] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  if (!answer) return null;

  const rawText = answer.text || "";
  const jsonOutput = tryParseJson(rawText);

  const rawSections = rawText.split(/(?=\n#{2,3}\s+)/g);
  let customerDraftText = "";

  const sections = rawSections.map((secStr, index) => {
    const trimmed = secStr.trim();
    const headerMatch = trimmed.match(/^#{2,3}\s+(.+)$/m);
    const title = headerMatch ? headerMatch[1].replace(/^[^\w\s]+/, "").trim() : (index === 0 ? "Overview" : "Details");
    const content = headerMatch ? trimmed.replace(/^#{2,3}\s+.+$/m, "").trim() : trimmed;

    const isCustomerDraft = title.toLowerCase().includes("customer") || title.toLowerCase().includes("draft");
    if (isCustomerDraft && content) {
      customerDraftText = content;
    }

    return { title, content, isCustomerDraft, raw: trimmed };
  });

  const handleCopyCustomerDraft = async () => {
    if (!customerDraftText) return;
    const ok = await copyResponseText(customerDraftText);
    if (ok) {
      setCopiedCustomerDraft(true);
      setTimeout(() => setCopiedCustomerDraft(false), 1600);
    }
  };

  const handleCopyFull = async () => {
    const ok = await copyResponseText(rawText);
    if (ok) {
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 1600);
    }
  };

  return (
    <div className="jr-response-container">
      <div className="jr-response-header">
        <div className="jr-badge-group">
          <span className={`cx-mode-badge ${answer.mode === "search" ? "cx-mode-ai" : "cx-mode-template"}`}>
            <Sparkles size={13} /> {answer.mode === "search" ? "Grounded in Official Help" : "Reference Knowledge Mode"}
          </span>
          {jsonOutput && <span className="jr-json-badge">JSON Format</span>}
        </div>
        <div className="jr-header-actions">
          {customerDraftText && (
            <button className="cx-action-btn jr-customer-draft-btn" onClick={handleCopyCustomerDraft} type="button">
              {copiedCustomerDraft ? <Check size={14} /> : <ClipboardList size={14} />}
              {copiedCustomerDraft ? "Customer Draft Copied!" : "Copy Customer Response"}
            </button>
          )}
          <button className="cx-action-btn" onClick={handleCopyFull} type="button">
            {copiedFull ? <Check size={14} /> : <Copy size={14} />}
            {copiedFull ? "Copied!" : "Copy Full Answer"}
          </button>
        </div>
      </div>

      {jsonOutput ? (
        <JrSMEJsonViewer jsonInfo={jsonOutput} />
      ) : (
        <div className="jr-sections">
          {sections.map((sec, sIdx) => {
            if (!sec.content) return null;

            const isSummary = sec.title.toLowerCase().includes("summary") || sec.title.toLowerCase().includes("overview");
            const isSteps = sec.title.toLowerCase().includes("step") || sec.title.toLowerCase().includes("solution") || sec.title.toLowerCase().includes("fix");
            const isNotes = sec.title.toLowerCase().includes("note") || sec.title.toLowerCase().includes("requirement") || sec.title.toLowerCase().includes("tip");

            const blocks = parseMarkdownContentBlocks(sec.content);

            return (
              <div
                key={sIdx}
                className={`jr-section-card ${isSummary ? "jr-card-summary" : ""} ${isSteps ? "jr-card-steps" : ""} ${sec.isCustomerDraft ? "jr-card-customer" : ""} ${isNotes ? "jr-card-notes" : ""}`}
              >
                <div className="jr-section-title">
                  {isSummary && <Sparkles size={16} className="jr-sec-icon" />}
                  {isSteps && <ClipboardList size={16} className="jr-sec-icon" />}
                  {isNotes && <BookOpen size={16} className="jr-sec-icon" />}
                  {sec.isCustomerDraft && <HeartHandshake size={16} className="jr-sec-icon" />}
                  <span>{sec.title}</span>
                </div>

                <div className="jr-section-body">
                  {blocks.map((b, bIdx) => {
                    if (b.type === "code") {
                      return <CodeBlockView key={bIdx} lang={b.lang} code={b.code} />;
                    }

                    if (b.type === "step") {
                      return (
                        <div key={bIdx} className="jr-step-row">
                          <span className="jr-step-badge">{b.num}</span>
                          <div className="jr-step-text">
                            <FormatInline text={b.text} />
                          </div>
                        </div>
                      );
                    }

                    if (b.type === "bullet") {
                      return (
                        <div key={bIdx} className="jr-bullet-row">
                          <span className="jr-bullet-dot" />
                          <div className="jr-bullet-text">
                            <FormatInline text={b.text} />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <p key={bIdx} className="jr-para">
                        <FormatInline text={b.text} />
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {answer.sources && answer.sources.length > 0 && (
        <div className="jr-sources-section">
          <div className="jr-sources-title">
            <ExternalLink size={13} /> Official Help Documentation Sources ({answer.sources.length})
          </div>
          <div className="jr-sources-grid">
            {answer.sources.map((s, i) => {
              const displayTitle = formatSourceTitle(s, s.appName || "Zoho");
              const displayUrl = formatSourceUrl(s.url);
              return (
                <a key={i} href={s.url} target="_blank" rel="noreferrer" className="jr-source-card">
                  <div className="jr-source-card-header">
                    <span className="jr-source-tag">{s.badge || "Official Guide"}</span>
                    <ExternalLink size={13} className="jr-source-ext" />
                  </div>
                  <div className="jr-source-title">{displayTitle}</div>
                  <div className="jr-source-url">{displayUrl}</div>
                </a>
              );
            })}

          </div>
        </div>
      )}
    </div>
  );
}

function JrSMESkeleton() {
  return (
    <div className="jr-skeleton-container">
      <div className="jr-skeleton-header">
        <div className="jr-skeleton-pill" style={{ width: 140, height: 24 }} />
        <div className="jr-skeleton-pill" style={{ width: 90, height: 28 }} />
      </div>
      <div className="jr-skeleton-card" style={{ height: 90 }} />
      <div className="jr-skeleton-card" style={{ height: 160 }} />
      <div className="jr-skeleton-card" style={{ height: 110 }} />
    </div>
  );
}

/* =========================================================================
   MAIN APP
   ========================================================================= */

export default function CXResponseGenerator() {
  const [input, setInput] = useState("");
  const [situation, setSituation] = useState("General Update");
  const [tone, setTone] = useState("Professional");
  const [count, setCount] = useState(3);

  const [responses, setResponses] = useState([]); // {id, text, editing, draft}
  const [mode, setMode] = useState(null); // 'ai' | 'template'
  const [generating, setGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [errorNote, setErrorNote] = useState("");

  const [rightTab, setRightTab] = useState("responses"); // responses | templates | history
  const [templates, setTemplates] = useState([]);
  const [history, setHistory] = useState([]);
  const [prefs, setPrefs] = useState({ aiEnabled: true, theme: "light" });

  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("All");
  const [saveModal, setSaveModal] = useState(null); // {text}
  const [saveName, setSaveName] = useState("");
  const [saveCategory, setSaveCategory] = useState(CATEGORIES[0]);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [editingTemplateDraft, setEditingTemplateDraft] = useState({ name: "", content: "", category: CATEGORIES[0] });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);

  const [appView, setAppView] = useState("client"); // client | jrsme
  const [jrQuery, setJrQuery] = useState("");
  const [jrApp, setJrApp] = useState("");
  const [jrAnswer, setJrAnswer] = useState(null); // {text, sources, mode}
  const [jrLoading, setJrLoading] = useState(false);
  const [jrError, setJrError] = useState("");
  const [jrHistory, setJrHistory] = useState([]);

  const textareaRef = useRef(null);

  // ---- initial load from persistent storage ----
  useEffect(() => {
    (async () => {
      const [t, h, p, jh] = await Promise.all([
        loadJSON("cx-templates", null),
        loadJSON("cx-history", []),
        loadJSON("cx-prefs", { aiEnabled: true, theme: "light" }),
        loadJSON("cx-jrsme-history", []),
      ]);
      const initialTemplates = (t && t.length > 0) ? t : DEFAULT_TEMPLATES;
      setTemplates(initialTemplates);
      if (!t || t.length === 0) {
        saveJSON("cx-templates", DEFAULT_TEMPLATES);
      }
      setHistory(h);
      setPrefs(p);
      setJrHistory(jh);
      setLoaded(true);
    })();
  }, []);

  // ---- splash screen: stays up at least ~1.6s so the quote is readable,
  // even though the localStorage load above usually finishes instantly ----
  useEffect(() => {
    if (!loaded) return;
    const minDisplay = setTimeout(() => {
      setSplashExiting(true);
      setTimeout(() => setShowSplash(false), 450);
    }, 1600);
    return () => clearTimeout(minDisplay);
  }, [loaded]);

  useEffect(() => {
    const isDark = prefs.theme === "dark";
    document.documentElement.classList.toggle("cx-theme-dark", isDark);
    document.body.classList.toggle("cx-theme-dark", isDark);
    document.body.style.backgroundColor = isDark ? "#0D0E1A" : "#F5F6FB";
    document.body.style.color = isDark ? "#ECEBF5" : "#16151F";
  }, [prefs.theme]);


  const addKeywordChip = (kw) => {
    setInput(prev => (prev.trim() ? `${prev.trim()}, ${kw}` : kw));
    textareaRef.current?.focus();
  };

  const pushHistory = useCallback(async (entryInput, entrySituation, entryTone, entryResponses) => {
    const entry = {
      id: `h_${Date.now()}`,
      timestamp: Date.now(),
      input: entryInput,
      situation: entrySituation,
      tone: entryTone,
      responses: entryResponses,
    };
    const next = [entry, ...history].slice(0, 20);
    setHistory(next);
    await saveJSON("cx-history", next);
  }, [history]);

  const runGeneration = async ({ input: text, situation: sit, tone: tn, count: cnt, exclude = [] }) => {
    if (prefs.aiEnabled) {
      try {
        const texts = await generateWithAI({ input: text, situation: sit, tone: tn, count: cnt, excludeTexts: exclude });
        return { texts, mode: "ai" };
      } catch {
        // fall through to template engine
      }
    }
    const texts = generateTemplateResponses(text, sit, tn, cnt);
    return { texts, mode: "template" };
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setErrorNote("Add a few notes about the situation first.");
      return;
    }
    setErrorNote("");
    setGenerating(true);
    const { texts, mode: usedMode } = await runGeneration({ input, situation, tone, count });
    const newResponses = texts.map((t, i) => ({ id: `r_${Date.now()}_${i}`, text: t, editing: false, draft: t }));
    setResponses(newResponses);
    setMode(usedMode);
    setGenerating(false);
    pushHistory(input, situation, tone, texts);
  };

  const handleRegenerateAll = async () => {
    if (!input.trim() || !responses.length) return;
    setGenerating(true);
    const exclude = responses.map(r => r.text);
    const { texts, mode: usedMode } = await runGeneration({ input, situation, tone, count, exclude });
    const newResponses = texts.map((t, i) => ({ id: `r_${Date.now()}_${i}`, text: t, editing: false, draft: t }));
    setResponses(newResponses);
    setMode(usedMode);
    setGenerating(false);
    pushHistory(input, situation, tone, texts);
  };

  const handleRegenerateOne = async (id) => {
    const target = responses.find(r => r.id === id);
    if (!target) return;
    setRegeneratingId(id);
    const exclude = responses.map(r => r.text);
    const { texts, mode: usedMode } = await runGeneration({ input, situation, tone, count: 1, exclude });
    setResponses(prev => prev.map(r => r.id === id ? { ...r, text: texts[0], draft: texts[0], editing: false } : r));
    setMode(usedMode);
    setRegeneratingId(null);
  };

  const handleCopy = async (id, text) => {
    const ok = await copyResponseText(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    }
  };

  const handleCopyAll = async () => {
    const joined = responses.map((r, i) => `${i + 1}. ${r.editing ? r.draft : r.text}`).join("\n\n");
    const ok = await copyResponseText(joined);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1600);
    }
  };

  const toggleEdit = (id) => {
    setResponses(prev => prev.map(r => r.id === id ? { ...r, editing: !r.editing, draft: r.editing ? r.draft : r.text } : r));
  };

  const updateDraft = (id, val) => {
    setResponses(prev => prev.map(r => r.id === id ? { ...r, draft: val } : r));
  };

  const commitEdit = (id) => {
    setResponses(prev => prev.map(r => r.id === id ? { ...r, text: r.draft, editing: false } : r));
  };

  const handleClear = () => {
    setInput("");
    setSituation("General Update");
    setTone("Professional");
    setCount(3);
    setResponses([]);
    setMode(null);
    setErrorNote("");
  };

  // ---- templates ----
  const openSaveModal = (text) => {
    setSaveModal({ text });
    setSaveName("");
    setSaveCategory(CAT_FOR_SITUATION[situation] || "Other");
  };

  const confirmSaveTemplate = async () => {
    if (!saveModal || !saveName.trim()) return;
    const newTemplate = {
      id: `t_${Date.now()}`,
      name: saveName.trim(),
      content: saveModal.text,
      category: saveCategory,
      createdAt: Date.now(),
    };
    const next = [newTemplate, ...templates];
    setTemplates(next);
    await saveJSON("cx-templates", next);
    setSaveModal(null);
  };

  const deleteTemplate = async (id) => {
    const next = templates.filter(t => t.id !== id);
    setTemplates(next);
    await saveJSON("cx-templates", next);
  };

  const startEditTemplate = (t) => {
    setEditingTemplateId(t.id);
    setEditingTemplateDraft({ name: t.name, content: t.content, category: t.category });
  };

  const saveEditTemplate = async () => {
    const next = templates.map(t => t.id === editingTemplateId ? { ...t, ...editingTemplateDraft } : t);
    setTemplates(next);
    await saveJSON("cx-templates", next);
    setEditingTemplateId(null);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesCat = templateCategoryFilter === "All" || t.category === templateCategoryFilter;
    const q = templateSearch.trim().toLowerCase();
    const matchesQ = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.content.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  const reopenHistory = (h) => {
    setInput(h.input);
    setSituation(h.situation);
    setTone(h.tone);
    setResponses(h.responses.map((t, i) => ({ id: `r_${h.id}_${i}`, text: t, editing: false, draft: t })));
    setRightTab("responses");
  };

  const toggleAI = async (val) => {
    const next = { ...prefs, aiEnabled: val };
    setPrefs(next);
    await saveJSON("cx-prefs", next);
  };

  const toggleTheme = async () => {
    const next = { ...prefs, theme: prefs.theme === "dark" ? "light" : "dark" };
    setPrefs(next);
    await saveJSON("cx-prefs", next);
  };

  // ---- Jr SME ----
  const handleAskJrSME = async () => {
    if (!jrQuery.trim()) {
      setJrError("Type the question you'd ask a senior SME first.");
      return;
    }
    setJrError("");
    setJrLoading(true);
    setJrAnswer(null);
    try {
      const { text, sources, mode: answerMode } = await askJrSME({ query: jrQuery, appName: jrApp });
      const result = { text, sources, mode: answerMode };
      setJrAnswer(result);
      const entry = { id: `jh_${Date.now()}`, timestamp: Date.now(), query: jrQuery, appName: jrApp, answer: text, sources };
      const nextHistory = [entry, ...jrHistory].slice(0, 15);
      setJrHistory(nextHistory);
      await saveJSON("cx-jrsme-history", nextHistory);
    } catch {
      const fallbackUrl = jrApp ? ZOHO_APP_LOOKUP[jrApp] : null;
      setJrAnswer({
        text: fallbackUrl
          ? `Live lookup isn't available right now. Start with ${jrApp}'s official help portal below and search for your specific question there.`
          : "Live lookup isn't available right now, and no application was selected to point you to a help portal. Try again in a moment, or pick the relevant Zoho app above.",
        sources: fallbackUrl ? [{ url: fallbackUrl, title: `${jrApp} Help Portal` }] : [],
        mode: "fallback",
      });
    } finally {
      setJrLoading(false);
    }
  };

  const handleClearJrSME = () => {
    setJrQuery("");
    setJrApp("");
    setJrAnswer(null);
    setJrError("");
  };

  const reopenJrHistory = (h) => {
    setJrQuery(h.query);
    setJrApp(h.appName || "");
    setJrAnswer({ text: h.answer, sources: h.sources || [], mode: "search" });
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " · " +
      d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className={`cx-root cx-theme-${prefs.theme === "dark" ? "dark" : "light"}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .cx-root {
          /* ---- light theme tokens (default) ---- */
          --bg: #F5F6FB;
          --blob-1: rgba(108,92,231,0.10);
          --blob-2: rgba(255,122,89,0.09);
          --panel: rgba(255,255,255,0.86);
          --panel-solid: #FFFFFF;
          --field-bg: #FBFBFE;
          --ink: #16151F;
          --ink-soft: #6E6C82;
          --hairline: rgba(22,21,31,0.10);
          --hairline-soft: rgba(22,21,31,0.06);
          --accent: #6C5CE7;
          --accent-deep: #5642D6;
          --accent-soft: #ECE9FE;
          --warm: #FF7A59;
          --warm-deep: #E85F3D;
          --warm-soft: #FFE7DE;
          --teal: #12967D;
          --teal-soft: #DFF5EF;
          --danger: #E5484D;
          --shadow-color: rgba(22,21,31,0.14);
          font-family: 'Inter', -apple-system, sans-serif;
          color: var(--ink);
          background:
            radial-gradient(640px 380px at 6% -8%, var(--blob-1), transparent 60%),
            radial-gradient(560px 420px at 106% 10%, var(--blob-2), transparent 60%),
            var(--bg);
          min-height: 100%;
          width: 100%;
          box-sizing: border-box;
          padding: 28px;
          transition: background-color .35s ease, color .35s ease;
        }
        .cx-root * { box-sizing: border-box; }

        .cx-theme-dark {
          --bg: #0D0E1A;
          --blob-1: rgba(124,108,255,0.24);
          --blob-2: rgba(255,138,107,0.14);
          --panel: rgba(20,21,35,0.97);
          --panel-solid: #171829;
          --field-bg: rgba(255,255,255,0.08);
          --ink: #ECEBF5;
          --ink-soft: #9B99B0;
          --hairline: rgba(255,255,255,0.13);
          --hairline-soft: rgba(255,255,255,0.08);
          --accent: #9C8DFF;
          --accent-deep: #7C6BFF;
          --accent-soft: rgba(156,141,255,0.22);
          --warm: #FF9478;
          --warm-deep: #FF8062;
          --warm-soft: rgba(255,148,120,0.20);
          --teal: #3FDCB6;
          --teal-soft: rgba(63,220,182,0.20);
          --danger: #FF6B6E;
          --shadow-color: rgba(0,0,0,0.68);
          color-scheme: dark;
        }

        .cx-shell { max-width: 1180px; margin: 0 auto; }

        /* ---------- Header ---------- */
        .cx-header {
          display:flex; align-items:center; justify-content:space-between;
          padding: 18px 4px 22px 4px;
          margin-bottom: 12px;
        }
        .cx-brand { display:flex; align-items:center; gap:14px; }
        .cx-brand-mark {
          width:42px; height:42px; border-radius:13px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center; color:#fff;
          background: linear-gradient(135deg, var(--accent), var(--warm));
          box-shadow: 0 8px 20px -6px var(--shadow-color);
        }
        .cx-title { font-family:'Manrope', sans-serif; font-weight:800; font-size:23px; letter-spacing:-0.01em; margin:0; color:var(--ink); }
        .cx-subtitle { color:var(--ink-soft); font-size:13px; margin-top:3px; }
        .cx-header-actions { display:flex; align-items:center; gap:8px; }
        .cx-icon-toggle {
          border:1px solid var(--hairline); background: var(--panel-solid);
          border-radius:11px; width:38px; height:38px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--ink-soft); transition: all .18s;
        }
        .cx-icon-toggle:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); box-shadow: 0 6px 14px -8px var(--shadow-color); }

        .cx-settings-panel { background: var(--panel-solid); border:1px solid var(--hairline); border-radius:16px; padding:18px 20px; margin-bottom:20px; box-shadow: 0 12px 28px -20px var(--shadow-color); }
        .cx-settings-panel h3 { margin:0 0 10px 0; font-size:14px; font-weight:700; font-family:'Manrope', sans-serif; }
        .cx-toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; font-size:13.5px; padding:9px 0; color: var(--ink-soft); }
        .cx-toggle-row + .cx-toggle-row { border-top:1px solid var(--hairline-soft); }
        .cx-switch { position:relative; width:40px; height:23px; border-radius:12px; background:var(--hairline); cursor:pointer; flex-shrink:0; transition:background .2s; }
        .cx-switch.on { background: linear-gradient(90deg, var(--accent-deep), var(--accent)); box-shadow: 0 0 0 3px var(--accent-soft); }
        .cx-switch::after { content:''; position:absolute; top:2.5px; left:2.5px; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.3); transition:left .2s; }
        .cx-switch.on::after { left:19.5px; }

        .cx-grid { display:grid; grid-template-columns: 380px 1fr; gap:22px; align-items:start; }
        @media (max-width: 860px) { .cx-grid { grid-template-columns: 1fr; } }

        .cx-panel {
          background: var(--panel);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border:1px solid var(--hairline);
          border-radius: 18px;
          padding:22px;
          box-shadow: 0 18px 40px -26px var(--shadow-color);
          transition: background-color .35s ease, border-color .35s ease;
        }

        .cx-field { display:block; margin-bottom:16px; }
        .cx-field-label { display:block; font-size:12px; font-weight:600; letter-spacing:0.01em; color:var(--ink-soft); margin-bottom:7px; }

        .cx-textarea { width:100%; min-height:150px; resize:vertical; border:1px solid var(--hairline); border-radius:12px; padding:12px 13px; font-family:inherit; font-size:14px; line-height:1.55; color:var(--ink); background:var(--field-bg); transition: border-color .15s, box-shadow .15s; }
        .cx-textarea:focus { outline:none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
        .cx-textarea::placeholder { color: var(--ink-soft); opacity:0.75; }

        .cx-chips { display:flex; flex-wrap:wrap; gap:7px; margin: 4px 0 18px 0; }
        .cx-chip { border:1px solid var(--hairline); background:var(--field-bg); color:var(--ink-soft); font-size:12px; padding:6px 12px; border-radius:999px; cursor:pointer; transition: all .15s; }
        .cx-chip:hover { border-color: var(--accent); color: var(--accent-deep); background: var(--accent-soft); transform: translateY(-1px); }

        .cx-select { width:100%; border:1px solid var(--hairline); border-radius:12px; padding:10px 11px; font-size:13.5px; font-family:inherit; background:var(--field-bg); color:var(--ink); transition: border-color .15s; }
        .cx-select:focus { outline:none; border-color: var(--accent); }

        .cx-row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

        .cx-segmented { display:flex; border:1px solid var(--hairline); border-radius:12px; overflow:hidden; background:var(--field-bg); padding:3px; gap:3px; }
        .cx-seg-btn { flex:1; padding:8px 0; background:transparent; border:none; border-radius:9px; font-size:13.5px; color:var(--ink-soft); cursor:pointer; transition: all .15s; }
        .cx-seg-btn.active { background: linear-gradient(135deg, var(--accent), var(--accent-deep)); color:#fff; font-weight:700; box-shadow: 0 6px 14px -8px var(--shadow-color); }

        .cx-generate-btn {
          width:100%; color:#fff; border:none; border-radius:13px; padding:13px 0;
          font-size:14.5px; font-weight:700; letter-spacing:0.01em; cursor:pointer; margin-top:8px;
          display:flex; align-items:center; justify-content:center; gap:8px;
          background: linear-gradient(120deg, var(--accent) 0%, var(--accent-deep) 55%, var(--warm) 130%);
          box-shadow: 0 14px 28px -12px var(--shadow-color);
          transition: transform .12s, box-shadow .12s, opacity .15s;
        }
        .cx-generate-btn:disabled { opacity:0.6; cursor:default; }
        .cx-generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 18px 34px -12px var(--shadow-color); }
        .cx-generate-btn:active:not(:disabled) { transform: translateY(0); }

        .cx-clear-link { display:block; text-align:center; margin-top:12px; font-size:12.5px; color:var(--ink-soft); background:none; border:none; cursor:pointer; text-decoration:underline; text-underline-offset:2px; }
        .cx-clear-link:hover { color: var(--accent-deep); }

        .cx-error { color: var(--danger); font-size:12.5px; margin-top:9px; display:flex; align-items:center; gap:6px; }

        .cx-tabs { display:flex; gap:6px; margin-bottom:18px; }
        .cx-tab {
          display:flex; align-items:center; gap:6px; padding:8px 14px;
          background: var(--panel-solid); border:1px solid var(--hairline); border-radius:999px;
          color:var(--ink-soft); font-size:13px; font-weight:500; cursor:pointer; transition: all .18s;
        }
        .cx-tab:hover { border-color: var(--accent); color: var(--accent-deep); }
        .cx-tab-active { background: linear-gradient(135deg, var(--accent), var(--accent-deep)); border-color: transparent; color:#fff; font-weight:700; box-shadow: 0 8px 18px -10px var(--shadow-color); }

        .cx-responses-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:10px; }
        .cx-mode-badge { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; padding:5px 12px; border-radius:999px; }
        .cx-mode-ai { background: var(--accent-soft); color: var(--accent-deep); }
        .cx-mode-template { background: var(--teal-soft); color: var(--teal); }

        .cx-action-btn { display:inline-flex; align-items:center; gap:6px; border:1px solid var(--hairline); background:var(--panel-solid); border-radius:10px; padding:8px 13px; font-size:12.5px; font-weight:500; color:var(--ink); cursor:pointer; transition: all .15s; }
        .cx-action-btn:hover { border-color: var(--accent); color: var(--accent-deep); }
        .cx-action-row { display:flex; gap:8px; }

        .cx-empty { color:var(--ink-soft); font-size:13.5px; padding:44px 10px; text-align:center; border:1px dashed var(--hairline); border-radius:16px; }

        .cx-card {
          border:1px solid var(--hairline); border-radius:16px; padding:18px 20px; margin-bottom:14px;
          background: var(--panel-solid);
          box-shadow: 0 10px 24px -22px var(--shadow-color);
          transition: box-shadow .18s, transform .18s, background-color .35s;
        }
        .cx-card:hover { box-shadow: 0 16px 32px -18px var(--shadow-color); transform: translateY(-2px); }
        .cx-card-head { display:flex; align-items:center; margin-bottom:10px; }
        .cx-card-index {
          font-size:11px; font-weight:700; letter-spacing:0.02em; color: var(--accent-deep);
          background: var(--accent-soft); padding:4px 10px; border-radius:999px;
        }
        .generated-response { font-family: Verdana, sans-serif; font-size: 10px; line-height: 1.5; text-align: justify; color: #000000; white-space: pre-wrap; background:#fff; border-radius:10px; padding:12px; }
        .cx-theme-dark .generated-response { background:#1E1F31; color:#ECEBF5; border:1px solid rgba(255,255,255,0.08); }
        .generated-response-edit { font-family: Verdana, sans-serif; font-size: 10px; line-height: 1.5; text-align: justify; color: #000000; width:100%; min-height:90px; border:1px solid var(--hairline); border-radius:10px; padding:12px; resize:vertical; background:#fff; }
        .cx-theme-dark .generated-response-edit { background:#1E1F31; color:#ECEBF5; border-color:var(--hairline); }
        .cx-theme-dark .cx-search-input { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%239B99B0' stroke-width='2' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>"); }
        .cx-theme-dark .cx-chip { color:var(--ink-soft); background:var(--field-bg); }
        .cx-theme-dark .cx-tab { background:var(--panel-solid); }
        .cx-theme-dark option { background-color: #171829; color: #ECEBF5; }
        .cx-theme-dark .jr-card-summary { background: linear-gradient(135deg, rgba(156,141,255,0.14), #171829); border-color: rgba(156,141,255,0.32); }
        .cx-theme-dark .jr-card-notes { background: linear-gradient(135deg, rgba(255,148,120,0.14), #171829); border-color: rgba(255,148,120,0.32); }
        .cx-theme-dark .jr-card-customer { background: linear-gradient(135deg, rgba(63,220,182,0.14), #171829); border-color: rgba(63,220,182,0.32); }
        .cx-theme-dark .jr-crumb { background: rgba(156,141,255,0.18); color: #C5BCFF; border-color: rgba(156,141,255,0.3); }
        .cx-theme-dark .jr-step-row { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
        .cx-theme-dark .jr-source-card { background: #171829; border-color: rgba(255,255,255,0.10); }
        .cx-theme-dark .jr-source-card:hover { border-color: var(--accent); background: #1E2038; }

        .cx-card-actions { display:flex; gap:8px; margin-top:13px; flex-wrap:wrap; }
        .cx-card-btn { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:500; padding:6px 11px; border-radius:9px; border:1px solid var(--hairline); background:var(--panel-solid); color:var(--ink-soft); cursor:pointer; transition: all .15s; }
        .cx-card-btn:hover { border-color: var(--accent); color:var(--accent-deep); background: var(--accent-soft); }
        .cx-card-btn.done { border-color: var(--teal); color: var(--teal); background: var(--teal-soft); }

        .cx-search-row { display:flex; gap:8px; margin-bottom:12px; }
        .cx-search-input { flex:1; border:1px solid var(--hairline); border-radius:12px; padding:10px 12px 10px 34px; font-size:13.5px; background:var(--field-bg) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%236E6C82' stroke-width='2' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>") no-repeat 11px center; color:var(--ink); transition: border-color .15s; }
        .cx-search-input:focus { outline:none; border-color: var(--accent); }
        .cx-cat-filters { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
        .cx-cat-chip { font-size:11.5px; padding:5px 11px; border-radius:999px; border:1px solid var(--hairline); background:var(--panel-solid); color:var(--ink-soft); cursor:pointer; transition: all .15s; }
        .cx-cat-chip.active { background: linear-gradient(135deg, var(--accent), var(--accent-deep)); color:#fff; border-color: transparent; }

        .cx-template-item { border:1px solid var(--hairline); border-radius:14px; padding:14px 16px; margin-bottom:11px; background:var(--panel-solid); box-shadow: 0 8px 18px -18px var(--shadow-color); transition: box-shadow .15s; }
        .cx-template-item:hover { box-shadow: 0 12px 24px -16px var(--shadow-color); }
        .cx-template-top { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
        .cx-template-name { font-weight:700; font-size:13.5px; color:var(--ink); }
        .cx-template-cat { font-size:11px; font-weight:600; color:var(--accent-deep); background:var(--accent-soft); padding:3px 9px; border-radius:999px; display:inline-block; margin-top:5px; }
        .cx-template-content { font-size:12.5px; color:var(--ink-soft); margin-top:9px; line-height:1.55; }
        .cx-icon-btn { border:none; background:none; color:var(--ink-soft); cursor:pointer; padding:5px; border-radius:8px; transition: all .15s; }
        .cx-icon-btn:hover { color: var(--accent-deep); background: var(--accent-soft); }
        .cx-template-edit-input { width:100%; border:1px solid var(--hairline); border-radius:10px; padding:8px 10px; font-size:13px; margin-top:6px; font-family:inherit; background:var(--field-bg); color:var(--ink); }

        .cx-history-item { border:1px solid var(--hairline); border-radius:14px; padding:13px 15px; margin-bottom:11px; cursor:pointer; background:var(--panel-solid); box-shadow: 0 8px 18px -18px var(--shadow-color); transition: all .15s; }
        .cx-history-item:hover { border-color: var(--accent); box-shadow: 0 12px 24px -16px var(--shadow-color); transform: translateY(-1px); }
        .cx-history-top { display:flex; justify-content:space-between; font-size:11.5px; color:var(--ink-soft); margin-bottom:6px; }
        .cx-history-summary { font-size:13px; color:var(--ink); }

        .cx-modal-backdrop { position:fixed; inset:0; background:rgba(14,15,22,0.5); backdrop-filter: blur(4px); display:flex; align-items:center; justify-content:center; z-index:50; padding:20px; }
        .cx-modal { background:var(--panel-solid); border-radius:20px; padding:24px; width:100%; max-width:420px; box-shadow: 0 30px 60px -20px rgba(0,0,0,0.5); border:1px solid var(--hairline); }
        .cx-modal h3 { margin:0 0 16px 0; font-size:16px; font-family:'Manrope', sans-serif; font-weight:800; color:var(--ink); }
        .cx-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:18px; }
        .cx-btn-secondary { border:1px solid var(--hairline); background:var(--panel-solid); color:var(--ink); padding:9px 15px; border-radius:10px; font-size:13px; cursor:pointer; transition: border-color .15s; }
        .cx-btn-secondary:hover { border-color: var(--accent); }
        .cx-btn-primary { border:none; background: linear-gradient(135deg, var(--accent), var(--accent-deep)); color:#fff; padding:9px 15px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; box-shadow: 0 8px 18px -10px var(--shadow-color); }
        .cx-btn-primary:disabled { opacity:0.6; cursor:default; }

        .jr-answer-text { font-size:14px; line-height:1.65; color:var(--ink); white-space:pre-wrap; }
        .jr-sources { margin-top:18px; padding-top:14px; border-top:1px solid var(--hairline-soft); display:flex; flex-direction:column; gap:6px; }
        .jr-source-link { display:inline-flex; align-items:center; gap:6px; font-size:12.5px; color: var(--accent-deep); text-decoration:none; padding:6px 10px; border-radius:9px; background: var(--accent-soft); width:fit-content; transition: all .15s; }
        .jr-source-link:hover { background: var(--accent); color:#fff; }

        /* ---------- Ambient background motion ---------- */
        .cx-root { background-size: 140% 140%; animation: cx-bg-drift 22s ease-in-out infinite alternate; }
        @keyframes cx-bg-drift {
          0%   { background-position: 0% 0%, 100% 0%, 0 0; }
          100% { background-position: 6% 4%, 94% 8%, 0 0; }
        }

        /* ---------- App shell entrance ---------- */
        .cx-shell { opacity: 0; }
        .cx-shell-in { opacity: 1; animation: cx-shell-in .55s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes cx-shell-in {
          from { opacity: 0; transform: translateY(10px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ---------- Splash screen ---------- */
        .cx-splash {
          position: fixed; inset: 0; z-index: 999;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 18px; padding: 32px; text-align: center;
          background: radial-gradient(900px 560px at 50% 20%, #2A2350 0%, #15112B 55%, #0B0918 100%);
          color: #F2EFFF;
          opacity: 1; transition: opacity .45s ease;
        }
        .cx-splash-exit { opacity: 0; pointer-events: none; }
        .cx-splash-glow {
          position: absolute; top: 14%; left: 50%; width: 420px; height: 420px;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(156,141,255,0.35), transparent 70%);
          filter: blur(10px);
          animation: cx-splash-pulse 3.2s ease-in-out infinite;
        }
        @keyframes cx-splash-pulse {
          0%, 100% { opacity: 0.55; transform: translateX(-50%) scale(1); }
          50%      { opacity: 0.9;  transform: translateX(-50%) scale(1.08); }
        }
        .cx-splash-mark {
          position: relative; width: 56px; height: 56px; border-radius: 16px;
          display:flex; align-items:center; justify-content:center;
          background: linear-gradient(135deg, #9C8DFF, #FF9478);
          box-shadow: 0 14px 30px -10px rgba(124,107,255,0.55);
        }
        .cx-splash-brand { position: relative; font-family:'Manrope', sans-serif; font-weight:800; font-size:19px; letter-spacing:0.02em; color:#fff; }
        .cx-splash-quote { position: relative; max-width: 520px; min-height: 92px; display:flex; flex-direction:column; justify-content:center; gap:8px; opacity: 0; transform: translateY(6px); transition: opacity .38s ease, transform .38s ease; }
        .cx-splash-quote-in { opacity: 1; transform: translateY(0); }
        .cx-splash-quote-text { font-family:'Manrope', sans-serif; font-size:17px; font-weight:600; line-height:1.5; margin:0; color:#F2EFFF; }
        .cx-splash-quote-author { font-size:12.5px; color: rgba(242,239,255,0.62); margin:0; letter-spacing:0.02em; }
        .cx-splash-dots { position: relative; display:flex; gap:6px; margin-top:6px; }
        .cx-splash-dots span { width:6px; height:6px; border-radius:50%; background: rgba(242,239,255,0.35); animation: cx-splash-dot 1.2s ease-in-out infinite; }
        .cx-splash-dots span:nth-child(2) { animation-delay: .15s; }
        .cx-splash-dots span:nth-child(3) { animation-delay: .3s; }
        @keyframes cx-splash-dot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40%           { opacity: 1;   transform: scale(1.15); }
        }

        /* ---------- Jr SME Super Attractive Output Styles ---------- */
        .jr-response-container {
          display: flex; flex-direction: column; gap: 16px;
          animation: jr-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes jr-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .jr-response-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 10px; margin-bottom: 4px;
        }
        .jr-badge-group { display: flex; align-items: center; gap: 8px; }
        .jr-header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

        .jr-customer-draft-btn {
          background: linear-gradient(135deg, var(--teal-soft), var(--panel-solid));
          border-color: var(--teal); color: var(--teal); font-weight: 600;
        }
        .jr-customer-draft-btn:hover {
          background: var(--teal); color: #fff; border-color: var(--teal);
        }

        .jr-sections { display: flex; flex-direction: column; gap: 14px; }

        .jr-section-card {
          border: 1px solid var(--hairline);
          border-radius: 16px;
          padding: 18px 20px;
          background: var(--panel-solid);
          box-shadow: 0 10px 26px -20px var(--shadow-color);
          transition: all 0.2s ease;
        }
        .jr-section-card:hover {
          box-shadow: 0 16px 36px -18px var(--shadow-color);
          border-color: var(--hairline);
        }

        .jr-card-summary {
          background: linear-gradient(135deg, var(--accent-soft), var(--panel-solid));
          border-color: rgba(108, 92, 231, 0.25);
        }
        .jr-card-steps {
          border-left: 4px solid var(--accent);
        }
        .jr-card-notes {
          background: linear-gradient(135deg, var(--warm-soft), var(--panel-solid));
          border-color: rgba(255, 122, 89, 0.25);
        }
        .jr-card-customer {
          background: linear-gradient(135deg, var(--teal-soft), var(--panel-solid));
          border: 1px solid rgba(18, 150, 125, 0.3);
          box-shadow: 0 12px 28px -18px rgba(18, 150, 125, 0.25);
        }

        .jr-section-title {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 15px;
          color: var(--ink); margin-bottom: 12px;
        }
        .jr-sec-icon { color: var(--accent-deep); flex-shrink: 0; }
        .jr-card-notes .jr-sec-icon { color: var(--warm-deep); }
        .jr-card-customer .jr-sec-icon { color: var(--teal); }

        .jr-section-body { display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; line-height: 1.6; color: var(--ink); }

        .jr-para { margin: 0; }

        .jr-bold { color: var(--ink); font-weight: 700; }
        .jr-code {
          font-family: monospace; font-size: 12.5px; background: var(--accent-soft);
          color: var(--accent-deep); padding: 2px 7px; border-radius: 6px;
        }

        .jr-codeblock-card {
          margin: 10px 0; border-radius: 12px; overflow: hidden;
          border: 1px solid var(--hairline); background: #121324; color: #ECEBF5;
          box-shadow: 0 8px 20px -14px rgba(0,0,0,0.5);
        }
        .jr-codeblock-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 14px; background: rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.08); font-family: monospace; font-size: 11px;
        }
        .jr-codeblock-lang { font-weight: 700; color: #9C8DFF; text-transform: uppercase; letter-spacing: 0.04em; }
        .jr-codeblock-copy {
          display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15); color: #ECEBF5; padding: 4px 9px;
          border-radius: 6px; font-size: 11.5px; cursor: pointer; transition: all 0.15s;
        }
        .jr-codeblock-copy:hover { background: #9C8DFF; color: #fff; border-color: #9C8DFF; }
        .jr-codeblock-pre {
          margin: 0; padding: 14px 16px; overflow-x: auto; font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 13px; line-height: 1.55; white-space: pre; tab-size: 2; color: #F0F4FF;
        }

        .jr-json-card {
          border: 1px solid var(--hairline); border-radius: 16px; padding: 18px 20px;
          background: var(--panel-solid); box-shadow: 0 10px 28px -20px var(--shadow-color);
          margin-bottom: 14px;
        }
        .jr-json-header {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
          margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--hairline-soft);
        }
        .jr-json-title-group { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; color: var(--ink); }
        .jr-json-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: var(--teal-soft); color: var(--teal); }
        .jr-json-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .jr-json-pre {
          margin: 0; padding: 16px; border-radius: 12px; background: #121324; color: #A6E22E;
          font-family: monospace; font-size: 13px; line-height: 1.55; overflow-x: auto; white-space: pre;
          border: 1px solid rgba(255,255,255,0.08);
        }


        .jr-nav-crumbs {
          display: inline-flex; align-items: center; gap: 4px; flex-wrap: wrap;
          margin: 2px 0;
        }
        .jr-crumb {
          font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 6px;
          background: var(--accent-soft); color: var(--accent-deep);
          border: 1px solid rgba(108, 92, 231, 0.15);
        }
        .jr-crumb-arrow { font-size: 10px; color: var(--ink-soft); }

        .jr-step-row {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 8px 12px; border-radius: 12px; background: var(--field-bg);
          border: 1px solid var(--hairline-soft);
          transition: transform 0.15s;
        }
        .jr-step-row:hover { transform: translateX(2px); border-color: var(--hairline); }

        .jr-step-badge {
          width: 24px; height: 24px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-deep));
          color: #fff; font-weight: 700; font-size: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
          box-shadow: 0 4px 10px -4px var(--shadow-color);
        }

        .jr-bullet-row {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 4px 6px;
        }
        .jr-bullet-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); margin-top: 8px; flex-shrink: 0;
        }

        .jr-sources-section {
          margin-top: 10px; padding-top: 14px; border-top: 1px solid var(--hairline);
        }
        .jr-sources-title {
          font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
          color: var(--ink-soft); text-transform: uppercase; margin-bottom: 12px;
          display: flex; align-items: center; gap: 6px;
        }
        .jr-sources-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px;
        }
        .jr-source-card {
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 14px 16px; border-radius: 14px; border: 1px solid var(--hairline);
          background: var(--panel-solid); text-decoration: none; color: inherit;
          min-height: 110px; box-shadow: 0 6px 16px -14px var(--shadow-color);
          transition: all 0.2s ease; overflow: hidden;
        }
        .jr-source-card:hover {
          border-color: var(--accent); transform: translateY(-2px);
          box-shadow: 0 12px 24px -14px var(--shadow-color);
        }
        .jr-source-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .jr-source-tag { font-size: 10.5px; font-weight: 700; color: var(--accent-deep); background: var(--accent-soft); padding: 3px 9px; border-radius: 999px; }
        .jr-source-ext { color: var(--ink-soft); transition: color 0.15s; }
        .jr-source-card:hover .jr-source-ext { color: var(--accent); }
        .jr-source-title { font-weight: 700; font-size: 13px; color: var(--ink); line-height: 1.45; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
        .jr-source-url { font-size: 11px; color: var(--ink-soft); font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }


        /* ---------- Skeleton Loader ---------- */
        .jr-skeleton-container { display: flex; flex-direction: column; gap: 14px; padding: 10px 0; }
        .jr-skeleton-header { display: flex; justify-content: space-between; }
        .jr-skeleton-pill, .jr-skeleton-card {
          border-radius: 14px;
          background: linear-gradient(90deg, var(--hairline-soft) 25%, var(--hairline) 50%, var(--hairline-soft) 75%);
          background-size: 200% 100%;
          animation: jr-shimmer 1.5s infinite;
        }
        @keyframes jr-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {showSplash && <SplashScreen exiting={splashExiting} />}

      <div className={`cx-shell${!showSplash ? " cx-shell-in" : ""}`}>
        <div className="cx-header">
          <div className="cx-header-inner">
            <div className="cx-brand">
              <span className="cx-brand-mark"><HeartHandshake size={19} /></span>
              <div>
                <h1 className="cx-title">Z-Client</h1>
                <p className="cx-subtitle">Turn your support notes into customer-ready responses.</p>
              </div>
            </div>
          </div>
          <div className="cx-header-actions">
            <button className="cx-icon-toggle" onClick={toggleTheme} type="button" aria-label="Toggle theme">
              {prefs.theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="cx-icon-toggle" onClick={() => setSettingsOpen(s => !s)} type="button" aria-label="Settings">
              <Settings size={17} />
            </button>
          </div>
        </div>

        {settingsOpen && (
          <div className="cx-settings-panel">
            <h3>Settings</h3>
            <div className="cx-toggle-row">
              <span>Use AI generation when available (falls back to the built-in template engine automatically)</span>
              <div className={`cx-switch ${prefs.aiEnabled ? "on" : ""}`} onClick={() => toggleAI(!prefs.aiEnabled)} />
            </div>
          </div>
        )}

        <div className="cx-tabs" style={{ marginBottom: 22 }}>
          <TabButton active={appView === "client"} onClick={() => setAppView("client")} icon={ClipboardList}>Client Response</TabButton>
          <TabButton active={appView === "jrsme"} onClick={() => setAppView("jrsme")} icon={GraduationCap}>Jr SME</TabButton>
        </div>

        {appView === "client" && (
        <div className="cx-grid">
          {/* LEFT: compose panel */}
          <div className="cx-panel">
            <Field label="What do you want to tell the customer?">
              <textarea
                ref={textareaRef}
                className="cx-textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Example: Customer is frustrated because backend team has not provided an update. Apologize for the delay and assure them that we will update them at the earliest."
              />
            </Field>

            <div className="cx-chips">
              {QUICK_KEYWORDS.map(kw => (
                <button key={kw} className="cx-chip" type="button" onClick={() => addKeywordChip(kw)}>{kw}</button>
              ))}
            </div>

            <div className="cx-row2">
              <Field label="Situation">
                <select className="cx-select" value={situation} onChange={e => setSituation(e.target.value)}>
                  {SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Tone">
                <select className="cx-select" value={tone} onChange={e => setTone(e.target.value)}>
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Number of responses">
              <div className="cx-segmented">
                {[3, 4, 5].map(n => (
                  <button key={n} type="button" className={`cx-seg-btn ${count === n ? "active" : ""}`} onClick={() => setCount(n)}>{n}</button>
                ))}
              </div>
            </Field>

            <button className="cx-generate-btn" onClick={handleGenerate} disabled={generating} type="button">
              {generating ? <RefreshCw size={16} className="cx-spin" /> : <Send size={16} />}
              {generating ? "Generating…" : "Generate Responses"}
            </button>
            {errorNote && <div className="cx-error"><AlertCircle size={14} /> {errorNote}</div>}
            <button className="cx-clear-link" onClick={handleClear} type="button">Clear</button>
          </div>

          {/* RIGHT: tabs */}
          <div>
            <div className="cx-tabs">
              <TabButton active={rightTab === "responses"} onClick={() => setRightTab("responses")} icon={ClipboardList}>Responses</TabButton>
              <TabButton active={rightTab === "templates"} onClick={() => setRightTab("templates")} icon={FileStack}>My Templates</TabButton>
              <TabButton active={rightTab === "history"} onClick={() => setRightTab("history")} icon={HistoryIcon}>Recent Responses</TabButton>
            </div>

            {rightTab === "responses" && (
              <div>
                <div className="cx-responses-header">
                  <div>
                    {mode && (
                      <span className={`cx-mode-badge ${mode === "ai" ? "cx-mode-ai" : "cx-mode-template"}`}>
                        <Sparkles size={12} /> {mode === "ai" ? "AI Mode" : "Template Mode"}
                      </span>
                    )}
                  </div>
                  {responses.length > 0 && (
                    <div className="cx-action-row">
                      <button className="cx-action-btn" onClick={handleCopyAll} type="button">
                        {copiedAll ? <Check size={14} /> : <Copy size={14} />} Copy All
                      </button>
                      <button className="cx-action-btn" onClick={handleRegenerateAll} type="button" disabled={generating}>
                        <RefreshCw size={14} /> Regenerate All
                      </button>
                    </div>
                  )}
                </div>

                {responses.length === 0 && !generating && (
                  <div className="cx-empty">Enter a few notes on the left and click Generate to see responses here.</div>
                )}

                {responses.map((r, idx) => (
                  <div className="cx-card" key={r.id}>
                    <div className="cx-card-head">
                      <span className="cx-card-index">Response {idx + 1}</span>
                    </div>
                    {r.editing ? (
                      <textarea
                        className="generated-response-edit"
                        value={r.draft}
                        onChange={e => updateDraft(r.id, e.target.value)}
                      />
                    ) : (
                      <div className="generated-response">{r.text}</div>
                    )}
                    <div className="cx-card-actions">
                      {r.editing ? (
                        <button className="cx-card-btn done" onClick={() => commitEdit(r.id)} type="button"><Check size={13} /> Done</button>
                      ) : (
                        <>
                          <button className="cx-card-btn" onClick={() => handleCopy(r.id, r.text)} type="button">
                            {copiedId === r.id ? <Check size={13} /> : <Copy size={13} />} {copiedId === r.id ? "Copied!" : "Copy"}
                          </button>
                          <button className="cx-card-btn" onClick={() => handleRegenerateOne(r.id)} type="button" disabled={regeneratingId === r.id}>
                            <RefreshCw size={13} className={regeneratingId === r.id ? "cx-spin" : ""} /> Regenerate
                          </button>
                          <button className="cx-card-btn" onClick={() => toggleEdit(r.id)} type="button">
                            <Pencil size={13} /> Edit
                          </button>
                          <button className="cx-card-btn" onClick={() => openSaveModal(r.text)} type="button">
                            <Save size={13} /> Save as template
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rightTab === "templates" && (
              <div className="cx-panel">
                <div className="cx-search-row">
                  <input className="cx-search-input" placeholder="Search templates..." value={templateSearch} onChange={e => setTemplateSearch(e.target.value)} />
                </div>
                <div className="cx-cat-filters">
                  {["All", ...CATEGORIES].map(c => (
                    <button key={c} className={`cx-cat-chip ${templateCategoryFilter === c ? "active" : ""}`} onClick={() => setTemplateCategoryFilter(c)} type="button">{c}</button>
                  ))}
                </div>

                {loaded && filteredTemplates.length === 0 && (
                  <div className="cx-empty">No templates yet. Save a generated response to build your library.</div>
                )}

                {filteredTemplates.map(t => (
                  <div className="cx-template-item" key={t.id}>
                    {editingTemplateId === t.id ? (
                      <div>
                        <input className="cx-template-edit-input" value={editingTemplateDraft.name} onChange={e => setEditingTemplateDraft(d => ({ ...d, name: e.target.value }))} />
                        <select className="cx-select" style={{ marginTop: 6 }} value={editingTemplateDraft.category} onChange={e => setEditingTemplateDraft(d => ({ ...d, category: e.target.value }))}>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <textarea className="cx-textarea" style={{ marginTop: 6, minHeight: 80 }} value={editingTemplateDraft.content} onChange={e => setEditingTemplateDraft(d => ({ ...d, content: e.target.value }))} />
                        <div className="cx-modal-actions">
                          <button className="cx-btn-secondary" onClick={() => setEditingTemplateId(null)} type="button">Cancel</button>
                          <button className="cx-btn-primary" onClick={saveEditTemplate} type="button">Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="cx-template-top">
                          <div>
                            <div className="cx-template-name">{t.name}</div>
                            <span className="cx-template-cat">{t.category}</span>
                          </div>
                          <div style={{ display: "flex", gap: 2 }}>
                            <button className="cx-icon-btn" onClick={() => handleCopy(t.id, t.content)} type="button">
                              {copiedId === t.id ? <Check size={15} /> : <Copy size={15} />}
                            </button>
                            <button className="cx-icon-btn" onClick={() => startEditTemplate(t)} type="button"><Pencil size={15} /></button>
                            <button className="cx-icon-btn" onClick={() => deleteTemplate(t.id)} type="button"><Trash2 size={15} /></button>
                          </div>
                        </div>
                        <div className="cx-template-content">{t.content}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {rightTab === "history" && (
              <div className="cx-panel">
                {loaded && history.length === 0 && (
                  <div className="cx-empty">Nothing generated yet — your recent responses will show up here.</div>
                )}
                {history.map(h => (
                  <div className="cx-history-item" key={h.id} onClick={() => reopenHistory(h)}>
                    <div className="cx-history-top">
                      <span><Clock size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />{formatTime(h.timestamp)}</span>
                      <span>{h.situation} · {h.tone}</span>
                    </div>
                    <div className="cx-history-summary">{h.input.length > 90 ? h.input.slice(0, 90) + "…" : h.input}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {appView === "jrsme" && (
        <div className="cx-grid">
          {/* LEFT: ask panel */}
          <div className="cx-panel">
            <Field label="Describe the issue or question, in your own words">
              <textarea
                className="cx-textarea"
                value={jrQuery}
                onChange={e => setJrQuery(e.target.value)}
                placeholder="Example: Customer says custom fields aren't showing up when they import leads in Zoho CRM — how do I fix the mapping?"
              />
            </Field>

            <Field label="Zoho application (optional — leave blank to auto-detect)">
              <select className="cx-select" value={jrApp} onChange={e => setJrApp(e.target.value)}>
                <option value="">Auto-detect from question</option>
                {Object.entries(ZOHO_HELP_CATEGORIES).map(([cat, apps]) => (
                  <optgroup label={cat} key={cat}>
                    {apps.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>

            <button className="cx-generate-btn" onClick={handleAskJrSME} disabled={jrLoading} type="button">
              {jrLoading ? <RefreshCw size={16} className="cx-spin" /> : <GraduationCap size={16} />}
              {jrLoading ? "Looking this up…" : "Ask Jr SME"}
            </button>
            {jrError && <div className="cx-error"><AlertCircle size={14} /> {jrError}</div>}
            <button className="cx-clear-link" onClick={handleClearJrSME} type="button">Clear</button>
          </div>

          {/* RIGHT: answer + recent questions */}
          <div>
            <div className="cx-panel">
              {!jrAnswer && !jrLoading && (
                <div className="cx-empty">Ask a product question and Jr SME will look it up in Zoho's official help documentation.</div>
              )}
              {jrLoading && <JrSMESkeleton />}
              {jrAnswer && !jrLoading && (
                <JrSMEResponseView answer={jrAnswer} />
              )}
            </div>

            {jrHistory.length > 0 && (
              <div className="cx-panel" style={{ marginTop: 16 }}>
                <div className="cx-field-label" style={{ marginBottom: 10 }}>Recent questions</div>
                {jrHistory.map(h => (
                  <div className="cx-history-item" key={h.id} onClick={() => reopenJrHistory(h)}>
                    <div className="cx-history-top">
                      <span><Clock size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />{formatTime(h.timestamp)}</span>
                      <span>{h.appName || "Auto-detected"}</span>
                    </div>
                    <div className="cx-history-summary">{h.query.length > 90 ? h.query.slice(0, 90) + "…" : h.query}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {saveModal && (
        <div className="cx-modal-backdrop" onClick={() => setSaveModal(null)}>
          <div className="cx-modal" onClick={e => e.stopPropagation()}>
            <h3>Save as template</h3>
            <Field label="Template name">
              <input className="cx-template-edit-input" autoFocus value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="e.g. Backend Delay – Professional" />
            </Field>
            <Field label="Category">
              <select className="cx-select" value={saveCategory} onChange={e => setSaveCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <div className="cx-modal-actions">
              <button className="cx-btn-secondary" onClick={() => setSaveModal(null)} type="button">Cancel</button>
              <button className="cx-btn-primary" onClick={confirmSaveTemplate} type="button" disabled={!saveName.trim()}>Save</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cx-spin { animation: cx-spin 0.9s linear infinite; }
        @keyframes cx-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
