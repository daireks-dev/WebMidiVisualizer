'use client';
import { HexColorPicker } from "react-colorful";
import SquareSpacer from "./SquareSpacer"
import { useEffect, useRef, useState } from "react";

interface ButtonProps {
    id: number
    colors: {tracks: string[], background: string[], keys: string[]},
    setColors: (t: {tracks: string[], background: string[], keys: string[]}) => void
}

export default function GradientButton({colors, setColors, id}: ButtonProps) {
    const topColor = colors["background"][0]
    const bottomColor = colors["background"][1]

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
        <div className="h-full">
            <div className="h-full flex items-center gap-1.5"> 
                <div className="h-[75%] aspect-square">
                    <div className="h-full w-[calc(200%+6px)] flex flex-col gap-1.5">
                        <button onClick={() => setShowTopPicker((prev) => !prev)} style={{ backgroundColor: topColor }} className="flex-1 drop-shadow-2xl" ref={topButtonRef}>
                            <div className="bg-black w-full h-full opacity-0 hover:opacity-30 transition flex justify-center items-center">
                                <h1 className="font-bold text-[min(2.2vw,1rem)]">{topColor}</h1>
                            </div>
                        </button>

                        <button onClick={() => setShowBottomPicker((prev) => !prev)} style={{ backgroundColor: bottomColor }} className="flex-1 drop-shadow-2xl" ref={bottomButtonRef}>
                            <div className="bg-black w-full h-full opacity-0 hover:opacity-30 transition flex justify-center items-center">
                                <h1 className="font-bold text-[min(2.2vw,1rem)]">{bottomColor}</h1>
                            </div>
                        </button>
                    </div>
                </div>
                <SquareSpacer isVisible={false}/>
            </div>

            {showTopPicker &&
            <div ref={topPickerRef} className="absolute left-1/2 mt-2 -translate-x-1/2 z-50">
                <HexColorPicker className="max-h-[21vw] max-w-[21vw] aspect-square" onChange={(newColor) => {
                    const newBackground = [...colors.background]
                    newBackground[0] = newColor
                    setColors({...colors, background: newBackground})
                }}/>
            </div>}   

            {showBottomPicker &&
            <div ref={bottomPickerRef} className="absolute left-1/2 mt-2 -translate-x-1/2 z-60">
                <HexColorPicker className="max-h-[21vw] max-w-[21vw] aspect-square" onChange={(newColor) => {
                    const newBackground = [...colors.background]
                    newBackground[1] = newColor
                    setColors({...colors, background: newBackground})
                }}/>
            </div>}   

        </div>
    )
}