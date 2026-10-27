import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  C,
  DISPLAY,
  SANS,
  accentOf,
  anim,
  easeInOut,
  labelStyle,
  panelStyle,
  rgba,
  rise,
  smallCaps,
} from './theme';
import {DURATION_IN_FRAMES, SCENES, VISUAL_OVERLAP, type Scene} from './timeline';

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */

export type GlyphName =
  | 'text'
  | 'image'
  | 'code'
  | 'search'
  | 'doc'
  | 'brain'
  | 'eye'
  | 'chat'
  | 'gear'
  | 'shield'
  | 'check'
  | 'spark'
  | 'wave'
  | 'play'
  | 'link'
  | 'clock';

const glyphPaths: Record<GlyphName, React.ReactNode> = {
  text: (
    <>
      <path d="M4 6h16M4 10h16M4 14h11M4 18h7" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9" r="1.6" />
      <path d="m3.8 17 5.1-5 3.6 3.2 3.1-3.4 4.6 5.2" />
    </>
  ),
  code: (
    <>
      <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5l-3 14" />
    </>
  ),
  search: (
    <>
      <circle cx="10.7" cy="10.7" r="6.2" />
      <path d="m15.4 15.4 4.3 4.3" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.7V8h4.1M8 12h7M8 15.5h7" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 4.5A3 3 0 0 0 5 8.2a3.2 3.2 0 0 0-1.5 5.6A3 3 0 0 0 6.4 19a2.7 2.7 0 0 0 3.4-1.5V5.4a2.6 2.6 0 0 0-.3-.9Z" />
      <path d="M14.5 4.5A3 3 0 0 1 19 8.2a3.2 3.2 0 0 1 1.5 5.6A3 3 0 0 1 17.6 19a2.7 2.7 0 0 1-3.4-1.5V5.4a2.6 2.6 0 0 1 .3-.9Z" />
      <path d="M8 9h2M14 12h2M9 15h2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.7" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 11.6c0 4.2-3.8 7.6-8.5 7.6-1.1 0-2.2-.2-3.2-.5L4 20.5l1.4-4a7.1 7.1 0 0 1-1.9-4.9C3.5 7.4 7.3 4 12 4s8.5 3.4 8.5 7.6Z" />
      <path d="M8 11.5h8M8 14.5h5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.5M12 18.7v2.5M4.5 4.5l1.8 1.8M17.7 17.7l1.8 1.8M2.8 12h2.5M18.7 12h2.5M4.5 19.5l1.8-1.8M17.7 6.3l1.8-1.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.8 5.8v5.4c0 4.3 2.9 7.9 7.2 9.4 4.3-1.5 7.2-5.1 7.2-9.4V5.8L12 3Z" />
      <path d="m9 12 2.1 2.2L15.3 10" />
    </>
  ),
  check: (
    <>
      <path d="m4.5 12.4 4.7 4.6L19.5 6.8" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2.5 13.7 9l6.6 1.7-6.6 1.7L12 19l-1.7-6.6L3.7 10.7 10.3 9 12 2.5Z" fill="currentColor" stroke="none" />
      <path d="M19 16.5 19.7 19l2.5.7-2.5.7L19 23l-.7-2.6-2.5-.7 2.5-.7.7-2.5Z" fill="currentColor" stroke="none" />
    </>
  ),
  wave: (
    <>
      <path d="M2.5 12c2.2-5.5 3.7-5.5 5.9 0s3.7 5.5 5.9 0 3.7-5.5 5.9 0" />
    </>
  ),
  play: (
    <>
      <path d="m8.5 5.8 10 6.2-10 6.2V5.8Z" fill="currentColor" stroke="none" />
    </>
  ),
  link: (
    <>
      <path d="M9.5 14.5 14.5 9.5M8 11.5 6.4 13a3.4 3.4 0 0 0 4.8 4.8l1.6-1.6M16 12.5l1.6-1.6a3.4 3.4 0 0 0-4.8-4.8l-1.6 1.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.4 2.2" />
    </>
  ),
};

export const Glyph: React.FC<{
  name: GlyphName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({name, size = 24, color = C.text, strokeWidth = 1.7, style}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{flexShrink: 0, ...style}}
    aria-hidden="true"
  >
    {glyphPaths[name]}
  </svg>
);

/* ------------------------------------------------------------------ */
/* Shared surfaces                                                    */
/* ------------------------------------------------------------------ */

