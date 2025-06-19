import { useEffect } from "react";

export function useValidation(cells, setCells, puzzleState, showMistakes, setIsComplete, stopTimer) {
  useEffect(() => {
    if (!puzzleState) return;

    setCells((prev) =>
      prev.map((cell, i) => {
        if (cell.isInitial || cell.value === 0) return { ...cell, isIncorrect: false };

        const correct = puzzleState.solution[Math.floor(i / 9)][i % 9];
        const isIncorrect = showMistakes ? cell.value !== correct : false;

        return {
          ...cell,
          isIncorrect,
        };
      })
    );
  }, [showMistakes, puzzleState, setCells]);

  useEffect(() => {
    if (!puzzleState || !cells.length) return;
    const allCorrect = cells.every(
      (cell, i) => cell.value === puzzleState.solution[Math.floor(i / 9)][i % 9]
    );
    const noneIncorrect = cells.every((cell) => !cell.isIncorrect);
    if (allCorrect && noneIncorrect) {
      setIsComplete(true);
      stopTimer();
    }
  }, [cells, puzzleState, setIsComplete, stopTimer]);
}
