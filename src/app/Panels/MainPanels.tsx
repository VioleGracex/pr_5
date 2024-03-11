// Panels/MainPanels.tsx
import React, { useState, useEffect } from 'react';
import ToolPanel from '../Components/tools/ToolPanel';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/Constants';
import { justDrag } from '../Components/Functions/TitleFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcase, faDice, faTimes, faSync  } from '@fortawesome/free-solid-svg-icons';
import { ChromePicker, ColorResult } from 'react-color';
import { addActivity } from '@/app/Panels/ConsoleBar';
import { togglePanelVisibility , setPanelVisibility, getPanelVisibility } from '../state/panelVisibility';
import {getActiveNpcToken } from '../state/ActiveElement';
import { setIsWriting } from '../state/isWriting';
import NPCToken from '../Components/tools/Objects/NPCToken';
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
  
  const races = ['human', 'elf', 'orc', 'dwarf'];

  const handleDiceRoll = () => {
    alert('Dice rolled!');
  };

  const handleRandomRace = () => {
    const randomRace = races[Math.floor(Math.random() * races.length)];
    setRace(randomRace);
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
        <button className="ml-3 rounded hover:bg-gray-600" onClick={handleDiceRoll}>
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
        <button className="ml-3 rounded hover:bg-gray-600" onClick={handleDiceRoll}>
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
        <button className="ml-3 rounded hover:bg-gray-600" onClick={handleRandomRace}>
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

