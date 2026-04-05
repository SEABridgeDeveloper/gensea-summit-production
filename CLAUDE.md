# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev      # Start Next.js dev server
npm run build    # Production build (static export to out/)
npm start        # Serve production build
```

No linting or test scripts are configured.

## Architecture

**Next.js 15 static site** (React 19, TypeScript) for the Gen SEA Summit 2026 event — a single-page landing site exported as static HTML via `output: 'export'` in next.config.ts.

### Key Patterns

- **Pure CSS styling** — all styles live in `src/app/globals.css` (~1100 lines). No Tailwind, no CSS-in-JS. Uses CSS custom properties, `clamp()` for responsive sizing, and extensive keyframe animations.
- **Client-side effects** — `GlobalEffects.tsx` is a `'use client'` component that handles cursor glow, scroll progress, hero parallax, char-by-char tagline animation, IntersectionObserver reveals, counter animations, and magnetic button effects. All via vanilla DOM APIs in a single `useEffect`.
- **Thai decorative layer** — `ThaiDecorations.tsx` renders SVG Thai motifs (ดอกประจำยาม diamond flowers, petal flowers, Bai Sema leaves) as fixed-position floating elements + a subtle repeating pattern background. `ThaiDivider` components separate sections with gold ornamental dividers.
- **No external UI/animation libraries** — everything is hand-rolled CSS animations and vanilla JS.
- **Form submission** — `InterestForm.tsx` posts to a Google Apps Script URL (currently placeholder). Uses React state for form lifecycle.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Static Assets

Partner logos and branding SVGs are in `public/logo/`. Referenced via absolute paths (`/logo/...`).

### CSS Color System

Brand colors use CSS variables: `--red`, `--orange`, `--brand` (gradient), `--purple`, `--indigo`. Thai decorative elements use `--gold`, `--gold-light`, `--gold-dark`. Glass/surface colors use `--glass`, `--surface`, `--text1`/`--text2`/`--text3` for text hierarchy on the dark background.

### Reveal Animation System

Elements with class `reveal` start invisible and animate in when they enter the viewport (handled by IntersectionObserver in `GlobalEffects.tsx`). Stagger delays via `.stagger-1` through `.stagger-5`.

## Backend (Google Sheets API)

The interest form connects to a **Google Apps Script** backend that writes submissions to a Google Sheet. This is necessary because the site is a static export and cannot use server-side API routes.

### Files

- `backend/Code.gs` — Google Apps Script source (copy into Apps Script editor)
- `backend/SETUP.md` — Full setup & deployment instructions
- `.env.example` — Environment variable template

### Schema (Submissions Sheet)

| Column | Type | Required |
|--------|------|----------|
| Timestamp | DateTime | Auto |
| Name | String | Yes |
| Organization | String | Yes |
| Position | String | No |
| Phone | String | Yes |
| Email | String | Yes |
| Interest | Enum | Yes |
| Details | String | No |
| Source | String | Auto |

### API Endpoints

- `POST /exec` — Submit form data (public, validated, duplicate-checked)
- `GET /exec?action=health` — Health check
- `GET /exec?action=submissions&secret=SECRET` — Read all submissions (admin)

### Environment Variable

```
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Set in `.env.local` (not committed). The form falls back to demo mode if unset.

### Key Behaviors

- **Validation**: name, organization, email, phone, interest are required. Email format validated. Interest must match predefined options.
- **Sanitization**: All inputs trimmed and length-capped. Email lowercased.
- **Duplicate prevention**: Same email blocked within 1-minute window.
- **Notifications**: Optional email notification via `NOTIFY_EMAIL` script property.
- **Auto-setup**: Running `initialSetup()` in Apps Script creates the sheet tab with headers automatically.
