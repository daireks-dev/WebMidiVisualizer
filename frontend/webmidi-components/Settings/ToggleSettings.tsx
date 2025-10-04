'use client';
import { useEffect } from "react";
import SplitLabel from "./Components/SplitLabel";
import SquareLabel from "./Components/SquareLabel";
import ThemeSlots from "./Components/ThemeSlots";
import TwoSlider from "./Components/TwoSlider";

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
    themes: Theme[],
    setThemes: (t: Theme[]) => void,
    userId: string
}

export default function ToggleSettings({currentTheme, setCurrentTheme, themes, setThemes, userId}: Props) {
    useEffect(() => {
        console.log(themes)
    }, []) 
    
    return (
        <div className="w-[97%] flex-1 flex items-center gap-1.5">
            <SplitLabel topText="x_stretch" bottomText="y_padding"/>
            <TwoSlider currentTheme={currentTheme} setCurrentTheme={setCurrentTheme}/>
            <SquareLabel text="themes"/>
            <ThemeSlots userId={userId} themes={themes} setThemes={setThemes} currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} groupNumber={0}/>
            <ThemeSlots userId={userId} themes={themes} setThemes={setThemes} currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} groupNumber={2}/>
        </div>
    )
}