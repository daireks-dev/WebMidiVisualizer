'use client';
import FileInput from "@/components/FileInput"
import Settings from "@/components/Settings/Settings"
import { HexColorPicker } from "react-colorful"
import VideoControls from "@/components/VideoControls/VideoControls"
import { useRef, useState } from "react";
import Visualizer from "@/components/Old/Visualizer";

export default function HomeTest() {
    const [color, setColor] = useState('#71AB94');
    const [xStretch, setXStretch] = useState(5)
    const [yPadding, setYPadding] = useState(5)
    const [isPlaying, setIsPlaying] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
        
    return (
        <div className="bg-[#2C2C2C] w-screen h-full flex justify-center">
            <div className="w-[min(90vh,95%)] h-full my-3 flex flex-col items-center gap-3">
                <FileInput inputRef={inputRef}/>
                <Visualizer isPlaying={isPlaying} xStretch={xStretch} yPadding={yPadding} inputRef={inputRef}/>
                <VideoControls isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
                <Settings setXStretch={setXStretch} setYPadding={setYPadding} xStretch={xStretch} yPadding={yPadding}/>
                <HexColorPicker/>
            </div>
        </div>
    )
}