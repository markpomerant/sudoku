// SudokuBoard.jsx
// ---------------
// This is the main Sudoku board component, managing game state, user interactions, and rendering all subcomponents.
//
// Usage:
//   <SudokuBoard />
//
// The component uses custom hooks for state, timer, selection, validation, and local storage. It renders the game header, settings, grid, number pad, note toggle, and difficulty selector.

import React from "react";
import { useState, useEffect } from "react";
import styled from '@emotion/styled';
import GameHeader from "./game-header";
import SettingsMenu from "./setting-menu";
import SudokuGrid from "./sudoku-grid";
import NumberPad from "./number-pad";
import NoteToggleButton, { /* ...existing code... */ } from "./note-toggle-button";
import DifficultySelector from "./difficulty-selector";
import Confetti from "./Confetti";
import PauseToggleButton, { PausePlayIcon } from "./pause-toggle-button";

import { useSudokuState } from "../hooks/use-sudoku-state";
import { useTimer } from "../hooks/use-timer";
import { useSelectionAndHighlighting } from "../hooks/use-selection-and-highlighting";
import { useValidation } from "../hooks/use-validation";
import { useLocalStorageGameState } from "../hooks/use-local-storage-game-state";

    /**
     * Main Sudoku board component, manages game state and renders all UI.
     *
     * @returns {JSX.Element} The rendered Sudoku board.
     */
    export default function SudokuBoard() {
        const {
            difficulty,
            puzzleState,
            cells,
            setCells,
            isComplete,
            setIsComplete,
            startNewGame,
            handleRestartGame,
            setDifficulty,
            setPuzzleState,
            originalCells,
        } = useSudokuState();

        const timer = useTimer(true);
        const {
            elapsedSeconds,
            isActive: timerActive,
            stop: stopTimer,
            reset: resetTimer,
            setElapsedSeconds,
            start
        } = timer;

        const [showSettings, setShowSettings] = useState(false);
        const [noteMode, setNoteMode] = React.useState(false);
        const [centerNoteMode, setCenterNoteMode] = React.useState(false);
        const [highlightUsedNumbers, setHighlightUsedNumbers] = React.useState(false);
        const [showMistakes, setShowMistakes] = React.useState(false);
        const validThemes = [
            'light', 'dark', 'ocean', 'redsands', 'plain', 'matrix', 'solarized', 'vibrant', 'barbie'
        ];
        // Initialize theme from localStorage synchronously
        const [theme, setThemeState] = React.useState(() => localStorage.getItem('sudoku-theme') || 'light');
        const setTheme = (newTheme) => {
            if (validThemes.includes(newTheme)) {
                setThemeState(newTheme);
            }
        };

        // Save theme to localStorage whenever it changes
        useEffect(() => {
            localStorage.setItem('sudoku-theme', theme);
            // Remove all possible theme classes
            document.body.classList.remove(
                'theme-light', 'theme-dark', 'theme-ocean', 'theme-redsands',
                'theme-plain', 'theme-matrix', 'theme-solarized', 'theme-vibrant', 'theme-barbie'
            );
            document.body.classList.add(`theme-${theme}`);
        }, [theme]);

        const {
            selectedIndex,
            setSelectedIndex,
            usedValues,
            handleCellClick,
        } = useSelectionAndHighlighting(cells, highlightUsedNumbers);

        useValidation(cells, setCells, puzzleState, showMistakes, setIsComplete, stopTimer);

        const {
            hasLoaded,
            restoredState
        } = useLocalStorageGameState({
            puzzleState,
            originalCells,
            cells,
            elapsedSeconds,
            difficulty,
            noteMode,
            highlightUsedNumbers,
            showMistakes,
            timerActive // persist paused state
        });

        useEffect(() => {
            if (restoredState && !difficulty && !puzzleState) {
                setDifficulty(restoredState.difficulty);
                setPuzzleState(restoredState.puzzleState);
                setCells(restoredState.cells);
                setNoteMode(restoredState.noteMode);
                setHighlightUsedNumbers(restoredState.highlightUsedNumbers);
                setShowMistakes(restoredState.showMistakes);
                setElapsedSeconds(restoredState.elapsedSeconds);
                if (restoredState.timerActive === false) {
                    stopTimer();
                } else {
                    start();
                }
            }
        }, [restoredState]);

        const handleClear = () => {
            if (selectedIndex == null || isComplete) return;
            setCells(prev =>
                prev.map((cell, i) =>
                    i === selectedIndex && !cell.isInitial
                        ? { ...cell, value: 0, notes: [], centerNotes: [], isIncorrect: false }
                        : cell
                )
            );
        };

        const handleNumberClick = (num) => {
            if (selectedIndex == null || isComplete) return;

            setCells(prev =>
                prev.map((cell, i) => {
                    if (i !== selectedIndex || cell.isInitial) return cell;

                    if (noteMode) {
                        // Replace any center note with pencil notes
                        const alreadyHas = cell.notes.includes(num);
                        const newNotes = alreadyHas
                            ? cell.notes.filter(n => n !== num)
                            : [...cell.notes, num].sort();
                        return { ...cell, notes: newNotes, centerNotes: [] };
                    } else if (centerNoteMode) {
                        // Replace any pencil notes with a single center note
                        return { ...cell, centerNotes: [num], notes: [] };
                    } else {
                        return {
                            ...cell,
                            value: num,
                            notes: [],
                            centerNotes: [],
                            isIncorrect: showMistakes && num !== puzzleState.solution[Math.floor(i / 9)][i % 9],
                        };
                    }
                })
            );
        };

        const handleNewGame = (level) => {
            setDifficulty(null);
            setPuzzleState(null);
            setNoteMode(false);
            setCenterNoteMode(false);
            setShowSettings(false);
            setHighlightUsedNumbers(false);
            setShowMistakes(false);
            setSelectedIndex(null);
            resetTimer();
            start(); // Ensure timer is unpaused when starting a new game
            startNewGame(level);
        };

        const handlePauseToggle = () => {
            if (timerActive) {
                stopTimer();
            } else {
                if (!isComplete) {
                    start();
                }
            }
        };

        if (!hasLoaded) return null;

        if (!difficulty || !puzzleState) {
            return <DifficultySelector onSelect={handleNewGame} />
        }

        return (
            <BoardContainer>
                {isComplete && <Confetti />}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%' }}>
                  <GameHeader
                      difficulty={difficulty}
                      elapsedSeconds={elapsedSeconds}
                  >
                    <SettingsIconButton
                      onClick={() => {
                        setShowSettings(s => !s);
                      }}
                      aria-label="Open settings"
                      tabIndex={0}
                      type="button"
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowSettings(s => !s);
                        }
                      }}
                    >
                      <SettingsIconStyled />
                    </SettingsIconButton>
                  </GameHeader>
                </div>
                <SettingsMenu
                    show={showSettings}
                    onNewGame={() => {
                        setDifficulty(null);
                        setPuzzleState(null);
                        setNoteMode(false);
                        setCenterNoteMode(false);
                        setShowSettings(false);
                        setHighlightUsedNumbers(false);
                        setShowMistakes(false);
                        setSelectedIndex(null);
                        resetTimer();
                    }}
                    onRestart={() => {
                        handleRestartGame();
                        setIsComplete(false);
                        setShowSettings(false);
                        resetTimer();
                        start(); // Ensure timer resumes after restart
                        setNoteMode(false);
                        setCenterNoteMode(false);
                        setHighlightUsedNumbers(false);
                        setShowMistakes(false);
                        setSelectedIndex(null);
                    }}
                    showMistakes={showMistakes}
                    onToggleMistakes={() => { setShowMistakes(!showMistakes);  }}
                    highlightUsedNumbers={highlightUsedNumbers}
                    onToggleHighlight={() => { setHighlightUsedNumbers(!highlightUsedNumbers); }}
                    onToggle={() => setShowSettings(!showSettings)}
                    theme={theme}
                    onThemeChange={setTheme}
                />

                <div style={{ position: 'relative', display: 'inline-block' }}>
                    {!timerActive && (
                        <PausedOverlay onClick={handlePauseToggle} title="Click to resume">
                            <PausePlayIcon paused={true} size={64} />
                        </PausedOverlay>
                    )}
                    <SudokuGrid
                        cells={cells}
                        selectedIndex={selectedIndex}
                        onSelect={timerActive ? handleCellClick : () => {}}
                        isComplete={isComplete}
                        disabled={!timerActive}
                    />
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                    <NoteToggleButton
                        noteMode={noteMode}
                        onToggle={setNoteMode}
                        centerNoteMode={centerNoteMode}
                        onCenterToggle={setCenterNoteMode}
                    />
                    <PauseToggleButton
                        timerActive={timerActive}
                        onPauseToggle={handlePauseToggle}
                    />
                </div>

                <NumberPad
                    usedValues={usedValues}
                    isComplete={isComplete || !timerActive}
                    onNumberClick={timerActive ? handleNumberClick : () => {}}
                    onClear={timerActive ? handleClear : () => {}}
                    selectedIndex={selectedIndex}
                />

                {isComplete && (
                    <CompleteMessage>
                        🎉 Sudoku Complete!
                    </CompleteMessage>
                )}
            </BoardContainer>
        );
    }

