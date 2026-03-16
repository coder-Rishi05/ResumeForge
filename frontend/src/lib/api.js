import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const sendResumeToEmail = async (to, jobRole, applicantName, resume) => {
  const res = await api.post(`api/email/send`, {
    to,
    jobRole,
    applicantName,
    resume,
  });
  return res.data;
};

export const analyseResume = async (jobRole, resume) => {
  const formData = new FormData();
  formData.append("jobRole", jobRole);
  formData.append("resume", resume); // resume = File object hona chahiye

  const res = await api.post("/api/resume/analyse", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
