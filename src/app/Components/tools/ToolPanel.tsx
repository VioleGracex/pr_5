// ToolPanel.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toolsMain, toolsExtra } from './toolConfig';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import ToolIcon from './ToolIcon'; // Import ToolIcon component
import ContextMenu from './ContextMenu'; // Import ContextMenu component

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
          tools={toolsEx} // Pass the toolsEx array as a prop to ContextMenu
          onMenuItemClick={handleMenuToolClick}
          menuRef={menuRef}
          position={contextMenuPosition}
        />
      )}
    </div>
  );
};

export default ToolPanel;
