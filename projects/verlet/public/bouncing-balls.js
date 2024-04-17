import { animate } from './animation.js';
import graphics from './graphics.js';
import vector from './vector.js';
import ball from './ball.js';
import line from './line.js';

const canvas = document.getElementById('screen');
canvas.width = document.documentElement.offsetWidth * 0.95;
canvas.height = document.documentElement.offsetHeight * 0.95;

const g = graphics(canvas);
const mid = vector(g.width / 2, g.height / 2);
const radius = (Math.min(g.width, g.height) / 2) * 0.85;
const zero = vector(0, 0);

const topLeft = vector(0, 0);
const bottomLeft = vector(0, g.height);
const topRight = vector(g.width, 0);
const bottomRight = vector(g.width, g.height);

const walls = [
  line(topLeft, topRight),
  line(topLeft, bottomLeft),
  line(bottomLeft, bottomRight),
  line(topRight, bottomRight),
  // Random barricade
  line(vector(g.width * 0.33, g.height * 0.33), vector(g.width * 0.66, g.height * 0.66)),
];

let r = 128;

const rgb = () => `rgb(${r}, 128, 255)`;

const drawBackground = (g) => {
  g.clear();
  g.drawFilledRect(0, 0, g.width, g.height, rgb());
};

const IMMOVABLE_OBJECT = { velocity: vector(0, 0), mass: Infinity };

const collisions = (balls, walls) => {
  ballCollisions(balls);
  wallCollisions(balls, walls);
};

const ballCollisions = (balls) => {
  for (let i = 0; i < balls.length - 1; i++) {
    const b1 = balls[i];
    for (let j = i + 1; j < balls.length; j++) {
      const b2 = balls[j];
      const axis = b1.position.minus(b2.position);
      const dist = axis.length();
      if (dist < b1.radius + b2.radius) {
        collide(b1, b2, axis.normalized(), 1);
      }
    }
  }
};

const wallCollisions = (balls, walls) => {
  for (const b of balls) {
    for (const w of walls) {
      const pointOnWall = w.closestPoint(b.position);
      if (pointOnWall) {
        const axis = b.position.minus(pointOnWall);
        if (axis.length() < b.radius) {
          collide(b, IMMOVABLE_OBJECT, axis.normalized(), 1);
        }
      }
    }
  }
};

const collide = (b1, b2, collisionNormal, elasticity) => {
  const relativeVelocity = b1.velocity.minus(b2.velocity);
  const j = (-(elasticity + 1) * relativeVelocity.dot(collisionNormal)) / (1 / b1.mass + 1 / b2.mass);
  const scaled = collisionNormal.times(j);
  reposition(b1, b1.velocity.plus(scaled.divide(b1.mass)));
  reposition(b2, b2.velocity.minus(scaled.divide(b2.mass)));
};

const reposition = (o, v) => {
  if (o.mass < Infinity) {
    o.position = o.oldPosition.plus(v);
  }
};

const random = (a, b) => {
  const [min, max] = b === undefined ? [0, a] : [a, b];
  return min + Math.random() * (max - min);
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const randomSpawn = (n, walls) => {
  const balls = [];
  for (let i = 0; i < n; i++) {
    const v = vector(random(-1, 1), random(-1, 1));
    while (true) {
      const x = random(0, g.width);
      const y = random(0, g.height);
      const r = random(minSize, maxSize);
      const b = spawn(x, y, v, r);
      if (!balls.some((o) => overlap(b, o)) && !walls.some((w) => onWall(b, w))) {
        balls.push(b);
        break;
      }
    }
  }
  return balls;
};

const spawn = (x, y, v, r) => {
  const start = vector(x, y);
  const prev = start.minus(v);
  return ball(start, prev, zero, r);
};

const overlap = (b1, b2) => {
  return b2.position.minus(b1.position).length() <= b1.radius + b2.radius;
};

const onWall = (b, w) => {
  return w.closestPoint(b.position).minus(b.position).length() <= b.radius;
};

const changeSpeed = (balls, sign) => {
  r = clamp(r + sign * 4, 0, 255);
  balls.forEach((b) => {
    b.accelerate(b.velocity.times(sign * 0.01));
  });
};

const minSize = 20;
const maxSize = 50;
const steps = 8;
const rows = Math.floor(g.height / (maxSize * 4.5));
const cols = Math.floor(g.width / (maxSize * 4.5));

const balls = randomSpawn(40, walls);

// Globally speed up and slow down balls
document.body.onkeydown = (e) => {
  if (e.key === 'ArrowUp') {
    changeSpeed(balls, 1);
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    changeSpeed(balls, -1);
    e.preventDefault();
  }
};

animate((elapsed) => {
  const step = elapsed / steps;
  for (let i = 0; i < steps; i++) {
    collisions(balls, walls);
    balls.forEach((b) => b.updatePosition(step));
  }
  drawBackground(g);
  walls.forEach((w) => w.draw(g));
  balls.forEach((b) => b.draw(g));
});
