import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

async function minifyCSS() {
  const src = join(ROOT, 'style.css');
  const out = join(ROOT, 'assets', 'css', 'style.min.css');
  if (!existsSync(src)) return;

  let css = readFileSync(src, 'utf-8');
  // Basic minification: strip comments, collapse whitespace
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  css = css.replace(/\s*([{}:;,])\s*/g, '$1');
  css = css.replace(/\s+/g, ' ');
  css = css.replace(/;}/g, '}');
  css = css.trim();

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, css, 'utf-8');
  console.log(`  ✓ Minified CSS → assets/css/style.min.css (${css.length} bytes)`);
}

async function minifyJS() {
  const src = join(ROOT, 'script.js');
  const out = join(ROOT, 'assets', 'js', 'script.min.js');
  if (!existsSync(src)) return;

  const result = await esbuild.build({
    entryPoints: [src],
    bundle: false,
    minify: true,
    write: false,
    target: 'es2015',
    legalComments: 'none'
  });

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, result.outputFiles[0].text, 'utf-8');
  console.log(`  ✓ Minified JS → assets/js/script.min.js (${result.outputFiles[0].text.length} bytes)`);
}

console.log('Minifying assets...');
await minifyCSS();
await minifyJS();
console.log('Done.');
