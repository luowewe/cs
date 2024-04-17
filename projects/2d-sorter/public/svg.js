class Svg {

  constructor(e) {
    this.e = e;
  }

  get width() {
    return this.e.clientWidth;
  }

  get height() {
    return this.e.clientHeight;
  }

  element(kind) {
    return document.createElementNS("http://www.w3.org/2000/svg", kind);
  }

  line(x1, y1, x2, y2, opts, parent) {
    return this.#setAttributes(this.element("line"), { x1, y1, x2, y2, ...opts }, parent);
  }

  rect(x, y, width, height, opts, parent) {
    return this.#setAttributes(this.element("rect"), { x, y, width, height, ...opts }, parent);
  }

  text(x, y, text, opts, parent) {
    const t = this.element("text");
    t.textContent = text;
    return this.#setAttributes(t, { x, y, ...opts}, parent);
  }

  circle(cx, cy, r, opts, parent) {
    return this.#setAttributes(this.element("circle"), { cx, cy, r, ...opts}, parent);
  }

  g(opts, parent) {
    return this.#setAttributes(this.element("g"), opts, parent);
  }

  polygon(coords, opts, parent) {
    const points = coords.map(({x, y}) => `${x},${y}`).join(" ");
    return this.#setAttributes(this.element("polygon"), { points, ...opts }, parent);
  }

  #setAttributes(e, opts, parent) {
    Object.entries(opts).forEach(([k, v]) => { e.setAttribute(k, v) });
    (parent ?? this.e).append(e);
    return e;
  }
}

export { Svg };
