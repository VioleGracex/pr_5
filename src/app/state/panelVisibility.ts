// panelVisibility.ts
let leftPanelVisible = true;
let rightPanelVisible = false;
let npcEditorPanelVisible = false;
let buildingEditorPanelVisible = true;

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
    default:
      break;
  }
}

export {
  leftPanelVisible,
  rightPanelVisible,
  npcEditorPanelVisible,
  buildingEditorPanelVisible,
};


export const togglePalettePanelVisibility = (isVisible: boolean) => {
  const paletteDiv = document.getElementById('palette');
  if (paletteDiv) {
    paletteDiv.style.display = isVisible ? 'block' : 'none';
  }
};