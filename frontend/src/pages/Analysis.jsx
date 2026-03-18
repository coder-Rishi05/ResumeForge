import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendResumeToEmail } from "../lib/api";

const Analysis = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { analysis, email, jobRole, applicantName, hrEmail, resume } = state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!analysis) {
    return (
      <div style={{ background: "var(--bg-base)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", color: "var(--red)", letterSpacing: "0.08em" }}>
          No analysis data found.{" "}
          <span style={{ color: "var(--gold)", cursor: "pointer" }} onClick={() => navigate("/")}>
            Go back →
          </span>
        </p>
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
  const scoreColor = score >= 75 ? "var(--green)" : score >= 50 ? "var(--gold)" : "var(--red)";

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", color: "var(--text-primary)", transition: "background 0.25s, color 0.25s" }}>

      {/* NAV SPACER */}
      <div style={{ height: "56px" }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 40px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "48px" }}>
          <p className="rf-tag" style={{ color: "var(--gold)", marginBottom: "12px" }}>— Analysis complete</p>
          <h1 style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            lineHeight: 1.1,
            marginBottom: "12px",
            transition: "color 0.25s",
          }}>
            {applicantName}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 300 }}>{jobRole}</p>
        </div>

        {/* Overall Score */}
        <div className="rf-card" style={{ display: "flex", gap: "40px", alignItems: "flex-start", marginBottom: "32px" }}>
          <div style={{ flex: 1 }}>
            <p className="rf-tag" style={{ marginBottom: "16px" }}>Overall Score</p>
            <p style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              {analysis.overall_summary}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: "64px", fontWeight: 400, color: scoreColor, letterSpacing: "-0.02em" }}>
              {score}
            </span>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: "18px", color: "var(--text-faint)" }}>/100</span>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div className="rf-card" style={{ marginBottom: 0 }}>
            <p className="rf-tag" style={{ color: "var(--green)", marginBottom: "20px" }}>— Strengths</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {analysis.top_strengths?.map((s, i) => (
                <li key={i} style={{
                  fontSize: "13px", color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6,
                  paddingLeft: "12px", borderLeft: "1px solid var(--green)",
                }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rf-card" style={{ marginBottom: 0 }}>
            <p className="rf-tag" style={{ color: "var(--red)", marginBottom: "20px" }}>— Critical Gaps</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {analysis.critical_gaps?.map((g, i) => (
                <li key={i} style={{
                  fontSize: "13px", color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6,
                  paddingLeft: "12px", borderLeft: "1px solid var(--red)",
                }}>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Keywords */}
        <div className="rf-card">
          <p className="rf-tag" style={{ color: "var(--gold)", marginBottom: "20px" }}>— Keywords to Add</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {analysis.keywords_to_add?.map((kw, i) => (
              <span key={i} className="rf-keyword">{kw}</span>
            ))}
          </div>
        </div>

        {/* Section Analysis */}
        <div style={{ margin: "48px 0 32px" }}>
          <p className="rf-tag" style={{ color: "var(--gold)", marginBottom: "24px" }}>— Section Breakdown</p>
          {sectionEntries.map(([key, section]) => (
            <SectionCard key={key} sectionName={formatSectionName(key)} section={section} />
          ))}
        </div>

        {/* Send Email CTA */}
        <div className="rf-card">
          <p className="rf-tag" style={{ marginBottom: "20px" }}>— Next Step</p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 300, marginBottom: "24px" }}>
            Send your resume along with an AI-generated cover email directly to the HR manager.
          </p>
          {error && (
            <p style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "11px",
              color: "var(--gold)",
              borderLeft: "2px solid var(--gold)",
              paddingLeft: "12px",
              marginBottom: "16px",
            }}>
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

/* ── Section Card ── */
const SectionCard = ({ sectionName, section }) => {
  const [expanded, setExpanded] = useState(false);
  const score = section.score;
  const scoreColor = score >= 8 ? "var(--green)" : score >= 6 ? "var(--gold)" : score >= 4 ? "#c9924a" : "var(--red)";

  const getPriority = (p) =>
    p === "High" ? "priority-high" : p === "Medium" ? "priority-med" : "priority-low";

  return (
    <div className="rf-section-card">
      <div className="rf-section-header" onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "0.01em", transition: "color 0.25s" }}>
            {sectionName}
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 300 }}>{section.summary}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: "28px", color: scoreColor }}>{score}</span>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", color: "var(--text-faint)" }}>/10</span>
          </div>
          <span style={{ fontFamily: "DM Mono, monospace", fontSize: "10px", color: "var(--text-faint)" }}>
            {expanded ? "▼" : "▶"}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="rf-section-body">
          {section.strengths?.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p className="rf-tag" style={{ color: "var(--green)", marginBottom: "12px" }}>Strengths</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {section.strengths.map((s, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6, paddingLeft: "12px", borderLeft: "1px solid var(--green)" }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.suggestions?.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p className="rf-tag" style={{ marginBottom: "12px" }}>Suggestions</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {section.suggestions.map((sg, i) => (
                  <div key={i} className={getPriority(sg.priority)} style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6 }}>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "10px", letterSpacing: "0.08em", color: "var(--text-faint)", marginRight: "8px" }}>
                      [{sg.priority}]
                    </span>
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
                      <p className="rf-tag" style={{ color: "var(--red)", marginBottom: "8px" }}>Current</p>
                      <div className="rewrite-box">{rw.current}</div>
                    </div>
                    <div>
                      <p className="rf-tag" style={{ color: "var(--green)", marginBottom: "8px" }}>Improved</p>
                      <div className="rewrite-box" style={{ borderColor: "var(--green)" }}>{rw.improved}</div>
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