import { addActivity } from '@/app/Panels/ConsoleBar';
import React, { useState, useEffect } from 'react';
import { FaAngleRight, FaCheck } from 'react-icons/fa';
import { MenuItems } from './MenuConfig';

interface MenuItemProps extends MenuItems {
  isSeparator?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, isToggle, isActive, isNested, isSeparator, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);
  const [closeSubmenuTimeout, setCloseSubmenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isActiveLocal, setIsActiveLocal] = useState(isActive || false);

  useEffect(() => {
    setIsActiveLocal(isActive || false);
  }, [isActive]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    addActivity("Hover");
    if(isNested)
      {
        addActivity("Hovesr");
      }
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
        setIsActiveLocal(!isActiveLocal);
      }
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      {isSeparator ? (
        <div className="border-t border-gray-300 my-2"></div>
      ) : (
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
      )}
      {isHovered && isNested && (
  <div className="bg-black p-0 m-0">
    <div className="absolute w-44 left-full top-0 mt-0 ml-1 bg-gray-400 text-white-800 p-2 space-y-2 border border-gray-300" onMouseEnter={handleSubmenuMouseEnter} onMouseLeave={handleSubmenuMouseLeave}>
      {children && children.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  </div>
)}

    </div>
  );
};
