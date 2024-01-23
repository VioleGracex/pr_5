// CanvasContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, SetStateAction, Dispatch, useEffect } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/ToolPanel";
import { NPCTokenProps } from "../Components/tools/Objects/NPCToken";
import NPCToken from "../Components/tools/Objects/NPCToken";

interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.RefObject<CanvasRenderingContext2D | null>;
  prepareCanvas: () => void;
  startDrawing: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  finishDrawing: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  draw: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  clearCanvas: () => void;
  strokes: { path: { x: number; y: number }[]; color: string }[];
  strokeColor: string; // New property for stroke color
  setStrokeColor: Dispatch<SetStateAction<string>>; // New set function for stroke color
  npcTokens: NPCTokenProps[];
  canvasId: string; // Identifier for the canvas
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
  canvasId: string; // Identifier for the canvas
  strokeColor: string; // New prop for stroke color
}

interface Stroke {
  path: { x: number; y: number }[];
  color: string;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, canvasId, strokeColor }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black"); // New state for the current color
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
          context.fillStyle = "black"; // Adjust background color as needed
          context.fillRect(0, 0, 50, 50); // Adjust size as needed
          // Render NPC token content (you may use NPCToken component here if needed)
          context.fillStyle = "blue";
          context.fillText(token.name, 0 + 10, 0 + 30);
        });
      }
    }
  }, [strokes, npcTokens]);

  useEffect(() => {
    // Create the NPC tokens layer when npcTokens change
    const tokensLayer = npcTokens.map((token, index) => (
      <NPCToken key={index} {...token} />
    ));
  
    // Comment out or remove the following line
    // setNpcTokensLayer(tokensLayer);
  }, [npcTokens]);
  

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

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const activeTool = getGlobalActiveTool();
    if (activeTool) {
      if (activeTool === "Pencil") {
        addActivity(`Used ${activeTool} Pen `);
        startPencilDrawing(event);
      } else if (activeTool === "NPC Token") {
        createNPCToken(event);
      }
    } else {
      addActivity("Error Using Tool not found");
    }
  };

  const startPencilDrawing = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
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

  const createNPCToken = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
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
    addActivity(`Created NPC ${offsetX}`);
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
        setStrokes([]); // Clear strokes when clearing the canvas
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
    strokes,
    strokeColor,
    setStrokeColor: setCurrentColor,
    npcTokens,
    canvasId,
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
