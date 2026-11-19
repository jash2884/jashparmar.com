// Shared, factual content for every portfolio concept. Do not invent facts.
// Images (full-page screenshots, 1280px wide, tall) live in ./img/<k>.webp. workflow.webp is a 1024x499 card.
export const PROJECTS = [
  { k: 'crate', t: 'Crate', hook: 'a record crate for your own files', img: 'img/crate.webp', c: '#ff6a2b',
    d: 'Your own music files, turned into a 3D record crate and a turntable you can actually scratch. Nothing is uploaded; it all runs on your device.',
    b: ['Tag parsers written from scratch for ID3, FLAC, Ogg, MP4 and WAV.', 'A variable-rate audio engine with motor physics, plus Spotify, Audius, radio and concert-archive sources.'],
    s: 'JavaScript · Web Audio · IndexedDB · PWA · Spotify Web API', l: [['Open Crate', 'https://crate.jashparmar.com']] },
  { k: 'tonight', t: 'Tonight, Everywhere', hook: 'one question for the whole world', img: 'img/tonight.webp', c: '#e3a320',
    d: 'One question a day for the whole world. Answer in a single line and your light appears on a night globe beside everyone else’s.',
    b: ['Anonymous answers are checked by Llama Guard before they are allowed to glow.', 'A dotted globe on 2D canvas with a real sun terminator, backed by a Cloudflare Worker and D1.'],
    s: 'JavaScript · Canvas · Cloudflare Workers · D1 · Workers AI', l: [['Light it', 'https://tonight.jashparmar.com']] },
  { k: 'drape', t: 'Drape', hook: 'Shazam, but for outfits', img: 'img/drape.webp', c: '#e5487f',
    d: 'Screenshot any look and Drape finds every piece, the exact item for sale and cheaper lookalikes.',
    b: ['Clothing parsing, SAM and a fashion embedding model run on the device in a Web Worker.', 'Lookalikes from a 9,257-product vector catalogue searched on the phone; a Chrome extension shares the engine.'],
    s: 'JavaScript · Transformers.js · WebAssembly · Cloudflare Workers · D1', l: [['Try Drape', 'https://drape.jashparmar.com'], ['Code', 'https://github.com/jash2884/drape']] },
  { k: 'wrapped', t: 'Chat Wrapped', hook: 'your group chat, wrapped', img: 'img/wrapped.webp', c: '#1fae5b',
    d: 'Spotify Wrapped for your WhatsApp and Telegram chats, analysed entirely on your device: a 20-slide story, a title for every member and a guess-who quiz.',
    b: ['Opens straight from WhatsApp’s share menu as an installable app.', 'An anonymised AI verdict with a model fallback chain, and cookieless analytics.'],
    s: 'JavaScript · Web Workers · PWA · Cloudflare Workers · Gemini', l: [['Wrap a chat', 'https://wrapped.jashparmar.com'], ['Code', 'https://github.com/jash2884/chat-wrapped']] },
  { k: 'stepwise', t: 'Stepwise', hook: 'see every step of the algorithm', img: 'img/stepwise.webp', c: '#4d6bff',
    d: '62 step-by-step visualisers for DSA, operating systems, databases, networks, automata and compilers, with GATE-style practice.',
    b: ['Live pseudocode and variables on every step, with optional three.js 3D views.', 'An AI tutor for the step on screen, and 350+ textbook and fuzz tests.'],
    s: 'JavaScript · Three.js · SVG · Workers AI · Cloudflare', l: [['Learn a step', 'https://stepwise.jashparmar.com'], ['Code', 'https://github.com/jash2884/stepwise']] },
  { k: 'agentproof', t: 'AgentProof', hook: 'evidence before every release', img: 'img/agentproof.webp', c: '#119c8b',
    d: 'Release checks for teams shipping AI agents: import traces, assert business policies, compare versions and block unsafe releases in CI.',
    b: ['Required and forbidden tool calls, latency and cost budgets as deterministic rules.', 'Tenant workspaces with roles, audit history and revocable tokens.'],
    s: 'TypeScript · Transformers.js · Web Workers', l: [['See it', 'https://agentproof.jashparmar.com'], ['Code', 'https://github.com/jash2884/agentproof']] },
  { k: 'slotwise', t: 'SlotWise', hook: 'no double bookings, ever', img: 'img/slotwise.webp', c: '#3e7d3a',
    d: 'Mentor scheduling with authenticated booking, timezone-aware availability and double-booking blocked by the database itself.',
    b: ['Idempotent retries return the original booking, even when sent at the same moment.', 'Transactional audit events and a CI pipeline.'],
    s: 'React · TypeScript · Cloudflare Workers · D1 · GitHub Actions', l: [['Book a slot', 'https://slotwise.jashparmar.com'], ['Code', 'https://github.com/jash2884/slotwise']] },
  { k: 'workflow', t: 'Workflow Builder', hook: 'LLM pipelines on a canvas', img: 'img/workflow.webp', c: '#7c4dff',
    d: 'Compose multi-step LLM and media workflows on a node-based canvas, then run a single node or the whole flow.',
    b: ['Six typed node types with data passed along their connections.', 'Run states and history in Zustand, on React Flow v12.'],
    s: 'React · TypeScript · React Flow · Zustand · Tailwind CSS', l: [['Open it', 'https://workflow-builder-tawny-rho.vercel.app/'], ['Code', 'https://github.com/jash2884/workflow-builder']] },
];

