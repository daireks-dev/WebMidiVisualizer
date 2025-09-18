'use client';
import { Slider } from "../ui/slider"
import PlayButton from "./PlayButton";

interface VideoControlsProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VideoControls({isPlaying, setIsPlaying}: VideoControlsProps) {
    return (
        <div className="w-full aspect-[13/1] drop-shadow-2xl flex items-center gap-3">
            <PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
            <Slider/>
        </div>
    )
}