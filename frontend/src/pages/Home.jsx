import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { analyseResume } from "../lib/api";
import ResumeUpload from "../components/ResumeUpload";

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
    { label: "Section Scores",  desc: "Every section graded with targeted feedback",     icon: "01" },
    { label: "ATS Check",       desc: "Keyword density and parsing compatibility",        icon: "02" },
    { label: "Email Draft",     desc: "HR-ready cover email generated instantly",         icon: "03" },
    { label: "Rewrites",        desc: "Side-by-side before/after bullet points",          icon: "04" },
    { label: "Gap Analysis",    desc: "Missing skills mapped to the role",                icon: "05" },
    { label: "Send Direct",     desc: "Email HR with your resume attached",               icon: "06" },
  ];

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", color: "var(--text-primary)", transition: "background 0.25s, color 0.25s" }}>

      {/* ── TICKER ── */}
      <div style={{ marginTop: "56px" }} className="ticker-wrap">
        <div className="ticker-track">
          {[...Array(2)].map((_, i) =>
            ["Resume Analysis", "ATS Optimization", "AI Email Draft", "Section Scores",
             "Gap Analysis", "Keyword Suggestions", "Rewrite Examples", "Send to HR"
            ].map((t) => (
              <span key={`${i}-${t}`} className="ticker-item">
                <span className="ticker-sep" />
                {t}
              </span>
            ))
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
        {/* Ambient glow that follows cursor */}
        <div style={{
          position: "absolute",
          width: "480px", height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,184,75,0.06) 0%, transparent 65%)",
          left: `calc(${mousePos.x}% - 240px)`,
          top:  `calc(${mousePos.y}% - 240px)`,
          transition: "left 1.2s ease, top 1.2s ease",
          pointerEvents: "none",
        }} />

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
          {/* LEFT — Copy */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px" }}>
              <div style={{ width: "24px", height: "1px", background: "var(--border-subtle)" }} />
              <span style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.16em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}>AI-powered analysis</span>
            </div>

            <h1 style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "clamp(60px, 8vw, 118px)",
              fontWeight: 300,
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: "44px",
              transition: "color 0.25s",
            }}>
              Resume
              <br />
              <span style={{
                color: "transparent",
                WebkitTextStroke: "1.5px var(--text-primary)",
                transition: "-webkit-text-stroke-color 0.25s",
              }}>
                Forge
              </span>
            </h1>

            <p style={{
              fontSize: "14px",
              fontWeight: 300,
              lineHeight: 1.9,
              color: "var(--text-secondary)",
              maxWidth: "400px",
              marginBottom: "44px",
              transition: "color 0.25s",
            }}>
              Upload your resume. Name your role. Get a clinical breakdown of
              what works, what doesn't, and exactly how to fix it — in seconds.
            </p>

            <div style={{ borderTop: "1px solid var(--border)", display: "flex" }}>
              {[["01", "Section Scores"], ["02", "ATS Keywords"], ["03", "AI Email"]].map(([num, label]) => (
                <div key={num} style={{
                  padding: "18px 28px 18px 0",
                  marginRight: "28px",
                  borderRight: "1px solid var(--border)",
                }}>
                  <p style={{ fontFamily: "DM Mono, monospace", fontSize: "10px", color: "var(--text-faint)", letterSpacing: "0.1em", marginBottom: "5px" }}>
                    {num}
                  </p>
                  <p style={{ fontFamily: "DM Mono, monospace", fontSize: "11px", color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            padding: "36px 32px",
            transition: "background 0.25s, border-color 0.25s",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "32px",
            }}>
              <p style={{ fontFamily: "DM Mono, monospace", fontSize: "9px", letterSpacing: "0.14em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Begin Analysis
              </p>
              <div style={{ width: "18px", height: "1px", background: "var(--border)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
              {[
                { label: "Your Name",    placeholder: "Rishabh Singh",            value: applicantName, set: setApplicantName, type: "text"  },
                { label: "Target Role",  placeholder: "Senior Backend Developer",  value: jobRole,       set: setJobRole,       type: "text"  },
                { label: "HR Email",     placeholder: "hr@company.com",            value: hrEmail,       set: setHrEmail,       type: "email" },
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

              <ResumeUpload value={resume} onChange={setResume} />

              {error && (
                <p style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "10px",
                  color: "var(--red)",
                  borderLeft: "2px solid var(--red)",
                  paddingLeft: "12px",
                  letterSpacing: "0.04em",
                }}>
                  {error}
                </p>
              )}

              <button
                className="rf-btn-dark"
                onClick={handleSubmit}
                disabled={loading}
                style={{ marginTop: "4px" }}
              >
                {loading ? (
                  <>
                    <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Analyzing
                  </>
                ) : "Analyze Resume"}
              </button>

              <p style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "9px",
                color: "var(--text-faint)",
                letterSpacing: "0.08em",
                textAlign: "center",
                textTransform: "uppercase",
              }}>
                Processed Securely · No Storage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 40px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: "9px", letterSpacing: "0.16em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              What You Get
            </span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          <div className="feature-grid">
            {features.map((f) => (
              <div className="feature-cell" key={f.icon}>
                <p style={{ fontFamily: "DM Mono, monospace", fontSize: "9px", color: "var(--text-faint)", letterSpacing: "0.1em", marginBottom: "18px" }}>
                  {f.icon}
                </p>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "7px", transition: "color 0.25s" }}>
                  {f.label}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, transition: "color 0.25s" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "18px", height: "18px",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.25s",
          }}>
            <span style={{ fontFamily: "DM Mono", fontSize: "7px", color: "var(--accent-fg)", fontWeight: 500 }}>RF</span>
          </div>
          <span style={{ fontFamily: "DM Mono, monospace", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ResumeForge
          </span>
        </div>
        <span style={{ fontFamily: "DM Mono, monospace", fontSize: "9px", color: "var(--text-faint)", letterSpacing: "0.08em" }}>
          © 2026
        </span>
      </footer>
    </div>
  );
};

export default Home;