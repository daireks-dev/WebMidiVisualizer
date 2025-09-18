'use client';
import SplitLabel from "./Components/SplitLabel";
import TwoSlider from "./Components/TwoSlider";

interface Props {
    setXStretch: React.Dispatch<React.SetStateAction<number>>,
    setYPadding: React.Dispatch<React.SetStateAction<number>>,
    xStretch: number,
    yPadding: number
}

export default function ToggleSettings({setXStretch, setYPadding, xStretch, yPadding}: Props) {
    return (
        <div className="w-[97%] flex-1 flex items-center gap-1.5">
            <SplitLabel topText="x_stretch" bottomText="y_padding"/>
            <TwoSlider setXStretch={setXStretch} setYPadding={setYPadding} xStretch={xStretch} yPadding={yPadding}/>
            <SplitLabel topText="note_outline" bottomText="bg_lines"/>
            <TwoSlider setXStretch={setXStretch} setYPadding={setYPadding} xStretch={xStretch} yPadding={yPadding}/>
        </div>
    )
}