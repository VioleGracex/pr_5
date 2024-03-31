// CanvasContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, SetStateAction, Dispatch, useEffect } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/ToolPanel";
import NPCToken from "../Components/tools/Objects/NPCToken";
import { getActiveNpcToken, setActiveElement, setActiveNpcToken } from "../state/ActiveElement";
import Building from "../Components/tools/Objects/Building";

interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.RefObject<CanvasRenderingContext2D | null>;
  prepareCanvas: () => void;
  startactivity: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  finishDrawing: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  draw: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  clearCanvas: () => void;
  strokes: { path: { x: number; y: number }[]; color: string }[];
  strokeColor: string;
  setStrokeColor: Dispatch<SetStateAction<string>>;
  npcTokens: React.ReactNode[];
  buildings: React.ReactNode[];
  buildingStrokes: { path: { x: number; y: number }[]; color: string }[][];
  canvasId: string;
  selectedObject:  typeof NPCToken | null;
  setSelectedObject: Dispatch<SetStateAction< typeof NPCToken | null>>;
  mousePosition: { x: number; y: number } | null;
  setMousePosition: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
  deleteNPCToken: (index: number) => void; // Define deleteNPCToken function
  deleteBuilding: (index: number) => void; // Define deleteNPCToken function
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
  canvasId: string;
  strokeColor: string;
  scaleFactor: number;
}

interface Stroke {
  path: { x: number; y: number }[];
  color: string;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, canvasId, strokeColor, scaleFactor }) => {
//#region [consts]
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");
  const [selectedObject, setSelectedObject] = useState< typeof NPCToken | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPath = useRef<{ x: number; y: number }[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [initialPoint, setInitialPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCanvasPrepared, setIsCanvasPrepared] = useState(false);
  const [npcTokens, setNpcTokens] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
  const [buildings, setBuildings] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
  const [currentBuildingPoints, setCurrentBuildingPoints] = useState<{ x: number; y: number }[]>([]); // New state to store building points
  const [buildingStrokes, setBuildingStrokes] = useState<{ path: { x: number; y: number }[]; color: string }[][]>([]);
//#endregion


  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && !isCanvasPrepared) {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
  
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(2, 2);
        context.lineCap = "round";
        context.lineWidth = 5;
  
        setIsCanvasPrepared(true);
        canvas.style.zIndex = "-100";
        contextRef.current = context;
      }
    }
  };
  

//#region [Buttons]
  const startactivity = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const activeTool = getGlobalActiveTool();
    if (activeTool) {
      switch (activeTool) {
        case 'Pencil':
          addActivity(`Used ${activeTool} Pen`);
          startPencilDrawing(event);
          break;
        case 'NPC Token':
          createNPCToken(event);
          break;
        case 'Move Tool':
          // Implement move tool functionality
          break;
        case 'Cursor Tool':
            setActiveElement(null);
            setActiveNpcToken(null);
            break;  
        case 'Building Tool':
          if (event.button === 0) {
            // Left-click on the canvas
            const canvas = canvasRef.current;
            if (canvas) {
              const { offsetX = 0, offsetY = 0 } = event.nativeEvent;
              // Start creating building placing points
              createBuilding(event);
            }
          } else if (event.button === 2) {
            // Right-click: Cancel building construction by clearing all points
            clearCurrentBuildingPoints();
          }
          
          break;
        default:
          addActivity(`Selected ${activeTool}`);
          break;
      }
    } else {
      addActivity("Error Using Tool not found");
    }
  };  

  const handleKeyDown = (event: KeyboardEvent) => {
    const activeTool = getGlobalActiveTool();
    if (activeTool) {
      switch (activeTool) {
        case 'Building Tool':
          if(event.key == "Enter")
          {
            addActivity("Finish building");
            finishBuilding();
          }
          break;
        default:
          addActivity(`Selected ${activeTool}`);
          break;
      }
    } else {
      addActivity("Error Using Tool not found");
    }
  };  
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [addActivity]);

