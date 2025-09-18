'use client';
import { Slider } from "@/components/ui/slider"
import SquareSpacer from "./SquareSpacer"

interface Props {
    setXStretch: React.Dispatch<React.SetStateAction<number>>,
    setYPadding: React.Dispatch<React.SetStateAction<number>>,
    xStretch: number,
    yPadding: number
}

export default function TwoSlider({setXStretch, setYPadding, xStretch, yPadding}: Props) {
    return (
        <div className="h-full flex items-center gap-1.5"> 
            <div className="h-[75%] aspect-square">
                <div className="h-full w-[calc(200%+6px)] flex flex-col justify-around">
                    <Slider min={0.5} max={20} step={0.5} value={[xStretch]} onValueChange={(val) => setXStretch(val[0])}/>
                    <Slider min={0} max={100} step={1} value={[yPadding]} onValueChange={(val) => setYPadding(val[0])}/>
                </div>
            </div>
            <SquareSpacer isVisible={false}/>
        </div>
    )
}