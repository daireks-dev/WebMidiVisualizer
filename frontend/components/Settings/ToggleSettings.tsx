'use client';
import SplitLabel from "./Components/SplitLabel";
import TwoSlider from "./Components/TwoSlider";

export default function ToggleSettings() {
    return (
        <div className="w-[97%] flex-1 flex items-center gap-1.5">
            <SplitLabel topText="x_stretch" bottomText="y_padding"/>
            <TwoSlider/>
            <SplitLabel topText="note_outline" bottomText="bg_lines"/>
            <TwoSlider/>
        </div>
    )
}