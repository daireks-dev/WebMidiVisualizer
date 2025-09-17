"use client";
// pages/index.js
import { useState } from "react";
import MidiSettings from "../components/Old/MidiSettings";
import Visualizer from "../components/Old/Visualizer";
import { ColorPicker } from "@/components/ui/shadcn-io/color-picker";

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center p-4">
      <Visualizer/>
      <MidiSettings/>
    </div>
  );
}
