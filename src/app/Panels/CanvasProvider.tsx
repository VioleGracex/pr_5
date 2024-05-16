// CanvasProvider.tsx
import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/InstrumentsTools/ToolPanel";
import Token from "../Components/tools/Objects/Token";
import { setActiveElement, setActiveToken } from "../state/ActiveElement";
import { CanvasProviderProps, Stroke, RenderBuildingArea, buildingInConstruction, CanvasContextProps, CanvasContext } from "./CanvasContext";
import SaveDataButton, { saveCanvasData } from "./SaveCanvasData";
import createToken from "./CanvasNew/TokenCreator";
import {createWireBuilding, createRandomBuilding} from "./CanvasNew/BuildingCreator";
import createSquareGrid from "./CanvasNew/SquareGrid";
import { usePencilDrawing, drawPencil, finishDrawingPencil } from "./CanvasNew/CanvasPencil";
import { drawRectangle, finishDrawingRectangle } from "./CanvasNew/ShapeCreator";
import Shape, { ShapeProps } from "../Components/tools/Objects/Shape";

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, canvasId, strokeColor, scaleFactor }) => {
  //#region [consts]
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [isCanvasPrepared, setIsCanvasPrepared] = useState(false);

  const [selectedObject, setSelectedObject] = useState<typeof Token | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number; } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [initialPoint, setInitialPoint] = useState<{ x: number; y: number; }>({ x: 0, y: 0 });
  const currentPath = useRef<{ x: number; y: number; }[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);
  const [currentShapePoints, setCurrentShapePoints] = useState<{ x: number; y: number; width: number; height: number; }[]>([]);


  const [tokens, setTokens] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
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
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const activeTool = getGlobalActiveTool();
    if (activeTool) {
      switch (activeTool) {
        case 'Pencil':
          usePencilDrawing(event,contextRef,setIsDrawing,strokeColor,setInitialPoint,currentPath,scaleFactor);
          break;
        case 'NPC Token':
          if (event.button === 0) {
            //createNPCToken(event);
            createToken(event, 'npc', canvasRef, tokens, setTokens, scaleFactor);
          }
          break;
        case 'Item Token':
          if (event.button === 0) {
            createToken(event, 'item', canvasRef, tokens, setTokens, scaleFactor);
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
        case 'Rectangle Tool':
          if (event.button === 0) {
            addActivity('rectangle tool');
            setIsDrawingShape(true);
            setInitialPoint({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
          }
          //useShapeCreator(event,contextRef,setIsDrawingShape,currentColor,setInitialPoint,currentPath,scaleFactor);
          break;
        default:
          addActivity(`Selected ${activeTool}`);
          break;
      }
    } else {
      addActivity("Error Using Tool not found");
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if(isDrawing)
      drawPencil(event,contextRef,currentPath,scaleFactor);
    else if (isDrawingShape)
      drawRectangle(event,canvasRef,strokeColor,initialPoint,shapes,setCurrentShapePoints,scaleFactor);
    /* else if(isDrawingShape)
      drawShape(event,contextRef,initialPoint,scaleFactor); */
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if(isDrawing)
      finishDrawingPencil(event,contextRef,setIsDrawing,strokeColor,initialPoint,currentPath,setStrokes,scaleFactor);
    else if (isDrawingShape)
      {
        finishDrawingRectangle(setIsDrawingShape,strokeColor,shapes,setShapes,currentShapePoints,setCurrentShapePoints);
        addActivity('shapes size' + shapes.length);
      }
      
  };
//#endregion
 


/* const drawRectangle = (event: React.MouseEvent<HTMLCanvasElement>) => {
  if (!isDrawingShape || !initialPoint) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { x: startX, y: startY } = initialPoint;
  const width = event.nativeEvent.offsetX - startX;
  const height = event.nativeEvent.offsetY - startY;

  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, width, height);
};

const finishDrawingRectangle = () => {
  setIsDrawingShape(false);
};
 */
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
        context.fillStyle = "#898989";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Render tokens
        tokens.forEach((token) => {
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

        shapes.forEach((shape: React.ReactNode) => {
          if (React.isValidElement(shape)) {
            const shapeProps = shape.props as ShapeProps;
            context.fillRect(shapeProps.points[0].x, shapeProps.points[0].y, shapeProps.size.width, shapeProps.size.height);
          }
        });
      }
    }

  }, [strokes,shapes, tokens, selectedObject, mousePosition, currentBuildingPoints]);

  //#endregion
  // Update the context value to include isDragging
  const contextValue: CanvasContextProps = {
    canvasRef,
    contextRef,
    prepareCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
    strokes,
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
    <CanvasContext.Provider value={contextValue} >
      
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
        
        {buildings}

        {tokens}
        {shapes}
      </div>
      

    </CanvasContext.Provider>
    
  );
};
