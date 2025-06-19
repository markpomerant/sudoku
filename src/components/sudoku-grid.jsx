import React from "react";

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