
const emptyBoard = () =>
  Array.from({ length: 9 }, () => Array(9).fill(0));

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateFullBoard() {
  const board = emptyBoard();

  function fill() {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num of nums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (fill()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fill();
  return board;
}

function copyBoard(board) {
  return board.map((row) => row.slice());
}

function countSolutions(board, limit = 2) {
  let count = 0;

  function backtrack() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (backtrack()) {
                count++;
                if (count >= limit) return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return false;
  }

  backtrack();
  return count;
}

function generatePuzzle(difficulty) {
  const fullBoard = generateFullBoard();
  const puzzle = copyBoard(fullBoard);

  let attempts = 0;
  let maxRemoved =
    difficulty === "easy" ? 35 : difficulty === "medium" ? 45 : 55;
  while (attempts < maxRemoved) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      const temp = puzzle[row][col];
      puzzle[row][col] = 0;

      const boardCopy = copyBoard(puzzle);
      if (countSolutions(boardCopy) !== 1) {
        puzzle[row][col] = temp; // revert
      } else {
        attempts++;
      }
    }
  }

  return { puzzle, solution: fullBoard };
}

export { generatePuzzle}


