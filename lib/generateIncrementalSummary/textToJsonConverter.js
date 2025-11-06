// lib/generateIncrementalSumamry/textToJsonConverter.js

import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

export async function textToJson(text) {
  console.log("=== textToJsonConverter.js function HIT ===");

  console.log("creating a inference client");

  const hf = new InferenceClient(process.env.HF_TOKEN);

  const llmMessages = [
    {
      role: "system",
      content: `You are an intelligent text-to-JSON converter. 
Your goal is to read a given text and extract only its most important information, ignoring filler or redundant parts.

Your output must always be a valid, well-formatted JSON object. 
Do not include explanations, reasoning steps, or any text outside the JSON.

Follow these rules strictly:

1. Identify the core ideas, main topics, and key details from the text.
2. Organize them in a clear JSON structure.`,
    },
    {
      role: "user",
      content: text,
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
