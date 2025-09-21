// Sudoku pattern detection algorithms
// This module contains functions to detect common Sudoku solving patterns

/**
 * Get all possible candidates for a cell based on current board state
 * @param {object[]} cells - Array of cell objects representing the Sudoku grid
 * @param {number} index - Index of the cell (0-80)
 * @param {object} puzzleState - Current puzzle state object
 * @returns {number[]} Array of possible candidate numbers (1-9)
 */
function getCandidates(cells, index, puzzleState) {
  if (cells[index].value !== 0) return [];

  const row = Math.floor(index / 9);
  const col = index % 9;
  const boxRow = Math.floor(row / 3);
  const boxCol = Math.floor(col / 3);

  const used = new Set();

  // Check row
  for (let c = 0; c < 9; c++) {
    if (cells[row * 9 + c].value !== 0) {
      used.add(cells[row * 9 + c].value);
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (cells[r * 9 + col].value !== 0) {
      used.add(cells[r * 9 + col].value);
    }
  }

  // Check box
  for (let r = boxRow * 3; r < (boxRow + 1) * 3; r++) {
    for (let c = boxCol * 3; c < (boxCol + 1) * 3; c++) {
      if (cells[r * 9 + c].value !== 0) {
        used.add(cells[r * 9 + c].value);
      }
    }
  }

  const candidates = [];
  for (let num = 1; num <= 9; num++) {
    if (!used.has(num)) {
      candidates.push(num);
    }
  }

  return candidates;
}

/**
 * Generate candidate matrix for the entire board
 */
function generateCandidates(cells, puzzleState) {
  const candidates = {};
  for (let i = 0; i < 81; i++) {
    if (cells[i].value === 0) {
      candidates[i] = getCandidates(cells, i, puzzleState);
    }
  }
  return candidates;
}

/**
 * Get cells in the same unit (row, column, or box)
 */
function getUnitCells(index, unitType) {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const cells = [];

  if (unitType === 'row') {
    for (let c = 0; c < 9; c++) {
      cells.push(row * 9 + c);
    }
  } else if (unitType === 'column') {
    for (let r = 0; r < 9; r++) {
      cells.push(r * 9 + col);
    }
  } else if (unitType === 'box') {
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    for (let r = boxRow * 3; r < (boxRow + 1) * 3; r++) {
      for (let c = boxCol * 3; c < (boxCol + 1) * 3; c++) {
        cells.push(r * 9 + c);
      }
    }
  }

  return cells;
}

/**
 * Detect naked singles - cells with only one possible candidate
 */
function detectNakedSingles(candidates) {
  const patterns = [];

  for (const [cellIndex, candidateList] of Object.entries(candidates)) {
    if (candidateList.length === 1) {
      patterns.push({
        type: 'naked-single',
        name: 'Naked Single',
        description: `Cell can only be ${candidateList[0]}`,
        cells: [parseInt(cellIndex)],
        candidates: candidateList,
        difficulty: 'beginner'
      });
    }
  }

  return patterns;
}

/**
 * Detect hidden singles - only one cell in a unit can contain a specific number
 */
function detectHiddenSingles(candidates) {
  const patterns = [];

  // Check each unit type
  for (let unitType of ['row', 'column', 'box']) {
    for (let unitIndex = 0; unitIndex < 9; unitIndex++) {
      let unitCells;

      if (unitType === 'row') {
        unitCells = Array.from({ length: 9 }, (_, col) => unitIndex * 9 + col);
      } else if (unitType === 'column') {
        unitCells = Array.from({ length: 9 }, (_, row) => row * 9 + unitIndex);
      } else { // box
        const boxRow = Math.floor(unitIndex / 3);
        const boxCol = unitIndex % 3;
        unitCells = [];
        for (let r = boxRow * 3; r < (boxRow + 1) * 3; r++) {
          for (let c = boxCol * 3; c < (boxCol + 1) * 3; c++) {
            unitCells.push(r * 9 + c);
          }
        }
      }

      // For each number 1-9, check if it appears in only one cell's candidates
      for (let num = 1; num <= 9; num++) {
        const cellsWithCandidate = unitCells.filter(cellIndex =>
          candidates[cellIndex] && candidates[cellIndex].includes(num)
        );

        if (cellsWithCandidate.length === 1) {
          patterns.push({
            type: 'hidden-single',
            name: 'Hidden Single',
            description: `${num} can only go in one cell in this ${unitType}`,
            cells: cellsWithCandidate,
            candidates: [num],
            unit: { type: unitType, cells: unitCells },
            difficulty: 'beginner'
          });
        }
      }
    }
  }

  return patterns;
}

/**
 * Detect naked pairs - two cells in a unit have the same two candidates
 */
function detectNakedPairs(candidates) {
  const patterns = [];

  for (let unitType of ['row', 'column', 'box']) {
    for (let unitIndex = 0; unitIndex < 9; unitIndex++) {
      let unitCells;

      if (unitType === 'row') {
        unitCells = Array.from({ length: 9 }, (_, col) => unitIndex * 9 + col);
      } else if (unitType === 'column') {
        unitCells = Array.from({ length: 9 }, (_, row) => row * 9 + unitIndex);
      } else {
        const boxRow = Math.floor(unitIndex / 3);
        const boxCol = unitIndex % 3;
        unitCells = [];
        for (let r = boxRow * 3; r < (boxRow + 1) * 3; r++) {
          for (let c = boxCol * 3; c < (boxCol + 1) * 3; c++) {
            unitCells.push(r * 9 + c);
          }
        }
      }

      // Find cells with exactly 2 candidates
      const biValueCells = unitCells.filter(cellIndex =>
        candidates[cellIndex] && candidates[cellIndex].length === 2
      );

      // Check for pairs
      for (let i = 0; i < biValueCells.length; i++) {
        for (let j = i + 1; j < biValueCells.length; j++) {
          const cell1 = biValueCells[i];
          const cell2 = biValueCells[j];
          const candidates1 = candidates[cell1];
          const candidates2 = candidates[cell2];

          if (candidates1[0] === candidates2[0] && candidates1[1] === candidates2[1]) {
            // Find affected cells (other cells in unit that contain these candidates)
            const affectedCells = unitCells.filter(cellIndex =>
              cellIndex !== cell1 && cellIndex !== cell2 &&
              candidates[cellIndex] &&
              (candidates[cellIndex].includes(candidates1[0]) ||
               candidates[cellIndex].includes(candidates1[1]))
            );

            if (affectedCells.length > 0) {
              patterns.push({
                type: 'naked-pair',
                name: 'Naked Pair',
                description: `Cells contain only ${candidates1[0]} and ${candidates1[1]}`,
                cells: [cell1, cell2],
                candidates: candidates1,
                affectedCells,
                unit: { type: unitType, cells: unitCells },
                difficulty: 'intermediate'
              });
            }
          }
        }
      }
    }
  }

  return patterns;
}

/**
 * Detect pointing pairs/triples - candidates in a box point to a row/column
 */
function detectPointingPairs(candidates) {
  const patterns = [];

  // Check each box
  for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
    const boxRow = Math.floor(boxIndex / 3);
    const boxCol = boxIndex % 3;
    const boxCells = [];

    for (let r = boxRow * 3; r < (boxRow + 1) * 3; r++) {
      for (let c = boxCol * 3; c < (boxCol + 1) * 3; c++) {
        boxCells.push(r * 9 + c);
      }
    }

    // For each number 1-9
    for (let num = 1; num <= 9; num++) {
      const cellsWithCandidate = boxCells.filter(cellIndex =>
        candidates[cellIndex] && candidates[cellIndex].includes(num)
      );

      if (cellsWithCandidate.length >= 2 && cellsWithCandidate.length <= 3) {
        // Check if all cells are in the same row
        const rows = [...new Set(cellsWithCandidate.map(index => Math.floor(index / 9)))];
        if (rows.length === 1) {
          const row = rows[0];
          const rowCells = Array.from({ length: 9 }, (_, col) => row * 9 + col);
          const affectedCells = rowCells.filter(cellIndex =>
            !boxCells.includes(cellIndex) &&
            candidates[cellIndex] &&
            candidates[cellIndex].includes(num)
          );

          if (affectedCells.length > 0) {
            patterns.push({
              type: 'pointing-pair',
              name: 'Pointing Pair/Triple',
              description: `${num} in box ${boxIndex + 1} points to row ${row + 1}`,
              cells: cellsWithCandidate,
              candidates: [num],
              affectedCells,
              difficulty: 'intermediate'
            });
          }
        }

        // Check if all cells are in the same column
        const cols = [...new Set(cellsWithCandidate.map(index => index % 9))];
        if (cols.length === 1) {
          const col = cols[0];
          const colCells = Array.from({ length: 9 }, (_, row) => row * 9 + col);
          const affectedCells = colCells.filter(cellIndex =>
            !boxCells.includes(cellIndex) &&
            candidates[cellIndex] &&
            candidates[cellIndex].includes(num)
          );

          if (affectedCells.length > 0) {
            patterns.push({
              type: 'pointing-pair',
              name: 'Pointing Pair/Triple',
              description: `${num} in box ${boxIndex + 1} points to column ${col + 1}`,
              cells: cellsWithCandidate,
              candidates: [num],
              affectedCells,
              difficulty: 'intermediate'
            });
          }
        }
      }
    }
  }

  return patterns;
}

