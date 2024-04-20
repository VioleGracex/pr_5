// Panels/MainPanels.tsx
import React, { useState, useEffect } from 'react';
import ToolPanel from '../Components/tools/InstrumentsTools/ToolPanel';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/Constants';
import { justDrag } from '../Components/Functions/TitleFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcase, faDice, faTimes, faSync, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ChromePicker, ColorResult } from 'react-color';
import { addActivity } from '@/app/Panels/ConsoleBar';
import { togglePanelVisibility , setPanelVisibility, getPanelVisibility } from '../state/panelVisibility';
import {getActiveNpcToken } from '../state/ActiveElement';
import { setIsWriting } from '../state/isWriting';
import NPCToken from '../Components/tools/Objects/NPCToken';
import JobsData from '../Components/Data/Jobs.json'; // Assuming Jobs.json is in the same directory
/* import { setIsPaletteVisibleState, getIsPaletteVisibleState, usePalette } from '../Components/tools/useTools/usePalette'; */



// Global variable to track the visibility of the NPC editor window
export const LeftPanel: React.FC = () => {
  const { handleMouseDown } = justDrag();
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PROGRAM_WINDOW,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div className={`w-1/7 h-full `}>
      <div className={`w-1/7 h-full bg-left-panel rounded z-10 relative ${isDragging ? 'opacity-50' : ''}`}>
        {/* Draggable area at the top of the left panel */}
        <div ref={drag} className="absolute top-0 left-0 w-full h-5 bg-#232323"></div>
        {/* Tool Panel */}
        <ToolPanel />
        {/* Add any additional content or functionality for the left panel */}
      </div>
    </div>
  );
};

interface RightPanelProps {
  numberOfLayers: number;
}

