import React from "react";
import { CanvasContextProps } from "./CanvasContext";
import { addActivity } from "./ConsoleBar";

// Function to create a folder marker file
const createFolderMarker = (folderPath: string) => {
  // Not needed when using local storage
};

// Function to save strokes, NPC tokens, and buildings in JSON format to local storage
const saveDataToJson = (data: any, filePath: string) => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(filePath, jsonData);
  } catch (error) {
    console.error("Error saving data to JSON:", error);
  }
};

// Example usage:
const SaveDataButton: React.FC<{ canvasData: CanvasContextProps }> = ({ canvasData }) => {
  const handleSaveClick = () => {
    const dataToSave = {
      strokes: canvasData.strokes,
      Tokens: canvasData.Tokens,
      buildings: canvasData.buildings
    };
    // Construct the file path with folder "project" and file name as canvas ID
    const filePath = `project/${canvasData.canvasId}`;
    addActivity("filePath" + filePath);
    // Save the JSON data to local storage
    saveDataToJson(dataToSave, filePath);
  };

  return (
    <button onClick={handleSaveClick} style={{ backgroundColor: 'black', borderRadius: '0' }}>Save Data</button>
  );
};

export default SaveDataButton;

// Function to save canvas data directly from CanvasContextProps to local storage
export const saveCanvasData = (canvasData: CanvasContextProps) => {
  const dataToSave = {
    strokes: canvasData.strokes,
    Tokens: canvasData.Tokens,
    buildings: canvasData.buildings
  };
  // Construct the file path with folder "project" and file name as canvas ID
  const filePath = `project/${canvasData.canvasId}`;

  // Save the JSON data to local storage
  saveDataToJson(dataToSave, filePath);
};
