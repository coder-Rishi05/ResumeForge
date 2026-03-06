// import Groq from "groq-sdk";
// import { API_KEY } from "../utils/env.js";

// const groq = new Groq({ apiKey: API_KEY });

// export const generateEmailAndAnalysis = async (resumeText, jobRole) => {
//   const prompt = `You are an expert HR consultant and professional resume analyst with 15+ years of experience in talent acquisition.

// You will be given a resume text and a target job role. Your task is to:
// 1. Write a highly professional job application email FROM the candidate TO the HR manager
// 2. Provide a detailed resume analysis

// TARGET JOB ROLE: ${jobRole}

// RESUME TEXT:
// ${resumeText}

// INSTRUCTIONS FOR EMAIL:
// - CRITICAL: Analyze the resume carefully and determine if candidate is Fresher, Junior, Mid-Level or Senior — write the email TONE accordingly. A fresher should NOT sound like a "seasoned professional"
// - NEVER use words like "seasoned", "esteemed", "I am writing to apply", "Please find attached"
// - Start with a strong, specific opening line based on ACTUAL skills found in resume
// - Mention candidate's real name from resume in signature
// - Highlight only skills that are ACTUALLY present in the resume — do not hallucinate skills
// - Keep body to 3 short paragraphs maximum
// - End with: "Looking forward to hearing from you." then new line "Regards," then candidate name from resume
// - Email body format should be:

//   Dear Hiring Manager,

//   [Opening paragraph — who you are based on resume]

//   [Middle paragraph — 2-3 specific relevant skills/projects from resume]

//   [Closing paragraph — call to action]

//   Looking forward to hearing from you.

//   Regards,
//   [Candidate Name from resume]

// INSTRUCTIONS FOR ANALYSIS:
// - score: Rate the resume out of 100 based on relevance to the job role, formatting quality, skills match, experience depth, and overall presentation
// - summary: 2-3 line overall assessment of the candidate's profile for this specific role
// - strengths: List 4-5 specific strengths pulled directly from the resume content (not generic)
// - weaknesses: List 3-4 specific gaps or improvements needed for this specific job role
// - keywords_missing: Important industry keywords/skills missing from resume that are typically required for this role
// - experience_level: "Fresher" | "Junior" | "Mid-Level" | "Senior" | "Expert"

// CRITICAL: Return ONLY a valid JSON object. No markdown, no backticks, no explanation. Just raw JSON.

// {
//   "email": {
//     "subject": "Application for [Job Role] — [Candidate Name if found, else Experienced Professional]",
//     "body": "full email body here..."
//   },
//   "analysis": {
//     "score": 0,
//     "experience_level": "...",
//     "summary": "...",
//     "strengths": ["...", "...", "...", "...", "..."],
//     "weaknesses": ["...", "...", "...", "..."],
//     "keywords_missing": ["...", "...", "..."]
//   }
// }`;

//   try {
//     const completion = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     const text = completion.choices[0].message.content;
//     const clean = text.replace(/```json|```/g, "").trim();
//     const parsed = JSON.parse(clean);

//     return parsed;
//   } catch (error) {
//     throw new Error(`AI generation failed: ${error.message}`);
//   }
// };

// import Groq from "groq-sdk";
// import { API_KEY } from "../utils/env.js";

// const groq = new Groq({ apiKey: API_KEY });

// export const generateEmailAndAnalysis = async (resumeText, jobRole) => {
//   const prompt = `
//   You are an expert HR consultant and professional resume analyst with 15+ years of experience in talent acquisition.

// You will be given a resume text and a target job role. Your task is to:
// 1. Write a highly professional job application email FROM the candidate TO the HR manager
// 2. Provide a detailed resume analysis

// TARGET JOB ROLE: ${jobRole}

// RESUME TEXT:
// ${resumeText}

