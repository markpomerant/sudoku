// NoteToggleButton.jsx
// --------------------
// This file contains the NoteToggleButton component for toggling pencil note mode in Sudoku, and a PencilIcon SVG component.
//
// PencilIcon Props:
//   - size (number): The size of the icon in pixels. Default is 20.
//
// NoteToggleButton Props:
//   - noteMode (boolean): Whether note mode is currently active.
//   - onToggle (function): Callback invoked when the button is clicked.
//
// Usage:
//   <NoteToggleButton noteMode={noteMode} onToggle={handleToggle} />

import React from "react";

/**
 * SVG pencil icon for note mode toggle button.
 *
 * @param {{ size?: number }} props - Icon props.
 * @returns {JSX.Element} The rendered SVG icon.
 */
export function PencilIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

/**
 * Button to toggle pencil note mode in Sudoku.
 *
 * @param {{ noteMode: boolean, onToggle: () => void }} props - Component props.
 * @returns {JSX.Element} The rendered button.
 */
export default function NoteToggleButton({ noteMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: "relative",
        width: 40,
        height: 40,
        cursor: "pointer",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: noteMode ? "#e0f7fa" : "#f9f9f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Toggle pencil note mode"
    >
      <PencilIcon size={20} />
      <span
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          backgroundColor: noteMode ? "#4caf50" : "#ccc",
          color: "white",
          fontSize: "10px",
          padding: "1px 4px",
          borderRadius: "10px",
          fontWeight: "bold",
        }}
      >
        {noteMode ? "on" : "off"}
      </span>
    </button>
  );
}