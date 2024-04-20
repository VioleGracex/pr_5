// components/MenuBar.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect, useRef } from 'react';

import {useDrag,handleToggleMaximize,TitleButtons} from '../../Functions/TitleFunctions'; // Import functions from TitleFunctions
import './MenuBar.css'; // Import the CSS file
import { MenuItems,menuConfig } from './MenuConfig';
import { addActivity } from '../../../Panels/ConsoleBar';
import { MenuItem } from './MenuBarItem';
import { getIsWriting } from '@/app/state/isWriting';

const MenuBar: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { handleMouseDown } = useDrag(() => handleToggleMaximize(setIsFullscreen));
  const fileMenu = menuConfig.find(menu => menu.label === "File");
  

  return (
    <div className="relative">
        {/* Background Element */}
        <div
          className=" bg-Menu-panel fixed top-0 left-0 w-full h-24  bg-gray-800 opacity-100 z-10 "
        ></div>
        <div
          className=" bg-Menu-panel fixed top-0 left-0 w-full h-24 rounded bg-gray-800 opacity-100 z-10 "
        ></div>
        {/* Draggable Area */}
        <div
          className="fixed top-0 left-0 w-full h-16 mb-4 bg-black opacity-0 z-10"
          onMouseDown={handleMouseDown}
        ></div>
      <div className="text-white p-4 w-40 mt-2  relative z-50">  {/* convert these menu into MenuBarConfig  or just add onClick to each of them  ??*/}
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <img src="/Logo.png" alt="Logo" className="h-12 w-auto mr-8" />

          {/* Middle: Menu Text */}
          <div className="flex ml-auto space-x-6 ">
            {/* File Menu */}
            <Menu label="File" index={0}>
              {menuConfig.find(menu => menu.label === "File")?.children?.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
              {/* ... other file menu items ... */}
            </Menu>

            {/* Edit Menu */}
            <Menu label="Edit" index={1}>
              {menuConfig.find(menu => menu.label === "Edit")?.children?.map((item, index) => (
                 <MenuItem key={index} {...item} />
                ))}
              {/* ... other edit menu items ... */}
            </Menu>
            
            {/* Image Menu */}
            <Menu label="Image" index={2}>
              {menuConfig.find(menu => menu.label === "Image")?.children?.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
              {/* ... other image menu items ... */}
            </Menu>
                    
            {/* Layer Menu */}
            <Menu label="Layer" index={3}>
              {menuConfig.find(menu => menu.label === "Layer")?.children?.map((item, index) => (
                      <MenuItem key={index} {...item} />
                    ))}
              {/* ... other layer menu items ... */}
            </Menu>

            {/* Select Menu */}
            <Menu label="Select" index={4}>
              {menuConfig.find(menu => menu.label === "Select")?.children?.map((item, index) => (
                      <MenuItem key={index} {...item} />
                    ))}
              {/* ... other select menu items ... */}
            </Menu>

            {/* View Menu */}
            <Menu label="View" index={5}>
              {menuConfig.find(menu => menu.label === "View")?.children?.map((item, index) => (
                      <MenuItem key={index} {...item} />
                    ))}
              {/* ... other view menu items ... */}
            </Menu>
            {/* Window Menu */}
            <Menu label="Window" index={6} >
              {menuConfig.find(menu => menu.label === "Window")?.children?.map((item, index) => (
                      <MenuItem key={index} {...item} />
                    ))}
            </Menu>
            {/* Rest of the Menus */}
            {/* ... Add more menus and items following the same pattern ... */}
          </div>
        </div>
      </div>
      <div className='z-10'>{/* Right Side: Menus and Buttons */}
        <TitleButtons isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} /></div>
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



export default MenuBar;
