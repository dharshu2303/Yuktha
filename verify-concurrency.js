const fetch = require('node-fetch');

// Mocking the route.js logic
async function getImage(prompt, seed) {
    const cleanPrompt = prompt.replace(/[^\w\s\-,]/g, '').trim(); 
    const enhancedPrompt = encodeURIComponent(`Professional high-quality business photography of ${cleanPrompt}`);
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // THE JITTER: Stagger the start
    const jitter = Math.floor(Math.random() * 2500);
    console.log(`[${cleanPrompt}] Jittering for ${jitter}ms...`);
    await wait(jitter);

    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const model = i === 0 ? 'turbo' : 'flux';
            const pollinationsUrl = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=512&height=512&nologo=true&seed=${seed}&model=${model}`;
            
            console.log(`[${cleanPrompt}] Attempt ${i+1}/${maxRetries} (Model: ${model})...`);
            const response = await fetch(pollinationsUrl);

            if (response.status === 429) {
                const backoff = 2000 + (i * 3000);
                console.warn(`[${cleanPrompt}] GOT 429. Backing off for ${backoff}ms...`);
                await wait(backoff);
                continue;
            }

            if (!response.ok) throw new Error(`API ${response.status}`);
            
            console.log(`[${cleanPrompt}] SUCCESS! Received image.`);
            return true;
        } catch (e) {
            console.log(`[${cleanPrompt}] Error: ${e.message}`);
            await wait(1000);
        }
    }
    console.log(`[${cleanPrompt}] FAILED all retries.`);
    return false;
}

async function runTest() {
    console.log('--- STARTING CONCURRENT REQUEST TEST ---');
    // Launch 3 requests at the exact same time
    const results = await Promise.all([
        getImage('Textile Factory', 1),
        getImage('Fabric Machine', 2),
        getImage('Dyeing Process', 3)
    ]);
    
    const successCount = results.filter(r => r).length;
    console.log(`--- TEST COMPLETE: ${successCount}/3 images loaded ---`);
}

runTest();