/**
 * Main function to detect all patterns
 * @param {object[]} cells - Array of cell objects representing the Sudoku grid
 * @param {object} puzzleState - Current puzzle state object
 * @param {object} enabledPatterns - Configuration object for which patterns to detect
 * @returns {object[]} Array of detected pattern objects
 */
export function detectSudokuPatterns(cells, puzzleState, enabledPatterns = {}) {
  const candidates = generateCandidates(cells, puzzleState);
  const allPatterns = [];

  if (enabledPatterns.nakedSingles !== false) {
    allPatterns.push(...detectNakedSingles(candidates));
  }

  if (enabledPatterns.hiddenSingles !== false) {
    allPatterns.push(...detectHiddenSingles(candidates));
  }

  if (enabledPatterns.nakedPairs !== false) {
    allPatterns.push(...detectNakedPairs(candidates));
  }

  if (enabledPatterns.pointingPairs !== false) {
    allPatterns.push(...detectPointingPairs(candidates));
  }

  return allPatterns;
}

/**
 * Get list of all available patterns
 * @returns {object[]} Array of pattern metadata objects with id, name, description, and difficulty
 */
export function getAvailablePatterns() {
  return [
    {
      id: 'nakedSingles',
      name: 'Naked Singles',
      description: 'Cells with only one possible candidate',
      difficulty: 'beginner'
    },
    {
      id: 'hiddenSingles',
      name: 'Hidden Singles',
      description: 'Only one cell in a unit can contain a specific number',
      difficulty: 'beginner'
    },
    {
      id: 'nakedPairs',
      name: 'Naked Pairs',
      description: 'Two cells in a unit have the same two candidates',
      difficulty: 'intermediate'
    },
    {
      id: 'pointingPairs',
      name: 'Pointing Pairs/Triples',
      description: 'Candidates in a box point to a row or column',
      difficulty: 'intermediate'
    }
  ];
}