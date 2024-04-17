const randomRGB = () =>
  Array(3)
    .fill()
    .map(() => Math.floor(Math.random() * 255));

const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`;

document.documentElement.onclick = (e) => {
  const [r, g, b] = randomRGB();
  document.documentElement.style.background = rgb(r, g, b);
  document.documentElement.style.color = rgb(255 - r, 255 - g, 255 - b);
};
