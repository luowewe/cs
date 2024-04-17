/*
 * Random number from 0 to n, exclusive.
 */
const randomInt = (n) => Math.floor(Math.random() * n);

/*
 * Random sign (-1 or 1)
 */
const randomSign = () => Math.random() < 0.5 ? -1 : 1;

/*
 * Clamp a value between min and max.
 */
const clamp = (n, min, max) => (n < min ? min : n > max ? max : n);

/*
 * Clamp a value to a given magnitude.
 */
const clampMagnitude = (n, magnitude) => clamp(n, -magnitude, magnitude);

/*
 * Average of a list of numbers.
 */
const average = (ns) => ns.reduce((acc, n) => acc + n, 0) / ns.length;

/*
 * Zero point/vector.
 */
const ZERO = { x: 0, y: 0 };

/*
 * Vector in x,y form with a given magnitude and direction.
 */
const vector = (magnitude, direction) => {
  return {
    x: magnitude * Math.cos(direction),
    y: magnitude * Math.sin(direction),
  };
};

/*
 * Sum a list of vectors.
 */
const sumVectors = (vs) => {
  const sum = { x: 0, y: 0 };
  vs.forEach(v => {
    sum.x += v.x;
    sum.y += v.y;
  });
  return sum;
};

/*
 * TAU is better that PI.
 */
const TAU = Math.PI * 2;

/*
 * Angle of the line from p1 to p2, expressed in radians from from 0 to TAU.
 */
const angle = (p1, p2) => (TAU + Math.atan2(p2.y - p1.y, p2.x - p1.x)) % TAU;

/*
 * Distance between two points with x and y properties.
 */
const distance = (b1, b2) => Math.hypot(b1.x - b2.x, b1.y - b2.y);


const distanceSquared = (b1, b2) => (b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2;


/*
 * The distance on the x-axis of moving a total distance at a given angle.
 */
const xDistance = (angle, distance) => distance * Math.cos(angle);

/*
 * The distance on the y-axis of moving a total distance at a given angle.
 */
const yDistance = (angle, distance) => distance * Math.sin(angle);


export {
  TAU,
  ZERO,
  angle,
  average,
  clamp,
  clampMagnitude,
  distance,
  distanceSquared,
  randomInt,
  randomSign,
  sumVectors,
  vector,
  xDistance,
  yDistance,
};
