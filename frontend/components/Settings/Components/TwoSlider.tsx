'use client';
import { Slider } from "@/components/ui/slider"
import SquareSpacer from "./SquareSpacer"

export default function TwoSlider() {
    return (
        <div className="h-full flex items-center gap-1.5"> 
            <div className="h-[75%] aspect-square">
                <div className="h-full w-[calc(200%+6px)] flex flex-col justify-around">
                    <Slider/>
                    <Slider/>
                </div>
            </div>
            <SquareSpacer isVisible={false}/>
        </div>
    )
}