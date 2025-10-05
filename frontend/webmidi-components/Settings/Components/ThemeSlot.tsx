import { useEffect, useRef, useState } from "react"

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
    setCurrentTheme: (t: Theme) => void,
    slotNumber: number,
    themes: Theme[],
    setThemes: (t: Theme[]) => void,
    userId: string
}

const emptyTheme = {
    active: false,
    track_colors: ["#000000", "#000000", "#000000", "#000000", "#000000"],
    bg_colors: ["#FFFFFF", "#000000"],
    key_colors: ["#FFFFFF", "#555555", "#FFFFFF", "#000000", "#FFFFFF", "#FFFFFF", "#000000", "#FFFFFF", "#000000", "#FFFFFF", "#000000", "#FFFFFF"],
    xZoom: 5,
    yPadding: 5
}

export default function ThemeSlot({currentTheme, setCurrentTheme, slotNumber, themes, setThemes, userId}: Props) {
    useEffect(() => {
        console.log(themes)
    }, [])

    useEffect(() => {
        const themeAtSlot = themes[slotNumber];
        console.log(themeAtSlot)
        if (themeAtSlot) {
            setIsEmpty(!themeAtSlot.active);
            setSlotName(themeAtSlot.active ? "" : "empty");
        }
    }, [themes]);

    const [isEmpty, setIsEmpty] = useState(true)
    const [slotName, setSlotName] = useState("empty")
    const noteOrder = useRef([
        Math.floor(Math.random() * 5), 
        Math.floor(Math.random() * 5), 
        Math.floor(Math.random() * 5), 
        Math.floor(Math.random() * 5), 
        Math.floor(Math.random() * 5)
    ])

    async function saveSettings(newThemes: Theme[]) {
        if (!userId) return;

        const newSettings = {
            themes: newThemes
        };

        console.log("Saving this: " + JSON.stringify(newSettings))

        await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
        });
    }

    function onSlotClick() {
        if (isEmpty) {
            setIsEmpty(false)
            setSlotName("")
            noteOrder.current = [
                Math.floor(Math.random() * 5), 
                Math.floor(Math.random() * 5), 
                Math.floor(Math.random() * 5), 
                Math.floor(Math.random() * 5), 
                Math.floor(Math.random() * 5)
            ]
            
            let newThemes = [...themes]
            newThemes[slotNumber] = currentTheme
            setThemes(newThemes)

            saveSettings(newThemes)
        }
        else {
            setCurrentTheme(themes[slotNumber])
        }
    }

    function onDeleteClick() {
        if (!isEmpty) {
            setIsEmpty(true)
            setSlotName("empty")

            let newThemes = [...themes]
            newThemes[slotNumber] = emptyTheme 
            setThemes(newThemes)

            saveSettings(newThemes)
        }
    }

    return (
        <div  className="relative flex-1 h-full flex justify-center items-center border-1 border-[#888888] hover:border-blue-400 transition group">
            <button onClick={onSlotClick} className="w-full h-full"></button>
            <h1 className="absolute z-10 text-[min(2.2vh,2.2vw,1rem)] pointer-events-none">{slotName}</h1>
            {!isEmpty &&
                <div 
                    className="absolute bg-gradient-to-b from-green-400 to-blue-400 h-full w-full opacity-40 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, ${themes[slotNumber]["bg_colors"][0]}, ${themes[slotNumber]["bg_colors"][1]})`,
                    }}
                />
                
            }
            {!isEmpty &&
                <div className="absolute w-full h-full flex flex-row pointer-events-none">
                    {
                        themes[slotNumber]["track_colors"].map((color, index) => (
                        <div
                            className="bg-white flex-1 h-[20%] z-10 opacity-40 pointer-events-none"
                            style={{
                                backgroundColor: color,
                                transform: `translateY(${100 * noteOrder.current[index]}%)`
                            }}
                        />
                        ))
                    }
                </div>
            }
            {!isEmpty &&
                <button onClick={onDeleteClick} className="flex justify-center items-center z-1 absolute z-10 aspect-square bg-[#999999] opacity-0 h-[45%] bottom-[100%] translate-y-[50%] left-[100%] translate-x-[-50%] rounded-2xl drop-shadow-2xl hover:bg-[#777777] transition group-hover:opacity-100 ">
                    <h1 className="transition text-[#EEEEEE] mb-[10%] text-[min(2.2vh,2.2vw,1rem)]">x</h1>
                </button>
            }
        </div>
    )
}