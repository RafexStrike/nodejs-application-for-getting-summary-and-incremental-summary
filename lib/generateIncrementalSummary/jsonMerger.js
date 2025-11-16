// lib/generateIncrementalSummary/jsonMerger.js

import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

export async function jsoneMerger(arrayOfJsons) {
  console.log("===jsonMerger.js function HIT");

  try {
    console.log(
      "Trying to print the HF_TOKEN variable from the .env file. If it is not printed something has to be wrong withe the dotenv",
      process.env.HF_TOKEN
    );
  } catch (err) {
    console.log(
      "Sorry there has been an error in  lib/generateIncrementalSummary/jsonMerger.js. Tried to print the HF_TOKEN variable from the .env file. If it is not printed something has to be wrong withe the dotenv",
      process.env.HF_TOKEN
    );
  }

  console.log("creating a inference client");

  const hf = new InferenceClient(process.env.HF_TOKEN);

  const llmMessages = [
    {
      role: "system",
      content: `You are an intelligent JSON merger. 
Your goal is to take all the JSONs from the array and merge them.

Follow these rules strictly:

1. Identify the core ideas, main topics, and key details from the text.
2. Merge them into a clear single JSON structure.`,
    },
    {
      role: "user",
      content: arrayOfJsons,
    },
  ];

  console.log(
    "Starting the api call to huggingface from textToJsonConverter.js"
  );

  let output = "";

  const stream = hf.chatCompletionStream({
    model: "NousResearch/Hermes-3-Llama-3.1-8B",
    messages: llmMessages,
    max_tokens: 500,
    temperature: 0.7,
  });

  console.log("Stream created in textToJsonConverter.js, processing chunks...");

  for await (const chunk of stream) {
    if (chunk.choices?.length) {
      const content = chunk.choices[0].delta.content || "";
      output += content;
    }
  }

  console.log(
    "Stream completed in textToJsonConverter.js. Output length:",
    output.length
  );

  if (!output || output.trim().length === 0) {
    console.log("ERROR from textToJsonConverter.js: Empty output from model");
    throw new Error("Model returned empty response");
  }

  console.log("Sending response to client from textToJsonConverter.js");

  return output;
}
