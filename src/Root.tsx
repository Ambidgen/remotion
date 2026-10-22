import React from 'react';
import {Composition} from 'remotion';
import {Compilation} from './Compilation';
import {AD_DURATION_IN_FRAMES} from './ads/ArenaAgentModeAd';

export const RemotionRoot: React.FC = () => (
  <>
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
