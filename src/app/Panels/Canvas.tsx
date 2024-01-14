// Canvas.tsx
import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

export function Canvas() {
  const { canvasRef, prepareCanvas, startDrawing, finishDrawing, draw, paths, currentPath } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, [prepareCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      // Always draw existing paths
      paths.forEach((path) => {
        if (path.length > 0) {
          context.beginPath();
          context.moveTo(path[0].x, path[0].y);

          for (let i = 1; i < path.length; i++) {
            context.lineTo(path[i].x, path[i].y);
          }

          context.stroke();
        }
      });

      // Draw the current drawing path
      if (currentPath.length > 0) {
        context.beginPath();
        context.moveTo(currentPath[0].x, currentPath[0].y);

        for (let i = 1; i < currentPath.length; i++) {
          context.lineTo(currentPath[i].x, currentPath[i].y);
        }

        context.stroke();
      }
    }
  }, [paths, currentPath, canvasRef]);

  return (
    <canvas
      onMouseDown={(e) => startDrawing(e)}
      onMouseUp={finishDrawing}
      onMouseMove={(e) => draw(e)}
      ref={canvasRef}
    />
  );
}
