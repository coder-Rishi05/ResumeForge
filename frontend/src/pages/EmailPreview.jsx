import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rf-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7a7060;
    display: block;
    margin-bottom: 6px;
  }

  .rf-btn-primary {
    background: #e8b84b;
    color: #1a1812;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 14px 28px;
    cursor: pointer;
    transition: background 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
  }
  .rf-btn-primary:hover { background: #f5c85a; }

  .rf-btn-ghost {
    background: transparent;
    color: #7a7060;
    border: 1px solid #2e2c24;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.04em;
    padding: 14px 28px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
  }
  .rf-btn-ghost:hover { border-color: #4a4030; color: #f0ead8; }

  .rf-card {
    background: #161510;
    border: 1px solid #2e2c24;
    padding: 28px 32px;
    margin-bottom: 16px;
  }
`;

const EmailPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { emailData, emailContent } = state || {};
  const [copied, setCopied] = useState(false);

  if (!emailData || !emailContent) {
    return (
      <div style={{ background: "#1c1b18", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{sharedStyles}</style>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", color: "#c96a5a", letterSpacing: "0.08em" }}>
          No email data found.{" "}
          <span style={{ color: "#e8b84b", cursor: "pointer" }} onClick={() => navigate(-1)}>Go back →</span>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${emailContent.subject}\n\n${emailContent.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: "#1c1b18", minHeight: "100vh", color: "#f0ead8", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{sharedStyles}</style>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(28,27,24,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #2a2820", padding: "0 40px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ width: "28px", height: "28px", background: "#e8b84b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "DM Mono", fontSize: "11px", fontWeight: 500, color: "#1a1812" }}>RF</span>
          </div>
          <span style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", letterSpacing: "0.08em", color: "#a09880", textTransform: "uppercase" }}>ResumeForge</span>
        </div>
        <button className="rf-btn-ghost" style={{ padding: "8px 16px", fontSize: "12px", flex: "unset" }} onClick={() => navigate(-1)}>
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 40px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontFamily: "DM Mono", fontSize: "10px", letterSpacing: "0.15em", color: "#e8b84b", textTransform: "uppercase", marginBottom: "12px" }}>— Email Preview</p>
          <h1 style={{ fontFamily: "DM Sans", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em", color: "#f0ead8", lineHeight: 1.1 }}>
            Review Before Sending
          </h1>
        </div>

        {/* To */}
        <div className="rf-card">
          <p className="rf-tag">To</p>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "#f0ead8" }}>
            {emailData.meta?.recipient || "HR Manager"}
          </p>
        </div>

        {/* Subject */}
        <div className="rf-card">
          <p className="rf-tag">Subject</p>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "#f0ead8" }}>
            {emailContent.subject}
          </p>
        </div>

        {/* Body */}
        <div className="rf-card">
          <p className="rf-tag" style={{ marginBottom: "20px" }}>Email Body</p>
          <div style={{
            background: "#1a1812",
            border: "1px solid #2a2820",
            padding: "28px",
            minHeight: "320px",
          }}>
            <pre style={{
              whiteSpace: "pre-wrap",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "#c0b090",
              lineHeight: 1.9,
            }}>
              {emailContent.body}
            </pre>
          </div>
        </div>

        {/* Meta */}
        {emailData.meta && (
          <div style={{ display: "flex", gap: "24px", marginBottom: "16px", padding: "0 4px" }}>
            <p style={{ fontFamily: "DM Mono", fontSize: "10px", color: "#4a4030", letterSpacing: "0.08em" }}>
              FILE: {emailData.meta.fileName}
            </p>
            <p style={{ fontFamily: "DM Mono", fontSize: "10px", color: "#4a4030", letterSpacing: "0.08em" }}>
              SIZE: {emailData.meta.fileSize}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button className="rf-btn-ghost" onClick={handleCopy}>
            {copied ? "✓ Copied" : "Copy Text"}
          </button>
          <button
            className="rf-btn-primary"
            onClick={() => navigate("/success", { state: { recipient: emailData.meta?.recipient } })}
          >
            Send Email
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailPreview;