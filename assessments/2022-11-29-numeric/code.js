const totalEggs = (hard, soft) => {
  return hard + soft;
};

const chocolatesPerPerson = (chocolates, people) => {
  return Math.floor(chocolates / people);
};

const extraChocolates = (chocolates, people) => {
  return chocolates % people;
};

const leftOut = (chocolates, people) => {
  return Math.max(people - chocolates, 0);
};

const probabilityAllHeads = (flips) => {
  return 0.5 ** flips;
};

const futureHour = (now, hours) => {
  return (now + hours) % 24;
};

const presentsBudget = (friends, perPresent) => {
  return friends * perPresent;
};

const perPresent = (budget, presents) => {
  return budget / presents;
};

const wrappingCombos = (paper, ribbons, bows) => {
  return paper * ribbons * bows;
};

const biggestNumber = (digits) => {
  return 10 ** digits - 1;
};