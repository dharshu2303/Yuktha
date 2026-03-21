const { spawn } = require('child_process');
const fs = require('fs');
const logFile = 'test-result.log';

function log(msg) {
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n');
}

fs.writeFileSync(logFile, 'Starting test...\n');
log('Starting Next.js dev server...');

const devServer = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'pipe'
});

let testRun = false;

devServer.stdout.on('data', (data) => {
  const output = data.toString();
  if (!testRun && (output.includes('Ready in') || output.includes('started server on') || output.includes('ready') || output.toLowerCase().includes('local:'))) {
    log('Dev server seems ready. Running test payload...');
    runTest();
  }
});

async function runTest() {
  if (testRun) return;
  testRun = true;
  
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
    
    log('HTTP Status: ' + res.status);
    
    if (!res.ok) {
        const text = await res.text();
        log('Error text: ' + text);
    } else {
        const data = await res.json();
        log('Success Payload Keys: ' + Object.keys(data).join(', '));
        if (data.previewData) {
            log('Generated Name: ' + data.previewData.name);
            log('Generated Business: ' + data.previewData.business);
            log('Generated Tagline: ' + data.previewData.tagline);
            log('Generated Services: ' + data.previewData.services.join(', '));
            log('End-to-End Test PASSED!');
        }
    }
  } catch(e) {
    log('Fetch Error: ' + e.message);
  } finally {
    log('Test complete. Shutting down dev server...');
    devServer.kill();
    process.exit(0);
  }
}

process.on('SIGINT', () => {
    devServer.kill();
    process.exit();
});

setTimeout(() => {
  log('Timeout waiting for server or response (45s)');
  devServer.kill();
  process.exit(1);
}, 45000);
