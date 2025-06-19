import React from "react";

export default function NumberPad({
  onNumberClick,
  onClear,
  isComplete,
  usedValues,
  selectedIndex,
}) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
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
            onClick={() => onNumberClick(num)}
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

        <button
          onClick={onClear}
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
  );
}
