// shortcutConfig.ts
//import { createNewLayer } from '../../page'; // Import the functions you want to use
import createAnotherWindow from "../Windows/AnotherWindow";
import { addActivity } from '@/app/Panels/ConsoleBar';


/* const createNewCanvas = () => {
    console.log('Creating a new layer...');
    addActivity(`SAVED: new layer created`);
} */
interface Shortcut {
  keys: string[];
  name: string;
  action: () => void;
}

const shortcuts: Shortcut[] = [
  {
    keys: ['Ctrl', 's'],
    name: 'Save',
    action: () => {
      const fileName = prompt('Enter file name:', 'state_backup');
      if (fileName) {
        addActivity(`SAVED: ${fileName}.wise`);
        //setForceUpdateFlag((prev) => !prev);
      }
    },
  },
 /*  {
    keys: ['Ctrl', 'Shift', 'N'],
    name: 'Create New Layer',
    action: createNewCanvas,
  }, */
  {
    keys: ['Ctrl', 'Shift', ']'],
    name: 'Create Another Window',
    action: createAnotherWindow,
  },
  // Add more shortcuts as needed
];

export default shortcuts;
