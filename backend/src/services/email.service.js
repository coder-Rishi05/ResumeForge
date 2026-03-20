// import nodemailer from "nodemailer";
// import { EMAIL_APP_PASSWORD, EMAIL_USER } from "../utils/env.js";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: EMAIL_USER,
//     pass: EMAIL_APP_PASSWORD,
//   },
// });

// export const sendEmail = async ({
//   hrEmail,
//   subject,
//   body,
//   pdfBuffer,
//   originalName,
// }) => {
//   const mailOptions = {
//     from: EMAIL_USER,
//     to: hrEmail,
//     subject: subject,
//     text: body,
//     attachments: [
//       {
//         filename: originalName || "resume.pdf",
//         content: pdfBuffer,
//         contentType: "application/pdf",
//       },
//     ],
//   };
//   const result = await transporter.sendMail(mailOptions);
//   return result;
// };
import { BREVO_API_KEY, EMAIL_USER } from "../utils/env.js";
export const sendEmail = async ({
  hrEmail,
  subject,
  body,
  pdfBuffer,
  originalName,
}) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Rishabh Singh", email: EMAIL_USER },
      to: [{ email: hrEmail }],
      subject,
      textContent: body,
      attachment: [
        {
          name: originalName || "resume.pdf",
          content: pdfBuffer.toString("base64"),
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("Brevo error:", data);
    throw new Error(data.message || "Email send failed");
  }

  return data;
};
