// usePalette.tsx
import { addActivity } from "@/app/Panels/ConsoleBar";
import { getGlobalActiveTool, setGlobalActiveTool } from "../ToolPanel";
import { useState } from 'react';

let isPaletteVisibleState: boolean = false;

function getIsPaletteVisible(): boolean {
  return isPaletteVisibleState;
}

function setIsPaletteVisible(value: boolean): void {
  isPaletteVisibleState = value;
}

function usePalette(): boolean {
  setIsPaletteVisible(!isPaletteVisibleState);  // Toggle the value
  addActivity(`set palette to ${isPaletteVisibleState}`);
  return getIsPaletteVisible();
}

export { usePalette, getIsPaletteVisible, setIsPaletteVisible };
