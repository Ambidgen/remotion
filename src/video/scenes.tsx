import React from 'react';
import {AbsoluteFill} from 'remotion';
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
import {Chip, Glyph, Node, Panel, SceneFrame, TitleCard, type GlyphName} from './ui';
import {VISUAL_OVERLAP, type Scene} from './timeline';

type VisualProps = {
  scene: Scene;
  frame: number;
};

const MONO = "'DejaVu Sans Mono', 'SFMono-Regular', Consolas, monospace";

const SectionTitle: React.FC<{children: React.ReactNode; accent: string; right?: React.ReactNode}> = ({
  children,
  accent,
  right,
}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22}}>
    <div style={{...smallCaps(accent), fontSize: 14}}>{children}</div>
    {right ? <div style={{fontFamily: SANS, fontSize: 14, color: C.dim, letterSpacing: 1.5}}>{right}</div> : null}
  </div>
);

const Bar: React.FC<{
  label: string;
  value: number;
  accent: string;
  frame: number;
  delay: number;
  note?: string;
}> = ({label, value, accent, frame, delay, note}) => (
  <div style={{marginBottom: 20, ...rise(frame, delay, 12)}}>
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 9}}>
      <span style={{fontFamily: SANS, fontSize: 19, fontWeight: 600, color: C.text}}>{label}</span>
      <span style={{fontFamily: MONO, fontSize: 15, color: accent}}>{note ?? `${Math.round(value * 100)}%`}</span>
    </div>
    <div style={{height: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
      <div
        style={{
          width: `${Math.max(2, value * 100)}%`,
          height: '100%',
          borderRadius: 8,
          background: `linear-gradient(90deg, ${rgba(accent, 0.45)}, ${accent})`,
          boxShadow: `0 0 18px ${rgba(accent, 0.5)}`,
        }}
      />
    </div>
  </div>
);

const TinyToken: React.FC<{children: React.ReactNode; color: string; active?: boolean}> = ({
  children,
  color,
  active = false,
}) => (
  <div
    style={{
      padding: '8px 13px',
      borderRadius: 9,
      fontFamily: MONO,
      fontSize: 16,
      color: active ? C.bg : color,
      backgroundColor: active ? color : rgba(color, 0.1),
      border: `1px solid ${rgba(color, active ? 0.9 : 0.3)}`,
      whiteSpace: 'nowrap',
      transition: 'none',
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* 01 — Origins: next-token prediction                                */
/* ------------------------------------------------------------------ */

const Origins: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);
  const typedCount = Math.floor(anim(frame, [86, 138], [0, 6]));
  const typed = 'Paris.'.slice(0, typedCount);
  const cursor = frame % 26 < 13;
  const nodes = Array.from({length: 5}, (_, col) =>
    Array.from({length: 4}, (_, row) => ({x: 80 + col * 135, y: 90 + row * 84, col, row})),
  ).flat();

  return (
    <>
      <SceneFrame scene={scene} frame={frame} fadeIn={50}>
        <div style={{display: 'flex', gap: 30, height: '100%'}}>
          <Panel accent={accent} style={{width: 780, padding: 34, display: 'flex', flexDirection: 'column'}}>
            <SectionTitle accent={accent} right="MODEL OUTPUT">PROMPT → COMPLETION</SectionTitle>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 33,
                lineHeight: 1.6,
                color: C.text,
                backgroundColor: 'rgba(3,8,20,0.68)',
                border: `1px solid ${rgba(accent, 0.18)}`,
                borderRadius: 16,
                padding: '30px 28px',
                minHeight: 150,
              }}
            >
              <div style={{color: C.dim, fontSize: 20, marginBottom: 14}}>{'> prompt'}</div>
              <div>
                The capital of France is{' '}
                <span style={{color: accent}}>{typed}</span>
                <span style={{opacity: cursor ? 1 : 0.15, color: accent}}>▍</span>
              </div>
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap'}}>
              {['predict', 'one', 'token', 'at', 'a', 'time'].map((word, i) => (
                <div key={word} style={{...rise(frame, 66 + i * 7, 8)}}>
                  <TinyToken color={accent} active={frame > 120 + i * 10 && frame < 145 + i * 10}>
                    {word}
                  </TinyToken>
                </div>
              ))}
            </div>
            <div style={{marginTop: 28, ...rise(frame, 112, 12)}}>
              <div style={{...smallCaps(C.muted), fontSize: 12, marginBottom: 12}}>NEXT TOKEN PROBABILITIES</div>
              {([['Paris', 0.62], ['Lyon', 0.13], ['France', 0.08]] as [string, number][]).map(([word, p], i) => (
                <div key={word} style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9}}>
                  <span style={{width: 72, fontFamily: MONO, fontSize: 14, color: i === 0 ? accent : C.muted}}>{word}</span>
                  <div style={{flex: 1, height: 8, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.06)'}}>
                    <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 5, backgroundColor: i === 0 ? accent : rgba(accent, 0.3)}} />
                  </div>
                  <span style={{fontFamily: MONO, fontSize: 13, color: C.dim, width: 38, textAlign: 'right'}}>{p.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap'}}>
              <Chip accent={accent} filled>text in → text out</Chip>
              <Chip accent={C.violet}>few-shot prompts</Chip>
              <Chip accent={C.amber}>static knowledge</Chip>
            </div>
          </Panel>

          <Panel accent={accent} style={{flex: 1, padding: 34, position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', right: 24, top: 12, fontFamily: DISPLAY, fontSize: 160, fontWeight: 700, color: rgba(accent, 0.06)}}>
              2021
            </div>
            <SectionTitle accent={accent} right="P (next | context)">A VERY GOOD GUESSING MACHINE</SectionTitle>
            <svg width="100%" height="340" viewBox="0 0 720 340">
              {nodes.map((node, i) =>
                node.col < 4
                  ? [0, 1, 2, 3].map((nextRow) => {
                      const to = nodes.find((n) => n.col === node.col + 1 && n.row === nextRow);
                      if (!to) return null;
                      const wave = 0.5 + 0.5 * Math.sin(frame / 13 + i * 0.7 + nextRow);
                      return (
                        <line
                          key={`${i}-${nextRow}`}
                          x1={node.x}
                          y1={node.y}
                          x2={to.x}
                          y2={to.y}
                          stroke={nextRow % 2 ? C.violet : accent}
                          strokeWidth="1"
                          opacity={0.06 + wave * 0.18}
                        />
                      );
                    })
                  : null,
              )}
              {nodes.map((node, i) => (
                <Node
                  key={i}
                  x={node.x}
                  y={node.y}
                  r={3.5 + 1.2 * (0.5 + 0.5 * Math.sin(frame / 11 + i * 0.9))}
                  color={node.col === 4 ? C.lime : node.col % 2 ? C.violet : accent}
                  opacity={0.55 + 0.35 * (0.5 + 0.5 * Math.sin(frame / 11 + i * 0.9))}
                  glow={10}
                />
              ))}
              <text x="80" y="34" fill={C.dim} fontFamily={SANS} fontSize="13" letterSpacing="2">INPUT TOKENS</text>
              <text x="570" y="34" fill={C.dim} fontFamily={SANS} fontSize="13" letterSpacing="2">OUTPUT</text>
            </svg>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}>
              <span style={{...smallCaps(C.muted), fontSize: 13}}>IMPRESSIVE · BRITTLE · HARD TO STEER</span>
              <Chip accent={C.lime}>next token →</Chip>
            </div>
          </Panel>
        </div>
      </SceneFrame>
      <TitleCard frame={frame} />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 02 — Scale: the training loop                                       */
/* ------------------------------------------------------------------ */

const Scale: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);
  const loop = Math.floor((frame / 28) % 4);
  const steps = ['DATA', 'TRANSFORMER', 'PROBABILITIES', 'NEXT TOKEN'];
  const stageProgress = anim(frame, [20, 160], [0, 1]);

  return (
    <SceneFrame scene={scene} frame={frame}>
      <div style={{display: 'flex', gap: 30, height: '100%'}}>
        <Panel accent={accent} style={{width: 800, padding: 34}}>
          <SectionTitle accent={accent} right="× trillions of tokens">THE TRAINING LOOP</SectionTitle>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 24}}>
            {steps.map((step, i) => (
              <React.Fragment key={step}>
                <div
                  style={{
                    ...rise(frame, 14 + i * 12, 16),
                    width: 150,
                    height: 132,
                    borderRadius: 18,
                    border: `1px solid ${rgba(loop === i ? accent : C.border, loop === i ? 0.8 : 0.3)}`,
                    backgroundColor: loop === i ? rgba(accent, 0.13) : 'rgba(8,14,29,0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: loop === i ? `0 0 32px ${rgba(accent, 0.2)}` : 'none',
                  }}
                >
                  <Glyph name={(['doc', 'brain', 'wave', 'spark'] as GlyphName[])[i]} color={loop === i ? accent : C.muted} size={28} />
                  <span style={{fontFamily: SANS, fontSize: 14, fontWeight: 700, color: loop === i ? C.text : C.muted, letterSpacing: 1.2, textAlign: 'center'}}>{step}</span>
                </div>
                {i < steps.length - 1 ? (
                  <div style={{color: loop >= i ? accent : C.dim, fontSize: 26, ...rise(frame, 18 + i * 12, 8)}}>→</div>
                ) : null}
              </React.Fragment>
            ))}
          </div>
          <div style={{marginTop: 34, display: 'flex', justifyContent: 'center'}}>
            <svg width="640" height="86" viewBox="0 0 640 86">
              <path
                d="M 30 26 C 170 82, 470 82, 610 26"
                fill="none"
                stroke={rgba(accent, 0.5)}
                strokeWidth="2"
                strokeDasharray="7 9"
                strokeDashoffset={-frame * 1.4}
              />
              <path d="m 602 20 12 6-9 9" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              <text x="320" y="79" textAnchor="middle" fill={C.muted} fontFamily={SANS} fontSize="15" letterSpacing="2">
                FEED THE ANSWER BACK IN. REPEAT.
              </text>
            </svg>
          </div>
          <div style={{display: 'flex', gap: 8, marginTop: 6, ...rise(frame, 78, 10)}}>
            {['the', 'cat', 'sat', 'on', 'the', 'mat'].map((word, i) => (
              <TinyToken key={`${word}-${i}`} color={accent} active={Math.floor(frame / 8) % 6 === i}>
                {word}
              </TinyToken>
            ))}
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap'}}>
            <Chip accent={accent} filled>few-shot learning</Chip>
            <Chip accent={C.cyan}>emergent abilities</Chip>
            <Chip accent={C.mint}>foundation models</Chip>
          </div>
        </Panel>

        <Panel accent={accent} style={{flex: 1, padding: 34}}>
          <SectionTitle accent={accent} right="2020 → 2022">THREE DIALS TURNED UP</SectionTitle>
          <div style={{marginTop: 32}}>
            <Bar label="Training data" value={anim(frame, [24, 130], [0.2, 0.97])} accent={C.cyan} frame={frame} delay={18} note="× 100+" />
            <Bar label="Parameters" value={anim(frame, [38, 145], [0.16, 0.9])} accent={accent} frame={frame} delay={30} note="× 10+" />
            <Bar label="Compute" value={anim(frame, [52, 160], [0.12, 0.86])} accent={C.mint} frame={frame} delay={42} note="× 100+" />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 18}}>
            <div style={{...smallCaps(C.muted), fontSize: 13, whiteSpace: 'nowrap'}}>LOSS ↓</div>
            <svg width="100%" height="76" viewBox="0 0 500 76">
              <path d="M 4 8 C 120 20, 180 46, 250 56 S 380 68, 496 70" fill="none" stroke={rgba(C.cyan, 0.25)} strokeWidth="2" />
              <path
                d="M 4 8 C 120 20, 180 46, 250 56 S 380 68, 496 70"
                fill="none"
                stroke={C.mint}
                strokeWidth="3"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - stageProgress}
              />
            </svg>
          </div>
          <div style={{fontFamily: SANS, fontSize: 20, color: C.muted, marginTop: 16}}>
            Prediction at scale started to look like <span style={{color: C.text}}>general capability.</span>
          </div>
        </Panel>
      </div>
    </SceneFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 03 — Conversation + diffusion                                      */
