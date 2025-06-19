/** @jsxImportSource @emotion/react */
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
import styled from '@emotion/styled';

/**
 * Renders a single cell in the Sudoku grid.
 *
 * @param {{ cell: object, isSelected: boolean, onClick: () => void }} props - Cell props.
 * @returns {JSX.Element} The rendered cell.
 */
function SudokuCell({ cell, isSelected, onClick }) {
  return (
    <CellDiv
      onClick={onClick}
      isInitial={cell.isInitial}
      isIncorrect={cell.isIncorrect}
      isSelected={isSelected}
      cellIndex={cell.index}
    >
      {cell.value !== 0 ? (
        cell.value
      ) : cell.notes.length ? (
        <NotesDiv>
          {Array.from({ length: 9 }, (_, j) => j + 1).map((n) => (
            <NoteNumber key={n}>
              {cell.notes.includes(n) ? n : ""}
            </NoteNumber>
          ))}
        </NotesDiv>
      ) : (
        ""
      )}
    </CellDiv>
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
    <GridContainer>
      {cells.map((cell, i) => (
        <SudokuCell
          key={i}
          cell={{ ...cell, index: i }}
          isSelected={i === selectedIndex}
          onClick={() => onSelect(i)}
        />
      ))}
    </GridContainer>
  );
}

// Styled components
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 40px);
  gap: 2px;
  padding: 10px;
  border: 2px solid black;
  width: fit-content;
  margin: 0 auto;
`;

const CellDiv = styled.div`
  width: 40px;
  height: 40px;
  font-size: 18px;
  position: relative;
  text-align: center;
  cursor: ${({ isInitial, isIncorrect }) => (isInitial ? 'default' : 'pointer')};
  background-color: ${({ isInitial, isIncorrect, isSelected }) =>
    isInitial ? '#eee' : isIncorrect ? '#fdd' : isSelected ? '#cceeff' : 'white'};
  border: 1px solid gray;
  border-top: ${({ cellIndex }) => Math.floor(cellIndex / 9) % 3 === 0 ? '2px solid black' : '1px solid gray'};
  border-left: ${({ cellIndex }) => cellIndex % 9 % 3 === 0 ? '2px solid black' : '1px solid gray'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotesDiv = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  font-size: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  line-height: 1.2;
  color: #666;
`;

const NoteNumber = styled.div`
  text-align: center;
`;