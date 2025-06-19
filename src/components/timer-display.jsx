// TimerDisplay.jsx
// ---------------
// This component displays the elapsed time in MM:SS format for the Sudoku game.
//
// Props:
//   - seconds (number): The elapsed time in seconds.
//
// Usage:
//   <TimerDisplay seconds={elapsedSeconds} />

import React from "react";
import styled from '@emotion/styled';

/**
 * Displays the elapsed time in MM:SS format.
 *
 * @param {{ seconds: number }} props - Component props.
 * @returns {JSX.Element} The rendered timer display.
 */
export default function TimerDisplay({ seconds }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <TimerStyledSpan>🕒 {formatTime(seconds)}</TimerStyledSpan>
  );
}

// Styled components
const TimerStyledSpan = styled.span`
  font-size: 14px;
  color: var(--timer-color);
`;