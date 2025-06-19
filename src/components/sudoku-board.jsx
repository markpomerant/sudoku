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
import NoteToggleButton from "./note-toggle-button";
import DifficultySelector from "./difficulty-selector";

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

        const {
            elapsedSeconds,
            isActive: timerActive,
            stop: stopTimer,
            reset: resetTimer,
            setElapsedSeconds
        } = useTimer(true);
        const [showSettings, setShowSettings] = useState(false);
        const [noteMode, setNoteMode] = React.useState(false);
        const [highlightUsedNumbers, setHighlightUsedNumbers] = React.useState(false);
        const [showMistakes, setShowMistakes] = React.useState(false);
        // Initialize theme from localStorage synchronously
        const [theme, setTheme] = React.useState(() => localStorage.getItem('sudoku-theme') || 'light');

        // Save theme to localStorage whenever it changes
        useEffect(() => {
            localStorage.setItem('sudoku-theme', theme);
            document.body.classList.remove('theme-light', 'theme-dark', 'theme-ocean', 'theme-redsands');
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
                
            }
        }, [restoredState]);

        const handleClear = () => {
            if (selectedIndex == null || isComplete) return;
            setCells(prev =>
                prev.map((cell, i) =>
                    i === selectedIndex && !cell.isInitial
                        ? { ...cell, value: 0, notes: [], isIncorrect: false }
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
                        const alreadyHas = cell.notes.includes(num);
                        const newNotes = alreadyHas
                            ? cell.notes.filter(n => n !== num)
                            : [...cell.notes, num].sort();
                        return { ...cell, notes: newNotes };
                    } else {
                        return {
                            ...cell,
                            value: num,
                            notes: [],
                            isIncorrect: showMistakes && num !== puzzleState.solution[Math.floor(i / 9)][i % 9],
                        };
                    }
                })
            );
        };

        if (!hasLoaded) return null;

        if (!difficulty || !puzzleState) {
            return <DifficultySelector onSelect={(level) => { startNewGame(level); resetTimer(); setShowSettings(false); }} />
        }

        return (
            <BoardContainer>
                <GameHeader difficulty={difficulty} elapsedSeconds={elapsedSeconds}>
                    <SettingsMenu
                        show={showSettings}
                        onNewGame={() => {
                            setDifficulty(null);
                            setPuzzleState(null);
                        }}
                        onRestart={() => {
                            handleRestartGame();
                            setShowSettings(false);
                            resetTimer();
                        }}
                        showMistakes={showMistakes}
                        onToggleMistakes={() => { setShowMistakes(!showMistakes); setShowSettings(false); }}
                        highlightUsedNumbers={highlightUsedNumbers}
                        onToggleHighlight={() => { setHighlightUsedNumbers(!highlightUsedNumbers); setShowSettings(false); }}
                        onToggle={() => setShowSettings(!showSettings)}
                        theme={theme}
                        onThemeChange={setTheme}
                    />
                </GameHeader>

                <SudokuGrid
                    cells={cells}
                    selectedIndex={selectedIndex}
                    onSelect={handleCellClick}
                    isComplete={isComplete}
                />

                <NoteToggleButton noteMode={noteMode} onToggle={() => setNoteMode(!noteMode)} />

                <NumberPad
                    usedValues={usedValues}
                    isComplete={isComplete}
                    onNumberClick={handleNumberClick}
                    onClear={handleClear}
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