import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {AD_DURATION_IN_FRAMES, ArenaAgentModeAd} from './ads/ArenaAgentModeAd';

export const Compilation: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#080812'}}>
    {/* The repository's starting revision contains no predecessor ads; this is the first 15-second slot. */}
    <Sequence from={0} durationInFrames={AD_DURATION_IN_FRAMES} name="Arena Agent Mode — 15 seconds">
      <ArenaAgentModeAd />
    </Sequence>
  </AbsoluteFill>
);
