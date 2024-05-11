import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import createSquareGrid from './SquareGrid'; // Import the createSquareGrid function
import '../PanelsCss/Layer.css';
import Token from '@/app/Components/tools/Objects/Token';
import { addActivity } from '@/app/Panels/ConsoleBar'; // Import addActivity function
import { getGlobalActiveTool } from '@/app/Components/tools/InstrumentsTools/ToolPanel';
import createToken from "./TokenCreator";

interface Props {
  size?: number; // Size of each tile (default is 150)
  scaleFactor: number; // Scale factor for adjusting coordinates
}

const Layer: React.FC<Props> = ({ size = 150, scaleFactor }) => {
  // Generate a unique ID for each layer
  const layerId = uuidv4();

  const layerRef = useRef<HTMLCanvasElement>(null);
  const [tokens, setTokens] = useState<React.ReactNode[]>([]);

  // Function to start activity on keydown event
  const handleKeyDown = (event: KeyboardEvent) => {
    const activeTool = getGlobalActiveTool();
    if (activeTool) {
      switch (activeTool) {
        case 'Building Tool':
          if (event.key === 'Enter') {
            addActivity('Finish building');
            // finishBuilding();
          }
          break;
        default:
          addActivity(`Selected ${activeTool}`);
          break;
      }
    } else {
      addActivity('Error Using Tool not found');
    }
  };

  // Function to start activity on mousedown event
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    addActivity('Mousedown event occurred on layer');
    startactivity(event);
  };

  // Function to start activity
  const startactivity = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const activeTool = getGlobalActiveTool();

    if (activeTool) {
      switch (activeTool) {
        case 'Pencil':
          addActivity(`Used ${activeTool} Pen`);
          // startPencilDrawing(event);
          break;
        case 'NPC Token':
          if (event.button === 0) {
            createToken(event, 'npc', layerRef, tokens, setTokens, scaleFactor);
          }
          break;
        case 'Item Token':
          if (event.button === 0) {
            // createItemToken(event);
          }
          break;
        case 'Move Tool':
          // Implement move tool functionality
          break;
        case 'Cursor Tool':
          // setActiveElement(null);
          // setActiveToken(null);
          break;
        case 'Building Tool':
          if (event.button === 0) {
            // Left-click on the canvas
            // const canvas = canvasRef.current;
            /* if (canvas) {
              // Start creating building placing points
              // createBuilding(event);
            } */
          } else if (event.button === 2) {
            // Right-click: Cancel building construction by clearing all points
            // clearCurrentBuildingPoints();
          }
          break;
        case 'RGB': // Random Generated Building
          if (event.button === 0) {
            addActivity(`Used ${activeTool} Tool`);
            // createRandomBuildingNearCursor(event); // Call the function to generate shape with
          }
          break;
        default:
          addActivity(`Selected ${activeTool}`);
          break;
      }
    } else {
      addActivity('Error Using Tool not found');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Added an empty dependency array to run the effect only once when the component mounts


  useEffect(() => {
    const canvas = layerRef.current;
  
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        // Render grid
        createSquareGrid(size);
  
        // Render tokens
        tokens.forEach((token) => {
          if (React.isValidElement(token)) {
            const { x = 0, y = 0 } = token.props;
            // Draw token at scaled coordinates
            // context.drawImage(defaultImage, scaledX, scaledY, 50, 50);
          }
        });
      }
    }
  }, [tokens, size]); // Include tokens and size in the dependency array to re-render when they change
  
  
  return (
    <canvas
      id={`layer-${layerId}`}
      className="layer"
      onMouseDown={handleMouseDown}
      tabIndex={0} // This makes the canvas focusable and enables keydown events
      ref={layerRef} // Attach the ref to the canvas element
    >
    </canvas>
  );
  
};

export default Layer;
