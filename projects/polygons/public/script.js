const TAU = Math.PI * 2;

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const center = { x: width / 2, y: height / 2 };

ctx.strokeStyle = 'black';
ctx.lineWidth = 1;

/*
 * Draw an n-sided polygon at a given center with one vertex at v1.
 */
const drawPolygon = (sides, center, v1) => {
  const r = Math.hypot(center.x - v1.x, center.y - v1.y);
  const initialAngle = angle(center, v1);
  const step = TAU / sides;

  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  for (let i = 0; i < sides; i++) {
    const a = initialAngle + i * step;
    const x = center.x + r * Math.cos(a);
    const y = center.y + r * Math.sin(a);
    ctx.lineTo(x, y);
  };
  ctx.closePath();
  ctx.stroke();
};

/*
 * Get the angle in radians between 0 and TAU around the circle
 * at the given center and a point on the circle.
 */
const angle = (center, point) => {
  return (TAU + Math.atan2(point.y - center.y, point.x - center.x)) % TAU;
}

const offset = (p, dx, dy) => ({x: p.x + dx, y: p.y + dy });

drawPolygon(4, center, { x: center.x + 10, y: center.y + 30 });
drawPolygon(7, offset(center, 20, 30), offset(center, 30, 80));
drawPolygon(11, {x: 150, y: 150}, {x: 50, y: 50});
