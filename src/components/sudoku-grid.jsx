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
function SudokuCell({ cell, isSelected, onClick, disabled }) {
  return (
    <CellDiv
      onClick={disabled ? undefined : onClick}
      isInitial={cell.isInitial}
      isIncorrect={cell.isIncorrect}
      isSelected={isSelected}
      cellIndex={cell.index}
      disabled={disabled}
    >
      {cell.value !== 0 ? (
        cell.value
      ) : cell.centerNotes && cell.centerNotes.length === 1 ? (
        <CenterNote>{cell.centerNotes[0]}</CenterNote>
      ) : cell.notes.length ? (
        <NotesDiv>
          {Array.from({ length: 9 }, (_, j) => (
            <NoteNumber key={j + 1}>
              {cell.notes.includes(j + 1) ? j + 1 : ""}
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
 * @param {{ cells: object[], selectedIndex: number, onSelect: (index: number) => void, disabled?: boolean }} props - Grid props.
 * @returns {JSX.Element} The rendered grid.
 */
export default function SudokuGrid({ cells, selectedIndex, onSelect, disabled }) {
  return (
    <GridContainer>
      {cells.map((cell, i) => (
        <SudokuCell
          key={i}
          cell={{ ...cell, index: i }}
          isSelected={i === selectedIndex}
          onClick={() => onSelect(i)}
          disabled={disabled}
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
  border: 2px solid var(--cell-border-strong);
  width: fit-content;
  margin: 0 auto;
  background: var(--primary-bg);
`;

const CellDiv = styled.div`
  width: 40px;
  height: 40px;
  font-size: 18px;
  position: relative;
  text-align: center;
  cursor: ${({ isInitial, isIncorrect, disabled }) =>
    disabled ? 'not-allowed' : isInitial ? 'default' : 'pointer'};
  background-color: ${({ isInitial, isIncorrect, isSelected }) =>
    isInitial ? 'var(--cell-initial-bg)' : isIncorrect ? 'var(--cell-incorrect-bg)' : isSelected ? 'var(--cell-selected-bg)' : 'var(--primary-bg)'};
  border: 1px solid var(--cell-border);
  border-top: ${({ cellIndex }) => Math.floor(cellIndex / 9) % 3 === 0 ? '2px solid var(--cell-border-strong)' : '1px solid var(--cell-border)'};
  border-left: ${({ cellIndex }) => cellIndex % 9 % 3 === 0 ? '2px solid var(--cell-border-strong)' : '1px solid var(--cell-border)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isIncorrect }) => isIncorrect ? 'var(--cell-incorrect-text)' : 'var(--primary-text)'};
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
  color: var(--note-color);
  background: var(--note-bg);
`;

const NoteNumber = styled.div`
  text-align: center;
`;

const CenterNote = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: var(--note-color);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--center-note-bg);
  border-radius: 10px;
  box-shadow: 0 0 0 2px var(--accent), 0 2px 8px rgba(0,0,0,0.08);
  z-index: 2;
`;