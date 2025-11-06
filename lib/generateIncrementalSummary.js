// lib/generateIncrementalSumamry.js

import { InferenceClient } from "@huggingface/inference";
import { textToJson } from "./generateIncrementalSummary/textToJsonConverter";

export async function generateIncrementalSummary(req, res) {
  console.log("==generateIncrementalSummary.js Enpoint Hit==");

  try {
    const { prompt } = req.body;
    console.log("1. Received prompt:", prompt?.substring(0, 100));

    if (!prompt) {
      console.log("2. ERROR: No prompt provided");
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      console.log("calling the textToJsonConverter.js function...");
      const convertedJson = await textToJson(prompt);
      console.log("Got the converted text:", convertedJson);
    } catch (err) {
      console.log("Error converting text to JSON:", err);
      return res.status(500).json({ error: "Failed to convert text" });
    }
  } catch (err) {
    console.log(
      "Error happened in generateINcrementalSummary.js. The error is:",
      err
    );
  }
}
