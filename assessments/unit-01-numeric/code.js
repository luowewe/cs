// Some constants you will need. No need to do anything to these
const JUPITER_GRAVITY = 24.79;
const EARTH_GRAVITY = 9.8;
const G = 6.6743e-11;

const itemsLeftOver = (people, items) => {
  return items % people;
};

const areaOfCircle = (r) => {
  return Math.PI * r ** 2;
};

const volumeOfCube = (s) => {
  return s ** 3;
};

const populationGrowth = (population, growth) => {
  return population * growth;
};

const earnedRunAverage = (earnedRuns, inningsPitched) => {
  return (earnedRuns / inningsPitched) * 9;
};

const valueOfJewels = (diamonds, diamondsPrice, emeralds, emeraldsPrice) => {
  return diamonds * diamondsPrice + emeralds * emeraldsPrice;
};

const payWithOvertime = (hours, hourlyRate, overtimeRate) => {
  const regular = Math.min(hours, 8);
  const overtime = hours - regular;
  return regular * hourlyRate + overtime * overtimeRate;
};

const firstClassPostage = (oz) => {
  return 60 + Math.ceil(oz - 1) * 24; 
};

const weightOnJupiter = (kgOnEarth) => {
  kgOnEarth * (JUPITER_GRAVITY / EARTH_GRAVITY);
};

const gravity = (m1, m2, distance) => {
  return G * (m1 * m2) / distance ** 2;
};