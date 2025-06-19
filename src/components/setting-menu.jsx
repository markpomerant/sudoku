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
import styled from '@emotion/styled';

/**
 * Renders the settings menu for Sudoku game options and actions as a modal.
 *
 * @param {{
 *   show: boolean,
 *   onToggle: () => void,
 *   onRestart: () => void,
 *   onNewGame: () => void,
 *   showMistakes: boolean,
 *   onToggleMistakes: () => void,
 *   highlightUsedNumbers: boolean,
 *   onToggleHighlight: () => void,
 *   theme: string,
 *   onThemeChange: (theme: string) => void
 * }} props - Component props.
 * @returns {JSX.Element} The rendered settings modal.
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
  theme,
  onThemeChange,
}) {
  return (
    <MenuContainer>
      <SettingsButton onClick={onToggle}>
        ⚙️
      </SettingsButton>

      {show && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <span>Settings</span>
              <CloseButton onClick={onToggle}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
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

              <StyledLabel>
                Theme:
                <ThemeSelect value={theme} onChange={e => onThemeChange(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="barbie">Barbie</option>
                  <option value="ocean">Ocean</option>
                  <option value="redsands">Red Sands</option>
                  <option value="plain">Plain</option>
                  <option value="matrix">Matrix</option>
                  <option value="solarized">Solarized</option>
                  <option value="vibrant">Vibrant</option>
                  
                </ThemeSelect>
              </StyledLabel>

              <StyledHr />

              <MenuActionButton onClick={onRestart}>
                🔄 Restart Game
              </MenuActionButton>

              <MenuActionButton onClick={onNewGame}>
                🔄 New Game
              </MenuActionButton>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
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
  background: var(--button-bg-alt);
  color: var(--button-text);
  border: 1px solid var(--button-border);
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--button-bg);
    border-color: var(--button-border-active);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: var(--primary-bg);
  color: var(--primary-text);
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  min-width: 320px;
  max-width: 90vw;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 8px 20px;
  font-size: 20px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: var(--primary-text);
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
`;

const ModalBody = styled.div`
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--primary-text);
  input {
    margin-right: 8px;
  }
`;

const StyledHr = styled.hr`
  margin: 8px 0;
  border-color: var(--button-border);
`;

const MenuActionButton = styled.button`
  width: 100%;
  padding: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: var(--button-bg-alt);
  border: 1px solid var(--button-border);
  border-radius: 4px;
  color: var(--button-text);
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--button-bg);
    border-color: var(--button-border-active);
  }
`;

const ThemeSelect = styled.select`
  margin-left: 8px;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--button-border);
  background: var(--secondary-bg);
  color: var(--primary-text);
`;
