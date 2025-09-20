import { useEffect, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"

interface ButtonProps {
    id: number
    colors: {tracks: string[], background: string[], keys: string[]}
    setColors: (t: {tracks: string[], background: string[], keys: string[]}) => void
}

export default function ColorButton({id, colors, setColors}: ButtonProps) {
    const color = colors["tracks"][id]
    const [showPicker, setShowPicker] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const pickerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function activateColorPicker(event: MouseEvent) {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node) && 
                pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false)
            }
        }

        document.addEventListener("mousedown", activateColorPicker)
        return () => document.removeEventListener("mousedown", activateColorPicker)
    }, [])

    return (
        <div className="relative h-[75%] aspect-square">
            <button ref={buttonRef} onClick={() => setShowPicker((prev) => !prev)} style={{ backgroundColor: color }} className="relative w-full h-full drop-shadow-2xl">
                <div className="bg-black w-full h-full opacity-0 hover:opacity-30 transition flex justify-center items-center">
                    <h1 className="font-bold text-[min(2.2vw,1rem)]">{color}</h1>
                </div>
            </button>

            {showPicker &&
            <div ref={pickerRef} className="absolute left-1/2 mt-2 -translate-x-1/2 z-50">
                <HexColorPicker className="max-h-[21vw] max-w-[21vw] aspect-square" onChange={(newColor) => {
                    const newTracks = [...colors.tracks]
                    newTracks[id] = newColor
                    setColors({...colors, tracks: newTracks})
                }}/>
            </div>}   
        </div>
    )
}