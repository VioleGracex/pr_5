// usePalette.tsx
import { addActivity } from "@/app/Panels/ConsoleBar";
import { getGlobalActiveTool, setGlobalActiveTool } from "../ToolPanel";
import { useState } from 'react';
import Home from "@/app/page";

let isPaletteVisibleState: string = "false";

export const getIsPaletteVisibleState = (): string | "false" => isPaletteVisibleState;

export const setIsPaletteVisibleState = (b: string): void => {
  isPaletteVisibleState = b;
  addActivity(`Selected global tool: ${isPaletteVisibleState}`);
};
//let isPaletteVisibleState: boolean = false;

/* function getIsPaletteVisible(): boolean {
  return isPaletteVisibleState;
} */

function setIsPaletteVisible(value: string): void {
  isPaletteVisibleState = "true";
}

function usePalette(): string {
  if(isPaletteVisibleState == "true" )
  {
    setIsPaletteVisibleState("false");
  }
  else
  {
    setIsPaletteVisibleState("true");
  }
    // Toggle the value
  addActivity(`set palette to ${isPaletteVisibleState}`);
  return getIsPaletteVisibleState();
}

export { usePalette, isPaletteVisibleState, setIsPaletteVisible };
