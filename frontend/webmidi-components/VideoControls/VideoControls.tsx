'use client';
import { useState } from "react";
import { Slider } from "../ui/slider"
import PlayButton from "./PlayButton";

interface VideoControlsProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number,
  setCurrentTime: (t: number) => void,
  songLength: number,
  setSongLength: (v: number) => void,
  setIsSeeking: (v: boolean) => void
}

export default function VideoControls({isPlaying, setIsPlaying, currentTime, setCurrentTime, songLength, setSongLength, setIsSeeking}: VideoControlsProps) {
    return (
        <div className="w-full aspect-[13/1] drop-shadow-2xl flex items-center gap-3">
            <PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
            <Slider className="flex-8" value={[currentTime]} max={songLength} onPointerDown={() => setIsSeeking(true)} onPointerUp={() => setIsSeeking(false)} onValueChange={(value) => setCurrentTime(value[0])} step={0.01}/>
        </div>
    )
}