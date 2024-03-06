// usePalette.tsx
import { addActivity } from "@/app/Panels/ConsoleBar";
import { getGlobalActiveTool, setGlobalActiveTool } from "../ToolPanel";
import {
  togglePalettePanelVisibility,
} from '../../../state/panelVisibility';

let isPaletteVisibleState: boolean = false;

export const getIsPaletteVisibleState = (): boolean | false => isPaletteVisibleState;

export const setIsPaletteVisibleState = (b: boolean): void => {
  isPaletteVisibleState = b;
  addActivity(`Selected global tool: ${isPaletteVisibleState}`);
};

function setIsPaletteVisible(value: boolean): void {
  isPaletteVisibleState = value;
}

function usePalette(): void {
  isPaletteVisibleState = !isPaletteVisibleState;
  togglePalettePanelVisibility(isPaletteVisibleState);
  addActivity(`set palette to ${isPaletteVisibleState}`);
}

export { usePalette, isPaletteVisibleState, setIsPaletteVisible };
