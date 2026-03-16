import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const analyseResume = async (jobRole, resume) => {
  const formData = new FormData();
  formData.append("jobRole", jobRole);
  formData.append("resume", resume);

  const res = await api.post("/api/resume/analyse", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const sendResumeToEmail = async (to, jobRole, applicantName, resume) => {
  const formData = new FormData();
  formData.append("to", to);
  formData.append("jobRole", jobRole);
  formData.append("applicantName", applicantName);
  formData.append("resume", resume);

  const res = await api.post("/api/email/send", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};