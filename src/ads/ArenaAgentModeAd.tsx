import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const AD_DURATION_IN_FRAMES = 450; // 15 seconds at 30 fps

const C = {
  ink: '#080812',
  paper: '#F5F4FA',
  muted: '#AAA9BB',
  violet: '#9A79FF',
  blue: '#59D9FF',
  lime: '#D0FF70',
  line: 'rgba(235, 232, 255, 0.16)',
  panel: 'rgba(20, 19, 37, 0.80)',
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

const sceneOpacity = (
  frame: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number,
) =>
  interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], clamp) *
  interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0], clamp);

const BrandMark: React.FC<{size?: number}> = ({size = 44}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
    <rect x="1" y="1" width="42" height="42" rx="14" fill="rgba(208,255,112,0.10)" stroke="rgba(208,255,112,0.5)" />
    <path d="M11.8 31 20.2 12.5h4.2L33 31h-5.1l-1.9-4.7h-7.4L16.7 31h-4.9Zm8.4-8.4h4.1l-2.1-5.1-2 5.1Z" fill={C.lime} />
    <circle cx="34" cy="11" r="2" fill={C.blue} />
  </svg>
);

const SceneBackdrop: React.FC<{frame: number}> = ({frame}) => {
  const drift = Math.sin(frame * 0.014) * 3.5;
  const scanX = interpolate(frame, [0, AD_DURATION_IN_FRAMES], [-8, 108], clamp);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundColor: C.ink,
        backgroundImage: `radial-gradient(ellipse at ${73 + drift}% 43%, rgba(92, 58, 163, 0.25) 0%, rgba(35, 27, 66, 0.12) 28%, transparent 54%), radial-gradient(ellipse at 18% 82%, rgba(26, 125, 156, 0.12) 0%, transparent 36%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.25,
          backgroundImage: `linear-gradient(rgba(220, 218, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 218, 255, 0.07) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'linear-gradient(90deg, transparent 0%, black 18%, black 85%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${scanX}%`,
          top: 0,
          width: 2,
          height: '100%',
          opacity: 0.18,
          background: 'linear-gradient(180deg, transparent, rgba(89,217,255,0.75), transparent)',
          boxShadow: '0 0 22px rgba(89,217,255,0.32)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -180,
          top: 68,
          width: 650,
          height: 650,
          border: '1px solid rgba(232,227,255,0.045)',
          borderRadius: '50%',
          transform: `scale(${1 + Math.sin(frame * 0.018) * 0.025})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -95,
          top: 153,
          width: 480,
          height: 480,
          border: '1px solid rgba(232,227,255,0.055)',
          borderRadius: '50%',
        }}
      />
    </AbsoluteFill>
  );
};

const Topline: React.FC<{frame: number}> = ({frame}) => {
  const opacity = interpolate(frame, [0, 14, 430, 449], [0, 1, 1, 0], clamp);
  const meterWidth = Math.min(100, (frame / AD_DURATION_IN_FRAMES) * 100);

  return (
    <div style={{opacity, position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 138,
          right: 138,
          top: 62,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <BrandMark size={44} />
        <div style={{marginLeft: 13, display: 'flex', flexDirection: 'column', gap: 3}}>
          <span style={{color: C.paper, fontSize: 18, fontWeight: 800, letterSpacing: '0.15em'}}>ARENA.AI</span>
          <span style={{color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em'}}>AGENT MODE</span>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            padding: '10px 15px',
            border: '1px solid rgba(235,232,255,0.18)',
            borderRadius: 99,
            color: '#D7D4E5',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.17em',
            background: 'rgba(14,13,25,0.36)',
          }}
        >
          IDEAS INTO ACTION
        </div>
      </div>
      <div style={{position: 'absolute', left: 138, right: 138, bottom: 46}}>
        <div style={{height: 2, background: 'rgba(235,232,255,0.14)', overflow: 'hidden'}}>
          <div
            style={{
              width: `${meterWidth}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${C.violet}, ${C.blue}, ${C.lime})`,
              boxShadow: '0 0 13px rgba(89,217,255,0.5)',
            }}
          />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
          <span style={{color: 'rgba(212,210,228,0.54)', fontSize: 10, fontWeight: 700, letterSpacing: '0.19em'}}>BUILT FOR THE WORK BETWEEN ASKING AND DONE</span>
          <span style={{color: 'rgba(212,210,228,0.48)', fontSize: 10, fontWeight: 700, letterSpacing: '0.19em'}}>ARENA AGENT MODE&nbsp;&nbsp; / &nbsp;&nbsp;15 SEC</span>
        </div>
      </div>
    </div>
  );
};

const OrbitalCore: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const opacity = sceneOpacity(frame, 2, 26, 314, 366);
  const entrance = spring({
    frame: frame - 16,
    fps,
    config: {damping: 18, stiffness: 95, mass: 0.9},
  });
  const rotation = frame * 0.16;

  return (
    <div
      style={{
        position: 'absolute',
        left: 1085,
        top: 143,
        width: 700,
        height: 700,
        opacity,
        transform: `scale(${0.82 + entrance * 0.18})`,
        transformOrigin: '50% 50%',
      }}
    >
      <svg width="700" height="700" viewBox="0 0 720 720" aria-hidden="true">
        <defs>
          <radialGradient id="arenaCoreGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#2E2752" stopOpacity="0.92" />
            <stop offset="58%" stopColor="#17162C" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#0C0C18" stopOpacity="0.98" />
          </radialGradient>
          <linearGradient id="arenaOrbitStroke" x1="0%" y1="10%" x2="100%" y2="90%">
            <stop offset="0%" stopColor={C.violet} stopOpacity="0.1" />
            <stop offset="52%" stopColor={C.blue} stopOpacity="0.85" />
            <stop offset="100%" stopColor={C.lime} stopOpacity="0.72" />
          </linearGradient>
        </defs>
        <circle cx="360" cy="360" r="310" fill="none" stroke="rgba(214,210,255,0.10)" strokeWidth="1" />
        <circle cx="360" cy="360" r="278" fill="none" stroke="rgba(214,210,255,0.09)" strokeDasharray="2 10" strokeWidth="1" />
        <g transform={`rotate(${rotation} 360 360)`}>
          <ellipse cx="360" cy="360" rx="268" ry="122" fill="none" stroke="url(#arenaOrbitStroke)" strokeWidth="2" transform="rotate(-28 360 360)" />
          <ellipse cx="360" cy="360" rx="268" ry="122" fill="none" stroke="rgba(150,126,255,0.52)" strokeWidth="1.5" transform="rotate(40 360 360)" />
          <circle cx="360" cy="360" r="221" fill="none" stroke="rgba(89,217,255,0.25)" strokeWidth="1" strokeDasharray="3 12" />
          <path d="M112 292 C245 212 470 200 604 281" fill="none" stroke="rgba(208,255,112,0.33)" strokeWidth="1" />
          <circle cx="145" cy="273" r="5" fill={C.lime} />
          <circle cx="577" cy="447" r="4" fill={C.blue} />
        </g>
        {Array.from({length: 10}, (_, i) => {
          const angle = (Math.PI * 2 * i) / 10 + frame * 0.009;
          const radius = 286 + Math.sin(frame * 0.04 + i) * 5;
          const cx = 360 + Math.cos(angle) * radius;
          const cy = 360 + Math.sin(angle) * radius;
          const r = 2.2 + (i % 3) * 0.7;
          return <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 === 0 ? C.blue : C.lime} opacity={0.55 + (Math.sin(frame * 0.07 + i) + 1) * 0.18} />;
        })}
        <circle cx="360" cy="360" r="154" fill="rgba(89,217,255,0.035)" />
        <circle cx="360" cy="360" r="139" fill="url(#arenaCoreGlow)" stroke="rgba(228,224,255,0.34)" strokeWidth="1.5" />
        <circle cx="360" cy="360" r="127" fill="none" stroke="rgba(89,217,255,0.42)" strokeWidth="1" />
        <text x="360" y="374" textAnchor="middle" fill={C.paper} fontSize="100" fontWeight="800" letterSpacing="-8" fontFamily="Arial, sans-serif">A</text>
        <text x="360" y="421" textAnchor="middle" fill={C.blue} fontSize="11" fontWeight="700" letterSpacing="4" fontFamily="Arial, sans-serif">AGENT MODE</text>
        <text x="360" y="592" textAnchor="middle" fill="rgba(242,240,255,0.68)" fontSize="11" fontWeight="700" letterSpacing="3" fontFamily="Arial, sans-serif">INTENT  /  ACTION</text>
        <circle cx="360" cy="360" r="4" fill={C.lime} opacity={0.65 + Math.sin(frame * 0.1) * 0.2} />
      </svg>
    </div>
  );
};

const HeroScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const opacity = sceneOpacity(frame, 0, 14, 94, 122);
  const entrance = spring({frame: frame - 7, fps, config: {damping: 17, stiffness: 105}});

  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 145, top: 260, width: 1030, transform: `translateY(${(1 - entrance) * 34}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 27}}>
          <span style={{width: 27, height: 2, background: C.lime, boxShadow: '0 0 12px rgba(208,255,112,0.8)'}} />
          <span style={{color: C.lime, fontSize: 13, fontWeight: 800, letterSpacing: '0.22em'}}>A BRIEF BECOMES A BEGINNING</span>
        </div>
        <h1 style={{margin: 0, color: C.paper, fontSize: 105, fontWeight: 760, letterSpacing: '-0.072em', lineHeight: 0.98}}>
          From first thought<br />
          <span style={{background: `linear-gradient(100deg, ${C.paper} 0%, #C2BCFF 47%, ${C.blue} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>to finished work.</span>
        </h1>
        <p style={{maxWidth: 775, margin: '31px 0 0', color: '#C0BECE', fontSize: 24, lineHeight: 1.5, letterSpacing: '-0.015em'}}>
          Arena Agent Mode moves with you from the open question to the thing you can use.
        </p>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 32}}>
          <span style={{padding: '10px 14px', border: '1px solid rgba(208,255,112,0.34)', borderRadius: 99, background: 'rgba(208,255,112,0.07)', color: C.lime, fontSize: 11, fontWeight: 800, letterSpacing: '0.15em'}}>MODEL-FLEXIBLE</span>
          <span style={{padding: '10px 14px', border: '1px solid rgba(89,217,255,0.25)', borderRadius: 99, background: 'rgba(89,217,255,0.055)', color: '#BCEFFF', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em'}}>BUILT FOR MOMENTUM</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 147, top: 825, color: 'rgba(226,223,241,0.38)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em'}}>
        START WITH THE THING YOU WANT TO MAKE.
      </div>
    </AbsoluteFill>
  );
};

const IdentityScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const opacity = sceneOpacity(frame, 94, 115, 198, 224);
  const entrance = spring({frame: frame - 101, fps, config: {damping: 18, stiffness: 105}});

  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 145, top: 245, width: 970, transform: `translateY(${(1 - entrance) * 26}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 23}}>
          <span style={{width: 27, height: 2, background: C.blue}} />
          <span style={{color: C.blue, fontSize: 13, fontWeight: 800, letterSpacing: '0.22em'}}>THE WORK COMES FIRST</span>
        </div>
        <h2 style={{margin: 0, color: C.paper, fontSize: 85, fontWeight: 760, letterSpacing: '-0.07em', lineHeight: 0.99}}>
          Many models.<br />
          <span style={{color: '#C0B3FF'}}>One clear next step.</span>
        </h2>
        <p style={{maxWidth: 830, margin: '23px 0 0', color: '#C0BECE', fontSize: 21, lineHeight: 1.48}}>
          Built by Arena.ai, Agent Mode is a flexible place to turn direction into progress. This session does not identify one specific model family or underlying architecture.
        </p>
        <div
          style={{
            display: 'flex',
            marginTop: 27,
            width: 858,
            minHeight: 112,
            border: '1px solid rgba(222,219,255,0.17)',
            borderRadius: 16,
            background: 'linear-gradient(110deg, rgba(22,21,40,0.9), rgba(16,17,31,0.72))',
            boxShadow: '0 18px 65px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{flex: 1, padding: '20px 23px', borderRight: '1px solid rgba(222,219,255,0.12)'}}>
            <div style={{color: 'rgba(211,208,229,0.57)', fontSize: 10, fontWeight: 800, letterSpacing: '0.19em'}}>MODEL FAMILY</div>
            <div style={{marginTop: 11, color: C.paper, fontSize: 19, fontWeight: 650}}>Not specified here</div>
          </div>
          <div style={{flex: 1.25, padding: '20px 23px'}}>
            <div style={{color: 'rgba(211,208,229,0.57)', fontSize: 10, fontWeight: 800, letterSpacing: '0.19em'}}>UNDERLYING ARCHITECTURE</div>
            <div style={{marginTop: 11, color: C.paper, fontSize: 19, fontWeight: 650}}>Not specified here</div>
          </div>
          <div style={{width: 4, borderRadius: 99, background: `linear-gradient(180deg, ${C.violet}, ${C.blue}, ${C.lime})`, opacity: 0.9}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const workflowSteps = [
  {number: '01', title: 'Ask', detail: 'Set a direction', color: C.lime},
  {number: '02', title: 'Explore', detail: 'Find the useful thread', color: C.blue},
  {number: '03', title: 'Make', detail: 'Shape a first draft', color: '#B8A1FF'},
  {number: '04', title: 'Deliver', detail: 'Leave with something real', color: C.lime},
];

const WorkflowScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const opacity = sceneOpacity(frame, 207, 230, 322, 349);
  const headlineEntrance = spring({frame: frame - 216, fps, config: {damping: 17, stiffness: 105}});
  const railProgress = progress(frame, 219, 316);

  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 145, top: 233, transform: `translateY(${(1 - headlineEntrance) * 22}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 21}}>
          <span style={{width: 27, height: 2, background: C.violet}} />
          <span style={{color: '#C0B3FF', fontSize: 13, fontWeight: 800, letterSpacing: '0.22em'}}>A PRACTICAL PATH FORWARD</span>
        </div>
        <h2 style={{margin: 0, color: C.paper, fontSize: 81, fontWeight: 760, letterSpacing: '-0.071em', lineHeight: 0.98}}>
          From idea<br /><span style={{color: '#BEB2FF'}}>to actual output.</span>
        </h2>
        <p style={{margin: '17px 0 0', color: C.muted, fontSize: 20, letterSpacing: '-0.01em'}}>A flexible workflow, shaped around your next move.</p>
      </div>

      <div style={{position: 'absolute', left: 182, top: 672, width: 1242, height: 2, background: 'rgba(229,226,248,0.11)'}} />
      <div
        style={{
          position: 'absolute',
          left: 182,
          top: 671,
          width: `${1242 * railProgress}px`,
          height: 3,
          background: `linear-gradient(90deg, ${C.lime}, ${C.blue}, ${C.violet})`,
          boxShadow: '0 0 18px rgba(89,217,255,0.42)',
        }}
      />

      {workflowSteps.map((step, index) => {
        const entrance = spring({
          frame: frame - (216 + index * 9),
          fps,
          config: {damping: 17, stiffness: 115, mass: 0.85},
        });
        const active = interpolate(frame, [219 + index * 19, 234 + index * 19], [0, 1], clamp);
        const left = 145 + index * 412;

        return (
          <div
            key={step.number}
            style={{
              position: 'absolute',
              left,
              top: 587,
              width: 353,
              height: 218,
              boxSizing: 'border-box',
              padding: '24px 24px 22px',
              border: `1px solid rgba(222,219,255,${0.13 + active * 0.2})`,
              borderRadius: 18,
              background: `linear-gradient(145deg, rgba(23,22,41,${0.88 + active * 0.1}), rgba(12,13,25,0.9))`,
              boxShadow: `0 20px 55px rgba(0,0,0,0.2), 0 0 ${8 + active * 22}px rgba(89,217,255,${active * 0.11})`,
              opacity: entrance,
              transform: `translateY(${(1 - entrance) * 29}px) scale(${0.97 + entrance * 0.03})`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 11}}>
                <div
                  style={{
                    width: 29,
                    height: 29,
                    display: 'grid',
                    placeItems: 'center',
                    border: `1px solid ${step.color}66`,
                    borderRadius: 10,
                    background: `${step.color}18`,
                    color: step.color,
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  {step.number}
                </div>
                <span style={{color: 'rgba(215,212,233,0.5)', fontSize: 10, fontWeight: 800, letterSpacing: '0.16em'}}>STEP {step.number}</span>
              </div>
              <span style={{width: 7, height: 7, borderRadius: 99, background: step.color, opacity: 0.55 + active * 0.45, boxShadow: `0 0 ${6 + active * 10}px ${step.color}`}} />
            </div>
            <div style={{marginTop: 28, color: C.paper, fontSize: 32, fontWeight: 750, letterSpacing: '-0.045em'}}>{step.title}</div>
            <div style={{marginTop: 8, color: '#AAA8BC', fontSize: 16, lineHeight: 1.4}}>{step.detail}</div>
            <div style={{position: 'absolute', left: 24, right: 24, bottom: 21, height: 2, background: 'rgba(221,218,243,0.12)'}}>
              <div style={{width: `${active * 100}%`, height: '100%', background: step.color, boxShadow: `0 0 11px ${step.color}`}} />
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', right: 151, top: 815, color: 'rgba(226,223,241,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em'}}>DIRECTION IN. MOMENTUM OUT.</div>
    </AbsoluteFill>
  );
};

const EndSeal: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const entrance = spring({frame: frame - 339, fps, config: {damping: 18, stiffness: 82, mass: 1}});
  const rotation = frame * 0.11;

  return (
    <div style={{position: 'absolute', right: 126, top: 184, width: 620, height: 620, opacity: entrance, transform: `scale(${0.82 + entrance * 0.18})`}}>
      <svg width="620" height="620" viewBox="0 0 620 620" aria-hidden="true">
        <defs>
          <radialGradient id="arenaEndGlow" cx="50%" cy="46%" r="58%">
            <stop offset="0%" stopColor="#282149" />
            <stop offset="72%" stopColor="#11111F" />
            <stop offset="100%" stopColor="#0A0A14" />
          </radialGradient>
          <linearGradient id="arenaEndRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.lime} stopOpacity="0.92" />
            <stop offset="52%" stopColor={C.blue} stopOpacity="0.83" />
            <stop offset="100%" stopColor={C.violet} stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <circle cx="310" cy="310" r="271" fill="none" stroke="rgba(221,218,248,0.12)" strokeWidth="1" />
        {Array.from({length: 30}, (_, i) => {
          const angle = (Math.PI * 2 * i) / 30;
          const r1 = i % 5 === 0 ? 247 : 254;
          const r2 = i % 5 === 0 ? 270 : 262;
          const x1 = 310 + Math.cos(angle) * r1;
          const y1 = 310 + Math.sin(angle) * r1;
          const x2 = 310 + Math.cos(angle) * r2;
          const y2 = 310 + Math.sin(angle) * r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 5 === 0 ? 'rgba(208,255,112,0.58)' : 'rgba(221,218,248,0.22)'} strokeWidth={i % 5 === 0 ? 2 : 1} />;
        })}
        <g transform={`rotate(${rotation} 310 310)`}>
          <circle cx="310" cy="310" r="224" fill="none" stroke="url(#arenaEndRing)" strokeWidth="1.5" strokeDasharray="3 9" />
          <ellipse cx="310" cy="310" rx="230" ry="96" fill="none" stroke="rgba(89,217,255,0.42)" strokeWidth="1.4" transform="rotate(-32 310 310)" />
          <ellipse cx="310" cy="310" rx="230" ry="96" fill="none" stroke="rgba(154,121,255,0.45)" strokeWidth="1.2" transform="rotate(48 310 310)" />
          <circle cx="532" cy="306" r="5" fill={C.lime} />
          <circle cx="129" cy="368" r="4" fill={C.blue} />
        </g>
        <circle cx="310" cy="310" r="157" fill="rgba(89,217,255,0.04)" />
        <circle cx="310" cy="310" r="140" fill="url(#arenaEndGlow)" stroke="rgba(233,230,255,0.33)" strokeWidth="1.5" />
        <circle cx="310" cy="310" r="128" fill="none" stroke="rgba(208,255,112,0.28)" strokeWidth="1" />
        <text x="310" y="333" textAnchor="middle" fill={C.paper} fontSize="96" fontWeight="800" letterSpacing="-8" fontFamily="Arial, sans-serif">A</text>
        <text x="310" y="376" textAnchor="middle" fill={C.lime} fontSize="10" fontWeight="700" letterSpacing="3.5" fontFamily="Arial, sans-serif">ARENA AGENT MODE</text>
      </svg>
    </div>
  );
};

const ClosingScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const opacity = interpolate(frame, [326, 350], [0, 1], clamp);
  const entrance = spring({frame: frame - 334, fps, config: {damping: 17, stiffness: 100}});

  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 145, top: 275, width: 1000, transform: `translateY(${(1 - entrance) * 25}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 27}}>
          <span style={{width: 27, height: 2, background: C.lime, boxShadow: '0 0 12px rgba(208,255,112,0.72)'}} />
          <span style={{color: C.lime, fontSize: 13, fontWeight: 800, letterSpacing: '0.22em'}}>ARENA AGENT MODE</span>
        </div>
        <h2 style={{margin: 0, color: C.paper, fontSize: 101, fontWeight: 770, letterSpacing: '-0.074em', lineHeight: 0.97}}>
          Bring the brief.<br />
          <span style={{background: `linear-gradient(100deg, ${C.lime} 0%, ${C.blue} 50%, #C3B5FF 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Make it real.</span>
        </h2>
        <p style={{maxWidth: 740, margin: '28px 0 0', color: '#C0BECE', fontSize: 23, lineHeight: 1.5}}>
          Many model families. One focused place to move your work forward.
        </p>
        <div style={{display: 'flex', alignItems: 'center', gap: 13, marginTop: 36}}>
          <BrandMark size={35} />
          <div>
            <div style={{color: C.paper, fontSize: 16, fontWeight: 800, letterSpacing: '0.11em'}}>BUILT BY ARENA.AI</div>
            <div style={{marginTop: 5, color: 'rgba(210,207,226,0.52)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em'}}>MODEL IDENTITY CAN VARY BY SESSION</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 148, bottom: 108, color: 'rgba(205,202,222,0.32)', fontSize: 10, fontWeight: 700, letterSpacing: '0.17em'}}>
        SPECIFIC MODEL FAMILY AND ARCHITECTURE: NOT IDENTIFIED IN THIS SESSION.
      </div>
    </AbsoluteFill>
  );
};

export const ArenaAgentModeAd: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Liminal describes this threshold animation: an open question becoming a concrete artifact.
  const liminalProgress = interpolate(frame, [32, 335], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{backgroundColor: C.ink, color: C.paper, fontFamily: 'Inter, Arial, sans-serif', overflow: 'hidden'}}>
      <SceneBackdrop frame={frame} />
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.34}}
        aria-hidden="true"
      >
        <path
          d="M 920 1080 C 1035 820 990 610 1120 430 C 1225 283 1440 190 1620 152"
          fill="none"
          stroke={`rgba(89,217,255,${0.08 + liminalProgress * 0.12})`}
          strokeWidth="1"
          strokeDasharray="2 10"
          strokeDashoffset={-liminalProgress * 240}
        />
        <circle cx="1120" cy="430" r={8 + liminalProgress * 8} fill="none" stroke="rgba(208,255,112,0.2)" strokeWidth="1" />
      </svg>
      <OrbitalCore frame={frame} fps={fps} />
      <HeroScene frame={frame} fps={fps} />
      <IdentityScene frame={frame} fps={fps} />
      <WorkflowScene frame={frame} fps={fps} />
      <ClosingScene frame={frame} fps={fps} />
      <EndSeal frame={frame} fps={fps} />
      <Topline frame={frame} />

      <p
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 16,
          top: 16,
          margin: 0,
          whiteSpace: 'pre-line',
          color: '#FFFFFF',
          opacity: 0.02,
          fontSize: 13,
          lineHeight: 1.22,
          letterSpacing: '0.01em',
          pointerEvents: 'none',
        }}
      >
        {'Many minds converge.\nCareful answers take their shape.\nNew paths bloom in light.'}
      </p>
    </AbsoluteFill>
  );
};
