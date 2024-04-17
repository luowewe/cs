const cx = width / 2;
const cy = height / 2;

/* 
 * The main function F is used to iterate from z_0 = 0 via the
 * recurrence relation: z_n+1 = z_n ^ 2 + c
 */
const f = (z, c) => square(z).map((n, i) => n + c[i]);

/*
 * Square a complex number.
 */
const square = ([a, b]) => [a ** 2 - b ** 2, 2 * a * b];

/*
 * Translate graphical coordinates to zoomed coordinates with cx, cy in
 * the center of the drawing area.
 */
const coord = (gx, gy, x, y, zoom) => [adjust(gx, cx, zoom, x), adjust(gy, cy, zoom, y)];

const adjust = (g, c, zoom, offset) => ((g - c) / zoom) + offset;


/*
 * How fast (if at all) does the iteration of f head toward positive
 * or negative infinity?
 */
const escapeVelocity = (c, iterations) => {
  let z = [0, 0];
  for (let i = 0; i < iterations; i++) {
    z = f(z, c);
    if (z.some((x) => !isFinite(x))) {
      return i;
    }
  }
  return 0;
};

/*
 * Translate a number from 0 to 1 into an RGB color. Bias toward blue.
 */
const color = (n) => {
  const c = Math.round(n * (2 ** 24 - 1));
  const [r, g, b] = Array(3).fill().map((_, i) => (c >> ((2 - i) * 8)) & 0xff);
  return `rgb(${r}, ${b}, ${g})`;
};

/*
 * Draw the Mandelbrot set using a given number of iterations
 * with point cx, cy at the center of the drawing area and zoomed
 * by the given amount.  
 */
const drawMandelbrot = (iterations, x, y, zoom) => {
  const start = performance.now();
  for (let gx = 0; gx < width; gx++) {
    for (let gy = 0; gy < height; gy++) {
      const e = escapeVelocity(coord(gx, gy, x, y, zoom), iterations);
      const c = e === 0 ? 'black' : color(e / iterations);
      drawFilledRect(gx, gy, 1, 1, c);
    }
  }
  const t = Math.round(performance.now() - start);
  console.log(`Rendered in ${t / 1000} seconds.`);
};

// drawMandelbrot(5000, -0.5, 0, 200);


/*
 * This code is running in an environment the same as simple-draw. Thus you have
 * two variables that will be helpful.
 *
 *  width - the width of the drawing area.
 *  height - the height of the drawing area.
 *
 * And these methods which do the same thing as in simple-draw.
 *
 *  drawLine(x1, y1, x2, y2, color, lineWidth)
 *
 *  drawCircle(x, y, radius, color, lineWidth=1)
 *
 *  drawRect(x, y, w, h, color, lineWidth=1)
 *
 *  drawTriangle(x1, y1, x2, y2, x3, y3, color, lineWidth=1)
 *
 *  drawFilledCircle(x, y, r, color)
 *
 *  drawFilledRect(x, y, width, height, color)
 *
 *  drawFilledTriangle(x1, y1, x2, y2, x3, y3, color)
 *
 *  clear()
 * 
 *
 */

// Max's code

/*
 * This code is running in an environment the same as simple-draw. Thus you have
 * two variables that will be helpful.
 *
 *  width - the width of the drawing area.
 *  height - the height of the drawing area.
 *
 * And these methods which do the same thing as in simple-draw.
 *
 *  drawLine(x1, y1, x2, y2, color, lineWidth)
 *
 *  drawCircle(x, y, radius, color, lineWidth=1)
 *
 *  drawRect(x, y, w, h, color, lineWidth=1)
 *
 *  drawTriangle(x1, y1, x2, y2, x3, y3, color, lineWidth=1)
 *
 *  drawFilledCircle(x, y, r, color)
 *
 *  drawFilledRect(x, y, width, height, color)
 *
 *  drawFilledTriangle(x1, y1, x2, y2, x3, y3, color)
 *
 *  clear()
 */

const circleLineRed = (radius) => {
  let diameter = radius * 2
  let x = 0
  while (x < width - diameter) {
    drawFilledCircle(diameter + x, height / 2, radius, 'red')
    x += diameter
  }
}
//circleLineRed(12)


const circleLine = (radius) => {
  let diameter = radius * 2
  let x = 0
  let c = 'red'
  while (x < width - diameter) {
    drawFilledCircle(diameter + x, height / 2, radius, c)
    x += diameter
    if (c == 'red') {
      c = 'blue'
    } else { c = 'red' }
  }
}
//circleLine(12)

const xdartboard = (howManyCircles) => {
  let radius = height / 2
  let c = 'red'
  while (radius > width / 6 / howManyCircles) {
    drawFilledCircle(width / 2, height / 2, radius, c)
    radius = radius - width / 2 / howManyCircles
    if (c == 'red') {
      c = 'blue'
    } else { c = 'red' }
  }
}

const dartboard = (howManyCircles) => {
  const max = Math.min(width, height) / 2;
  const band = max / howManyCircles;
  let c = 'red'
  for (let i = 0; i < howManyCircles; i++) {
    drawFilledCircle(width / 2, height / 2, (howManyCircles - i) * band, c)
    if (c == 'red') {
      c = 'blue'
    } else {
      c = 'red'
    }
  }
}



//dartboard(12);

/*
const checkerBoard = (NumSq) =>
  let width = height / 5
let c = 'red'
while (width > height / 10 / NumSq) {
  drawFilledSquare(width / 10, height / 5)
}*/