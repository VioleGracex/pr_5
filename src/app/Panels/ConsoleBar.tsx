// ConsoleBar.tsx
import React, { useState, useEffect } from 'react';

export const ConsoleBar: React.FC = () => {
  const [lastActivity, setLastActivity] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastActivity(getLastActivity());
    }, 500); // Update every second or as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="console-bar">
      <span>Last Activity: {lastActivity || 'None'}</span>
    </div>
  );
};

let lastActivity: string | null = null;

export const addActivity = (activity: string) => {
  lastActivity = activity;
  console.log('Activity:', activity);
};

export const getLastActivity = () => {
  return lastActivity;
};
