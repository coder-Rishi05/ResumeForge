import { sendEmail } from "../services/email.service.js";
import { extractTextFromPdf } from "../services/pdf.service.js";
import { generateEmailAndAnalysis } from "../services/ai.service.js";

// export const sendEmailController = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       message: "Resume PDF is required. Please attach a PDF file.",
//     });
//   }

//   const { to, subject, body, applicantName } = req.body;

//   if (!to) {
//     return res.status(400).json({
//       success: false,
//       message: "Recipient email (to) is required.",
//     });
//   }

//   if (!subject) {
//     return res.status(400).json({
//       success: false,
//       message: "Email subject is required.",
//     });
//   }

//   if (!body) {
//     return res.status(400).json({
//       success: false,
//       message: "Email body is required.",
//     });
//   }

//   const pdfBuffer = req.file.buffer;
//   const resumeText = await extractTextFromPdf(pdfBuffer);
//   const pdfFileName = req.file.originalname || "resume.pdf";
//   console.log(resumeText);
//   try {
//     await sendEmail({
//       hrEmail: to, // to → hrEmail
//       subject,
//       body, // text nahi, body
//       pdfBuffer, // alag se pass karo
//       originalName: req.file.originalname, // lowercase 'n' — next bug dekho
//     });
//     return res.status(200).json({
//       success: true,
//       message: `Email successfully sent to ${to}`,
//       // Debug info — Phase 3 mein yahan AI metadata bhi add karenge
//       meta: {
//         recipient: to,
//         subject,
//         applicantName: applicantName || "Not provided",
//         attachedFile: pdfFileName,
//         fileSize: `${(pdfBuffer.length / 1024).toFixed(2)} KB`,
//       },
//     });
//   } catch (error) {
//     console.error("Email sending failed:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to send email. Please check server logs.",

//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

export const sendEmailController = async (req, res) => {
  // ── Validation ──────────────────────────────────────────────────────────
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Resume PDF is required. Please attach a PDF file.",
    });
  }

  const { to, applicantName, jobRole } = req.body;

  if (!to) {
    return res.status(400).json({
      success: false,
      message: "Recipient email (to) is required.",
    });
  }

  if (!jobRole) {
    return res.status(400).json({
      success: false,
      message: "Job role is required.",
    });
  }

  // ── Step 1: PDF → Text ───────────────────────────────────────────────────
  let resumeText;
  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
    console.log("Resume text extracted ✅");
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "failed to extract the texts",
      error: error.message,
    });
  }

  // ── Step 2: Text → AI ────────────────────────────────────────────────────
  let aiResult;
  try {
    aiResult = await generateEmailAndAnalysis(resumeText, jobRole);
    console.log("AI response received ✅");
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "AI response failed.",
      error: error.message,
    });
  }

  // ── Step 3: Email bhejo ──────────────────────────────────────────────────
  try {
    await sendEmail({
      hrEmail: to,
      subject: aiResult.email.subject,
      body: aiResult.email.body,
      pdfBuffer: req.file.buffer,
      originalName: req.file.originalname,
    });

    return res.status(200).json({
      success: true,
      message: `Email successfully sent to ${to}`,
      analysis: aiResult.analysis,
      meta: {
        recipient: to,
        subject: aiResult.email.subject,
        applicantName: applicantName || "Not provided",
        jobRole,
        attachedFile: req.file.originalname,
        fileSize: `${(req.file.buffer.length / 1024).toFixed(2)} KB`,
      },
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Cant send email.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
