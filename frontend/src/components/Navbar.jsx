import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

        .rf-nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(242,240,235,0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #dedad2;
          padding: 0 40px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rf-nav-logo {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
        }

        .rf-nav-mark {
          width: 26px; height: 26px;
          background: #1a1812;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .rf-nav-logo:hover .rf-nav-mark { background: #2e2c24; }

        .rf-nav-name {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #1a1812;
          text-transform: uppercase;
        }

        .rf-nav-right {
          display: flex; align-items: center; gap: 28px;
        }

        .rf-nav-tag {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          color: #b8b5ad;
          text-transform: uppercase;
        }

        .rf-nav-badge {
          background: #1a1812;
          color: #f2f0eb;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 11px;
        }
      `}</style>

      <nav className="rf-nav-root">
        <div className="rf-nav-logo" onClick={() => navigate("/")}>
          <div className="rf-nav-mark">
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: "10px", fontWeight: 500, color: "#f2f0eb", letterSpacing: "0.04em" }}>RF</span>
          </div>
          <span className="rf-nav-name">ResumeForge</span>
        </div>

        <div className="rf-nav-right">
          <span className="rf-nav-tag">AI Resume Analysis</span>
          <div className="rf-nav-badge">Free</div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;