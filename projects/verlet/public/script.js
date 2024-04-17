// Based on explanation of Verlet integration in https://www.youtube.com/watch?v=lS_qeBy3aQI

import { animate } from './animation.js';
import graphics from './graphics.js';
import vector from './vector.js';
import ball from './ball.js';

const canvas = document.getElementById('screen');
canvas.width = document.documentElement.offsetWidth * 0.95;
canvas.height = document.documentElement.offsetHeight * 0.95;

const g = graphics(canvas);
const mid = vector(g.width / 2, g.height / 2);
const gravity = vector(0, 0.0005);
const radius = (Math.min(g.width, g.height) / 2) * 0.85;
const zero = vector(0, 0);

const drawBackground = (g) => {
  g.clear();
  g.drawFilledRect(0, 0, g.width, g.height, '#888');
  g.drawFilledCircle(mid.x, mid.y, radius, 'white');
};

const constrain = (b) => {
  const toObj = b.position.minus(mid);
  const dist = toObj.length();
  if (dist > radius - b.radius) {
    const n = toObj.divide(dist);
    const constrainedPosition = mid.plus(n.times(radius - b.radius));
    b.position = constrainedPosition;
  }
};

const collisions = () => {
  for (let i = 0; i < balls.length - 1; i++) {
    const b1 = balls[i];
    for (let j = i + 1; j < balls.length; j++) {
      const b2 = balls[j];
      const axis = b1.position.minus(b2.position);
      const dist = axis.length();
      if (dist < b1.radius + b2.radius) {
        const n = axis.divide(dist);
        const bounce = n.times((b1.radius + b2.radius - dist) * 0.5);
        b1.position = b1.position.plus(bounce);
        b2.position = b2.position.minus(bounce);
      }
    }
  }
};

const random = (a, b) => {
  const [min, max] = b === undefined ? [0, a] : [a, b];
  return min + Math.random() * (max - min);
};

const spawner = (x, y, freq, balls) => {
  const r = 0.2;
  let since = 0;
  return (elapsed) => {
    since += elapsed;
    if (since > freq) {
      const start = vector(x, y);
      const velocity = vector(random(-r, r), -random(2 * r));
      const prev = start.minus(velocity.times(elapsed));
      balls.push(ball(start, prev, zero, Math.floor(5 + Math.random() * 10)));
      since = 0;
    }
  };
};

const balls = [];
const spawners = [
  spawner(mid.x, mid.y, 500, balls),
  //spawner(mid.x + 100, mid.y, 250, balls),
  //spawner(mid.x - 200, mid.y - 100, 250, balls)
];

const steps = 8;

animate((elapsed) => {
  const step = elapsed / steps;
  for (let i = 0; i < steps; i++) {
    spawners.forEach((s) => s(step));
    balls.forEach((b) => b.accelerate(gravity));
    balls.forEach((b) => constrain(b));
    collisions();
    balls.forEach((b) => b.updatePosition(step));
  }
  drawBackground(g);
  balls.forEach((b) => b.draw(g));
});
