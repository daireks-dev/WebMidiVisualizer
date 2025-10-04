import { group } from "console";
import ThemeSlot from "./ThemeSlot";
import { useEffect } from "react";

type Theme = {
  active: boolean,
  track_colors: string[];
  bg_colors: string[];
  key_colors: string[];
  xZoom: number;
  yPadding: number;
};

interface Props {
    currentTheme: Theme,
    setCurrentTheme: (t: Theme) => void,
    groupNumber: number,
    themes: Theme[],
    setThemes: (t: Theme[]) => void,
    userId: string
}

export default function ThemeSlots({currentTheme, setCurrentTheme, groupNumber, themes, setThemes, userId}: Props) {
    useEffect(() => {
        console.log(themes)
    }, [])

    return (
        <div className="aspect-square h-[75%] flex flex-col gap-1.5">
            <ThemeSlot userId={userId} themes={themes} setThemes={setThemes} currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} slotNumber={0 + groupNumber}/>
            <ThemeSlot userId={userId} themes={themes} setThemes={setThemes} currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme} slotNumber={1 + groupNumber}/>
        </div>
    )
}