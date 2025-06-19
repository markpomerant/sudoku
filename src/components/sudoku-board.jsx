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
                <GameHeader
                    difficulty={difficulty}
                    elapsedSeconds={elapsedSeconds}
                >
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
                </GameHeader>

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