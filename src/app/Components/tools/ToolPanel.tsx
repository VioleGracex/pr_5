// ToolPanel.tsx
// Uncomment the following line if "use client" is not a comment
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { toolsMain, toolsExtra } from './toolConfig';
import ToolIcon from './ToolIcon';
import ContextMenu from './ContextMenu';

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
      const updatedTools = [...prevTools];
      const index1 = prevTools.findIndex((tool) => tool.name === tool1.name);

      if (index1 !== -1) {
        updatedTools.splice(index1, 1);
        updatedTools.splice(index1, 0, { ...tool2, shortcut: tool1.shortcut });
      }

      return updatedTools;
    });

    setToolsEx((prevToolsEx) => {
      const updatedToolsEx = [...prevToolsEx];
      const index2 = prevToolsEx.findIndex((tool) => tool.name === tool2.name);

      if (index2 !== -1) {
        updatedToolsEx.splice(index2, 1);
        updatedToolsEx.push({ ...tool1, shortcut: tool2.shortcut });
      }

      return updatedToolsEx;
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
    setHoveredTool(null);
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

  const handleMenuToolClick = (toolExName: string) => {
    const clickedTool = tools.find(tool => tool.name === lastRightClickedTool);
    const menuTool = toolsEx.find(tool => tool.name === toolExName);

    if (clickedTool && menuTool) {
      swapTools(clickedTool, menuTool);
    }

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
  
      if (event.shiftKey && matchingTool) {
        const matchingToolEx = toolsEx.find((tool) => tool.group === matchingTool.group);
        if (matchingToolEx) {
          swapTools(matchingTool, matchingToolEx);
        }
      } else {
        setShowMenu(false);
        if (matchingTool) {
          setActiveTool(matchingTool.name);
        }
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
          tools={toolsEx}
          onMenuItemClick={handleMenuToolClick}
          menuRef={menuRef}
          position={contextMenuPosition}
        />
      )}
    </div>
  );
};

export default ToolPanel;
