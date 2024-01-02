// components/MenuBar.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect, useRef } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { FaWindowMinimize, FaWindowRestore, FaRegWindowMaximize, FaTimes, FaAngleRight, FaCheck } from 'react-icons/fa';
import {useDrag,handleToggleMaximize,TitleButtons} from './Functions/TitleFunctions'; // Import functions from TitleFunctions
import './MenuBar.css'; // Import the CSS file

const MenuBar: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { handleMouseDown } = useDrag(() => handleToggleMaximize(setIsFullscreen));
  

  return (
    <div className="relative">
      {/* Background Element */}
      <div
        className="fixed top-0 left-0 w-full h-16 bg-black-2000 opacity-100 z-10"
      ></div>
      {/* Draggable Area */}
      <div
        className="fixed top-0 left-0 w-full h-16 mb-4 bg-black opacity-0 z-10"
        onMouseDown={handleMouseDown}
      ></div>
      <div className="text-white p-4 w-40 flex justify-between items-center relative z-50">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <img src="/Logo.png" alt="Logo" className="h-12 w-auto mr-8" />

          {/* Middle: Menu Text */}
          <div className="flex ml-auto space-x-6 ">
            {/* File Menu */}
            <Menu label="File" index={0}>
              <MenuItem label="New" />
              <MenuItem label="Open" />
              {/* ... other file menu items ... */}
            </Menu>

            {/* Edit Menu */}
            <Menu label="Edit" index={1}>
              <MenuItem label="Undo" />
              <MenuItem label="Redo" />
              {/* ... other edit menu items ... */}
            </Menu>

            {/* Image Menu */}
            <Menu label="Image" index={2}>
              <MenuItem label="Insert Image" />
              <MenuItem label="Edit Image" />
              {/* ... other image menu items ... */}
            </Menu>

            {/* Layer Menu */}
            <Menu label="Layer" index={3}>
              <MenuItem label="Add Layer" />
              <MenuItem label="Delete Layer" />
              <MenuItem label="Merge Layers" />
              <MenuItem label="Layer Order" />
              {/* ... other layer menu items ... */}
            </Menu>

            {/* Select Menu */}
            <Menu label="Select" index={4}>
              <MenuItem label="Select Objects" />
              <MenuItem label="Select Layer" />
              <MenuItem label="Select All" />
              {/* ... other select menu items ... */}
            </Menu>

            {/* View Menu */}
            <Menu label="View" index={5}>
              <MenuItem label="Zoom In" />
              <MenuItem label="Zoom Out" />
              <MenuItem label="Fit to Screen" />
              <MenuItem label="Grid" />
              <MenuItem label="Snap to Grid" />
              {/* ... other view menu items ... */}
            </Menu>
            {/* Window Menu */}
            <Menu label="Window" index={6} >
              <MenuItem label="Workspace" isNested>
                <MenuItem label="Essentials" isToggle={true}  />
                <MenuItem label="Architecture" isToggle={true}  />
                <MenuItem label="Painter" isToggle={true}  />
              </MenuItem>
              {/* Separator */}
              <div className="border-t border-gray-300 my-2"></div>
              {/* Toggle Windows get real value later */}
              <MenuItem label="ToolBar" isToggle  />
              <MenuItem label="Navigator" isToggle />
              <MenuItem label="Layer" isToggle />
              <MenuItem label="Paths" isToggle />
              <MenuItem label="Buildings"  isToggle />
              <MenuItem label="NPCS"  isToggle />
              <MenuItem label="Inspector" isToggle />
            </Menu>

            {/* Rest of the Menus */}
            {/* ... Add more menus and items following the same pattern ... */}
          </div>
        </div>

        {/* Right Side: Menus and Buttons */}
        <TitleButtons isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
      </div>
    </div>
  );
};

interface MenuProps {
  label: string;
  children?: React.ReactNode;
  index: number;
}

const Menu: React.FC<MenuProps> = ({ label, children, index }) => {
  const [activeChild, setActiveChild] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setActiveChild(activeChild === index ? null : index);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActiveChild(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="group relative" ref={menuRef}>
      <button className=" cursor-pointer whitespace-nowrap" onClick={toggleMenu}>
        {label}
      </button>
      {activeChild === index && (
       <div className="absolute bg-black p-0 m-0">
       <div className="w-full h-full bg-gray-400 text-black p-2 space-y-2">
         {children}
       </div>
     </div>
      )}
    </div>
  );
};

// ... (imports and other code)

interface MenuItemProps {
  label: string;
  onClick?: () => void;
  isToggle?: boolean;
  isActive?: boolean;
  isNested?: boolean;
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, isToggle, isActive, isNested, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);
  const [closeSubmenuTimeout, setCloseSubmenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isActiveLocal, setIsActiveLocal] = useState(isActive || false);

  useEffect(() => {
    // Synchronize local state with prop when it changes
    setIsActiveLocal(isActive || false);
  }, [isActive]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    clearCloseSubmenuTimeout();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCloseSubmenuTimeoutIfNotHovered();
  };

  const handleSubmenuMouseEnter = () => {
    setIsSubmenuHovered(true);
    clearCloseSubmenuTimeout();
  };

  const handleSubmenuMouseLeave = () => {
    setIsSubmenuHovered(false);
    setCloseSubmenuTimeoutIfNotHovered();
  };

  const setCloseSubmenuTimeoutIfNotHovered = () => {
    if (!isHovered && !isSubmenuHovered) {
      setCloseSubmenuTimeout(
        setTimeout(() => {
          setIsSubmenuHovered(false);
        }, 5000)
      );
    }
  };

  const clearCloseSubmenuTimeout = () => {
    if (closeSubmenuTimeout) {
      clearTimeout(closeSubmenuTimeout);
      setCloseSubmenuTimeout(null);
    }
  };

  const handleClick = () => {
    if (!isNested) {
      if (isToggle) {
        setIsActiveLocal(!isActiveLocal); // Toggle local active state
      }
    }
  };

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <button
        className={`text-sm cursor-pointer text-left w-full px-4 py-2 hover:bg-gray-300 focus:outline-none focus:bg-gray-300 flex items-center justify-between whitespace-nowrap ${
          isToggle ? 'flex items-center justify-between' : ''
        }`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        {label}
        {isToggle && isActiveLocal && <FaCheck />}
        {isNested && <FaAngleRight />}
      </button>
      {isHovered && isNested && (
        <div
        className="bg-black p-0 m-0"
      >
        <div
          className="absolute w-44 left-full top-0 mt-0 ml-1 bg-gray-400 text-white-800 p-2 space-y-2 border border-gray-300"
          onMouseEnter={handleSubmenuMouseEnter}
          onMouseLeave={handleSubmenuMouseLeave}
        >
          {children}
        </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
