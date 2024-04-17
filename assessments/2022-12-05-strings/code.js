const upToX = (s) => {
  return s.substring(0, s.indexOf('x'));
};

const charactersAround = (s, i) => {
  return s[i - 1] + s[i + 1];
};

const middle = (s) => {
  return s.substring(s.length * 0.25, s.length * 0.75);
};

const pair = (s1, s2) => {
  return s1 + ' and ' + s2;
};

const containsX = (s) => {
  return s.indexOf('x') !== -1;
};

const slug = (s1, s2, s3) => {
  return (s1 + '-' + s2 + '-' + s3).toLowerCase();
};

const capitalize = (s) => {
  return s[0].toUpperCase() + s.substring(1).toLowerCase();
};

const capitalizeName = (name) => {
  const space = name.indexOf(' ');
  return capitalize(name.substring(0, space)) + ' ' + capitalize(name.substring(space + 1));
};