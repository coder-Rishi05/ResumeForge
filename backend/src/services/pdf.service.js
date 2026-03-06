import PDFParser from "pdf2json";

const safeDecode = (str) => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
};

export const extractTextFromPdf = async (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        const text = pdfData.Pages.map((page) =>
          page.Texts.map((t) => safeDecode(t.R[0].T)).join(" ")
        )
          .join("\n")
          .trim();

        if (!text) {
          reject(new Error("No readable text in pdf"));
        }

        resolve(text);
      } catch (err) {
        reject(new Error(`PDF parsing failed: ${err.message}`));
      }
    });

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(new Error(`PDF parsing failed: ${err.parserError}`));
    });

    pdfParser.parseBuffer(buffer);
  });
};