const CELLSIZE = 4;
const ROWS = Math.floor(height / CELLSIZE)
const COLS = Math.floor(width / CELLSIZE)

const ALL_OFFSETS = Array(8).fill().map((_, i) => i / 4 * Math.PI).map((a) => {
  const offset = (n) => Math.sign(Math.round(n * 10));
  return {
    row: offset(Math.sin(a)),
    col: offset(Math.cos(a))
  };
});

const emptyGrid = (rows, cols) => Array(rows).fill().map(() => Array(cols).fill(false));

const originalCells = (rows, cols) => {
  const cells = emptyGrid(rows, cols);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (Math.random() < 0.23) {
        cells[y][x] = true
      }
    }
  }
  return cells;
};

const drawCells = (cells) => {
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[0].length; c++) {
      const color = cells[r][c] ? 'green' : 'black';
      drawFilledRect(c * CELLSIZE, r * CELLSIZE, CELLSIZE, CELLSIZE, color);
    }
  }
};

const nextCells = (cells) => {
  const next = emptyGrid(cells.length, cells[0].length)
  for (let i = 0; i < next.length; i++) {
    for (let j = 0; j < next[0].length; j++) {
      const livingNeighbors = countLivingNeighbors(i, j, cells)
      if (cells[i][j]) {
        next[i][j] = 2 <= livingNeighbors && livingNeighbors <= 3;
      } else {
        next[i][j] = livingNeighbors === 3;
      }
    }
  }
  return next;
};

const neighborOffsets = (row, col) => {
  const rowOk = (o) => row === 0 ? o.row >= 0 : row === ROWS - 1 ? o.row <= 0 : true;
  const colOk = (o) => col === 0 ? o.col >= 0 : col === COLS - 1 ? o.col <= 0 : true;
  return ALL_OFFSETS.filter(o => rowOk(o) && colOk(o));
};

const countLivingNeighbors = (i, j, cells) => {
  return neighborOffsets(i, j).reduce((c, o) => cells[i + o.row][j + o.col] ? c + 1 : c, 0);
};

const go = () => {
  drawCells(current);
  current = nextCells(current);
  setTimeout(go, 100);
};

let current = originalCells(ROWS, COLS);
go();