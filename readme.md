# ResumeForge — Project README
> This file is written for AI assistants to understand the ResumeForge project deeply and generate accurate, strong resume bullet points for the developer (Rishabh Singh / Rishi).

---

## What is ResumeForge?

ResumeForge is a full-stack AI-powered resume analysis web application. A user uploads their PDF resume, enters a target job role and HR email, and the app:
1. Extracts text from the PDF
2. Sends it to Groq's LLaMA 3.3 70B model with a detailed prompt
3. Returns a section-wise scored analysis (like a FAANG-style review)
4. Generates a professional, tailored job application email
5. Allows the user to preview the email and send it directly to HR with the resume attached (via Brevo SMTP API)

**Live URL:** https://resumeforge-1-c1t9.onrender.com  
**Backend URL:** https://resumeforge-h8l7.onrender.com  
**Developer:** Rishabh Singh | github.com/coder-Rishi05

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js (ES Modules) | REST API server |
| Multer (memoryStorage) | PDF file upload — stored in memory buffer, never written to disk |
| pdf2json | PDF text extraction from buffer |
| Groq SDK (LLaMA 3.3 70B) | AI analysis and email generation |
| Brevo API (via fetch) | Transactional email delivery with PDF attachment |
| Nodemailer (Gmail SMTP) | Earlier email implementation, replaced by Brevo |
| dotenv | Environment variable management |
| cors | Cross-origin requests from frontend |

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | SPA frontend |
| React Router v6 | Client-side routing (4 pages) |
| Axios | API calls with multipart/form-data |
| Tailwind CSS + DaisyUI | Styling |
| Context API (ThemeContext) | Global dark/light theme management with localStorage persistence |
| DM Sans + DM Mono | Typography |

---

## Architecture — How Data Flows

```
User fills form (Name, Job Role, HR Email, PDF Upload)
        ↓
React frontend → POST /api/resume/analyse (multipart/form-data)
        ↓
Multer middleware → stores PDF in memory buffer (no disk write)
        ↓
pdf2json → extracts raw text from buffer
        ↓
Groq API (LLaMA 3.3 70B) → receives resumeText + jobRole
        ↓
AI returns structured JSON: { email: {subject, body}, analysis: {...} }
        ↓
Backend validates + normalizes JSON response
        ↓
Frontend receives → navigates to /analysis page with state
        ↓
User reviews analysis → clicks "Preview & Send Email"
        ↓
POST /api/email/send → re-runs PDF extraction + AI → Brevo API sends email with PDF attachment
        ↓
User sees /email-preview → confirms → navigates to /success
```

---

## Backend File Structure

```
backend/
├── src/
│   ├── controller/
│   │   ├── resume.controller.js     ← handles /api/resume/analyse
│   │   └── email.controller.js      ← handles /api/email/send
│   ├── middleware/
│   │   └── upload.middleware.js     ← Multer config (memoryStorage, PDF-only, 5MB limit)
│   ├── routes/
│   │   ├── resume.route.js          ← POST /api/resume/analyse
│   │   └── email.route.js           ← POST /api/email/send
│   ├── services/
│   │   ├── ai.service.js            ← Groq API call + prompt engineering + JSON parsing
│   │   ├── pdf.service.js           ← pdf2json text extraction from buffer
│   │   └── email.service.js         ← Brevo API email delivery
│   └── utils/
│       └── env.js                   ← destructured process.env exports
└── app.js                           ← Express server setup, CORS, routes registration
```

---

## Key Technical Implementations

### 1. PDF Upload — Multer memoryStorage
- PDF is stored entirely in `req.file.buffer` — never written to disk
- File filter enforces `application/pdf` MIME type only
- 5MB size limit enforced at middleware level
- Same buffer passed to both pdf2json (extraction) and Brevo (email attachment)

### 2. AI Service — Prompt Engineering (Groq / LLaMA 3.3 70B)
- System prompt: "20+ year HR consultant + FAANG Tech Lead resume analyst"
- User prompt includes: target job role + full resume text
- AI returns **strict JSON only** — no markdown, no preamble
- JSON schema includes:
  - `email.subject` and `email.body` — professional cover email
  - `analysis.overall_score` — 0-100 score
  - `analysis.overall_summary` — 2-3 sentence assessment
  - `analysis.top_strengths` — array of competitive advantages
  - `analysis.critical_gaps` — must-improve areas
  - `analysis.keywords_to_add` — missing ATS keywords
  - `analysis.sections` — section-wise breakdown (technical_skills, projects, experience, education)
    - Each section has: `score` (0-10), `summary`, `strengths[]`, `suggestions[]` (with priority: High/Medium/Low), `suggested_rewrites[]` (current vs improved side-by-side)
- Temperature: 0.5 (deterministic for consistent JSON)
- Max tokens: 3000
- Post-processing: strips markdown fences, regex-extracts JSON object, validates required fields

### 3. Email Delivery — Brevo API
- Switched from Nodemailer (Gmail SMTP) to Brevo transactional email API
- PDF buffer converted to base64 and sent as attachment
- Subject and body are AI-generated (not static templates)
- Error handling: throws with Brevo's error message if API returns non-200

### 4. Frontend — Multi-page Flow with React Router State
- All data passed between pages using React Router `navigate(path, { state: {...} })`
- No Redux, no global state beyond ThemeContext
- Pages: Home → Analysis → EmailPreview → Success
- Resume file object kept in component state and re-passed to email API

### 5. Theme System
- CSS custom properties (variables) for all colors
- `data-theme="light"` / `data-theme="dark"` toggled on `document.documentElement`
- Theme persisted in localStorage under key `rf-theme`
- Smooth transitions on all color changes (0.25s ease)
- Two complete palettes: warm off-white light theme, deep charcoal dark theme
- Typography: DM Sans (UI) + DM Mono (labels, tags, monospace elements)

### 6. Error Handling — 3-layer Pipeline
Both controllers follow the same pattern:
- Step 1 fail → 422 (PDF extraction failed)
- Step 2 fail → 502 (AI/Groq failed)
- Step 3 fail → 500 (email send failed)
Each step logs independently so debugging is easy

---

## Frontend Pages

| Page | Route | What it does |
|---|---|---|
| Home | `/` | Form: Name, Target Role, HR Email, PDF Upload. Submits to /api/resume/analyse |
| Analysis | `/analysis` | Shows overall score, strengths, gaps, keywords, section-by-section collapsible cards with rewrites |
| EmailPreview | `/email-preview` | Shows AI-generated email subject + body. Copy to clipboard or confirm send |
| Success | `/success` | Confirmation screen with next steps (follow up, apply more) |

---

## Notable Design Decisions
- **No database** — stateless API, no user accounts, no stored resumes ("Processed Securely · No Storage" shown in UI)
- **memoryStorage over diskStorage** — faster, no cleanup needed, works on Render's ephemeral filesystem
- **Brevo over Gmail SMTP** — more reliable delivery, no Gmail 2FA app password issues, better for production
- **JSON-only AI response** — strict schema validation prevents partial/malformed responses from reaching frontend
- **React Router state** — clean alternative to global state for a linear multi-step flow
