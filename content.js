// Shared, factual content. Do not invent facts.
// Order: the original order, the two newer projects, Tonight last.
export const PROJECTS = [
  {
    "k": "crate",
    "t": "Crate",
    "hook": "a record crate for your own files",
    "img": "img/crate.webp",
    "c": "#ff6a2b",
    "d": "Your own music files, turned into a 3D record crate and a turntable you can actually scratch. Nothing is uploaded; it all runs on your device.",
    "b": [
      "Tag parsers written from scratch for ID3, FLAC, Ogg, MP4 and WAV.",
      "A variable-rate audio engine with motor physics, plus Spotify, Audius, radio and concert-archive sources."
    ],
    "s": "JavaScript · Web Audio · IndexedDB · PWA · Spotify Web API",
    "l": [
      [
        "Open Crate",
        "https://crate.jashparmar.com"
      ]
    ],
    "cs": [
      "Music apps are built around their own catalogue. I wanted the files I actually own to feel as good to browse and play as a shelf of records.",
      "A web app that reads the tags of your files in the browser, with parsers written from scratch for ID3, FLAC, Ogg, MP4 and WAV, keeps the library in IndexedDB and plays it through a variable-rate audio engine with turntable motor physics, so you can scratch.",
      "No dependencies and no build step, 14 automated tests, and nothing ever leaves the device."
    ]
  },
  {
    "k": "drape",
    "t": "Drape",
    "hook": "Shazam, but for outfits",
    "img": "img/drape.webp",
    "c": "#e5487f",
    "d": "Screenshot any look and Drape finds every piece, the exact item for sale and cheaper lookalikes.",
    "b": [
      "Clothing parsing, SAM and a fashion embedding model run on the device in a Web Worker.",
      "Lookalikes from a 9,257-product vector catalogue searched on the phone; a Chrome extension shares the engine."
    ],
    "s": "JavaScript · Transformers.js · WebAssembly · Cloudflare Workers · D1",
    "l": [
      [
        "Try Drape",
        "https://drape.jashparmar.com"
      ],
      [
        "Code",
        "https://github.com/jash2884/drape"
      ]
    ],
    "cs": [
      "You see an outfit in a screenshot and want to know where every piece is from, and whether there is a cheaper version.",
      "Garment parsing, SAM cut-outs and a fashion embedding model running on the phone in a Web Worker. Exact matches come through a Cloudflare Worker; lookalikes come from my own 9,257-product catalogue, searched on the device.",
      "Live and public on GitHub, built as a business idea, with a Chrome extension that shares the same engine."
    ]
  },
  {
    "k": "wrapped",
    "t": "Chat Wrapped",
    "hook": "your group chat, wrapped",
    "img": "img/wrapped.webp",
    "c": "#1fae5b",
    "d": "Spotify Wrapped for your WhatsApp and Telegram chats, analysed entirely on your device: a 20-slide story, a title for every member and a guess-who quiz.",
    "b": [
      "Opens straight from WhatsApp’s share menu as an installable app.",
      "An anonymised AI verdict with a model fallback chain, and cookieless analytics."
    ],
    "s": "JavaScript · Web Workers · PWA · Cloudflare Workers · Gemini",
    "l": [
      [
        "Wrap a chat",
        "https://wrapped.jashparmar.com"
      ],
      [
        "Code",
        "https://github.com/jash2884/chat-wrapped"
      ]
    ],
    "cs": [
      "People love their yearly Wrapped and their group chats, but the tools that wrap a chat upload your private messages.",
      "An installable web app that parses WhatsApp and Telegram exports in a Web Worker on your device and turns them into a 20-slide story, a title for every member and a guess-who quiz. Only anonymised numbers reach the AI verdict, behind a model fallback chain.",
      "It opens straight from WhatsApp’s share menu. When a friend’s Android phone could not upload a zip, I added zip detection and a built-in decompressor so it works on every phone. 19 tests, CI green."
    ]
  },
  {
    "k": "stepwise",
    "t": "drishi",
    "hook": "see how it works",
    "img": "img/drishi.webp",
    "c": "#006a7b",
    "d": "A minimal 3D study site for computer science: 89 step-by-step visualisers, 8 roadmaps, GATE-style practice, and a question box answered on your device.",
    "b": [
      "A 1.6 MB model I trained picks the right visualiser on your device: 94.8% right on 267 unseen questions.",
      "One three.js scene of 1,500 blocks forms an eye, then rebuilds itself for every subject."
    ],
    "s": "JavaScript · Three.js · On-device ML · Workers AI · Cloudflare",
    "l": [
      [
        "Learn a step",
        "https://drishi.jashparmar.com"
      ],
      [
        "Code",
        "https://github.com/jash2884/stepwise"
      ]
    ],
    "cs": [
      "Students learn algorithms from static diagrams, and AI chatbots can get the numbers wrong with confidence.",
      "89 step-by-step visualisers in 11 subjects with roadmaps, 72 GATE question generators, mocks, spaced repetition and a mistake doctor. Typed questions are read on the device, and the visualiser's own engine works out the answer.",
      "The router scored 94.8% on 267 questions written without sight of its training data, and it declines when a number in the question is left unread. 631 tests, each engine checked against textbook answers and random inputs."
    ]
  },
  {
    "k": "agentproof",
    "t": "AgentProof",
    "hook": "evidence before every release",
    "img": "img/agentproof.webp",
    "c": "#119c8b",
    "d": "Release checks for teams shipping AI agents: import traces, assert business policies, compare versions and block unsafe releases in CI.",
    "b": [
      "Required and forbidden tool calls, latency and cost budgets as deterministic rules.",
      "Tenant workspaces with roles, audit history and revocable tokens."
    ],
    "s": "TypeScript · Transformers.js · Web Workers",
    "l": [
      [
        "See it",
        "https://agentproof.jashparmar.com"
      ]
    ],
    "cs": [
      "Teams shipping AI agents need to know a new version is safe before it goes out, and that is often a manual spot check.",
      "Import real agent traces, assert business policies as deterministic rules (required and forbidden tool calls, latency and cost budgets), compare versions and block unsafe releases in CI.",
      "Tenant workspaces with roles, audit history and revocable tokens, CI green. It grew out of months of writing benchmark tasks for AI coding agents."
    ]
  },
  {
    "k": "slotwise",
    "t": "SlotWise",
    "hook": "no double bookings, ever",
    "img": "img/slotwise.webp",
    "c": "#3e7d3a",
    "d": "Mentor scheduling with authenticated booking, timezone-aware availability and double-booking blocked by the database itself.",
    "b": [
      "Idempotent retries return the original booking, even when sent at the same moment.",
      "Transactional audit events and a CI pipeline."
    ],
    "s": "React · TypeScript · Cloudflare Workers · D1 · GitHub Actions",
    "l": [
      [
        "Book a slot",
        "https://slotwise.jashparmar.com"
      ],
      [
        "Code",
        "https://github.com/jash2884/slotwise"
      ]
    ],
    "cs": [
      "Booking systems that check for clashes in application code can still double book when two requests arrive at the same moment.",
      "Mentor scheduling where a database constraint makes double booking impossible, retries are idempotent and return the original booking, and every change writes an audit event in the same transaction.",
      "Tested with retries sent at the same moment, deployed on Cloudflare Workers and D1, with CI on every push."
    ]
  },
  {
    "k": "invites",
    "t": "Invite Sender",
    "hook": "built for a friend’s wedding",
    "img": "img/invites.webp",
    "c": "#c8901e",
    "d": "A private tool built for a friend’s wedding. Upload the guest list, design the invitation once, and every guest gets a personal WhatsApp message with their own name printed on the card.",
    "b": [
      "The guest list, message and card stay editable while it sends; names print onto image or PDF cards, including Hindi and Gujarati.",
      "Runs on a server behind a password and a Cloudflare Worker, with paced sending, a daily limit and an automatic restart the next morning."
    ],
    "s": "Node.js · Baileys · Canvas · pdf-lib · Cloudflare Workers · cron",
    "l": [
      [
        "Open it (login needed)",
        "https://invites.jashparmar.com"
      ]
    ],
    "cs": [
      "A friend needed to send personal wedding invitations to hundreds of guests on WhatsApp. Paid tools capped the count or kept a copy of the guest list.",
      "Built and hosted it the same day: guest list import, a card editor that prints each guest’s name (including Hindi and Gujarati), formatting tools, and a paced sender with a daily limit that carries on the next morning, all editable while it runs.",
      "Private behind a password and a Cloudflare Worker, and it restarts itself if the server reboots. A real user with a real deadline."
    ]
  },
  {
    "k": "matchday",
    "t": "Matchday Brain",
    "hook": "predictions with an honest track record",
    "img": "img/matchday.webp",
    "c": "#16a34a",
    "d": "Match predictions for football, cricket and the NFL from tuned Elo models, with every past prediction scored in public, so the model can be judged on unseen matches.",
    "b": [
      "Open match data is ingested ahead of time and the model is tuned on one season, then tested on seasons it has never seen.",
      "A Cloudflare Worker serves the site and a small prediction API, with a public accuracy and calibration record."
    ],
    "s": "TypeScript · Elo models · Cloudflare Workers · GitHub Actions",
    "l": [
      [
        "See predictions",
        "https://matchday.jashparmar.com"
      ],
      [
        "Code",
        "https://github.com/jash2884/matchday-brain"
      ]
    ],
    "cs": [
      "Most prediction sites never show how often they were wrong.",
      "Elo-based models for football, cricket and the NFL, tuned on past seasons and tested on seasons they had never seen, served by a Cloudflare Worker with a small prediction API.",
      "Every prediction is scored in public, with accuracy and calibration, so the model is judged on results rather than claims."
    ]
  },
  {
    "k": "tonight",
    "t": "Tonight, Everywhere",
    "hook": "one question for the whole world",
    "img": "img/tonight.webp",
    "c": "#e3a320",
    "d": "One question a day for the whole world. Answer in a single line and your light appears on a night globe beside everyone else’s.",
    "b": [
      "Anonymous answers are checked by Llama Guard before they are allowed to glow.",
      "A dotted globe on 2D canvas with a real sun terminator, backed by a Cloudflare Worker and D1."
    ],
    "s": "JavaScript · Canvas · Cloudflare Workers · D1 · Workers AI",
    "l": [
      [
        "Light it",
        "https://tonight.jashparmar.com"
      ]
    ],
    "cs": [
      "Social apps reward the loudest voices. I wanted one quiet shared moment: the same question, answered once a day by anyone, anywhere.",
      "Answers become lights on a night globe drawn on canvas with the real sun terminator, stored in D1, with Llama Guard checking every line before it is allowed to glow.",
      "If moderation fails, the API refuses rather than letting a line through, and it allows one answer per visitor per day without accounts."
    ]
  }
];

