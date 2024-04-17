const needHeavyCoat = (outside, cold) => {
  return outside && cold;
};

const needSunscreen = (beach, skiing) => {
  return beach || skiing;
};

const needMittens = (outside, warm) => {
  return outside && !warm;
};

const isisVenomous = (striped, blueHeaded) => {
  return striped || !blueHeaded;
};

const okaySpeed = (limit, speed) => {
  return Math.abs(speed - limit) <= 10;
};

const twiceAsExpensive = (item1, item2) => {
  return item1 > item2 * 2;
};

const winningRecord = (wins, losses, ties) => {
  return wins > losses + ties;
};

const isMagicNumber = (n) => {
  // 42 the answer to life the universe and everything
  // 17 is "the most random number" according to MIT lore.
  return n === 42 || n === 17;
};