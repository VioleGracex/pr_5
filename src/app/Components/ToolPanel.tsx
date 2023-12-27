// components/ToolPanel.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsAlt,
  faSquare,
  faCrop,
  faPen,
  faPencil,
  faPaintBrush,
  faSearch,
  faFont,
  faHandPaper,
  faShapes,
  faFillDrip,
  faRuler,
} from '@fortawesome/free-solid-svg-icons';
import toolConfig from './tools/toolConfig';

const tools = toolConfig;

const ToolPanel: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const handleToolClick = (toolName: string) => {
    setActiveTool(activeTool === toolName ? null : toolName);
    // Add your toggle functionality or other logic here
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the app is focused before capturing keyboard input
      if (document.hasFocus()) {
        const key = event.key.toUpperCase();
        const matchingTool = tools.find((tool) => tool.shortcut === key);
        if (matchingTool) {
          handleToolClick(matchingTool.name);
        }
      }
    };

    // Add the event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool]); // Dependency array includes activeTool to avoid any stale closures

  return (
    <div className="w-5 ml-7 mr-7 flex flex-col items-center space-y-7 mt-20">
      {tools.map((tool, index) => (
        <ToolIcon
          key={index}
          icon={tool.icon}
          name={tool.name}
          shortcut={tool.shortcut}
          active={activeTool === tool.name}
          isHovered={hoveredTool === tool.name}
          onClick={() => handleToolClick(tool.name)}
          onMouseEnter={() => setHoveredTool(tool.name)}
          onMouseLeave={() => setHoveredTool(null)}
        />
      ))}
    </div>
  );
};

const ToolIcon: React.FC<{
  icon: any;
  name: string;
  shortcut: string;
  active: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ icon, name, shortcut, active, isHovered, onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className={`relative w-12 ml-7 mr-7 space-y-2 group border ${
        active ? 'border-blue-500 border-2 rounded ' : 'border-transparent'
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <FontAwesomeIcon icon={icon} className="tool-icon ml-2" size="lg" />
      {isHovered && (
        <div
          className={`opacity-100 bg-gray-800 text-white text-sm p-2 rounded-md absolute left-full ml-2 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 whitespace-nowrap`}
        >
          <span className="mr-1">{name}</span>
          <span className="text-xs font-light">({shortcut})</span>
        </div>
      )}
    </div>
  );
};

export default ToolPanel;
