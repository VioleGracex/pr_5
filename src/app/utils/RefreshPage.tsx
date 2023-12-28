import React, { useEffect } from 'react';

interface RefreshPageProps {
  onClose: () => void;
}

const RefreshPage: React.FC<RefreshPageProps> = ({ onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Refresh the page after 1000 milliseconds (1 second)
      window.location.reload();
    }, 1000);

    // Clear the timeout when the component unmounts or onClose is called
    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return <div></div>;
};

export default RefreshPage;
