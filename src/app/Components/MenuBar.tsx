// components/MenuBar.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect, useRef } from 'react';

const MenuBar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center relative z-50">
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

      {/* Right Side: Menus */}
      <div className="flex space-x-6">
        {/* ... any additional right-side content ... */}
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
      <button className="cursor-pointer whitespace-nowrap" onClick={toggleMenu}>
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
    <button className="text-sm -cursor-pointer text-left w-full text-gray-800 px-4 py-2 hover:bg-gray-300 focus:outline-none focus:bg-gray-300 whitespace-nowrap">
      {label}
    </button>
  );
};

export default MenuBar;
