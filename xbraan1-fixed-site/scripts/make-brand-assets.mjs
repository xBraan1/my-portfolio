// One-off generator for public/og-image.png, apple-touch-icon.png and the manifest icons.
// Needs puppeteer-core (npm i --no-save puppeteer-core) and a Chromium: CHROME_PATH=/path/to/chrome node scripts/make-brand-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const root = path.resolve(import.meta.dirname, '..');
const font = (pkg, file) => fs.readFileSync(path.join(root, 'node_modules', pkg, 'files', file)).toString('base64');
const playfair = font('@fontsource-variable/playfair-display', 'playfair-display-latin-wght-normal.woff2');
const inter = font('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2');

const icon = (size, pad = 0.2) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><rect width="32" height="32" fill="#171717"/><g transform="translate(${32 * pad / 2},${32 * pad / 2}) scale(${1 - pad})"><g transform="translate(6,6)" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="16" r="3"/><circle cx="14" cy="16" r="3"/><line x1="8.5" y1="14" x2="16" y2="4"/><line x1="11.5" y1="14" x2="4" y2="4"/></g></g></svg>`;

const og = `<html><head><style>
@font-face{font-family:P;src:url(data:font/woff2;base64,${playfair});font-weight:400 900}
@font-face{font-family:I;src:url(data:font/woff2;base64,${inter});font-weight:100 900}
body{margin:0;width:1200px;height:630px;background:linear-gradient(135deg,#171717,#262626 60%,#171717);color:#fff;display:flex;flex-direction:column;justify-content:center;padding:0 96px;box-sizing:border-box}
.mark{width:96px;height:96px;margin-bottom:40px;border-radius:12px;overflow:hidden}
h1{font:600 120px/1.05 P,serif;margin:0 0 20px;font-variant-numeric:lining-nums;font-feature-settings:"lnum" 1}
p{font:400 38px/1.3 I,sans-serif;color:#d4d4d4;margin:0;letter-spacing:.02em}
</style></head><body><div class="mark">${icon(96, 0)}</div><h1>xBraan1</h1><p>Premium Salon &amp; Barbershop</p></body></html>`;

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'], headless: 'shell' });
const page = await browser.newPage();
const shot = async (html, w, h, out) => {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, 'public', out), type: 'png', clip: { x: 0, y: 0, width: w, height: h } });
};
const bare = (svg) => `<html><body style="margin:0">${svg}</body></html>`;
await shot(og, 1200, 630, 'og-image.png');
await shot(bare(icon(180, 0.12)), 180, 180, 'apple-touch-icon.png');
await shot(bare(icon(192, 0.12)), 192, 192, 'icon-192.png');
await shot(bare(icon(512, 0.12)), 512, 512, 'icon-512.png');
await shot(bare(icon(512, 0.34)), 512, 512, 'icon-maskable-512.png');
await browser.close();
console.log('brand assets written');
