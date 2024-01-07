// toolConfig.ts
import {
  faArrowsAlt,
  faCrop,
  faPen,
  faPencil,
  faPaintBrush,
  faSearch,
  faFont,
  faHandPaper,
  faShapes,
  faFillDrip,
  faRuler,
  faSquare,
  faCircle,
  faRectangleAd,
  faPalette,
} from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare } from '@fortawesome/free-regular-svg-icons'; // Import empty square icon
import MarqueeToolImage from '../imgs/MarqueeTool.png';
import { UseCircleDraw } from '../Functions/ShapeTool';

interface Tool {
  icon?: any;
  Image?: any; // Updated Image type to accept StaticImageData
  name: string;
  shortcut?: string;
  group: string;
  inBound?: boolean;
  isToggle?: boolean;
  toolFunction?: () => void;
}

const toolsMain: Tool[] = [
  { icon: faArrowsAlt, name: "Move Tool", shortcut: "V", group: "move", toolFunction: () => console.log('Move Tool function'), inBound: false,isToggle: true },
  { Image: MarqueeToolImage, name: "Marquee tool", shortcut: "M", group: "selection", toolFunction: () => console.log('Marquee Tool function'), inBound: false, isToggle: true },
  { icon: faCrop, name: "Crop Tool", shortcut: "C", group: "crop", toolFunction: () => console.log('Crop Tool function'), inBound: false, isToggle: true },
  { icon: faPen, name: "Pen Tool", shortcut: "P", group: "draw", toolFunction: () => console.log('Pen Tool function'), inBound: false, isToggle: true },
  { icon: faPencil, name: "Pencil", shortcut: "B", group: "draw", toolFunction: () => console.log('Pencil function'), inBound: false, isToggle: true },
  { icon: faPaintBrush, name: "Brush", shortcut: "B", group: "draw", toolFunction: () => console.log('Brush function'), inBound: false, isToggle: true },
  { icon: faSearch, name: "Zoom Tool", shortcut: "Z", group: "view", toolFunction: () => console.log('Zoom Tool function'), inBound: false, isToggle: true },
  { icon: faFont, name: "Text Tool", shortcut: "T", group: "text", toolFunction: () => console.log('Text Tool function'), inBound: false, isToggle: true },
  { icon: faHandPaper, name: "Hand Tool", shortcut: "H", group: "view", toolFunction: () => console.log('Hand Tool function'), inBound: false, isToggle: true },
  { icon: faSquare, name: "Square Tool", shortcut: "U", group: "shapes", toolFunction: () => console.log('Square Tool function'), inBound: true, isToggle: true },
  { icon: faFillDrip, name: "Bucket Tool", shortcut: "G", group: "draw", toolFunction: () => console.log('Bucket Tool function'), inBound: false, isToggle: true },
  { icon: faRuler, name: "Show Rulers", shortcut: "R", group: "view", toolFunction: () => console.log('Show Rulers function'), inBound: false, isToggle: true},
  { icon: faPalette, name: "Color Selector", shortcut: "K", group: "draw", toolFunction: () => console.log('handleColorSelection'), inBound: false, isToggle: false},
];

const toolsExtra: Tool[] = [
  { icon: faCircle, name: "Circle Tool", shortcut: "", group: "shapes", toolFunction: () => UseCircleDraw(true), inBound: false, isToggle: true },
  { icon: faRectangleAd, name: "Rectangle Tool", shortcut: "", group: "shapes", toolFunction: () => console.log('Rectangle Tool function'), inBound: true, isToggle: true },
  // Add more shapes as needed
];

export { toolsMain, toolsExtra };
