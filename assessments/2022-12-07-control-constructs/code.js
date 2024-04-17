////////////////////////////////////////////////////////////////////////
// Pay no attention to the man behind the curtain. These functions are
// ones you will use, some directly, some indirectly from the functions
// you write. You don't need to understand them or change their code
// though if you really want to you can.

/*
 * This one is some particular dark magic. Definitely don't worry about
 * what it's doing.
 */
const hash = (s) => {
  return [...JSON.stringify(s)]
    .reduce((hash, c) => ((hash << 5) + hash) + c.codePointAt(0), 5381);
};

/*
 * Given a number return the next number in a stable but unpredictable sequence.
 */
const nextNumber = (n) => hash(n);

/*
 * An arbitrary predicate on numbers you will use in one function.
 */
const isLeet = (n) => n % 1337 === 0;

/*
 * Return a random number between 0, inclusive, and 10,000, exclusive.
 */
const random10k = () => Math.floor(Math.random() * 10000);

/*
 * Record an okay object.
 */
const recordOk = (x) => {
  log(`OK: ${x}`);
}

/*
 * Record a not-okay object.
 */
const recordNotOk = (x) => {
  log(`NOT OK: ${x}`);
}

/*
 * Record a meh object.
 */
const recordMeh = (x) => {
  log(`MEH: ${x}`);
}

/*
 * Return true if the argument is "okay". This implementation treats roughly
 * half of all possible values as okay and the other half as not okay. Which are
 * which is essentially random but is stable.
 */
const isOk = (x) => hash(JSON.stringify(x)) % 2 == 0;

/*
 * Return true if the argument is "meh".
 */
const isMeh = (x) => !isOk(x) && hash(JSON.stringify(x)) % 3 == 0;

/*
 * Log the object via console.log.
 */
const log = (x) => {
  console.log(x);
}

/*
 * Record a pair.
 */
const pair = (a, b) => {
  log(`pair: ${a},${b}`);
};


////////////////////////////////////////////////////////////////////////
// Write your code here ...


const logIfOk = (x) => {
  if (isOk(x)) {
    log(x);
  }
};

const firstOk = (limit) => {
  for (let n = 0; n < limit; n++) {
    if (isOk(n)) {
      return n;
    }
  }
};

const timeToLeet = () => {
  let count = 0;
  while (!isLeet(random10k())) {
    count++;
  }
  return count;
};

const classify = (x) => {
  if (isOk(x)) {
    recordOk(x);
  } else {
    recordNotOk(x);
  }
};

const threewayClassify = (x) => {
  if (isOk(x)) {
    recordOk(x);
  } else if (isMeh(x)) {
    recordMeh(x);
  } else {
    recordNotOk(x);
  }
};

const sumOfSquares = (n) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum = sum + i ** 2;
  }
  return sum;
};

const pairs = (n) => {
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      pair(i, j);
    }
  }
};

