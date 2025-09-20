'use client';
import GradientButton from "./Components/GradientButton";
import PianoButton from "./Components/PianoButton";
import SquareLabel from "./Components/SquareLabel";
import SquareSpacer from "./Components/SquareSpacer";

interface Props {
    colors: {tracks: string[], background: string[], keys: string[]}
    setColors: (t: {tracks: string[], background: string[], keys: string[]}) => void
}

export default function BackgroundColor({colors, setColors}: Props) {
    return (
        <div className="w-[97%] flex-1 border-b-1 border-[#5f5f5f] flex items-center gap-1.5">
            <SquareLabel text="bg_colors"/>
            <GradientButton colors={colors} setColors={setColors} id={1}/>
            <SquareLabel text="key_colors"/>
            <PianoButton colors={colors} setColors={setColors}/>
        </div>
    )
}