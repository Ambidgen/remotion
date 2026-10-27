import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Local fonts are bundled in public/fonts, so the video renders offline.
// loadFont() delays each frame until the faces are ready — no FOUT in renders.
void loadFont({
  family: 'Inter',
  url: staticFile('fonts/Inter-400.woff2'),
  weight: '400',
  format: 'woff2',
});
void loadFont({
  family: 'Inter',
  url: staticFile('fonts/Inter-600.woff2'),
  weight: '600',
  format: 'woff2',
});
void loadFont({
  family: 'Inter',
  url: staticFile('fonts/Inter-700.woff2'),
  weight: '700',
  format: 'woff2',
});
void loadFont({
  family: 'Space Grotesk',
  url: staticFile('fonts/SpaceGrotesk-500.woff2'),
  weight: '500',
  format: 'woff2',
});
void loadFont({
  family: 'Space Grotesk',
  url: staticFile('fonts/SpaceGrotesk-700.woff2'),
  weight: '700',
  format: 'woff2',
});
