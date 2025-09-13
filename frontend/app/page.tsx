"use client";
// pages/index.js
import { useState } from "react";
import MidiSettings from "../components/MidiSettings";

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Video/rectangle preview */}
      <div className="w-full max-w-3xl bg-gray-300 relative aspect-video">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 flex items-center justify-center text-white font-bold">
          Video Preview
        </div>
      </div>

      <MidiSettings/>

    </div>
  );
}
