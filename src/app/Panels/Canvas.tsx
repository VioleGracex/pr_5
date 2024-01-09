import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

export function Canvas() {
  const { canvasRef, prepareCanvas, startDrawing, finishDrawing, draw } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, [prepareCanvas]);

  return (
    <canvas
      onMouseDown={(e) => startDrawing(e)}
      onMouseUp={finishDrawing}
      onMouseMove={(e) => draw(e)}
      ref={canvasRef}
    />
  );
}
