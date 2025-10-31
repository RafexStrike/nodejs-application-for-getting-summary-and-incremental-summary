import { InferenceClient } from "@huggingface/inference";

export async function generateNormalSummary(req, res) {
  console.log("=== ENDPOINT HIT ===");

  try {
    const { prompt } = req.body;
    console.log("1. Received prompt:", prompt?.substring(0, 100));

    if (!prompt) {
      console.log("2. ERROR: No prompt provided");
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("3. Checking HF_TOKEN...");
    if (!process.env.HF_TOKEN) {
      console.log("4. ERROR: HF_TOKEN not found!");
      return res.status(500).json({ error: "HF_TOKEN not configured" });
    }
    console.log(
      "4. HF_TOKEN exists:",
      process.env.HF_TOKEN.substring(0, 10) + "..."
    );

    console.log("5. Creating InferenceClient...");
    const hf = new InferenceClient(process.env.HF_TOKEN);
    console.log("6. InferenceClient created successfully");

    const llmMessages = [
      {
        role: "system",
        content: `Provide a concise summary emphasizing technical details: list the main result, important metrics or parameters, and any assumptions. Keep it to 4 short sentences.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    console.log("7. Starting API call to HuggingFace...");

    let output = "";

    const stream = hf.chatCompletionStream({
      model: "NousResearch/Hermes-3-Llama-3.1-8B",
      messages: llmMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log("8. Stream created, processing chunks...");

    for await (const chunk of stream) {
      if (chunk.choices?.length) {
        const content = chunk.choices[0].delta.content || "";
        output += content;
      }
    }

    console.log("9. Stream completed. Output length:", output.length);

    if (!output || output.trim().length === 0) {
      console.log("10. ERROR: Empty output from model");
      throw new Error("Model returned empty response");
    }

    console.log("11. Sending response to client");
    res.json({ reply: output.trim() });
  } catch (err) {
    console.error("❌ ERROR in generateNormalSummary:");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Error details:", JSON.stringify(err, null, 2));

    res.status(500).json({
      error: err.message || "Internal server error",
      type: err.constructor.name,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
}
