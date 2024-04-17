import { point, color, triangle, rgba, rgb, drawTriangle, drawTriangles } from './graphics.js';
import { randomInt, randomizer, choose, shuffled } from './random.js';

const doc = Object.fromEntries([...document.querySelectorAll('[id]')].map(e => [e.id, e]));

const POP_SIZE = 100;
const TRIANGLES = 50;

let addTriangle = false;

const IMAGE = {
  cite: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
  src: 'mona-lisa.jpg',
  x: 300,
  y: 150,
  width: 550,
  height: 550,
}

let oldBest = 0;
let critterNumber = 0;

const random = {

  number: (min, max) => max === undefined ? random.number(0, min) : randomInt(min, max),

  point: (width, height) => point(random.number(width), random.number(height)),

  color: () => color(random.number(255), random.number(255), random.number(255), random.number(255)),

  triangle: (width, height) => {
    return triangle(
      random.point(width, height),
      random.point(width, height),
      random.point(width, height),
      //random.color()
      color(128, 128, 128, 128)
    );
  },

  triangles: (n, width, height) => Array(n).fill().map(() => random.triangle(width, height)),

  population: (size, problem) => {
    const { width, height } = problem;
    return Array(size).fill().map(() => random.triangles(TRIANGLES, width, height))
  },

  populationX: (size, problem) => {
    const { width, height } = problem;
    const root = random.triangles(TRIANGLES, width, height);
    return Array(size).fill(root).map((r) => mutate(r, problem, 1.0));
  },
};

