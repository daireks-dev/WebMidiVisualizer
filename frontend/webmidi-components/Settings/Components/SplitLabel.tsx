'use client';
interface LabelProps {
  topText: string,
  bottomText: string
}

export default function SquareLabel({topText, bottomText}: LabelProps) {
    return (

        <div className="h-[75%] aspect-square drop-shadow-2xl flex flex-col gap-1.5">
            <div className="flex-1 border-[#626262] border-1 border-dashed flex justify-center items-center">
                <h1 className="font-bold text-[min(2.2vh,2.2vw,1rem)]">{topText}</h1>
            </div>
            <div className="flex-1 border-[#626262] border-1 border-dashed flex justify-center items-center">
                <h1 className="font-bold text-[min(2.2vh,2.2vw,1rem)]">{bottomText}</h1>
            </div>
        </div>
    )
}