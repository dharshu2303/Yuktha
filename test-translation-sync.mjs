import { buildModernTemplate } from './src/lib/templateEngine.js';

const mockData = {
  name: "Test Business",
  business: "Test Category",
  designation: "Owner",
  services: ["Service 1", "Service 2"],
  tagline: "Test Tagline",
  about: "About test business",
  faqs: [{ question: "Q1", answer: "A1" }],
  testimonials: [{ name: "User", text: "Good" }],
  theme: { primaryColor: "#000000" },
  images: ["image1"]
};

const languages = ["Tamil", "Hindi", "Telugu", "Malayalam", "Kannada", "Bengali", "English"];

languages.forEach(lang => {
  const html = buildModernTemplate(mockData, true, lang);
  const langMatch = html.match(/<html lang="([^"]+)"/);
  console.log(`Language: ${lang}, HTML Lang Code: ${langMatch ? langMatch[1] : 'NOT FOUND'}`);
  
  // Check for some translated strings
  if (lang === "Tamil") {
    if (html.includes("என் வணிகம்")) console.log("  [PASS] Tamil translation found");
    else console.log("  [FAIL] Tamil translation MISSING");
  }
  if (lang === "Hindi") {
    if (html.includes("मेरा व्यवसाय")) console.log("  [PASS] Hindi translation found");
    else console.log("  [FAIL] Hindi translation MISSING");
  }
});