//#endregion


  const createNPCToken = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    
    if (!canvas) return;
  
    // Get the bounding rectangle of the canvas
    const canvasRect = canvas.getBoundingClientRect();
  
    // Calculate the offset of the mouse event relative to the canvas
    /* const offsetX = nativeEvent.clientX - canvasRect.left - window.scrollX;
    const offsetY = nativeEvent.clientY - canvasRect.top - window.scrollY; */
    const offsetX = nativeEvent.clientX - window.scrollX;
    const offsetY = nativeEvent.clientY - window.scrollY;
  
    // Adjust the offset based on the scale factor
    const scaledOffsetX = (offsetX / scaleFactor) - 30;
    const scaledOffsetY = (offsetY / scaleFactor) - 20;
  
    // Create a new NPC token with adjusted coordinates
    const newToken = (
      <NPCToken
        key={npcTokens.length} // Use a unique key for each token
        x={scaledOffsetX}
        y={scaledOffsetY}
      />
    );
  
    // Update the state to include the new NPC token
    setNpcTokens((prevTokens) => [...prevTokens, newToken]);
  
    // Log the activity (optional)
    addActivity(`Created NPC at coordinates ${scaledOffsetX}, ${scaledOffsetY}`);
    addActivity("wa");
  };
  
  const createBuilding = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (nativeEvent.button !== 0) {
        // Right mouse click: Delete all points of the building currently under construction
        clearCurrentBuildingPoints();
        return;
    }

    const { offsetX = 0, offsetY = 0 } = nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };

    // Render the point on the canvas
    const pointRadius = 3; // Adjust the radius of the point as needed
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
        context.beginPath();
        context.arc(offsetX, offsetY, pointRadius, 0, Math.PI * 2);
        context.fillStyle = 'blue'; // Adjust the color of the point as needed
        context.fill();
       // context.closePath();
    }

    const prevPoint = currentBuildingPoints[currentBuildingPoints.length - 1];
    // Draw a line between the new point and the last point (if exists)
    if (currentBuildingPoints.length > 0 && context) {
       
        context.beginPath();
        context.moveTo(prevPoint.x, prevPoint.y);
        context.lineTo(offsetX, offsetY);
        context.strokeStyle = 'blue'; // Adjust line color
        context.stroke();
        addActivity("CREATED STROKE ");
    }

    // Update buildingStrokes state to include the new line segment
    setBuildingStrokes((prevStrokes) => [
        ...prevStrokes,
        [{ path: [prevPoint, newPoint], color: 'blue' }]
    ]);

    // Push the new point into the points array
    setCurrentBuildingPoints((prevPoints) => [...prevPoints, newPoint]);
};

  // Function to clear the points of the building currently under construction
  const clearCurrentBuildingPoints = () => {
    setCurrentBuildingPoints([]);
  };
  
  
  // Function to finish building creation
  const finishBuilding = () => {
    if (currentBuildingPoints.length < 2) {
      // Building requires at least two points
      return;
    }

    // Close the building shape by connecting the last point to the first
    const closedBuildingPoints = [...currentBuildingPoints, currentBuildingPoints[0]];

    // Create a new Building object with the closed points
    const newBuilding = (
      <Building
        key={buildings.length} // Use a unique key for each building
        points={closedBuildingPoints}
      />
    );
    setBuildings([...buildings, newBuilding]);

    // Clear the current building points
    setCurrentBuildingPoints([]);

    // Log the activity
    addActivity("Building created");
  };

//#region drawing
const startPencilDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
  const { offsetX = 0, offsetY = 0 } = nativeEvent;
  if (contextRef.current) {
    contextRef.current.strokeStyle = strokeColor;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setInitialPoint({ x: offsetX, y: offsetY });

    // Create a new path for the current stroke
    currentPath.current = [{ x: offsetX, y: offsetY }];
  }
};
  // Inside the draw function
const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
  if (!isDrawing || !contextRef.current) {
    return;
  }

  const { offsetX = 0, offsetY = 0 } = nativeEvent;
  const scaledOffsetX = offsetX / scaleFactor;
  const scaledOffsetY = offsetY / scaleFactor;
  
  contextRef.current.lineTo(scaledOffsetX, scaledOffsetY);
  contextRef.current.stroke();

  currentPath.current.push({ x: scaledOffsetX, y: scaledOffsetY });
};

