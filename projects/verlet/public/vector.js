class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  times(n) {
    return new Vector(this.x * n, this.y * n);
  }

  divide(n) {
    return new Vector(this.x / n, this.y / n);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  magnitudeSquared() {
    return this.x ** 2 + this.y ** 2;
  }

  distance(other) {
    return Math.hypot(this.x - other.x, this.y - other.y);
  }

  normalizedX() {
    // Based on Physics for Game Developers, p. 288
    const tolerance = 0.0001;
    const m = Math.hypot(this.x, this.y);
    if (m < tolerance) m = 1;
    const x = this.x / m;
    const y = this.y / m;

    return new Vector(Math.abs(x) < tolerance ? 0 : x, Math.abs(y) < tolerance ? 0 : y);
  }

  normalized() {
    // Based on pure math. Maybe this has numeric problems when the magnitude is
    // very small? (The normalized x and y could go to infinity.)
    const m = Math.hypot(this.x, this.y);
    return new Vector(this.x / m, this.y / m);
  }
}

export default (x, y) => new Vector(x, y);
