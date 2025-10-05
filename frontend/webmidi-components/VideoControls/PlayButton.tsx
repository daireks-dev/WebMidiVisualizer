'use client';

import { Play, Pause } from "lucide-react";
import { useState } from "react";

interface PlayButtonProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PlayButton({isPlaying, setIsPlaying}: PlayButtonProps) {
    return (
        <button onClick={() => setIsPlaying(!isPlaying)} className={`relative flex-1 h-full flex justify-center items-center hover:brightness-70 transition-all ${isPlaying ? "bg-[#ab8971]" : "bg-[#71AB94]"}`}>
            <Play className={`absolute transition-all duration-300 transform ${isPlaying ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}/>
            <Pause className={`absolute transition-all duration-300 transform ${isPlaying ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}/>
        </button>
    )
}