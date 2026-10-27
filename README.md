# Five Years of AI — narrated Remotion explainer

A **2:00, 1920×1080, 30 fps** animated explainer with voiced narration, burned-in
word-level captions, and a quiet procedural ambient bed. It traces how large
language models and generative AI moved from next-token autocomplete (2021) to
multimodal, reasoning, tool-using collaborators (2026).

Everything on screen is built from React, SVG, CSS and Remotion frame
animations — no stock footage, no external images, no runtime network calls.
Local WOFF2 fonts and the audio assets live in `public/`.

## Watch / render

```bash
npm install
npm run setup:browser   # only needed in sandboxes without a system Chrome
npm run render          # -> deliverables/five-years-of-ai.mp4
```

To explore it interactively:

```bash
npm run dev             # Remotion Studio, composition "AIFiveYears"
```

`npm run typecheck` verifies the TypeScript. The rendered MP4 in
`deliverables/` is intentionally left untracked so the repository stays free
of large binaries. The original 15-second Arena ad is still registered as
`ArenaAgentModeCompilation` and can be rendered with `npm run render:ad`.

## What's in the video

| Time | Chapter | Idea |
| --- | --- | --- |
| 0:00 | Cold open | Title card, then 2021's brittle next-token predictors |
| 0:12 | Scale | Data + parameters + compute turn prediction into capability |
| 0:26 | 2022 | Instruction tuning, RLHF, ChatGPT and diffusion images |
| 0:40 | 2023 | Multimodal GPT-4, open weights, retrieval and tool use |
| 0:54 | 2024 | Test-time reasoning, huge context, real-time voice and video |
| 1:08 | 2025 | Agents that plan, browse, code and complete multi-step work |
| 1:24 | The pattern | Five compounding layers behind the capability curve |
| 1:37 | 2026 | What AI can do — and why it still needs verification |
| 1:50 | Outro | Trust, verification, judgment; closing card |

Narration is split into nine clips so each chapter starts on an exact frame.
`src/timeline.json` is generated from the measured MP3 durations by
`scripts/build-timeline.mjs`: total narration is 115.04 s, with a 2 s title
hold, small inter-chapter breaths and a 2.03 s closing hold to land precisely
on 3600 frames.

## Project layout

```
src/video/theme.ts          colors, typography, animation helpers
src/video/ui.tsx            backdrop, top chrome, captions, scene frame, icons
src/video/scenes.tsx        nine animated scenes
src/video/AIFiveYears.tsx   composition: sequences, narration, ambience, chrome
src/timeline.json           generated frame-accurate chapter/audio timeline
public/audio/final/         committed narration MP3s
public/audio/ambience.mp3   generated ambient bed
public/fonts/               Inter + Space Grotesk (WOFF2)
deliverables/               rendered MP4 (not committed)
scripts/setup-chromium.mjs  unpacks an npm-hosted Chromium for this sandbox
scripts/prepare-audio.mjs   tightens raw TTS WAVs into the final MP3s
scripts/make-ambience.py    synthesizes the ambient bed, then encodes MP3
scripts/build-timeline.mjs  measures audio and writes src/timeline.json
```

The narration was generated with a text-to-speech voice and time-stretched
~10% with `atempo` to fit the two-minute runtime without changing pitch. Raw
WAV takes are git-ignored; the processed MP3s are committed so a fresh clone
renders immediately. `scripts/prepare-audio.mjs` and
`scripts/make-ambience.py` document how those assets were made. To change the
script, edit the captions in `scripts/build-timeline.mjs`, regenerate the voice
clips, then rebuild the timeline.

## Accuracy notes

The narration deliberately stays at the level of broad, well-documented shifts
rather than making claims about specific 2026 products. Selected public
milestones used for fact-checking: ChatGPT's November 30, 2022 launch, GPT-4
on March 14, 2023, and the o1 reasoning preview on September 12, 2024 [2](https://www.searchenginejournal.com/history-of-chatgpt-timeline/488370/);
Llama 2's July 2023 open-weight release, GPT-4o's native multimodality in May
2024, the Model Context Protocol in November 2024, and coding agents in 2025 [7](https://theaiuniversity.com/docs/industry-impact/ai-predictions-timeline);
and open-weight reasoning models such as DeepSeek-R1 in January 2025 [5](https://www.datacamp.com/blog/history-and-evolution-of-large-language-models).
The capability curve and the scale multipliers are illustrative, not measured
benchmark values.