export const RightPanel: React.FC<RightPanelProps> = ({ numberOfLayers }) => {
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
      <p className="text-lg font-semibold mt-4 mr-10 ml-10">Inspector</p>

      {/* Layers Tab with Vertical Scroll */}
      <div className="bg-gray-00  rounded-t-lg absolute bottom-20 w-full border border-gray-300 shadow-md  h-96">
        <h2 className=" text-lg font-semibold mb-2">Layers</h2>

        {/* Depth Window */}
        <div className="bg-black p-4 mt- rounded border border-gray-300 shadow-md w-full ">
          <h3 className="  text-md font-semibold mb-2">Depth Window</h3>
          {/* Add content for the window with depth here */}
          {/* You can use any components or elements inside this window */}
        
          {/* Instantiate rectangles for each layer in a vertical layout */}
          {Array.from({ length: numberOfLayers }, (_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 w-full h-8 rounded mb-2 flex items-center"
            >
              <p className="ml-2 text-black text-sm">Layer {index}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface NPCEditor {
  token?: NPCToken | null;
}


export const NpcEditorPanel: React.FC<NPCEditor> = ({ token }) => {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [race, setRace] = useState('');
  const [description, setDescription] = useState('');
  const [src, setSrc] = useState('');
  const [filePath, setFilePath] = useState<string>(''); // State to hold file path
  const jobTitles = JobsData;
  const races = ['human', 'elf', 'orc', 'dwarf'];


  const handleDiceRoll = (propertyName: string) => {
    token = getActiveNpcToken();
    if (token) {
      switch (propertyName) {
        case 'name':
          const randomName = races[Math.floor(Math.random() * races.length)];
          token.setName(randomName);
          break;
        case 'job':
          const randomJobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
          setJob(randomJobTitle);
          token.setJob(randomJobTitle);
          break;
        case 'race':
          const randomRace = races[Math.floor(Math.random() * races.length)];
          setRace(randomRace);
          token.setRace(randomRace); // Should this be `setRace` instead of `setJob`?
          break;
        case 'description':
          // Handle description logic here if needed
          break;
        default:
          break;
      }
      alert('Dice rolled!');
    }
    return null; // Ensure a JSX element is returned
  };
  



  const handleClosePanel = () => {
    setPanelVisibility('npcEditorPanelWrapper', false);
    clearFields();
  };

  const handleInputChange = (propertyName: string, value: string) => {
    setIsWriting(true);
    token = getActiveNpcToken()
    if (token) {
      switch (propertyName) {
        case 'name':
          token.setName(value);
          addActivity('called set name');
          break;
        case 'job':
          token.setJob(value);
          break;
        case 'race':
          token.setRace(value);
          break;
        case 'description':
          token.setDescription(value);
          break;
        default:
          break;
      }
    }
  };

  const handleInputBlur = () => {
    setIsWriting(false);
  };

  const refreshFields = () => {
    token = getActiveNpcToken();
    if (token) {
      setName(token.getName());
      setJob(token.getJob());
      setRace(token.getRace());
      setDescription(token.getDescription());
      setSrc(token.getSrc());
    } else {
      clearFields();
    }
  };

  const clearFields= () => {
    setName('');
    setJob('');
    setRace('');
    setDescription('');
  }

  // Function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    token = getActiveNpcToken();
    const file = event.target.files?.[0];
    if (file) {
      // Check file size
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSizeInBytes) {
        addActivity('File size exceeds the limit of 5MB. Please choose a smaller file.');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        addActivity('Invalid file type. Please select a JPEG, PNG, or GIF file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        if (token) {
          token.setSrc(dataUrl);
          addActivity('Image uploaded');
        }
      };
      reader.readAsDataURL(file);

      // Set file path
      setFilePath(file.name); // Assuming file name as the file path for simplicity
    } else {
      addActivity('No file selected. Please choose an image file.');
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.button === 0) { // Check if the left mouse button was clicked
        /* if(getActiveNpcToken() !== token) // refresh rightaway with no closing
        {
          refreshFields();
        } */
        const panel = document.querySelector('.bg-editor-panel'); // Adjust selector based on your panel class
        const npcToken = document.querySelector('NpcToken'); // Adjust selector based on your NPC token class
        if (panel && !panel.contains(event.target as Node)) {
          if (npcToken && !npcToken.contains(event.target as Node)) {
            refreshFields();
          } else {
            handleClosePanel();
            refreshFields();
          }
        }
      }
    };
  
    document.body.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`w-1/7 h-full bg-editor-panel rounded z-10 relative`}>
      <div className="flex justify-between items-center mt-4 ml-4 mb-4">
        <p className="text-lg font-semibold">NPC Editor <button className="rounded hover:bg-gray-600" onClick={refreshFields}>
        <FontAwesomeIcon icon={faSync} /> {/* Add the refresh icon */}
        </button></p>
        <button className="hover:bg-gray-1000 text-gray-200 px-2 py-1 mr-4 mb-3" onClick={handleClosePanel}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
  
      <div className="flex items-center border border-gray-300 rounded p-3 mb-4 mx-4">
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            handleInputChange('name', e.target.value);
          }}
          onBlur={handleInputBlur}
          className="flex-grow outline-none text-black"
        />
        <button className="ml-3 rounded hover:bg-gray-600" onClick={() => handleDiceRoll('name')}>
          <FontAwesomeIcon icon={faDice} />
        </button>
      </div>
  
      <div className="flex items-center border border-gray-300 rounded p-3 mb-4 mx-4">
        <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
        <input
          type="text"
          placeholder="Job"
          value={job}
          onChange={(e) => {
            setJob(e.target.value);
            handleInputChange('job', e.target.value);
          }}
          onBlur={handleInputBlur}
          className="flex-grow outline-none text-black"
        />
        <button className="ml-3 rounded hover:bg-gray-600" onClick={() => handleDiceRoll('job')}>
          <FontAwesomeIcon icon={faDice} />
        </button>
      </div>
  
      <div className="flex items-center border border-gray-300 rounded p-3 mb-4 mx-4">
        <select
          value={race}
          onChange={(e) => {
            setRace(e.target.value);
            handleInputChange('race', e.target.value);
          }}
          onBlur={handleInputBlur}
          className="flex-grow outline-none text-black"
        >
          <option value="" disabled>
            Race
          </option>
          {races.map((raceOption) => (
            <option key={raceOption} value={raceOption}>
              {raceOption.charAt(0).toUpperCase() + raceOption.slice(1)}
            </option>
          ))}
        </select>
        <button className="ml-3 rounded hover:bg-gray-600" onClick={() => handleDiceRoll('race')}>
          <FontAwesomeIcon icon={faDice} />
        </button>
      </div>
  
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          handleInputChange('description', e.target.value);
        }}
        onBlur={handleInputBlur}
        className="border border-gray-300 rounded p-3 mb-3 mx-4 h-96 outline-none resize-none text-black bg-272424  "
      ></textarea>   
      <div className="flex items-center border border-gray-300 rounded p-3 mb-4 mx-4">
        <div>
          <p className="text-lg font-semibold">Token Icon</p>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={src} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div className="ml-4">
          <label htmlFor="upload" className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-300">
            <FontAwesomeIcon icon={faUpload} className="mr-2" /> Browse
            <input id="upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div> 
      {/* File path display under the upload box */}
      <div className="text-xs text-gray-500 mx-4 mb-2">{filePath}</div>
    </div>
  );    
}; 

interface PalettePanel {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onChangeComplete: (color: ColorResult) => void;
}

export const PalettePanel: React.FC<PalettePanel> = ({ selectedColor, onSelectColor, onChangeComplete }) => {
  const [color, setColor] = useState<ColorResult>({
    hex: selectedColor,
    rgb: { r: 0, g: 0, b: 0, a: 1 },
    hsl: { h: 0, s: 0, l: 0, a: 1 },
  });

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor);
    onSelectColor(newColor.hex);
    addActivity(`changed color to ${newColor.hex}`);
  };

  const handleChangeCompleteLocal = (newColor: ColorResult) => {
    onChangeComplete(newColor);
  };

  const handleOK = () => {
    togglePanelVisibility('palettePanelWrapper');
    // addActivity("CLICKED OK");
  };

  // Render the ColorPickerModule only if the palette is visible
  return  (
    <div style={{ position: 'relative' }}>
      <ChromePicker color={color.rgb} onChange={handleChange} onChangeComplete={handleChangeCompleteLocal} />
      <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <button style={{ marginRight: '15px', backgroundColor: 'white', color: 'black', border: '0.5px solid gray', padding: '5px 10px' }} onClick={handleOK}>OK</button>
      </div>
    </div>
  ) ;
};

