import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: "var(--nav-bg)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--nav-border)",
      height: "56px",
      padding: "0 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "background 0.25s, border-color 0.25s",
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
      >
        <div style={{
          width: "26px", height: "26px",
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.15s",
        }}>
          <span style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "10px", fontWeight: 500,
            color: "var(--accent-fg)",
            letterSpacing: "0.04em",
          }}>RF</span>
        </div>
        <span style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          color: "var(--nav-text)",
          textTransform: "uppercase",
          transition: "color 0.25s",
        }}>ResumeForge</span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.12em",
          color: "var(--nav-muted)",
          textTransform: "uppercase",
          transition: "color 0.25s",
        }}>
          AI Resume Analysis
        </span>

        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Free badge */}
        <div style={{
          background: "var(--accent)",
          color: "var(--accent-fg)",
          fontFamily: "DM Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "5px 11px",
          transition: "background 0.25s",
        }}>
          Free
        </div>
      </div>
    </nav>
  );
};

export default Navbar;