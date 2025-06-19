// SettingsMenu.jsx
// ---------------
// This component renders a settings menu for the Sudoku game, allowing toggling of various options and game actions.
//
// Props:
//   - show (boolean): Whether the settings menu is visible.
//   - onToggle (function): Callback to toggle the menu visibility.
//   - onRestart (function): Callback to restart the current game.
//   - onNewGame (function): Callback to start a new game.
//   - showMistakes (boolean): Whether to show mistakes.
//   - onToggleMistakes (function): Callback to toggle mistake highlighting.
//   - highlightUsedNumbers (boolean): Whether to highlight used numbers.
//   - onToggleHighlight (function): Callback to toggle highlighting of used numbers.
//
// Usage:
//   <SettingsMenu show={bool} onToggle={fn} onRestart={fn} onNewGame={fn} showMistakes={bool} onToggleMistakes={fn} highlightUsedNumbers={bool} onToggleHighlight={fn} />

import React from "react";

/**
 * Renders the settings menu for Sudoku game options and actions.
 *
 * @param {{
 *   show: boolean,
 *   onToggle: () => void,
 *   onRestart: () => void,
 *   onNewGame: () => void,
 *   showMistakes: boolean,
 *   onToggleMistakes: () => void,
 *   highlightUsedNumbers: boolean,
 *   onToggleHighlight: () => void
 * }} props - Component props.
 * @returns {JSX.Element} The rendered settings menu.
 */
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
