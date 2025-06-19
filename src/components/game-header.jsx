import React from "react";

export default function GameHeader({ difficulty, elapsedSeconds, children }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
      <h2 style={{ margin: 0 }}>
        Sudoku ({difficulty}) &nbsp;
        <span style={{ fontSize: "14px", color: "#777" }}>
          🕒 {formatTime(elapsedSeconds)}
        </span>
      </h2>
      {children}
    </div>
  );
}