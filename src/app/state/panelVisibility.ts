// panelVisibility.ts
interface PanelVisibility {
  [key: string]: boolean;
}

let panelVisibility: PanelVisibility = {
  leftPanelWrapper: true,
  rightPanelWrapper: false,
  npcEditorPanelWrapper: false,
  buildingEditorPanelWrapper: true,
  palettePanelWrapper : false,
};

export const togglePanelVisibility = (panelName: string) => {
  if (panelVisibility.hasOwnProperty(panelName)) {
    const isVisible = panelVisibility[panelName];
    panelVisibility[panelName] = !isVisible; // Toggle visibility status
    const panelDiv = document.getElementById(panelName);
    if (panelDiv) {
      panelDiv.style.display = !isVisible ? 'block' : 'none'; // Toggle display
    }
  }
};
