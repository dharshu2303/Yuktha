const fetch = require('node-fetch');

async function test() {
  const prompt = 'Modern Software Office';
  const cleanPrompt = prompt.replace(/[^\w\s\-,]/g, '').trim(); 
  const enhancedPrompt = encodeURIComponent(`Professional high-quality business photography of ${cleanPrompt}`);
  const seed = 123;
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;

  console.log('Testing URL:', pollinationsUrl);
  
  try {
    const res = await fetch(pollinationsUrl);
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    if (res.ok) {
        console.log('SUCCESS: Pollinations is working.');
    } else {
        console.log('FAILED: Falling back to loremflickr.');
    }
  } catch (e) {
    console.log('ERROR:', e.message);
    console.log('FALLBACK: Testing loremflickr...');
    const fallback = `https://loremflickr.com/1024/1024/${encodeURIComponent(cleanPrompt)}`;
    const res2 = await fetch(fallback);
    console.log('Fallback Status:', res2.status);
  }
}

test();
