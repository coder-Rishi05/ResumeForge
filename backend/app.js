import "dotenv/config";
import express from "express";
import { PORT } from "./src/utils/env.js";
import cors from "cors";
import emailRoute from "./src/routes/email.route.js";
import resumeRouter from "./src/routes/resume.route.js";
const app = express();
app.use(
  cors({
    origin: "https://resumeforge-1-c1t9.onrender.com",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/email", emailRoute);
app.use("/api/resume", resumeRouter);

app.listen(PORT, () => {
  console.log("server running at : ", PORT);
});
