# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm start          # Start dev server on port 3000
npm run build      # Build for production to dist/ folder
npm run preview    # Preview production build

# Testing
npm test           # Run tests with Vitest in watch mode
```

## Architecture

This is a React-based Sudoku game application built with Vite, using Emotion for CSS-in-JS styling.

### Core Game Logic
- **Sudoku solver and generator**: `src/lib/sudoku-solver.js` - Contains algorithms for generating puzzles, solving them, and removing cells based on difficulty
- **Game state management**: Handled through custom hooks in `src/hooks/`:
  - `use-sudoku-state.js` - Main game state (cells, difficulty, puzzle generation)
  - `use-timer.js` - Timer functionality with pause/resume
  - `use-validation.js` - Cell validation and error checking
  - `use-selection-and-highlighting.js` - Cell selection and number highlighting
  - `use-local-storage-game-state.js` - Persistence of game state

### Component Structure
- **Main component**: `src/components/sudoku-board.jsx` - Orchestrates all game functionality
- **Game components**:
  - `sudoku-grid.jsx` - Renders the 9x9 grid with individual cells
  - `number-pad.jsx` - Number input interface
  - `game-header.jsx` - Game title and timer display
  - `setting-menu.jsx` - Settings dropdown with game actions
  - `difficulty-selector.jsx` - Difficulty level selection
  - `Confetti.jsx` - Victory animation

### State Flow
1. `SudokuBoard` component manages all state through custom hooks
2. User interactions (cell selection, number input) trigger state updates
3. Validation runs automatically on each change
4. Game completion triggers confetti animation
5. State persists to localStorage for game continuity

### Deployment
- Configured for GitHub Pages deployment with base path `/sudoku/`
- Progressive Web App (PWA) support via vite-plugin-pwa