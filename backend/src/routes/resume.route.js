import express from "express"
import { resumeAnalyse } from "../controller/resume.controller.js";


const resumeRouter = express.Router();

resumeRouter.post("/analyse",resumeAnalyse)

export default resumeRouter;