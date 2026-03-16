import React, { useState } from "react";
import { analyseResume } from "../lib/api";

const Analysis = () => {
  const [jobRole, setJobRole] = useState("");
  const [resume, setResume] = useState(null);

  const handleAnalysis = async () => {
    try {
      const res = await analyseResume(jobRole, resume);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input
        onChange={(e) => setJobRole(e.target.value)}
        type="text "
        placeholder="Enter jobRole"
      />
      <input
        onChange={(e) => setResume(e.target.files[0])}
        type="file"
        placeholder="Enter you resume"
      />
      <input type="submit" onClick={() => handleAnalysis()} />
    </div>
  );
};

export default Analysis;
