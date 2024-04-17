import { Svg } from './svg.js';

const logEvent = (e) => { console.log(e); };

const svgToItems = new Map();

/*
 * An item positioned on the plot. We store the position in logical ranges of
 * [-1, 1] for each axis and then translate to a physical position when we
 * render.
 */
class Item {
  // x, and y are values in the range [-1, 1] indicating how far they are from
  // the origin on each scale.
  constructor(label, g, x = 0, y = 0) {
    this.label = label;
    this.g = g;
    this.position = { x, y };
  }

  moveTo(x, y, origin, bounds) {
    // Translate raw x,y SVG coordinate to -1,1 coordinates based on the
    // position within the bounds
    const xScale = bounds.width / 2;
    const yScale = bounds.height / 2;

    this.position = {
      x: clamp((x - origin.x) / xScale, -1, 1),
      y: clamp((origin.y - y) / yScale, -1, 1),
    };
    const nx = this.position.x * xScale;
    const ny = -this.position.y * yScale;
    this.g.setAttribute('transform', `translate(${nx} ${ny})`);
  }

  /*
   * Translate back to a physical position.
   */
  physicalPosition (origin, bounds) {
    return {
      x: origin.x + this.position.x * (bounds.width / 2),
      y: origin.y - this.position.y * (bounds.height / 2),
    };
  };
}

const svg = new Svg(document.getElementById("plot"));

const origin = { x: svg.width / 2, y: svg.height / 2 };

const axesOpts = { 'class': 'axis' };
const labelPadding = 5;

const labels = {
  north: svg.text(origin.x, 0, "Good Tool", { 'text-anchor': 'middle', 'dominant-baseline': 'text-after-edge' } ),
  south: svg.text(origin.x, svg.height - 10, "Bad Tool", { 'text-anchor': 'middle', 'dominant-baseline': 'text-before-edge' }),
  west: svg.text(0, origin.y, "Hurts learning", { 'text-anchor': 'end', 'dominant-baseline': 'middle' }),
  east: svg.text(svg.width, origin.y, "Helps learning", { 'text-anchor': 'start', 'dominant-baseline': 'middle' }),
};

const hBorder = Math.max(labels.west.getBBox().width, labels.east.getBBox().width) * 3;
const vBorder = Math.max(labels.north.getBBox().height, labels.south.getBBox().height) * 2;

labels.south.setAttribute('y', svg.height - (vBorder - labelPadding));
labels.north.setAttribute('y', vBorder - labelPadding);
labels.west.setAttribute('x', hBorder - labelPadding);
labels.east.setAttribute('x', svg.width - hBorder + labelPadding);

const dragBounds = {
  x: hBorder,
  y: vBorder,
  width: svg.width - hBorder * 2,
  height: svg.height - vBorder * 2
};

const drawAxes = (svg) => {
  svg.line(origin.x, vBorder, origin.x, svg.height - vBorder, axesOpts);
  svg.line(hBorder, origin.y, svg.width - hBorder, origin.y, axesOpts);
  svg.polygon(
    [
      {x: origin.x - 10, y: vBorder + 10},
      {x: origin.x + 10, y: vBorder + 10},
      {x: origin.x, y: vBorder},
    ], axesOpts);
  svg.polygon(
    [
      {x: origin.x - 10, y: svg.height - vBorder - 10},
      {x: origin.x + 10, y: svg.height - vBorder - 10},
      {x: origin.x, y: svg.height - vBorder},
    ], axesOpts);
  svg.polygon(
    [
      {x: svg.width - hBorder - 10, y: origin.y - 10 },
      {x: svg.width - hBorder - 10, y: origin.y + 10 },
      {x: svg.width - hBorder, y: origin.y },
    ], axesOpts);

  svg.polygon(
    [
      {x: hBorder + 10, y: origin.y - 10 },
      {x: hBorder + 10, y: origin.y + 10 },
      {x: hBorder, y: origin.y },
    ], axesOpts);
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const setupDrag = (e) => {

  let selected = null;
  let clickOffset = null;

  e.onmousedown = (evt) => {
    const { offsetX: x, offsetY: y } = evt;

    if (evt.target !== e) {
      selected = evt.target.parentNode;

      // Get offset from where we actually clicked to where the item should be positioned.
      const p = svgToItems.get(selected)?.physicalPosition(origin, dragBounds);
      clickOffset = { x: x - p.x, y: y - p.y };

      evt.stopPropagation();
    }
  };

  e.onmouseup = () => {
    selected = null;
    clickOffset = null;
  };

  e.onmousemove = (evt) => {
    if (selected !== null) {
      const { offsetX: x, offsetY: y } = evt;
      const item = svgToItems.get(selected);
      const newPos = { x: x - clickOffset.x, y: y - clickOffset.y };
      item.moveTo(newPos.x, newPos.y, origin, dragBounds);
    }
  };
}

const addItem = (label, x, y, e) => {
  const g = svg.g({ 'class': 'item' }, e);
  svg.circle(origin.x, origin.y, 4, { 'fill': '#f003', 'stroke': 'blue', 'stroke-width': 1 }, g);
  svg.text(origin.x + 8, origin.y + 2, label, { 'text-anchor': 'start', 'dominant-baseline': 'middle' }, g);

  const item = new Item(label, g);
  svgToItems.set(g, item);

  item.moveTo(x, y, origin, dragBounds);
  return g;
}

const randomSign = () => Math.sign(Math.random() - 0.5);
const randomNum = (n) => Math.floor(Math.random() * n);

const positionItemsRandomly = (data, bounds, e) => {
  const a = (Math.PI * 2) / Object.keys(data).length - 2;
  const lim = Math.min(bounds.width / 4, bounds.height / 4);
  Object.entries(data).forEach(([item, pos], i) => {
    const h = lim + randomNum(lim);
    const x = origin.x + Math.cos(a * i + 1) * h;
    const y = origin.y + Math.sin(a * i + 1) * h;
    pos.self = { x, y };
    addItem(item, x, y, e);
  });
  console.log(JSON.stringify(data, null, 2));
};

drawAxes(svg);
setupDrag(svg.e);


document.querySelector('input').onchange = (e) => {
  addItem(e.currentTarget.value, origin.x, origin.y, svg.e);
  e.currentTarget.value = '';
}


// Create WebSocket connection.

const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

const socket = new WebSocket(`${wsProtocol}//${window.location.host}`);

// Connection opened
socket.onopen = (event) => {
  console.log(`web socket opened`);
  socket.send("hello");
};

// Listen for messages
socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if ('items' in msg) {
    positionItemsRandomly(msg.items, dragBounds, svg.e);
  }
  console.log("Message from server ", event.data);
};

const postNewItem = (item) => {
  socket.send(JSON.stringify({action: 'new', item}));
};

const inst = document.querySelector('.instructions');
const icon = inst.querySelector('.icon');

inst.onclick = (e) => {
  if (e.target.innerText === '?') {
    console.log('changing instructions');
    inst.querySelector('.icon').innerText = 'X';
    inst.classList.add('show');
  } else if (e.target.innerText === 'X') {
    inst.querySelector('.icon').innerText = '?';
    inst.classList.remove('show');
  }
};

document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    inst.querySelector('.icon').innerText = '?';
    inst.classList.remove('show');
  }
}
