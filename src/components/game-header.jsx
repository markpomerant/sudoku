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
export default function GameHeader({ difficulty, elapsedSeconds, children }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
      <h2 style={{ margin: 0 }}>
        Sudoku ({difficulty}) &nbsp;
        <span style={{ fontSize: "14px", color: "#777" }}>
          🕒 {formatTime(elapsedSeconds)}
        </span>
      </h2>
      {children}
    </div>
  );
}