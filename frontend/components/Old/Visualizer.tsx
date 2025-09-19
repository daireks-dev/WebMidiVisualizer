'use client';
import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";
import { X } from "lucide-react";

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
    time: number
  ) => {
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;
    const { totalKeys, keyHeight } = getKeyMetrics(minNote, maxNote, height, yPadding);

    for (let i = 0; i < totalKeys; i++) {
      const midi = minNote + i;
      const isActive = notes.some(
        (note) =>
          note.midi === midi &&
          time >= note.time &&
          time <= note.time + note.duration
      );

      let fillColor;
      if (isActive) {
        fillColor = isBlackKey(midi) ? "#fc721c" : "#ffe3c4";
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
      const time = (performance.now() - startTimeRef.current) / 1000
      setCurrentTime(time)

      // Clear main canvas
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const width = canvas.clientWidth - 2;
      const height = canvas.clientHeight;

      if (notes.length) {
        const minNote = Math.min(...notes.map((n) => n.midi));
        const maxNote = Math.max(...notes.map((n) => n.midi));
        const { keyHeight } = getKeyMetrics(minNote, maxNote, height, yPadding);

        //Reset each frame:
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
        gradient.addColorStop(0, colors["background"][0]);
        gradient.addColorStop(1, colors["background"][1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        //Background Lines:
        for (let midi = minNote; midi <= maxNote; midi++) {
          const y = yPadding + (maxNote - midi) * keyHeight;

          if (isBlackKey(midi)) {
            // Filled background for black keys
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.fillRect(0, y, width, keyHeight);

            // Thin line
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0,0,0,0.05)";
            ctx.lineWidth = 1;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          } else {
            // Thin line
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0,0,0,0.05)";
            ctx.lineWidth = 1;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
        }

        //Shadows:
        notes.forEach((note) => {
          const x = ((note.time - time) / xStretch) * width + 1;
          const w = (note.duration / xStretch) * width;
          if (x + w < 0 || x > width) return;

          const y = yPadding + (maxNote - note.midi) * keyHeight;

          ctx.beginPath();               // start fresh for each shadow
          ctx.shadowColor = "rgba(0,0,0,0.5)";     
          ctx.shadowBlur = 10;           
          ctx.shadowOffsetX = 0;         
          ctx.shadowOffsetY = 0;

          ctx.fillStyle = "blue";        // the color doesn't really matter for shadow
          ctx.roundRect(x, y, w, keyHeight, 1);
          ctx.fill();
        });

        //Fill + Outline:
        notes.forEach((note) => {
          const x = ((note.time - time) / xStretch) * width + 1;
          const w = (note.duration / xStretch) * width;
          if (x + w < 0 || x > width) return;

          const y = yPadding + (maxNote - note.midi) * keyHeight;

          ctx.beginPath();               // new path for the note
          ctx.shadowBlur = 0;            
          ctx.shadowColor = "transparent";

          ctx.fillStyle = colors["tracks"][0];        
          ctx.roundRect(x, y, w, keyHeight, 1);
          ctx.fill();

          ctx.strokeStyle = "rgba(0,0,0,0.2)";
          ctx.stroke();
        });

        // Draw piano
        pianoCtx.clearRect(0, 0, piano.clientWidth, piano.clientHeight);
        drawPiano(pianoCtx, minNote, maxNote, time);
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
  }, [isPlaying, notes, xStretch, yPadding]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
      <div className="flex gap-2 w-full">
        {/* Fixed vertical piano keys */}
        <div className="relative flex-1 w-16 aspect-video drop-shadow-2xl">
          <canvas
            ref={pianoRef}
            className="absolute inset-0 w-full h-full bg-gray-100"
          />
        </div>

        {/* Main piano-roll canvas */}
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
