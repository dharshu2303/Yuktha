const fs = require('fs');

async function test() {
  console.log('Testing /api/generate on http://localhost:3000...');
  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardImageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAGVJREFUKFNjZCASMDKgAgz//v1/gWIZGRlPMDKgAwwMDH+hSrgYGRn++f//P1wFpP//v//HIf//f6QKPv//j1RB7N//fw4YGRj+/f///1+4E1++fPkfGQoMDCAiYGFhYYZVQxSDBQCPmC6wO5x+5QAAAABJRU5ErkJggg==',
        voiceText: 'Plumber looking to expand business in London',
        language: 'en'
      })
    });
    
    console.log('HTTP Status:', res.status);
    
    if (!res.ok) {
        const text = await res.text();
        console.log('Error text:', text);
        return;
    }
    
    const data = await res.json();
    console.log('Success Payload Keys:', Object.keys(data).join(', '));
    if (data.previewData) {
        console.log('Generated Name:', data.previewData.name);
        console.log('Generated Business:', data.previewData.business);
        console.log('Generated Tagline:', data.previewData.tagline);
        console.log('Generated Services:', data.previewData.services);
    }
  } catch(e) {
    console.log('Fetch Error:', e.message);
  }
}

test();
