// Shared, factual content. Do not invent facts.
// Order matters: strongest projects for software developer and FDE roles first.
export const PROJECTS = [
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
      ],
      [
        "Code",
        "https://github.com/jash2884/agentproof"
      ]
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
    ]
  },
  {
    "k": "stepwise",
    "t": "Stepwise",
    "hook": "see every step of the algorithm",
    "img": "img/stepwise.webp",
    "c": "#4d6bff",
    "d": "62 step-by-step visualisers for DSA, operating systems, databases, networks, automata and compilers, with GATE-style practice.",
    "b": [
      "Live pseudocode and variables on every step, with optional three.js 3D views.",
      "An AI tutor for the step on screen, and 350+ textbook and fuzz tests."
    ],
    "s": "JavaScript · Three.js · SVG · Workers AI · Cloudflare",
    "l": [
      [
        "Learn a step",
        "https://stepwise.jashparmar.com"
      ],
      [
        "Code",
        "https://github.com/jash2884/stepwise"
      ]
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
    ]
  },
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
    ]
  }
];

export const HOW = {
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
  "stepwise": [
    [
      "Pick an algorithm",
      "62 visualisers"
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
      "350+ tests",
      "textbook + fuzz"
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
  email: 'hello@jashparmar.com',
  resume: '/Jash-Parmar-Resume.pdf?v=2026-11-13',
  github: 'https://github.com/jash2884',
  linkedin: 'https://www.linkedin.com/in/jash-parmar-7973b2255/',
  classic: 'https://jashparmar.com/',
};
export const PERSON = { name: 'Jash Parmar', role: 'Software developer', company: 'Flitzen Technologies', location: 'India', tz: 'Asia/Kolkata', portrait: 'img/jash-parmar-288.webp' };
