'use client';
import BlackKey from "./BlackKey"
import SquareSpacer from "./SquareSpacer"
import WhiteKey from "./WhiteKey"

interface ButtonProps {
  topColor: string,
  bottomColor: string
}

export default function PianoButton({topColor, bottomColor}: ButtonProps) {
    return (
        <div className="h-full flex items-center gap-1.5"> 
            <div className="h-[75%] aspect-square">
                <div className="relative h-full w-[calc(200%+6px)]">
                    <div className="absolute w-full h-full flex gap-1.5 z-0">
                        <WhiteKey color={topColor}/>
                        <WhiteKey color={topColor}/>
                        <WhiteKey color={topColor}/>
                        <WhiteKey color={topColor}/>
                        <WhiteKey color={topColor}/>
                        <WhiteKey color={topColor}/>
                        <WhiteKey color={topColor}/>
                    </div>
                    <div className="pointer-events-none absolute w-full h-full flex gap-1.5 z-10 left-[calc(((100%+3px)/7)/2)]">
                        <BlackKey color={bottomColor}/>
                        <BlackKey color={bottomColor}/>
                        <div className="flex-1"/>
                        <BlackKey color={bottomColor}/>
                        <BlackKey color={bottomColor}/>
                        <BlackKey color={bottomColor}/>
                        <div className="flex-1"/>
                    </div>
                </div>
            </div>
            <SquareSpacer isVisible={false}/>
        </div>
    )
}