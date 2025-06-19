/** @jsxImportSource @emotion/react */
// GameHeader.jsx
// -------------
// This React component displays the Sudoku game header, including the current difficulty, elapsed time, and any additional child elements.
//
// Props:
//   - difficulty (string): The current game difficulty (e.g., 'easy', 'medium', 'hard').
//   - elapsedSeconds (number): The elapsed time in seconds to display as a timer.
//   - children (React.ReactNode): Optional child elements to render in the header.
//
// Usage:
//   <GameHeader difficulty="easy" elapsedSeconds={120}>...</GameHeader>
//
// The component formats the elapsed time as MM:SS and displays it alongside the difficulty.

import React from "react";
import styled from '@emotion/styled'
import { TimerIcon } from "./timer-icon";

/**
 * Displays the Sudoku game header with difficulty, timer, and optional children.
 *
 * @param {{
 *   difficulty: string,
 *   elapsedSeconds: number,
 *   children?: React.ReactNode
 * }} props - Component props.
 * @returns {JSX.Element} The rendered component.
 */
export default function GameHeader({ difficulty, elapsedSeconds, timerActive, onPauseToggle, children }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <HeaderContainer>
      <HeaderSide>
        <TimerSpan>
          <TimerIcon size={16} />
          {formatTime(elapsedSeconds)}
        </TimerSpan>
      </HeaderSide>
      <HeaderTitle>
        Sudoku ({difficulty})
      </HeaderTitle>
      <HeaderSide style={{ justifyContent: 'flex-end' }}>
        {children}
      </HeaderSide>
    </HeaderContainer>
  );
}

// Styled components
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background: var(--header-bg);
  min-height: 48px;
  padding: 0 16px;
  width: 100%;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  color: var(--header-text);
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
`;

const HeaderSide = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  z-index: 2;
`;

const TimerSpan = styled.span`
  font-size: 14px;
  color: var(--timer-color);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
`;

const PauseButton = styled.button`
  margin-left: 12px;
  font-size: 18px;
  background: none;
  border: none;
  color: var(--timer-color);
  cursor: pointer;
  outline: none;
  transition: color 0.2s;
  &:hover {
    color: var(--accent);
  }
`;