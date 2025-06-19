// DifficultySelector.jsx
// ----------------------
// This React component renders a set of buttons for selecting the Sudoku game difficulty.
//
// Props:
//   - onSelect (function): Callback invoked with the selected difficulty ('easy', 'medium', or 'hard') when a button is clicked.
//
// Usage:
//   <DifficultySelector onSelect={handleSelectDifficulty} />
//
// The component displays three buttons labeled Easy, Medium, and Hard. Clicking a button calls the onSelect prop with the corresponding difficulty level.

import React from "react";

/**
 * Renders a set of buttons for selecting the Sudoku game difficulty.
 *
 * @param {{ onSelect: (level: 'easy' | 'medium' | 'hard') => void }} props - Component props.
 * @returns {JSX.Element} The rendered component.
 */
export default function DifficultySelector({ onSelect }) {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Select Difficulty</h2>
      {['easy', 'medium', 'hard'].map((level) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  );
}
