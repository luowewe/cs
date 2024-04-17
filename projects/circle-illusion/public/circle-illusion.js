import { drawCircle, drawLine, animate, width, height, setCanvas, clear, drawFilledCircle } from './graphics.js';

setCanvas(document.getElementById('screen'));

const MILLIS_PER_PASS = 2500;
const ORDER = [0, 4, 2, 6, 3, 7, 5, 1];

const sections = ORDER.length * 2;
const timeGap = MILLIS_PER_PASS / sections;
const midX = width / 2;
const midY = height / 2;
const r = Math.min(midX, midY) - 5;

const drawFrame = (time) => {
  clear();
  drawCircle(midX, midY, r, '#bbb');

  let t = time % (sections * MILLIS_PER_PASS * 1.5);

  for (let i = 0; i < ORDER.length; i++) {
    if (t > i * MILLIS_PER_PASS * 2) {
      ballAndLine(2 * Math.PI * ORDER[i] / sections, t, ORDER[i] * timeGap);
    }
  }
}

const ballAndLine = (theta, time, startOffset) => {
  let x1 = xOnCircle(theta);
  let y1 = yOnCircle(theta);
  let x2 = xOnCircle(theta + Math.PI);
  let y2 = yOnCircle(theta + Math.PI);
  drawBallAndLine(x1, y1, x2, y2, time, startOffset);
}

const xOnCircle = (theta) => midX + Math.cos(theta) * r;

const yOnCircle = (theta) => midY + Math.sin(theta) * r;

const drawBallAndLine = (x1, y1, x2, y2, time, startOffset) => {
  drawLine(x1, y1, x2, y2, '#bbb');
  drawBall(x1, y1, x2, y2, time + startOffset, 'blue');
};

const drawBall = (x1, y1, x2, y2, time, color) => {
  const d = distance(x1, y1, x2, y2);
  const p = fromStart(d, time, MILLIS_PER_PASS);
  const x = x1 + p / d * (x2 - x1);
  const y = y1 + p / d * (y2 - y1);
  drawFilledCircle(x, y, 10, color);
};

const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

const fromStart = (d, time, ms) => {
  // We want to go across and back in ms milliseconds so we need to
  // cycle the arguments to cos() from 0 to 2pi in that many millis
  const i = time * (Math.PI * 2 / ms);
  return (1 - Math.cos(i)) / 2 * d;
}


animate(drawFrame);