export const Panel: React.FC<{
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}> = ({children, accent = C.cyan, style}) => (
  <div style={panelStyle(accent, style)}>{children}</div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
  filled?: boolean;
}> = ({children, accent = C.cyan, style, filled = false}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '10px 16px',
      borderRadius: 999,
      border: `1px solid ${rgba(accent, filled ? 0.6 : 0.28)}`,
      backgroundColor: filled ? rgba(accent, 0.14) : 'rgba(12, 19, 38, 0.7)',
      color: filled ? C.text : C.muted,
      fontFamily: SANS,
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: 0.2,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Node: React.FC<{
  x: number;
  y: number;
  r?: number;
  color: string;
  opacity?: number;
  glow?: number;
}> = ({x, y, r = 5, color, opacity = 1, glow = 12}) => (
  <circle
    cx={x}
    cy={y}
    r={r}
    fill={color}
    opacity={opacity}
    style={{filter: `drop-shadow(0 0 ${glow}px ${rgba(color, 0.75)})`}}
  />
);

/* ------------------------------------------------------------------ */
/* Global chrome                                                      */
/* ------------------------------------------------------------------ */

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 165) * 3.2;
  const drift2 = Math.cos(frame / 205) * 2.6;
  const scan = ((frame * 0.12) % 140) - 20;

  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(ellipse at ${24 + drift}% ${22 + drift2}%, ${rgba(C.violet, 0.22)} 0%, transparent 42%), radial-gradient(ellipse at ${78 + drift2}% ${70 + drift}%, ${rgba(C.cyan, 0.15)} 0%, transparent 44%), radial-gradient(ellipse at 50% 110%, ${rgba(C.mint, 0.08)} 0%, transparent 42%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage: `linear-gradient(${rgba('#9AB4FF', 0.055)} 1px, transparent 1px), linear-gradient(90deg, ${rgba('#9AB4FF', 0.055)} 1px, transparent 1px)`,
          backgroundSize: '76px 76px',
          maskImage: 'radial-gradient(ellipse at 50% 48%, black 12%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 48%, black 12%, transparent 78%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${scan}%`,
          top: 0,
          width: 2,
          height: '100%',
          opacity: 0.14,
          background: `linear-gradient(180deg, transparent, ${rgba(C.cyan, 0.8)}, transparent)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(180deg, ${rgba(C.bg, 0.52)} 0%, transparent 18%, transparent 74%, ${rgba(C.bg, 0.72)} 100%)`,
          boxShadow: `inset 0 0 260px ${rgba('#000000', 0.72)}`,
        }}
      />
    </AbsoluteFill>
  );
};

const YEARS = ['2021', '2022', '2023', '2024', '2025', '2026'];
const YEAR_INDEX = [0, 0, 1, 2, 3, 4, 5, 5, 5];

