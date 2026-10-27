import {Easing, interpolate} from 'remotion';
import type {CSSProperties} from 'react';

export const C = {
  bg: '#050813',
  bg2: '#090E1E',
  panel: 'rgba(13, 20, 39, 0.78)',
  panelSoft: 'rgba(16, 25, 48, 0.55)',
  border: 'rgba(153, 185, 255, 0.16)',
  borderStrong: 'rgba(178, 205, 255, 0.30)',
  text: '#F2F7FF',
  muted: '#9CAAC5',
  dim: '#66769A',
  cyan: '#69E6FF',
  violet: '#AC8CFF',
  mint: '#7EFFC4',
  lime: '#CBFF71',
  amber: '#FFC978',
  coral: '#FF8FA3',
  white: '#FFFFFF',
} as const;

export const ACCENTS: Record<string, string> = {
  cyan: C.cyan,
  violet: C.violet,
  mint: C.mint,
  lime: C.lime,
  amber: C.amber,
  coral: C.coral,
};

export const accentOf = (name: string): string => ACCENTS[name] ?? C.cyan;

export const SANS = "'Inter', 'DejaVu Sans', Arial, sans-serif";
export const DISPLAY = "'Space Grotesk', 'Inter', 'DejaVu Sans', sans-serif";

export const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

/** Interpolate with clamped extrapolation — safe for frame-driven animation. */
export const anim = (
  frame: number,
  input: number[],
  output: number[],
  easing = easeOut,
): number =>
  interpolate(frame, input, output, {
    ...clamp,
    easing,
  });

export const rgba = (hex: string, alpha: number): string => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const n = Number.parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/** Staggered entrance used by most scene elements. */
export const rise = (frame: number, delay: number, distance = 22): CSSProperties => ({
  opacity: anim(frame, [delay, delay + 16], [0, 1]),
  transform: `translateY(${anim(frame, [delay, delay + 18], [distance, 0])}px)`,
});

export const panelStyle = (accent: string, extra?: CSSProperties): CSSProperties => ({
  backgroundColor: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 24,
  boxShadow: `0 24px 80px rgba(0, 0, 0, 0.35), inset 0 1px 0 ${rgba(accent, 0.08)}`,
  ...extra,
});

export const labelStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 2.6,
  textTransform: 'uppercase',
  color: C.muted,
};

export const smallCaps = (color: string = C.muted): CSSProperties => ({
  ...labelStyle,
  color,
  letterSpacing: 2.2,
});
