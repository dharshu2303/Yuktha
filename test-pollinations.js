const https = require('https');

https.get('https://image.pollinations.ai/prompt/cat?width=800&height=600&nologo=true&seed=123', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(e);
});
