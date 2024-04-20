import { addActivity } from '@/app/Panels/ConsoleBar';
import React from 'react';

export interface MenuItems {
  label: string;
  onClick?: () => void;
  isToggle?: boolean;
  isActive?: boolean;
  isNested?: boolean;
  shortcut?: string;
  isSeparator?: boolean; // New property for indicating a separator
  children?: MenuItems[];
}

export const menuConfig: MenuItems[] = [
  {
    label: "File",
    children: [
      { label: "New", onClick: () => addActivity("Create New"), shortcut: "Ctrl+N" },
      { label: "Open", shortcut: "Ctrl+O" },
      { label: "Save", onClick: () => addActivity("Save New"), shortcut: "Ctrl+S" },
      // Add more file menu items as needed
    ]
  },
  {
    label: "Edit",
    children: [
      { label: "Undo", shortcut: "Ctrl+Z" },
      { label: "Redo", shortcut: "Ctrl+Y" },
      // Add more edit menu items as needed
    ]
  },
  {
    label: "Image", // Label for the Image menu
    children: [
      { label: "Insert Image" },
      { label: "Edit Image" },
      // Add more image menu items as needed
    ]
  },
  {
    label: "Layer",
    children: [
      { label: "Add Layer", shortcut: "Ctrl+Shift+N" },
      { label: "Delete Layer", shortcut: "Ctrl+Shift+D" },
      { label: "Merge Layers", shortcut: "Ctrl+Shift+M" },
      { label: "Layer Order", shortcut: "Ctrl+Shift+O" },
      // Add more layer menu items as needed
    ]
  },
  {
    label: "Select",
    children: [
      { label: "Select Objects", shortcut: "Ctrl+A" },
      { label: "Select Layer", shortcut: "Ctrl+Shift+A" },
      { label: "Select All", shortcut: "Ctrl+Alt+A" },
      // Add more select menu items as needed
    ]
  },
  {
    label: "View",
    children: [
      { label: "Zoom In", shortcut: "Ctrl+=" },
      { label: "Zoom Out", shortcut: "Ctrl+-" },
      { label: "Fit to Screen", shortcut: "Ctrl+0" },
      { label: "Grid", shortcut: "Ctrl+G" },
      { label: "Snap to Grid", shortcut: "Ctrl+Alt+G" },
      // Add more view menu items as needed
    ]
  },
  {
    label: "Window",
    children: [
      {
        label: "Workspace",
        isNested: true,
        children: [
          { label: "Essentials", isToggle: true },
          { label: "Architecture", isToggle: true },
          { label: "Painter", isToggle: true },
          // Add more nested menu items as needed
        ]
      },
      { label: "Separator", isSeparator: true },
      { label: "ToolBar", isToggle: true, shortcut: "Ctrl+T" },
      { label: "Navigator", isToggle: true, shortcut: "Ctrl+N" },
      { label: "Layer", isToggle: true, shortcut: "Ctrl+L" },
      { label: "Paths", isToggle: true, shortcut: "Ctrl+P" },
      { label: "Buildings", isToggle: true, shortcut: "Ctrl+B" },
      { label: "NPCS", isToggle: true, shortcut: "Ctrl+Shift+N" },
      { label: "Inspector", isToggle: true, shortcut: "Ctrl+I" },
    ]
  },
  // Add more top-level menu items as needed
];
