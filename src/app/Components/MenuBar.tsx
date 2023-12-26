// components/MenuBar.tsx
"use client"; // This is a client component 👈🏽
import React, { useState, useEffect, useRef } from 'react';

const MenuBar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center relative z-50">
      {/* Left Side: Logo */}
      <div className="flex items-center">
        <img src="/Logo.png" alt="Logo" className="h-8 mr-2" />
        
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
          {/* ... repeat the pattern for other menus ... */}

          {/* Help Menu */}
          <Menu label="Help" index={2}>
            <MenuItem label="Help Center" />
            <MenuItem label="Tutorials" />
            {/* ... other help menu items ... */}
          </Menu>
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
      <button className="cursor-pointer" onClick={toggleMenu}>
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
    <button className="cursor-pointer text-left w-full text-gray-800 px-4 py-2 hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
      {label}
    </button>
  );
};

export default MenuBar;
