import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmailPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { emailData, emailContent } = state || {};
  const [copied, setCopied] = useState(false);

  if (!emailData || !emailContent) {
    return (
      <div style={{ background: "var(--bg-base)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", color: "var(--red)", letterSpacing: "0.08em" }}>
          No email data found.{" "}
          <span style={{ color: "var(--gold)", cursor: "pointer" }} onClick={() => navigate(-1)}>
            Go back →
          </span>
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${emailContent.subject}\n\n${emailContent.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", color: "var(--text-primary)", transition: "background 0.25s, color 0.25s" }}>

      {/* NAV SPACER */}
      <div style={{ height: "56px" }} />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 40px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <p className="rf-tag" style={{ color: "var(--gold)", marginBottom: "12px" }}>— Email Preview</p>
          <h1 style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            lineHeight: 1.1,
            transition: "color 0.25s",
          }}>
            Review Before Sending
          </h1>
        </div>

        {/* To */}
        <div className="rf-card">
          <p className="rf-tag" style={{ marginBottom: "8px" }}>To</p>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "var(--text-primary)" }}>
            {emailData.meta?.recipient || "HR Manager"}
          </p>
        </div>

        {/* Subject */}
        <div className="rf-card">
          <p className="rf-tag" style={{ marginBottom: "8px" }}>Subject</p>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "var(--text-primary)" }}>
            {emailContent.subject}
          </p>
        </div>

        {/* Body */}
        <div className="rf-card">
          <p className="rf-tag" style={{ marginBottom: "20px" }}>Email Body</p>
          <div style={{
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border)",
            padding: "28px",
            minHeight: "320px",
            transition: "background 0.25s, border-color 0.25s",
          }}>
            <pre style={{
              whiteSpace: "pre-wrap",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text-secondary)",
              lineHeight: 1.9,
            }}>
              {emailContent.body}
            </pre>
          </div>
        </div>

        {/* Meta */}
        {emailData.meta && (
          <div style={{ display: "flex", gap: "24px", marginBottom: "16px", padding: "0 4px" }}>
            <p style={{ fontFamily: "DM Mono, monospace", fontSize: "10px", color: "var(--text-faint)", letterSpacing: "0.08em" }}>
              FILE: {emailData.meta.fileName}
            </p>
            <p style={{ fontFamily: "DM Mono, monospace", fontSize: "10px", color: "var(--text-faint)", letterSpacing: "0.08em" }}>
              SIZE: {emailData.meta.fileSize}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button className="rf-btn-ghost" onClick={handleCopy} style={{ flex: 1 }}>
            {copied ? "✓ Copied" : "Copy Text"}
          </button>
          <button
            className="rf-btn-primary"
            style={{ flex: 1 }}
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