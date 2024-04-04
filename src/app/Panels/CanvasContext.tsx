// CanvasContext.tsx
import React, { createContext, useContext, ReactNode, SetStateAction, Dispatch } from "react";
import NPCToken from "../Components/tools/Objects/NPCToken";
import { getActiveNpcToken } from "../state/ActiveElement";
import {BuildingProps} from "../Components/tools/Objects/Building";

export interface CanvasContextProps {
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
  npcTokens: React.ReactNode[];
  buildings: React.ReactNode[];
  canvasId: string;
  selectedObject:  typeof NPCToken | null;
  setSelectedObject: Dispatch<SetStateAction< typeof NPCToken | null>>;
  mousePosition: { x: number; y: number } | null;
  setMousePosition: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
  deleteNPCToken: (index: number) => void; // Define deleteNPCToken function
  deleteBuilding: (index: number) => void; // Define deleteNPCToken function
}

export const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

export interface CanvasProviderProps {
  children: ReactNode;
  canvasId: string;
  strokeColor: string;
  scaleFactor: number;
}

export interface Stroke {
  path: { x: number; y: number }[];
  color: string;
}

export const useCanvas = (canvasId: string) => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error(`useCanvas must be used within a CanvasProvider with canvasId ${canvasId}`);
  }
  return context;
};

export function RenderBuildingArea(buildings: React.ReactNode[], context: CanvasRenderingContext2D) {
  buildings.forEach((building: React.ReactNode) => {
    if (React.isValidElement(building)) {
      const { points } = building.props as BuildingProps;
      if (points && points.length > 1) {
        // Draw building lines
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => {
          context.lineTo(point.x, point.y);
        });
        context.lineTo(points[0].x, points[0].y);
        context.stroke();

        // Fill building area with light grey
        context.fillStyle = 'rgba(200, 200, 200, 0.5)'; // Adjust opacity as needed
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => {
          context.lineTo(point.x, point.y);
        });
        context.lineTo(points[0].x, points[0].y);
        context.fill();
      }
    }
  });
}

export function buildingInConstruction(context: CanvasRenderingContext2D, currentBuildingPoints: { x: number; y: number; }[]) {
  context.strokeStyle = 'blue'; // Set the color for the paths
  context.lineWidth = 1; // Set the width of the stroke (adjust as needed)
  context.beginPath();
  
  if (currentBuildingPoints.length > 1) {
    const startPoint = currentBuildingPoints[0];
    context.moveTo(startPoint.x, startPoint.y);

    for (let i = 1; i < currentBuildingPoints.length; i++) {
      const point = currentBuildingPoints[i];
      context.lineTo(point.x, point.y);
    }

    // Connect the last point with the first point to close the path
    context.lineTo(startPoint.x, startPoint.y);
  }
  context.stroke();

  // Render building points
  currentBuildingPoints.forEach(({ x, y }) => {
    const pointRadius = 3; // Adjust the radius of the point as needed
    context.beginPath();
    context.arc(x, y, pointRadius, 0, Math.PI * 2);
    context.fillStyle = 'black'; // Adjust the color of the point as needed
    context.fill();
    context.closePath();
  });
}

