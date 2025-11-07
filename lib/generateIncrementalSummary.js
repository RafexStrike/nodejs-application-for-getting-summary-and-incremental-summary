// lib/generateIncrementalSumamry.js

import { InferenceClient } from "@huggingface/inference";
import { textToJson } from "./generateIncrementalSummary/textToJsonConverter.js";

export async function generateIncrementalSummary(req, res) {
  console.log("==generateIncrementalSummary.js Enpoint Hit==");

  try {
    // note/reminder: arrayOfParagraphs has to be an array
    const { arrayOfParagraphs } = req.body;
    const jsonConvertedParagraphs = [];
    console.log("1. Received arrayOfParagraphs:", arrayOfParagraphs);

    if (!arrayOfParagraphs) {
      console.log("2. ERROR: No arrayOfParagraphs provided");
      return res.status(400).json({ error: "arrayOfParagraphs is required" });
    }

    try {
      console.log(
        "calling the textToJsonConverter.js function for every element in the array..."
      );

      for (let i = 0; i < arrayOfParagraphs.length; i++) {
        const convertedJson = await textToJson(arrayOfParagraphs[i]);
        jsonConvertedParagraphs.push(convertedJson);
        console.log(
          `The ${i}th paragraph's converted json is: ${convertedJson}`
        );
      }
      // const convertedJson = await textToJson(arrayOfParagraphs);
      // console.log("Got the converted text:", convertedJson);
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
