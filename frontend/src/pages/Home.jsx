import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { analyseResume } from "../lib/api";

const Home = () => {
  const navigate = useNavigate();
  const [applicantName, setApplicantName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async () => {
    if (!applicantName || !jobRole || !hrEmail || !resume) {
      setError("Fill in all fields to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await analyseResume(jobRole, resume);
      navigate("/analysis", {
        state: {
          analysis: res.analysis,
          email: res.email,
          jobRole,
          applicantName,
          hrEmail,
          resume,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      label: "Section Scores",
      desc: "Every section graded with targeted feedback",
      icon: "01",
    },
    {
      label: "ATS Check",
      desc: "Keyword density and parsing compatibility",
      icon: "02",
    },
    {
      label: "Email Draft",
      desc: "HR-ready cover email generated instantly",
      icon: "03",
    },
    {
      label: "Rewrites",
      desc: "Side-by-side before/after bullet points",
      icon: "04",
    },
    {
      label: "Gap Analysis",
      desc: "Missing skills mapped to the role",
      icon: "05",
    },
    {
      label: "Send Direct",
      desc: "Email HR with your resume attached",
      icon: "06",
    },
  ];

  return (
    <div
      style={{
        background: "#f2f0eb",
        minHeight: "100vh",
        color: "#1a1812",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rf-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #d0cdc5;
          color: #1a1812;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          padding: 13px 0;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.01em;
        }
        .rf-input::placeholder { color: #b8b5ad; }
        .rf-input:focus { border-bottom-color: #1a1812; }

        .rf-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #999590;
          display: block;
          margin-bottom: 6px;
        }

        .rf-btn {
          background: #1a1812;
          color: #f2f0eb;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 15px 32px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          justify-content: center;
        }
        .rf-btn:hover:not(:disabled) { background: #2e2c24; }
        .rf-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #dedad2;
          border-left: 1px solid #dedad2;
        }
        .feature-cell {
          padding: 36px 32px;
          border-right: 1px solid #dedad2;
          border-bottom: 1px solid #dedad2;
          transition: background 0.15s;
        }
        .feature-cell:hover { background: #eceae4; }

        @media (max-width: 960px) {
          .hero-layout { grid-template-columns: 1fr !important; }
          .feature-grid { grid-template-columns: 1fr 1fr; }
          .hero-title { font-size: 72px !important; }
        }
        @media (max-width: 560px) {
          .feature-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 56px !important; }
        }

        .rf-file-upload {
          width: 100%;
          border: 1px dashed #ccc9be;
          padding: 18px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: transparent;
          margin-top: 6px;
        }
        .rf-file-upload:hover { border-color: #1a1812; background: #f8f7f3; }
        .rf-file-upload.has-file { border-color: #1a1812; border-style: solid; background: #f8f7f3; }
        .rf-file-upload input[type="file"] { display: none; }
        .rf-file-icon {
          width: 32px; height: 36px;
          border: 1px solid #ccc9be;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          background: #fff;
        }
        .rf-file-upload.has-file .rf-file-icon { border-color: #1a1812; }

        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .ticker-wrap {
          overflow: hidden;
          border-bottom: 1px solid #dedad2;
          padding: 11px 0;
          white-space: nowrap;
          background: #eeece6;
        }
        .ticker-track {
          display: inline-block;
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          margin-right: 40px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #aaa99f;
        }
        .ticker-sep {
          width: 3px; height: 3px;
          background: #ccc9be;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(242,240,235,0.94)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #dedad2",
          height: "56px",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "26px",
              height: "26px",
              background: "#1a1812",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "DM Mono",
                fontSize: "10px",
                fontWeight: 500,
                color: "#f2f0eb",
                letterSpacing: "0.04em",
              }}
            >
              RF
            </span>
          </div>
          <span
            style={{
              fontFamily: "DM Mono",
              fontSize: "13px",
              letterSpacing: "0.08em",
              color: "#1a1812",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            ResumeForge
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <span
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: "#999590",
              textTransform: "uppercase",
            }}
          >
            AI Resume Analysis
          </span>
          <div
            style={{
              background: "#1a1812",
              color: "#f2f0eb",
              fontFamily: "DM Mono",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "6px 14px",
              fontWeight: 500,
            }}
          >
            Free
          </div>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <div style={{ marginTop: "56px" }} className="ticker-wrap">
        <div className="ticker-track">
          {[...Array(2)].map((_, i) =>
            [
              "Resume Analysis",
              "ATS Optimization",
              "AI Email Draft",
              "Section Scores",
              "Gap Analysis",
              "Keyword Suggestions",
              "Rewrite Examples",
              "Send to HR",
            ].map((t) => (
              <span key={`${i}-${t}`} className="ticker-item">
                <span className="ticker-sep" />
                {t}
              </span>
            )),
          )}
        </div>
      </div>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "calc(100vh - 92px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(160,140,60,0.05) 0%, transparent 65%)`,
            left: `calc(${mousePos.x}% - 240px)`,
            top: `calc(${mousePos.y}% - 240px)`,
            transition: "left 1.2s ease, top 1.2s ease",
            pointerEvents: "none",
          }}
        />

        <div
          className="hero-layout"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            padding: "60px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 388px",
            gap: "80px",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "36px",
              }}
            >
              <div
                style={{ width: "24px", height: "1px", background: "#ccc9be" }}
              />
              <span
                style={{
                  fontFamily: "DM Mono",
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  color: "#b8b5ad",
                  textTransform: "uppercase",
                }}
              >
                AI-powered analysis
              </span>
            </div>

            <h1
              className="hero-title"
              style={{
                fontFamily: "DM Sans",
                fontSize: "clamp(60px, 8vw, 118px)",
                fontWeight: 300,
                lineHeight: 0.88,
                letterSpacing: "-0.03em",
                color: "#1a1812",
                marginBottom: "44px",
              }}
            >
              Resume
              <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px #1a1812",
                }}
              >
                Forge
              </span>
            </h1>

            <p
              style={{
                fontSize: "14px",
                fontWeight: 300,
                lineHeight: 1.9,
                color: "#808070",
                maxWidth: "400px",
                marginBottom: "44px",
              }}
            >
              Upload your resume. Name your role. Get a clinical breakdown of
              what works, what doesn't, and exactly how to fix it — in seconds.
            </p>

            <div style={{ borderTop: "1px solid #dedad2", display: "flex" }}>
              {[
                ["01", "Section Scores"],
                ["02", "ATS Keywords"],
                ["03", "AI Email"],
              ].map(([num, label]) => (
                <div
                  key={num}
                  style={{
                    padding: "18px 28px 18px 0",
                    marginRight: "28px",
                    borderRight: "1px solid #dedad2",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: "10px",
                      color: "#ccc9be",
                      letterSpacing: "0.1em",
                      marginBottom: "5px",
                    }}
                  >
                    {num}
                  </p>
                  <p
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: "11px",
                      color: "#808070",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dedad2",
              padding: "36px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px",
              }}
            >
              <p
                style={{
                  fontFamily: "DM Mono",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: "#b8b5ad",
                  textTransform: "uppercase",
                }}
              >
                Begin Analysis
              </p>
              <div
                style={{ width: "18px", height: "1px", background: "#dedad2" }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "26px" }}
            >
              {[
                {
                  label: "Your Name",
                  placeholder: "Rishabh Singh",
                  value: applicantName,
                  set: setApplicantName,
                  type: "text",
                },
                {
                  label: "Target Role",
                  placeholder: "Senior Backend Developer",
                  value: jobRole,
                  set: setJobRole,
                  type: "text",
                },
                {
                  label: "HR Email",
                  placeholder: "hr@company.com",
                  value: hrEmail,
                  set: setHrEmail,
                  type: "email",
                },
              ].map(({ label, placeholder, value, set, type }) => (
                <div key={label}>
                  <label className="rf-label">{label}</label>
                  <input
                    className="rf-input"
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                  />
                </div>
              ))}

              <div>
                <label className="rf-label">Resume — PDF</label>
                <label className={`rf-file-upload${resume ? " has-file" : ""}`}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files[0] || null)}
                  />
                  <div className="rf-file-icon">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                      <rect
                        x="1"
                        y="1"
                        width="9"
                        height="13"
                        rx="0"
                        stroke={resume ? "#1a1812" : "#ccc9be"}
                        strokeWidth="1"
                      />
                      <path
                        d="M8 1v4h4"
                        stroke={resume ? "#1a1812" : "#ccc9be"}
                        strokeWidth="1"
                      />
                      <path
                        d="M8 1l4 4"
                        stroke={resume ? "#1a1812" : "#ccc9be"}
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "DM Sans",
                        fontSize: "13px",
                        fontWeight: 300,
                        color: resume ? "#1a1812" : "#b8b5ad",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {resume ? resume.name : "Choose PDF file"}
                    </p>
                    {resume && (
                      <p
                        style={{
                          fontFamily: "DM Mono",
                          fontSize: "9px",
                          color: "#999590",
                          letterSpacing: "0.06em",
                          marginTop: "2px",
                        }}
                      >
                        {(resume.size / 1024).toFixed(0)} KB
                      </p>
                    )}
                  </div>
                  {!resume && (
                    <span
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        color: "#ccc9be",
                        textTransform: "uppercase",
                        flexShrink: 0,
                      }}
                    >
                      Browse
                    </span>
                  )}
                  {resume && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3a7a4a"
                      strokeWidth="1.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </label>
              </div>

              {error && (
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: "10px",
                    color: "#c0392b",
                    borderLeft: "2px solid #c0392b",
                    paddingLeft: "12px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                className="rf-btn"
                onClick={handleSubmit}
                disabled={loading}
                style={{ marginTop: "4px" }}
              >
                {loading ? (
                  <>
                    <svg
                      className="spin"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Analyzing
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </button>

              <p
                style={{
                  fontFamily: "DM Mono",
                  fontSize: "9px",
                  color: "#ccc9be",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                Processed Securely · No Storage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ borderTop: "1px solid #dedad2" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "56px 40px 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            <span
              style={{
                fontFamily: "DM Mono",
                fontSize: "9px",
                letterSpacing: "0.16em",
                color: "#b8b5ad",
                textTransform: "uppercase",
              }}
            >
              What You Get
            </span>
            <div style={{ flex: 1, height: "1px", background: "#dedad2" }} />
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <div className="feature-cell" key={f.icon}>
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: "9px",
                    color: "#ccc9be",
                    letterSpacing: "0.1em",
                    marginBottom: "18px",
                  }}
                >
                  {f.icon}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1a1812",
                    marginBottom: "7px",
                  }}
                >
                  {f.label}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#9a9890",
                    fontWeight: 300,
                    lineHeight: 1.75,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #dedad2",
          padding: "24px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              background: "#1a1812",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "DM Mono",
                fontSize: "7px",
                color: "#f2f0eb",
                fontWeight: 500,
              }}
            >
              RF
            </span>
          </div>
          <span
            style={{
              fontFamily: "DM Mono",
              fontSize: "9px",
              color: "#b8b5ad",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            ResumeForge
          </span>
        </div>
        <span
          style={{
            fontFamily: "DM Mono",
            fontSize: "9px",
            color: "#ccc9be",
            letterSpacing: "0.08em",
          }}
        >
          © 2026
        </span>
      </footer>
    </div>
  );
};

export default Home;
