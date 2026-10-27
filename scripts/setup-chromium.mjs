#!/usr/bin/env node
/**
 * The sandbox has no system Chrome and cannot reach remotion.media. Remotion's
 * own compositor package also ships a headless Chromium build via npm, but
 * @sparticuz/chromium is the only npm-hosted browser we can fetch here. This
 * script unpacks it into the git-ignored .cache folder and builds a wrapper
 * that supplies its bundled NSS libraries. remotion.config.ts points the CLI
 * at that wrapper when it exists.
 */
import {execFileSync} from 'node:child_process';
import {chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'node_modules/@sparticuz/chromium/bin');
const target = path.join(root, '.cache/chromium');
const browser = path.join(target, 'chromium');
const wrapper = path.join(target, 'chrome-wrapper.sh');

mkdirSync(path.join(target, 'libs'), {recursive: true});
mkdirSync(path.join(target, 'fonts'), {recursive: true});

if (!existsSync(browser)) {
  for (const name of ['chromium', 'al2023.tar', 'swiftshader.tar', 'fonts.tar']) {
    const compressed = readFileSync(path.join(source, `${name}.br`));
    writeFileSync(path.join(target, name), zlib.brotliDecompressSync(compressed));
  }
  execFileSync('tar', ['-xf', path.join(target, 'swiftshader.tar'), '-C', target]);
  execFileSync('tar', ['-xf', path.join(target, 'al2023.tar'), '-C', path.join(target, 'libs')]);
  execFileSync('tar', ['-xf', path.join(target, 'fonts.tar'), '-C', path.join(target, 'fonts')]);
  chmodSync(browser, 0o755);
}

writeFileSync(
  wrapper,
  `#!/bin/sh\nexport LD_LIBRARY_PATH="${target}/libs/lib:${target}\${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"\nexec "${browser}" "$@"\n`,
);
chmodSync(wrapper, 0o755);
console.log(`Chromium ready at ${path.relative(root, wrapper)}`);
