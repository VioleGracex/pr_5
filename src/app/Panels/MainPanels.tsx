// Panels/MainPanels.tsx
"use client"; // This is a client component 👈🏽
import React from 'react';
import ToolPanel from '../Components/tools/ToolPanel';
import { useDrag } from 'react-dnd'; // Import the useDrag hook
import { ItemTypes } from '../Components/Constants'; // Define your drag item types
import { justDrag } from '../Components/Functions/TitleFunctions';

export const LeftPanel: React.FC = () => {
  const { handleMouseDown } = justDrag();
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PROGRAM_WINDOW,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div className={`w-1/7 bg-left-panel rounded z-10 relative ${isDragging ? 'opacity-50' : ''}`}>
      {/* Draggable area at the top of the left panel */}
      <div ref={drag} className="absolute top-0 left-0 w-full h-5 bg-#232323"></div>
      {/* Tool Panel */}
      <ToolPanel />
    </div>
  );
};


export const RightPanel: React.FC = () => {
  const { handleMouseDown } = justDrag();
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PROGRAM_WINDOW,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div className={`w-1/7 bg-right-panel rounded z-10 relative ${isDragging ? 'opacity-50' : ''}`}>
      {/* Draggable area at the top of the right panel */}
      <div ref={drag} className="absolute top-0 left-0 w-full h-5 bg-#232323"></div>
      {/* Tool Panel */}
      
      {/* Add content for the right panel here */}
      <p className="text-lg font-semibold mt-4 mr-10 ml-10">Inspector</p>
    </div>
  );
};  
