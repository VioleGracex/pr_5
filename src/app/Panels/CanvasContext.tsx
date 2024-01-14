// CanvasContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, SetStateAction, Dispatch } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/ToolPanel";

interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.RefObject<CanvasRenderingContext2D | null>;
  prepareCanvas: () => void;
  startDrawing: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  finishDrawing: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  draw: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  clearCanvas: () => void;
  paths: { x: number; y: number }[][];
  currentPath: { x: number; y: number }[];
  strokeColor: string; // New property for stroke color
  setStrokeColor: Dispatch<SetStateAction<string>>; // New set function for stroke color
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState("black"); // Default stroke color
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPath = useRef<{ x: number; y: number }[]>([]);
  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);
  const [initialPoint, setInitialPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const context = canvas.getContext("2d");
      if (context) {
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = strokeColor; // Set stroke color
        context.lineWidth = 5;
        context.fillStyle = "grey";
        context.fillRect(0, 0, canvas.width, canvas.height);
        canvas.style.zIndex = "-100";
        contextRef.current = context;
      }
    }
  };

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    addActivity("started drawing");
    const activeTool = getGlobalActiveTool();
    if (activeTool) {
      if (activeTool !== "Pencil") return;
      addActivity(`Used ${activeTool} Pen `);
    } else {
      addActivity("Error Using Tool not found");
      return;
    }

    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);

      setInitialPoint({ x: offsetX, y: offsetY });
    }
  };

  const finishDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);

    if (contextRef.current) {
      const { offsetX, offsetY } = nativeEvent;
      const distance = Math.sqrt(
        Math.pow(offsetX - initialPoint.x, 2) + Math.pow(offsetY - initialPoint.y, 2)
      );

      if (distance < 2) {
        contextRef.current.beginPath();
        contextRef.current.arc(
          offsetX,
          offsetY,
          contextRef.current.lineWidth / 2,
          0,
          Math.PI * 2
        );
        contextRef.current.fill();
        setPaths((prevPaths) => [...prevPaths, currentPath.current]);
        currentPath.current = [];
      } else {
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setPaths((prevPaths) => [...prevPaths, currentPath.current]);
        currentPath.current = [];
      }
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;
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
      }
    }
  };

  const contextValue: CanvasContextProps = {
    canvasRef,
    contextRef,
    prepareCanvas,
    startDrawing,
    finishDrawing,
    clearCanvas,
    draw,
    paths,
    currentPath: currentPath.current,
    strokeColor,
    setStrokeColor, // Set function for stroke color
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
