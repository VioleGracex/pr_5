import { addActivity } from "@/app/Panels/ConsoleBar";

// utils/shortcuts.ts
export interface Shortcut {
    keys: string[]; // Array of keys for the shortcut
    name: string;   // Name of the shortcut
    action?: () => void; // Function to be executed when the shortcut is triggered
}
  
export const handleShortcuts = (event: KeyboardEvent, shortcuts: Shortcut[]) => {
    shortcuts.forEach((shortcut) => {
        const { keys, action } = shortcut;
        
        // Check if the pressed buttons match the shortcut keys exactly
        const pressedButtons = keys.filter(key =>
            (event.ctrlKey && key === 'Ctrl') ||
            (event.shiftKey && key === 'Shift') ||
            (event.altKey && key === 'Alt') ||
            key === event.key
        ).join('+');
        
        const isMatching = pressedButtons === keys.join('+');

        if (isMatching && action) {
            action();
            addActivity(`Shortcut pressed: ${shortcut.name} (${pressedButtons})`);
        }
    });
};