// INSTRUCTIONS FOR EMAIL:
// - CRITICAL: Analyze the resume carefully and determine if candidate is Fresher, Junior, Mid-Level or Senior — write the email TONE accordingly. A fresher should NOT sound like a "seasoned professional"
// - NEVER use words like "seasoned", "esteemed", "I am writing to apply", "Please find attached"
// - Start with a strong, specific opening line based on ACTUAL skills found in resume
// - Mention candidate's real name from resume in signature
// - Highlight only skills that are ACTUALLY present in the resume — do not hallucinate skills
// - Keep body to 3 short paragraphs maximum
// - End with: "Looking forward to hearing from you." then new line "Regards," then candidate name from resume
// - Email body format should be:
//   Dear Hiring Manager,\n\n[Opening paragraph]\n\n[Middle paragraph]\n\n[Closing paragraph]\n\nLooking forward to hearing from you.\n\nRegards,\n[Candidate Name]

// INSTRUCTIONS FOR ANALYSIS:
// - score: Rate the resume out of 100 based on relevance to the job role, formatting quality, skills match, experience depth, and overall presentation
// - summary: 2-3 line overall assessment of the candidate's profile for this specific role
// - strengths: List 4-5 specific strengths pulled directly from the resume content (not generic)
// - weaknesses: List 3-4 specific gaps or improvements needed for this specific job role
// - keywords_missing: Important industry keywords/skills missing from resume that are typically required for this role
// - experience_level: "Fresher" | "Junior" | "Mid-Level" | "Senior" | "Expert"

// CRITICAL: Return ONLY a valid JSON object. No markdown, no backticks, no explanation. Just raw JSON.

// {
//   "email": {
//     "subject": "Application for [Job Role] — [Candidate Name if found, else Experienced Professional]",
//     "body": "Dear Hiring Manager,\n\n[Opening paragraph]\n\n[Middle paragraph]\n\n[Closing paragraph]\n\nLooking forward to hearing from you.\n\nRegards,\n[Candidate Name]"
//   },
//   "analysis": {
//     "score": 0,
//     "experience_level": "...",
//     "summary": "...",
//     "strengths": ["...", "...", "...", "...", "..."],
//     "weaknesses": ["...", "...", "...", "..."],
//     "keywords_missing": ["...", "...", "..."]
//   }
// }`;

//   try {
//     const completion = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     const text = completion.choices[0].message.content;

//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//       throw new Error("AI ne valid JSON return nahi kiya");
//     }

//     // ← Pehle extract karo, phir newlines escape karo
//     const escaped = jsonMatch[0]
//       .replace(/\n/g, "\\n")
//       .replace(/\r/g, "\\r")
//       .replace(/\t/g, "\\t");

//     const parsed = JSON.parse(escaped);
//     return parsed;
//   } catch (error) {
//     throw new Error(`AI generation failed: ${error.message}`);
//   }
// };
import Groq from "groq-sdk";
import { API_KEY } from "../utils/env.js";

const groq = new Groq({ apiKey: API_KEY });

export const generateEmailAndAnalysis = async (resumeText, jobRole) => {
  const prompt = `
You are an expert HR consultant and professional resume analyst with 15+ years of experience in talent acquisition.

You will be given a resume text and a target job role. Your task is to:
1. Write a highly professional job application email FROM the candidate TO the HR manager
2. Provide a detailed resume analysis

TARGET JOB ROLE: ${jobRole}

RESUME TEXT:
${resumeText}

Return ONLY valid JSON in the following format:

{
  "email": {
    "subject": "Application for [Job Role] — [Candidate Name]",
    "body": "Dear Hiring Manager..."
  },
  "analysis": {
    "score": 0,
    "experience_level": "...",
    "summary": "...",
    "strengths": [],
    "weaknesses": [],
    "keywords_missing": []
  }
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content.trim();

    // Attempt direct JSON parse
    try {
      return JSON.parse(text);
    } catch (err) {
      // Extract JSON if model added extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("AI did not return valid JSON");
      }

      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
};