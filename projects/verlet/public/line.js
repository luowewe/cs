import vector from './vector.js';

class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  draw(g) {
    g.drawLine(this.p1.x, this.p1.y, this.p2.x, this.p2.y, '#448', 10);
  }

  closestPoint(p) {
    // Adapted from https://stackoverflow.com/a/3122532/19588965
    const toP = p.minus(this.p1);
    const segment = this.p2.minus(this.p1);
    const dot = segment.dot(toP);

    // I think this works because the dot product is itself inherently squared,
    // as in the dot product of a vector with itself is the square of its
    // magnitude. So if toP was the same as segment dot would be the square of
    // the magnitude of segment and thus t would end up being one. And if dot is
    // zero then obviously t will be zero. And if dot is negative or greater
    // than segment than t will be less than 0 or greater than 1.
    const t = dot / segment.magnitudeSquared();

    if (t < 0) {
      return this.p1;
    } else if (t > 1) {
      return this.p2;
    } else {
      return this.p1.plus(segment.times(t));
    }
  }
}

export default (p1, p2) => new Line(p1, p2);
