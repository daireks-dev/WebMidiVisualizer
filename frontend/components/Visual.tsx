'use client';
import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";

interface VisualProps {
    isPlaying: boolean
}

export default function Visualizer({isPlaying}: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pianoRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [notes, setNotes] = useState<any[]>([]);
  const [zoom, setZoom] = useState(5); // seconds per width
  const [yPadding, setYPadding] = useState(10); // pixels

  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Load MIDI file
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleChange = async (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      if (!target?.files?.length) return;

      const file = target.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);

      const loadedNotes = midi.tracks.flatMap(track =>
        track.notes.map(n => ({
          midi: n.midi,
          time: n.time,
          duration: n.duration
        }))
      );

      setNotes(loadedNotes);
    };

    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, []);

  // Helper: check if MIDI note is black key
  const isBlackKey = (midi: number) => {
    return [1, 3, 6, 8, 10].includes(midi % 12);
  };

  // Shared helper: key metrics
  const getKeyMetrics = (
    minNote: number,
    maxNote: number,
    height: number,
    yPadding: number
  ) => {
    const totalKeys = maxNote - minNote + 1;
    const keyHeight = (height - 2 * yPadding) / totalKeys;
    return { totalKeys, keyHeight };
  };

  // Draw piano keys
  const drawPiano = (
    ctx: CanvasRenderingContext2D,
    minNote: number,
    maxNote: number,
    currentTime: number
  ) => {
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;
    const { totalKeys, keyHeight } = getKeyMetrics(minNote, maxNote, height, yPadding);

    for (let i = 0; i < totalKeys; i++) {
      const midi = minNote + i;
      const isActive = notes.some(
        (note) =>
          note.midi === midi &&
          currentTime >= note.time &&
          currentTime <= note.time + note.duration
      );

      let fillColor;
      if (isActive) {
        fillColor = isBlackKey(midi) ? "#003f7f" : "blue";
      } else {
        fillColor = isBlackKey(midi) ? "black" : "white";
      }
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = ctx.fillStyle

      const y = yPadding + (totalKeys - i - 1) * keyHeight;
      if (isBlackKey(midi)) {
        ctx.fillRect(0, y, width * (2/3.0), keyHeight);
        ctx.strokeRect(0, y, width * (2/3.0), keyHeight);
      }
      else {
        ctx.fillRect(0, y, width, keyHeight);
        ctx.strokeRect(0, y, width, keyHeight);
      }
    }
  };

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const piano = pianoRef.current;
    if (!canvas || !piano) return;

    const ctx = canvas.getContext("2d");
    const pianoCtx = piano.getContext("2d");
    if (!ctx || !pianoCtx) return;

    const dpr = window.devicePixelRatio || 1;

    // Scale both canvases for high-DPI
    [canvas, piano].forEach((c) => {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    });

    ctx.scale(dpr, dpr);
    pianoCtx.scale(dpr, dpr);

    const draw = () => {
      const currentTime = (performance.now() - startTimeRef.current) / 1000;

      // Clear main canvas
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const width = canvas.clientWidth - 2;
      const height = canvas.clientHeight;

      if (notes.length) {
        const minNote = Math.min(...notes.map((n) => n.midi));
        const maxNote = Math.max(...notes.map((n) => n.midi));
        const { keyHeight } = getKeyMetrics(minNote, maxNote, height, yPadding);

        // Draw piano-roll notes
        notes.forEach((note) => {
          const x = ((note.time - currentTime) / zoom) * width + 1;
          const w = (note.duration / zoom) * width;

          if (x + w < 0 || x > width) return;

          const index = note.midi - minNote;
          const y = yPadding + (maxNote - note.midi) * keyHeight;

          ctx.fillStyle = "blue";
          ctx.fillRect(x, y, w, keyHeight);
        });

        // Draw piano
        pianoCtx.clearRect(0, 0, piano.clientWidth, piano.clientHeight);
        drawPiano(pianoCtx, minNote, maxNote, currentTime);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      startTimeRef.current = performance.now();
      draw();
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, notes, zoom, yPadding]);

  return (
    <div className="bg-gray-400 w-full max-w-4xl mx-auto flex flex-col gap-2">
      <div className="flex gap-2 w-full">
        {/* Fixed vertical piano keys */}
        <div className="relative w-16 aspect-video">
          <canvas
            ref={pianoRef}
            className="absolute inset-0 w-full h-full bg-gray-100"
          />
        </div>

        {/* Main piano-roll canvas */}
        <div className="relative flex-1 aspect-video">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full bg-gray-300"
          />
        </div>

        <input
        ref={inputRef}
        type="file"
        accept=".mid,.midi"
        className="text-gray-500 mt-2"
      />
      </div>
    </div>
  );
}
