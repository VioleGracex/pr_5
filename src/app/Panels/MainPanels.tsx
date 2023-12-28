// Panels/MainPanels.tsx
"use client";
import React from 'react';
import ToolPanel from '../Components/tools/ToolPanel';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/Constants';
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
      {/* Add any additional content or functionality for the left panel */}
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
      {/* Add any additional content or functionality for the right panel */}

      {/* Docked Layers Window with Borders and Shadows */}
      <div className="bg-gray-00 p-4 rounded-t-lg absolute bottom-20 w-full border border-gray-300 shadow-md">
        <h2 className="text-lg font-semibold">Layers</h2>
        {/* Add the content for the Layers tab here */}
        {/* You can use the Layer component or any other component for the Layers tab */}

        {/* Window with Depth */}
        <div className="bg-black p-4 mt- rounded border border-gray-300 shadow-md  w-full">
          <h3 className="text-md font-semibold mb-2">Depth Window</h3>
          {/* Add content for the window with depth here */}
          {/* You can use any components or elements inside this window */}
        </div>
      </div>
    </div>
  );
};