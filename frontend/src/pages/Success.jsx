import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

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
    width: 100%;
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
    width: 100%;
  }
  .rf-btn-ghost:hover { border-color: #4a4030; color: #f0ead8; }

  .step-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #2a2820;
  }
  .step-item:last-child { border-bottom: none; }
`;

const Success = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { recipient } = state || {};

  const steps = [
    { label: "Check Your Email", desc: "Keep an eye on your inbox for responses from the recruiter." },
    { label: "Follow Up", desc: "After a week, consider a polite follow-up email." },
    { label: "Apply to More", desc: "Analyze and apply to multiple positions to increase your chances." },
  ];

  return (
    <div style={{ background: "#1c1b18", minHeight: "100vh", color: "#f0ead8", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", display: "flex", flexDirection: "column" }}>
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
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 40px" }}>
        <div style={{ maxWidth: "480px", width: "100%" }}>

          {/* Check mark */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              width: "56px", height: "56px",
              background: "#1e2a1e",
              border: "1px solid #2e3828",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "32px",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7ec87e" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ fontFamily: "DM Mono", fontSize: "10px", letterSpacing: "0.15em", color: "#7ec87e", textTransform: "uppercase", marginBottom: "12px" }}>— Sent</p>
            <h1 style={{ fontFamily: "DM Sans", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 300, letterSpacing: "-0.02em", color: "#f0ead8", lineHeight: 1.1, marginBottom: "16px" }}>
              Email Sent
            </h1>
            <p style={{ fontSize: "14px", color: "#7a7060", fontWeight: 300, lineHeight: 1.7 }}>
              Your resume and cover letter have been dispatched to{" "}
              <span style={{ color: "#e8b84b" }}>{recipient || "HR Manager"}</span>.
            </p>
          </div>

          {/* Next steps */}
          <div style={{ background: "#161510", border: "1px solid #2e2c24", padding: "24px 28px", marginBottom: "24px" }}>
            <p style={{ fontFamily: "DM Mono", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#7a7060", marginBottom: "4px" }}>Next Steps</p>
            {steps.map((s, i) => (
              <div key={i} className="step-item">
                <span style={{ fontFamily: "DM Mono", fontSize: "10px", color: "#4a4030", letterSpacing: "0.06em", flexShrink: 0, marginTop: "3px" }}>
                  0{i + 1}
                </span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#f0ead8", marginBottom: "4px" }}>{s.label}</p>
                  <p style={{ fontSize: "12px", color: "#6a6050", fontWeight: 300, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button className="rf-btn-primary" onClick={() => navigate("/")}>
              Analyze Another Resume
            </button>
            <button className="rf-btn-ghost" onClick={() => navigate("/analysis")}>
              View Analysis
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Success;