export const HOW = {
  "crate": [
    [
      "Your music files",
      "nothing uploaded"
    ],
    [
      "Tag parsers",
      "ID3 · FLAC · Ogg · MP4 · WAV"
    ],
    [
      "IndexedDB",
      "library on the device"
    ],
    [
      "Audio engine",
      "variable rate, motor physics"
    ],
    [
      "Turntable UI",
      "scratch, pitch, crate"
    ],
    [
      "More sources",
      "Spotify · Audius · radio · archive"
    ]
  ],
  "drape": [
    [
      "A screenshot",
      "any look, any app"
    ],
    [
      "Web Worker",
      "off the main thread"
    ],
    [
      "Clothing parser + SAM",
      "every garment, cut out"
    ],
    [
      "Fashion embeddings",
      "one vector per piece"
    ],
    [
      "Vector search",
      "9,257 products, on the phone"
    ],
    [
      "Item + lookalikes",
      "shop links"
    ]
  ],
  "wrapped": [
    [
      "Chat export",
      "WhatsApp · Telegram"
    ],
    [
      "Parser",
      "formats, dates, media lines"
    ],
    [
      "Stats worker",
      "who talks, who replies, when"
    ],
    [
      "20-slide story",
      "titles for every member"
    ],
    [
      "Anonymised numbers",
      "no names, no messages"
    ],
    [
      "AI verdict",
      "model fallback chain"
    ]
  ],
  "stepwise": [
    [
      "Pick an algorithm",
      "89 visualisers"
    ],
    [
      "Step engine",
      "every state recorded"
    ],
    [
      "Pseudocode + state",
      "the line being run"
    ],
    [
      "SVG / three.js view",
      "2D or 3D"
    ],
    [
      "AI tutor",
      "about the step on screen"
    ],
    [
      "630+ tests",
      "textbook + fuzz"
    ]
  ],
  "agentproof": [
    [
      "Agent traces",
      "imported runs"
    ],
    [
      "Policy rules",
      "required + forbidden tool calls"
    ],
    [
      "Budgets",
      "latency and cost"
    ],
    [
      "Compare versions",
      "what changed"
    ],
    [
      "CI gate",
      "block unsafe releases"
    ],
    [
      "Audit history",
      "roles, revocable tokens"
    ]
  ],
  "slotwise": [
    [
      "Booking request",
      "timezone aware"
    ],
    [
      "Auth",
      "signed session"
    ],
    [
      "Idempotency key",
      "retries return the same booking"
    ],
    [
      "D1 constraint",
      "double booking impossible"
    ],
    [
      "Audit event",
      "same transaction"
    ],
    [
      "CI pipeline",
      "tested on every push"
    ]
  ],
  "invites": [
    [
      "Guest list",
      "Excel, CSV or paste"
    ],
    [
      "Personalise",
      "{{name}} in text and card"
    ],
    [
      "Card renderer",
      "image or PDF, Hindi, Gujarati"
    ],
    [
      "WhatsApp link",
      "scan once, like WhatsApp Web"
    ],
    [
      "Paced sender",
      "random gaps, batch breaks"
    ],
    [
      "Daily limit",
      "resumes the next morning"
    ]
  ],
  "matchday": [
    [
      "Open match data",
      "football, cricket, NFL"
    ],
    [
      "Elo + form model",
      "one rating per team"
    ],
    [
      "Tuned on the past",
      "tested on unseen seasons"
    ],
    [
      "Track record",
      "accuracy and calibration"
    ],
    [
      "Worker API",
      "/api/v1/predict"
    ],
    [
      "Scheduled refresh",
      "GitHub Actions"
    ]
  ],
  "tonight": [
    [
      "One question",
      "the same for everyone"
    ],
    [
      "Your answer",
      "one line, anonymous"
    ],
    [
      "Cloudflare Worker",
      "rate limits, checks"
    ],
    [
      "Llama Guard",
      "unsafe answers never glow"
    ],
    [
      "D1",
      "tonight’s lights"
    ],
    [
      "Night globe",
      "canvas + real sun terminator"
    ]
  ]
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
  "email": "hello@jashparmar.com",
  "resume": "/Jash-Parmar-Resume-Software-Developer.pdf?v=2026-11-24",
  "github": "https://github.com/jash2884",
  "linkedin": "https://www.linkedin.com/in/jash-parmar-7973b2255/",
  "classic": "https://jashparmar.com/classic/",
  "resumes": [
    [
      "Software developer",
      "/Jash-Parmar-Resume-Software-Developer.pdf?v=2026-11-24"
    ],
    [
      "Forward-deployed engineer",
      "/Jash-Parmar-Resume-FDE.pdf?v=2026-11-24"
    ]
  ]
};
export const PERSON = { name: 'Jash Parmar', role: 'Software developer', company: 'Flitzen Technologies', location: 'India', tz: 'Asia/Kolkata', portrait: 'img/jash-parmar-288.webp' };
