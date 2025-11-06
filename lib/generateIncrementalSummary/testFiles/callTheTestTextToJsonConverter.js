//lib/generateIncrementalSummary/testFiles/callTHeTextTextToJsonConverter.js

import { textToJson } from "./testTextToJsonConverter.js";

console.log("=== testTextToJsonConverter.js START ===");

async function runTest() {
  try {
    const result = await textToJson(); // <-- call the async function
    console.log("=== MODEL OUTPUT ===");
    console.log(result);
  } catch (err) {
    console.error("Error in test:", err);
  }
}

runTest();
