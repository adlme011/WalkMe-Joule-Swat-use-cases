# ⚡ AI SWAT / Tiger Team — Program Tracker

An interactive React-based program tracker for managing AI use case initiatives across enterprise customer accounts. Built for teams running joint **SAP Joule + WalkMe** deployments, but easily adaptable to any multi-account engagement program.

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## Overview

This tracker helps Solution Advisory / Tiger Team leadership manage a structured engagement program across 10 target accounts (5 US, 5 Europe), with per-account tracking for:

- **Contacts & Personas** — Map stakeholders by name, role, department, and email
- **Phase Timeline** — 6 program phases per account, each with status tracking and notes
- **Action Items** — Editable action list per account with owner, due date, completion, and notes
- **Account Notes** — Free-text area for strategy, decisions, risks, and meeting summaries
- **Custom Fields** — Add text or checkbox columns on the fly across all accounts

## Features

- 📊 **Program Overview** dashboard with objective, team structure, and strategic value
- 📋 **Account Tracker** with expandable per-account panels and sub-tabs
- 📅 **Per-account phase timeline** with click-to-cycle status (upcoming → in-progress → complete)
- ✅ **Per-account action items** with progress bar, editable fields, and notes
- 👤 **Contact mapping** with role and department dropdowns
- ➕ **Dynamic custom fields** — add text or checkbox columns at runtime
- 📈 **Aggregate stats** in the header (total phases, actions, contacts across all accounts)
- 🌙 Dark theme with polished UI

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/tiger-team-tracker.git
cd tiger-team-tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Project Structure

```
tiger-team-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          # Main tracker component
│   └── main.jsx         # React entry point
├── package.json
├── vite.config.js
└── README.md
```

## Customization

### Change accounts, regions, or leads

Edit the `makeAccounts()` function in `src/App.jsx` to modify the number of accounts, regions, or regional leads.

### Change phase templates

Edit the `PHASE_TEMPLATES` array to customize the program phases, descriptions, and target timelines.

### Change action templates

Edit the `ACTION_TEMPLATES` array to customize the default action items seeded into each account.

### Change department / role dropdowns

Edit `DEPT_OPTIONS` and `ROLE_OPTIONS` at the top of `src/App.jsx`.

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag the dist/ folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Push dist/ contents to gh-pages branch
```

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool & dev server
- **Google Fonts** — DM Sans + Space Mono typography
- No external UI libraries — pure React with inline styles

## License

MIT — free to use, modify, and distribute.

---

Built with ⚡ by the AI SWAT Tiger Team initiative.
