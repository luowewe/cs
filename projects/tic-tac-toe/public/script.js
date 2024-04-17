import { setCanvas, drawLine, drawCircle, drawText, width, height } from './graphics.js';

// Get the element object reperesenting the canvas defined in the HTML.
const canvas = document.getElementById('screen')
canvas.width = document.documentElement.offsetWidth * 0.80;
canvas.height = document.documentElement.offsetHeight * 0.80;
setCanvas(canvas);

const boardSize = Math.min(width, height) * 0.75;
const boardLeft = (width - boardSize) / 2;
const boardTop = (height - boardSize) / 2;
const cellSize = boardSize / 3;
const fontSize = boardSize / 3;
const lineEndAdjustment = cellSize * 0.7;

let move = 0;

const board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

const lines = [
  // Rows
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],

  // Cols
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],

  // Diagonals
  [[0, 0], [1, 1], [2, 2]],
  [[2, 0], [1, 1], [0, 2]],
];


const drawBoard = () => {
  const x1 = boardLeft + cellSize;
  const x2 = boardLeft + 2 * cellSize;
  const y1 = boardTop + cellSize;
  const y2 = boardTop + 2 * cellSize;;
  drawLine(x1, boardTop, x1, boardTop + boardSize, 'grey', 2);
  drawLine(x2, boardTop, x2, boardTop + boardSize, 'grey', 2);
  drawLine(boardLeft, y1, boardLeft + boardSize, y1, 'grey', 2);
  drawLine(boardLeft, y2, boardLeft + boardSize, y2, 'grey', 2);
};

const drawMarker = (marker, r, c) => {
  const [x, y] = cellCenter(r, c);
  const nudge = marker === 'O' ? cellSize / 9 : cellSize / 19;
  drawText(marker, x - (fontSize * 0.3 + nudge), y + fontSize * 0.3, 'black', fontSize);
};

const cellCenter = (r, c) => {
  return [
    boardLeft + c * cellSize + cellSize / 2,
    boardTop + r * cellSize + cellSize / 2
  ];
};

const coordinates = (x, y) => {
  return [
    Math.floor((y - boardTop) / cellSize),
    Math.floor((x - boardLeft) / cellSize)
  ];
}

const validCoordinate = (c) => 0 <= c && c < 3;

const validMove = (r, c) => {
  return validCoordinate(r) && validCoordinate(c) && board[r][c] === '';
}

const makeMove = (r, c) => {
  const marker = move % 2 === 0 ? 'X' : 'O';
  drawMarker(marker, r, c);
  board[r][c] = marker;
  move++;
}

const isWinner = () => findWinner() !== null;

const findWinner = () => {
  for (let i = 0; i < lines.length; i++) {
    if (isWinningLine(lines[i])) {
      return lines[i];
    }
  }
  return null;
};

const isWinningLine = (line) => {
  const marker = markerAt(line[0]);
  if (marker !== '') {
    return marker === markerAt(line[1]) && marker === markerAt(line[2]);
  } else {
    return false;
  }
};

const markerAt = (coord) => {
  const [r, c] = coord; // e.g. [0, 0]
  return board[r][c];
};

const drawThreeInARow = (winner) => {
  const [x1, y1] = cellCenter(...winner[0]);
  const [x2, y2] = cellCenter(...winner[2]);

  const dx = Math.sign(x2 - x1) * lineEndAdjustment;
  const dy = Math.sign(y2 - y1) * lineEndAdjustment;

  drawLine(x1 - dx, y1 - dy, x2 + dx, y2 + dy, 'red', 15);
};

canvas.onclick = (e) => {
  const [r, c] = coordinates(e.offsetX, e.offsetY);
  if (!isWinner() && validMove(r, c)) {
    makeMove(r, c);
    const winner = findWinner();
    if (winner !== null) {
      drawThreeInARow(winner);
    }
  }
};


drawBoard();
