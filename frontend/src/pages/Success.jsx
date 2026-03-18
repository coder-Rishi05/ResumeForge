import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { recipient } = state || {};

  const steps = [
    {
      label: "Check Your Email",
      desc: "Keep an eye on your inbox for responses from the recruiter.",
    },
    {
      label: "Follow Up",
      desc: "After a week, consider a polite follow-up email.",
    },
    {
      label: "Apply to More",
      desc: "Analyze and apply to multiple positions to increase your chances.",
    },
  ];

  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "100vh",
        color: "var(--text-primary)",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.25s, color 0.25s",
      }}
    >
      {/* NAV SPACER */}
      <div style={{ height: "56px" }} />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 40px",
        }}
      >
        <div style={{ maxWidth: "480px", width: "100%" }}>
          {/* Check mark */}
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "32px",
                transition: "background 0.25s, border-color 0.25s",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--green)"
                strokeWidth="1.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <p
              className="rf-tag"
              style={{ color: "var(--green)", marginBottom: "12px" }}
            >
              — Sent
            </p>

            <h1
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                lineHeight: 1.1,
                marginBottom: "16px",
                transition: "color 0.25s",
              }}
            >
              Email Sent
            </h1>

            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                fontWeight: 300,
                lineHeight: 1.7,
              }}
            >
              Your resume and cover letter have been dispatched to{" "}
              <span style={{ color: "var(--gold)" }}>
                {recipient || "HR Manager"}
              </span>
              .
            </p>
          </div>

          {/* Next steps */}
          <div className="rf-card" style={{ marginBottom: "24px" }}>
            <p className="rf-tag" style={{ marginBottom: "4px" }}>
              Next Steps
            </p>
            {steps.map((s, i) => (
              <div key={i} className="step-item">
                <span
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: "10px",
                    color: "var(--text-faint)",
                    letterSpacing: "0.06em",
                    flexShrink: 0,
                    marginTop: "3px",
                  }}
                >
                  0{i + 1}
                </span>
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                      transition: "color 0.25s",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      fontWeight: 300,
                      lineHeight: 1.6,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button className="rf-btn-primary" onClick={() => navigate("/")}>
              Analyze Another Resume
            </button>
            <button
              className="rf-btn-ghost"
              onClick={() => navigate("/analysis")}
            >
              View Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
