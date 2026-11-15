// Generates the glyph table used by the chapter logo generator on the brand page.
// Templates in city-logo-template/ are the official chapter logo variants without the city path.
// Run: node scripts/city-logo-glyphs.mjs
import { readFile, writeFile } from 'node:fs/promises';
import opentype from 'opentype.js';

const font = opentype.parse((await readFile(new URL('./fonts/SpaceGrotesk-Regular.ttf', import.meta.url))).buffer);
const round = (n) => Math.round(n * 10) / 10;
const glyphs = {};
const chars = [];
for (let code = 0x20; code <= 0x24f; code++) {
  if (code >= 0x7f && code < 0xa0) continue;
  const char = String.fromCodePoint(code);
  const glyph = font.charToGlyph(char);
  if (!glyph || glyph.index === 0) continue;
  const d = glyph.getPath(0, 0, font.unitsPerEm).commands.map((c) => {
    if (c.type === 'Z') return 'Z';
    const pts = c.type === 'Q' ? [c.x1, c.y1, c.x, c.y] : c.type === 'C' ? [c.x1, c.y1, c.x2, c.y2, c.x, c.y] : [c.x, c.y];
    return c.type + pts.map(round).join(' ');
  }).join('');
  glyphs[char] = [glyph.advanceWidth, d];
  chars.push([char, glyph]);
}
const kerning = {};
for (const [a, ga] of chars) for (const [b, gb] of chars) {
  const k = font.getKerningValue(ga, gb);
  if (k) kerning[a + b] = k;
}
const variants = {};
for (const name of ['color', 'reversed', 'mono-ink', 'mono-white']) {
  variants[name] = (await readFile(new URL(`./city-logo-template/${name}.svg`, import.meta.url), 'utf8')).trim();
}
const out = new URL('../public/logos/gaic/city-logo-glyphs.json', import.meta.url);
await writeFile(out, JSON.stringify({ unitsPerEm: font.unitsPerEm, variants, glyphs, kerning }));
console.log(`Wrote ${Object.keys(glyphs).length} glyphs and ${Object.keys(kerning).length} kerning pairs.`);
