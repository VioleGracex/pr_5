// components/ToolPanel.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toolsMain, toolsExtra } from './tools/toolConfig';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const tools = toolsMain;
const toolsEx = toolsExtra;

const ToolPanel: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const brotherGroup = hoveredTool ? tools.find(tool => tool.name === hoveredTool)?.group : '';

  const handleToolClick = (toolName: string, shiftKey: boolean = false) => {
    // If shiftKey is pressed, swap icon or image and name with the corresponding tool in toolsEx
    if (shiftKey) {
      const clickedTool = tools.find(tool => tool.name === toolName);
      if (clickedTool) {
        const matchingToolEx = toolsEx.find(tool => tool.group === clickedTool.group);
  
        // Swap icon or image and name
        if (matchingToolEx) {
          const updatedTools = tools.map(tool =>
            tool.name === toolName
              ? { ...tool, icon: matchingToolEx.icon, Image: matchingToolEx.Image, name: matchingToolEx.name }
              : tool
          );
  
          // Update the tools state
          // Assuming you have a state setter function for tools, use that here
          // setTools(updatedTools);
        }
      }
    } else {
      // Set the active tool normally
      setActiveTool(activeTool === toolName ? null : toolName);
    }
  
    setShowMenu(false);
  };
  
  const handleToolRightClick = (event: React.MouseEvent, toolName: string) => {
    event.preventDefault();
    setHoveredTool(toolName);
  
    // Find the hovered tool's position
    const hoveredToolElement = document.querySelector(`[data-tool="${toolName}"]`);
    const toolPosition = hoveredToolElement?.getBoundingClientRect();
  
    // Check if toolPosition is defined before accessing its properties
    if (toolPosition) {
      // Set the position of the context menu next to the hovered tool
      const menuPosition = {
        top: toolPosition.top - 110,
        left: toolPosition.right + window.scrollX + 10,
      };
  
      // Pass the position to state
      setContextMenuPosition(menuPosition);
  
      // Find all tools in toolsEx
      const brotherTools = toolsEx.filter(tool => tool.group === brotherGroup && tool.name !== toolName);
  
      // Log the number of brother tools to the console
      console.log(`Number of brother tools: ${brotherTools.length}`);
  
      // Show the context menu only if there are brother tools
      if (brotherTools.length > 0) {
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    }
  };

  const handleMenuToolClick = (toolName: string) => {
    setActiveTool(toolName);
    setShowMenu(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="w-5 ml-7 mr-7 flex flex-col items-center space-y-7 mt-20">
      {tools.map((tool, index) => (
        <ToolIcon
          key={index}
          icon={tool.icon}
          Image={tool.Image}
          name={tool.name}
          shortcut={tool.shortcut}
          active={activeTool === tool.name}
          isHovered={hoveredTool === tool.name}
          onClick={(e) => handleToolClick(tool.name, e.shiftKey)}
          onContextMenu={(e) => handleToolRightClick(e, tool.name)}
          onMouseEnter={() => setHoveredTool(tool.name)}
          onMouseLeave={() => setHoveredTool(null)}
        />
      ))}
      {showMenu && contextMenuPosition && (
        <ContextMenu
          tools={toolsEx}
          onMenuItemClick={handleMenuToolClick}
          menuRef={menuRef}
          position={contextMenuPosition}
        />
      )}
    </div>
  );
};

const ToolIcon: React.FC<{
  icon?: IconDefinition;
  Image?: { src: string; height: number; width: number }; // Assuming Image is a path to the file
  name: string;
  shortcut?: string; // Make shortcut optional
  active: boolean;
  isHovered: boolean;
  onClick: (e: React.MouseEvent) => void; // Update the type of onClick
  onContextMenu: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ icon, Image, name, shortcut = "", active, isHovered, onClick, onContextMenu, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className={`relative w-12 ml-7 mr-7 space-y-2 group border ${
        active ? 'border-blue-500 border-2 rounded ' : 'border-transparent'
      }`}
      data-tool={name} // Add data-tool attribute with tool name
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className="tool-icon ml-2" size="lg" />
      )}
      {Image && (
        <img
          src={Image.src}
          alt={name}
          className="tool-icon ml-2"
          style={{ width: '1.3em', height: '1.3em' }}
        />
      )}
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

const ContextMenu: React.FC<{
  tools: typeof tools;
  onMenuItemClick: (toolName: string) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  position: { top: number; left: number } | null; // New position prop
}> = ({ tools, onMenuItemClick, menuRef, position }) => {
  return (
    <div
      ref={menuRef}
      className="absolute p-2  rounded"
      style={{ top: position?.top, left: position?.left,backgroundColor: "#3b3a3a" }}
    >
      {tools.map((tool) => (
        <div
          key={tool.name}
          className="cursor-pointer text-white p-2 hover:bg-gray-600 rounded flex items-center"
          onClick={() => onMenuItemClick(tool.name)}
          style={{ whiteSpace: 'nowrap', fontSize: '0.9em' }}
        >
          {tool.icon && <FontAwesomeIcon icon={tool.icon} className="mr-2" />}
          {tool.Image && (
            <img
              src={tool.Image.src}
              alt={tool.name}
              className="mr-2"
              style={{ width: '1.3em', height: '1.3em' }}
            />
          )}
          <span>{tool.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ToolPanel;