/* ------------------------------------------------------------------ */

const rgbMix = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const rgbString = (c: [number, number, number]) =>
  `rgb(${Math.round(Math.max(0, Math.min(255, c[0])))}, ${Math.round(Math.max(0, Math.min(255, c[1])))}, ${Math.round(Math.max(0, Math.min(255, c[2])))})`;

const targetPixel = (row: number, col: number, rows: number, cols: number): [number, number, number] => {
  const nx = col / (cols - 1);
  const ny = row / (rows - 1);
  if (ny < 0.62) {
    const sky = rgbMix([36, 44, 94], [255, 158, 103], ny / 0.62);
    const sunDist = Math.hypot((nx - 0.72) * 1.45, ny - 0.3);
    return sunDist < 0.15 ? [255, 235, 170] : sky;
  }
  const ridge = 0.56 + 0.16 * Math.abs(Math.sin(nx * Math.PI * 1.7));
  if (ny > ridge) return ny > 0.8 ? [9, 18, 40] : [24, 37, 72];
  return [58, 68, 105];
};

const DenoiseGrid: React.FC<{frame: number; accent: string}> = ({frame, accent}) => {
  const rows = 9;
  const cols = 16;
  const denoise = anim(frame, [22, 210], [0.03, 1], easeInOut);
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const seed = Math.sin(r * 127.1 + c * 311.7) * 43758.5453;
      const n = seed - Math.floor(seed);
      const noise: [number, number, number] = [30 + n * 150, 35 + ((n * 7) % 1) * 140, 55 + ((n * 13) % 1) * 150];
      const target = targetPixel(r, c, rows, cols);
      const reveal = Math.max(0, Math.min(1, denoise * 1.35 - (r / rows) * 0.18));
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            width: '100%',
            height: '100%',
            minHeight: 0,
            borderRadius: 2,
            backgroundColor: rgbString(rgbMix(noise, target, reveal)),
            boxShadow: reveal > 0.7 ? `inset 0 0 0 0.5px ${rgba(accent, 0.04)}` : 'none',
          }}
        />,
      );
    }
  }
  const step = Math.min(8, Math.floor(anim(frame, [22, 210], [0, 8])) + 1);
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: 3,
          height: 292,
          padding: 10,
          boxSizing: 'border-box',
          borderRadius: 14,
          backgroundColor: 'rgba(3,8,20,0.75)',
          border: `1px solid ${rgba(accent, 0.2)}`,
        }}
      >
        {cells}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 16}}>
        <span style={{...smallCaps(C.muted), fontSize: 12}}>NOISE → IMAGE</span>
        <div style={{display: 'flex', gap: 5, flex: 1}}>
          {Array.from({length: 8}).map((_, i) => (
            <div
              key={i}
              style={{
                height: 8,
                flex: 1,
                borderRadius: 4,
                backgroundColor: i < step ? accent : 'rgba(255,255,255,0.09)',
              }}
            />
          ))}
        </div>
        <span style={{fontFamily: MONO, fontSize: 14, color: accent}}>{String(step).padStart(2, '0')} / 08</span>
      </div>
    </div>
  );
};

