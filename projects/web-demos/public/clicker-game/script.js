import { animate } from './animation.js';

// Some helper functions.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const text = (s) => document.createTextNode(s);
const el = (tag) => document.createElement(tag);

// Grab some elements that we'll need to refer to on every animation frame.
const display = $('#display');
const gps = $('#gps');

// The state of the world
let goldPerSecond = 0;
let gold = 0;
let last = 0;
let start = 0;
let banks = 0;

// Animation frame function
const updateUI = (t) => {
  const interest = (gold * 0.05 * banks);
  gold += ((t - last) * (goldPerSecond + interest)) / 1000;
  last = t;

  display.replaceChildren(text(`Gold: $${Math.round(gold).toLocaleString()}`));

  gps.replaceChildren(
    text(`Passive gold/second: ${(goldPerSecond + interest).toFixed(1)}; `),
    text(`Lifetime gold/second: ${(gold/((t - start)/1000)).toFixed(2)}`));

  $$('#things span').forEach(fadeSpan);
};

// Fade the things according to how close we are to being able to buy them
const fadeSpan = (span, i) => {
  const cost = 10 ** (i + 1);
  span.style.opacity = Math.max(0.05, Math.min(1.0, gold/cost));
};

// Rewrite the initial HTML to add the prices and set up the click handlers.
const rewriteSpan = (span, i) => {
  const cost = 10 ** (i + 1);
  const isBank = span.nextElementSibling === null;

  span.replaceChildren(toFigure(span, cost));

  span.onclick = (e) => {
    if (gold >= cost) {
      gold -= cost;
      if (isBank) {
        banks++;
      } else {
        goldPerSecond += cost / 100;
      }
    }
    e.stopPropagation();
  };
};

// Rewrite one span to wrap its content in a FIGURE element.
const toFigure = (span, cost) => {
  const figure = el('figure');
  const figcaption = el('figcaption');
  figure.replaceChildren(...span.childNodes);
  figcaption.append(text(`$${cost.toLocaleString()}`));
  figure.append(figcaption);
  return figure;
};


// Hmmm. Whatever could this be for?
const cheater = () => {
  const c = el('p');
  c.setAttribute('class', 'c');
  c.onclick = (e) => {
    gold *= 2;
    e.stopPropagation();
  };
  return c;
}

// Rewrite the page a bit and register the top-level click handler.
$$('#things span').forEach(rewriteSpan);
$('body').append(cheater());
document.documentElement.onclick = () => gold++;

// Let's gooooooo!
start = last = animate(updateUI);
