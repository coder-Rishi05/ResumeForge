import React, { useState } from "react";
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

  const handleSubmit = async () => {
    if (!applicantName || !jobRole || !hrEmail || !resume) {
      setError("Sab fields fill karo");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await analyseResume(jobRole, resume);
      navigate("/analysis", {
        state: {
          analysis: res.analyses,
          jobRole,
          applicantName,
          hrEmail,
          resume,
        },
      });
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">ResumeForge</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Your Name"
          onChange={(e) => setApplicantName(e.target.value)}
        />
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Job Role"
          onChange={(e) => setJobRole(e.target.value)}
        />
        <input
          className="input input-bordered w-full"
          type="email"
          placeholder="HR Email"
          onChange={(e) => setHrEmail(e.target.value)}
        />
        <ResumeUpload onChange={(file) => setResume(file)} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          className="btn btn-primary w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Analysing..." : "Analyse Resume"}
        </button>
      </div>
    </div>
  );
};

export default Home;
