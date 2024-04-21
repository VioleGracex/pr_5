// CanvasProvider.tsx
import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { addActivity } from "./ConsoleBar";
import { getGlobalActiveTool } from "../Components/tools/InstrumentsTools/ToolPanel";
import NPCToken from "../Components/tools/Objects/NPCToken";
import { setActiveElement, setActiveNpcToken } from "../state/ActiveElement";
import Building, {BuildingProps} from "../Components/tools/Objects/Building";
import { CanvasProviderProps, Stroke, RenderBuildingArea, buildingInConstruction, CanvasContextProps, CanvasContext } from "./CanvasContext";
import SaveDataButton, { saveCanvasData } from "./SaveCanvasData";

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, canvasId, strokeColor, scaleFactor }) => {
  //#region [consts]
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");
  const [selectedObject, setSelectedObject] = useState<typeof NPCToken | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number; } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPath = useRef<{ x: number; y: number; }[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [initialPoint, setInitialPoint] = useState<{ x: number; y: number; }>({ x: 0, y: 0 });
  const [isCanvasPrepared, setIsCanvasPrepared] = useState(false);
  const [npcTokens, setNpcTokens] = useState<React.ReactNode[]>([]); // Changed the type to React.ReactNode[]
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
          startPencilDrawing(event);
          break;
        case 'NPC Token':
          if (event.button === 0) {
          createNPCToken(event);
          }
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
              // Start creating building placing points
              createBuilding(event);
            }
          } else if (event.button === 2) {
            // Right-click: Cancel building construction by clearing all points
            clearCurrentBuildingPoints();
          }
          break;
        case 'RGB': //Random GeneratedBuilding
        if (event.button === 0) {
          addActivity(`Used ${activeTool} Tool`);
          createRandomBuildingNearCursor(event); // Call the function to generate shape with NPC
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
  //----------------------------------NPC---------------------------------------------
  const createNPCToken = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Get the bounding rectangle of the canvas
    const canvasRect = canvas.getBoundingClientRect();

    // Calculate the offset of the mouse event relative to the canvas
    const offsetX = nativeEvent.clientX - canvasRect.left - window.scrollX;
    const offsetY = nativeEvent.clientY - canvasRect.top - window.scrollY;
    /* const offsetX = nativeEvent.clientX - window.scrollX;
    const offsetY = nativeEvent.clientY - window.scrollY; */

    // Adjust the offset based on the scale factor
    const scaledOffsetX = (offsetX / scaleFactor) - 30;
    const scaledOffsetY = (offsetY / scaleFactor) - 20;

    // Create a new NPC token with adjusted coordinates
    const newToken = (
      <NPCToken
        key={npcTokens.length} // Use a unique key for each token
        x={scaledOffsetX}
        y={scaledOffsetY} />
    );

    // Update the state to include the new NPC token
    setNpcTokens((prevTokens) => [...prevTokens, newToken]);

    // Log the activity (optional)
    addActivity(`Created NPC at coordinates ${scaledOffsetX}, ${scaledOffsetY}`);
  };
  //----------------------------------Building---------------------------------------------
  //#region building
  const createBuilding = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (nativeEvent.button !== 0) {
      // Right mouse click: Delete all points of the building currently under construction
      clearCurrentBuildingPoints();
      return;
    }

    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context) return;

    /* const { offsetX = 0, offsetY = 0 } = nativeEvent; */
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = nativeEvent.clientX - canvasRect.left - window.scrollX;
    const offsetY = nativeEvent.clientY - canvasRect.top - window.scrollY;
    const newPoint = { x: offsetX, y: offsetY };
    const thresholdDistance = 10; // Define the threshold distance


    // Check if the point is the first point
    if (currentBuildingPoints.length > 2) {
      // Calculate the distance between the new point and the first point
      const distance = Math.sqrt((currentBuildingPoints[0].x - newPoint.x) ** 2 + (currentBuildingPoints[0].y - newPoint.y) ** 2);

      // Check if the distance is within the threshold range
      if (distance <= thresholdDistance) {
        // If it is near the first point, call the finishBuilding function
        finishBuilding();
        return;
      }
    }

    // Check if the new point is too close to existing points
    const isTooClose = currentBuildingPoints.some((point) => {
      const distance = Math.sqrt((point.x - newPoint.x) ** 2 + (point.y - newPoint.y) ** 2);
      return distance < thresholdDistance; // Adjust the threshold distance as needed
    });

    // If the new point is too close to existing points, return without adding it
    if (isTooClose) {

      return;
    }

    // If there are no points yet, set the initial point and return
    if (currentBuildingPoints.length === 0) {
      setCurrentBuildingPoints([newPoint]);
      return;
    }
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
        id={"building_" + buildings.length} // Pass the id as a prop
        points={closedBuildingPoints} />
    );
    // Update the state to include the new NPC token
    setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);
    //setBuildings([...buildings, newBuilding]);
    // Clear the current building points
    setCurrentBuildingPoints([]);

    // Log the activity
    addActivity("Building created" + `building length ${buildings.length}`);
  };

  // Define the shape points

  const shapePoints: { [key: string]: { x: number; y: number }[] } = {
    square: [
      { x: -50, y: -50 },
      { x: 50, y: -50 },
      { x: 50, y: 50 },
      { x: -50, y: 50 }
    ],
    rectangle: [
      { x: -75, y: -50 },
      { x: 75, y: -50 },
      { x: 75, y: 50 },
      { x: -75, y: 50 }
    ],
    triangle: [
      { x: 0, y: -75 },
      { x: -75, y: 75 },
      { x: 75, y: 75 }
    ],
   
  };

  const getRandomShape = () => {
    const shapes = Object.keys(shapePoints);
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
  };
  // Define the type for the shape parameter
  type ShapeType = keyof typeof shapePoints;

  // Function to generate random points for a given shape
  const generateRandomPointsForShape = (shape: ShapeType, mouseX: number, mouseY: number): { x: number; y: number }[] => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context) return [];

    /* const { offsetX = 0, offsetY = 0 } = nativeEvent; */
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = mouseX- canvasRect.left - window.scrollX;
    const offsetY = mouseY - canvasRect.top - window.scrollY;
    const points = shapePoints[shape];
    const randomizedPoints = points.map(point => ({
      /* x: point.x + mouseX,
      y: point.y + mouseY */
      x: point.x + offsetX,
      y: point.y + offsetY
    }));
    return randomizedPoints;
  };

  // Function to create a building from points
  const createBuildingFromPoints = (points: BuildingProps['points']): JSX.Element => {
    return (
      <Building
        key={buildings.length}
        id={"building_" + buildings.length}
        points={points}
      />
    );
  };

  // Function to create a random building with a random shape near the cursor
  const createRandomBuildingNearCursor = (event: MouseEvent<HTMLCanvasElement>) => {
    const mouseX = event.clientX; // X-coordinate of the mouse
    const mouseY = event.clientY; // Y-coordinate of the mouse
    const randomShape = getRandomShape();
    const randomPoints = generateRandomPointsForShape(randomShape, mouseX, mouseY);
    const newBuilding = createBuildingFromPoints(randomPoints);
    setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);
    //setBuildings([...buildings, newBuilding]);
    // Clear the current building points
    setCurrentBuildingPoints([]);

    // Log the activity
    addActivity("Building created" + `building length ${buildings.length}`);
  };
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

  const deleteNPCToken = (index: number) => {
    setNpcTokens((prevTokens) => prevTokens.filter((_, i) => i !== index));
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
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Render NPC tokens
        npcTokens.forEach((token) => {
          if (React.isValidElement(token)) {
            const { x = 0, y = 0 } = token.props;
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

        // Render buildings and connect points
        RenderBuildingArea(buildings, context);

        buildingInConstruction(context, currentBuildingPoints);

      }
    }

  }, [strokes, npcTokens, selectedObject, mousePosition, currentBuildingPoints]);

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
    canvasId,
    selectedObject,
    setSelectedObject,
    mousePosition,
    setMousePosition,
    deleteNPCToken,
    deleteBuilding,
  };

  const saveThisCanvasData = () => {
    // Call saveCanvasDataToJson with the correct argument, which is contextValue
    saveCanvasData(contextValue);
  };
  return (
    <CanvasContext.Provider value={contextValue}>
      {/* <div style={{position: 'absolute'}}> {children}
             {/* Render NPC tokens as children }
             {npcTokens}</div> */}
      <div style={{ position: 'relative', zIndex: '10000000000' }}>
        <SaveDataButton canvasData={contextValue} />
      </div>
      {children}
      {npcTokens}
      {buildings}

    </CanvasContext.Provider>
    
  );
};
