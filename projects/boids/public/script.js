import { setCanvas, drawTriangle, drawCircle, clear, width, height, animate } from './graphics.js';
import { TAU, ZERO, randomInt, randomSign, clamp, clampMagnitude, distance, distanceSquared, average, sumVectors, angle, vector } from './math.js';

// This has to come early so graphics width and height are set before we use them.
// Should really reorganize this, probably by totally rejiggering graphics.js

const canvas = document.getElementById('screen');
canvas.width = document.documentElement.offsetWidth * 0.95;
canvas.height = document.documentElement.offsetHeight * 0.95;
setCanvas(canvas);

////////////////////////////////////////////////////////////////
// Parameters

const SIZE = 5;
const SPEED_LIMIT = 20;
const WALL_REPULSION = 100;
const BOID_REPULSION = 50;
const NEARBY_RADIUS = SIZE * 10;
const NEARBY_RADIUS_SQUARED = NEARBY_RADIUS ** 2;
const MAX_RANDOM_TURN = TAU / 20;
const RANDOM_TURN_FACTOR = 0.1;
const ANGLE_OF_VISION = TAU * 0.3;
const DRAW_CIRCLE = false;

////////////////////////////////////////////////////////////////
// Boid functions

const boid = (x, y, dx, dy) => {
  const b = { x, y, dx, dy };
  b.direction = direction(b);
  return b;
};

const speed = (boid) => Math.hypot(boid.dx, boid.dy);

const direction = (boid) => angle(ZERO, { x: boid.dx, y: boid.dy });

const setVelocity = (b, v) => {
  b.dx = v.dx;
  b.dy = v.dy;
  b.direction = direction(v);
};

const randomBoid = () => {
  return boid(
    randomInt(width),
    randomInt(height),
    (1 + randomInt(2)) * randomSign(),
    (1 + randomInt(2)) * randomSign());
};

const isNeighbor = (boid, other) => {
  return boid !== other && isClose(boid, other) && canSee(boid, other);
};

const isClose = (a, b) => distanceSquared(a, b) < NEARBY_RADIUS_SQUARED;

const canSee = (boid, other) => {
  const theta = Math.abs(boid.direction - angle(boid, other));
  return Math.min(theta, TAU - theta) < ANGLE_OF_VISION;
};

const neighbors = (boid, grid) => {
  const ns = [];
  for (const cell of neighboringGridCells(boid, grid)) {
    for (const other of cell) {
      if (isNeighbor(boid, other)) {
        ns.push(other);
      }
    }
  }
  return ns;
};

const center = (boids) => {
  return {
    x: average(boids.map(b => b.x)),
    y: average(boids.map(b => b.y))
  };
}

const drawBoid = (boid) => {
  // A trangle with center at center and nose pointing in the right direction.
  const d = boid.direction;
  const x = 0.6;
  const leftTail = sumVectors([boid, vector(SIZE, (d + TAU / 2 - x) % TAU)])
  const rightTail = sumVectors([boid, vector(SIZE, (d + TAU / 2 + x) % TAU)]);
  const nose = sumVectors([boid, vector(SIZE, d)]);

  drawTriangle(leftTail.x, leftTail.y, rightTail.x, rightTail.y, nose.x, nose.y, 'black');

  if (DRAW_CIRCLE && boid === boids[0]) {
    drawCircle(boid.x, boid.y, NEARBY_RADIUS, 'blue');
  }
};

////////////////////////////////////////////////////////////////
// Simulation machinery

const updatePosition = (b, elapsed, grid) => {
  b.x = clamp(b.x + 10 * b.dx / elapsed, 0, width);
  b.y = clamp(b.y + 10 * b.dy / elapsed, 0, height);
  addToGrid(b, grid);
};

const updateVelocities = (boids, forces, grid) => {
  // Get all new velocities instantaneously, i.e. compute the new velocity of
  // all boids based on the current state of all other boids and *then* update
  // them all.
  const updated = boids.map(b => newVelocity(b, neighbors(b, grid), forces));
  boids.forEach((b, i) => setVelocity(b, updated[i]));
};

