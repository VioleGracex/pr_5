// utils/shortcuts.ts
export interface Shortcut {
    keys: string[]; // Array of keys for the shortcut
    name: string;   // Name of the shortcut
    action: () => void; // Function to be executed when the shortcut is triggered
  }
  
  export const handleShortcuts = (event: KeyboardEvent, shortcuts: Shortcut[]) => {
    shortcuts.forEach((shortcut) => {
      const { keys, action } = shortcut;
  
      // Check if all keys in the shortcut are pressed
      const keysPressed = keys.every((key) =>
        (event.ctrlKey && key === 'Ctrl') ||
        (event.shiftKey && key === 'Shift') ||
        (event.altKey && key === 'Alt') ||
        key === event.key
      );
  
      if (keysPressed) {
        event.preventDefault();
        action();
      }
    });
  };
  