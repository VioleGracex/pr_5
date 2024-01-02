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
} from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare } from '@fortawesome/free-regular-svg-icons'; // Import empty square icon
import MarqueeToolImage from '../imgs/MarqueeTool.png';
import  {UseCircleDraw, UseSquareDraw,UseRectangleDraw}  from '../Functions/ShapeTool'; 

interface Tool {
  icon?: any;
  Image?: any; // Updated Image type to accept StaticImageData
  name: string;
  shortcut?: string;
  group: string;
  toolFunction?: () => void; // Add the tool function parameter
}

const toolsMain: Tool[] = [
  { icon: faArrowsAlt, name: "Move Tool", shortcut: "V", group: "move" },
  { Image: MarqueeToolImage, name: "Marquee tool", shortcut: "M", group: "selection" },
  { icon: faCrop, name: "Crop Tool", shortcut: "C", group: "crop" },
  { icon: faPen, name: "Pen Tool", shortcut: "P", group: "draw" },
  { icon: faPencil, name: "Pencil", shortcut: "B", group: "draw" },
  { icon: faPaintBrush, name: "Brush", shortcut: "B", group: "draw" },
  { icon: faSearch, name: "Zoom Tool", shortcut: "Z", group: "view" },
  { icon: faFont, name: "Text Tool", shortcut: "T", group: "text" },
  { icon: faHandPaper, name: "Hand Tool", shortcut: "H", group: "view" },
  { icon: faSquare, name: "Square Tool", shortcut: "U", group: "shapes", toolFunction: () => console.log('Square Tool function') },
  { icon: faFillDrip, name: "Bucket Tool", shortcut: "G", group: "draw" },
  { icon: faRuler, name: "Show Rulers", shortcut: "R", group: "view" },
];

const toolsExtra: Tool[] = [
  { icon: faCircle, name: "Circle Tool", shortcut: "", group: "shapes", toolFunction: () => UseCircleDraw},
  { icon: faRectangleAd, name: "Rectangle Tool", shortcut: "", group: "shapes", toolFunction: () => console.log('Rectangle Tool function') },
  { icon: farSquare, name: "Empty Square Tool", shortcut: "", group: "shapes", toolFunction: () => console.log('Empty Square Tool function') },
  // Add more shapes as needed
];

export { toolsMain, toolsExtra };
