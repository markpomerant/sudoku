/** @jsxImportSource @emotion/react */
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
import styled from '@emotion/styled'

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
    <MenuContainer>
      <SettingsButton onClick={onToggle}>
        ⚙️
      </SettingsButton>

      {show && (
        <DropdownMenu>
          <StyledLabel>
            <input
              type="checkbox"
              checked={highlightUsedNumbers}
              onChange={(e) => {
                onToggleHighlight(e.target.checked);
              }}
            />
            Highlight Used Numbers
          </StyledLabel>

          <StyledLabel>
            <input
              type="checkbox"
              checked={showMistakes}
              onChange={(e) => {
                onToggleMistakes(e.target.checked);
              }}
            />
            Show Mistakes
          </StyledLabel>

          <StyledHr />

          <MenuActionButton onClick={onRestart}>
            🔄 Restart Game
          </MenuActionButton>

          <MenuActionButton onClick={onNewGame}>
            🔄 New Game
          </MenuActionButton>
        </DropdownMenu>
      )}
    </MenuContainer>
  );
}

// Styled components
const MenuContainer = styled.div`
  position: relative;
`;

const SettingsButton = styled.button`
  font-size: 14px;
  padding: 4px 8px;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 10;
  min-width: 180px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  input {
    margin-right: 8px;
  }
`;

const StyledHr = styled.hr`
  margin: 8px 0;
`;

const MenuActionButton = styled.button`
  width: 100%;
  padding: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
