/*
 * You will need this function for some of the problems. It returns a random
 * number between 0, inclusive, and n, exclusive. Thus rand(3) could possibly
 * return 0, 1, or 2 but will not return 3.
 */
const rand = (n) => Math.floor(Math.random() * n);

const fireAlarm = (pulled, smoke, drill) => {
  return pulled || smoke || drill;
};

const canBePresident = (age, naturalBorn, yearsInUS) => {
  return age >= 35 && naturalBorn && yearsInUS >= 14;
};

const willSeeTweet = (followsTweeter, followsRetweeter, tweeterBlocked) => {
  return (followsTweeter || followsRetweeter) && !tweeterBlocked;
};

const evenGreaterThanZero = (n) => {
  return n > 0 && n % 2 === 0;
};

const isLeapYear = (year) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

const firstAndLast = (s) => {
  return s[0] + s[s.length - 1];
};

const swapFrontAndBack = (s) => {
  return s.substring(s.length / 2) + s.substring(0, s.length / 2);
};

const simplePigLatin = (s, firstVowel) => {
  return s.substring(firstVowel) + s.substring(0, firstVowel) + 'ay';
};

const randomCharacter = (s) => {
  return s[rand(s.length)];
};

const randomCharacterUpDown = (s) => {
  const i = rand(s.length);
  return s[i].toUpperCase() + s[i].toLowerCase();
};

const isAllUpperCase = (s) => {
  return s === s.toUpperCase();
};

const sameIgnoringCase = (s1, s2) => {
  return s1.toLowerCase() === s2.toLowerCase();
};