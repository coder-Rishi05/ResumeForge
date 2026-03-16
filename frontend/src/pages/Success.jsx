import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { recipient } = state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold mb-4">Email Sent Successfully!</h1>
      <p className="text-gray-500 mb-8">Resume sent to <span className="font-semibold">{recipient}</span></p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Analyse Another Resume
      </button>
    </div>
  );
};

export default Success;