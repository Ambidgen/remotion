# Arena Agent Mode — Remotion Ad

A 15-second, 1920×1080 code-only motion-graphics spot for Arena.ai Agent Mode. All visuals are built from React, SVG, CSS, and Remotion frame animations; no external image or video assets are used.

## Run

```bash
npm install
npm run dev
```

To render the composition to `out/arena-agent-mode.mp4`:

```bash
npm run render
```

The composition is registered in `src/Root.tsx` and assembled in `src/Compilation.tsx`. The ad is the first 450-frame (15-second at 30 fps) sequence because the repository's starting revision did not contain earlier ads.
