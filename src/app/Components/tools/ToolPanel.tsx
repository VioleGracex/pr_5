// ToolPanel.tsx
// Uncomment the following line if "use client" is not a comment
// "use client";
import React, { useState, useEffect, useRef } from 'react';
import { toolsMain, toolsExtra } from './toolConfig';
import ToolIcon from './ToolIcon';
import ContextMenu from './ContextMenu';
import { addActivity } from '@/app/Panels/ConsoleBar';
import Layer from '../Layer'; // Import your Layer component

const ToolPanel: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [lastRightClickedTool, setLastRightClickedTool] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [tools, setTools] = useState<typeof toolsMain>(toolsMain);
  const [toolsEx, setToolsEx] = useState<typeof toolsExtra>(toolsExtra);

  const layerRef = useRef<HTMLDivElement>(null); // Add a ref for the Layer component

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
    const clickedTool = tools.find((tool) => tool.name === toolName);

    if (clickedTool) {
      if (shiftKey) {
        const matchingToolEx = toolsEx.find((tool) => tool.group === clickedTool.group);
        if (matchingToolEx) {
          swapTools(clickedTool, matchingToolEx);
        }
      } else {
        
        addActivity(`Selected tool: ${toolName}`);

        if (!clickedTool.isToggle && clickedTool.toolFunction) {
          // If it's not a toggle, call the tool function right away
          clickedTool.toolFunction();
        }
        else
        {
          setActiveTool(clickedTool.isToggle ? (activeTool === toolName ? null : toolName) : null);
        }
      }

      setShowMenu(false);
    }
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

  const useTool = (tool: typeof toolsMain[number] | typeof toolsExtra[number]) => {
    const isToolActive = activeTool === tool.name;
  
    if (isToolActive && tool.toolFunction) {
      const handleMouseClick = (event: MouseEvent) => {
        const { clientX, clientY } = event;
  
        // Check if the tool requires being in bounds
        if (tool.inBound !== undefined && tool.inBound !== null && tool.inBound) {
          const layerRect = layerRef.current?.getBoundingClientRect();
  
          // Check if the mouse is on a Layer component
          if (layerRect && clientX >= layerRect.left && clientX <= layerRect.right && clientY >= layerRect.top && clientY <= layerRect.bottom) {
            // Execute the tool function and add an activity
            tool.toolFunction && tool.toolFunction();
            addActivity(`Used tool function: ${tool.toolFunction?.name + " " + tool.name || 'Unnamed Function'}`);
          }
        } else {
          // Execute the tool function directly and add an activity
          tool.toolFunction && tool.toolFunction();
          addActivity(`Used tool function: ${tool.toolFunction?.name + " " + tool.name || 'Unnamed Function'}`);
        }
      };
  
      // Add the event listener for mouse click
      document.addEventListener('click', handleMouseClick);
  
      // Cleanup the event listener on component unmount
      return () => {
        document.removeEventListener('click', handleMouseClick);
      };
    }
  };
  
  

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    
    // Call useTool to set up event listener for further mouse click events
    if (activeTool) {
      const clickedTool = tools.find(tool => tool.name === activeTool);
      if (clickedTool && clickedTool.toolFunction) {
        useTool(clickedTool);
      }
    }
  
    // Cleanup the event listeners on component unmount
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, tools, addActivity]);
  

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
          onClick={(e) => {
            handleToolClick(tool.name, e.shiftKey);
            if (tool.toolFunction) {
              tool.toolFunction(); // Call the tool function on click
              useTool(tool); // Setup event listener for further mouse click events
            }
          }}
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
