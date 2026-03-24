import { buildModernTemplate } from './src/lib/templateEngine.js';

const html = buildModernTemplate({
  name: "Yukdha",
  business: "Acme Corp",
  designation: "CEO",
  phone: "+123456789",
  email: "yukdha@acme.com",
  address: "123 Main St",
  services: ["Web Design", "SEO"],
  tagline: "We build the web"
}, true, "English");

console.log("Template generated successfully, length:", html.length);
