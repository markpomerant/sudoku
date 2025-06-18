import './App.css';
import React, { useState, useEffect } from "react";
import { generatePuzzle } from "./lib/sudoku-solver"; 

function toCellState(puzzle, solution) {
  return puzzle.flat().map((val) => ({
    value: val,
    isInitial: val !== 0,
    isIncorrect: false,
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
const [highlightUsedNumbers, setHighlightUsedNumbers] = useState(false);
  const startNewGame = (level) => {
    const newPuzzle = generatePuzzle(level);
    setDifficulty(level);
    setPuzzleState(newPuzzle);
    setCells(toCellState(newPuzzle.puzzle, newPuzzle.solution));
    setSelectedIndex(null);
    setIsComplete(false);
  };

  const handleCellClick = (index) => {
    if (cells[index].isInitial) return;
    setSelectedIndex(index);
  };

  const handleNumberClick = (num) => {
    if (selectedIndex == null || isComplete) return;

    const newCells = cells.map((cell, i) =>
      i === selectedIndex
        ? {
            ...cell,
            value: num,
            isIncorrect: num !== puzzleState.solution[Math.floor(i / 9)][i % 9],
          }
        : cell
    );

    setCells(newCells);
  };

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
      <h2>Sudoku ({difficulty})</h2>

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
                lineHeight: "40px",
                textAlign: "center",
                fontSize: "18px",
                cursor: cell.isInitial || isComplete ? "default" : "pointer",
                backgroundColor: cell.isInitial
                  ? "#eee"
                  : cell.isIncorrect && showMistakes
                  ? "#fdd"
                  : isSelected
                  ? "#cceeff"
                  : "white",
                border: "1px solid gray",
                borderTop:
                  Math.floor(i / 9) % 3 === 0 ? "2px solid black" : "1px solid gray",
                borderLeft:
                  i % 9 % 3 === 0 ? "2px solid black" : "1px solid gray",
              }}
            >
              {cell.value !== 0 ? cell.value : ""}
            </div>
          );
        })}
      </div>
<div style={{ marginTop: 20, marginBottom: 10 }}>
  <label style={{ fontSize: "14px", cursor: "pointer" }}>
    <input
      type="checkbox"
      checked={highlightUsedNumbers}
      onChange={(e) => setHighlightUsedNumbers(e.target.checked)}
      style={{ marginRight: "8px" }}
    />
    Highlight Used Numbers
  </label>
</div>

<div style={{ marginTop: 5, marginBottom: 10 }}>
  <label style={{ fontSize: "14px", cursor: "pointer" }}>
    <input
      type="checkbox"
      checked={showMistakes}
      onChange={(e) => setShowMistakes(e.target.checked)}
      style={{ marginRight: "8px" }}
    />
    Show Mistakes
  </label>
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
      onClick={() => handleNumberClick(0)} // or implement a `handleClear`
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

      {/* New Game Button */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => {
            setDifficulty(null);
            setPuzzleState(null);
          }}
          style={{ fontSize: "16px", padding: "8px 16px" }}
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
}

function App() {
  
  const {puzzle, solution} = generatePuzzle("easy")
  return (
    <div className="App">
        <SudokuBoard puzzle={puzzle} solution={solution}/>
    </div>
  );
}

export default App;
