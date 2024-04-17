// Functions for getting various kinds of random values.

/*
 * Choose a random element from elements.
 */
const choose = (elements) => elements[Math.floor(Math.random() * elements.length)];

/*
 * Return a random integer on half-open interval [start, end)
 */
const randomInt = (start, end) => start + Math.floor(Math.random() * (end - start));

/*
 * Return a shuffled version of an array without destroying the original.
 */
const shuffled = (orig) => {
  const array = [ ...orig ];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ array[i], array[j] ] = [ array[j], array[i] ];
  }
  return array;
};

/*
 * Flip a coin.
 */
const n = (n) => Math.floor(Math.random() * n);

const p = (p) => Math.random() < p;

const flip = () => p(0.5);

// FIXME: implement reservoir sample.
const sample = (items, num) => (items.length <= num ? items : shuffled(items).slice(0, num));

/*
 * Return a thunk that returns a random element of scored weighted by the value
 * of the given property.
 */
const randomizer = (scored, property) => {
  const n = scored.length;
  const probs = Array(n).fill();
  const aliases = Array(n).fill();
  fillAliasTableFromScores(scored.map(c => c[property]), probs, aliases);
  const randomIndex = indexRandomizer(probs, aliases);
  return () => scored[randomIndex()];
};

const randomIndex = (values) => {
  const n = values.length;
  const probs = Array(n).fill();
  const aliases = Array(n).fill();
  fillAliasTableFromScores(values, probs, aliases);
  return indexRandomizer(probs, aliases);
};

const indexRandomizer = (probs, aliases) => {
  const n = probs.length;
  return () => {
    const i = Math.floor(Math.random() * n);
    return Math.random() < probs[i] ? i : aliases[i];
  };
};

const fillAliasTableFromScores = (scores, probs, aliases) => {
  fillAliasTable(probabilities(scores), probs, aliases);
}

const fillAliasTable = (probabilities, probs, aliases) => {
  // Given an array of probabilities returns a function that
  // returns a random index into the array weighted by the
  // probabilities in the array.
  //
  // See https://www.keithschwarz.com/darts-dice-coins/
  const p = probabilities.map((x) => x * probabilities.length);
  const small = [];
  const large = [];
  for (let i = 0; i < probabilities.length; i++) {
    (p[i] < 1 ? small : large).push(i);
  }
  while (small.length > 0 && large.length > 0) {
    const l = small.pop();
    const g = large.pop();
    probs[l] = p[l];
    aliases[l] = g;
    p[g] = p[g] + p[l] - 1;
    (p[g] < 1 ? small : large).push(g);
  }
  while (large.length > 0) {
    probs[large.pop()] = 1;
  }
  while (small.length > 0) {
    probs[small.pop()] = 1;
  }
};

const probabilities = (scores) => {
  const total = scores.reduce((acc, s) => acc + s, 0);
  return scores.map((s) => s / total);
};


export { choose, randomInt, shuffled, randomizer, randomIndex, indexRandomizer, fillAliasTable, fillAliasTableFromScores, flip, n, p, sample };
