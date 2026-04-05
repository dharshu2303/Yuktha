const fs = require('fs');
async function test() {
  console.log('Testing pollinations API directly...');
  try {
    const prompt = 'High quality, professional business photography, A plumber at work';
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
    console.log('Fetching from:', pollinationsUrl);
    
    // We can also test the local server, but let's test pollinations directly first
    const res = await fetch(pollinationsUrl);
    console.log('Status: ', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    const buffer = await res.arrayBuffer();
    console.log('Image generated... size: ', buffer.byteLength);
  } catch(e) {
    console.log('Error:', e);
  }
}
test();
