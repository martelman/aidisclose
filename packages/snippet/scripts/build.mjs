/* Build: minify src to dist/aidisclose.js, extract dist/aidisclose.css,
 * print the real sizes, emit SRI (sha384) to dist/aidisclose.sri.txt. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';

/* No size budget; the build prints the real sizes. Whatever we ship, marketing
 * states the real gzip number, never a rounded-down fiction. */
const pkgDir = fileURLToPath(new URL('..', import.meta.url));
const src = readFileSync(pkgDir + 'src/aidisclose.js', 'utf8');
const version = src.match(/var VERSION = '([^']+)'/)[1];

/* VERSION drives the CDN path (/v<version>/) and the public repo tag — it must match
 * package.json, which is what tooling and the SRI-pinning guide reference. */
const pkgVersion = JSON.parse(readFileSync(pkgDir + 'package.json', 'utf8')).version;
if (version !== pkgVersion) {
  console.error(`FAIL: snippet VERSION ${version} !== package.json version ${pkgVersion}.`);
  process.exit(1);
}

const { code } = await transform(src, { minify: true, target: 'es2017', legalComments: 'none' });
const out = `/*! aidisclose.js v${version} | AI-content disclosure snippet (EU AI Act Art 50, California SB 942, and more) | MIT | © Pine Solutions Inc. | https://aidisclose.io */\n${code}`;

const raw = Buffer.byteLength(out);
const gz = gzipSync(Buffer.from(out)).length;

const cssCode = src.match(/css-start[\s\S]*?\*\/([\s\S]*?)\/\* ---- css-end/)[1];
const css = new Function(`${cssCode}; return CSS;`)();

mkdirSync(pkgDir + 'dist', { recursive: true });
writeFileSync(pkgDir + 'dist/aidisclose.js', out);
writeFileSync(pkgDir + 'dist/aidisclose.css', css + '\n');
const sri = 'sha384-' + createHash('sha384').update(out).digest('base64');
writeFileSync(pkgDir + 'dist/aidisclose.sri.txt', sri + '\n');

console.log(`aidisclose.js v${version}: ${raw} B raw minified (${gz} B gzip)`);
console.log(`SRI: ${sri}`);
