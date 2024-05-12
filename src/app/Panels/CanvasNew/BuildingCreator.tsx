import React from 'react'; // Don't forget to import useState
import { addActivity } from '@/app/Panels/ConsoleBar'; // Import addActivity function
import Building from '@/app/Components/tools/Objects/Building'; // Import Building component
import { BuildingProps } from '@/app/Components/tools/Objects/Building';


export const createWireBuilding = (
    { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    contextRef: React.RefObject<CanvasRenderingContext2D | null>, // Corrected type
    currentBuildingPoints:{ x: number; y: number; }[],
    setCurrentBuildingPoints: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>,
    buildings: React.ReactNode[], // Assuming these are passed from a parent component
    setBuildings: React.Dispatch<React.SetStateAction<React.ReactNode[]>>,
    scaleFactor:number
  ) => {
    
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
          points={closedBuildingPoints}
        />
      );
      // Update the state to include the new building
      setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);
      // Clear the current building points
      setCurrentBuildingPoints([]);
  
      // Log the activity
      addActivity("Building created" + `building length ${buildings.length}`);
    };
  
    if (nativeEvent.button !== 0) {
      // Right mouse click: Delete all points of the building currently under construction
      setCurrentBuildingPoints([]);
      return;
    }
  
    const canvas = canvasRef.current;
    const context = contextRef.current;
  
    if (!canvas || !context) return;
  
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = nativeEvent.clientX - canvasRect.left - window.scrollX;
    const offsetY = nativeEvent.clientY - canvasRect.top - window.scrollY;

    // Adjust the offset based on the scale factor
    const scaledOffsetX = (offsetX / scaleFactor) ;
    const scaledOffsetY = (offsetY / scaleFactor) ;
    const newPoint = { x: scaledOffsetX, y: scaledOffsetY };
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
  
  export const createRandomBuilding = (
    { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    contextRef: React.RefObject<CanvasRenderingContext2D | null>, // Corrected type
    setCurrentBuildingPoints: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>,
    buildings: React.ReactNode[], // Assuming these are passed from a parent component
    setBuildings: React.Dispatch<React.SetStateAction<React.ReactNode[]>>,
    scaleFactor:number
  ) =>{
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

      const mouseX = nativeEvent.clientX; // X-coordinate of the mouse
      const mouseY = nativeEvent.clientY; // Y-coordinate of the mouse
      const randomShape = getRandomShape();
      const randomPoints = generateRandomPointsForShape(randomShape, mouseX, mouseY);
      const newBuilding = createBuildingFromPoints(randomPoints);
      setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);
      //setBuildings([...buildings, newBuilding]);
      // Clear the current building points
      setCurrentBuildingPoints([]);
  
      // Log the activity
      addActivity("Building created" + `building length ${buildings.length}`);

  }

