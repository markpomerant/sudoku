import React from "react";

export default function DifficultySelector({ onSelect }) {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Select Difficulty</h2>
      {['easy', 'medium', 'hard'].map((level) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
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
