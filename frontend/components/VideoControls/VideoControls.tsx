'use client';
import { Slider } from "../ui/slider"
import PlayButton from "./PlayButton";

interface VideoControlsProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
currentTime: number,
  setCurrentTime: (t: number) => void
}

export default function VideoControls({isPlaying, setIsPlaying, currentTime, setCurrentTime}: VideoControlsProps) {
    return (
        <div className="w-full aspect-[13/1] drop-shadow-2xl flex items-center gap-1.5">
            <PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
            <Slider className="flex-8" value={[currentTime]}/>
        </div>
    )
}