# Nst-Portfolio

**Harshvardhan Singh Shekhawat** — Frontend Developer & Competitive Programmer  
Personal portfolio, enhanced edition.

## Stack
- Zero build tools — pure HTML, CSS, JS
- Google Fonts: Plus Jakarta Sans + DM Mono
- No dependencies, no bundler

## Folder structure
```
Nst-Poetfolio/
├── index.html          ← main entry
├── pages/
│   ├── projects.html   ← filterable project gallery
│   ├── contact.html    ← contact page
│   └── 404.html        ← error page
├── css/
│   ├── tokens.css      ← design tokens (colours, spacing, fonts)
│   ├── base.css        ← reset, utilities, grain overlay
│   ├── nav.css         ← sticky nav + mobile hamburger
│   ├── hero.css        ← aurora blobs, typewriter, scroll line
│   └── components.css  ← cards, skills, code window, contact form
├── js/
│   ├── main.js         ← cursor glow, scroll progress, reveal, nav
│   ├── typewriter.js   ← cycling tagline animation
│   ├── codewin.js      ← multi-language code window
│   └── contact.js      ← form validation + toast
└── assets/
    ├── fonts/
    ├── icons/
    └── images/
```

## Features
- Animated aurora blob hero
- Typewriter cycling taglines
- Scroll-triggered reveal animations
- Cursor glow that follows the mouse
- Sticky glassmorphism navbar
- Scroll progress bar
- Multi-language code window (JS / Python / C++ / Rust)
- Filterable project cards
- Contact form with inline validation
- Fully responsive + reduced-motion safe
- Accessible (focus rings, ARIA labels, semantic HTML)

## Run locally
```bash
python3 -m http.server 3000 --bind 127.0.0.1 --directory /Users/harshuuu/Nst-Poetfolio
```
Then open http://127.0.0.1:3000

## Deploy
Push to GitHub and connect to Vercel. No build step required.
