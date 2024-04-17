/*
 * 2d-point
 */
const point =  (x, y) => ({ x, y });

/*
 * RGBA color.
 */
const color = (r, g, b, a) => ({ r, g, b, a });

/*
 * Colored triangle.
 */
const triangle = (a, b, c, color) => ({ a, b, c, color });

/*
 * Color to CSS rgba call.
 */
const rgba = ({r, g, b, a}) => `rgba(${r}, ${g}, ${b}, ${a / 255})`;


/*
 * Draw a single triangle.
 */
const drawTriangle = (triangle, ctx) => {
  const { a, b, c, color } = triangle;
  ctx.fillStyle = rgba(color);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(a.x, a.y);
  ctx.fill();
};

/*
 * Draw an array of triangles.
 */
const drawTriangles = (triangles, ctx, width, height) => {
  ctx.clearRect(0, 0, width, height);
  triangles.forEach(t => drawTriangle(t, ctx));
};

/*
 * Translate rgba values we get from ImageData into RGB triples.
 */
const rgb = (data, idx) => {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  const a = data[idx + 3];
  return [r, g, b].map((v) => opaquify(v, a));
};

/*
 * Translate value at a given alpha to the corresponding value at full opacity.
 * Loosely based on code from https://stackoverflow.com/a/11615135.
 */
const opaquify = (v, a) => Math.round((v * a) / 255 + (255 - a));

export { point, color, triangle, rgba, rgb, drawTriangle, drawTriangles };
