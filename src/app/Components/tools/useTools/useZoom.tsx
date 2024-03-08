// useTools/useZoom.tsx
import { getGlobalActiveTool } from "../ToolPanel";
import { addActivity } from "@/app/Panels/ConsoleBar";

let zoomScaleFactor: number = 1;

// Function to set the zoom scale factor
export const setZoomScaleFactor = (factor: number) => {
  zoomScaleFactor = factor;
  addActivity("zoom scale " + zoomScaleFactor);
};

// Function to get the zoom scale factor
export const getZoomScaleFactor = () => {
  return zoomScaleFactor;
};

// Function to set the zoom scale of an element by its ID
export const setZoomScale = (elementId: string, scale: number) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.transform = `scale(${scale})`;
  }
};

const handleMouseDown = (event: MouseEvent) => {
    // Check if the active tool is 'Zoom Tool'
    const activeTool = getGlobalActiveTool();
    if (activeTool === 'Zoom Tool') {
      // Check if the click event occurred within the canvas area
      const canvas = document.getElementById('canvas'); // Assuming the canvas element has an ID of 'canvas'
      if (canvas && canvas.contains(event.target as Node)) {
        // Check if it's a left click
        if (event.button === 0) {
          zoomIn();
        }
        // Check if it's a right click
        else if (event.button === 2) {
          zoomOut();
        }
      }
    }
  };
  

// Function to zoom in
const zoomIn = () => {
  zoomScaleFactor *= 1.1;
  setZoomScaleFactor(zoomScaleFactor); // Increase scale factor by 10%
  setZoomScale('zoom', zoomScaleFactor); // Update scale of element with ID 'zoom'
};

// Function to zoom out
const zoomOut = () => {
  zoomScaleFactor /= 1.1;
  setZoomScaleFactor(zoomScaleFactor); // Decrease scale factor by 10%
  setZoomScale('zoom', zoomScaleFactor); // Update scale of element with ID 'zoom'
};

// Add event listener for mouse down events
document.addEventListener('mousedown', handleMouseDown);