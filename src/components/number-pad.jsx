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
    <div style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={isComplete}
            style={{
              width: 40,
              height: 40,
              margin: "0 4px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: usedValues.has(num) ? "#ddd" : "white",
              border: usedValues.has(num) ? "2px solid #aaa" : "1px solid #ccc",
              color: usedValues.has(num) ? "#999" : "black",
            }}
          >
            {num}
          </button>
        ))}
      </div>
      <div>
        {[6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={isComplete}
            style={{
              width: 40,
              height: 40,
              margin: "0 4px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: usedValues.has(num) ? "#ddd" : "white",
              border: usedValues.has(num) ? "2px solid #aaa" : "1px solid #ccc",
              color: usedValues.has(num) ? "#999" : "black",
            }}
          >
            {num}
          </button>
        ))}

        <button
          onClick={onClear}
          disabled={selectedIndex == null || isComplete}
          style={{
            width: 60,
            height: 40,
            margin: "0 8px",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ccc",
            color: "#333",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
