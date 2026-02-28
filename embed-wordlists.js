#!/usr/bin/env node
/**
 * Fetches BIP-39 English and Spanish, normalizes Spanish (accents), embeds in encryptor.html.
 * Run once to make encryptor work offline (file://). No server needed.
 */
const fs = require('fs');
const path = require('path');

const BIP39_ENG_URL = 'https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt';
const BIP39_ESP_URL = 'https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/spanish.txt';

function normalize(word) {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch ${url}: ${res.status}`);
  return res.text();
}

async function main() {
  console.log('Fetching wordlists...');
  const [engRaw, espRaw] = await Promise.all([
    fetchText(BIP39_ENG_URL),
    fetchText(BIP39_ESP_URL)
  ]);
  const eng = engRaw.trim().split('\n').map(w => w.trim().toLowerCase()).filter(Boolean);
  const esp = espRaw.trim().split('\n').map(w => normalize(w.trim())).filter(Boolean);
  if (eng.length !== 2048 || esp.length !== 2048) {
    console.warn(`ENG: ${eng.length}, ESP: ${esp.length} (expected 2048 each)`);
  }
  const htmlPath = path.join(__dirname, 'encryptor.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(
    /const BIP39_ENG = \[\];[\s\S]*?async function loadWordlists\(\)[\s\S]*?\}/,
    `const BIP39_ENG = ${JSON.stringify(eng)};
    const BIP39_ESP = ${JSON.stringify(esp)};`
  );
  html = html.replace(/\s+loadWordlists\(\)\.then\(\(\) => updateOutput\(\)\);/,
    ' updateOutput();');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Embedded wordlists into encryptor.html. Works offline (file://).');
}

main().catch(e => { console.error(e); process.exit(1); });
