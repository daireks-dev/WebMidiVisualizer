'use client';

import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";
import Color from "color";
import * as Tone from "tone";

type Theme = {
  active: boolean,
  track_colors: string[];
  bg_colors: string[];
  key_colors: string[];
  xZoom: number;
  yPadding: number;
};

interface Props {
  isPlaying: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  currentTheme: Theme;
  setCurrentTheme: (t: Theme) => void;
  songLength: number;
  setSongLength: (v: number) => void;
  isSeeking: boolean;
  setIsSeeking: (v: boolean) => void;
}

export default function Visualizer({
  isPlaying,
  inputRef,
  currentTime,
  setCurrentTime,
  currentTheme,
  setCurrentTheme,
  songLength,
  setSongLength,
  isSeeking,
  setIsSeeking
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pianoRef = useRef<HTMLCanvasElement | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef(0);

  // Tone.js synth
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const triggeredNotesRef = useRef<Set<string>>(new Set());

  // live refs
  const colorsRef = useRef(currentTheme);
  const xStretchRef = useRef(currentTheme.xZoom);
  const yPaddingRef = useRef(currentTheme.yPadding);

  useEffect(() => {
    colorsRef.current = currentTheme;
  }, [currentTheme]);

  useEffect(() => {
    xStretchRef.current = currentTheme.xZoom;
  }, [currentTheme.xZoom]);

  useEffect(() => {
    yPaddingRef.current = currentTheme.yPadding;
  }, [currentTheme.yPadding]);

  // Initialize Tone.js synth
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
  }, []);

  const loadMidi = async (arrayBuffer: ArrayBuffer) => {
    const midi = new Midi(arrayBuffer);

    const occupiedTracks = midi.tracks
      .map((track, i) => ({ track, index: i }))
      .filter((t) => t.track.notes.length > 0)
      .slice(0, 5);

    const trackMapping: Record<number, number> = {};
    occupiedTracks.forEach((t, i) => {
      trackMapping[t.index] = i;
    });

    const loadedNotes = midi.tracks.flatMap((track, trackIndex) =>
      track.notes.map((n) => ({
        midi: n.midi,
        time: n.time,
        duration: n.duration,
        track: trackMapping[trackIndex] ?? 0,
      }))
    );

    setNotes(loadedNotes);
  };

  const demoLoadedRef = useRef(false);

  useEffect(() => {
    if (isPlaying && !demoLoadedRef.current) {
      const fetchDemo = async () => {
        const response = await fetch("/demo.mid");
        const arrayBuffer = await response.arrayBuffer();
        await loadMidi(arrayBuffer);
        demoLoadedRef.current = true; // mark demo as loaded
      };
      fetchDemo();
    }
  }, [isPlaying]);

  // Handle user file upload
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleChange = async () => {
      const files = input.files;
      if (!files || !files.length) return;

      const arrayBuffer = await files[0].arrayBuffer();
      await loadMidi(arrayBuffer);
    };

    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, [inputRef]);

  const isBlackKey = (midi: number) => [1, 3, 6, 8, 10].includes(midi % 12);

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

  const drawPiano = (
    ctx: CanvasRenderingContext2D,
    minNote: number,
    maxNote: number,
    time: number
  ) => {
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;

    const { totalKeys, keyHeight } = getKeyMetrics(
      minNote,
      maxNote,
      height,
      yPaddingRef.current
    );

    const whiteKeys: number[] = [];
    const blackKeys: number[] = [];

    for (let i = 0; i < totalKeys; i++) {
      const midi = minNote + i;
      if (isBlackKey(midi)) blackKeys.push(midi);
      else whiteKeys.push(midi);
    }

    [...whiteKeys, ...blackKeys].forEach((midi) => {
      const activeNotes = notes.filter(
        (note) =>
          note.midi === midi &&
          time >= note.time &&
          time <= note.time + note.duration
      );

      let fillColor: string;
      if (activeNotes.length > 0) {
        const trackColor =
          colorsRef.current.track_colors[activeNotes[0].track] || "orange";
        fillColor = isBlackKey(midi)
          ? Color(trackColor).darken(0.5).saturate(0.3).hex()
          : trackColor;
      } else {
        fillColor = isBlackKey(midi)
          ? colorsRef.current.key_colors[1]
          : colorsRef.current.key_colors[0];
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

  // Main drawFrame function
  const drawFrame = (time: number, doPlayNotes = true) => {
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
    if (!notes.length) return;

    const minNote = Math.min(...notes.map((n) => n.midi));
    const maxNote = Math.max(...notes.map((n) => n.midi));

    const { keyHeight } = getKeyMetrics(
      minNote,
      maxNote,
      height,
      yPaddingRef.current
    );

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
    gradient.addColorStop(0, colorsRef.current.bg_colors[0]);
    gradient.addColorStop(1, colorsRef.current.bg_colors[1]);
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

    // Draw notes
    notes.forEach((note) => {
      const x = ((note.time - time) / xStretchRef.current) * width + 1;
      const w = (note.duration / xStretchRef.current) * width;
      if (x + w < 0 || x > width) return;

      const y = yPaddingRef.current + (maxNote - note.midi) * keyHeight;
      const noteKey = note.midi;
      const isActive = time >= note.time && time <= note.time + note.duration;

      // Trigger sound only if playing and doPlayNotes = true
      if (
        isActive &&
        doPlayNotes &&
        isPlaying &&
        !triggeredNotesRef.current.has(noteKey)
      ) {
        synthRef.current?.triggerAttackRelease(
          Tone.Frequency(note.midi, "midi").toFrequency(),
          note.duration
        );
        triggeredNotesRef.current.add(noteKey);
      }

      // Remove note from triggered set if its time has passed
      if (time > note.time + note.duration) {
        triggeredNotesRef.current.delete(noteKey);
      }

      // Shadow
      ctx.beginPath();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = "blue";
      ctx.roundRect(x, y, w, keyHeight, 1);
      ctx.fill();
    });

    notes.forEach((note) => {
      const x = ((note.time - time) / xStretchRef.current) * width + 1;
      const w = (note.duration / xStretchRef.current) * width;
      if (x + w < 0 || x > width) return;

      const y = yPaddingRef.current + (maxNote - note.midi) * keyHeight;
      const noteKey = note.midi;
      const isActive = time >= note.time && time <= note.time + note.duration;

      // Note rectangle
      ctx.beginPath();
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.fillStyle = colorsRef.current.track_colors[note.track] || "blue";
      ctx.roundRect(x, y, w, keyHeight, 1);
      ctx.fill();

      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.stroke();
    })

    // Draw piano
    pianoCtx.clearRect(0, 0, piano.clientWidth, piano.clientHeight);
    drawPiano(pianoCtx, minNote, maxNote, time);
  };

  useEffect(() => {
    const animate = () => {
      const time = (performance.now() - startTimeRef.current) / 1000;
      if (!isSeeking) setCurrentTime(time);
      drawFrame(isSeeking ? currentTime : time); // doPlayNotes = true by default
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      startTimeRef.current = performance.now() - pausedTimeRef.current * 1000;
      animate();
    } else {
      cancelAnimationFrame(animationRef.current);
      pausedTimeRef.current = currentTime;
      drawFrame(pausedTimeRef.current, false); // paused → do not play notes
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, notes, setCurrentTime]);

  // Update drawFrame while paused AND slider moved
  useEffect(() => {
    if (!isPlaying) {
      pausedTimeRef.current = currentTime;
      triggeredNotesRef.current.clear();
      drawFrame(pausedTimeRef.current);
    }
  }, [currentTime, currentTheme, isPlaying, notes]);

  // Calculate song length
  const getSongLength = (notes: any[]) => {
    if (!notes.length) return 0;
    return Math.max(...notes.map((n) => n.time + n.duration));
  };

  useEffect(() => {
    if (notes.length > 0) setSongLength(getSongLength(notes));
  }, [notes]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
      <div className="flex gap-2 w-full">
        <div className="relative flex-1 w-16 aspect-video drop-shadow-2xl">
          <canvas
            ref={pianoRef}
            className="absolute inset-0 w-full h-full bg-gray-100"
            style={{ backgroundColor: Color(currentTheme["key_colors"][0]).darken(0.1).hex() }}
          />
        </div>
        <div className="relative flex-8 aspect-video drop-shadow-2xl">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
          <div className="bg-[#666666] absolute inset-0 w-full h-full z-[-1] flex flex-col items-center justify-center">
            <h1 className="text-black font-bold">Welcome to WebMidi!</h1>
            <h1 className="text-[#222222]">Upload a midi file above or press play to show a demo.</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
