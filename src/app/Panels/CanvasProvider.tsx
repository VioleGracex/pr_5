// CanvasProvider.tsx
import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/InstrumentsTools/ToolPanel";
import Token, { TokenProps } from "../Components/tools/Objects/Token";
import { setActiveElement, setActiveToken } from "../state/ActiveElement";
import { CanvasProviderProps, Stroke, RenderBuildingArea, buildingInConstruction, CanvasContextProps, CanvasContext, wireInConstruction, renderWireShapesWithTexture } from "./CanvasContext";
/* import SaveDataButton, { saveCanvasData } from "./SaveCanvasData"; */
import createToken from "./CanvasNew/TokenCreator";
import {createWireBuilding, createRandomBuilding} from "./CanvasNew/BuildingCreator";
import createSquareGrid from "./CanvasNew/SquareGrid";
import { usePencilDrawing, drawPencil, finishDrawingPencil } from "./CanvasNew/CanvasPencil";
import dirtRoad from "./textures/dirt-road.png";
import grassRoad from "./textures/grass-road.jpg";

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, canvasId, strokeColor, scaleFactor,canvasWidth,canvasHeight }) => {
  //#region [consts]
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCanvasPrepared, setIsCanvasPrepared] = useState(false);

  const [selectedObject, setSelectedObject] = useState<typeof Token | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number; } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [initialPoint, setInitialPoint] = useState<{ x: number; y: number; }>({ x: 0, y: 0 });
  const currentPath = useRef<{ x: number; y: number; }[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);


  const [tokens, setTokens] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
  const [buildings, setBuildings] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
  const [currentBuildingPoints, setCurrentBuildingPoints] = useState<{ x: number; y: number; contentType?: string; }[]>([]);

  const [roads, setRoads] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
  const [currentRoadPoints, setCurrentRoadPoints] = useState<{ x: number; y: number; contentType?: string; }[]>([]);



  //#endregion
  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && !isCanvasPrepared) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      const context = canvas.getContext("2d");
      if (context) {
        //context.scale(2, 2);
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
              createWireBuilding(event,canvasRef,contextRef,currentBuildingPoints,setCurrentBuildingPoints,buildings,setBuildings,scaleFactor,'building');
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
           startDrawingRectangle(event);
          }
          //useShapeCreator(event,contextRef,setIsDrawingShape,currentColor,setInitialPoint,currentPath,scaleFactor);
          break;
        case 'Circle Tool':
          if (event.button === 0) {
            startDrawingCircle(event);
          }
          //useShapeCreator(event,contextRef,setIsDrawingShape,currentColor,setInitialPoint,currentPath,scaleFactor);
          break;
        case 'Road Tool':
          if (event.button === 0) {
            createWireBuilding(event,canvasRef,contextRef,currentRoadPoints,setCurrentRoadPoints,roads,setRoads,scaleFactor,'road', dirtRoad.src);
          }
          //useShapeCreator(event,contextRef,setIsDrawingShape,currentColor,setInitialPoint,currentPath,scaleFactor);
          break;
        case 'Grass Tool':
          if (event.button === 0) {
            createWireBuilding(event,canvasRef,contextRef,currentRoadPoints,setCurrentRoadPoints,roads,setRoads,scaleFactor,'grass', grassRoad.src);
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
    else if(isDrawingRectangle)
    {
      updateRectangle(event);
    }
    else if(isDrawingCircle)
    {
      updateCircle(event);
    }
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if(isDrawing)
      finishDrawingPencil(event,contextRef,setIsDrawing,strokeColor,initialPoint,currentPath,setStrokes,scaleFactor);
    else if(isDrawingRectangle)
    {
      finishDrawingRectangle();
    }
    else if(isDrawingCircle)
    {
      finishDrawingCircle();
    }
  };

  const handlekeydown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
      if (event.ctrlKey && event.key === 's') 
      {
        event.preventDefault(); // Prevent default browser behavior (e.g., saving the page)
        // Call your save function here
        addActivity("ASSSASADSAD");
        //saveCanvasDataToJson(); // Call your save function here
      }

    };

    const saveCanvasDataToJson = () => {
      const canvasData = {
        strokes: contextValue.strokes,
        tokens: tokens.map((token) => {
          if (React.isValidElement(token) && token.props) {
            const tokenProps = token.props as TokenProps;
            return {
              type: tokenProps.type,
              name: tokenProps.name,
              race: tokenProps.race,
              job: tokenProps.job,
              description: tokenProps.description,
              x: tokenProps.x,
              y: tokenProps.y,
              src: tokenProps.src,
            };
          }
          return null;
        }).filter(token => token !== null),
        buildings: buildings.map((building) => {
          if (React.isValidElement(building)) {
            return {
              x: building.props.x,
              y: building.props.y,
              // Add other properties as needed
            };
          }
          return null;
        }).filter(building => building !== null),
        roads: roads.map((road) => {
          if (React.isValidElement(road)) {
            return {
              x: road.props.x,
              y: road.props.y,
              contentType: road.props.contentType,
              // Add other properties as needed
            };
          }
          return null;
        }).filter(road => road !== null),
      };
    
      const json = JSON.stringify(canvasData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "canvasData.json";
      link.click();
    }; 

//#endregion


  //#region [shapes]
  interface Rectangle {
    startX: number;
    startY: number;
    width: number;
    height: number;
    color: string;
  }

  const [rectangle, setRectangle] = useState<Rectangle | null>(null);
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  const [rectangles, setRectangles] = useState<React.ReactNode[]>([]); // New state for rectangles
  // Function to start drawing a rectangle
  const startDrawingRectangle = (event: MouseEvent<HTMLCanvasElement>) => {
      setIsDrawingRectangle(true);
      const { offsetX, offsetY } = event.nativeEvent;
      setRectangle({
        startX: offsetX / scaleFactor,
        startY: offsetY / scaleFactor,
        width: 0,
        height: 0,
        color: strokeColor
      });
      addActivity("start rec");
  };

  // Function to update the rectangle dimensions while drawing
  const updateRectangle = (event: MouseEvent<HTMLCanvasElement>) => {
    if (isDrawingRectangle && rectangle) {
      const { offsetX, offsetY } = event.nativeEvent;
      const updatedWidth = (offsetX / scaleFactor) - rectangle.startX;
      const updatedHeight = (offsetY / scaleFactor) - rectangle.startY;
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          // Clear the canvas
          context.clearRect(rectangle.startX, rectangle.startY, updatedWidth, updatedHeight);

          context.strokeStyle = 'rgba(173, 216, 230, 0.5)';
          context.lineWidth = 2;
          context.strokeRect(
            (updatedWidth >= 0 ? rectangle.startX : rectangle.startX + updatedWidth) * scaleFactor,
            rectangle.startY * scaleFactor,
            Math.abs(updatedWidth) * scaleFactor,
            Math.abs(updatedHeight) * scaleFactor
          );
        }
      }
      setRectangle(prevState => {
        if (!prevState) return null; // Handle null state
        return {
          ...prevState,
          width: (offsetX / scaleFactor) - prevState.startX,
          height: (offsetY / scaleFactor) - prevState.startY
        };
      });
    }
  };

  interface Circle {
    centerX: number;
    centerY: number;
    radius: number;
    color: string;
  }
  
  const [circle, setCircle] = useState<Circle | null>(null);
  const [isDrawingCircle, setIsDrawingCircle] = useState(false);
  const [circles, setCircles] = useState<React.ReactNode[]>([]);
  
  const startDrawingCircle = (event: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawingCircle(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setCircle({
      centerX: offsetX / scaleFactor,
      centerY: offsetY / scaleFactor,
      radius: 0,
      color: strokeColor
    });
    addActivity("Начало рисования окружности");
  };
  
  const updateCircle = (event: MouseEvent<HTMLCanvasElement>) => {
    if (isDrawingCircle && circle) {
        const { offsetX, offsetY } = event.nativeEvent;
        const dx = (offsetX / scaleFactor) - circle.centerX;
        const dy = (offsetY / scaleFactor) - circle.centerY;
        const radius = Math.sqrt(dx ** 2 + dy ** 2);
        const canvas = canvasRef.current;
        
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                /* const clearX = (circle.centerX - radius) * scaleFactor;
                const clearY = (circle.centerY - radius) * scaleFactor;
                const clearSize = radius * 2 * scaleFactor;

                // Clear a rectangle that encompasses the circle plus a buffer
                const buffer = 1; // Adjust buffer size as needed
                context.clearRect(clearX - buffer, clearY - buffer, clearSize + buffer * 2, clearSize + buffer * 2); */
                
                // Draw the circle with updated dimensions
                context.strokeStyle = 'rgba(173, 216, 230, 0.5)';
                context.lineWidth = 2;
                context.beginPath();
                context.arc(circle.centerX * scaleFactor, circle.centerY * scaleFactor, radius * scaleFactor, 0, 2 * Math.PI);
                context.stroke();
            }
        }
        setCircle(prevState => {
            if (!prevState) return null;
            return {
                ...prevState,
                radius
            };
        });
    }
};


  
  const finishDrawingCircle = () => {
    if (isDrawingCircle && circle) {
      setIsDrawingCircle(false);
      const newCircle = (
        <circle
          cx={circle.centerX}
          cy={circle.centerY}
          r={circle.radius}
          fill={circle.color}
          key={circles.length}
        />
      );
      setCircles(prevCircles => [...prevCircles, newCircle]);
      setCircle(null);
    }
  };
  
