// LayerWindow.tsx
import React, { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { TitleButtons } from '../Functions/TitleFunctions';
import createAnotherWindow from './AnotherWindow'; // Import the createAnotherWindow function

interface LayerWindowProps {
  numberOfLayers: number;
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayerWindow: React.FC<LayerWindowProps> = ({ numberOfLayers, isFullscreen, setIsFullscreen }) => {
  useEffect(() => {
    // Open the LayerWindow and create another window when the component mounts
    openLayerWindow();
    createAnotherWindow();

    // Cleanup function to close the windows when the component unmounts
    return () => {
      closeLayerWindow();
    };
  }, []);

  const openLayerWindow = async () => {
    // Create a new webview window for the LayerWindow
    await invoke('openLayerWindow', {
      label: 'layers',
      url: 'http://localhost:2000', // Replace with your desired URL or 'index.html' if it's a local file
      width: 800,
      height: 600,
    });
  };

  const closeLayerWindow = async () => {
    // Close the LayerWindow
    await invoke('closeLayerWindow');
  };

  return (
    <div className="hidden">
      {/* This div is necessary to prevent React warnings about unmounted components */}
      {/* Content of LayerWindow is now opened in a separate window */}
      {/* You can keep the original content here if needed */}
      <h2 className="text-lg font-semibold mb-2">Layers</h2>
      <div className="bg-black p-4 mt- rounded border border-gray-300 shadow-md w-full">
        <h3 className="text-md font-semibold mb-2">Depth Window</h3>
        {Array.from({ length: numberOfLayers }, (_, index) => (
          <div key={index} className="bg-white border border-gray-300 w-full h-8 rounded mb-2 flex items-center">
            <p className="ml-2 text-black text-sm">Layer {index}</p>
          </div>
        ))}
      </div>
      <TitleButtons isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
    </div>
  );
};

export default LayerWindow;
