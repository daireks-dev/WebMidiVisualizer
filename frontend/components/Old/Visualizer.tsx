'use client';
import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";
import Color from "color";

interface Props {
  isPlaying: boolean,
  xStretch: number,
  yPadding: number,
  inputRef: React.RefObject<HTMLInputElement | null>
  currentTime: number,
  setCurrentTime: (t: number) => void
  colors: {tracks: string[], background: string[], keys: string[]}
}

export default function Visualizer({isPlaying, xStretch, yPadding, inputRef, currentTime, setCurrentTime, colors}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pianoRef = useRef<HTMLCanvasElement | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef(0);

  // live refs
  const colorsRef = useRef(colors);
  const xStretchRef = useRef(xStretch);
  const yPaddingRef = useRef(yPadding);
  useEffect(() => { colorsRef.current = colors; }, [colors]);
  useEffect(() => { xStretchRef.current = xStretch; }, [xStretch]);
  useEffect(() => { yPaddingRef.current = yPadding; }, [yPadding]);

  // Load MIDI
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleChange = async (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      if (!target?.files?.length) return;

      const file = target.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);

      // === MAP FIRST 5 OCCUPIED TRACKS ===
      const occupiedTracks = midi.tracks
        .map((track, i) => ({ track, index: i }))
        .filter(t => t.track.notes.length > 0)
        .slice(0, 5);

      const trackMapping: Record<number, number> = {};
      occupiedTracks.forEach((t, i) => { trackMapping[t.index] = i });

      const loadedNotes = midi.tracks.flatMap((track, trackIndex) =>
        track.notes.map(n => ({
          midi: n.midi,
          time: n.time,
          duration: n.duration,
          track: trackMapping[trackIndex] ?? 0
        }))
      );

      setNotes(loadedNotes);
    };

    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, []);

  const isBlackKey = (midi: number) => [1, 3, 6, 8, 10].includes(midi % 12);

  const getKeyMetrics = (minNote: number, maxNote: number, height: number, yPadding: number) => {
    const totalKeys = maxNote - minNote + 1;
    const keyHeight = (height - 2 * yPadding) / totalKeys;
    return { totalKeys, keyHeight };
  };

  const drawPiano = (
    ctx: CanvasRenderingContext2D,
    minNote: number,
    maxNote: number,
    time: number
  ) => {
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;
    const { totalKeys, keyHeight } = getKeyMetrics(minNote, maxNote, height, yPaddingRef.current);

    const whiteKeys: number[] = [];
    const blackKeys: number[] = [];

    for (let i = 0; i < totalKeys; i++) {
      const midi = minNote + i;
      if (isBlackKey(midi)) blackKeys.push(midi);
      else whiteKeys.push(midi);
    }

    [...whiteKeys, ...blackKeys].forEach((midi) => {
      const activeNotes = notes.filter(
        (note) => note.midi === midi && time >= note.time && time <= note.time + note.duration
      );

      let fillColor: string;
      if (activeNotes.length > 0) {
        const trackColor = colorsRef.current.tracks[activeNotes[0].track] || "orange";
        fillColor = isBlackKey(midi)
          ? Color(trackColor).darken(0.5).saturate(0.3).hex()
          : trackColor;
      } else {
        fillColor = isBlackKey(midi) ? colorsRef.current.keys[1] : colorsRef.current.keys[0];
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = ctx.fillStyle;

      const y = yPaddingRef.current + (maxNote - midi) * keyHeight;

      if (isBlackKey(midi)) {
        ctx.fillRect(0, y, width * (2 / 3), keyHeight);
        ctx.strokeRect(0, y, width * (2 / 3), keyHeight);
      } else {
        ctx.fillRect(0, y, width, keyHeight);
        ctx.strokeRect(0, y, width, keyHeight);
      }
    });
  };

    const drawFrame = (time: number) => {
        const canvas = canvasRef.current;
        const piano = pianoRef.current;
        if (!canvas || !piano) return;

        const ctx = canvas.getContext("2d");
        const pianoCtx = piano.getContext("2d");
        if (!ctx || !pianoCtx) return;

        const dpr = window.devicePixelRatio || 1;
        [canvas, piano].forEach((c) => {
          c.width = c.clientWidth * dpr;
          c.height = c.clientHeight * dpr;
        });
        ctx.scale(dpr, dpr);
        pianoCtx.scale(dpr, dpr);


      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const width = canvas.clientWidth - 2;
      const height = canvas.clientHeight;

      if (notes.length) {
        const minNote = Math.min(...notes.map((n) => n.midi));
        const maxNote = Math.max(...notes.map((n) => n.midi));
        const { keyHeight } = getKeyMetrics(minNote, maxNote, height, yPaddingRef.current);

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
        gradient.addColorStop(0, colorsRef.current.background[0]);
        gradient.addColorStop(1, colorsRef.current.background[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        // Background lines
        for (let midi = minNote; midi <= maxNote; midi++) {
          const y = yPaddingRef.current + (maxNote - midi) * keyHeight;

          if (isBlackKey(midi)) {
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.fillRect(0, y, width, keyHeight);

            ctx.beginPath();
            ctx.strokeStyle = "rgba(0,0,0,0.05)";
            ctx.lineWidth = 1;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0,0,0,0.05)";
            ctx.lineWidth = 1;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
        }

        // Shadows
        notes.forEach((note) => {
          const x = ((note.time - time) / xStretchRef.current) * width + 1;
          const w = (note.duration / xStretchRef.current) * width;
          if (x + w < 0 || x > width) return;

          const y = yPaddingRef.current + (maxNote - note.midi) * keyHeight;

          ctx.beginPath();
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          ctx.fillStyle = "blue"; // shadow only
          ctx.roundRect(x, y, w, keyHeight, 1);
          ctx.fill();
        });

        // Notes
        notes.forEach((note) => {
          const x = ((note.time - time) / xStretchRef.current) * width + 1;
          const w = (note.duration / xStretchRef.current) * width;
          if (x + w < 0 || x > width) return;

          const y = yPaddingRef.current + (maxNote - note.midi) * keyHeight;

          ctx.beginPath();
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";

          ctx.fillStyle = colorsRef.current["tracks"][note.track] || "blue";
          ctx.roundRect(x, y, w, keyHeight, 1);
          ctx.fill();

          ctx.strokeStyle = "rgba(0,0,0,0.2)";
          ctx.stroke();
        });

        pianoCtx.clearRect(0, 0, piano.clientWidth, piano.clientHeight);
        drawPiano(pianoCtx, minNote, maxNote, time);
      }
    };

// Main loop
useEffect(() => {
  const animate = () => {
    const time = (performance.now() - startTimeRef.current) / 1000;
    setCurrentTime(time);
    drawFrame(time);
    animationRef.current = requestAnimationFrame(animate);
  };

  if (isPlaying) {
    // resume from paused time
    startTimeRef.current = performance.now() - pausedTimeRef.current * 1000;
    animate();
  } else {
    // pause: stop animation and keep last frame
    cancelAnimationFrame(animationRef.current);
    pausedTimeRef.current = currentTime;
    drawFrame(pausedTimeRef.current);
  }

  return () => cancelAnimationFrame(animationRef.current);
}, [isPlaying, notes, setCurrentTime]);

  // Update colors while paused
  useEffect(() => {
    if (!isPlaying) drawFrame(pausedTimeRef.current);
  }, [colors, isPlaying, notes]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
      <div className="flex gap-2 w-full">
        <div className="relative flex-1 w-16 aspect-video drop-shadow-2xl">
          <canvas
            ref={pianoRef}
            className="absolute inset-0 w-full h-full bg-gray-100"
          />
        </div>
        <div className="relative flex-8 aspect-video drop-shadow-2xl">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full bg-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
