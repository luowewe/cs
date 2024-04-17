/*
 * You will need this function for some of the problems. It returns a random
 * number between 0, inclusive, and n, exclusive. Thus rand(3) could possibly
 * return 0, 1, or 2 but will not return 3.
 */
const rand = (n) => Math.floor(Math.random() * n);

// Write your code here. Remember that you get partial credit for a
// syntactically correct function skeleton and more credit for a skeleton with a
// reasonable argument list. To get full credit you need to write a correct
// function but you can get partial credit for a function that is basically
// correct even if contains small mistakes.

const firstHalf = (s) => s.substring(0, s.length / 2);

const secondHalf = (s) => s.substring(s.length / 2);

const upDown = (s) => s.toUpperCase() + s.toLowerCase();

const firstFewEveryOther = (s) => s[0] + s[2] + s[4];

const upDownLastCharacter = (s) => upDown(s[s.length - 1]);

const firstAndLast = (s) => s[0] + s[s.length - 1];

const swapFrontAndBack = (s) => secondHalf(s) + firstHalf(s);

const simplePigLatin = (word, v) => word.substring(v) + word.substring(0, v) + 'ay';

const randomCharacter = (s) => s[rand(s.length)];

const randomCharacterUpDown = (s) => upDown(randomCharacter(s));

const isAllUpperCase = (s) => s.toUpperCase() === s;

const sameIgnoringCase = (s1, s2) => s1.toUpperCase() === s2.toUpperCase();

const firstName = (name) => name.substring(0, name.indexOf(' '));

const lastName = (name) => name.substring(name.indexOf(' ') + 1);

const initials = (name) => name[0] + name[name.indexOf(' ') + 1];