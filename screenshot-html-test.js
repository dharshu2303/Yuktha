const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a desktop size
  await page.setViewport({ width: 1280, height: 800 });

  // Navigate to an actual generated site preview URL (or local dev base)
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <h1>Testing Image</h1>
        <img src="http://localhost:3000/api/image?prompt=business&t=123" width="800" height="600" />
      </body>
    </html>
  `, { waitUntil: 'networkidle0' });

  // Take screenshot
  await page.screenshot({ path: 'test_html_screenshot.png', fullPage: true });

  await browser.close();
  console.log('Successfully captured HTML render to test_html_screenshot.png');
})();
