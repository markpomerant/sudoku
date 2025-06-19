import { useState, useEffect } from "react";
import { generatePuzzle } from "../lib/sudoku-solver";

function toCellState(puzzle, solution) {
  return puzzle.flat().map((val) => ({
    value: val,
    isInitial: val !== 0,
    isIncorrect: false,
    notes: [],
  }));
}

export function useSudokuState() {
  const [difficulty, setDifficulty] = useState(null);
  const [puzzleState, setPuzzleState] = useState(null);
  const [originalCells, setOriginalCells] = useState([]);
  const [cells, setCells] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [highlightUsedNumbers, setHighlightUsedNumbers] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);

  const startNewGame = (level) => {
    const newPuzzle = generatePuzzle(level);
    const initialCells = toCellState(newPuzzle.puzzle, newPuzzle.solution);

    setDifficulty(level);
    setPuzzleState(newPuzzle);
    setOriginalCells(initialCells);
    setCells(initialCells);
    setSelectedIndex(null);
    setIsComplete(false);
    setNoteMode(false);
    setHighlightUsedNumbers(false);
    setShowMistakes(false);
  };

  const handleRestartGame = () => {
    setCells(originalCells.map((cell) => ({ ...cell })));
    setSelectedIndex(null);
    setIsComplete(false);
  };

  const handleCellClick = (index) => {
    if (cells[index].isInitial) return;
    setSelectedIndex(index);
  };

  const handleClear = () => {
    if (selectedIndex == null || isComplete) return;

    setCells((prev) =>
      prev.map((cell, i) =>
        i === selectedIndex && !cell.isInitial
          ? {
            ...cell,
            value: 0,
            notes: [],
            isIncorrect: false,
          }
          : cell
      )
    );
  };

  const handleNumberClick = (num) => {
    if (selectedIndex == null || isComplete) return;

    setCells((prev) =>
      prev.map((cell, i) => {
        if (i !== selectedIndex || cell.isInitial) return cell;

        if (noteMode) {
          const alreadyHas = cell.notes.includes(num);
          const newNotes = alreadyHas
            ? cell.notes.filter((n) => n !== num)
            : [...cell.notes, num].sort();
          return { ...cell, notes: newNotes };
        } else {
          const correct = puzzleState.solution[Math.floor(i / 9)][i % 9];
          return {
            ...cell,
            value: num,
            notes: [],
            isIncorrect: showMistakes && num !== correct,
          };
        }
      })
    );
  };

  // Recalculate mistakes on toggle
  useEffect(() => {
    if (!puzzleState) return;
    setCells((prev) =>
      prev.map((cell, i) => {
        if (cell.isInitial || cell.value === 0)
          return { ...cell, isIncorrect: false };
        const correct = puzzleState.solution[Math.floor(i / 9)][i % 9];
        return { ...cell, isIncorrect: showMistakes && cell.value !== correct };
      })
    );
  }, [showMistakes, puzzleState]);

  // Check for puzzle completion
  useEffect(() => {
    if (!puzzleState) return;
    const allCorrect = cells.every(
      (cell, i) => cell.value === puzzleState.solution[Math.floor(i / 9)][i % 9]
    );
    const noneIncorrect = cells.every((cell) => !cell.isIncorrect);
    if (allCorrect && noneIncorrect) {
      setIsComplete(true);
    }
  }, [cells, puzzleState]);

  return {
    // state
    difficulty,
    cells,
    selectedIndex,
    noteMode,
    isComplete,
    highlightUsedNumbers,
    showMistakes,

    // puzzle metadata
    puzzleState,
    originalCells,

    // actions
    setCells,
    setNoteMode,
    setDifficulty,
    setHighlightUsedNumbers,
    setShowMistakes,
    setSelectedIndex,
    startNewGame,
    handleRestartGame,
    handleCellClick,
    handleClear,
    handleNumberClick,
    setPuzzleState,
  };
}