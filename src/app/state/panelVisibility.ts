// panelVisibility.ts
interface PanelVisibility {
  [key: string]: boolean;
}

let panelVisibility: PanelVisibility = {
  leftPanelWrapper: true,
  rightPanelWrapper: false,
  npcEditorPanelWrapper: false,
  buildingEditorPanelWrapper: false,
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

export const setPanelVisibility = (panelName: string, isVisible: boolean) => {
  if (panelVisibility.hasOwnProperty(panelName)) {
    panelVisibility[panelName] = isVisible; // Set visibility status
    const panelDiv = document.getElementById(panelName);
    if (panelDiv) {
      panelDiv.style.display = isVisible ? 'block' : 'none'; // Set display
    }
  }
};

