import "dotenv/config";
import express from "express";
import { port } from "./src/utils/env.js";
import cors from "cors"
const app = express();
app.use(cors());  

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});


app.listen(port, () => {
  console.log("server running at : ", port);
});

