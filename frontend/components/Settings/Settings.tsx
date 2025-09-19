'use client';
import BackgroundColor from "../Settings/BackgroundColor";
import ToggleSettings from "./ToggleSettings";
import TrackColors from "./TrackColors";

interface Props {
    setXStretch: React.Dispatch<React.SetStateAction<number>>,
    setYPadding: React.Dispatch<React.SetStateAction<number>>,
    xStretch: number,
    yPadding: number,
    colors: {tracks: string[], background: string[], keys: string[]}
    setColors: (t: {tracks: string[], background: string[], keys: string[]}) => void
}

export default function Settings({setXStretch, setYPadding, xStretch, yPadding, colors, setColors}: Props) {
    return (
        <div className="bg-[#373737] w-full aspect-[5/3] flex flex-col items-center drop-shadow-2xl">
            <TrackColors colors={colors} setColors={setColors}/>
            <BackgroundColor colors={colors} setColors={setColors}/>
            <ToggleSettings setXStretch={setXStretch} setYPadding={setYPadding} xStretch={xStretch} yPadding={yPadding}/>
        </div>
    )
}