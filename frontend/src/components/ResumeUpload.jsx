import React from "react";

const FileIcon = ({ active }) => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
    <rect
      x="1"
      y="1"
      width="9"
      height="13"
      rx="0"
      stroke={active ? "var(--input-focus)" : "var(--border-subtle)"}
      strokeWidth="1"
    />
    <path
      d="M8 1v4h4"
      stroke={active ? "var(--input-focus)" : "var(--border-subtle)"}
      strokeWidth="1"
    />
    <path
      d="M8 1l4 4"
      stroke={active ? "var(--input-focus)" : "var(--border-subtle)"}
      strokeWidth="1"
    />
  </svg>
);

const ResumeUpload = ({ value, onChange }) => {
  return (
    <div>
      <label className="rf-label">Resume — PDF</label>
      <label className={`rf-file-upload${value ? " has-file" : ""}`}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => onChange(e.target.files[0] || null)}
        />

        {/* File icon box */}
        <div
          style={{
            width: "32px",
            height: "36px",
            border: `1px solid ${value ? "var(--input-focus)" : "var(--border-subtle)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: "var(--bg-surface)",
            transition: "border-color 0.2s",
          }}
        >
          <FileIcon active={!!value} />
        </div>

        {/* File info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: value ? "var(--input-text)" : "var(--input-placeholder)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
          >
            {value ? value.name : "Choose PDF file"}
          </p>
          {value && (
            <p
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "9px",
                color: "var(--text-muted)",
                letterSpacing: "0.06em",
                marginTop: "2px",
              }}
            >
              {(value.size / 1024).toFixed(0)} KB
            </p>
          )}
        </div>

        {/* Right indicator */}
        {!value ? (
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: "var(--text-primary)",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            Browse
          </span>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--green)"
            strokeWidth="1.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </label>
    </div>
  );
};

export default ResumeUpload;
