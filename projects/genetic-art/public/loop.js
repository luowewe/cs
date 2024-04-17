import { point, color, triangle, rgba, rgb, drawTriangle, drawTriangles } from './graphics.js';
import { randomInt, randomizer, choose, shuffled } from './random.js';

const doc = Object.fromEntries([...document.querySelectorAll('[id]')].map(e => [e.id, e]));

const log = (s) => {
  const p = document.createElement('p');
  p.append(s);
  doc.log.append(p);
};

/*
 * The main loop of the program. This is a regular while loop. However we write
 * it as an `async` function so we can use the keyword `await`.
 */
const run = async () => {

  // Just for demonstration purposes we're making a population of random numbers
  // and each new generation is processed to make a new population with each
  // number doubled.
  let gen = 0;
  let pop = Array(100).fill().map(() => Math.random())

  // Each time through the loop we run one generation of the population.
  while (true) {
    log(`Generation ${gen++}. Total: ${pop.reduce((tot, n) => tot + n, 0)}`);
    // Await is a bit of Promise magic. It causes this code to effectively wait
    // for double to complete even though double doesn't really run
    // continuously.
    pop = await double(pop);
  }
};

/*
 * Double all the numbers in the population but one at a time so we can update
 * the web page as we do.
 */
const double = (pop) => {

  // This is a bit of magic. If we wrote `double` in the obvious way with a for
  // loop, then the changes we make to the HTML page (down below where we change
  // the innerHTML of doc.notice) wouldn't be visible until double returned.
  // Instead we use this Promise thing which kicks off a function that will
  // arrange to be run by the browsers before each repaint. The Promise is
  // immediately returned by double but because when we called double above we
  // used `await` that code will not actually run until whenever the promise is
  // "resolved" by calling the 'resolve' function passed below. (This is
  // complicated and you don't actually have to wrap your head around how it
  // works though I'm happy to explain in yet more depth if you want.)
  return new Promise((resolve, reject) => {

    const doubled = [];
    let i = 0;

    // This function is called for each step of processing the population. As
    // long as i is less than the length of the pop it processes one item,
    // pushing its doubled value onto the array `doubled` and updating the web
    // page. It then asks to be run again before the next page repaint. When we
    // have processed all the elements of pop, it uses the `resolve` function to
    // make the Promise resolve to the new list of doubled numbers.
    const step = () => {
      if (i < pop.length) {
        // Get the value to process (this would be a set of triangles to draw or
        // whatever.)
        const n = pop[i++];

        // Update the web page. In your program thas would be drawing all the
        // triangles for one image onto the appropriate canvas.
        doc.notice.innerText = `${i}`;

        // Collect a value. In your program that would probably be the object
        // that attaches the fitness score to the image you just drew.
        doubled.push(n * 2);

        // Request that we be run again to process the next item. Because step
        // returns the page can then actually be repainted by the browser to
        // reflect the changes we've made, updating the notice div in this
        // program, drawing on the canvas in yours.
        requestAnimationFrame(step);

      } else {
        // When we get here we "resolve" the promise with the value we've been
        // collecting which makes it the value of the `await double` call in run.
        resolve(doubled);
      }
    };

    // Actually kick things off, by scheduling step to be run for the first time
    // before the next repaint.
    requestAnimationFrame(step);
  });
};

await run();
