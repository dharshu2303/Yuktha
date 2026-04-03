const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a desktop size
  await page.setViewport({ width: 1280, height: 800 });

  // Navigate to the test page or API
  const response = await page.goto('http://localhost:3000/api/image?prompt=developer', {
    waitUntil: 'networkidle0',
  });

  console.log('Status code:', response.status());
  console.log('Content-Type:', response.headers()['content-type']);

  // Take screenshot
  await page.screenshot({ path: 'test_image_screenshot.png' });

  await browser.close();
  console.log('Successfully captured screenshot to test_image_screenshot.png');
})();