// Inside the finishDrawing function
const finishDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
  setIsDrawing(false);

  if (contextRef.current) {
    const offsetX = nativeEvent.clientX;
    const offsetY = nativeEvent.clientY;
    const distance = Math.sqrt(
      Math.pow(offsetX - initialPoint.x, 2) + Math.pow(offsetY - initialPoint.y, 2)
    );

    const scaledOffsetX = offsetX / scaleFactor;
    const scaledOffsetY = offsetY / scaleFactor;

    contextRef.current.lineTo(scaledOffsetX, scaledOffsetY);

    const newStroke: Stroke = {
      path: [...currentPath.current],
      color: strokeColor,
    };

    if (distance < 2) {
      contextRef.current.arc(
        scaledOffsetX,
        scaledOffsetY,
        contextRef.current.lineWidth / 2,
        0,
        Math.PI * 2
      );
      contextRef.current.fill();
    } else {
      contextRef.current.stroke();
      setStrokes((prevStrokes) => [...prevStrokes, newStroke]);
    }
  }
};
//#endregion

//#region deletion
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        //context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        const gridSize = 50; // Adjust grid size as needed
        context.strokeStyle = "#201e1e"; // Set grid color
        for (let x = gridSize; x < canvas.width; x += gridSize) {
          for (let y = gridSize; y < canvas.height; y += gridSize) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
          }
        }
        setStrokes([]);
        setSelectedObject(null);
        setMousePosition(null); // Reset mouse position when clearing the canvas
      }
    }
  };

  const deleteNPCToken = (index: number) => {
    setNpcTokens((prevTokens) => prevTokens.filter((_, i) => i !== index));
    // Optionally, you can add additional cleanup logic here if needed
  };

  const deleteBuilding = (index: number) => {
    setBuildings((prevTokens) => prevTokens.filter((_, i) => i !== index));
    // Optionally, you can add additional cleanup logic here if needed
  };
//#endregion

//#region Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) 
    {
      const context = canvas.getContext("2d");
      if (context) {
        //rendering bg  HERE ! make grid here
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
  
        // Render NPC tokens
        npcTokens.forEach((token) => {
          if (React.isValidElement(token)) {
            const { x = 0, y = 0 } = token.props;
            const scaledX = x * scaleFactor;
            const scaledY = y * scaleFactor;
            // Draw NPC token at scaled coordinates
            // context.drawImage(defaultImage, scaledX, scaledY, 50, 50);
          }
        });
        
        // Render strokes
        strokes.forEach(({ path, color }) => {
          context.strokeStyle = color;
          context.beginPath();
          path.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();
        });
  
        // Render building points
        currentBuildingPoints.forEach(({ x, y }) => {
          const pointRadius = 3; // Adjust the radius of the point as needed
          context.beginPath();
          context.arc(x, y, pointRadius, 0, Math.PI * 2);
          context.fillStyle = 'blue'; // Adjust the color of the point as needed
          context.fill();
          context.closePath();
        });
      }
      
      // Inside the useEffect hook where you're rendering building strokes
      buildingStrokes.forEach((buildingStroke) => {
      
        buildingStroke.forEach(({ path, color }) => {
          if(context)
          {
            /* context.beginPath();
            context.moveTo(path[0].x, path[0].y);
            path.slice(1).forEach(point => {
                context.lineTo(point.x, point.y);
            });
            context.strokeStyle = color;
            context.stroke(); */
          }
        });     
      });

    }

  }, [strokes, npcTokens, selectedObject, mousePosition, currentBuildingPoints, buildingStrokes]);

//#endregion

  // Update the context value to include isDragging
  const contextValue: CanvasContextProps = {
    canvasRef,
    contextRef,
    prepareCanvas,
    startactivity,
    finishDrawing,
    clearCanvas,
    draw,
    strokes,
    strokeColor,
    setStrokeColor: setCurrentColor,
    npcTokens,
    buildings,
    buildingStrokes,
    canvasId,
    selectedObject,
    setSelectedObject,
    mousePosition,
    setMousePosition,
    deleteNPCToken,
    deleteBuilding,
  };

  return (
    <CanvasContext.Provider value={contextValue}>
     {/* <div style={{position: 'absolute'}}> {children}
      {/* Render NPC tokens as children }
      {npcTokens}</div> */}
      {children}
      {npcTokens}
      {buildings}
     
    </CanvasContext.Provider>
  );
};

export const useCanvas = (canvasId: string) => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error(`useCanvas must be used within a CanvasProvider with canvasId ${canvasId}`);
  }
  return context;
};
