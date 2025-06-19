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
        >
          Clear
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
  background-color: ${({ used }) => (used ? '#ddd' : 'white')};
  border: ${({ used }) => (used ? '2px solid #aaa' : '1px solid #ccc')};
  color: ${({ used }) => (used ? '#999' : 'black')};
`;

const ClearButton = styled.button`
  width: 60px;
  height: 40px;
  margin: 0 8px;
  font-size: 14px;
  cursor: pointer;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  color: #333;
`;
