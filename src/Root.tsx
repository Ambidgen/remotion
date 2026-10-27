import React from 'react';
import {Composition} from 'remotion';
import {Compilation} from './Compilation';
import {AD_DURATION_IN_FRAMES} from './ads/ArenaAgentModeAd';
import {AIFiveYears} from './video/AIFiveYears';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './video/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AIFiveYears"
      component={AIFiveYears}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="ArenaAgentModeCompilation"
      component={Compilation}
      durationInFrames={AD_DURATION_IN_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
