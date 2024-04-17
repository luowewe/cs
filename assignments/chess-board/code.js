const PIECES = {
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  }
};

const size = Math.min(width, height) * 0.80;

const gui = {
  size: size,
  x: (width - size) / 2,
  y: (height - size) / 2,
};

const xy = (gui, row, col) => [
  gui.x + col * gui.size / 8,
  gui.y + row * gui.size / 8
];

// GUI

const emptyBoard = (gui) => {
  const sq = gui.size / 8;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const [x, y] = xy(gui, i, j);
      const color = (i + j) % 2 === 0 ? 'white' : 'grey';
      drawFilledRect(x, y, sq, sq, color);
    }
  }
  drawRect(gui.x, gui.y, gui.size, gui.size, 'grey', 1);
};

const drawPiece = (gui, piece, rank, file) => {
  const text = PIECES[piece.color][piece.type];
  const sq = gui.size / 8;
  const [x, y] = xy(gui, rank, file);
  drawText(text, x + sq * 0.2, y + sq * 0.75, 'black', gui.size / 8);
};

const drawBoard = (board, gui) => {
  emptyBoard(gui);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece !== null) {
        drawPiece(gui, piece, row, col);
      }
    }
  }
}

// STATE MANIPULATION

const placePiece = (board, piece, row, col) => {
  board[row][col] = piece;
};

const piece = (color, type) => {
  return { color, type };
};

const possibleSquares = (piece) => {
};


// Actual runtime

const board = Array(8).fill().map(() => Array(8).fill(null));

placePiece(board, piece('white', 'king'), 7, 4);
placePiece(board, piece('white', 'queen'), 7, 3);

drawBoard(board, gui);
//drawPiece(WHITE_KING, 7, 4);
//drawPiece(WHITE_QUEEN, 7, 3);