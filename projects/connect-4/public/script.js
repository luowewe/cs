const board = Array(6).fill().map(() => Array(7).fill());

const setupBoard = () => {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      const cell = document.createElement('div');
      document.getElementById('grid').append(cell);
      board[r][c] = cell;
    }
  }
}

const placePiece = (r, c, color) => {
  board[r][c].classList.add(color);
}

setupBoard();

placePiece(5, 3, 'red');
