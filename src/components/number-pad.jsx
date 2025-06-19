// NumberPad.jsx
// -------------
// This component renders a number pad for Sudoku input, including number buttons and a clear button.
//
// Props:
//   - onNumberClick (function): Callback invoked with the number clicked (1-9).
//   - onClear (function): Callback invoked when the clear button is clicked.
//   - isComplete (boolean): Whether the puzzle is complete (disables input).
//   - usedValues (Set<number>): Set of numbers already used in the current cell.
//   - selectedIndex (number): The index of the currently selected cell.
//
// Usage:
//   <NumberPad onNumberClick={fn} onClear={fn} isComplete={bool} usedValues={set} selectedIndex={num} />

import React from "react";
import styled from '@emotion/styled'

/**
 * Renders a number pad for Sudoku input.
 *
 * @param {{
 *   onNumberClick: (num: number) => void,
 *   onClear: () => void,
 *   isComplete: boolean,
 *   usedValues: Set<number>,
 *   selectedIndex: number
 * }} props - Component props.
 * @returns {JSX.Element} The rendered number pad.
 */

// Add a clear (X) icon component
const ClearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="5" x2="15" y2="15" />
    <line x1="15" y1="5" x2="5" y2="15" />
  </svg>
);

export default function NumberPad({
  onNumberClick,
  onClear,
  isComplete,
  usedValues,
  selectedIndex,
}) {
  return (
    <PadContainer>
      <Row>
        {[1, 2, 3, 4, 5].map((num) => (
          <NumberButton
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={isComplete}
            used={usedValues.has(num)}
          >
            {num}
          </NumberButton>
        ))}
      </Row>
      <Row>
        {[6, 7, 8, 9].map((num) => (
          <NumberButton
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={isComplete}
            used={usedValues.has(num)}
          >
            {num}
          </NumberButton>
        ))}
        <ClearButton
          onClick={onClear}
          disabled={selectedIndex == null || isComplete}
          aria-label="Clear cell"
        >
          <ClearIcon />
        </ClearButton>
      </Row>
    </PadContainer>
  );
}

// Styled components
const PadContainer = styled.div`
  margin-top: 20px;
`;

const Row = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const NumberButton = styled.button`
  width: 40px;
  height: 40px;
  margin: 0 4px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${({ used }) => used ? 'var(--secondary-bg)' : 'var(--button-bg-alt)'};
  border: ${({ used }) => used ? '2px solid var(--button-border)' : '1px solid var(--button-border)'};
  color: ${({ used }) => used ? 'var(--button-border)' : 'var(--button-text)'};
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--button-bg);
    border-color: var(--button-border-active);
  }
`;

const ClearButton = styled.button`
  width: 40px;
  height: 40px;
  margin: 0 4px;
  font-size: 16px;
  cursor: pointer;
  background-color: var(--secondary-bg);
  border: 1px solid var(--button-border);
  color: var(--button-text);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--button-bg);
    border-color: var(--button-border-active);
  }
`;
