import { useEffect } from "react";

export function useLocalStorageGameState({
  puzzleState,
  originalCells,
  cells,
  elapsedSeconds,
  difficulty,
  noteMode,
  highlightUsedNumbers,
  showMistakes,
}) {
  useEffect(() => {
    localStorage.setItem(
      "sudoku-save",
      JSON.stringify({
        puzzleState,
        originalCells,
        cells,
        elapsedSeconds,
        difficulty,
        noteMode,
        highlightUsedNumbers,
        showMistakes,
      })
    );
  }, [
    puzzleState,
    originalCells,
    cells,
    elapsedSeconds,
    difficulty,
    noteMode,
    highlightUsedNumbers,
    showMistakes,
  ]);
}
