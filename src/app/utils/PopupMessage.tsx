// utils/PopupMessage.tsx
import React, { useEffect } from 'react';

interface PopupMessageProps {
  message: string;
  onClose: () => void;
}

const PopupMessage: React.FC<PopupMessageProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-bold">
      {message}
    </div>
  );
};

export default PopupMessage;