const loadReference = (image, scale, start) => {

  const width = image.width * scale;
  const height = image.height * scale;

  const img = new Image();

  img.onload = async () => {

    sizeCanvases(width, height);
    doc.reference.nextElementSibling.querySelector('a').href = image.cite;

    const ctx = doc.reference.getContext('2d');
    ctx.drawImage(img, image.x, image.y, image.width, image.height, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    // The farthest away one image can be from another given the number of
    // pixels. In practice we can't actually be this far away from an actual
    // image unless it is either completely white or completely black.
    const farthest = Math.sqrt(((imageData.length / 4) * 3) * 255 ** 2)

    const ctx2 = doc.generated.getContext('2d', { willReadFrequently: true });

    start(ctx2, { imageData, width, height, farthest });
  };

  img.src = image.src;
};

const sizeCanvases = (width, height) => {
  document.querySelectorAll('canvas').forEach(e => {
    e.width = width;
    e.height = height;
  });
};

const scoreImage = (ctx, problem) => {

  const { imageData, width, height, farthest } = problem;

  const generatedImageData = ctx.getImageData(0, 0, width, height).data;
  let sum = 0;

  for (let i = 0; i < generatedImageData.length; i += 4) {
    const ref = rgb(imageData, i);
    const gen = rgb(generatedImageData, i);
    ref.forEach((n, i) => {
      sum += (n - gen[i]) ** 2;
    });
  }

  // If the distance is zero the fitness is 1.0. If distance is actually the
  // farthest away we can be then fitness is 0.0.
  return ((farthest - Math.sqrt(sum)) / farthest);
};

const scored = (dna, ctx, problem) => {
  doc.generation.innerText = `${TRIANGLES} triangles - #${critterNumber++}`;
  drawTriangles(dna, ctx, problem.width, problem.height);
  const fitness = scoreImage(ctx, problem);
  doc.score.innerText = `Score: ${fitness.toFixed(4)}`;
  return { dna, fitness };
};

/*
 * Asexual reproduction. Basically hill-climbing by mutating the current best
 * until we get a better one.
 */
const runContinuous = (ctx, problem) => {
  const start = random.triangles(TRIANGLES, problem.width, problem.height);
  let best = scored(start, ctx, problem);
  newBest(best, problem);

  const step = () => {
    if (addTriangle) {
      best.dna.push(random.triangle(problem.width, problem.height));
      addTriangle = false;
    }
    const next = scored(mutate(best.dna, problem, 0.01 /*1/best.dna.length*/), ctx, problem);
    if (next.fitness > best.fitness) {
      best = next;
      newBest(best, problem);
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const runPopulation = async (ctx, problem) => {
  let gen = 0;
  console.log(`Generation ${gen++}`);
  const seedDNA = random.population(POP_SIZE, problem);
  let population = await scoreGenomes(seedDNA, ctx, problem);

  while (true) {
    // TODO: display best and worst.
    console.log(`Generation ${gen++}`);
    const offspring = await scoreGenomes(newPopulation(population, problem), ctx, problem);
    population = [...offspring, ...population].sort((a, b) => b.fitness - a.fitness).splice(0, population.length);
  }
};

// Pick triangles at random to make image.
// Each triangle looses some energy for being in the image but gains energy based on fitness of image.
// When a triangle's energy is depleted, it is removed from the population.
// When a triangle gets enough energy, it splits its energy to make a child.
// The child will be mutated from its parent.
//
// energy = 0 = death

// energy decrement should be based on moving average of image fitness so as
// average fitness goes up (and thus the reward for being part of an image) goes
// up, the cost of being part of an image also goes up. Perhaps something like
// averageFitness divided by 100 or 1000. Possibly also the cost should be a
// function of the number of triangles in that slot? So if there's one triangle
// it's almost free and therefore it can accumulate energy and spawn more
// children but as more triangles are spawned, they have to be more productive
// to survive.

// Possibly the threshold for reproducing should also be tied to the average
// image fitness.


const runTriangles = async (ctx, problem) => {
  const { width, height } = problem;

  const triangles = Array(TRIANGLES).fill().map(() => random.triangles(100, width, height));
  const weight = 0.9;

  let average = 1.0;
  let best = { fitness: -Infinity }

  const step = () => {
    const img = triangles.map(selectTriangle);
    const next = scored(img, ctx, problem);

    if (next.fitness > best.fitness) {
      best = next;
      newBest(next, problem);
    }

    img.forEach((t, i) => {
      // Gain energy image is above average, lose if we're below.
      t.energy += next.fitness - average;
      t.energy -= average / 2;

      if (t.energy <= 0) {
        // Triangle ran out of energy and died.
        removeTriangle(t, triangles[i], i)

        if (triangles[i].length === 0) {
          // Uh, repopulate I guess.
          console.log(`Repopulating species ${i}`);
          triangles[i] = random.triangles(100, width, height);
        }

      } else if (t.energy > average * 0.95) {
        // Triangle has engery for a kid
        const child = mutateTriangle(t, problem, 1.0);
        child.energy /= 2;
        t.energy /= 2;
        triangles[i].push(child);
        //console.log(`Spawning child at ${i}; pop: ${triangles[i].length}`);
      }
    });

    // Update moving average.
    average = (average * weight) + (next.fitness * (1 - weight));

    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const removeTriangle = (t, species, i) => {
  //console.log(`Removing triangle from ${i} length: ${species.length}`);
  const last = species.pop();
  if (last !== t) {
    const idx = species.indexOf(t);
    //console.log(`Putting ${last} in ${idx}`);
    species[idx] = last;
  } else {
    //console.log(`t was last`);
  }
  //console.log(`Removed triangle from ${i} length: ${species.length}`);
};


const selectTriangle = (ts) => {

  const t = choose(ts);
  if (t === undefined) {
    debugger;
  }
  if (!('energy' in t)) {
    t.energy = 1.0;
  }
  return t;
}



/*
 * Score all the genomes in a population by drawing them and measuring the
 * pixel-by-pixel difference, returning a Promise of the scored population.
 */
const scoreGenomes = (genomes, ctx, problem) => {
  console.log('Scoring genomes.');
  return new Promise((resolve, reject) => {

    let i = 0;
    let best = { dna: null, fitness: -Infinity };

    const withScores = [];

    const step = () => {
      if (i < genomes.length) {
        const next = scored(genomes[i++], ctx, problem);
        withScores.push(next);
        if (next.fitness > best.fitness) {
          best = next
          newBest(best, problem);
        }
        requestAnimationFrame(step);
      } else {
        resolve(withScores);
      }
    };
    requestAnimationFrame(step);
  });
};

const crossRandom = (dna1, dna2) => dna1.map((t, i) => Math.random() < 0.5 ? t : dna2[i]);

const crossRandomPoint = (dna1, dna2) => {
  const i = randomInt(0, dna1.length);
  return [...dna1.slice(0, i), ...dna2.slice(i)];
}

const cross = crossRandomPoint;

const newPopulationX = (population, problem) => {
  const r = randomizer(population, 'fitness');
  return population.map(() => mutate(cross(r().dna, r().dna), problem, 0.01));
};

const newPopulation = (population, problem) => {
  population.sort((a, b) => b.fitness - a.fitness);

  const best = population[0].fitness;
  const worst = population[population.length - 1].fitness;
  const m = 1 / (100 * (best - worst));

  console.log(`best: ${best}; worst: ${worst}; m: ${m}`);

  const parents = population.slice(0, population.length * 0.1);
  const r = randomizer(parents, 'fitness');
  return population.map(() => mutate(cross(r().dna, r().dna), problem, 0.01));
};



const newBest = (best, problem) => {

  const { dna, fitness } = best;
  const { width, height } = problem;

  drawTriangles(dna, doc.best.getContext('2d'), width, height);
  doc.bestScore.innerText = `Score: ${fitness.toFixed(4)}`;

  const oldDistance = 1 - oldBest;
  const newDistance = 1 - fitness;

  if (newDistance < oldDistance * 0.9) {
    oldBest = fitness;

    const template = document.querySelector(`#newbest`).content.cloneNode(true);
    const canvas = template.querySelector('canvas');
    const caption = template.querySelector('figcaption');

    canvas.width = width;
    canvas.height = height;

    drawTriangles(dna, canvas.getContext('2d'), width, height);
    caption.innerText = `#${critterNumber}; fitness: ${fitness.toFixed(4)}`;

    document.querySelector('#bests').prepend(template);
  }
};

const clamp = (n, min, max) => Math.min(Math.max(min, n), max);

const mutatePoint = (p, problem) => {
  return {
    x: clamp(p.x + random.number(-5, 5), 0, problem.width),
    y: clamp(p.y + random.number(-5, 5), 0, problem.height),
  };
};

const mutateColor = (color) => {
  const { r, g, b, a } = color;
  return {
    r: clamp(r + random.number(-5, 5), 0, 255),
    g: clamp(g + random.number(-5, 5), 0, 255),
    b: clamp(b + random.number(-5, 5), 0, 255),
    a: clamp(a + random.number(-5, 5), 0, 255),
  };
};

const mutateTriangle = (triangle, problem, rate) => {
  const { a, b, c, color } = triangle;
  if (Math.random() < rate) {
    if (Math.random() < 0.5) {
      return {
        ...triangle,
        a: mutatePoint(a, problem),
        b: mutatePoint(b, problem),
        c: mutatePoint(c, problem),
      };
    } else {
      return {
        ...triangle,
        color: mutateColor(color),
      };
    }
  } else {
    return { ...triangle };
  }
};

const mutate = (dna, problem, triangleRate) => {
  const newTriangles = dna.map(t => mutateTriangle(t, problem, triangleRate));
  const swaps = random.number(3);
  for (let i = 0; i < swaps; i++) {
    const a = random.number(newTriangles.length);
    const b = random.number(newTriangles.length);
    const tmp = newTriangles[a];
    newTriangles[a] = newTriangles[b];
    newTriangles[b] = tmp;
  }
  if (Math.random() < 0.01) {
    const toSplit = random.number(newTriangles.length);
    const ts = splitTriangle(newTriangles[toSplit]);

    const m = randomInt(0, ts.length);
    ts[m] = mutateTriangle(ts[m], problem, 1.0);

    newTriangles.splice(toSplit, 1, ...ts);
    const toRemove = random.number(newTriangles.length);
    newTriangles.splice(toRemove, 1);
  }
  /*
  if (Math.random() < 0.001) {
    newTriangles[random.number(newTriangles.length)] = random.triangle(problem.width, problem.height);
  }
  */
  return newTriangles;
};

const mutateLast = (dna, problem, triangleRate) => {
  return dna.map((t, i) => {
    if (i === dna.length - 1) {
      return mutateTriangle(t, problem, triangleRate);
    } else {
      return { ...t};
    }
  });
};

/*
 * Randomly split a triangle into two triangles.
 */
const splitTriangle = (t) => {
  const vs = shuffled([t.a, t.b, t.c]);
  const dx = vs[2].x - vs[1].x;
  const dy = vs[2].y - vs[1].y;
  let nv;
  if (dx !== 0) {
    const rx = (1 - Math.random()) * dx;
    nv = { x: vs[1].x + rx, y: vs[1].y + (rx * dy / dx) };
  } else {
    const ry = (1 - Math.random()) * dy;
    nv = { x: vs[1].x + (ry * (dx / dy)), y: vs[1].y + ry };
  }
  return [
    triangle(vs[0], nv, vs[1], t.color),
    triangle(vs[0], nv, vs[2], t.color),
  ];
};

document.querySelector('button').onclick = () => {
  addTriangle = true;
};

const testTriangleSplit = (ctx, problem) => {
  const red = color(255, 0, 0, 128);
  const blue = color(0, 0, 255, 128);
  const t0 = triangle(
    point(0, 0),
    point(0, problem.height),
    point(problem.width, 0),
    color(255, 0, 0, 255)
  );
  const ts = splitTriangle(t0);
  //console.log(JSON.stringify(ts, null, 2));
  drawTriangle({...ts[0], color: blue }, ctx);
  drawTriangle({...ts[1], color: red}, ctx);
  //drawTriangle(t0, ctx);

}


// Kick things off by loading our reference image.
//loadReference(IMAGE, 200 / IMAGE.width, runPopulation);
loadReference(IMAGE, 200 / IMAGE.width, runContinuous);
//loadReference(IMAGE, 200 / IMAGE.width, runTriangles);
//loadReference(IMAGE, 200 / IMAGE.width, testTriangleSplit);
