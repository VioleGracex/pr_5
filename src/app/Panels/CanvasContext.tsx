// CanvasContext.tsx
import React, { createContext, useContext, ReactNode, SetStateAction, Dispatch } from "react";
import Token from "../Components/tools/Objects/Token";
import { getActiveToken } from "../state/ActiveElement";
import { BuildingProps } from "../Components/tools/Objects/Building";

export interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.RefObject<CanvasRenderingContext2D | null>;
  prepareCanvas: () => void;
  handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  clearCanvas: () => void;
  strokes: { path: { x: number; y: number }[]; color: string }[];
  canvasId: string;
  selectedObject: typeof Token | null;
  setSelectedObject: Dispatch<SetStateAction<typeof Token | null>>;
  mousePosition: { x: number; y: number } | null;
  setMousePosition: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
  deleteToken: (index: number) => void;
  deleteBuilding: (index: number) => void;
}

export const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

export interface CanvasProviderProps {
  children: ReactNode;
  canvasId: string;
  strokeColor: string;
  scaleFactor: number;
  canvasWidth:number;
  canvasHeight:number;
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

export function buildingInConstruction(
  context: CanvasRenderingContext2D,
  currentBuildingPoints: { x: number; y: number; }[]
) {
  context.strokeStyle = 'blue'; // Set the color for the paths
  context.lineWidth = 12; // Set the width of the stroke (adjust as needed)
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
  currentBuildingPoints.forEach(({ x, y }, index) => {
    const pointRadius = 6; // Adjust the radius of the point as needed
    context.beginPath();
    context.arc(x, y, pointRadius, 0, Math.PI * 2);
    context.fillStyle = index === 0 ? '#0ce84a' : index === currentBuildingPoints.length - 1 ? 'red' : 'white'; // Adjust the color of the point as needed
    context.fill();
    context.closePath();
  });
}

export function RenderBuildingArea(
  buildings: React.ReactNode[],
  context: CanvasRenderingContext2D
) {
  buildings.forEach((building: React.ReactNode) => {
    if (React.isValidElement(building)) {
      const { points } = building.props as BuildingProps;
      if (points && points.length > 1) {
        // Draw the outer wall (black border)
        context.strokeStyle = 'black'; // Set border color
        context.lineWidth = 12; // Set border width
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => {
          context.lineTo(point.x, point.y);
        });
        context.lineTo(points[0].x, points[0].y);
        context.stroke();

        // Draw the inner wall (white interior)
        context.strokeStyle = 'white'; // Set interior color
        context.lineWidth = 10; // Set interior width (smaller than border)
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => {
          context.lineTo(point.x, point.y);
        });
        context.lineTo(points[0].x, points[0].y);
        context.stroke();

      }
    }
  });
}


export function wireInConstruction(
  context: CanvasRenderingContext2D,
  currentBuildingPoints: { x: number; y: number; }[],
  texture: string,
) {
  // Create a pattern with the dirt road texture image
  const dirtTexture = new Image();
  dirtTexture.src = texture; // Use the src property to get the URL string

  // Once the image is loaded, create a pattern with it
  dirtTexture.onload = function () {
    const pattern = context.createPattern(dirtTexture, 'repeat');

    if (pattern) {
      // Set the pattern as the fill style for the road path
      context.fillStyle = pattern;

      // Draw the road path
      context.strokeStyle = '#87603b'; // Set the color for the paths
      context.lineWidth = 12; // Set the width of the stroke (adjust as needed)
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

      // Fill the road path with the dirt texture pattern
      context.fill();

      // Render building points with different colors for the first and last points
      currentBuildingPoints.forEach(({ x, y }, index) => {
        const pointRadius = 6; // Adjust the radius of the point as needed
        context.beginPath();
        context.arc(x, y, pointRadius, 0, Math.PI * 2);
        context.fillStyle = index === 0 ? '#0ce84a' : index === currentBuildingPoints.length - 1 ? 'red' : 'white'; // Adjust the color of the point as needed
        context.fill();
        context.closePath();
      });
    }
  };
}

export function renderWireShapesWithTexture(
  roads: React.ReactNode[],
  context: CanvasRenderingContext2D,
) {
  roads.forEach((building: React.ReactNode) => {
    if (React.isValidElement(building)) {
      const { points, texturePath } = building.props as BuildingProps;
      if (points && points.length > 1) {
        // Draw the outer wall (black border)
        context.strokeStyle = 'black'; // Set border color
        context.lineWidth = 1; // Set border width
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => {
          context.lineTo(point.x, point.y);
        });
        context.lineTo(points[0].x, points[0].y);
        context.stroke();

        // Fill the interior with the texture if texturePath exists
        if (texturePath) {
          const texture = new Image();
          texture.src = texturePath;
          texture.onload = function () {
            const pattern = context.createPattern(texture, 'repeat');
            if (pattern) {
              context.fillStyle = pattern;
              context.beginPath();
              context.moveTo(points[0].x, points[0].y);
              points.slice(1).forEach((point) => {
                context.lineTo(point.x, point.y);
              });
              context.lineTo(points[0].x, points[0].y);
              context.fill();
            }
          };
        }
      }
    }
  });
}

