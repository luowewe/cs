const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => a / b;

const mod = (a, b) => a % b;

const average = (ns) => ns.reduce((a, b) => a + b, 0) / ns.length;

const averageOfTwo = (...args) => average(args);

const averageOfThree = (...args) => average(args)

const distance = (a, b) => Math.abs(a - b);

const manhattanDistance = (x1, y1, x2, y2) => {
  const xDist = Math.abs(x1 - x2);
  const yDist = Math.abs(y1 - y2);
  return xDist + yDist;
}

const euclideanDistance = (x1, y1, x2, y2) => 
  Math.sqrt(distance(x1, x2) ** 2 + distance(y1, y2) ** 2);