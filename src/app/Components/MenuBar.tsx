// components/MenuBar.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect, useRef } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { FaWindowMinimize, FaWindowRestore, FaRegWindowMaximize, FaTimes } from 'react-icons/fa';
//import { useDrag } from '../Functions/useDrag';
import { useDrag, handleMinimize, handleToggleMaximize, handleExit } from './TitleFunctions'; // Import functions from TitleFunctions
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
      <div className="text-white p-4 w-40  flex justify-between items-center relative z-50">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <img src="/Logo.png" alt="Logo" className="h-12 w-auto mr-8" />

          {/* Middle: Menu Text */}
          <div className="flex ml-auto space-x-4">
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

            {/* Rest of the Menus */}
            {/* ... Add more menus and items following the same pattern ... */}
          </div>
        </div>

        {/* Right Side: Menus and Buttons */}
        <div className="fixed space-x-6 mt-2 right-4 top-4 justify-end">
          {/* Minimize Button */}
          <button
            onClick={handleMinimize}
            className="btn whitespace-nowrap cursor-pointer"
            title="Minimize"
          >
            <FaWindowMinimize />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => handleToggleMaximize(setIsFullscreen)}
            className="btn whitespace-nowrap cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FaWindowRestore /> : <FaRegWindowMaximize />}
          </button>

          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="btn whitespace-nowrap cursor-pointer exit-btn"
            title="Exit"
          >
            <FaTimes />
          </button>

          {/* ... any additional right-side content ... */}
        </div>
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
      <button className="btn cursor-pointer whitespace-nowrap" onClick={toggleMenu}>
        {label}
      </button>
      {activeChild === index && (
        <div className="absolute bg-white text-gray-800 p-2 space-y-2 border border-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

interface MenuItemProps {
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ label }) => {
  return (
    <button className="btn text-sm -cursor-pointer text-left w-full text-gray-800 px-4 py-2 hover:bg-gray-300 focus:outline-none focus:bg-gray-300 whitespace-nowrap">
      {label}
    </button>
  );
};

export default MenuBar;
