//lib/generateIncrementalSummary/testFiles/callTHeTextTextToJsonConverter.js

// import { generateIncrementalSummary } from "../../generateIncrementalSummary.js";
import { generateIncrementalSummary } from "../../generateIncrementalSummary.js";

const mockReq = {
  body: {
    arrayOfParagraphs: [
      "Artificial intelligence is transforming the world by automating tasks and improving decision-making.",
      "Machine learning models are trained using large datasets to identify patterns and make predictions.",
      "Cloud computing enables scalable AI deployment without heavy infrastructure management.",
    ],
  },
};

const mockRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log("Response:", data);
    return data;
  },
};

await generateIncrementalSummary(mockReq, mockRes);

