'use client';
import { useEffect, useRef, useState } from "react";
import BackgroundColor from "../Settings/BackgroundColor";
import ToggleSettings from "./ToggleSettings";
import TrackColors from "./TrackColors";
import { SendToBackIcon } from "lucide-react";

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
    setThemes: (t: Theme[]) => void
}

export default function Settings({themes, setThemes, currentTheme, setCurrentTheme}: Props) {
    const [userId, setUserId] = useState("");
    const saveTimeout = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
        async function initUUID() {
        let storedId = localStorage.getItem("userId");
        //storedId = null

        // If no ID, create and POST it
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem("userId", storedId);

            console.log("Posting this: " + JSON.stringify({ 
                    id: storedId, 
                    themes: themes
                }))

            await fetch(`https://webmidi-f4545132aa0f.herokuapp.com/api/v1/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: storedId, 
                    themes: themes
                }),
            });
        }

        console.log(storedId);
        setUserId(storedId);

        // Fetch settings for this user after ensuring ID exists
        const response = await fetch(`https://webmidi-f4545132aa0f.herokuapp.com/api/v1/users/${storedId}`);
        if (response.ok) {
            const data = await response.json();
            setThemes(data.themes || []);
            console.log("GET (result below):")
            console.log(data.themes)
        } else {
            console.error('Failed to fetch user:', response.statusText);
        }
        }

        initUUID();
    }, []);
    
    return (
        <div className="bg-[#373737] w-full aspect-[5/3] flex flex-col items-center drop-shadow-2xl">
            <TrackColors currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme}/>
            <BackgroundColor currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme}/>
            <ToggleSettings userId={userId} themes={themes} setThemes={setThemes} currentTheme={currentTheme} setCurrentTheme ={setCurrentTheme}/>
        </div>
    )
}