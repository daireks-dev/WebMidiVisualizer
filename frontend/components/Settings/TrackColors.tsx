'use client';
import ColorButton from "./Components/ColorButton";
import SquareLabel from "./Components/SquareLabel";

export default function TrackColors() {
    return (
        <div className="w-[97%] flex-1 border-b-1 border-[#5f5f5f] flex items-center gap-1.5">
            <SquareLabel text="track_colors"/>
            <ColorButton color="#B9CBEE"/>
            <ColorButton color="#E8E7AE"/>
            <ColorButton color="#B9F3C5"/>
            <ColorButton color="#C3B1FF"/>
            <ColorButton color="#EDAA9D"/>
        </div>
    )
}