const Conversation: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);
  const lineWidths = [anim(frame, [34, 80], [0, 100]), anim(frame, [58, 106], [0, 88]), anim(frame, [82, 130], [0, 68])];

  return (
    <SceneFrame scene={scene} frame={frame}>
      <div style={{display: 'flex', gap: 30, height: '100%'}}>
        <Panel accent={accent} style={{width: 790, padding: 34}}>
          <SectionTitle accent={accent} right="NOV 2022">INSTRUCTION TUNING + HUMAN FEEDBACK</SectionTitle>
          <div
            style={{
              borderRadius: 18,
              border: `1px solid ${rgba(accent, 0.2)}`,
              backgroundColor: 'rgba(4,10,23,0.72)',
              padding: 26,
              minHeight: 350,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
              <Glyph name="chat" color={accent} size={20} />
              <span style={{...smallCaps(accent), fontSize: 13}}>CHAT</span>
              <span style={{marginLeft: 'auto', color: C.dim, fontSize: 14}}>● ● ●</span>
            </div>
            <div style={{alignSelf: 'flex-end', maxWidth: 420, ...rise(frame, 16, 12)}}>
              <div style={{padding: '16px 20px', borderRadius: '18px 18px 4px 18px', backgroundColor: rgba(C.violet, 0.2), border: `1px solid ${rgba(C.violet, 0.35)}`, fontFamily: SANS, fontSize: 22, color: C.text}}>
                Explain photosynthesis like I’m five.
              </div>
            </div>
            <div style={{alignSelf: 'flex-start', width: 500, ...rise(frame, 28, 12)}}>
              <div style={{padding: '18px 20px', borderRadius: '18px 18px 18px 4px', backgroundColor: rgba(accent, 0.08), border: `1px solid ${rgba(accent, 0.24)}`}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14}}>
                  <Glyph name="spark" color={accent} size={16} />
                  <span style={{...smallCaps(accent), fontSize: 12}}>ASSISTANT</span>
                </div>
                {lineWidths.map((width, i) => (
                  <div key={i} style={{height: 11, width: `${width}%`, borderRadius: 6, backgroundColor: i === 2 ? rgba(accent, 0.5) : rgba(C.text, 0.42), marginBottom: 12}} />
                ))}
                <div style={{fontFamily: SANS, fontSize: 18, color: C.muted, marginTop: 4}}>Plants use sunlight to make their food. ☀</div>
              </div>
            </div>
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap'}}>
            <Chip accent={accent} filled>follow instructions</Chip>
            <Chip accent={C.violet}>conversational memory</Chip>
            <Chip accent={C.cyan}>anyone can use it</Chip>
          </div>
        </Panel>

        <Panel accent={accent} style={{flex: 1, padding: 34}}>
          <SectionTitle accent={accent} right="DIFFUSION">PROMPT: “A SUNRISE OVER MOUNTAINS”</SectionTitle>
          <DenoiseGrid frame={frame} accent={accent} />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22}}>
            <span style={{fontFamily: SANS, fontSize: 19, color: C.muted}}>Text becomes pixels. AI becomes visible.</span>
            <Chip accent={C.amber}>text → image</Chip>
          </div>
        </Panel>
      </div>
    </SceneFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 04 — Multimodality, open weights and tools                         */
