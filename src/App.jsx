import './App.css';
import React, { useState, useEffect } from "react";
import { generatePuzzle } from "./lib/sudoku-solver";


const PencilIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function toCellState(puzzle, solution) {
  return puzzle.flat().map((val) => ({
    value: val,
    isInitial: val !== 0,
    isIncorrect: false,
    notes: [],
  }));
}

function getRelatedIndexes(index) {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const related = new Set();

  for (let i = 0; i < 9; i++) related.add(row * 9 + i);
  for (let i = 0; i < 9; i++) related.add(i * 9 + col);

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      related.add((boxRow + r) * 9 + (boxCol + c));
    }
  }

  return related;
}

export function SudokuBoard() {
  const [difficulty, setDifficulty] = useState(null);
  const [puzzleState, setPuzzleState] = useState(null);
  const [cells, setCells] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [noteMode, setNoteMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [originalCells, setOriginalCells] = useState([]);
  const [highlightUsedNumbers, setHighlightUsedNumbers] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sudoku-save");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore state: puzzle, cells, time, toggles, etc.
        setPuzzleState(parsed.puzzleState);
        setOriginalCells(parsed.originalCells);
        setCells(parsed.cells);
        setElapsedSeconds(parsed.elapsedSeconds);
        setDifficulty(parsed.difficulty);
        setNoteMode(parsed.noteMode);
        setHighlightUsedNumbers(parsed.highlightUsedNumbers);
        setShowMistakes(parsed.showMistakes);
      } catch (e) {
        console.warn("Failed to parse saved state:", e);
      }
    }
  }, []);

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
  }, [puzzleState, originalCells, cells, elapsedSeconds, difficulty, noteMode, highlightUsedNumbers, showMistakes]);
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);


  const handleRestartGame = () => {
    setCells(originalCells.map((cell) => ({ ...cell }))); // clone it
    setSelectedIndex(null);
    setIsComplete(false);
    setElapsedSeconds(0);
    setTimerActive(true);
  };
const startNewGame = (level) => {
  const newPuzzle = generatePuzzle(level);
  const initialCells = toCellState(newPuzzle.puzzle, newPuzzle.solution);

  setDifficulty(level);
  setOriginalCells(initialCells);
  setPuzzleState(newPuzzle);
  setCells(initialCells);
  setSelectedIndex(null);
  setIsComplete(false);
  setElapsedSeconds(0);
  setTimerActive(true);
  setNoteMode(false);
  setHighlightUsedNumbers(false);
  setShowMistakes(false);


  localStorage.setItem(
    "sudoku-save",
    JSON.stringify({
      puzzleState: newPuzzle,
      originalCells: initialCells,
      cells: initialCells,
      elapsedSeconds: 0,
      difficulty: level,
      noteMode: false,
      highlightUsedNumbers: false,
      showMistakes: false,
    })
  );
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
          return {
            ...cell,
            notes: newNotes,
          };
        } else {
          return {
            ...cell,
            value: num,
            notes: [],
            isIncorrect: showMistakes && num !== puzzleState.solution[Math.floor(i / 9)][i % 9],
          };
        }
      })
    );
  };
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
  }, [showMistakes, puzzleState]);
  useEffect(() => {
    if (!puzzleState) return;
    const allCorrect = cells.every(
      (cell, i) => cell.value === puzzleState.solution[Math.floor(i / 9)][i % 9]
    );
    const noneIncorrect = cells.every((cell) => !cell.isIncorrect);
    if (allCorrect && noneIncorrect) {
      setIsComplete(true);
      setTimerActive(false);
    }
  }, [cells, puzzleState]);

  const usedValues = (() => {
    if (!highlightUsedNumbers || selectedIndex == null) return new Set();
    const related = getRelatedIndexes(selectedIndex);
    const values = new Set();
    for (let i of related) {
      const val = cells[i].value;
      if (val !== 0) values.add(val);
    }
    return values;
  })();

  if (!difficulty || !puzzleState) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <h2>Select Difficulty</h2>
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            onClick={() => startNewGame(level)}
            style={{
              margin: "0 10px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ userSelect: "none", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
        <h2 style={{ margin: 0 }}>
          Sudoku ({difficulty}) &nbsp;
          <span style={{ fontSize: "14px", color: "#777" }}>
            🕒 {formatTime(elapsedSeconds)}
          </span>
        </h2>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowSettings((v) => !v)}
            style={{
              fontSize: "14px",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            ⚙️
          </button>

          {showSettings && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                zIndex: 10,
                minWidth: "180px",
                whiteSpace: "nowrap",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", fontSize: "14px", marginBottom: "8px" }}>
                <input
                  type="checkbox"
                  checked={highlightUsedNumbers}
                  onChange={(e) => {
                    setHighlightUsedNumbers(e.target.checked);
                    setShowSettings(false);
                  }}
                  style={{ marginRight: "8px" }}
                />
                Highlight Used Numbers
              </label>

              <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                <input
                  type="checkbox"
                  checked={showMistakes}
                  onChange={(e) => {
                    setShowMistakes(e.target.checked);
                    setShowSettings(false);
                  }}
                  style={{ marginRight: "8px" }}
                />
                Show Mistakes
              </label>
              <hr style={{ margin: "8px 0" }} />

              <button
                onClick={() => {
                  handleRestartGame();
                  setShowSettings(false); // optionally close menu
                }}
                style={{
                  width: "100%",
                  padding: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                🔄 Restart Game
              </button>

              <button
                onClick={() => {
                  setDifficulty(null);
                  setPuzzleState(null);
                  setShowSettings(false);
                  localStorage.removeItem("sudoku-save");
                }}
                style={{
                  width: "100%",
                  padding: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                🔄 New Game
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sudoku Grid */}
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
        {cells.map((cell, i) => {
          const isSelected = i === selectedIndex;
          return (
            <div
              key={i}
              onClick={() => handleCellClick(i)}
              style={{
                width: 40,
                height: 40,
                fontSize: "18px",
                position: "relative",
                textAlign: "center",
                cursor: cell.isInitial || isComplete ? "default" : "pointer",
                backgroundColor: cell.isInitial
                  ? "#eee"
                  : cell.isIncorrect
                    ? "#fdd"
                    : isSelected
                      ? "#cceeff"
                      : "white",
                border: "1px solid gray",
                borderTop: Math.floor(i / 9) % 3 === 0 ? "2px solid black" : "1px solid gray",
                borderLeft: i % 9 % 3 === 0 ? "2px solid black" : "1px solid gray",
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
        })}
      </div>

      <div style={{ marginTop: 20, marginBottom: 10, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <button
          onClick={() => setNoteMode((v) => !v)}
          style={{
            position: "relative",
            width: 40,
            height: 40,
            cursor: "pointer",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: noteMode ? "#e0f7fa" : "#f9f9f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Toggle pencil note mode"
        >
          <PencilIcon size={20} />
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              backgroundColor: noteMode ? "#4caf50" : "#ccc",
              color: "white",
              fontSize: "10px",
              padding: "1px 4px",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            {noteMode ? "on" : "off"}
          </span>
        </button>
      </div>

      {/* Number Selector */}
      <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
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
              onClick={() => handleNumberClick(num)}
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

          {/* Optional: Clear button */}
          <button
            onClick={() => { handleClear(); }}
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

      {/* Game Over Message */}
      {isComplete && (
        <div style={{ marginTop: 20, fontSize: "18px", color: "green" }}>
          🎉 Sudoku Complete!
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <div className="App">
      <SudokuBoard />
    </div>
  );
}

export default App;
