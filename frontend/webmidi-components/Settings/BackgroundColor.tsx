'use client';
import GradientButton from "./Components/GradientButton";
import PianoButton from "./Components/PianoButton";
import SquareLabel from "./Components/SquareLabel";
import SquareSpacer from "./Components/SquareSpacer";

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

export default function BackgroundColor({currentTheme, setCurrentTheme}: Props) {
    return (
        <div className="w-[97%] flex-1 border-b-1 border-[#5f5f5f] flex items-center gap-1.5">
            <SquareLabel text="bg_colors"/>
            <GradientButton currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} id={1}/>
            <SquareLabel text="key_colors"/>
            <PianoButton currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme}/>
        </div>
        
    )
}