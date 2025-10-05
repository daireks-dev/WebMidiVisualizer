'use client';
import { HexColorPicker } from "react-colorful";
import SquareSpacer from "./SquareSpacer"
import { useEffect, useRef, useState } from "react";

type Theme = {
  active: boolean,
  track_colors: string[];
  bg_colors: string[];
  key_colors: string[];
  xZoom: number;
  yPadding: number;
};

interface ButtonProps {
    id: number
    currentTheme: Theme,
    setCurrentTheme: (t: Theme) => void
}

export default function GradientButton({currentTheme, setCurrentTheme, id}: ButtonProps) {
    const topColor = currentTheme["bg_colors"][0]
    const bottomColor = currentTheme["bg_colors"][1]

    const [showTopPicker, setShowTopPicker] = useState(false)
    const [showBottomPicker, setShowBottomPicker] = useState(false)

    const topButtonRef = useRef<HTMLButtonElement>(null)
    const bottomButtonRef = useRef<HTMLButtonElement>(null)

    const topPickerRef = useRef<HTMLDivElement>(null)
    const bottomPickerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function activateColorPicker(event: MouseEvent) {
            if (topButtonRef.current && !topButtonRef.current.contains(event.target as Node) && 
                topPickerRef.current && !topPickerRef.current.contains(event.target as Node)) {
                setShowTopPicker(false)
            }
            else if (bottomButtonRef.current && !bottomButtonRef.current.contains(event.target as Node) && 
                bottomPickerRef.current && !bottomPickerRef.current.contains(event.target as Node)) {
                setShowBottomPicker(false)
            }
        }

        document.addEventListener("mousedown", activateColorPicker)
        return () => document.removeEventListener("mousedown", activateColorPicker)
    }, [])
   
    return (
        <div className="relative h-full">
            <div className="relative h-full flex items-center gap-1.5"> 
                <div className="h-[75%] aspect-square">
                    <div className="h-full w-[calc(200%+6px)] flex flex-col gap-1.5">
                        <button onClick={() => setShowTopPicker((prev) => !prev)} style={{ backgroundColor: topColor }} className="flex-1 drop-shadow-2xl" ref={topButtonRef}>
                            <div className="bg-black w-full h-full opacity-0 hover:opacity-30 transition flex justify-center items-center">
                                <h1 className="font-bold text-[min(2.2vh,2.2vw,1rem)]">{topColor}</h1>
                            </div>
                        </button>

                        <button onClick={() => setShowBottomPicker((prev) => !prev)} style={{ backgroundColor: bottomColor }} className="flex-1 drop-shadow-2xl" ref={bottomButtonRef}>
                            <div className="bg-black w-full h-full opacity-0 hover:opacity-30 transition flex justify-center items-center">
                                <h1 className="font-bold text-[min(2.2vh,2.2vw,1rem)]">{bottomColor}</h1>
                            </div>
                        </button>
                    </div>
                </div>
                <SquareSpacer isVisible={false}/>
            </div>

            {showTopPicker &&
            <div ref={topPickerRef} className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50">
                <HexColorPicker className="max-h-[21vw] max-w-[21vw] aspect-square" onChange={(newColor) => {
                    const newBackground = [...currentTheme.bg_colors]
                    newBackground[0] = newColor
                    setCurrentTheme({...currentTheme, bg_colors: newBackground})
                }}/>
            </div>}   

            {showBottomPicker &&
            <div ref={bottomPickerRef} className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-60">
                <HexColorPicker className="max-h-[21vw] max-w-[21vw] aspect-square" onChange={(newColor) => {
                    const newBackground = [...currentTheme.bg_colors]
                    newBackground[1] = newColor
                    setCurrentTheme({...currentTheme, bg_colors: newBackground})
                }}/>
            </div>}   

        </div>
    )
}