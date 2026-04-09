# ResumeForge — Features File
> **Purpose:** Give this file to any AI assistant along with your current resume to generate strong, accurate resume bullet points for the ResumeForge project.
> **Developer:** Rishabh Singh | rawatrishi3@gmail.com | github.com/coder-Rishi05

---

## RESUME ENTRY HEADER (copy-paste ready)

**ResumeForge** — AI-Powered Resume Analyser | React.js, Node.js, Express.js, MongoDB, Groq API (LLaMA 3.3 70B), Multer, Brevo API | [Live Demo](https://resumeforge-1-c1t9.onrender.com)

---

## FEATURE LIST (for AI to generate bullets from)

### Core Pipeline
- User uploads PDF resume + enters job role → backend extracts text → sends to Groq AI → returns structured JSON analysis + cover email
- Full pipeline: PDF upload → text extraction → AI processing → structured response → email delivery — all in a single user action
- Stateless API design — no database, no stored files, no user accounts. Resume processed in-memory and discarded after response

### PDF Handling
- Implemented Multer with `memoryStorage` — PDF stored entirely in `req.file.buffer`, never written to disk
- PDF-only file filter enforced at middleware level (`application/pdf` MIME check) with 5MB size limit
- Used `pdf2json` library to extract raw text from buffer with custom `safeDecode` for URL-encoded characters

### AI Integration — Groq / LLaMA 3.3 70B
- Engineered a dual-purpose prompt: generates both a tailored job application email AND section-wise resume analysis in a single API call
- Prompt instructs model to return **strict JSON only** — no markdown, no preamble — with full schema definition in the prompt
- AI output includes: overall score (0-100), section scores (0-10 each), strengths, critical gaps, missing ATS keywords, suggested rewrites (current vs improved side-by-side)
- Post-processing pipeline: strips markdown fences → regex extracts JSON object → validates required fields → normalises email body formatting
- Error handling: distinct HTTP status codes for each failure stage (422 extraction, 502 AI failure, 500 email failure)
- Model config: temperature 0.5 (deterministic output), max_tokens 3000

### Email Delivery — Brevo API
- Integrated Brevo transactional email API (migrated from Nodemailer/Gmail SMTP for production reliability)
- AI-generated subject line and email body sent directly to HR with PDF resume as base64 attachment
- Email subject format: "Application for [Job Role] — [Candidate Name]" — generated dynamically by AI from resume content

### Frontend — React.js
- Built multi-page React SPA (Vite) with React Router v6 — 4 pages: Home, Analysis, EmailPreview, Success
- Passed data between pages using React Router `navigate` state — no Redux, clean linear flow
- Built collapsible section cards for Analysis page — each section expandable with score, strengths, suggestions (priority-tagged High/Medium/Low), and side-by-side rewrite comparisons
- Implemented global dark/light theme system using React Context API — CSS custom properties toggled via `data-theme` attribute on `document.documentElement`, persisted in localStorage
- Custom file upload component with PDF validation, file size display, and visual feedback states
- Centralized Axios API layer in `lib/api.js` for all multipart/form-data requests

### UI/UX
- Designed warm editorial UI: DM Sans (body) + DM Mono (labels/tags), off-white light theme with gold (#e8b84b) accent
- Mouse-tracking ambient glow effect on hero section using `mousemove` event and CSS radial gradient
- Animated ticker banner with CSS keyframe animation (`translateX(-50%)`)
- Responsive grid layouts (3-col feature grid → 2-col → 1-col at breakpoints)
- Smooth theme transitions (0.25s ease) on all color properties

---

## METRICS / QUANTIFIABLE FACTS (use in bullets)
- 2 API routes: `/api/resume/analyse` and `/api/email/send`
- 4 frontend pages in the user flow
- 6 feature categories displayed on landing: Section Scores, ATS Check, Email Draft, Rewrites, Gap Analysis, Send Direct
- AI model: LLaMA 3.3 70B (70 billion parameter model via Groq)
- Section analysis covers: Technical Skills, Projects, Experience, Education, Contact/ATS
- Each section scored 0-10 with: summary, strengths, suggestions (3 priority levels), before/after rewrites
- Overall score: 0-100 aggregate

---

## INTERESTING TECHNICAL DECISIONS (use for interview stories / resume bullets)

1. **memoryStorage over diskStorage** — chose in-memory PDF handling because Render has an ephemeral filesystem; disk writes would be lost on dyno restart. Also eliminates cleanup logic.

2. **Brevo over Nodemailer** — migrated mid-project when Gmail SMTP app password caused delivery issues in production. Brevo gives reliable transactional delivery without 2FA complications.

3. **Single AI call for both email + analysis** — instead of two separate Groq API calls (one for email, one for analysis), combined both into one prompt. Saves latency and API credits.

4. **Strict JSON-only prompt** — explicitly instructed LLaMA to return no markdown, no preamble, no explanation. Added post-processing (regex extraction + field validation) as a safety net.

5. **React Router state over Redux** — for a linear 4-step flow (Home → Analysis → EmailPreview → Success), passing state via `navigate` is cleaner than global state management.

---

## SUGGESTED RESUME BULLETS (ready to use or adapt)

**Strong versions:**

- Architected a full-stack AI resume analyser using Node.js/Express and Groq's LLaMA 3.3 70B; engineered a dual-purpose prompt that generates section-wise analysis (scored 0–10) and a tailored HR cover email in a single API call
- Implemented Multer `memoryStorage` for PDF ingestion — file processed entirely in-memory buffer and never written to disk, ensuring compatibility with Render's ephemeral filesystem
- Built 3-stage error pipeline (422/502/500) with independent logging per stage, reducing debugging time for PDF extraction, AI, and email failures
- Migrated email delivery from Nodemailer/Gmail SMTP to Brevo transactional API mid-project to resolve production delivery failures; integrated base64 PDF attachment in API payload
- Designed React multi-page flow (Vite + Router v6) with collapsible analysis cards showing priority-tagged suggestions (High/Medium/Low) and side-by-side bullet rewrites
- Implemented global theme system via React Context API and CSS custom properties — `data-theme` toggled on document root with localStorage persistence and 0.25s transition on all color tokens

---

## HOW TO USE THIS FILE

When asking an AI to write resume bullets for ResumeForge, say:

> "I have attached my ResumeForge project README and features file. Based on this, write [X] strong resume bullet points for a [Backend/Fullstack] Developer role. Focus on [specific area: AI integration / backend architecture / frontend / etc]. Keep bullets achievement-oriented and specific."

The AI will use the metrics, technical decisions, and feature list above to generate accurate, non-generic bullets.
