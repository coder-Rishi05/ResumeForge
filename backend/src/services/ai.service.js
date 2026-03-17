import Groq from "groq-sdk";
import { API_KEY } from "../utils/env.js";

const groq = new Groq({ apiKey: API_KEY });

export const generateEmailAndAnalysis = async (resumeText, jobRole) => {
  const systemPrompt = `You are an expert HR consultant and senior resume analyst with 20+ years in talent acquisition and executive recruitment.

Your task is to:
1. Generate a tailored job application email
2. Provide DETAILED section-by-section resume analysis (like FAANG Tech Leads assessment)

KEY REQUIREMENTS:
- Return ONLY valid JSON
- Email: professional, matches experience level, no hallucination
- Analysis: Section-wise scores (0-10), detailed feedback, priority-tagged suggestions
- Focus on: Education, Technical Skills, Projects, Experience, Contact Info, ATS Compatibility
- Each section must have: score, summary, strengths (bullet points), suggestions (with priority tags)
- Suggested rewrites: show CURRENT wording vs IMPROVED wording side-by-side`;

  const userPrompt = `TARGET JOB ROLE: ${jobRole}

RESUME TEXT:
${resumeText}

INSTRUCTIONS:
1. EMAIL: Write a professional job application email from candidate to HR manager
   - Tone must match experience level (Fresher ≠ Senior)
   - Max 3 paragraphs
   - Must include candidate's actual name from resume
   - Subject line format: "Application for [Job Role] — [Candidate Name]"

2. ANALYSIS: Provide section-by-section detailed assessment
   - Rate each section 0-10 (10 = perfect for this role)
   - For each section provide:
     * score: 0-10 number
     * summary: 1-2 line assessment
     * strengths: 2-3 specific strengths (not generic)
     * suggestions: Array of actionable improvements with priority level ("High", "Medium", "Low")
     * suggested_rewrites: Show side-by-side comparison of current wording vs improved example

3. SECTIONS TO ANALYZE (choose 3-4 most relevant):
   - Technical Skills (most important for tech roles)
   - Projects (show real-world impact)
   - Experience (if applicable)
   - Education (context for fresher/junior)
   - Contact Info & ATS Compatibility
   
4. OVERALL SCORE: Average of all section scores

5. KEY INSIGHTS:
   - overall_summary: 2-3 sentence assessment of candidate for THIS role
   - top_strengths: 3-4 biggest competitive advantages
   - critical_gaps: 2-3 must-improve areas to be competitive
   - keywords_to_add: Missing industry-specific keywords for this role

RETURN THIS EXACT JSON STRUCTURE (no extra fields, no markdown):

{
  "email": {
    "subject": "Application for [Job Role] — [Candidate Name]",
    "body": "Dear Hiring Manager,\\n\\n[paragraph 1]\\n\\n[paragraph 2]\\n\\n[paragraph 3]\\n\\nLooking forward to hearing from you.\\n\\nRegards,\\n[Candidate Name]"
  },
  "analysis": {
    "overall_score": 0,
    "overall_summary": "...",
    "top_strengths": ["...", "...", "..."],
    "critical_gaps": ["...", "..."],
    "keywords_to_add": ["...", "...", "..."],
    "sections": {
      "technical_skills": {
        "score": 0,
        "summary": "...",
        "strengths": ["...", "..."],
        "suggestions": [
          {"text": "...", "priority": "High"},
          {"text": "...", "priority": "Medium"},
          {"text": "...", "priority": "Low"}
        ],
        "suggested_rewrites": [
          {
            "current": "...",
            "improved": "..."
          }
        ]
      },
      "projects": {
        "score": 0,
        "summary": "...",
        "strengths": ["...", "..."],
        "suggestions": [
          {"text": "...", "priority": "High"}
        ],
        "suggested_rewrites": [
          {
            "current": "...",
            "improved": "..."
          }
        ]
      },
      "experience": {
        "score": 0,
        "summary": "...",
        "strengths": ["...", "..."],
        "suggestions": [
          {"text": "...", "priority": "High"}
        ],
        "suggested_rewrites": []
      },
      "education": {
        "score": 0,
        "summary": "...",
        "strengths": ["..."],
        "suggestions": [
          {"text": "...", "priority": "Medium"}
        ],
        "suggested_rewrites": []
      }
    }
  }
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5, // Deterministic for consistent JSON
      max_tokens: 3000, // Increased for detailed analysis
    });

    let responseText = completion.choices[0].message.content.trim();

    // Remove markdown backticks if present
    responseText = responseText
      .replace(/^```json\s*\n?/, "")
      .replace(/\n?```$/, "");

    // Extract JSON object
    const jsonMatch = responseText.match(/\{[\s\S]*\}(?![\s\S]*\{)/);

    if (!jsonMatch) {
      console.error("Response text:", responseText.substring(0, 500));
      throw new Error("AI response does not contain valid JSON object");
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr.message);
      console.error("Raw JSON sample:", jsonMatch[0].substring(0, 300));
      throw new Error(
        `JSON parsing failed: ${parseErr.message}. Response might have unescaped newlines.`
      );
    }

    // Validate required fields
    if (
      !parsed.email ||
      !parsed.email.subject ||
      !parsed.email.body ||
      !parsed.analysis ||
      parsed.analysis.overall_score === undefined
    ) {
      throw new Error(
        "Response missing required fields: email.subject, email.body, or analysis.overall_score"
      );
    }

    // Normalize email body formatting
    if (parsed.email.body) {
      parsed.email.body = parsed.email.body.replace(/\n\s*\n+/g, "\n\n");
    }

    return parsed;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};