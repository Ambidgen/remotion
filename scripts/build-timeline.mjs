#!/usr/bin/env node
/**
 * Measures the narration MP3s and writes src/timeline.json. Scene durations are
 * frame-accurate: every voice clip starts exactly on its scene's lead frame,
 * and the final scene is padded so the composition is precisely 120 seconds.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localFfprobe = path.join(
  root,
  'node_modules/@remotion/compositor-linux-x64-gnu/ffprobe',
);
const ffprobe = process.env.FFPROBE ?? (existsSync(localFfprobe) ? localFfprobe : 'ffprobe');

const FPS = 30;
const DURATION_IN_FRAMES = 120 * FPS;
const INTRO_HOLD = 60; // 2s title card before the first spoken line
const TRANSITION_HOLD = 3; // 0.1s breath between chapters

const metadata = [
  {
    year: '2021',
    kicker: 'THE STARTING POINT',
    headline: 'It began as autocomplete.',
    subtext: 'Capable, but brittle. Mostly a research curiosity.',
    accent: 'cyan',
    chapter: 'Origins',
    variant: 'title',
    caption:
      'Five years ago, AI was mostly a collection of specialists. Language models could finish your sentence, but they were unreliable, hard to steer, and mostly lived in research labs.',
  },
  {
    year: '2021',
    kicker: 'THE ENGINE',
    headline: 'One simple loop, taken to extremes.',
    subtext: 'Predict the next token. Repeat. Scale everything.',
    accent: 'violet',
    chapter: 'Scale',
    variant: 'split',
    caption:
      'The engine was a simple idea scaled to extremes: a transformer trained to predict the next token across mountains of text and code. More data, more parameters, more compute. And unexpectedly, general abilities began to emerge.',
  },
  {
    year: '2022',
    kicker: 'THE BREAKTHROUGH',
    headline: 'AI learned to talk. And to draw.',
    subtext: 'Instruction tuning, human feedback, and diffusion.',
    accent: 'mint',
    chapter: 'Mainstream',
    variant: 'split',
    caption:
      'Then in twenty twenty two, instruction tuning and human feedback made these models conversational. ChatGPT put a capable assistant in everyone’s browser, while diffusion models turned a sentence into a picture. AI became visible.',
  },
  {
    year: '2023',
    kicker: 'THE EXPANSION',
    headline: 'The model grew senses and hands.',
    subtext: 'Multimodal input, open weights, retrieval and tools.',
    accent: 'amber',
    chapter: 'Multimodal',
    variant: 'split',
    caption:
      'Twenty twenty three broke the text barrier. GPT Four could reason over images. Open weight models like Llama let anyone experiment. Retrieval and tool use connected language models to search engines, code, and private knowledge.',
  },
  {
    year: '2024',
    kicker: 'THE SECOND AXIS',
    headline: 'Thinking time became a scaling law.',
    subtext: 'Reasoning, million-token context, real-time voice, video.',
    accent: 'coral',
    chapter: 'Reasoning',
    variant: 'split',
    caption:
      'In twenty twenty four, models learned to spend time thinking. Reasoning systems worked through problems step by step before answering. Context windows jumped from thousands of tokens to millions, and real time voice and generated video made AI feel immediate.',
  },
  {
    year: '2025',
    kicker: 'THE SHIFT',
    headline: 'From answering to doing.',
    subtext: 'Agents, tool use and long-running work — plus new risks.',
    accent: 'violet',
    chapter: 'Agents',
    variant: 'split',
    caption:
      'By twenty twenty five, chat became action. Agents planned, browsed, wrote and ran code, and used software to finish multi step tasks. The questions got harder too: reliability, evaluation, security, and cost.',
  },
  {
    year: '2021—26',
    kicker: 'THE PATTERN',
    headline: 'Five layers, compounding.',
    subtext: 'Each breakthrough made the next one more valuable.',
    accent: 'lime',
    chapter: 'Compounding',
    variant: 'full',
    caption:
      'Notice the pattern. Scale built the foundation. Alignment made it usable. Multimodality gave it senses. Reasoning gave it patience. Tools gave it hands. Each layer made the next one far more valuable.',
  },
  {
    year: '2026',
    kicker: 'WHERE WE ARE',
    headline: 'A collaborator, not a crystal ball.',
    subtext: 'Enormously useful — and still in need of human judgment.',
    accent: 'cyan',
    chapter: 'Today',
    variant: 'split',
    caption:
      'Today, in twenty twenty six, AI is a general purpose collaborator, not just a chatbot. It still hallucinates and still needs human judgment. But in five years it went from finishing sentences to helping finish real work.',
  },
  {
    year: 'NEXT',
    kicker: 'THE QUESTION',
    headline: 'The next five years are a choice.',
    subtext: 'Not just bigger models — better judgment about them.',
    accent: 'mint',
    chapter: 'What next',
    variant: 'outro',
    caption:
      'What comes next is not only about bigger models. It is about trust, verification, and the choices we make about where these systems belong.',
  },
];

const durationOf = (file) => {
  const output = execFileSync(
    ffprobe,
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      file,
    ],
    {encoding: 'utf8'},
  );
  return Number.parseFloat(output.trim());
};

const scenes = [];
let from = 0;
metadata.forEach((meta, index) => {
  const id = index + 1;
  const audioSrc = `audio/final/voice-${String(id).padStart(2, '0')}.mp3`;
  const audioSeconds = durationOf(path.join(root, 'public', audioSrc));
  const audioFrames = Math.ceil(audioSeconds * FPS);
  const leadFrames = index === 0 ? INTRO_HOLD : 0;
  const transition = index < metadata.length - 1 ? TRANSITION_HOLD : 0;
  const duration = leadFrames + audioFrames + transition;
  scenes.push({
    id,
    from,
    duration,
    leadFrames,
    audioFrames,
    audioSeconds: Number(audioSeconds.toFixed(3)),
    audioSrc,
    ...meta,
  });
  from += duration;
});

const last = scenes.at(-1);
const remainder = DURATION_IN_FRAMES - from;
if (remainder < 0) {
  throw new Error(`Narration is ${-remainder / FPS}s too long for a 120s video.`);
}
last.duration += remainder;
last.outroFrames = remainder;

const timeline = {
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: DURATION_IN_FRAMES,
  totalNarrationSeconds: Number(
    scenes.reduce((sum, scene) => sum + scene.audioSeconds, 0).toFixed(3),
  ),
  outroHoldFrames: remainder,
  scenes,
};

writeFileSync(path.join(root, 'src/timeline.json'), `${JSON.stringify(timeline, null, 2)}\n`);
console.log(
  `Narration ${timeline.totalNarrationSeconds}s · outro hold ${(remainder / FPS).toFixed(2)}s · total ${DURATION_IN_FRAMES / FPS}s`,
);
for (const scene of scenes) {
  console.log(
    `${String(scene.id).padStart(2, '0')} ${scene.year.padEnd(7)} start ${(scene.from / FPS).toFixed(2)}s  duration ${(scene.duration / FPS).toFixed(2)}s  voice ${scene.audioSeconds.toFixed(2)}s`,
  );
}
