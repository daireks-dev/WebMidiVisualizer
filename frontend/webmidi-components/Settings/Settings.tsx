'use client';
import { useEffect, useRef, useState } from "react";
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

            await fetch(`http://localhost:8080/api/v1/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: storedId, 
                    xZoom: xStretch, 
                    yPadding: yPadding,
                    trackColors: colors["tracks"], 
                    backgroundColors: colors["background"],
                    keyColors: colors["keys"]
                }),
            });
        }

        console.log(storedId);
        setUserId(storedId);

        // Fetch settings for this user after ensuring ID exists
        const response = await fetch(`http://localhost:8080/api/v1/users/${storedId}`);
        if (response.ok) {
            const data = await response.json();
            setColors({tracks: data.trackColors, keys: data.keyColors, background: data.backgroundColors});
            setXStretch(data.xZoom);
            setYPadding(data.yPadding);
        }
        }

        initUUID();
    }, []);

    async function saveSettings() {
        if (!userId) return;

        const newSettings = {
            xZoom: xStretch, 
            yPadding: yPadding, 
            trackColors: colors["tracks"], 
            backgroundColors: colors["background"],
            keyColors: colors["keys"]
        };

        await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
        });

    }

    useEffect(() => {
        if (!userId) return;

        // clear previous timeout if exists
        if (saveTimeout.current) clearTimeout(saveTimeout.current);

        // schedule a new save in 2 seconds
        saveTimeout.current = setTimeout(() => {
        saveSettings();
        }, 2000);

        // optional cleanup on unmount
        return () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        };
    }, [xStretch, yPadding, colors, userId]);
    
    return (
        <div className="bg-[#373737] w-full aspect-[5/3] flex flex-col items-center drop-shadow-2xl">
            <TrackColors colors={colors} setColors={setColors}/>
            <BackgroundColor colors={colors} setColors={setColors}/>
            <ToggleSettings setXStretch={setXStretch} setYPadding={setYPadding} xStretch={xStretch} yPadding={yPadding}/>
        </div>
    )
}