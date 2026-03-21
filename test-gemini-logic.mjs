import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI("AIzaSyCzOhoUy8rxRGXniqb7etNHQiOPiYmn_mM");
const MODEL_CHAIN = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

async function runTest() {
  let finalError = null;
  let success = false;
  
  for (let modelIdx = 0; modelIdx < MODEL_CHAIN.length; modelIdx++) {
    const modelName = MODEL_CHAIN[modelIdx];
    
    const config = { model: modelName };
    if (modelName.includes("2.5")) {
      config.generationConfig = { temperature: 0.2, thinkingConfig: { thinkingBudget: 0 } };
    }
    const model = genAI.getGenerativeModel(config);
    
    try {
      const result = await model.generateContent("Say hello in JSON format like { \"greeting\": \"hello\" }");
      const text = result.response.text();
      fs.writeFileSync("gemini-test-result.txt", "SUCCESS with model " + modelName + "\\n" + text);
      success = true;
      break;
    } catch (error) {
       fs.appendFileSync("gemini-test-log.txt", "ERROR on " + modelName + " " + error.status + " " + error.message + "\\n");
       finalError = error;
    }
  }
  
  if (!success) {
    fs.writeFileSync("gemini-test-result.txt", "FAILED\\n" + (finalError ? finalError.message : "Unknown error"));
  }
}
runTest();
