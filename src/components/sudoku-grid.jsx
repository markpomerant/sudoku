// SudokuGrid.jsx
// --------------
// This file contains the SudokuGrid component for rendering the Sudoku puzzle grid, and the SudokuCell subcomponent.
//
// SudokuCell Props:
//   - cell (object): The cell data (value, notes, index, etc).
//   - isSelected (boolean): Whether the cell is currently selected.
//   - onClick (function): Callback for cell click.
//
// SudokuGrid Props:
//   - cells (array): Array of cell objects for the grid.
//   - selectedIndex (number): The index of the currently selected cell.
//   - onCellClick (function): Callback for cell click.
//
// Usage:
//   <SudokuGrid cells={cells} selectedIndex={index} onCellClick={fn} />

import React from "react";

/**
 * Renders a single cell in the Sudoku grid.
 *
 * @param {{ cell: object, isSelected: boolean, onClick: () => void }} props - Cell props.
 * @returns {JSX.Element} The rendered cell.
 */
function SudokuCell({ cell, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        fontSize: "18px",
        position: "relative",
        textAlign: "center",
        cursor: cell.isInitial || cell.isComplete ? "default" : "pointer",
        backgroundColor: cell.isInitial
          ? "#eee"
          : cell.isIncorrect
          ? "#fdd"
          : isSelected
          ? "#cceeff"
          : "white",
        border: "1px solid gray",
        borderTop: Math.floor(cell.index / 9) % 3 === 0 ? "2px solid black" : "1px solid gray",
        borderLeft: cell.index % 9 % 3 === 0 ? "2px solid black" : "1px solid gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {cell.value !== 0 ? (
        cell.value
      ) : cell.notes.length ? (
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            fontSize: "10px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            lineHeight: "1.2",
            color: "#666",
          }}
        >
          {Array.from({ length: 9 }, (_, j) => j + 1).map((n) => (
            <div key={n} style={{ textAlign: "center" }}>
              {cell.notes.includes(n) ? n : ""}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

/**
 * Renders the Sudoku puzzle grid.
 *
 * @param {{ cells: object[], selectedIndex: number, onCellClick: (index: number) => void }} props - Grid props.
 * @returns {JSX.Element} The rendered grid.
 */
export default function SudokuGrid({ cells, selectedIndex, onSelect }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(9, 40px)",
        gap: "2px",
        padding: "10px",
        border: "2px solid black",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      {cells.map((cell, i) => (
        <SudokuCell
          key={i}
          cell={{ ...cell, index: i }}
          isSelected={i === selectedIndex}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}