/** @jsxImportSource @emotion/react */
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
import styled from '@emotion/styled';



/**
 * Renders a set of buttons for selecting the Sudoku game difficulty.
 *
 * @param {{ onSelect: (level: 'easy' | 'medium' | 'hard') => void }} props - Component props.
 * @returns {JSX.Element} The rendered component.
 */
export default function DifficultySelector({ onSelect }) {
  return (
    <Container>
      <h2>Select Difficulty</h2>
      {['easy', 'medium', 'hard'].map((level) => (
        <DifficultyButton
          key={level}
          onClick={() => onSelect(level)}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </DifficultyButton>
      ))}
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const DifficultyButton = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: var(--button-bg-alt);
  color: var(--button-text);
  border: 1px solid var(--button-border);
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--button-bg);
    border-color: var(--button-border-active);
  }
`;
