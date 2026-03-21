const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const API_KEY = "AIzaSyCzOhoUy8rxRGXniqb7etNHQiOPiYmn_mM";
const OUT = "test-result.txt";

fs.writeFileSync(OUT, "Test started at " + new Date().toISOString() + "\n");

const genAI = new GoogleGenerativeAI(API_KEY);

const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro"];

(async () => {
  for (const m of models) {
    fs.appendFileSync(OUT, `\nTesting: ${m}\n`);
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const r = await model.generateContent("Say hello");
      const t = r.response.text();
      fs.appendFileSync(OUT, `SUCCESS: ${t.trim()}\n`);
      fs.appendFileSync(OUT, "\nAPI KEY IS WORKING!\n");
      process.exit(0);
    } catch (e) {
      fs.appendFileSync(OUT, `FAILED: status=${e.status} msg=${(e.message||"").substring(0,400)}\n`);
    }
  }
  fs.appendFileSync(OUT, "\nALL MODELS FAILED\n");
  process.exit(1);
})();
