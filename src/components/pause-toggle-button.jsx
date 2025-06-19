// PauseToggleButton.jsx
// --------------------
// A standalone pause/resume button for the Sudoku timer, styled to match the note toggle buttons.

import React from "react";
import styled from '@emotion/styled';

/**
 * SVG pause/play icon for timer toggle button.
 *
 * @param {{ paused: boolean, size?: number }} props - Icon props.
 * @returns {JSX.Element} The rendered SVG icon.
 */
export function PausePlayIcon({ paused, size = 20 }) {
  return paused ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" fill="currentColor" />
    </svg>
  );
}

/**
 * PauseToggleButton component for pausing/resuming the timer.
 *
 * @param {{ timerActive: boolean, onPauseToggle: function }} props
 */
export default function PauseToggleButton({ timerActive, onPauseToggle }) {
  return (
    <StyledButton
      onClick={onPauseToggle}
      aria-label={timerActive ? "Pause timer" : "Resume timer"}
      active={!timerActive}
    >
      <PausePlayIcon paused={!timerActive} size={20} />
    </StyledButton>
  );
}

const StyledButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid var(--button-border);
  background-color: var(--button-bg-alt);
  color: var(--button-text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--button-bg);
    border-color: var(--button-border-active);
  }
`;
