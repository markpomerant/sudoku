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
import styled from '@emotion/styled'

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
 * SVG icon for center note mode toggle button.
 *
 * @param {{ size?: number }} props - Icon props.
 * @returns {JSX.Element} The rendered SVG icon.
 */
export function CenterNoteIcon({ size = 20 }) {
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
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

/**
 * Button group for pencil and center note toggle.
 *
 * @param {{ noteMode: boolean, onToggle: function, centerNoteMode: boolean, onCenterToggle: function }} props
 */
export default function NoteToggleButton({ noteMode, onToggle, centerNoteMode, onCenterToggle }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <StyledButton
        onClick={() => {
          if (noteMode) onToggle(false);
          else {
            onToggle(true);
            if (centerNoteMode) onCenterToggle(false);
          }
        }}
        noteMode={noteMode}
        aria-label="Toggle pencil note mode"
        active={noteMode}
      >
        <PencilIcon size={20} />
        <StatusSpan noteMode={noteMode}>
          {noteMode ? "on" : "off"}
        </StatusSpan>
      </StyledButton>
      <StyledButton
        onClick={() => {
          if (centerNoteMode) onCenterToggle(false);
          else {
            onCenterToggle(true);
            if (noteMode) onToggle(false);
          }
        }}
        noteMode={centerNoteMode}
        aria-label="Toggle center note mode"
        active={centerNoteMode}
      >
        <CenterNoteIcon size={20} />
        <StatusSpan noteMode={centerNoteMode}>
          {centerNoteMode ? "on" : "off"}
        </StatusSpan>
      </StyledButton>
    </div>
  );
}

// Styled components
const StyledButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid var(--button-border);
  background-color: ${({ noteMode }) => noteMode ? 'var(--button-bg)' : 'var(--button-bg-alt)'};
  color: var(--button-text);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusSpan = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: ${({ noteMode }) => noteMode ? 'var(--note-badge-on, var(--accent))' : 'var(--note-badge-off, var(--button-border))'};
  color: ${({ noteMode }) => noteMode ? 'var(--note-badge-on-text, #fff)' : 'var(--note-badge-off-text, #fff)'};
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 10px;
  font-weight: bold;
`;