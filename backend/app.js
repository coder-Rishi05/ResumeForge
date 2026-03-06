import "dotenv/config";
import express from "express";
import { port } from "./src/utils/env.js";
import cors from "cors";
import emailRoute from "./src/routes/email.route.js";
import resumeRouter from "./src/routes/resume.route.js";
const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/email", emailRoute);
app.use("/api/resume", resumeRouter);


app.listen(port, () => {
  console.log("server running at : ", port);
});
