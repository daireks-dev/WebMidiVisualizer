import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [notes, setNotes] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(5); // seconds per width
  const [yPadding, setYPadding] = useState(10); // pixels

  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // MIDI file input
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

  // Drawing & scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      if (!ctx) return;

      const currentTime = ((performance.now() - startTimeRef.current) / 1000);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      const width = canvas.clientWidth - 2; // optional left/right padding
      const height = canvas.clientHeight - 2 * yPadding;

      if (notes.length) {
        const minNote = Math.min(...notes.map(n => n.midi));
        const maxNote = Math.max(...notes.map(n => n.midi));

        notes.forEach(note => {
          const x = ((note.time - currentTime) / zoom) * width + 1; // small left padding
          const w = (note.duration / zoom) * width;

          if (x + w < 0 || x > width) return; // skip offscreen

          const y = yPadding + height - ((note.midi - minNote) / (maxNote - minNote)) * height;
          const h = 5;

          ctx.fillStyle = "blue";
          ctx.fillRect(x, y - h / 2, w, h);
        });
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
    <div className="w-full max-w-3xl flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        className="w-full bg-gray-300 aspect-video"
        style={{ display: "block" }}
      />

      <div className="flex flex-wrap gap-4 items-center">
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <label className="text-gray-500 flex items-center gap-1">
          Zoom (seconds per width):
          <input
            type="number"
            value={zoom}
            min={1}
            max={30}
            step={0.5}
            className="text-gray-500 border rounded px-1"
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
        </label>

        <label className="text-gray-500 flex items-center gap-1">
          Y Padding (px):
          <input
            type="number"
            value={yPadding}
            min={0}
            max={100}
            step={1}
            className="text-gray-500 border rounded px-1"
            onChange={(e) => setYPadding(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".mid,.midi"
        className="text-gray-500 mt-2"
      />
    </div>
  );
}
