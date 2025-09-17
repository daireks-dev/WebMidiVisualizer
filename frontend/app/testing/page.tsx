'use client';
import FileInput from "@/components/FileInput"
import Settings from "@/components/Settings/Settings"
import { HexColorPicker } from "react-colorful"
import VideoControls from "@/components/VideoControls/VideoControls"
import Visual from "@/components/Visual"
import { useState } from "react";

export default function HomeTest() {
    const [color, setColor] = useState('#71AB94');
        
    return (
        <div className="bg-[#2C2C2C] w-screen h-full flex justify-center">
            <div className="w-[min(90vh,95%)] h-full my-3 flex flex-col items-center gap-3">
                <FileInput/>
                <Visual/>
                <VideoControls/>
                <Settings/>
                <HexColorPicker/>
            </div>
        </div>
    )
}