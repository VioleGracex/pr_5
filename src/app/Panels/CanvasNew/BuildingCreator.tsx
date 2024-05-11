import React, { useState } from 'react'; // Don't forget to import useState
import { addActivity } from '@/app/Panels/ConsoleBar'; // Import addActivity function
import Building from '@/app/Components/tools/Objects/Building'; // Import Building component


const createWireBuilding = (
    { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    contextRef: React.RefObject<CanvasRenderingContext2D | null>, // Corrected type
    currentBuildingPoints:{ x: number; y: number; }[],
    setCurrentBuildingPoints: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>,
    buildings: React.ReactNode[], // Assuming these are passed from a parent component
    setBuildings: React.Dispatch<React.SetStateAction<React.ReactNode[]>>,
    scaleFactor:number
  ) => {
    const clearCurrentBuildingPoints = () => {
      setCurrentBuildingPoints([]);
    };
  
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
      clearCurrentBuildingPoints();
  
      // Log the activity
      addActivity("Building created" + `building length ${buildings.length}`);
    };
  
    if (nativeEvent.button !== 0) {
      // Right mouse click: Delete all points of the building currently under construction
      clearCurrentBuildingPoints();
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
  
  export default createWireBuilding;
  