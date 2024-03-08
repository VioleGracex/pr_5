// state/ActiveElement.ts
import { getGlobalActiveTool } from "../Components/tools/ToolPanel";
import { addActivity } from "../Panels/ConsoleBar";

let activeElement: HTMLElement | null = null;
let activeBorderContainer: HTMLDivElement | null = null;
const selectionDict: Record<string, boolean> = {'NpcToken' : true}; // Dictionary to track selection status of HTML elements

const drawBorder = (element: HTMLElement) => {
  // Remove existing border container if any
  if (activeBorderContainer) {
    activeBorderContainer.remove();
    activeBorderContainer = null;
  }

  // Create a new border container
  activeBorderContainer = document.createElement('div');
  activeBorderContainer.style.position = 'absolute';
  activeBorderContainer.style.top = '0';
  activeBorderContainer.style.left = '0';
  activeBorderContainer.style.width = '100%';
  activeBorderContainer.style.height = '100%';
  element.appendChild(activeBorderContainer);

  // Create a new border with 8 points if the element is selectable
  if (selectionDict[element.id]) {
    const borderWidth = '2px'; // Adjust border width as needed
    const borderColor = 'lightblue'; // Adjust border color as needed
    const borderStyle = `solid ${borderWidth} ${borderColor}`;
    activeBorderContainer.style.border = borderStyle;
    activeBorderContainer.style.pointerEvents = 'none'; // Ensure the border doesn't interfere with mouse events

    // Create points for each corner and middle of each side
    const points = [
      { top: '-2px', left: '-2px' }, // Top-left corner
      { top: '-2px', right: '-8px' }, // Top-right corner
      { bottom: '-6px', left: '-3px' }, // Bottom-left corner
      { bottom: '-6px', right: '-8px' }, // Bottom-right corner
      { top: '50%', left: '-2px', transform: 'translateY(-50%)' }, // Left middle
      { top: '-2px', left: '50%', transform: 'translateX(-50%)' }, // Top middle
      { bottom: '-10px', left: '50%', transform: 'translateX(-50%)' }, // Bottom middle
      { top: '50%', right: '-10px', transform: 'translateY(-50%)' }, // Right middle
    ];


// Draw points around the border
points.forEach(point => {
  const pointElement = document.createElement('div');
  pointElement.style.position = 'absolute';
  pointElement.style.width = '8px'; // Adjust point size as needed
  pointElement.style.height = '8px'; // Adjust point size as needed
  pointElement.style.backgroundColor = 'black'; // Adjust point color as needed
  pointElement.style.borderRadius = '50%'; // Make points circular

    // Adjust point coordinates relative to the border container
    if (point.top !== undefined) {
      pointElement.style.top = point.top;
    }
    if (point.left !== undefined) {
      pointElement.style.left = point.left;
    }
    if (point.bottom !== undefined) {
      pointElement.style.bottom = point.bottom;
    }
    if (point.right !== undefined) {
      pointElement.style.right = point.right;
    }

    pointElement.style.transform = point.transform || ''; // Use default value if transform is undefined
    pointElement.style.transform += ' translate(-50%, -50%)'; // Center the points
    activeBorderContainer?.appendChild(pointElement);
  });
  }
};

export const setActiveElement = (element: HTMLElement | null) => {
  if (activeElement !== element) {
    activeElement = element;
    if (activeBorderContainer) {
      activeBorderContainer.remove(); // Remove existing border container if changing active element
      activeBorderContainer = null;
    }
    if (activeElement) {
      drawBorder(activeElement);
    }
  }
};

export const getActiveElement = () => {
  return activeElement;
};

// does not work  does not detect objects
/* const handleMouseDown = (event: MouseEvent) => {
  // Check if the active tool is 'Cursor Tool'
  const activeTool = getGlobalActiveTool();
  if (activeTool === 'Cursor Tool') {
    const target = event.target as HTMLElement; // Get the target element
    
    // If the clicked element is in the selection dictionary
    if (selectionDict[target.className]) {
      setActiveElement(target);
    } else {
      // Remove active borders
      if (activeBorderContainer) {
        activeBorderContainer.remove();
        activeBorderContainer = null;
      }
    }
  }
};

// Add event listener for mouse down events
document.addEventListener('mousedown', handleMouseDown); */

