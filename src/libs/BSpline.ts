import { BSplinePolynomial } from "./BSplinePolynomial";
import { IPoint } from "./types";

interface IBSplineOpts {
  order: number;
  points: IPoint[];
  tArray: number[];
}

export class BSpline {
  order: number;
  points: IPoint[];
  tArray: number[];
  bSplinePolynomial: BSplinePolynomial;

  constructor(opts: IBSplineOpts) {
    this.order = opts.order;
    this.points = opts.points;
    this.tArray = opts.tArray;
    if (this.order > this.points.length) {
      throw new Error(
        `the order(${this.order}) cannot be greater than the length of control point(${this.points.length}).`
      );
    }
    if (this.order < 2) {
      throw new Error("order cannot be less than 2.");
    }
    if (this.tArray.length !== this.points.length + this.order) {
      throw new Error(
        `the array length of parameter t (${this.tArray.length}) must be equal to the sum of the length of points (${this.points.length}) and the order (${this.order}).`
      );
    }
    this.bSplinePolynomial = new BSplinePolynomial(this.tArray, this.order);
  }

  getPoint(t: number) {
    return this.points.reduce(
      (prev, curr, index) => {
        const [x, y] = prev;
        const [nx, ny] = curr;
        const ratio = this.bSplinePolynomial.get(index)(t);
        return [x + ratio * nx, y + ratio * ny];
      },
      [0, 0]
    );
  }

  updatePoint(index: number, point: IPoint) {
    if (index < 0 || index > this.points.length - 1) {
      throw new Error(`parameter index error.`);
    }
    this.points[index] = point;
  }
}
