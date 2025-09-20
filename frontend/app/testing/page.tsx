'use client';
import FileInput from "@/components/FileInput"
import Settings from "@/components/Settings/Settings"
import { HexColorPicker } from "react-colorful"
import VideoControls from "@/components/VideoControls/VideoControls"
import { useRef, useState } from "react";
import Visualizer from "@/components/Old/Visualizer";

export default function HomeTest() {
    const defaultTheme = {
        tracks: ["#f6f5c6", "#b3ddff", "#B9F3C5", "#C3B1FF", "#EDAA9D"],
        background: ["#edfaff", "#8079b3"],
        keys: ["#FFFFFF", "#555555", "#FFFFFF", "#000000", "#FFFFFF", "#FFFFFF", "#000000", "#FFFFFF", "#000000", "#FFFFFF", "#000000", "#FFFFFF"]
    }

    const [colors, setColors] = useState(defaultTheme)
    const [xStretch, setXStretch] = useState(5)
    const [yPadding, setYPadding] = useState(5)
    const [isPlaying, setIsPlaying] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [songLength, setSongLength] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    const [currentTime, setCurrentTime] = useState(0)
        
    return (
        <div className="bg-[#2C2C2C] w-screen h-full flex justify-center">
            <div className="w-[min(90vh,95%)] h-full my-3 flex flex-col items-center gap-3">
                <FileInput inputRef={inputRef}/>
                <Visualizer setIsSeeking={setIsSeeking} isSeeking={isSeeking} songLength={songLength} setSongLength={setSongLength} colors={colors} isPlaying={isPlaying} xStretch={xStretch} yPadding={yPadding} inputRef={inputRef} currentTime={currentTime} setCurrentTime={setCurrentTime}/>
                <VideoControls setIsSeeking={setIsSeeking} songLength={songLength} setSongLength={setSongLength} isPlaying={isPlaying} setIsPlaying={setIsPlaying} currentTime={currentTime} setCurrentTime={setCurrentTime}/>
                <Settings colors={colors} setColors={setColors} setXStretch={setXStretch} setYPadding={setYPadding} xStretch={xStretch} yPadding={yPadding}/>
            </div>
        </div>
    )
}