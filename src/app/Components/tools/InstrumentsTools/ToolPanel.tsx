// ToolPanel.tsx
// Uncomment the following line if "use client" is not a comment
// "use client";
import React, { useState, useEffect, useRef } from 'react';
import ToolIcon from './ToolIcon';
import ContextMenu from '../ContextMenu';
import { addActivity } from '@/app/Panels/ConsoleBar';
import { toolsMain, toolsExtra } from './toolConfig';
import { getIsWriting } from '@/app/state/isWriting';

let globalactiveTool: string | null = null;

export const getGlobalActiveTool = (): string | null => globalactiveTool;

export const setGlobalActiveTool = (tool: string | null): void => {
  globalactiveTool = tool;
  addActivity(`Selected global tool: ${globalactiveTool}`);
};

const ToolPanel: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(getGlobalActiveTool());
  const [hoveredTool, setHoveredTool] = useState<string | null>(null); //Fix Set Hover Speed or accuracy !!!! FIX
  const [lastRightClickedTool, setLastRightClickedTool] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [tools, setTools] = useState<typeof toolsMain>(toolsMain);
  const [toolsEx, setToolsEx] = useState<typeof toolsExtra>(toolsExtra);
  const [brotherTools, setBrotherTools] = useState<typeof toolsExtra>([]);



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
      if (shiftKey) // while swappin swap active tool too !!!! FIX
      { 
        const matchingToolEx = toolsEx.find((tool) => tool.group === clickedTool.group);
        if (matchingToolEx) {
          swapTools(clickedTool, matchingToolEx);
        }
      } else {
        
        addActivity(`Selected tool: ${toolName}`);

        if (!clickedTool.isToggle && clickedTool.toolFunction)   // If it's not a toggle, call the tool function right away
        {
          addActivity(`used tool: ${toolName}`);
          clickedTool.toolFunction();
        }
        else // else set the active global tool for canvas
        {
          if (activeTool === toolName) {
            setActiveTool(null);
            addActivity(`Unselected tool: ${toolName}`);
            setGlobalActiveTool(null);
          } else {
            setActiveTool(toolName);
            setGlobalActiveTool(toolName);
            addActivity(`Selected tool: ${toolName}`);
          }
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
      const updatedBrotherTools = toolsEx.filter(tool => tool.group === brotherGroup && tool.name !== toolName);
      setBrotherTools(updatedBrotherTools);
      addActivity(`brotherGroup ${brotherGroup}`);
      addActivity(`Number of brother tools: ${brotherTools.length}`);
      
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
    if(getIsWriting())
      return;
    if (document.hasFocus()) 
    {
      if(event.key)
      {
        const matchingTool = tools.find((tool) => tool.shortcut === event.key.toUpperCase());

        // Check if only the specified key is pressed without any modifier keys
        const isOnlyKey = !event.ctrlKey
    
        const isOnlyKeys = 
              (!event.ctrlKey && !event.altKey) && 
              (tools.find((tool) => tool.shortcut === event.key.toUpperCase()) !== undefined);
    
          if (!isOnlyKeys) {return}
    
        if (event.shiftKey && matchingTool) { //swap active tool while swapping !!!! FIX
          const matchingToolEx = toolsEx.find((tool) => tool.group === matchingTool.group);
          if (matchingToolEx) {
            swapTools(matchingTool, matchingToolEx);
          }
        } else {
          setShowMenu(false);
          if (matchingTool) {
            if(matchingTool.isToggle)
              setActiveTool(matchingTool.name);
            else if(matchingTool.toolFunction)
              matchingTool.toolFunction();
          }
          if(matchingTool?.isToggle)
          {
              if(matchingTool.toolFunction)
              {
                matchingTool.toolFunction();
              }
                
            
              var newGlobalActiveTool = getGlobalActiveTool();
              if (activeTool === newGlobalActiveTool) {
                setActiveTool(null);
                addActivity(`Unselected tool: ${newGlobalActiveTool}`);
                setGlobalActiveTool(null);
              } else {
                setActiveTool(newGlobalActiveTool);
                addActivity(`Selected tool: ${newGlobalActiveTool}`);
              }
          }
        }
      }
    }
  };  
  
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    
    // Call useTool to set up event listener for further mouse click events
    if (activeTool) 
    {
      const clickedTool = tools.find(tool => tool.name === activeTool); // check if clicked inside canvas or check toggle
      if (clickedTool && clickedTool.toolFunction) 
      {
        //clickedTool.toolFunction(); // run the tool function on click down if inside canvas ??!
        //useTool(clickedTool);
      }
    }
  
    // Cleanup the event listeners on component unmount
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, tools, addActivity]);
  

  return (
    <div className="w-5 ml-7 mr-7 flex flex-col items-center space-y-7 mt-14">
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
          }}
          onContextMenu={(e) => handleToolRightClick(e, tool.name)}
          onMouseEnter={() => setHoveredTool(tool.name)}
          onMouseLeave={() => setHoveredTool(null)}
        />
      ))}
      {showMenu && contextMenuPosition && ( //Context menu position is affected by scrolling up and down !!!! FIX
        <ContextMenu   
          tools={brotherTools}
          onMenuItemClick={handleMenuToolClick}
          menuRef={menuRef}
          position={contextMenuPosition}
        />
      )}
    </div>
  );
};
export default ToolPanel;