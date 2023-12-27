// toolConfig.ts
import {
    faArrowsAlt,
    faSquare,
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
  } from '@fortawesome/free-solid-svg-icons';

const toolConfig = [
    { icon: faArrowsAlt, name: "Move Tool", shortcut: "V" },
    { icon: faSquare, name: "Marquee tool", shortcut: "M" },
    { icon: faCrop, name: "Crop Tool", shortcut: "C" },
    { icon: faPen, name: "Pen Tool", shortcut: "P" },
    { icon: faPencil, name: "Pencil", shortcut: "B" },
    { icon: faPaintBrush, name: "Brush", shortcut: "B" },
    { icon: faSearch, name: "Zoom Tool", shortcut: "Z" },
    { icon: faFont, name: "Text Tool", shortcut: "T" },
    { icon: faHandPaper, name: "Hand Tool", shortcut: "H" },
    { icon: faShapes, name: "Shapes Tool", shortcut: "U" },
    { icon: faFillDrip, name: "Bucket Tool", shortcut: "G" },
    { icon: faRuler, name: "Show Rulers", shortcut: "R" },
  ];
  
  export default toolConfig;
  