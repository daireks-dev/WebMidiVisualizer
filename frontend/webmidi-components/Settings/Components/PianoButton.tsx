'use client';
import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import BlackKey from "./BlackKey";
import WhiteKey from "./WhiteKey";
import SquareSpacer from "./SquareSpacer";

type Theme = {
  active: boolean,
  track_colors: string[];
  bg_colors: string[];
  key_colors: string[];
  xZoom: number;
  yPadding: number;
};

interface ButtonProps {
  currentTheme: Theme;
  setCurrentTheme: (t: Theme) => void;
}

export default function PianoButton({ currentTheme, setCurrentTheme }: ButtonProps) {
  const [showWhitePicker, setShowWhitePicker] = useState(false);
  const [showBlackPicker, setShowBlackPicker] = useState(false);

  const whitePickerRef = useRef<HTMLDivElement>(null);
  const blackPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        whitePickerRef.current &&
        !whitePickerRef.current.contains(event.target as Node)
      ) {
        setShowWhitePicker(false);
      }
      if (
        blackPickerRef.current &&
        !blackPickerRef.current.contains(event.target as Node)
      ) {
        setShowBlackPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full relative">
      <div className="relative h-full flex items-center gap-1.5">
        <div className="h-[75%] aspect-square">
          <div className="relative h-full w-[calc(200%+6px)]">
            
            {/* White keys */}
            <div className="absolute w-full h-full flex gap-1.5 z-0 pointer-events-none">
              {Array.from({ length: 7 }).map((_, i) => (
                <WhiteKey
                  key={i}
                  color={currentTheme.key_colors[0]}
                  onClick={() => setShowWhitePicker(true)}
                />
              ))}
            </div>

            {/* Black keys */}
            <div className="absolute w-full h-full flex gap-1.5 z-15 left-[calc(((100%+3px)/7)/2)] pointer-events-none">
              <BlackKey color={currentTheme.key_colors[1]} onClick={() => setShowBlackPicker(true)} />
              <BlackKey color={currentTheme.key_colors[1]} onClick={() => setShowBlackPicker(true)} />
              <div className="flex-1" />
              <BlackKey color={currentTheme.key_colors[1]} onClick={() => setShowBlackPicker(true)} />
              <BlackKey color={currentTheme.key_colors[1]} onClick={() => setShowBlackPicker(true)} />
              <BlackKey color={currentTheme.key_colors[1]} onClick={() => setShowBlackPicker(true)} />
              <div className="flex-1" />
            </div>

          </div>
        </div>

        <SquareSpacer isVisible={false} />
      </div>

      {/* White key picker */}
      {showWhitePicker && (
        <div
          ref={whitePickerRef}
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50"
        >
          <HexColorPicker
            color={currentTheme.key_colors[0]}
            onChange={(newColor) => {
              const newKeys = [...currentTheme.key_colors];
              newKeys[0] = newColor;
              setCurrentTheme({ ...currentTheme, key_colors: newKeys });
            }}
            className="max-h-[21vw] max-w-[21vw] aspect-square"
          />
        </div>
      )}

      {/* Black key picker */}
      {showBlackPicker && (
        <div
          ref={blackPickerRef}
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-60"
        >
          <HexColorPicker
            color={currentTheme.key_colors[1]}
            onChange={(newColor) => {
              const newKeys = [...currentTheme.key_colors];
              newKeys[1] = newColor;
              setCurrentTheme({ ...currentTheme, key_colors: newKeys });
            }}
            className="max-h-[21vw] max-w-[21vw] aspect-square"
          />
        </div>
      )}
    </div>
  );
}
