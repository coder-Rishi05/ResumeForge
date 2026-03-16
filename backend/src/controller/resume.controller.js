import { extractTextFromPdf } from "../services/pdf.service.js";
import { generateEmailAndAnalysis } from "../services/ai.service.js";

export const resumeAnalyse = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Resume pdf is required" });
  }

  const { jobRole } = req.body;

  if (!jobRole) {
    return res
      .status(400)
      .json({ success: false, message: "Job role required" });
  }

  let resumeText;

  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "Text extraction failed",
      error: error.message,
    });
  }

  let aiResult;

  try {
    aiResult = await generateEmailAndAnalysis(resumeText, jobRole);
  } catch (error) {
    console.log(error)
    return res.status(502).json({
      success: false,
      message: "AI response failed.",
      error: error.message,
    });
  }

  return res.status(200).json({
    success: true,
    analyses: aiResult.analysis,
    meta: {
      jobRole,
      fileSize: `${(req.file.buffer.length / 1024).toFixed(2)}kb`,
      fileName: req.file.originalname,
    },
  });
};
