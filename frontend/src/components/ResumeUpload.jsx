import React from "react";

const ResumeUpload = ({ onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Upload Resume (PDF only)</label>
      <input
        className="file-input file-input-bordered w-full"
        type="file"
        accept=".pdf"
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
};

export default ResumeUpload;