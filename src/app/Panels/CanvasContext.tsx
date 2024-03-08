// CanvasContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, SetStateAction, Dispatch, useEffect } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/ToolPanel";
import NPCToken from "../Components/tools/Objects/NPCToken";
import { setActiveElement } from "../state/ActiveElement";

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
  canvasId: string;
  selectedObject:  typeof NPCToken | null;
  setSelectedObject: Dispatch<SetStateAction< typeof NPCToken | null>>;
  mousePosition: { x: number; y: number } | null;
  setMousePosition: Dispatch<SetStateAction<{ x: number; y: number } | null>>;

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

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, canvasId, strokeColor }) => {
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
  const [scaleFactor, setScaleFactor] = useState(1); // Track the current scale factor

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        strokes.forEach(({ path, color }) => {
          context.strokeStyle = color;
          context.beginPath();
          path.forEach(point => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();
        });
      }
    }
  }, [strokes, npcTokens, selectedObject, mousePosition]);

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
  
        // Draw white background
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
  
        // Draw grid
        const gridSize = 50; // Adjust grid size as needed
        context.strokeStyle = "#ccc"; // Set grid color
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
  
        setIsCanvasPrepared(true);
        canvas.style.zIndex = "-100";
        contextRef.current = context;
      }
    }
  };
  

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
        case 'Zoom Tool':
          if (event.button === 0) {
            // Left click for zoom in
            zoomIn();
          } else if (event.button === 2) {
            // Right click for zoom out
            zoomOut();
          }
          break;
        case 'Cursor Tool':
            setActiveElement(null);
            break;  
        default:
          addActivity(`Selected ${activeTool}`);
          // Handle other tools if needed
          break;
      }
    } else {
      addActivity("Error Using Tool not found");
    }
  };  

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

  const createNPCToken = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    //const { offsetX = 0, offsetY = 0 } = event.nativeEvent;
    const offsetX = nativeEvent.clientX-30;
    const offsetY = nativeEvent.clientY-20;
    //check for panels from all sides to fix offset
    // Create a new NPC token with default values
    const newToken = (
      <NPCToken
        key={npcTokens.length} // Use a unique key for each token
        x={offsetX}
        y={offsetY}
      />
    );

    // Update the state to include the new NPC token
    setNpcTokens((prevTokens) => [...prevTokens, newToken]);

    // Log the activity (optional)
    addActivity(`Created NPC at coordinates ${offsetX}, ${offsetY}`);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
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
      }
    }
  }, [strokes, npcTokens, selectedObject, mousePosition]);

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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setStrokes([]);
        setSelectedObject(null);
        setMousePosition(null); // Reset mouse position when clearing the canvas
      }
    }
  };

  const zoomIn = () => {
    setScaleFactor(scaleFactor * 1.1); // Increase scale factor by 10%
  };

  const zoomOut = () => {
    setScaleFactor(scaleFactor / 1.1); // Decrease scale factor by 10%
  };

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
    canvasId,
    selectedObject,
    setSelectedObject,
    mousePosition,
    setMousePosition,
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
      {/* Render NPC tokens as children */}
      {npcTokens}
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
