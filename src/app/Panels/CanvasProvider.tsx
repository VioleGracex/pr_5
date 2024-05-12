// CanvasProvider.tsx
import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/InstrumentsTools/ToolPanel";
import Token from "../Components/tools/Objects/Token";
import { setActiveElement, setActiveToken } from "../state/ActiveElement";
import Building, {BuildingProps} from "../Components/tools/Objects/Building";
import { CanvasProviderProps, Stroke, RenderBuildingArea, buildingInConstruction, CanvasContextProps, CanvasContext } from "./CanvasContext";
import SaveDataButton, { saveCanvasData } from "./SaveCanvasData";
import createToken from "./CanvasNew/TokenCreator";
import {createWireBuilding, createRandomBuilding} from "./CanvasNew/BuildingCreator";
import createSquareGrid from "./CanvasNew/SquareGrid";
import { usePencilDrawing } from "./CanvasNew/CanvasPencil";

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, canvasId, strokeColor, scaleFactor }) => {
  //#region [consts]
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");
  const [selectedObject, setSelectedObject] = useState<typeof Token | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number; } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPath = useRef<{ x: number; y: number; }[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [initialPoint, setInitialPoint] = useState<{ x: number; y: number; }>({ x: 0, y: 0 });
  const [isCanvasPrepared, setIsCanvasPrepared] = useState(false);
  const [Tokens, setTokens] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
  const [buildings, setBuildings] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
  const [currentBuildingPoints, setCurrentBuildingPoints] = useState<{ x: number; y: number; }[]>([]); // New state to store building points


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
          //startPencilDrawing(event);
          usePencilDrawing(event,contextRef,isDrawing,setIsDrawing,currentColor,initialPoint,setInitialPoint,currentPath,setStrokes,scaleFactor);
          break;
        case 'NPC Token':
          if (event.button === 0) {
            //createNPCToken(event);
            createToken(event, 'npc', canvasRef, Tokens, setTokens, scaleFactor);
          }
          break;
        case 'Item Token':
          if (event.button === 0) {
            createToken(event, 'item', canvasRef, Tokens, setTokens, scaleFactor);
          }
          break;    
        case 'Move Tool':
          // Implement move tool functionality
          break;
        case 'Cursor Tool':
          setActiveElement(null);
          setActiveToken(null);
          break;
        case 'Building Tool':
          if (event.button === 0) {
            // Left-click on the canvas
            const canvas = canvasRef.current;
            if (canvas) {
              // Start creating building placing points
              //createBuilding(event);
              createWireBuilding(event,canvasRef,contextRef,currentBuildingPoints,setCurrentBuildingPoints,buildings,setBuildings,scaleFactor);
            }
          } else if (event.button === 2) {
            // Right-click: Cancel building construction by clearing all points
            setCurrentBuildingPoints([]);
          }
          break;
        case 'RGB': //Random GeneratedBuilding
        if (event.button === 0) {
          addActivity(`Used ${activeTool} Tool`);
          createRandomBuilding(event,canvasRef,contextRef,setCurrentBuildingPoints,buildings,setBuildings,scaleFactor); // Call the function to generate shape with 
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
          if (event.key == "Enter") {
            addActivity("Finish building");
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
 

  //#region drawing
  const startPencilDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX = 0, offsetY = 0 } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.strokeStyle = strokeColor;
      contextRef.current.lineWidth = 3; // Set the width of the stroke (adjust as needed) add this as a meter to palette
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

  const deleteToken = (index: number) => {
    setTokens((prevTokens) => prevTokens.filter((_, i) => i !== index));
    // Optionally, you can add additional cleanup logic here if needed
  };

  const deleteBuilding = (index: number) => {
    setBuildings((prevBuilding) => prevBuilding.filter((_, i) => i !== index));
    // Optionally, you can add additional cleanup logic here if needed
  };
  //#endregion
  
  //#region Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    

    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        //rendering bg  HERE ! make grid here
        context.fillStyle = "#898989";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Render tokens
        Tokens.forEach((token) => {
          if (React.isValidElement(token)) {
            const { x = 0, y = 0 } = token.props;
            // Draw token at scaled coordinates
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

        // Render buildings and connect points
        RenderBuildingArea(buildings, context);

        buildingInConstruction(context, currentBuildingPoints);

      }
    }

  }, [strokes, Tokens, selectedObject, mousePosition, currentBuildingPoints]);

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
    Tokens,
    buildings,
    canvasId,
    selectedObject,
    setSelectedObject,
    mousePosition,
    setMousePosition,
    deleteToken,
    deleteBuilding,
  };

  const saveThisCanvasData = () => {
    // Call saveCanvasDataToJson with the correct argument, which is contextValue
    saveCanvasData(contextValue);
  };
  return (
    <CanvasContext.Provider value={contextValue}>
      
      {/* <SaveDataButton canvasData={contextValue} /> */}
      <div style={{ position: 'absolute', zIndex: '25' }}>
        
      </div>
      
      <div style={{ zIndex: '15' }}>
        {children}
        {createSquareGrid({ 
          width: parseInt(canvasRef?.current?.style?.width || '0', 10), 
          height: parseInt(canvasRef?.current?.style?.height || '0', 10), 
          areaOfSquare: 3
        })}
        {Tokens}
        {buildings}
      </div>
      

    </CanvasContext.Provider>
    
  );
};
