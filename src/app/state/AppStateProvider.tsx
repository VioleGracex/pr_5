// AppStateContext.tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { appStateReducer, AppStateAction, initialState, AppState } from './appStateReducer';

interface AppStateContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppStateAction>;
  undo: () => void;
  redo: () => void;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  const undo = () => {
    // Implement your undo logic here
  };

  const redo = () => {
    // Implement your redo logic here
  };

  return (
    <AppStateContext.Provider value={{ state, dispatch, undo, redo }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
