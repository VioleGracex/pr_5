// appStateReducer.tsx
import { ElementType } from '../types/elementType';

export interface Command {
  type: string;
  payload: any;
}

export interface AppState {
  elements: ElementType[];
  undoStack: Command[];
  redoStack: Command[];
}

export type AppStateAction =
  | { type: 'MOVE_ELEMENT'; elementId: string; newPosition: { x: number; y: number } }
  | { type: 'UPDATE_UNDO_STACK'; undoStack: Command[] }
  | { type: 'UPDATE_REDO_STACK'; redoStack: Command[] };

export const initialState: AppState = {
  elements: [],
  undoStack: [],
  redoStack: [],
};

const saveStateToStorage = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch (error) {
    console.error('Error saving state to storage:', error);
  }
};

export const appStateReducer = (state: AppState, action: AppStateAction): AppState => {
  switch (action.type) {
    case 'MOVE_ELEMENT':
      const updatedElements = state.elements.map((element) =>
        element.id === action.elementId ? { ...element, position: action.newPosition } : element
      );
      const moveElementCommand: Command = { type: 'MOVE_ELEMENT', payload: { elementId: action.elementId } };

      saveStateToStorage(state);

      return {
        ...state,
        elements: updatedElements,
        undoStack: [...state.undoStack, moveElementCommand],
        redoStack: [], // Clear redo stack when a new action occurs
      };

    case 'UPDATE_UNDO_STACK':
      saveStateToStorage({ ...state, undoStack: action.undoStack });
      return { ...state, undoStack: action.undoStack };

    case 'UPDATE_REDO_STACK':
      saveStateToStorage({ ...state, redoStack: action.redoStack });
      return { ...state, redoStack: action.redoStack };

    default:
      return state;
  }
};
