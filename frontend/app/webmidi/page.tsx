'use client';
import FileInput from "@/webmidi-components/FileInput"
import Settings from "@/webmidi-components/Settings/Settings"
import { HexColorPicker } from "react-colorful"
import VideoControls from "@/webmidi-components/VideoControls/VideoControls"
import { useRef, useState } from "react";
import Visualizer from "@/webmidi-components/Old/Visualizer";

export default function HomeTest() {
    const defaultTheme = {
        active: true,
        track_colors: ["#f6f5c6", "#b3ddff", "#B9F3C5", "#C3B1FF", "#EDAA9D"],
        bg_colors: ["#edfaff", "#8079b3"],
        key_colors: ["#FFFFFF", "#555555", "#FFFFFF", "#000000", "#FFFFFF", "#FFFFFF", "#000000", "#FFFFFF", "#000000", "#FFFFFF", "#000000", "#FFFFFF"],
        xZoom: 5,
        yPadding: 5
    }

    const emptyTheme = {
        active: false,
        track_colors: ["#", "#", "#", "#", "#"],
        bg_colors: ["#", "#"],
        key_colors: ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
        xZoom: 0,
        yPadding: 0
    }
    
    const defaultThemes = [
        defaultTheme,
        emptyTheme,
        emptyTheme,
        emptyTheme
    ]

    const [currentTheme, setCurrentTheme] = useState(defaultTheme)
    const [themes, setThemes] = useState(defaultThemes)
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
                <Visualizer currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} setIsSeeking={setIsSeeking} isSeeking={isSeeking} songLength={songLength} setSongLength={setSongLength} isPlaying={isPlaying} inputRef={inputRef} currentTime={currentTime} setCurrentTime={setCurrentTime}/>
                <VideoControls setIsSeeking={setIsSeeking} songLength={songLength} setSongLength={setSongLength} isPlaying={isPlaying} setIsPlaying={setIsPlaying} currentTime={currentTime} setCurrentTime={setCurrentTime}/>
                <Settings themes={themes} setThemes={setThemes} currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme}/>
            </div>
        </div>
    )
}