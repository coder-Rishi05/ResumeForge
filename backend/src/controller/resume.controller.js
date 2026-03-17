// import { extractTextFromPdf } from "../services/pdf.service.js";
// import { generateEmailAndAnalysis } from "../services/ai.service.js";

// export const resumeAnalyse = async (req, res) => {
//   if (!req.file) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Resume pdf is required" });
//   }

//   const { jobRole } = req.body;

//   if (!jobRole) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Job role required" });
//   }

//   let resumeText;

//   try {
//     resumeText = await extractTextFromPdf(req.file.buffer);
//   } catch (error) {
//     return res.status(422).json({
//       success: false,
//       message: "Text extraction failed",
//       error: error.message,
//     });
//   }

//   let aiResult;

//   try {
//     aiResult = await generateEmailAndAnalysis(resumeText, jobRole);
//   } catch (error) {
//     console.log(error)
//     return res.status(502).json({
//       success: false,
//       message: "AI response failed.",
//       error: error.message,
//     });
//   }

//   return res.status(200).json({
//     success: true,
//     analyses: aiResult.analysis,
//     meta: {
//       jobRole,
//       fileSize: `${(req.file.buffer.length / 1024).toFixed(2)}kb`,
//       fileName: req.file.originalname,
//     },
//   });
// };

import { extractTextFromPdf } from "../services/pdf.service.js";
import { generateEmailAndAnalysis } from "../services/ai.service.js";

export const resumeAnalyse = async (req, res) => {
  // ── Validation ───────────────────────────────────────────────────────
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Resume PDF is required" });
  }

  const { jobRole } = req.body;

  if (!jobRole) {
    return res
      .status(400)
      .json({ success: false, message: "Job role is required" });
  }

  // ── Step 1: Extract text from PDF ────────────────────────────────────
  let resumeText;

  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
    console.log("✅ Resume text extracted");
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "Text extraction failed",
      error: error.message,
    });
  }

  // ── Step 2: Generate detailed analysis via AI ────────────────────────
  let aiResult;

  try {
    aiResult = await generateEmailAndAnalysis(resumeText, jobRole);
    console.log("✅ AI response received - Section-wise analysis generated");
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(502).json({
      success: false,
      message: "AI response failed",
      error: error.message,
    });
  }

  // ── Step 3: Return structured response ───────────────────────────────
  // Frontend gets:
  // - email: subject + body for preview
  // - analysis:
  //   * overall metrics (score, summary, strengths, gaps, keywords)
  //   * sections: detailed breakdown of each resume section

  return res.status(200).json({
    success: true,
    email: aiResult.email, // { subject, body }
    analysis: aiResult.analysis, // All detailed analysis
    meta: {
      jobRole,
      fileSize: `${(req.file.buffer.length / 1024).toFixed(2)} KB`,
      fileName: req.file.originalname,
    },
  });
};