export const TopChrome: React.FC<{frame: number; scene: Scene}> = ({frame, scene}) => {
  const activeYear = YEAR_INDEX[Math.min(YEAR_INDEX.length - 1, Math.max(0, scene.id - 1))];
  const accent = accentOf(scene.accent);
  const progress = Math.min(1, Math.max(0, frame / DURATION_IN_FRAMES));

  return (
    <div
      style={{
        position: 'absolute',
        left: 96,
        right: 96,
        top: 28,
        height: 70,
        fontFamily: SANS,
        pointerEvents: 'none',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              border: `1px solid ${rgba(C.cyan, 0.55)}`,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 6px)',
              gridTemplateRows: 'repeat(2, 6px)',
              gap: 4,
              alignContent: 'center',
              justifyContent: 'center',
              backgroundColor: rgba(C.cyan, 0.08),
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{width: 6, height: 6, borderRadius: 2, backgroundColor: i === 1 ? C.lime : C.cyan, opacity: i === 3 ? 0.45 : 1}} />
            ))}
          </div>
          <span style={{...labelStyle, color: C.text, letterSpacing: 3.2, fontSize: 16}}>FIVE YEARS OF AI</span>
          <span style={{color: C.dim, fontSize: 15, letterSpacing: 2}}>2021 → 2026</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <span style={{...smallCaps(accent), fontSize: 13}}>{scene.chapter.toUpperCase()}</span>
          <span style={{color: C.dim, fontSize: 14, letterSpacing: 2}}>
            {String(scene.id).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div style={{position: 'relative', height: 30, marginTop: 12}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 6, height: 1, backgroundColor: 'rgba(160,185,235,0.18)'}} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 5,
            width: `${progress * 100}%`,
            height: 3,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${C.violet}, ${C.cyan}, ${C.mint})`,
            boxShadow: `0 0 18px ${rgba(C.cyan, 0.5)}`,
          }}
        />
        {YEARS.map((year, i) => {
          const active = i <= activeYear;
          return (
            <div
              key={year}
              style={{
                position: 'absolute',
                left: `${(i / (YEARS.length - 1)) * 100}%`,
                top: 0,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: i === activeYear ? 12 : 7,
                  height: i === activeYear ? 12 : 7,
                  marginTop: i === activeYear ? 0 : 2.5,
                  borderRadius: '50%',
                  backgroundColor: i === activeYear ? accent : active ? C.cyan : 'rgba(150,175,220,0.35)',
                  boxShadow: i === activeYear ? `0 0 20px ${rgba(accent, 0.9)}` : 'none',
                }}
              />
              <span style={{fontSize: 11, letterSpacing: 1.4, color: i === activeYear ? C.text : C.dim}}>{year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Captions: React.FC<{frame: number; scene: Scene}> = ({frame, scene}) => {
  // `frame` is local to the scene Sequence, so captions can fade cleanly into
  // and out of that scene's own tail without a hard cut at chapter boundaries.
  const local = frame;
  const start = scene.leadFrames;
  const end = start + scene.audioFrames;
  const fadeOutEnd = Math.min(end + 8, scene.duration - 1);
  if (local < start - 8 || local > fadeOutEnd) return null;

  const words = scene.caption.split(' ');
  const progress = Math.min(1, Math.max(0, (local - start) / scene.audioFrames));
  const activeWord = Math.floor(progress * words.length);
  const opacity = anim(local, [start - 6, start + 7, Math.max(start + 8, fadeOutEnd - 10), fadeOutEnd], [0, 1, 1, 0], easeInOut);
  const accent = accentOf(scene.accent);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 250,
          background: `linear-gradient(180deg, transparent 0%, ${rgba(C.bg, 0.72)} 42%, ${rgba(C.bg, 0.96)} 100%)`,
          opacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          bottom: 46,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          opacity,
        }}
      >
        <div style={{width: 52, height: 3, borderRadius: 3, backgroundColor: accent, boxShadow: `0 0 18px ${rgba(accent, 0.8)}`}} />
        <div
          style={{
            maxWidth: 1520,
            textAlign: 'center',
            fontFamily: SANS,
            fontSize: 31,
            fontWeight: 500,
            lineHeight: 1.48,
            letterSpacing: 0.1,
            textWrap: 'balance',
          }}
        >
          {words.map((word, i) => (
            <React.Fragment key={`${word}-${i}`}>
              <span
                style={{
                  color: i <= activeWord ? C.text : C.dim,
                  backgroundColor: i === activeWord ? rgba(accent, 0.18) : 'transparent',
                  borderRadius: 6,
                  padding: '1px 3px',
                  transition: 'none',
                }}
              >
                {word}
              </span>{' '}
            </React.Fragment>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TransitionFlash: React.FC<{frame: number}> = ({frame}) => {
  // The chapter card lives only on the outgoing side of the cut: it masks the
  // crossfade, then is gone exactly when the next narration clip starts.
  // A synthetic boundary at the end of the title card gives the first chapter
  // the same clean masked transition as every later chapter.
  const boundaries = [
    {scene: SCENES[0], at: SCENES[0].from + SCENES[0].leadFrames, isIntro: true},
    ...SCENES.slice(1).map((scene) => ({scene, at: scene.from, isIntro: false})),
  ];
  const transition = boundaries
    .map((item) => ({...item, delta: frame - item.at}))
    .find((item) => item.delta <= 0 && item.delta >= -VISUAL_OVERLAP);
  if (!transition) return null;

  const {scene, delta, isIntro} = transition;
  const accent = accentOf(scene.accent);
  const opacity = isIntro
    ? (delta < 0 ? 1 : 0)
    : anim(delta, [-VISUAL_OVERLAP, -7, -2, 0], [0, 0.72, 1, 0], easeInOut);
  const sweep = Math.min(100, Math.max(0, ((delta + VISUAL_OVERLAP) / VISUAL_OVERLAP) * 100));
  if (opacity <= 0.001) return null;

  return (
    <AbsoluteFill style={{backgroundColor: rgba(C.bg, 0.985), opacity, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: `${sweep}%`,
          top: 0,
          width: 3,
          height: '100%',
          background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 44px ${rgba(accent, 0.75)}`,
        }}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: '47%', textAlign: 'center'}}>
        <div style={{...smallCaps(accent), fontSize: 16, letterSpacing: 4.2}}>
          CHAPTER {String(scene.id).padStart(2, '0')}
        </div>
        <div style={{fontFamily: DISPLAY, fontSize: 52, fontWeight: 700, color: C.text, marginTop: 12, letterSpacing: -1}}>
          {scene.chapter}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BottomProgress: React.FC<{frame: number; accent: string}> = ({frame, accent}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 5, backgroundColor: 'rgba(255,255,255,0.06)'}}>
    <div
      style={{
        width: `${Math.min(100, (frame / DURATION_IN_FRAMES) * 100)}%`,
        height: '100%',
        background: `linear-gradient(90deg, ${C.violet}, ${accent})`,
        boxShadow: `0 0 20px ${rgba(accent, 0.8)}`,
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Scene frame + title card                                           */
/* ------------------------------------------------------------------ */

export const SceneFrame: React.FC<{
  scene: Scene;
  frame: number;
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
}> = ({scene, frame, children, fadeIn = 0, fadeOut = VISUAL_OVERLAP}) => {
  const accent = accentOf(scene.accent);
  const visualDuration = scene.duration + (scene.id === 1 ? 0 : VISUAL_OVERLAP);
  const tail = scene.id === SCENES.length ? 0 : fadeOut;
  const enter = anim(frame, [fadeIn, fadeIn + VISUAL_OVERLAP], [0, 1]);
  const exit = tail > 0 ? anim(frame, [visualDuration - tail, visualDuration], [1, 0], easeInOut) : 1;
  const opacity = enter * exit;

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 76% 48%, ${rgba(accent, 0.13)} 0%, transparent 46%), radial-gradient(ellipse at 18% 82%, ${rgba(accent, 0.06)} 0%, transparent 38%)`,
        }}
      />
      <div style={{position: 'absolute', left: 96, top: 118, width: 1600}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, ...rise(frame, fadeIn + 2, 12)}}>
          <span
            style={{
              fontFamily: DISPLAY,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              color: C.bg,
              backgroundColor: accent,
              padding: '7px 13px',
              borderRadius: 8,
            }}
          >
            {scene.year}
          </span>
          <span style={{...smallCaps(accent), fontSize: 15}}>{scene.kicker}</span>
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 70,
            fontWeight: 700,
            letterSpacing: -2.1,
            lineHeight: 1.06,
            color: C.text,
            marginTop: 16,
            maxWidth: 1500,
            ...rise(frame, fadeIn + 6, 18),
          }}
        >
          {scene.headline}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 26,
            color: C.muted,
            marginTop: 12,
            letterSpacing: 0.2,
            ...rise(frame, fadeIn + 10, 14),
          }}
        >
          {scene.subtext}
        </div>
      </div>
      <div style={{position: 'absolute', left: 96, top: 326, width: 1728, height: 526}}>{children}</div>
    </AbsoluteFill>
  );
};

export const TitleCard: React.FC<{frame: number}> = ({frame}) => {
  const opacity = anim(frame, [0, 10, 38, 50], [0, 1, 1, 0], easeInOut);
  const scale = anim(frame, [0, 54], [0.94, 1.02]);
  if (opacity <= 0.001) return null;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 780,
          height: 780,
          borderRadius: '50%',
          border: `1px solid ${rgba(C.cyan, 0.16)}`,
          boxShadow: `0 0 140px ${rgba(C.violet, 0.16)} inset`,
        }}
      />
      <svg
        width="920"
        height="920"
        viewBox="0 0 920 920"
        style={{position: 'absolute', transform: `rotate(${frame * 0.16}deg)`}}
      >
        <circle cx="460" cy="460" r="410" fill="none" stroke={rgba(C.cyan, 0.3)} strokeWidth="1.5" strokeDasharray="3 22" />
        <circle cx="460" cy="460" r="330" fill="none" stroke={rgba(C.violet, 0.2)} strokeWidth="1" strokeDasharray="80 44" />
        {Array.from({length: 12}).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <Node key={i} x={460 + Math.cos(a) * 410} y={460 + Math.sin(a) * 410} r={i % 3 === 0 ? 5 : 3} color={i % 2 ? C.violet : C.cyan} opacity={0.75} />;
        })}
      </svg>
      <div style={{textAlign: 'center', zIndex: 2}}>
        <div style={{...smallCaps(C.cyan), fontSize: 17, letterSpacing: 5}}>A SHORT HISTORY OF THE FUTURE</div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 124,
            fontWeight: 700,
            letterSpacing: -5,
            lineHeight: 1.02,
            color: C.text,
            marginTop: 22,
            textShadow: `0 12px 70px ${rgba(C.cyan, 0.28)}`,
          }}
        >
          FIVE YEARS
          <br />
          <span style={{color: C.cyan}}>OF AI</span>
        </div>
        <div style={{fontFamily: SANS, fontSize: 32, color: C.muted, marginTop: 26, letterSpacing: 0.4}}>
          From autocomplete to agents
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 14, marginTop: 36}}>
          {['2021', '2022', '2023', '2024', '2025', '2026'].map((year) => (
            <Chip key={year} accent={C.cyan} style={{fontSize: 15, padding: '8px 14px'}}>
              {year}
            </Chip>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