// How each project works, six steps each: [title, note]
export const HOW = {
  crate: [['Your music files', 'nothing uploaded'], ['Tag parsers', 'ID3 · FLAC · Ogg · MP4 · WAV'], ['IndexedDB', 'library on the device'], ['Audio engine', 'variable rate, motor physics'], ['Turntable UI', 'scratch, pitch, crate'], ['More sources', 'Spotify · Audius · radio · archive']],
  tonight: [['One question', 'the same for everyone'], ['Your answer', 'one line, anonymous'], ['Cloudflare Worker', 'rate limits, checks'], ['Llama Guard', 'unsafe answers never glow'], ['D1', 'tonight’s lights'], ['Night globe', 'canvas + real sun terminator']],
  drape: [['A screenshot', 'any look, any app'], ['Web Worker', 'off the main thread'], ['Clothing parser + SAM', 'every garment, cut out'], ['Fashion embeddings', 'one vector per piece'], ['Vector search', '9,257 products, on the phone'], ['Item + lookalikes', 'shop links']],
  wrapped: [['Chat export', 'WhatsApp · Telegram'], ['Parser', 'formats, dates, media lines'], ['Stats worker', 'who talks, who replies, when'], ['20-slide story', 'titles for every member'], ['Anonymised numbers', 'no names, no messages'], ['AI verdict', 'model fallback chain']],
  stepwise: [['Pick an algorithm', '62 visualisers'], ['Step engine', 'every state recorded'], ['Pseudocode + state', 'the line being run'], ['SVG / three.js view', '2D or 3D'], ['AI tutor', 'about the step on screen'], ['350+ tests', 'textbook + fuzz']],
  agentproof: [['Agent traces', 'imported runs'], ['Policy rules', 'required + forbidden tool calls'], ['Budgets', 'latency and cost'], ['Compare versions', 'what changed'], ['CI gate', 'block unsafe releases'], ['Audit history', 'roles, revocable tokens']],
  slotwise: [['Booking request', 'timezone aware'], ['Auth', 'signed session'], ['Idempotency key', 'retries return the same booking'], ['D1 constraint', 'double booking impossible'], ['Audit event', 'same transaction'], ['CI pipeline', 'tested on every push']],
  workflow: [['Canvas', 'React Flow v12'], ['Six typed nodes', 'LLM and media'], ['Edges carry data', 'typed connections'], ['Run a node', 'or the whole flow'], ['Run states', 'Zustand history'], ['Results', 'inline, per node']],
};

export const EXPERIENCE = [
  { when: 'Oct 2026 · now', role: 'Software Developer', org: 'Flitzen Technologies UK', key: '13+', keyLabel: 'client sites rebuilt', what: 'Rebuilt 13+ client websites from WordPress, Elementor and Squarespace into fast, database-free PHP, and ship features on clients’ live CodeIgniter ERP, CRM and staff portals.' },
  { when: 'Jul · Oct 2026', role: 'Advanced AI Engineer', org: 'Crossing Hurdles', key: '11/14', keyLabel: 'tasks accepted', what: '11 of 14 benchmark tasks accepted for Project Sentinel Ultra, each with a Docker environment, an oracle solution and a verifier hardened against agent shortcuts.' },
  { when: 'Jul · Aug 2026', role: 'LLM Trainer, Benchmark Tasks', org: 'Handshake AI', key: '6/6', keyLabel: 'tasks accepted', what: '6 of 6 Terminal-Bench 2 tasks accepted in one month, across debugging, infrastructure and systems work.' },
  { when: 'Feb · Jun 2026', role: 'SDE Intern', org: 'Xelron AI', key: '50+', keyLabel: 'tasks accepted', what: '50+ benchmark tasks accepted across the Terminus and Finch evaluation projects.' },
  { when: 'May · Jul 2025', role: 'Full-Stack Developer Intern', org: 'Flitzen Technologies UK', key: '1', keyLabel: 'platform led', what: 'Led a responsive golf competition platform with subscriptions, QR codes and a Winners’ Circle.' },
];
export const EDUCATION = 'B.Tech in Computer Science, IIIT Kota, 2022 to 2026';
export const ABOUT = 'Before Flitzen I spent months writing tasks that test frontier AI coding agents. It taught me one habit: run the real thing. Off the clock I build small products, mostly on Cloudflare and mostly on your own device, so your data stays yours.';
export const STATS = [['67+', 'AI benchmark tasks accepted'], ['13+', 'Client sites rebuilt'], ['650+', 'DSA problems solved']];
export const CONTACT = {
  email: 'hello@jashparmar.com',
  resume: '/Jash-Parmar-Resume.pdf?v=2026-11-13',
  github: 'https://github.com/jash2884',
  linkedin: 'https://www.linkedin.com/in/jash-parmar-7973b2255/',
  classic: 'https://jashparmar.com/',
};
export const PERSON = { name: 'Jash Parmar', role: 'Software developer', company: 'Flitzen Technologies', location: 'India', tz: 'Asia/Kolkata', portrait: 'img/jash-parmar-288.webp' };
