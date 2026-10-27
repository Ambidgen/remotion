import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import './fonts';
import {Backdrop, BottomProgress, Captions, TopChrome, TransitionFlash} from './ui';
import {SceneVisual} from './scenes';
import {DURATION_IN_FRAMES, SCENES, VISUAL_OVERLAP, sceneAt, type Scene} from './timeline';
import {C, SANS, accentOf, anim, easeInOut} from './theme';

const SceneSequence: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame(); // local to this scene's visual Sequence
  return <SceneVisual scene={scene} frame={frame} />;
};

const CaptionSequence: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame(); // local to the exact narration timeline
  return <Captions frame={frame} scene={scene} />;
};

export const AIFiveYears: React.FC = () => {
  const frame = useCurrentFrame();
  const activeScene = sceneAt(frame);
  const accent = accentOf(activeScene.accent);

  return (
    <AbsoluteFill style={{backgroundColor: C.bg, fontFamily: SANS, color: C.text}}>
      <Backdrop />

      {/* Visual chapters overlap for a 10-frame crossfade. */}
      {SCENES.map((scene) => {
        const early = scene.id === 1 ? 0 : VISUAL_OVERLAP;
        return (
          <Sequence
            key={`visual-${scene.id}`}
            from={scene.from - early}
            durationInFrames={scene.duration + early}
            name={`${String(scene.id).padStart(2, '0')} · ${scene.chapter}`}
          >
            <SceneSequence scene={scene} />
          </Sequence>
        );
      })}

      {/* Captions sit above every visual layer but follow exact audio timing. */}
      {SCENES.map((scene) => (
        <Sequence
          key={`captions-${scene.id}`}
          from={scene.from}
          durationInFrames={scene.duration}
          layout="none"
          name={`Captions ${scene.id}`}
        >
          <CaptionSequence scene={scene} />
        </Sequence>
      ))}

      {SCENES.map((scene) => (
        <Sequence
          key={`voice-${scene.id}`}
          from={scene.from + scene.leadFrames}
          durationInFrames={scene.audioFrames}
          layout="none"
          name={`Voice ${scene.id}`}
        >
          <Audio src={staticFile(scene.audioSrc)} />
        </Sequence>
      ))}

      {/* A very low, procedurally generated bed underneath the narration. */}
      <Audio
        src={staticFile('audio/ambience.mp3')}
        volume={(f) => 0.2 * anim(f, [0, 45, DURATION_IN_FRAMES - 120, DURATION_IN_FRAMES], [0, 1, 1, 0], easeInOut)}
      />

      <TransitionFlash frame={frame} />
      <TopChrome frame={frame} scene={activeScene} />
      <BottomProgress frame={frame} accent={accent} />
    </AbsoluteFill>
  );
};
