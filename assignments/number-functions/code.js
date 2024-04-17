const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => a / b;

const mod = (a, b) => a % b;

const averageOfTwo = (a, b) => (a + b) / 2;

const averageOfThree = (a, b, c) => (a + b + c) / 3;

const distance = (a, b) => Math.abs(a - b);

const manhattanDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const euclideanDistance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);