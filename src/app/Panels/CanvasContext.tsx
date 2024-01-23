// CanvasContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, SetStateAction, Dispatch, useEffect } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/ToolPanel";
import { NPCTokenProps } from "../Components/tools/Objects/NPCToken";

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
  npcTokens: NPCTokenProps[];
  canvasId: string;
  selectedObject: NPCTokenProps | null;
  setSelectedObject: Dispatch<SetStateAction<NPCTokenProps | null>>;
  mousePosition: { x: number; y: number } | null;
  setMousePosition: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
  isDragging: boolean; // New property for dragging state
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
  canvasId: string;
  strokeColor: string;
}

interface Stroke {
  path: { x: number; y: number }[];
  color: string;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, canvasId, strokeColor }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");
  const [selectedObject, setSelectedObject] = useState<NPCTokenProps | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPath = useRef<{ x: number; y: number }[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [initialPoint, setInitialPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCanvasPrepared, setIsCanvasPrepared] = useState(false);
  const [npcTokens, setNpcTokens] = useState<NPCTokenProps[]>([]);

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

        // Render NPC tokens along with strokes
        npcTokens.forEach(token => {
          const { x, y } = token;
          const isSelected = selectedObject === token;

          context.fillStyle = isSelected ? "red" : "black";
          if (x !== undefined && y !== undefined) {
            context.fillRect(x - 25, y - 25, 50, 50);
            // Render NPC token content (you may use NPCToken component here if needed)
            context.fillStyle = "blue";
            context.fillText(token.name, x - 15, y + 5);
          }
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

        if (!isCanvasPrepared) {
          context.fillStyle = "grey";
          context.fillRect(0, 0, canvas.width, canvas.height);
          setIsCanvasPrepared(true);
        }

        canvas.style.zIndex = "-100";
        contextRef.current = context;
      }
    }
  };

  const startactivity = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const activeTool = getGlobalActiveTool();
    if (activeTool) {
      if (activeTool === "Pencil") {
        addActivity(`Used ${activeTool} Pen`);
        startPencilDrawing(event);
      } else if (activeTool === "NPC Token") {
        createNPCToken(event);
      } else if (activeTool === "Move Tool") {
        startDragging(event);
      } else {
        addActivity(`Selected ${activeTool}`);
        // Handle other tools if needed
      }
    } else {
      addActivity("Error Using Tool not found");
    }
  };
  

  const startPencilDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX = 0, offsetY = 0 } = event.nativeEvent;
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

  const createNPCToken = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX = 0, offsetY = 0 } = event.nativeEvent;

    // Create an NPC token
    const npcToken: NPCTokenProps = {
      name: "NPC",
      job: "Worker",
      race: "Human",
      description: "This is an NPC token",
      x: offsetX,
      y: offsetY,
      // Add other properties as needed
    };

    setNpcTokens((prevTokens) => [...prevTokens, npcToken]);
    setSelectedObject(npcToken); // Select the created NPC token
    addActivity(`Created NPC ${offsetX}`);

    // Update mouse position for rendering
    setMousePosition({ x: offsetX, y: offsetY });
  };

  const startDragging = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };
  

  const drag = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX = 500, offsetY = 500 } = event.nativeEvent || {};
  
    if (isDragging && selectedObject) {
      // Update the position of the NPC token based on mouse movement
      const newX = offsetX - dragOffset.x;
      const newY = offsetY - dragOffset.y;
  
      // Ensure the new position is within the canvas bounds
      if (canvasRef.current) {
        const maxX = canvasRef.current.width - 25;
        const maxY = canvasRef.current.height - 25;
  
        // Update NPC token position while keeping it within the canvas bounds
        setNpcTokens((prevTokens) =>
          prevTokens.map((token) =>
            token === selectedObject
              ? { ...token, x: Math.min(Math.max(newX, 25), maxX), y: Math.min(Math.max(newY, 25), maxY) }
              : token
          )
        );
      }
  
      // Log the updated position of the selected object using the callback
      setMousePosition({ x: newX, y: newY });
      addActivity(`x + y  ${newX} + ${newY}`);
    }
  };

  const finishDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);

    if (contextRef.current) {
      const { offsetX = 0, offsetY = 0 } = nativeEvent;
      const distance = Math.sqrt(
        Math.pow(offsetX - initialPoint.x, 2) + Math.pow(offsetY - initialPoint.y, 2)
      );

      contextRef.current.lineTo(offsetX, offsetY);

      const newStroke: Stroke = {
        path: [...currentPath.current],
        color: strokeColor,
      };

      if (distance < 2) {
        contextRef.current.arc(
          offsetX,
          offsetY,
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

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) {
      return;
    }

    const { offsetX = 0, offsetY = 0 } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    currentPath.current.push({ x: offsetX, y: offsetY });
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleMouseUp = () => stopDragging();
    const handleMouseMove = (event: MouseEvent) => drag(event as any);
  
    if (canvas) {
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mousemove", handleMouseMove);
  
      return () => {
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isDragging, drag, stopDragging]); // Make sure to include drag and stopDragging in the dependencies
  
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
    isDragging, // Include isDragging in the context value
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
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
