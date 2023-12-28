// pages/page.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import MenuBar from './Components/MenuBar';
import Layer from './Components/Layer'; 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftPanel, RightPanel } from './Panels/MainPanels';
import { AppStateProvider } from './state/AppStateContext';
import { saveStateToFile } from './utils/file';
import PopupMessage from './utils/PopupMessage';

const Home: React.FC = () => {
  const gridSize = 100; // Number of cells per row and column
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const layersStackRef = useRef([{ id: 1, name: 'Default Layer' }]); // Initialize with one default layer

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default right-click behavior
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // Check if Ctrl + S is pressed
    if (event.ctrlKey && event.key === 's') {
      const fileName = prompt('Enter file name:', 'state_backup');
      if (fileName) {
        //saveStateToFile(layersStackRef.current, fileName);
        setPopupMessage(`SAVED: ${fileName}.wise`);
      }
    }

    // Check if Ctrl + Shift + N is pressed
    if (event.ctrlKey && event.shiftKey && event.key === 'N') {
      createNewLayer();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // No dependencies, so it runs once on mount

  const closePopup = () => {
    setPopupMessage(null);
  };

  const createNewLayer = () => {
    if (layersStackRef.current.length > 0) {
      const newLayerId = layersStackRef.current.length + 1;
      const newLayer = { id: newLayerId, name: `Layer ${newLayerId}` };
      layersStackRef.current = [...layersStackRef.current, newLayer];
      forceUpdate(); // Update the component to reflect the changes
    }
  };

  const forceUpdate = () => {
    // Dummy state update to force re-render
    setPopupMessage(''); 
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-Menu-panel rounded" onContextMenu={handleContextMenu}>
        {/* Top MenuBar */}
        <MenuBar />

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Left Side (Tool Panel) */}
          <LeftPanel />

          {/* Center/Main Area with Layer */}
          <div className="flex-1 relative overflow-hidden rounded" onContextMenu={handleContextMenu}>
            {/* Add your main app content here */}
            <h1 className="text-2xl font-bold mb-4"></h1>

            {/* Layer */}
            <Layer gridSize={gridSize} layers={layersStackRef.current} />

          </div>

          {/* Right Side (Right Panel) */}
          <RightPanel />
        </div>

        {/* Popup Message */}
        {popupMessage && <PopupMessage message={popupMessage} onClose={closePopup} />}
      </div>
    </DndProvider>
  );
};

export default Home;