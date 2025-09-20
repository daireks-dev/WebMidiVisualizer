'use client';
import ColorButton from "./Components/ColorButton";
import SquareLabel from "./Components/SquareLabel";

interface Props {
    colors: {tracks: string[], background: string[], keys: string[]}
    setColors: (t: {tracks: string[], background: string[], keys: string[]}) => void
}

export default function TrackColors({colors, setColors}: Props) {
    return (
        <div className="w-[97%] flex-1 border-b-1 border-[#5f5f5f] flex items-center gap-1.5">
            <SquareLabel text="track_colors"/>
            <ColorButton colors={colors} setColors={setColors} id={0}/>
            <ColorButton colors={colors} setColors={setColors} id={1}/>
            <ColorButton colors={colors} setColors={setColors} id={2}/>
            <ColorButton colors={colors} setColors={setColors} id={3}/>
            <ColorButton colors={colors} setColors={setColors} id={4}/>
        </div>
    )
}