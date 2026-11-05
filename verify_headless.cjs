const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:5173/';
const SCREENSHOT_DIR = path.resolve('screenshots');

async function run() {
  console.log('>>> Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=default'
    ]
  });

  const page = await browser.newPage();

  const consoleLogs = [];
  const networkLogs = [];

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleLogs.push({ type, text });
    console.log(`[BROWSER ${type.toUpperCase()}]:`, text);
  });

  page.on('pageerror', err => {
    consoleLogs.push({ type: 'pageerror', text: err.toString() });
    console.error('[BROWSER PAGE ERROR]:', err);
  });

  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    if (url.includes('kodmates_hero.glb') || url.includes('draco') || url.includes('HeroScene')) {
      networkLogs.push({ url, status });
      console.log(`[NETWORK]: ${status} ${url}`);
    }
  });

  // 1. Desktop 1920x1080
  console.log('\n--- Capturing Desktop 1920x1080 ---');
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait 3.5s for 3D model & shaders to load and render initial frames
  await new Promise(r => setTimeout(r, 3500));

  // Check canvas and fallback status
  const canvasStatus = await page.evaluate(() => {
    const wrapper = document.querySelector('#hero-3d-wrapper');
    const canvas = wrapper ? wrapper.querySelector('canvas') : null;
    const fallback = document.querySelector('#hero-fallback');
    const r3fFallback = document.querySelector('.animate-spin');

    return {
      wrapperFound: !!wrapper,
      canvasFound: !!canvas,
      canvasWidth: canvas ? canvas.width : 0,
      canvasHeight: canvas ? canvas.height : 0,
      fallbackVisible: fallback ? window.getComputedStyle(fallback).display !== 'none' : false,
      r3fFallbackPresent: !!r3fFallback
    };
  });

  console.log('Canvas Status Evaluation:', canvasStatus);

  const desktopPath = path.join(SCREENSHOT_DIR, 'hero_desktop_1920x1080.png');
  await page.screenshot({ path: desktopPath, fullPage: false });
  console.log(`✓ Saved desktop screenshot: ${desktopPath}`);

  // 2. Mobile 390x844
  console.log('\n--- Capturing Mobile 390x844 ---');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  const mobilePath = path.join(SCREENSHOT_DIR, 'hero_mobile_390x844.png');
  await page.screenshot({ path: mobilePath, fullPage: false });
  console.log(`✓ Saved mobile screenshot: ${mobilePath}`);

  await browser.close();

  // Save report
  const report = {
    canvasStatus,
    networkLogs,
    consoleLogs
  };
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'verification_report.json'), JSON.stringify(report, null, 2));
  console.log('\n✓ Headless verification run complete.');
}

run().catch(err => {
  console.error('Fatal error during headless run:', err);
  process.exit(1);
});

