// pages/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import MenuBar from './Components/MenuBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftPanel, RightPanel } from './Panels/MainPanels';
import { useAppState } from './state/AppStateContext';
import { saveStateToFile } from './utils/file';
import PopupMessage from './utils/PopupMessage';
import { AppStateProvider } from './state/AppStateContext';

const Home: React.FC = () => {
  //const { state, undo, redo } = useAppState();
  const gridSize = 100; // Number of cells per row and column
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default right-click behavior
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // Check if Ctrl + S is pressed
    if (event.ctrlKey && event.key === 's') {
      const fileName = prompt('Enter file name:', 'state_backup');
      if (fileName) {
        saveStateToFile(state, fileName);
        setPopupMessage(`SAVED: ${fileName}.wise`); // Update file extension if needed
      }
    }
  };

/*   useEffect(() => {
    if (state) {
      document.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      if (state) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [state]); */

  const closePopup = () => {
    setPopupMessage(null);
  };

  return (
    <AppStateProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen bg-Menu-panel rounded" onContextMenu={handleContextMenu}>
          {/* Top MenuBar */}
          <MenuBar />

          {/* Main Content Area */}
          <div className="flex flex-1">
            {/* Left Side (Tool Panel) */}
            <LeftPanel />

            {/* Center/Main Area with Grid */}
            <div
              className="flex-1 relative overflow-hidden rounded"
              onContextMenu={handleContextMenu} // Add the context menu handler here
            >
              {/* Add your main app content here */}
              <h1 className="text-2xl font-bold mb-4">Main App Area</h1>

              {/* Infinite Grid */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded">
                <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                  {/* Grid Cells */}
                  {Array.from({ length: gridSize * gridSize }, (_, index) => (
                    <div key={index} className="bg-white border border-gray-300 w-10 h-10 rounded"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side (Right Panel) */}
            <RightPanel />
          </div>

          {/* Popup Message */}
          {popupMessage && <PopupMessage message={popupMessage} onClose={closePopup} />}
        </div>
      </DndProvider>
      </AppStateProvider>
  );
};

export default Home;