// Styled components
const BoardContainer = styled.div`
  user-select: none;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: var(--primary-bg);
  color: var(--primary-text);
  min-height: 100vh;
`;

const CompleteMessage = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: var(--complete-message);
`;

const PausedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  pointer-events: all;
  cursor: pointer;
`;

// Copy the SettingsIcon and SettingsIconStyled from setting-menu.jsx
function SettingsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 174.248 174.248" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M173.145,73.91c-0.413-2.722-2.29-4.993-4.881-5.912l-13.727-4.881c-0.812-2.3-1.733-4.536-2.754-6.699l6.247-13.146
          c1.179-2.479,0.899-5.411-0.729-7.628c-5.265-7.161-11.556-13.452-18.698-18.693c-2.219-1.629-5.141-1.906-7.625-0.724
          l-13.138,6.242c-2.163-1.021-4.402-1.94-6.704-2.752l-4.883-13.729c-0.919-2.586-3.184-4.458-5.9-4.876
          c-9.65-1.483-16.792-1.483-26.457,0c-2.713,0.418-4.981,2.29-5.9,4.876l-4.883,13.729c-2.302,0.812-4.541,1.731-6.702,2.752
          l-13.143-6.242c-2.479-1.181-5.406-0.904-7.623,0.724c-7.142,5.241-13.433,11.532-18.698,18.693
          c-1.629,2.217-1.908,5.148-0.729,7.628l6.247,13.146c-1.021,2.159-1.94,4.4-2.754,6.699L5.982,68.003
          c-2.589,0.919-4.463,3.189-4.879,5.907c-0.749,4.92-1.099,9.115-1.099,13.219c0,4.098,0.35,8.299,1.099,13.219
          c0.413,2.722,2.29,4.993,4.881,5.912l13.727,4.881c0.814,2.304,1.736,4.541,2.754,6.704l-6.247,13.141
          c-1.179,2.479-0.899,5.411,0.727,7.623c5.258,7.156,11.549,13.447,18.7,18.698c2.217,1.629,5.144,1.911,7.625,0.724l13.138-6.242
          c2.163,1.021,4.402,1.94,6.704,2.752l4.883,13.729c0.919,2.586,3.184,4.458,5.9,4.876c4.828,0.744,9.154,1.104,13.228,1.104
          c4.074,0,8.401-0.36,13.228-1.104c2.715-0.418,4.981-2.29,5.9-4.876l4.883-13.729c2.302-0.812,4.541-1.731,6.704-2.752
          l13.138,6.242c2.484,1.186,5.411,0.904,7.628-0.724c7.159-5.26,13.45-11.551,18.698-18.698c1.626-2.212,1.906-5.144,0.727-7.623
          l-6.247-13.141c1.021-2.163,1.942-4.405,2.754-6.704l13.727-4.881c2.591-0.919,4.468-3.189,4.881-5.912
          c0.749-4.92,1.099-9.12,1.099-13.219S173.894,78.829,173.145,73.91z M158.949,93.72l-12.878,4.58
          c-2.251,0.797-3.982,2.625-4.66,4.92c-1.15,3.889-2.664,7.569-4.504,10.943c-1.142,2.1-1.213,4.619-0.187,6.777l5.841,12.285
          c-2.822,3.389-5.943,6.515-9.337,9.334l-12.283-5.834c-2.161-1.036-4.672-0.953-6.775,0.185c-3.379,1.838-7.061,3.35-10.953,4.502
          c-2.29,0.676-4.118,2.406-4.917,4.657l-4.582,12.883c-4.677,0.476-8.503,0.476-13.18,0l-4.582-12.883
          c-0.8-2.246-2.628-3.982-4.917-4.657c-3.894-1.152-7.579-2.664-10.953-4.502c-2.103-1.147-4.619-1.22-6.775-0.185l-12.283,5.839
          c-3.391-2.825-6.512-5.946-9.337-9.339l5.841-12.285c1.026-2.159,0.955-4.677-0.187-6.777c-1.835-3.364-3.35-7.049-4.504-10.948
          c-0.678-2.29-2.411-4.118-4.66-4.915l-12.878-4.58c-0.243-2.343-0.36-4.502-0.36-6.592s0.117-4.244,0.36-6.587l12.881-4.584
          c2.248-0.797,3.979-2.625,4.657-4.915c1.152-3.889,2.667-7.574,4.504-10.953c1.142-2.095,1.213-4.619,0.187-6.772l-5.841-12.285
          c2.827-3.393,5.948-6.519,9.337-9.339l12.288,5.839c2.151,1.036,4.677,0.953,6.775-0.185c3.372-1.838,7.054-3.35,10.948-4.502
          c2.29-0.676,4.118-2.411,4.917-4.657l4.582-12.883c4.633-0.481,8.466-0.481,13.18,0l4.582,12.883
          c0.8,2.246,2.628,3.982,4.917,4.657c3.894,1.152,7.579,2.664,10.953,4.502c2.103,1.147,4.614,1.22,6.775,0.185l12.283-5.839
          c3.389,2.82,6.51,5.946,9.337,9.339l-5.841,12.285c-1.026,2.154-0.955,4.677,0.187,6.772c1.843,3.389,3.357,7.069,4.504,10.948
          c0.678,2.295,2.409,4.123,4.66,4.92l12.878,4.58c0.243,2.343,0.36,4.502,0.36,6.592S159.192,91.377,158.949,93.72z" fill="currentColor" />
      <path d="M87.124,50.802c-19.062,0-34.571,15.508-34.571,34.571s15.508,34.571,34.571,34.571s34.571-15.508,34.571-34.571
        S106.186,50.802,87.124,50.802z M87.124,105.009c-10.827,0-19.636-8.809-19.636-19.636s8.809-19.636,19.636-19.636
        s19.636,8.809,19.636,19.636S97.951,105.009,87.124,105.009z" fill="currentColor" />
    </g>
    </svg>
  );
}

const SettingsIconStyled = styled(SettingsIcon)`
  color: var(--button-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  pointer-events: auto;
`;

const SettingsIconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: inherit;
  &:hover, &:focus {
    color: var(--accent);
    outline: none;
  }
`;