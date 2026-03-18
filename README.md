# kiki AI Ops — Ticket Intelligence Dashboard

A modern, minimal SaaS dashboard for AI-powered ticket management.

## Stack
- **Vite** — lightning-fast dev server & build
- **React 18** — component architecture
- **Tailwind CSS v3** — utility-first styling with dark mode
- **Recharts** — charts (Area, Bar, Pie, Radar)
- **Lucide React** — icon library

## Setup

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 6 Dashboards

| Page | Description |
|------|-------------|
| **Command Center** | Overview KPIs, weekly trend chart, ticket table, live activity feed |
| **Ticket Review** | 3-column layout: queue → draft editor (native + English) → AI context |
| **AI Revision Studio** | Chat-based AI revision with apply, copy, thumbs feedback |
| **Spam Intelligence** | Blocked tickets table, confidence scores, type breakdown bar chart |
| **GDPR Compliance** | Data subject requests, privacy policy toggles, retention schedule |
| **Language Hub** | Per-language translation quality, radar chart, coverage overview |

## Features
- Light / dark mode toggle (persists in localStorage)
- Collapsible sidebar
- All interactive — filters, toggles, forms, chat all work
- Responsive layouts
- Clean design system with shared Card, Badge, Table, Toggle, ProgressBar components
# kiki-ui