// Function to finish drawing the rectangle
const finishDrawingRectangle = () => {
  if (isDrawingRectangle && rectangle) {
    setIsDrawingRectangle(false);
    // Add the drawn rectangle to the rectangles array
    const newRectangle = (
      <rect
        x={rectangle.startX}
        y={rectangle.startY}
        width={rectangle.width}
        height={rectangle.height}
        fill={rectangle.color}
        key={rectangles.length} // Ensure unique key for React
      />
    );
    setRectangles(prevRectangles => [...prevRectangles, newRectangle]);
    setRectangle(null); // Reset rectangle state
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
          context.lineWidth = 3;
          context.beginPath();
          path.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();
        });

        rectangles.forEach(rectangle => {
          if (React.isValidElement(rectangle)) {
          context.fillStyle = rectangle.props.fill;
          context.fillRect(rectangle.props.x, rectangle.props.y, rectangle.props.width, rectangle.props.height);
          }
        });
        circles.forEach(circle => {
          if (React.isValidElement(circle)) {
            const circleProps = circle.props;
            context.fillStyle = circleProps.fill;
            context.beginPath();
            context.arc(circleProps.cx, circleProps.cy, circleProps.r, 0, 2 * Math.PI);
            context.fill();
          }
        });
             
        buildingInConstruction(context, currentBuildingPoints);
        RenderBuildingArea(buildings, context);

        //roads
        if (currentRoadPoints.length > 0) 
        {
          if (currentRoadPoints[0].contentType) {
            if (currentRoadPoints[0].contentType === 'road') {
              wireInConstruction(context, currentRoadPoints, dirtRoad.src);
            } else if(currentRoadPoints[0].contentType === 'grass'){
              wireInConstruction(context, currentRoadPoints, grassRoad.src);
            }
          }
        }
    
        renderWireShapesWithTexture(roads, context);
      }
    }

  }, [strokes,circles,rectangles, tokens, selectedObject, mousePosition, currentBuildingPoints,currentRoadPoints]);

  //#endregion
  // Update the context value to include isDragging
  const contextValue: CanvasContextProps = {
    canvasRef,
    contextRef,
    prepareCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handlekeydown,
    clearCanvas,
    saveCanvasDataToJson,
    strokes,
    canvasId,
    selectedObject,
    setSelectedObject,
    mousePosition,
    setMousePosition,
    deleteToken,
    deleteBuilding,
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
      </div>

      
      

    </CanvasContext.Provider>
    
  );
};