/* ------------------------------------------------------------------ */

const SENSE_CARDS: {name: string; icon: GlyphName; color: string; x: number; y: number}[] = [
  {name: 'TEXT', icon: 'text', color: C.cyan, x: 90, y: 60},
  {name: 'IMAGES', icon: 'image', color: C.amber, x: 90, y: 320},
  {name: 'CODE', icon: 'code', color: C.mint, x: 705, y: 14},
  {name: 'SEARCH', icon: 'search', color: C.violet, x: 1320, y: 60},
  {name: 'YOUR DOCS', icon: 'doc', color: C.coral, x: 1320, y: 320},
];

const Senses: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);
  const hubX = 864;
  const hubY = 263;

  return (
    <SceneFrame scene={scene} frame={frame}>
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
        <svg width="1728" height="526" viewBox="0 0 1728 526" style={{position: 'absolute', inset: 0}}>
          <circle cx={hubX} cy={hubY} r="184" fill="none" stroke={rgba(accent, 0.18)} strokeWidth="1.5" strokeDasharray="5 12" />
          <circle cx={hubX} cy={hubY} r="128" fill="none" stroke={rgba(accent, 0.12)} strokeWidth="1" />
          {SENSE_CARDS.map((card, i) => {
            const x = card.x + 160;
            const y = card.y + 55;
            const active = frame > 26 + i * 14;
            return (
              <g key={card.name}>
                <line
                  x1={hubX}
                  y1={hubY}
                  x2={x}
                  y2={y}
                  stroke={card.color}
                  strokeWidth="2"
                  strokeDasharray="7 10"
                  strokeDashoffset={-frame * 1.1}
                  opacity={active ? 0.55 : 0.1}
                />
                <Node x={x} y={y} r={4} color={card.color} opacity={active ? 1 : 0.3} />
              </g>
            );
          })}
        </svg>

        <div
          style={{
            position: 'absolute',
            left: hubX - 108,
            top: hubY - 108,
            width: 216,
            height: 216,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(accent, 0.22)} 0%, rgba(8,14,30,0.9) 72%)`,
            border: `2px solid ${rgba(accent, 0.65)}`,
            boxShadow: `0 0 70px ${rgba(accent, 0.28)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <Glyph name="brain" color={accent} size={44} strokeWidth={1.4} />
          <span style={{fontFamily: DISPLAY, fontSize: 42, fontWeight: 700, color: C.text}}>LLM</span>
          <span style={{...smallCaps(accent), fontSize: 11}}>THE CORE</span>
        </div>

        {SENSE_CARDS.map((card, i) => {
          const active = frame > 26 + i * 14;
          return (
            <div
              key={card.name}
              style={{
                position: 'absolute',
                left: card.x,
                top: card.y,
                width: 320,
                height: 110,
                ...panelStyle(card.color, {
                  padding: '22px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  border: `1px solid ${rgba(card.color, active ? 0.55 : 0.2)}`,
                  boxShadow: active ? `0 0 40px ${rgba(card.color, 0.18)}` : 'none',
                }),
                ...rise(frame, 18 + i * 14, 14),
              }}
            >
              <div style={{width: 54, height: 54, borderRadius: 16, backgroundColor: rgba(card.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Glyph name={card.icon} color={card.color} size={27} />
              </div>
              <div>
                <div style={{fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: active ? C.text : C.muted, letterSpacing: 0.6}}>{card.name}</div>
                <div style={{fontFamily: SANS, fontSize: 15, color: C.dim, marginTop: 5}}>{active ? 'connected' : 'connecting…'}</div>
              </div>
            </div>
          );
        })}

        <div style={{position: 'absolute', left: 470, bottom: 6, display: 'flex', gap: 12, ...rise(frame, 110, 12)}}>
          <Chip accent={C.amber} filled>GPT-4 · image input</Chip>
          <Chip accent={C.cyan}>Llama · open weights</Chip>
          <Chip accent={C.violet}>retrieval + tools</Chip>
        </div>
      </div>
    </SceneFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 05 — Reasoning, long context, voice and video                      */
/* ------------------------------------------------------------------ */

const STEPS = ['Read the problem', 'Draft a plan', 'Check the work', 'Commit to an answer'];

const Reasoning: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);
  const chainProgress = anim(frame, [18, 168], [0, 1]);
  const context = anim(frame, [28, 190], [0.06, 1]);
  const wavePhase = frame / 9;

  return (
    <SceneFrame scene={scene} frame={frame}>
      <div style={{display: 'flex', gap: 30, height: '100%'}}>
        <Panel accent={accent} style={{width: 760, padding: 34}}>
          <SectionTitle accent={accent} right="TEST-TIME COMPUTE">THINK BEFORE ANSWERING</SectionTitle>
          <div style={{position: 'relative', paddingLeft: 18, marginTop: 18}}>
            <div style={{position: 'absolute', left: 18, top: 12, bottom: 12, width: 2, backgroundColor: 'rgba(255,255,255,0.09)'}} />
            <div style={{position: 'absolute', left: 18, top: 12, width: 2, height: `${Math.max(0, (chainProgress * 100 - 8))}%`, backgroundColor: accent, boxShadow: `0 0 14px ${rgba(accent, 0.7)}`}} />
            {STEPS.map((step, i) => {
              const done = frame > 28 + i * 34;
              return (
                <div key={step} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20, ...rise(frame, 12 + i * 14, 12)}}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      border: `2px solid ${rgba(done ? accent : C.dim, done ? 0.9 : 0.4)}`,
                      backgroundColor: done ? rgba(accent, 0.16) : 'rgba(8,14,29,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: done ? accent : C.dim,
                      fontFamily: MONO,
                      fontSize: 15,
                      zIndex: 1,
                    }}
                  >
                    {done ? <Glyph name="check" color={accent} size={20} /> : `0${i + 1}`}
                  </div>
                  <span style={{fontFamily: SANS, fontSize: 24, fontWeight: 600, color: done ? C.text : C.muted}}>{step}</span>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 16}}>
            <Bar label="More thinking time" value={chainProgress} accent={accent} frame={frame} delay={64} note="accuracy ↑" />
          </div>
          <Chip accent={C.mint}>2024 · reasoning models</Chip>
        </Panel>

        <Panel accent={accent} style={{flex: 1, padding: 34}}>
          <SectionTitle accent={accent} right="4K → 128K → 1M+ TOKENS">THE CONTEXT WINDOW EXPLODES</SectionTitle>
          <div style={{height: 92, borderRadius: 16, border: `1px solid ${rgba(accent, 0.2)}`, backgroundColor: 'rgba(4,10,23,0.7)', padding: 16, overflow: 'hidden'}}>
            <div style={{display: 'flex', gap: 5, height: 22}}>
              {Array.from({length: 28}).map((_, i) => (
                <div key={i} style={{flex: 1, borderRadius: 3, backgroundColor: i / 28 < context ? rgba(accent, 0.24 + (i % 3) * 0.08) : 'rgba(255,255,255,0.045)'}} />
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: MONO, fontSize: 13, color: C.dim}}>
              <span>ONE PROMPT</span>
              <span>WHOLE CODEBASES · BOOKS · TRANSCRIPTS</span>
            </div>
          </div>

          <div style={{display: 'flex', gap: 18, marginTop: 24}}>
            <div style={{flex: 1, borderRadius: 18, border: `1px solid ${rgba(C.cyan, 0.2)}`, backgroundColor: 'rgba(4,10,23,0.62)', padding: 18}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12}}>
                <Glyph name="wave" color={C.cyan} size={20} />
                <span style={{...smallCaps(C.cyan), fontSize: 12}}>REAL-TIME VOICE</span>
              </div>
              <svg width="100%" height="52" viewBox="0 0 320 52">
                <path
                  d={`M 0 26 ${Array.from({length: 33}).map((_, i) => `L ${i * 10} ${26 + Math.sin(i * 0.85 + wavePhase) * (8 + 8 * Math.sin(i * 0.22 + wavePhase / 2))}`).join(' ')}`}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth="2"
                  opacity="0.85"
                />
              </svg>
            </div>
            <div style={{flex: 1, borderRadius: 18, border: `1px solid ${rgba(C.violet, 0.2)}`, backgroundColor: 'rgba(4,10,23,0.62)', padding: 18}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12}}>
                <Glyph name="play" color={C.violet} size={18} />
                <span style={{...smallCaps(C.violet), fontSize: 12}}>GENERATED VIDEO</span>
              </div>
              <div style={{display: 'flex', gap: 6}}>
                {Array.from({length: 5}).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: 5,
                      background: `linear-gradient(${140 + i * 14}deg, ${rgba(C.violet, 0.55 - i * 0.07)}, ${rgba(C.cyan, 0.18 + i * 0.08)})`,
                      border: `1px solid ${rgba(C.violet, 0.3)}`,
                      transform: `translateY(${Math.sin(frame / 18 + i) * 2}px)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, ...rise(frame, 112, 12)}}>
            <span style={{fontFamily: SANS, fontSize: 20, color: C.muted}}>A second scaling axis: <span style={{color: C.text}}>compute while answering.</span></span>
            <Chip accent={accent} filled>step by step</Chip>
          </div>
        </Panel>
      </div>
    </SceneFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 06 — Agents and the new hard questions                             */
/* ------------------------------------------------------------------ */

const AGENT_STEPS = [
  {label: 'PLAN', color: C.cyan, x: 0, y: -126},
  {label: 'ACT', color: C.violet, x: 142, y: 0},
  {label: 'OBSERVE', color: C.mint, x: 0, y: 126},
  {label: 'REFINE', color: C.amber, x: -142, y: 0},
];

const MiniWindow: React.FC<{title: string; icon: GlyphName; color: string; frame: number; delay: number; lines: string[]}> = ({
  title,
  icon,
  color,
  frame,
  delay,
  lines,
}) => (
  <div style={{borderRadius: 14, border: `1px solid ${rgba(color, 0.22)}`, backgroundColor: 'rgba(4,10,23,0.68)', padding: '14px 16px', ...rise(frame, delay, 12)}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10}}>
      <Glyph name={icon} color={color} size={16} />
      <span style={{...smallCaps(color), fontSize: 11}}>{title}</span>
      <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 12, color: frame > delay + 46 ? C.mint : C.dim}}>{frame > delay + 46 ? 'DONE' : 'RUNNING'}</span>
    </div>
    {lines.map((line, i) => (
      <div key={line} style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 5, opacity: frame > delay + 12 + i * 11 ? 1 : 0.22}}>
        <span style={{color}}>›</span> {line}
      </div>
    ))}
  </div>
);

const Agents: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);
  const active = Math.floor((frame / 38) % 4);
  const taskDone = frame > 230;

  return (
    <SceneFrame scene={scene} frame={frame}>
      <div style={{display: 'flex', gap: 30, height: '100%'}}>
        <Panel accent={accent} style={{width: 720, padding: 34, display: 'flex', flexDirection: 'column'}}>
          <SectionTitle accent={accent} right="PLAN → ACT → OBSERVE">THE AGENT LOOP</SectionTitle>
          <div style={{position: 'relative', width: 430, height: 330, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="430" height="330" viewBox="0 0 430 330" style={{position: 'absolute', left: 0, top: 0}}>
              <circle
                cx="215"
                cy="165"
                r="128"
                fill="none"
                stroke={rgba(accent, 0.35)}
                strokeWidth="2"
                strokeDasharray="10 12"
                strokeDashoffset={-frame * 1.5}
              />
              <circle cx="215" cy="165" r="92" fill={rgba(accent, 0.05)} stroke={rgba(accent, 0.18)} strokeWidth="1" />
              {AGENT_STEPS.map((step, i) => (
                <line
                  key={step.label}
                  x1="215"
                  y1="165"
                  x2={215 + step.x}
                  y2={165 + step.y}
                  stroke={step.color}
                  strokeWidth="1.5"
                  opacity={active === i ? 0.7 : 0.16}
                />
              ))}
            </svg>
            <div style={{width: 132, height: 132, borderRadius: '50%', backgroundColor: rgba(accent, 0.12), border: `2px solid ${rgba(accent, 0.6)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 2}}>
              <Glyph name="spark" color={accent} size={30} />
              <span style={{fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, color: C.text}}>AGENT</span>
            </div>
            {AGENT_STEPS.map((step, i) => (
              <div
                key={step.label}
                style={{
                  position: 'absolute',
                  left: 215 + step.x - 56,
                  top: 165 + step.y - 24,
                  width: 112,
                  height: 48,
                  borderRadius: 12,
                  border: `1px solid ${rgba(step.color, active === i ? 0.8 : 0.28)}`,
                  backgroundColor: active === i ? rgba(step.color, 0.18) : 'rgba(6,12,26,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: SANS,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  color: active === i ? C.text : C.muted,
                  boxShadow: active === i ? `0 0 28px ${rgba(step.color, 0.25)}` : 'none',
                }}
              >
                {step.label}
              </div>
            ))}
          </div>
          <div style={{marginTop: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap'}}>
            <Chip accent={C.cyan} filled>browser</Chip>
            <Chip accent={C.violet}>code interpreter</Chip>
            <Chip accent={C.mint}>software tools</Chip>
          </div>
        </Panel>

        <Panel accent={accent} style={{flex: 1, padding: 34}}>
          <SectionTitle accent={accent} right={taskDone ? 'TASK COMPLETE' : 'WORKING…'}>LONG-RUNNING WORK</SectionTitle>
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            <MiniWindow title="BROWSER" icon="search" color={C.cyan} frame={frame} delay={18} lines={['search 12 sources', 'read and compare']} />
            <MiniWindow title="TERMINAL" icon="code" color={C.violet} frame={frame} delay={48} lines={['write analysis.py', 'run and plot results']} />
            <MiniWindow title="DOCUMENT" icon="doc" color={C.mint} frame={frame} delay={78} lines={['assemble report', 'cite the sources']} />
          </div>
          <div style={{marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', ...rise(frame, 145, 12)}}>
            {['reliability', 'evals', 'security', 'cost'].map((item, i) => (
              <Chip key={item} accent={i % 2 ? C.amber : C.coral} style={{fontSize: 15, padding: '8px 13px'}}>
                <Glyph name="shield" color={i % 2 ? C.amber : C.coral} size={15} />
                {item}
              </Chip>
            ))}
          </div>
        </Panel>
      </div>
    </SceneFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 07 — The compounding stack                                         */
/* ------------------------------------------------------------------ */

const LAYERS: {label: string; detail: string; icon: GlyphName; color: string}[] = [
  {label: 'TOOLS', detail: 'act in the world', icon: 'link', color: C.cyan},
  {label: 'REASONING', detail: 'think longer', icon: 'brain', color: C.violet},
  {label: 'MULTIMODALITY', detail: 'see and hear', icon: 'eye', color: C.mint},
  {label: 'ALIGNMENT', detail: 'follow intent', icon: 'chat', color: C.amber},
  {label: 'SCALE', detail: 'the foundation', icon: 'spark', color: C.lime},
];

const Compounding: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);
  const curve = anim(frame, [14, 190], [0, 1], easeInOut);
  const milestones = [
    {x: 70, y: 374, label: '2021'},
    {x: 224, y: 338, label: '2022'},
    {x: 378, y: 274, label: '2023'},
    {x: 532, y: 196, label: '2024'},
    {x: 686, y: 116, label: '2025'},
    {x: 840, y: 46, label: '2026'},
  ];

  return (
    <SceneFrame scene={scene} frame={frame}>
      <div style={{display: 'flex', gap: 30, height: '100%'}}>
        <Panel accent={accent} style={{width: 920, padding: 30}}>
          <SectionTitle accent={accent} right="ILLUSTRATIVE TRAJECTORY">CAPABILITY IS COMPOUNDING</SectionTitle>
          <svg width="100%" height="382" viewBox="0 0 900 420">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={rgba(accent, 0.28)} />
                <stop offset="100%" stopColor={rgba(accent, 0)} />
              </linearGradient>
            </defs>
            {[80, 160, 240, 320, 390].map((y) => (
              <line key={y} x1="70" y1={y} x2="860" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}
            <line x1="70" y1="390" x2="860" y2="390" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="70" y1="20" x2="70" y2="390" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <path
              d="M 70 374 C 150 366, 170 352, 224 338 S 310 300, 378 274 S 470 226, 532 196 S 620 146, 686 116 S 780 68, 840 46 L 840 390 L 70 390 Z"
              fill="url(#area)"
              opacity={curve * 0.85}
            />
            <path
              d="M 70 374 C 150 366, 170 352, 224 338 S 310 300, 378 274 S 470 226, 532 196 S 620 146, 686 116 S 780 68, 840 46"
              fill="none"
              stroke={accent}
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - curve}
              style={{filter: `drop-shadow(0 0 12px ${rgba(accent, 0.55)})`}}
            />
            {milestones.map((m, i) => {
              const visible = curve > i / (milestones.length - 1) - 0.06;
              return (
                <g key={m.label} opacity={visible ? 1 : 0.18}>
                  <Node x={m.x} y={m.y} r={visible ? 7 : 4} color={i % 2 ? C.violet : accent} opacity={visible ? 1 : 0.5} />
                  <text x={m.x} y="413" fill={C.muted} fontFamily={SANS} fontSize="14" textAnchor="middle">{m.label}</text>
                </g>
              );
            })}
            <text x="30" y="210" fill={C.dim} fontFamily={SANS} fontSize="12" letterSpacing="1.5" textAnchor="middle" transform="rotate(-90 30 210)">USEFUL CAPABILITY</text>
          </svg>
        </Panel>

        <Panel accent={accent} style={{flex: 1, padding: 30}}>
          <SectionTitle accent={accent} right="1 + 1 > 2">FIVE LAYERS</SectionTitle>
          <div style={{display: 'flex', flexDirection: 'column-reverse', gap: 10, marginTop: 10}}>
            {LAYERS.map((layer, i) => {
              const delay = 24 + i * 26;
              const visible = frame > delay - 8;
              return (
                <div
                  key={layer.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 16px',
                    borderRadius: 13,
                    border: `1px solid ${rgba(layer.color, visible ? 0.5 : 0.16)}`,
                    backgroundColor: visible ? rgba(layer.color, 0.11) : 'rgba(8,14,29,0.55)',
                    ...rise(frame, delay, 10),
                  }}
                >
                  <div style={{width: 36, height: 36, borderRadius: 10, backgroundColor: rgba(layer.color, 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Glyph name={layer.icon} color={layer.color} size={19} />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: DISPLAY, fontSize: 19, fontWeight: 700, color: visible ? C.text : C.dim, letterSpacing: 0.8}}>{layer.label}</div>
                    <div style={{fontFamily: SANS, fontSize: 14, color: C.dim}}>{layer.detail}</div>
                  </div>
                  <span style={{fontFamily: MONO, fontSize: 13, color: layer.color}}>0{i + 1}</span>
                </div>
              );
            })}
          </div>
          <div style={{...smallCaps(C.muted), fontSize: 12, marginTop: 14, textAlign: 'center'}}>EACH LAYER AMPLIFIES THE OTHERS</div>
        </Panel>
      </div>
    </SceneFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 08 — Where we are in 2026                                          */
/* ------------------------------------------------------------------ */

const CAN = ['Draft and edit', 'Analyze data', 'Write and debug code', 'See, hear and speak', 'Use tools and agents'];
const NEEDS = ['Fact-checking', 'Human judgment', 'Oversight and taste', 'Knowing when to stop'];

const Today: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);

  return (
    <SceneFrame scene={scene} frame={frame}>
      <div style={{display: 'flex', gap: 26, height: '100%', alignItems: 'stretch'}}>
        <Panel accent={C.mint} style={{flex: 1, padding: 32}}>
          <SectionTitle accent={C.mint} right="WHAT CHANGED">IT CAN HELP WITH REAL WORK</SectionTitle>
          {CAN.map((item, i) => (
            <div key={item} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '13px 0', borderBottom: i < CAN.length - 1 ? `1px solid ${C.border}` : 'none', ...rise(frame, 16 + i * 15, 12)}}>
              <div style={{width: 34, height: 34, borderRadius: 10, backgroundColor: rgba(C.mint, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Glyph name="check" color={C.mint} size={20} />
              </div>
              <span style={{fontFamily: SANS, fontSize: 23, color: C.text}}>{item}</span>
            </div>
          ))}
          <div style={{display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap'}}>
            <Chip accent={C.mint} filled>faster</Chip>
            <Chip accent={C.cyan}>cheaper</Chip>
            <Chip accent={C.violet}>open models</Chip>
          </div>
        </Panel>

        <div style={{width: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
          <div
            style={{
              width: 210,
              height: 210,
              borderRadius: '50%',
              border: `1px solid ${rgba(accent, 0.4)}`,
              background: `radial-gradient(circle, ${rgba(accent, 0.18)}, rgba(8,14,30,0.55) 70%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 80px ${rgba(accent, 0.16)}`,
              transform: `scale(${0.96 + Math.sin(frame / 40) * 0.02})`,
            }}
          >
            <span style={{fontFamily: DISPLAY, fontSize: 58, fontWeight: 700, color: C.text}}>2026</span>
            <span style={{...smallCaps(accent), fontSize: 11, marginTop: 6}}>NOW</span>
          </div>
          <div style={{width: 2, height: 58, background: `linear-gradient(180deg, ${accent}, transparent)`}} />
          <Chip accent={C.amber} style={{fontSize: 15}}>
            <Glyph name="shield" color={C.amber} size={16} />
            verify
          </Chip>
        </div>

        <Panel accent={C.amber} style={{flex: 1, padding: 32}}>
          <SectionTitle accent={C.amber} right="WHAT DIDN’T">IT STILL NEEDS US</SectionTitle>
          {NEEDS.map((item, i) => (
            <div key={item} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '17px 0', borderBottom: i < NEEDS.length - 1 ? `1px solid ${C.border}` : 'none', ...rise(frame, 34 + i * 18, 12)}}>
              <div style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: C.amber, boxShadow: `0 0 16px ${rgba(C.amber, 0.65)}`}} />
              <span style={{fontFamily: SANS, fontSize: 23, color: C.text}}>{item}</span>
            </div>
          ))}
          <div style={{marginTop: 22, padding: 18, borderRadius: 14, backgroundColor: rgba(C.amber, 0.08), border: `1px solid ${rgba(C.amber, 0.22)}`, fontFamily: SANS, fontSize: 19, color: C.muted, lineHeight: 1.5, ...rise(frame, 120, 12)}}>
            Hallucinations are still real. Confidence is not the same as correctness.
          </div>
        </Panel>
      </div>
    </SceneFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — Outro: the next five years                                    */
/* ------------------------------------------------------------------ */

const PILLARS: {title: string; icon: GlyphName; color: string; text: string}[] = [
  {title: 'TRUST', icon: 'shield', color: C.cyan, text: 'Know when the system is guessing.'},
  {title: 'VERIFICATION', icon: 'check', color: C.violet, text: 'Check claims against the world.'},
  {title: 'JUDGMENT', icon: 'brain', color: C.mint, text: 'Decide where AI should be used.'},
];

const Outro: React.FC<VisualProps> = ({scene, frame}) => {
  const accent = accentOf(scene.accent);
  const visualLead = scene.id === 1 ? 0 : VISUAL_OVERLAP;
  const outroStart = visualLead + scene.leadFrames + scene.audioFrames + 8;
  const endOpacity = anim(frame, [outroStart, outroStart + 12], [0, 1]);
  const endScale = anim(frame, [outroStart, outroStart + 40], [0.96, 1]);

  return (
    <>
      <SceneFrame scene={scene} frame={frame}>
        <div style={{display: 'flex', gap: 26, height: '100%'}}>
          {PILLARS.map((pillar, i) => (
            <Panel
              key={pillar.title}
              accent={pillar.color}
              style={{
                flex: 1,
                padding: 36,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 20,
                ...rise(frame, 16 + i * 18, 24),
              }}
            >
              <div style={{position: 'absolute', right: 28, top: 24, fontFamily: MONO, fontSize: 14, color: rgba(pillar.color, 0.7)}}>0{i + 1}</div>
              <div style={{width: 72, height: 72, borderRadius: 20, backgroundColor: rgba(pillar.color, 0.13), border: `1px solid ${rgba(pillar.color, 0.3)}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Glyph name={pillar.icon} color={pillar.color} size={36} strokeWidth={1.5} />
              </div>
              <div style={{fontFamily: DISPLAY, fontSize: 40, fontWeight: 700, color: C.text, letterSpacing: -0.8}}>{pillar.title}</div>
              <div style={{fontFamily: SANS, fontSize: 22, color: C.muted, lineHeight: 1.5}}>{pillar.text}</div>
              <div style={{height: 4, width: 64, borderRadius: 4, backgroundColor: pillar.color, boxShadow: `0 0 18px ${rgba(pillar.color, 0.65)}`}} />
            </Panel>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 486, textAlign: 'center', ...rise(frame, 88, 14)}}>
          <span style={{fontFamily: SANS, fontSize: 24, color: C.muted}}>The frontier shifts from raw capability to <span style={{color: C.text}}>dependable, well-governed use.</span></span>
        </div>
      </SceneFrame>

      {endOpacity > 0.001 ? (
        <AbsoluteFill
          style={{
            backgroundColor: rgba(C.bg, endOpacity),
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{textAlign: 'center', opacity: endOpacity, transform: `scale(${endScale})`}}>
            <div style={{...smallCaps(accent), fontSize: 16, letterSpacing: 4.4}}>2021 → 2026</div>
            <div style={{fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, letterSpacing: -2.7, color: C.text, marginTop: 22, lineHeight: 1.1}}>
              From finishing sentences
              <br />
              to <span style={{color: accent}}>helping finish real work.</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: 14, marginTop: 40}}>
              <Chip accent={C.cyan} filled>scale</Chip>
              <Chip accent={C.violet}>reasoning</Chip>
              <Chip accent={C.mint}>multimodality</Chip>
              <Chip accent={C.amber}>agency</Chip>
              <Chip accent={C.coral}>judgment</Chip>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

/* ------------------------------------------------------------------ */

export const SCENE_COMPONENTS: Record<number, React.FC<VisualProps>> = {
  1: Origins,
  2: Scale,
  3: Conversation,
  4: Senses,
  5: Reasoning,
  6: Agents,
  7: Compounding,
  8: Today,
  9: Outro,
};

export const SceneVisual: React.FC<VisualProps> = ({scene, frame}) => {
  const Component = SCENE_COMPONENTS[scene.id];
  return Component ? <Component scene={scene} frame={frame} /> : null;
};
