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
function SudokuCell({ cell, isSelected, onClick, disabled, contextBorders }) {
  return (
    <CellDiv
      onClick={disabled ? undefined : onClick}
      isInitial={cell.isInitial}
      isIncorrect={cell.isIncorrect}
      isSelected={isSelected}
      cellIndex={cell.index}
      disabled={disabled}
      contextBorders={contextBorders}
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
export default function SudokuGrid({ cells, selectedIndex, onSelect, disabled, highlightContext }) {
  // Calculate which borders to show for context highlighting
  const getContextBorders = (index) => {
    if (selectedIndex === null || selectedIndex === undefined || !highlightContext) {
      return { top: false, right: false, bottom: false, left: false };
    }

    const selectedRow = Math.floor(selectedIndex / 9);
    const selectedCol = selectedIndex % 9;
    const selectedBoxRow = Math.floor(selectedRow / 3);
    const selectedBoxCol = Math.floor(selectedCol / 3);

    const currentRow = Math.floor(index / 9);
    const currentCol = index % 9;
    const currentBoxRow = Math.floor(currentRow / 3);
    const currentBoxCol = Math.floor(currentCol / 3);

    const isInRow = currentRow === selectedRow;
    const isInColumn = currentCol === selectedCol;
    const isInBox = currentBoxRow === selectedBoxRow && currentBoxCol === selectedBoxCol;

    // Don't highlight if not in any context
    if (!isInRow && !isInColumn && !isInBox) {
      return { top: false, right: false, bottom: false, left: false };
    }

    const borders = { top: false, right: false, bottom: false, left: false };

    // For row highlighting
    if (isInRow) {
      // Top border if this is the first cell in the row or the cell above is not in the row
      const cellAbove = index - 9;
      if (currentRow === 0 || (cellAbove >= 0 && Math.floor(cellAbove / 9) !== selectedRow)) {
        borders.top = true;
      }
      // Bottom border if this is the last cell in the column or the cell below is not in the row
      const cellBelow = index + 9;
      if (currentRow === 8 || (cellBelow < 81 && Math.floor(cellBelow / 9) !== selectedRow)) {
        borders.bottom = true;
      }
    }

    // For column highlighting
    if (isInColumn) {
      // Left border if this is the first cell in the column or the cell to the left is not in the column
      const cellLeft = index - 1;
      if (currentCol === 0 || (cellLeft >= 0 && cellLeft % 9 !== selectedCol)) {
        borders.left = true;
      }
      // Right border if this is the last cell in the row or the cell to the right is not in the column
      const cellRight = index + 1;
      if (currentCol === 8 || (cellRight < 81 && cellRight % 9 !== selectedCol)) {
        borders.right = true;
      }
    }

    // For box highlighting
    if (isInBox) {
      // Check box boundaries
      const boxStartRow = selectedBoxRow * 3;
      const boxEndRow = boxStartRow + 2;
      const boxStartCol = selectedBoxCol * 3;
      const boxEndCol = boxStartCol + 2;

      // Top border if at top of box
      if (currentRow === boxStartRow) {
        borders.top = true;
      }
      // Bottom border if at bottom of box
      if (currentRow === boxEndRow) {
        borders.bottom = true;
      }
      // Left border if at left of box
      if (currentCol === boxStartCol) {
        borders.left = true;
      }
      // Right border if at right of box
      if (currentCol === boxEndCol) {
        borders.right = true;
      }
    }

    return borders;
  };
  return (
    <GridContainer>
      {cells.map((cell, i) => {
        const contextBorders = getContextBorders(i);
        return (
          <SudokuCell
            key={i}
            cell={{ ...cell, index: i }}
            isSelected={i === selectedIndex}
            onClick={() => onSelect(i)}
            disabled={disabled}
            contextBorders={contextBorders}
          />
        );
      })}
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
  cursor: ${({ isInitial, disabled }) =>
    disabled ? 'not-allowed' : isInitial ? 'default' : 'pointer'};
  background-color: ${({ isInitial, isIncorrect, isSelected }) => {
    if (isInitial) return 'var(--cell-initial-bg)';
    if (isIncorrect) return 'var(--cell-incorrect-bg)';
    if (isSelected) return 'var(--cell-selected-bg)';
    return 'var(--primary-bg)';
  }};
  border: 1px solid var(--cell-border);
  border-top: ${({ cellIndex }) => Math.floor(cellIndex / 9) % 3 === 0 ? '2px solid var(--cell-border-strong)' : '1px solid var(--cell-border)'};
  border-left: ${({ cellIndex }) => cellIndex % 9 % 3 === 0 ? '2px solid var(--cell-border-strong)' : '1px solid var(--cell-border)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isIncorrect }) => isIncorrect ? 'var(--cell-incorrect-text)' : 'var(--primary-text)'};
  transition: box-shadow 0.15s ease;
  box-shadow: ${({ contextBorders }) => {
    if (!contextBorders) return 'none';

    const shadows = [];
    const color = 'var(--cell-context-border)';
    const thickness = '2px';

    // Use inset box-shadow to create borders without affecting layout
    if (contextBorders.top) shadows.push(`inset 0 ${thickness} 0 0 ${color}`);
    if (contextBorders.right) shadows.push(`inset -${thickness} 0 0 0 ${color}`);
    if (contextBorders.bottom) shadows.push(`inset 0 -${thickness} 0 0 ${color}`);
    if (contextBorders.left) shadows.push(`inset ${thickness} 0 0 0 ${color}`);

    return shadows.length > 0 ? shadows.join(', ') : 'none';
  }};
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