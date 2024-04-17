// Based on Sadie's code.

let current = [];
let next = [];

const gameOfLifeStart = () => {
  for (let j = 0; j < height; j++) {
    current.push([]);
    next.push([]);
    for (let i = 0; i < width; i++) {
      const alive = Math.random() > 0.91;
      current[j].push(alive);
      drawCell(i, j, alive);
      next[j].push(false);
    }
  }
};

const drawCell = (i, j, alive) => {
  drawFilledRect(i, j, 1, 1, alive ? "green" : "black");
};

const neighbors = (i, j) => {
  let count = 0;
  for (let xOffset = -1; xOffset < 2; xOffset++) {
    for (let yOffset = -1; yOffset < 2; yOffset++) {
      const nj = (j + yOffset + height) % height;
      const ni = (i + xOffset + width) % width;
      if (current[nj][ni]) count++;
    }
  }
  return count;
};

const newLife = (nei, i, j) => {
  return nei === 3 || (current[j][i] && nei === 4);
};

const gameOfLife = () => {
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      next[j][i] = newLife(neighbors(i, j), i, j);
      drawCell(i, j, next[j][i]);
    }
  }
  [current, next] = [next, current];
};

gameOfLifeStart();
animate(gameOfLife);
