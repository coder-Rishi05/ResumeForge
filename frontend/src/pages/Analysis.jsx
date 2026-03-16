import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendResumeToEmail } from "../lib/api";

const Analysis = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { analysis, jobRole, applicantName, hrEmail } = state || {};
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!analysis) {
    return <div className="p-8">No analysis data found. Please go back to Home.</div>;
  }

  const handleSendEmail = async () => {
    if (!resumeFile) {
      setError("Resume dobara select karo email bhejna ke liye");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await sendResumeToEmail(hrEmail, jobRole, applicantName, resumeFile);
      navigate("/email-preview", {
        state: { emailData: res, recipient: hrEmail },
      });
    } catch (err) {
      setError("Email send nahi ho saka. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Resume Analysis</h1>

      <div className="card bg-base-200 p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Score</h2>
          <span className="text-4xl font-bold text-primary">{analysis.score}/100</span>
        </div>
        <p className="text-sm text-gray-500">Experience Level: {analysis.experience_level}</p>
        <p className="mt-2">{analysis.summary}</p>
      </div>

      <div className="card bg-base-200 p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">Strengths</h2>
        <ul className="list-disc list-inside space-y-1">
          {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="card bg-base-200 p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">Weaknesses</h2>
        <ul className="list-disc list-inside space-y-1">
          {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </div>

      <div className="card bg-base-200 p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">Missing Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {analysis.keywords_missing.map((k, i) => (
            <span key={i} className="badge badge-outline">{k}</span>
          ))}
        </div>
      </div>

      <div className="card bg-base-200 p-6 mb-6">
        <p className="text-sm text-gray-500 mb-2">Email bhejna hai toh resume dobara select karo</p>
        <input
          className="file-input file-input-bordered w-full"
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button className="btn btn-primary w-full" onClick={handleSendEmail} disabled={loading}>
        {loading ? "Sending Email..." : "Send Email to HR"}
      </button>
    </div>
  );
};

export default Analysis;