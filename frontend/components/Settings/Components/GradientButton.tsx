'use client';
import SquareSpacer from "./SquareSpacer"

interface ButtonProps {
  topColor: string,
  bottomColor: string
}

export default function GradientButton({topColor, bottomColor}: ButtonProps) {
    return (
        <div className="h-full flex items-center gap-1.5"> 
            <div className="h-[75%] aspect-square">
                <div className="h-full w-[calc(200%+6px)] flex flex-col gap-1.5">
                    <button style={{ backgroundColor: topColor }} className="flex-1 drop-shadow-2xl">
                        <div className="bg-black w-full h-full opacity-0 hover:opacity-30 transition flex justify-center items-center">
                            <h1 className="font-bold text-[min(2.2vw,1rem)]">{topColor}</h1>
                        </div>
                    </button>

                    <button style={{ backgroundColor: bottomColor }} className="flex-1 drop-shadow-2xl">
                        <div className="bg-black w-full h-full opacity-0 hover:opacity-30 transition flex justify-center items-center">
                            <h1 className="font-bold text-[min(2.2vw,1rem)]">{bottomColor}</h1>
                        </div>
                    </button>
                </div>
            </div>
            <SquareSpacer isVisible={false}/>
        </div>
    )
}