import timeline from '../timeline.json';

export type Scene = {
  id: number;
  from: number;
  duration: number;
  leadFrames: number;
  audioFrames: number;
  audioSeconds: number;
  audioSrc: string;
  year: string;
  kicker: string;
  headline: string;
  subtext: string;
  accent: string;
  chapter: string;
  variant: string;
  caption: string;
  outroFrames?: number;
};

export const FPS = timeline.fps;
export const WIDTH = timeline.width;
export const HEIGHT = timeline.height;
export const DURATION_IN_FRAMES = timeline.durationInFrames;
// Visual chapters overlap by 10 frames so consecutive scenes crossfade instead
// of briefly flashing an empty frame at the cut. Audio and captions stay exact.
export const VISUAL_OVERLAP = 10;
export const TOTAL_NARRATION_SECONDS = timeline.totalNarrationSeconds;
export const SCENES = timeline.scenes as Scene[];

export const sceneAt = (frame: number): Scene => {
  for (let i = SCENES.length - 1; i >= 0; i -= 1) {
    if (frame >= SCENES[i].from) return SCENES[i];
  }
  return SCENES[0];
};
