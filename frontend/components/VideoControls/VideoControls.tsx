'use client';
import { Slider } from "../ui/slider"
import PlayButton from "./PlayButton";

export default function VideoControls() {
    return (
        <div className="w-full aspect-[13/1] drop-shadow-2xl flex items-center gap-3">
            <PlayButton/>
            <Slider/>
        </div>
    )
}