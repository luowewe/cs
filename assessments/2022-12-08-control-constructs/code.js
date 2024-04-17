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

const emit = (a, b, c) => {
  console.log(a + ' x ' + b + ' = ' + c);
}

const timesTable = (n) => {
  for (let a = 1; a <= n; a++) {
    for (let b = 1; b <= n; b++) {
      emit(a, b, a * b);
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

const sumSquares = (limit) => {
  let sum = 0;
  for (let n = 0; n < limit; n++) {
    sum += n ** 2;
  }
  return sum;
};