const newVelocity = (b, nearby, forces) => {
  const { x, y } = sumVectors(forces.map(f => f(b, nearby)));
  const target = { dx: b.dx + x, dy: b.dy + y };
  const s = speed(b);
  const ds = speed(target) - s;
  const r = vector(clampMagnitude(s + ds * 0.5, SPEED_LIMIT), direction(target));
  return { dx: r.x, dy: r.y };
};

////////////////////////////////////////////////////////////////
// Forces pushing the boids around -- we compute each force separately, sum the
// vectors and then apply them with some clamping on the speed.

/*
 * Randomly speed up or slow down.
 */
const randomSpeedChange = (b) => {
  const amt = Math.random() - 0.5;
  return {
    x: b.dx * amt,
    y: b.dy * amt,
  };
};

/*
 * Randomly turn.
 */
const randomTurn = (b) => {
  const amt = Math.floor(Math.random() * MAX_RANDOM_TURN) * randomSign();
  return vector(speed(b) * RANDOM_TURN_FACTOR, b.direction + amt);
};

/*
 * Stay away from the walls.
 */
const wallRepulsion = (b) => {
  const dx = WALL_REPULSION * (1 / b.x) - (1 / (width - b.x));
  const dy = WALL_REPULSION * (1 / b.y) - (1 / (height - b.y));
  return {
    x: clampMagnitude(dx, WALL_REPULSION),
    y: clampMagnitude(dy, WALL_REPULSION),
  };
};

/*
 * Head toward the center of mass of neighbors.
 */
const cohesion = (boid, nearby) => {
  if (nearby.length === 0) {
    return ZERO;
  } else {
    return vector(speed(boid), angle(boid, center(nearby)));
  }
};

/*
 * Don't get too close to neighbors.
 */
const repulsion = (boid, nearby) => {
  if (nearby.length === 0) {
    return ZERO;
  } else {
    return sumVectors(nearby.map(n => vector(BOID_REPULSION / distance(n, boid), angle(n, boid))));
  }
};

/*
 * Match speed and direction of neighbors.
 */
const matching = (boid, nearby) => {
  if (nearby.length === 0) {
    return ZERO;
  } else {
    return {
      x: average(nearby.map(n => n.dx)),
      y: average(nearby.map(n => n.dy)),
    };
  }
};

////////////////////////////////////////////////////////////////
// Grid for neighbor eficiency

const GRID_SIZE = NEARBY_RADIUS;
const gridRows = Math.ceil(height / GRID_SIZE)
const gridColumns = Math.ceil(width / GRID_SIZE);

const row = (y) => Math.floor(y / GRID_SIZE);
const column = (x) => Math.floor(x / GRID_SIZE);

const emptyGrid = () => {
  return Array(gridRows).fill().map(() => Array(gridColumns).fill().map(() => []));
};

const addToGrid = (boid, grid) => {
  if (!grid[row(boid.y)]) debugger;
  const cell = grid[row(boid.y)][column(boid.x)];
  if (!cell) debugger;
  cell.push(boid);
};

const neighboringGridCells = (boid, grid) => {
  const { x, y } = boid;
  const r = row(y);
  const c = column(x);

  const cells = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const r1 = r + i;
      if (0 <= r1 && r1 < gridRows) {
        const c1 = c + j;
        if (0 <= c1 && c1 < gridColumns) {
          cells.push(grid[r1][c1]);
        }
      }
    }
  }
  return cells;
};

const boids = Array(2500).fill().map(randomBoid);
const forces = [
  randomSpeedChange,
  randomTurn,
  wallRepulsion,
  cohesion,
  repulsion,
  matching,
];

animate((elapsed) => {
  const grid = emptyGrid();
  boids.forEach(b => updatePosition(b, elapsed, grid));
  clear();
  boids.forEach(b => drawBoid(b));
  let x;
  if (x !== void 0) {
    updateVelocities(boids, forces.slice(0,x), grid);
  } else {
    updateVelocities(boids, forces.slice(0,x), grid);
  }
});
