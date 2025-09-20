"use client";
// pages/index.js
import { useState } from "react";
import MidiSettings from "../webmidi-components/Old/MidiSettings";
import Visualizer from "../webmidi-components/Old/Visualizer";

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center p-4">
      <MidiSettings/>
    </div>
  );
}
