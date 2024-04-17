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
}
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
  const [r1, c1] = winner[0];
  const [r2, c2] = winner[winner.length - 1];

  const [x1, y1] = cellCenter(r1, c1);
  const [x2, y2] = cellCenter(r2, c2);

  let adjX1 = x1;
  let adjX2 = x2;
  let adjY1 = y1;
  let adjY2 = y2;

  if (y1 === y2 || x1 !== x2) {
    adjX1 -= lineEndAdjustment;
    adjX2 += lineEndAdjustment;
  }

  if (x1 === x2 || y1 !== y2) {
    const slope = y1 < y2 ? 1 : -1;
    adjY1 -= (slope * lineEndAdjustment);
    adjY2 += (slope * lineEndAdjustment);
  }

  drawLine(adjX1, adjY1, adjX2, adjY2, 'red', 15);
};

registerOnclick((x, y) => {
  const [r, c] = coordinates(x, y);
  if (!isWinner() && validMove(r, c)) {
    makeMove(r, c);
    const winner = findWinner();
    if (winner !== null) {
      drawThreeInARow(winner);
    }
  }
});


drawBoard();