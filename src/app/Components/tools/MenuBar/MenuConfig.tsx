import { addActivity } from '@/app/Panels/ConsoleBar';
import { saveHomeData } from '@/app/state/Save';
import React from 'react';
import shortcuts from '../shortcutConfig';
import { Shortcut } from '../shortcuts';
import { keys } from 'lodash';

export interface MenuItems {
    label: string;
    onClick?: () => void;
    isToggle?: boolean;
    isActive?: boolean;
    isNested?: boolean;
    shortcut?: Shortcut;
    isSeparator?: boolean; // New property for indicating a separator
    children?: MenuItems[];
}

export const menuConfig: MenuItems[] = [
    {
        label: "File",
        children: [
            { label: "New", onClick: () => addActivity("Create New"), shortcut: { keys: ['Ctrl', 'N'], name: "New File", action: () => addActivity("Create New") } },
            { label: "Open", shortcut: { keys: ['Ctrl', 'O'], name: "Open File" } },
            { label: "Save", onClick: () => saveHomeData(), shortcut: { keys: ['Ctrl', 'S'], name: "Save File", action: () => saveHomeData()} },
            // Add more file menu items as needed
        ]
    },
    {
        label: "Edit",
        children: [
            { label: "Undo", shortcut: { keys: ['Ctrl', 'Z'], name: "Undo" } },
            { label: "Redo", shortcut: { keys: ['Ctrl', 'Y'], name: "Redo" } },
            // Add more edit menu items as needed
        ]
    },
    {
        label: "Image",
        children: [
            { label: "Insert Image" },
            { label: "Edit Image" },
            // Add more image menu items as needed
        ]
    },
    {
        label: "Layer",
        children: [
            { label: "Add Layer", shortcut: { keys: ['Ctrl', 'Shift', 'N'], name: "Add Layer" } },
            { label: "Delete Layer", shortcut: { keys: ['Ctrl', 'Shift', 'D'], name: "Delete Layer" } },
            { label: "Merge Layers", shortcut: { keys: ['Ctrl', 'Shift', 'M'], name: "Merge Layers" } },
            { label: "Layer Order", shortcut: { keys: ['Ctrl', 'Shift', 'O'], name: "Layer Order" } },
            // Add more layer menu items as needed
        ]
    },
    {
        label: "Select",
        children: [
            { label: "Select Objects", shortcut: { keys: ['Ctrl', 'A'], name: "Select Objects" } },
            { label: "Select Layer", shortcut: { keys: ['Ctrl', 'Shift', 'A'], name: "Select Layer" } },
            { label: "Select All", shortcut: { keys: ['Ctrl', 'Alt', 'A'], name: "Select All" } },
            // Add more select menu items as needed
        ]
    },
    {
        label: "View",
        children: [
            { label: "Zoom In", shortcut: { keys: ['Ctrl', '='], name: "Zoom In" } },
            { label: "Zoom Out", shortcut: { keys: ['Ctrl', '-'], name: "Zoom Out" } },
            { label: "Fit to Screen", shortcut: { keys: ['Ctrl', '0'], name: "Fit to Screen" } },
            { label: "Grid", shortcut: { keys: ['Ctrl', 'G'], name: "Grid" } },
            { label: "Snap to Grid", shortcut: { keys: ['Ctrl', 'Alt', 'G'], name: "Snap to Grid" } },
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
            { label: "ToolBar", isToggle: true, shortcut: { keys: ['Ctrl', 'T'], name: "ToolBar" } },
            { label: "Navigator", isToggle: true, shortcut: { keys: ['Ctrl', 'N'], name: "Navigator" } },
            { label: "Layer", isToggle: true, shortcut: { keys: ['Ctrl', 'L'], name: "Layer" } },
            { label: "Paths", isToggle: true, shortcut: { keys: ['Ctrl', 'P'], name: "Paths" } },
            { label: "Buildings", isToggle: true, shortcut: { keys: ['Ctrl', 'B'], name: "Buildings" } },
            { label: "NPCS", isToggle: true, shortcut: { keys: ['Ctrl', 'Shift', 'N'], name: "NPCS" } },
            { label: "Inspector", isToggle: true, shortcut: { keys: ['Ctrl', 'I'], name: "Inspector" } },
        ]
    },
    // Add more top-level menu items as needed
];


// Define a function to extract shortcuts from menu items
const extractShortcutsFromMenu = (menuItems: MenuItems[]): Shortcut[] => {
  const shortcuts: Shortcut[] = [];
  
  menuItems.forEach(item => {
      if (item.shortcut) {
          shortcuts.push(item.shortcut);
      }
      if (item.children) {
          shortcuts.push(...extractShortcutsFromMenu(item.children));
      }
  });
  
  return shortcuts;
};

// Extract shortcuts from menuConfig
export const allBarShortcuts: Shortcut[] = extractShortcutsFromMenu(menuConfig);