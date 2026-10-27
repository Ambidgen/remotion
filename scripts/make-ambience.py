#!/usr/bin/env python3
"""Generate a soft, 120-second ambient bed with the Python standard library.

The result is intentionally quiet: it sits under the narration and is mixed at
low volume inside the Remotion composition. Run after `npm install` — the
ffmpeg binary bundled with @remotion/compositor-* encodes the WAV to MP3.
"""
from __future__ import annotations

import array
import math
import os
import subprocess
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SAMPLE_RATE = 22_050
DURATION = 120.0
CHORD_SECONDS = 15.0
OUTPUT = ROOT / "public/audio/ambience.mp3"
RAW_WAV = ROOT / ".cache/audio/ambience.wav"

# A quiet four-chord loop: Am - F - C - G. Frequencies in Hz.
CHORDS = [
    (110.00, [220.00, 261.63, 329.63, 440.00]),
    (87.31, [174.61, 220.00, 261.63, 349.23]),
    (98.00, [196.00, 261.63, 329.63, 392.00]),
    (98.00, [196.00, 246.94, 293.66, 392.00]),
]


def smoothstep(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return x * x * (3.0 - 2.0 * x)


def main() -> None:
    RAW_WAV.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    total = int(SAMPLE_RATE * DURATION)
    samples = array.array("h")
    two_pi = 2.0 * math.pi

    for i in range(total):
        t = i / SAMPLE_RATE
        chord_index = int(t / CHORD_SECONDS) % len(CHORDS)
        local_t = t % CHORD_SECONDS
        bass, notes = CHORDS[chord_index]
        # Cross-fade the edges of each chord so the loop never clicks.
        chord_env = smoothstep(local_t / 2.5) * smoothstep((CHORD_SECONDS - local_t) / 2.5)

        value = 0.0
        for j, freq in enumerate(notes):
            wobble = 1.0 + 0.0016 * math.sin(two_pi * (0.06 + j * 0.011) * t)
            value += (0.115 / len(notes)) * math.sin(two_pi * freq * wobble * t + j * 0.7)
        value += 0.055 * math.sin(two_pi * bass * t)
        # A very quiet upper shimmer, slowly moving in and out.
        shimmer = 0.014 * (0.5 + 0.5 * math.sin(two_pi * 0.035 * t))
        value += shimmer * math.sin(two_pi * notes[-1] * 2.0 * t)

        # Slow overall breathing plus a 3s fade in/out.
        swell = 0.82 + 0.18 * math.sin(two_pi * t / 31.0)
        fade = smoothstep(t / 3.0) * smoothstep((DURATION - t) / 4.0)
        value *= chord_env * swell * fade
        samples.append(int(max(-1.0, min(1.0, value)) * 32767))

    with wave.open(str(RAW_WAV), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(samples.tobytes())

    ffmpeg = ROOT / "node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg"
    binary = str(ffmpeg) if ffmpeg.exists() else "ffmpeg"
    subprocess.run(
        [
            binary,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(RAW_WAV),
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "96k",
            str(OUTPUT),
        ],
        check=True,
    )
    print(f"wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size / 1024:.0f} KiB)")


if __name__ == "__main__":
    main()
