const randomRGB = () => Array(3).fill().map(() => Math.floor(Math.random() * 255));

const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`;

const setRandomColor = (element) => {
  const [ r, g, b ] = randomRGB();
  element.style.background = rgb(r, g, b);
  element.style.color = rgb(255 - r, 255 - g, 255 - b);
};

const makeGrid = (size) => {
  const grid = document.querySelector('#grid');
  grid.replaceChildren();

  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size ** 2; i++) {
    const div = document.createElement('div');
    div.classList.add('box');
    setRandomColor(div);
    div.onclick = (e) => setRandomColor(e.target);
    grid.append(div);
  }
};

makeGrid(5);

document.querySelector('button').onclick = (e) => {
  makeGrid(3 + Math.floor(Math.random() * 30));
  grid.querySelectorAll('div').forEach((div) => {
    setRandomColor(div);
  });
};
