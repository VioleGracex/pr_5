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
      { top: '0', left: '0' },
      { top: '0', right: '0' },
      { bottom: '0', left: '0' },
      { bottom: '0', right: '0' },
      { top: '50%', left: '0', transform: 'translateY(-50%)' },
      { top: '0', left: '50%', transform: 'translateX(-50%)' },
      { bottom: '50%', left: '0', transform: 'translateY(50%)' },
      { bottom: '0', left: '50%', transform: 'translateX(-50%)' }
    ];

    // Draw points around the border
    points.forEach(point => {
      const pointElement = document.createElement('div');
      pointElement.style.position = 'absolute';
      pointElement.style.width = '4px'; // Adjust point size as needed
      pointElement.style.height = '4px'; // Adjust point size as needed
      pointElement.style.backgroundColor = 'black'; // Adjust point color as needed
      pointElement.style.borderRadius = '50%'; // Make points circular
      pointElement.style.top = point.top || '0'; // Use default value if top is undefined
      pointElement.style.left = point.left || '0'; // Use default value if left is undefined
      pointElement.style.right = point.right || '0'; // Use default value if right is undefined
      pointElement.style.bottom = point.bottom || '0'; // Use default value if bottom is undefined
      pointElement.style.transform = point.transform || ''; // Use default value if transform is undefined
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

