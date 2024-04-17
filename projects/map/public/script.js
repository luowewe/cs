const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const r = 10;

const cities = Array(200).fill().map(() => ({
  x: r + Math.random() * (width - 2 * r) ,
  y: r + Math.random() * (height - 2 * r)
}));

const drawLines = (cities) => {
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(cities[0].x, cities[0].y);
  for (let i = 1; i < cities.length + 1; i++) {
    ctx.lineTo(cities[i % cities.length].x, cities[i % cities.length].y);
  }
  ctx.stroke()
};

const drawCircles = (cities) => {
  for (let i = 0; i < cities.length; i++) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.ellipse(cities[i].x, cities[i].y, r, r, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
};

const draw = (cities) => {
  drawLines(cities);
  drawCircles(cities);
};

draw(cities);
