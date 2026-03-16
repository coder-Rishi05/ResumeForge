import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmailPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { emailData, recipient } = state || {};

  if (!emailData) {
    return <div className="p-8">No email data found. Please go back.</div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Email Preview</h1>

      <div className="card bg-base-200 p-6 mb-4">
        <p className="text-sm text-gray-500 mb-1">Sent to</p>
        <p className="font-semibold">{recipient}</p>
      </div>

      <div className="card bg-base-200 p-6 mb-4">
        <p className="text-sm text-gray-500 mb-1">Subject</p>
        <p className="font-semibold">{emailData.meta?.subject}</p>
      </div>

      <div className="card bg-base-200 p-6 mb-6">
        <p className="text-sm text-gray-500 mb-2">Email Body</p>
        <pre className="whitespace-pre-wrap text-sm">{emailData.meta?.subject}</pre>
      </div>

      <button className="btn btn-primary w-full" onClick={() => navigate("/success", { state: { recipient } })}>
        Continue
      </button>
    </div>
  );
};

export default EmailPreview;