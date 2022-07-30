
interface IPoint {
  x: number
  y: number
}

/**
 * Adaptation of work of Kevin Lindsey(kevin@kevlindev.com)
 */
export class Point {

  x: number

  y: number

  type = 'point'

  static toPoint(from: IPoint) {
    return new Point(from.x, from.y);
  }

  static createVector(from: IPoint, to: IPoint) {
    return Point.toPoint(to).subtract(from);
  }

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another point to this one and returns another one
   * @param {Point} that
   * @return {Point} new Point instance with added values
   */
  add(that: Point): Point {
    return new Point(this.x + that.x, this.y + that.y);
  }

  /**
   * Adds another point to this one
   * @param {Point} that
   * @return {Point} thisArg
   * @chainable
   */
  addEquals(that: Point): Point {
    this.x += that.x;
    this.y += that.y;
    return this;
  }

  /**
   * Adds value to this point and returns a new one
   * @param {Number} scalar
   * @return {Point} new Point with added value
   */
  scalarAdd(scalar: number): Point {
    return new Point(this.x + scalar, this.y + scalar);
  }

  /**
   * Adds value to this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   */
  scalarAddEquals(scalar: number): Point {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  /**
   * Subtracts another point from this point and returns a new one
   * @param {IPoint} that
   * @return {Point} new Point object with subtracted values
   */
  subtract(that: IPoint): Point {
    return new Point(this.x - that.x, this.y - that.y);
  }

  /**
   * Subtracts another point from this point
   * @param {Point} that
   * @return {Point} thisArg
   * @chainable
   */
  subtractEquals(that: Point): Point {
    this.x -= that.x;
    this.y -= that.y;
    return this;
  }

  /**
   * Subtracts value from this point and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarSubtract(scalar: number): Point {
    return new Point(this.x - scalar, this.y - scalar);
  }

  /**
   * Subtracts value from this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   */
  scalarSubtractEquals(scalar: number): Point {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  /**
   * Multiplies this point by another value and returns a new one
   * @param {Point} that
   * @return {Point}
   */
  multiply(that: Point): Point {
    return new Point(this.x * that.x, this.y * that.y);
  }

  /**
   * Multiplies this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarMultiply(scalar: number): Point {
    return new Point(this.x * scalar, this.y * scalar);
  }

  /**
   * Multiplies this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   */
  scalarMultiplyEquals(scalar: number): Point {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Divides this point by another and returns a new one
   * @param {Point} that
   * @return {Point}
   */
  divide(that: Point): Point {
    return new Point(this.x / that.x, this.y / that.y);
  }

  /**
   * Divides this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarDivide(scalar: number): Point {
    return new Point(this.x / scalar, this.y / scalar);
  }

  /**
   * Divides this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   */
  scalarDivideEquals(scalar: number): Point {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Returns true if this point is equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  eq(that: Point): boolean {
    return (this.x === that.x && this.y === that.y);
  }

  /**
   * Returns true if this point is less than another one
   * @param {Point} that
   * @return {Boolean}
   */
  lt(that: Point): boolean {
    return (this.x < that.x && this.y < that.y);
  }

  /**
   * Returns true if this point is less than or equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  lte(that: Point): boolean {
    return (this.x <= that.x && this.y <= that.y);
  }

  /**

   * Returns true if this point is greater another one
   * @param {Point} that
   * @return {Boolean}
   */
  gt(that: Point): boolean {
    return (this.x > that.x && this.y > that.y);
  }

  /**
   * Returns true if this point is greater than or equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  gte(that: Point): boolean {
    return (this.x >= that.x && this.y >= that.y);
  }

  /**
   * Returns new point which is the result of linear interpolation with this one and another one
   * @param {Point} that
   * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
   * @return {Point}
   */
  lerp(that: Point, t: number = 0.5): Point {
    t = Math.max(Math.min(1, t), 0);
    return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
  }

  /**
   * Returns distance from this point and another one
   * @param {Point} that
   * @return {Number}
   */
  distanceFrom(that: Point): number {
    var dx = this.x - that.x,
      dy = this.y - that.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Returns the point between this point and another one
   * @param {Point} that
   * @return {Point}
   */
  midPointFrom(that: Point): Point {
    return this.lerp(that);
  }

  /**
   * Returns a new point which is the min of this and another one
   * @param {Point} that
   * @return {Point}
   */
  min(that: Point): Point {
    return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
  }

  /**
   * Returns a new point which is the max of this and another one
   * @param {Point} that
   * @return {Point}
   */
  max(that: Point): Point {
    return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
  }

  /**
   * Returns string representation of this point
   * @return {String}
   */
  toString(): string {
    return this.x + ',' + this.y;
  }

  /**
   * Sets x/y of this point
   * @param {Number} x
   * @param {Number} y
   * @chainable
   */
  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Sets x of this point
   * @param {Number} x
   * @chainable
   */
  setX(x: number) {
    this.x = x;
    return this;
  }

  /**
   * Sets y of this point
   * @param {Number} y
   * @chainable
   */
  setY(y: number) {
    this.y = y;
    return this;
  }

  /**
   * Sets x/y of this point from another point
   * @param {Point} that
   * @chainable
   */
  setFromPoint(that: Point) {
    this.x = that.x;
    this.y = that.y;
    return this;
  }

  /**
   * Swaps x/y of this point and another point
   * @param {Point} that
   */
  swap(that: Point) {
    var x = this.x,
      y = this.y;
    this.x = that.x;
    this.y = that.y;
    that.x = x;
    that.y = y;
  }

  /**
   * 
   * @returns absolute point
   */
  abs() {
    return new Point(Math.abs(this.x), Math.abs(this.y));
  }

  /**
   * return a cloned instance of the point
   * @return {Point}
   */
  clone(): Point {
    return new Point(this.x, this.y);
  }
}
