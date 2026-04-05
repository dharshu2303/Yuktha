const fetch = require('node-fetch');

async function checkModel(model) {
  try {
    const start = Date.now();
    const res = await fetch(`https://image.pollinations.ai/prompt/professional%20office?model=${model}&seed=${Math.floor(Math.random() * 1000)}&width=256&height=256`);
    const duration = Date.now() - start;
    console.log(`Model: ${model} | Status: ${res.status} | Time: ${duration}ms`);
    return res.status;
  } catch (e) {
    console.log(`Model: ${model} | Error: ${e.message}`);
    return 500;
  }
}

async function run() {
  await checkModel('flux');
  await checkModel('turbo');
  await checkModel('sana');
}

run();
