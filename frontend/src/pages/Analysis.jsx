import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendResumeToEmail } from "../lib/api";

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rf-mono { font-family: 'DM Mono', monospace; }

  .rf-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7a7060;
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
    gap: 8px;
    width: 100%;
    justify-content: center;
  }
  .rf-btn-primary:hover:not(:disabled) { background: #f5c85a; }
  .rf-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .rf-btn-ghost {
    background: transparent;
    color: #7a7060;
    border: 1px solid #2e2c24;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.04em;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .rf-btn-ghost:hover { border-color: #4a4030; color: #f0ead8; }

  .rf-card {
    background: #161510;
    border: 1px solid #2e2c24;
    padding: 32px;
    margin-bottom: 20px;
  }

  .rf-section-card {
    background: #161510;
    border: 1px solid #2e2c24;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .rf-section-header {
    padding: 24px 28px;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .rf-section-header:hover { background: #1e1c16; }

  .rf-section-body {
    padding: 28px;
    border-top: 1px solid #2e2c24;
  }

  .score-high { color: #7ec87e; }
  .score-mid  { color: #e8b84b; }
  .score-low  { color: #c96a5a; }

  .rf-keyword {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    padding: 5px 12px;
    border: 1px solid #2e2c24;
    color: #e8b84b;
    background: #1e1c12;
  }

  .rewrite-box {
    background: #1a1812;
    border: 1px solid #2e2c24;
    padding: 16px;
    font-size: 13px;
    color: #c0b898;
    line-height: 1.7;
    font-weight: 300;
  }

  .priority-high { border-left: 2px solid #c96a5a; padding-left: 12px; }
  .priority-med  { border-left: 2px solid #e8b84b; padding-left: 12px; }
  .priority-low  { border-left: 2px solid #5a8a6a; padding-left: 12px; }

  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const Analysis = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { analysis, email, jobRole, applicantName, hrEmail, resume } = state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!analysis) {
    return (
      <div style={{ background: "#1c1b18", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{sharedStyles}</style>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", color: "#c96a5a", letterSpacing: "0.08em" }}>
          No analysis data found. <span style={{ color: "#e8b84b", cursor: "pointer" }} onClick={() => navigate("/")}>Go back →</span>
        </div>
      </div>
    );
  }

  const handleSendEmail = async () => {
    if (!resume) { setError("Resume file required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await sendResumeToEmail(hrEmail || "hr@company.com", jobRole, applicantName, resume);
      navigate("/email-preview", { state: { emailData: res, emailContent: email } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate email.");
    } finally {
      setLoading(false);
    }
  };

  const sections = analysis.sections || {};
  const sectionEntries = Object.entries(sections);
  const formatSectionName = (key) =>
    key.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const score = analysis.overall_score;
  const scoreColor = score >= 75 ? "#7ec87e" : score >= 50 ? "#e8b84b" : "#c96a5a";

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
          <span className="rf-tag" style={{ color: "#a09880" }}>ResumeForge</span>
        </div>
        <button className="rf-btn-ghost" style={{ padding: "8px 16px", fontSize: "12px" }} onClick={() => navigate("/")}>
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 40px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "48px" }}>
          <p className="rf-tag" style={{ color: "#e8b84b", marginBottom: "12px" }}>— Analysis complete</p>
          <h1 style={{ fontFamily: "DM Sans", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, letterSpacing: "-0.02em", color: "#f0ead8", lineHeight: 1.1, marginBottom: "12px" }}>
            {applicantName}
          </h1>
          <p style={{ fontSize: "14px", color: "#7a7060", fontWeight: 300 }}>
            {jobRole}
          </p>
        </div>

        {/* Overall Score */}
        <div className="rf-card" style={{ display: "flex", gap: "40px", alignItems: "flex-start", marginBottom: "32px" }}>
          <div style={{ flex: 1 }}>
            <p className="rf-tag" style={{ marginBottom: "16px" }}>Overall Score</p>
            <p style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "#a09070" }}>
              {analysis.overall_summary}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <span style={{ fontFamily: "DM Mono", fontSize: "64px", fontWeight: 400, color: scoreColor, letterSpacing: "-0.02em" }}>
              {score}
            </span>
            <span style={{ fontFamily: "DM Mono", fontSize: "18px", color: "#4a4030" }}>/100</span>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div className="rf-card" style={{ marginBottom: 0 }}>
            <p className="rf-tag" style={{ color: "#7ec87e", marginBottom: "20px" }}>— Strengths</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {analysis.top_strengths?.map((s, i) => (
                <li key={i} style={{ fontSize: "13px", color: "#a09070", fontWeight: 300, lineHeight: 1.6, paddingLeft: "12px", borderLeft: "1px solid #2e3828" }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rf-card" style={{ marginBottom: 0 }}>
            <p className="rf-tag" style={{ color: "#c96a5a", marginBottom: "20px" }}>— Critical Gaps</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {analysis.critical_gaps?.map((g, i) => (
                <li key={i} style={{ fontSize: "13px", color: "#a09070", fontWeight: 300, lineHeight: 1.6, paddingLeft: "12px", borderLeft: "1px solid #3a2820" }}>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Keywords */}
        <div className="rf-card">
          <p className="rf-tag" style={{ color: "#e8b84b", marginBottom: "20px" }}>— Keywords to Add</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {analysis.keywords_to_add?.map((kw, i) => (
              <span key={i} className="rf-keyword">{kw}</span>
            ))}
          </div>
        </div>

        {/* Section Analysis */}
        <div style={{ margin: "48px 0 32px" }}>
          <p className="rf-tag" style={{ color: "#e8b84b", marginBottom: "24px" }}>— Section Breakdown</p>
          {sectionEntries.map(([key, section]) => (
            <SectionCard key={key} sectionName={formatSectionName(key)} section={section} />
          ))}
        </div>

        {/* Send Email CTA */}
        <div className="rf-card">
          <p className="rf-tag" style={{ marginBottom: "20px" }}>— Next Step</p>
          <p style={{ fontSize: "14px", color: "#7a7060", fontWeight: 300, marginBottom: "24px" }}>
            Send your resume along with an AI-generated cover email directly to the HR manager.
          </p>
          {error && (
            <p style={{ fontFamily: "DM Mono", fontSize: "11px", color: "#e8b84b", borderLeft: "2px solid #e8b84b", paddingLeft: "12px", marginBottom: "16px" }}>
              {error}
            </p>
          )}
          <button className="rf-btn-primary" onClick={handleSendEmail} disabled={loading}>
            {loading ? (
              <>
                <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Generating Email
              </>
            ) : "Preview & Send Email"}
          </button>
        </div>

      </div>
    </div>
  );
};

const SectionCard = ({ sectionName, section }) => {
  const [expanded, setExpanded] = useState(false);
  const score = section.score;
  const scoreColor = score >= 8 ? "#7ec87e" : score >= 6 ? "#e8b84b" : score >= 4 ? "#c9924a" : "#c96a5a";
  const getPriority = (p) => p === "High" ? "priority-high" : p === "Medium" ? "priority-med" : "priority-low";

  return (
    <div className="rf-section-card">
      <div className="rf-section-header" onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#f0ead8", marginBottom: "6px", letterSpacing: "0.01em" }}>{sectionName}</p>
          <p style={{ fontSize: "12px", color: "#6a6050", fontWeight: 300 }}>{section.summary}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontFamily: "DM Mono", fontSize: "28px", color: scoreColor }}>{score}</span>
            <span style={{ fontFamily: "DM Mono", fontSize: "12px", color: "#3a3020" }}>/10</span>
          </div>
          <span style={{ fontFamily: "DM Mono", fontSize: "10px", color: "#4a4030" }}>{expanded ? "▼" : "▶"}</span>
        </div>
      </div>

      {expanded && (
        <div className="rf-section-body">
          {section.strengths?.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p className="rf-tag" style={{ color: "#7ec87e", marginBottom: "12px" }}>Strengths</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {section.strengths.map((s, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "#a09070", fontWeight: 300, lineHeight: 1.6, paddingLeft: "12px", borderLeft: "1px solid #2e3828" }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {section.suggestions?.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p className="rf-tag" style={{ marginBottom: "12px" }}>Suggestions</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {section.suggestions.map((sg, i) => (
                  <div key={i} className={getPriority(sg.priority)} style={{ fontSize: "13px", color: "#a09070", fontWeight: 300, lineHeight: 1.6 }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: "10px", letterSpacing: "0.08em", color: "#5a5040", marginRight: "8px" }}>[{sg.priority}]</span>
                    {sg.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.suggested_rewrites?.length > 0 && (
            <div>
              <p className="rf-tag" style={{ marginBottom: "12px" }}>Suggested Rewrites</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {section.suggested_rewrites.map((rw, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <p className="rf-tag" style={{ color: "#c96a5a", marginBottom: "8px" }}>Current</p>
                      <div className="rewrite-box">{rw.current}</div>
                    </div>
                    <div>
                      <p className="rf-tag" style={{ color: "#7ec87e", marginBottom: "8px" }}>Improved</p>
                      <div className="rewrite-box" style={{ borderColor: "#2e3828" }}>{rw.improved}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analysis;