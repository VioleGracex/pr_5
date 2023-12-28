// ToolPanel.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect, useRef } from 'react';
import { toolsMain, toolsExtra } from './toolConfig';
import ToolIcon from './ToolIcon'; // Import ToolIcon component
import ContextMenu from './ContextMenu'; // Import ContextMenu component

const ToolPanel: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [lastRightClickedTool, setLastRightClickedTool] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [tools, setTools] = useState<typeof toolsMain>(toolsMain);
  const [toolsEx, setToolsEx] = useState<typeof toolsExtra>(toolsExtra);

  const brotherGroup = hoveredTool ? tools.find(tool => tool.name === hoveredTool)?.group : '';

  const swapTools = (tool1: typeof toolsMain[number], tool2: typeof toolsExtra[number]) => {
    setTools((prevTools) => {
      const index1 = prevTools.findIndex((tool) => tool.name === tool1.name);
  
      if (index1 !== -1) {
        const updatedTools = [...prevTools];
        updatedTools[index1] = { ...tool2 };
        return updatedTools;
      }
  
      return prevTools;
    });
  
    setToolsEx((prevToolsEx) => {
      const index2 = prevToolsEx.findIndex((tool) => tool.name === tool2.name);
  
      if (index2 !== -1) {
        const updatedToolsEx = [...prevToolsEx];
        updatedToolsEx[index2] = { ...tool1 };
        return updatedToolsEx;
      }
  
      return prevToolsEx;
    });
  
    console.log(`Swapping ${tool1.name} with ${tool2.name}`);
  };

  const handleToolClick = (toolName: string, shiftKey: boolean = false) => {
    const clickedTool = tools.find(tool => tool.name === toolName);

    if (shiftKey && clickedTool) {
      const matchingToolEx = toolsEx.find(tool => tool.group === clickedTool.group);
      if (matchingToolEx) {
        swapTools(clickedTool, matchingToolEx);
      }
    } else {
      setActiveTool(activeTool === toolName ? null : toolName);
    }

    setShowMenu(false);
  };

  const handleToolRightClick = (event: React.MouseEvent, toolName: string) => {
    event.preventDefault();
    setHoveredTool(toolName);
    setLastRightClickedTool(toolName);

    const hoveredToolElement = document.querySelector(`[data-tool="${toolName}"]`);
    const toolPosition = hoveredToolElement?.getBoundingClientRect();

    if (toolPosition) {
      const menuPosition = {
        top: toolPosition.top - 110,
        left: toolPosition.right + window.scrollX + 10,
      };

      setContextMenuPosition(menuPosition);

      const brotherTools = toolsEx.filter(tool => tool.group === brotherGroup && tool.name !== toolName);

      console.log(`Number of brother tools: ${brotherTools.length}`);

      if (brotherTools.length > 0) {
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    }
  };

  const handleMenuToolClick = () => {
    const clickedTool = tools.find(tool => tool.name === lastRightClickedTool);
  
    // Check if the clicked tool exists
    if (clickedTool) {
      const matchingToolEx = toolsEx.find(tool => tool.group === clickedTool.group);
  
      // Check if there's a matching tool in toolsEx
      if (matchingToolEx) {
        swapTools(clickedTool, matchingToolEx);
      }
    }
  
    // setActiveTool(lastRightClickedTool);
    setShowMenu(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (document.hasFocus()) {
      const matchingTool = tools.find((tool) => tool.shortcut === event.key.toUpperCase());
      setShowMenu(false);
      if (matchingTool) {
        setActiveTool(matchingTool.name);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, tools]);

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
