// Canvas.tsx
import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";
import { getActiveToken } from "../state/ActiveElement";
import { addActivity } from "./ConsoleBar";

export function Canvas() {
  const {
    canvasRef,
    prepareCanvas,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handlekeydown,
    saveCanvasDataToJson,
    strokes,
    mousePosition, // Add mousePosition
    deleteToken,
  } = useCanvas("exampleCanvas");

  const handleDeleteKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Delete") {
      const activeToken = getActiveToken();
      if (activeToken) {
        const activeIndex = activeToken.getIndex(); // Assuming getIndex() returns the index of the active NPC token
        if (activeIndex !== undefined) {
          deleteToken(activeIndex);
        }
      }
    }
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault(); // Prevent default browser behavior (e.g., saving the page)
      // Call your save function here
      addActivity("ASSSASADSAD");
      saveCanvasDataToJson(); // Call your save function here
    }
  };
  
  useEffect(() => {
    prepareCanvas();

    // Add event listener for keydown on the document
    document.addEventListener("keydown", handleDeleteKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleDeleteKeyDown);
    };
  }, [prepareCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      // Always draw existing strokes
      strokes.forEach((stroke) => {
        if (stroke.path.length > 0) {
          context.strokeStyle = stroke.color;
          context.beginPath();
          context.moveTo(stroke.path[0].x, stroke.path[0].y);

          for (let i = 1; i < stroke.path.length; i++) {
            context.lineTo(stroke.path[i].x, stroke.path[i].y);
          }

          context.stroke();
        }
      });

      // Draw a placeholder for the current drawing path
      if (mousePosition) {
        context.strokeStyle = "red"; // Change color or styling as needed
        context.beginPath();
        context.arc(mousePosition.x, mousePosition.y, 5, 0, 2 * Math.PI);
        context.stroke();
      }
    }
  }, [strokes, mousePosition, canvasRef]);

  return (
    <canvas id="canvas"
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={handleMouseUp}
      onMouseMove={(e) => handleMouseMove(e)}
      onKeyDown={(e) =>handlekeydown(e)}
      ref={canvasRef}
    />
  );
}
