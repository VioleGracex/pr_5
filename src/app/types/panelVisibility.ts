// panelVisibility.ts
let leftPanelVisible = true;
let rightPanelVisible = false;
let npcEditorPanelVisible = false;
let buildingEditorPanelVisible = true;
let palettePanelVisible = true;

export function togglePanelVisibility(panelName: string): void {
  switch (panelName) {
    case 'leftPanel':
      leftPanelVisible = !leftPanelVisible;
      break;
    case 'rightPanel':
      rightPanelVisible = !rightPanelVisible;
      break;
    case 'npcEditorPanel':
      npcEditorPanelVisible = !npcEditorPanelVisible;
      break;
    case 'buildingEditorPanel':
      buildingEditorPanelVisible = !buildingEditorPanelVisible;
      break;
    case 'palettePanel':
      palettePanelVisible = !palettePanelVisible;
      break;
    default:
      break;
  }
}

export {
  leftPanelVisible,
  rightPanelVisible,
  npcEditorPanelVisible,
  buildingEditorPanelVisible,
  palettePanelVisible,
};
