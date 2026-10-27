#!/usr/bin/env node
/**
 * Turns the raw TTS takes in public/audio/voice-*.wav into the compact,
 * slightly tightened MP3s that ship with the project. The raw WAV takes are
 * generated outside of this repo (see README) and are git-ignored; the MP3s
 * produced here are committed so the video renders without extra steps.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ffmpeg =
  process.env.FFMPEG ??
  path.join(root, 'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg');
const binary = existsSync(ffmpeg) ? ffmpeg : 'ffmpeg';
const outDir = path.join(root, 'public/audio/final');
mkdirSync(outDir, {recursive: true});

// The voice was recorded at a natural pace; 1.10 keeps it conversational
// while fitting nine chapters plus title/outro holds into exactly 120 seconds.
const TEMPO = 1.1;
const LEADING_SILENCE = 0.06;

for (let i = 1; i <= 9; i += 1) {
  const id = String(i).padStart(2, '0');
  const input = path.join(root, `public/audio/voice-${id}.wav`);
  const output = path.join(outDir, `voice-${id}.mp3`);
  if (!existsSync(input)) {
    console.log(`skip voice-${id}.wav (not present)`);
    continue;
  }
  execFileSync(
    binary,
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-ss',
      String(LEADING_SILENCE),
      '-i',
      input,
      '-af',
      `atempo=${TEMPO}`,
      '-ar',
      '44100',
      '-ac',
      '1',
      '-codec:a',
      'libmp3lame',
      '-b:a',
      '160k',
      output,
    ],
    {stdio: 'inherit'},
  );
  console.log(`wrote ${path.relative(root, output)}`);
}
