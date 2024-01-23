// CanvasContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, SetStateAction, Dispatch, useEffect } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/ToolPanel";
import { NPCTokenProps } from "../Components/tools/Objects/NPCToken";

interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.RefObject<CanvasRenderingContext2D | null>;
  prepareCanvas: () => void;
  startDrawing: (event: React.MouseEvent<HTMLCanvasElement>) => void;
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

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const activeTool = getGlobalActiveTool();
    if (activeTool) {
      if (activeTool === "Pencil") {
        addActivity(`Used ${activeTool} Pen`);
        startPencilDrawing(event);
      } else if (activeTool === "NPC Token") {
        createNPCToken(event);
      } else if (activeTool === "Move Tool") {
        startDragging(event);
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
    const { offsetX = 0, offsetY = 0 } = event.nativeEvent;

    // Check if the active tool is the "Move Tool"
    const activeTool = getGlobalActiveTool();
    if (activeTool === "Move Tool") {
      const clickedOnNpcToken = npcTokens.find(
        (token) =>
          token.x !== undefined &&
          token.y !== undefined &&
          offsetX >= token.x - 25 &&
          offsetX <= token.x + 25 &&
          offsetY >= token.y - 25 &&
          offsetY <= token.y + 25
      );

      if (clickedOnNpcToken) {
        // Make the clicked NPC token the active object
        setSelectedObject(clickedOnNpcToken);

        // Calculate the offset for smoother dragging
        if (clickedOnNpcToken.x !== undefined && clickedOnNpcToken.y !== undefined) {
          setDragOffset({ x: offsetX - clickedOnNpcToken.x, y: offsetY - clickedOnNpcToken.y });
          addActivity("DRAG");
        }
      } else {
        // If no NPC token is clicked, start drawing a selection rectangle
        setInitialPoint({ x: offsetX, y: offsetY });
        setIsDrawing(true);
      }
    }
  };
  

  const stopDragging = () => {
    setIsDragging(false);

    if (isDrawing) {
      // If drawing a selection rectangle, check for NPCs within the rectangle
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const { x: initialX, y: initialY } = initialPoint;
      const { x: finalX, y: finalY } = mousePosition || {};

      if (initialX !== undefined && initialY !== undefined && finalX !== undefined && finalY !== undefined) {
        const minX = Math.min(initialX, finalX);
        const minY = Math.min(initialY, finalY);
        const maxX = Math.max(initialX, finalX);
        const maxY = Math.max(initialY, finalY);

        const NPCsInSelection = npcTokens.filter(
          (token) =>
            token.x !== undefined &&
            token.y !== undefined &&
            token.x >= minX - 25 &&
            token.x <= maxX + 25 &&
            token.y >= minY - 25 &&
            token.y <= maxY + 25
        );

        if (NPCsInSelection.length > 0) {
          // Set the last NPC in the selection as the active object
          setSelectedObject(NPCsInSelection[NPCsInSelection.length - 1]);
        }
      }

      setIsDrawing(false);
      setInitialPoint({ x: 0, y: 0 });
      setMousePosition(null);
    }
  };
  

  const drag = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX = 0, offsetY = 0 } = event.nativeEvent || {};

    if (isDragging) {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const selectedNpc = npcTokens.find((token) => selectedObject === token);

      if (selectedNpc && selectedNpc.x !== undefined && selectedNpc.y !== undefined) {
        // Calculate the new position relative to the canvas
        const newX = offsetX - dragOffset.x;
        const newY = offsetY - dragOffset.y;

        // Ensure the new position is within the canvas bounds
        const maxX = canvas.width - 25;
        const maxY = canvas.height - 25;

        // Update NPC token position while keeping it within the canvas bounds
        setNpcTokens((prevTokens) =>
          prevTokens.map((token) =>
            token === selectedNpc
              ? { ...token, x: Math.min(Math.max(newX, 25), maxX), y: Math.min(Math.max(newY, 25), maxY) }
              : token
          )
        );

        // Update mouse position for rendering
        setMousePosition({ x: newX, y: newY });
      }
    } else if (isDrawing) {
      // Update the mouse position for drawing the selection rectangle
      setMousePosition({ x: offsetX, y: offsetY });
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
  }, [isDragging, npcTokens, selectedObject]);

  // Update the context value to include isDragging
  const contextValue: CanvasContextProps = {
    canvasRef,
    contextRef,
    prepareCanvas,
    startDrawing,
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
