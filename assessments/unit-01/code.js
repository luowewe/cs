// You will use this function in one of the problems. You don't need to change
// it or even worry about how exactly it works.
const emit = (a, b, product) => {
  console.log(`${a} times ${b} is ${product}`);
};

const averageWeight = (weight, items) => {
  return weight / items;
};

const hypotenuse = (a, b) => {
  return Math.sqrt(a ** 2 + b ** 2);
};

const maxRadius = (width, height) => {
  return Math.min(width, height) / 2;
};

const numCircles = (radius, width) => {
  return Math.floor(width / (radius * 2));
};

const offset = (width, figureWidth) => {
  return (width - figureWidth) / 2;
};

const canSleepIn = (weekday, vacation) => {
  return !weekday || vacation;
};

const canGoToProm = (senior, invited, excluded) => {
  return (senior || invited) && !excluded;
};

const getsSpeedingTicket = (mph, grouchy) => {
  return mph > 70 || grouchy && mph > 65;
};

const moreThanTwiceAsLong = (s1, s2) => {
  return s1.length > s2.length * 2;
};

const aFartherThanB = (a, b, c) => {
  return Math.abs(a - c) > Math.abs(b - c);
};

const firstHalf = (s) => {
  return s.substring(0, s.length / 2);
};

const secondHalf = (s) => {
  return s.substring(s.length / 2);
};

const upDown = (s) => {
  return s.toUpperCase() + s.toLowerCase();
};

const everyOther = (s) => {
  return s[0] + s[2] + s[4];
};

const upDownLastCharacter = (s) => {
  return upDown(s[s.length - 1]);
};

const yesIfEven = (n) => {
  if (n % 2 === 0) {
    return 'yes';
  } else {
    return 'no';
  }
};

const countXs = (s) => {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === 'x') {
      count++;
    }
  }
  return count;
};

const timesTable = (n) => {
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      emit(i, j, i * j);
    }
  }
};

const containsX = (s) => {
  for (let i = 0; i < s.length; i++) {
    if (s[i] === 'x') {
      return true;
    }
  }
  return false;
};

const sumSquares = (n) => {
  let sum = 0;
  for (let i = 1; i < n; i++) {
    sum = sum + i ** 2;
  }
  return sum;
};