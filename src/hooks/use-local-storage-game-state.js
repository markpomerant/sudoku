import { useEffect, useState } from "react";

export function useLocalStorageGameState(currentState) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [restoredState, setRestoredState] = useState(null);

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("sudoku-save");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRestoredState(parsed);
      } catch (e) {
        console.warn("Failed to parse saved game:", e);
      }
    }
    setHasLoaded(true);
  }, []);

  // Save to localStorage when game state changes
  useEffect(() => {
    if (hasLoaded && currentState.puzzleState) {
      localStorage.setItem("sudoku-save", JSON.stringify(currentState));
    }
  }, [currentState, hasLoaded]);

  return { hasLoaded, restoredState };
}