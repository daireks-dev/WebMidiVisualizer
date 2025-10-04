'use client';
import ColorButton from "./Components/ColorButton";
import SquareLabel from "./Components/SquareLabel";

type Theme = {
  active: boolean,
  track_colors: string[];
  bg_colors: string[];
  key_colors: string[];
  xZoom: number;
  yPadding: number;
};

interface Props {
    currentTheme: Theme
    setCurrentTheme: (t: Theme) => void
}

export default function TrackColors({currentTheme, setCurrentTheme}: Props) {
    return (
        <div className="w-[97%] flex-1 border-b-1 border-[#5f5f5f] flex items-center gap-1.5">
            <SquareLabel text="track_colors"/>
            <ColorButton currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} id={0}/>
            <ColorButton currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} id={1}/>
            <ColorButton currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} id={2}/>
            <ColorButton currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} id={3}/>
            <ColorButton currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} id={4}/>
        </div>
    )
}