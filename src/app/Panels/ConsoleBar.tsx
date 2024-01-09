import React, { useState, useEffect } from 'react';

export const ConsoleBar: React.FC = () => {
  const [activityStack, setActivityStack] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activityIndex, setActivityIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const latestActivity = getLastActivity() || 'None';

      // Only add 'None' as the first activity
      if (latestActivity !== 'None' && activityIndex !== getActivityIndex()) {
        setActivityStack((prevStack) => [...prevStack, latestActivity]);
        setActivityIndex(getActivityIndex());
      }
    }, 500); // Update every second or as needed

    return () => clearInterval(interval);
  }, [activityIndex]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`console-bar ${isExpanded ? 'expanded' : ''}`}>
      <div className="console-footer">
        <span>Last Activity: {getLastActivity() || 'None'}</span>
        <div onClick={toggleExpand} style={{ cursor: 'pointer', textDecoration: 'underline', marginLeft: '5px', display: 'inline' }}>
          {isExpanded ? 'Minimize' : 'Expand'}
        </div>
      </div>
      {isExpanded && (
        <div className="activity-stack" style={{ overflow: 'auto', maxHeight: '50px', marginRight: '5px' }}>
          {activityStack.map((activity, index) => (
            <div key={index}>
              {activity}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

let lastActivity: string | null = null;
let activityCounter = 0;

export const addActivity = (activity: string) => {
  lastActivity = activity;
  activityCounter++;
  console.log('Activity:', activity);
};

export const getLastActivity = () => {
  return lastActivity;
};

export const getActivityIndex = () => {
  return activityCounter;
};
