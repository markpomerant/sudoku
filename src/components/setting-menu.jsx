import React from "react";

export default function SettingsMenu({
  show,
  onToggle,
  onRestart,
  onNewGame,
  showMistakes,
  onToggleMistakes,
  highlightUsedNumbers,
  onToggleHighlight,
}) {
 
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onToggle}
        style={{
          fontSize: "14px",
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        ⚙️
      </button>

      {show && (
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
          <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
            <input
              type="checkbox"
              checked={highlightUsedNumbers}
              onChange={(e) => {
                onToggleHighlight(e.target.checked);
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
                onToggleMistakes(e.target.checked);
              }}
              style={{ marginRight: "8px" }}
            />
            Show Mistakes
          </label>

          <hr style={{ margin: "8px 0" }} />

          <button
            onClick={onRestart}
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
            onClick={onNewGame}
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
  );
}
