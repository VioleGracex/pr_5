// AppStateContext.tsx
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { appStateReducer, AppStateAction, initialState, AppState } from './appStateReducer';
import { loadStateFromStorage, saveStateToFile, createSaveFolderIfNeeded } from '../utils/fileUtils';

interface AppStateContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppStateAction>;
  undo: () => void;
  redo: () => void;
}

const getProjectId = (): number => {
  // You can implement logic to get the project ID dynamically (e.g., from user input or other sources)
  return 1; // Default project ID
};

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const projectId = getProjectId();
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  const undo = () => {
    const [command, ...rest] = state.undoStack.slice().reverse();
    dispatch({ type: 'UPDATE_UNDO_STACK', undoStack: rest.reverse() });
    dispatch({ type: 'UPDATE_REDO_STACK', redoStack: [...state.redoStack, command] });
  };

  const redo = () => {
    const [command, ...rest] = state.redoStack.slice().reverse();
    dispatch({ type: 'UPDATE_REDO_STACK', redoStack: rest.reverse() });
    dispatch({ type: 'UPDATE_UNDO_STACK', undoStack: [...state.undoStack, command] });
  };

  useEffect(() => {
    // Load state on component mount (launch)
    const savedState = loadStateFromStorage(projectId);
    if (savedState) {
      dispatch({ type: 'UPDATE_UNDO_STACK', undoStack: savedState.undoStack });
      dispatch({ type: 'UPDATE_REDO_STACK', redoStack: savedState.redoStack });
    }
  }, [projectId]);

  // Create save folder if needed (it's now called in the component)
  createSaveFolderIfNeeded();

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
