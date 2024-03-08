// useTools/useZoom.tsx
import { useState } from "react";
import { getGlobalActiveTool } from "../ToolPanel";
import { addActivity } from "@/app/Panels/ConsoleBar";

let zoomScaleFactor: number = 1;

// Function to set the zoom scale factor
export const setZoomScaleFactor = (factor: number) => {
  zoomScaleFactor = factor;
};

// Function to get the zoom scale factor
export const getZoomScaleFactor = () => {
  return zoomScaleFactor;
};

const handleMouseDown = (event: MouseEvent) => {
  // Check if the active tool is 'Zoom Tool'
  const activeTool = getGlobalActiveTool();
  if (activeTool === 'Zoom Tool') {
    // If the clicked element is in the selection dictionary
    
    const zoomIn = () => {
      setZoomScaleFactor(zoomScaleFactor * 1.1); // Increase scale factor by 10%
    };

    const zoomOut = () => {
      setZoomScaleFactor(zoomScaleFactor / 1.1); // Decrease scale factor by 10%
    };
  }
};

// Add event listener for mouse down events
document.addEventListener('mousedown', handleMouseDown);
