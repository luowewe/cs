import vector from './vector.js';

class Ball {
  constructor(position, oldPosition, acceleration, radius = 50) {
    this.position = position;
    this.oldPosition = oldPosition;
    this.acceleration = acceleration;
    this.radius = radius;
  }

  updatePosition(dt) {
    const v = this.velocity;
    this.oldPosition = this.position;
    this.position = this.position.plus(v).plus(this.acceleration.times(dt ** 2));
    this.acceleration = vector(0, 0);
  }

  accelerate(acc) {
    this.acceleration = this.acceleration.plus(acc);
  }

  draw(g) {
    const { x, y } = this.position;
    g.drawFilledCircle(x, y, this.radius, '#00f9');
  }

  get velocity() {
    return this.position.minus(this.oldPosition);
  }

  get mass() {
    return Math.PI * this.radius ** 2;
  }
}

export default (p, op, acc, radius = 50) => new Ball(p, op, acc, radius);
