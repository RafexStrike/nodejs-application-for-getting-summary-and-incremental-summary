// server.js

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import { MongoClient } from "mongodb";
// import multer from "multer";
// import os from "os";
// import { processVideoFile } from "./lib/processVideo.js";

const app = express();
const uri = process.env.MONGODB_URI;
console.log(uri);
const client = new MongoClient(uri);
console.log(process.env.HF_TOKEN);

// Hard coded CORS starts...
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ph-team-code-spirit-quick-clip.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Hard coded CORS ends...


// routes:
app.post("/api/generateNormalSummary")

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log("Server is running in the PORT number:", PORT);
});
