/*
 * @Author: 沈经纬(327538014@qq.com)
 * @Date: 2019-12-16 15:48:36
 * @Last Modified by:   沈经纬(327538014@qq.com)
 * @Last Modified time: 2019-12-16 15:48:36
 * @Content: 开放均匀B样条曲线
 */
import { IPoint } from "./types";
import { BSplinePolynomial } from "./BSplinePolynomial";

export class OpenUniformBSplineClass {
  cPoints: IPoint[];
  order: number;
  tArray: number[];
  bSplinePolynomial: BSplinePolynomial;

  constructor(cPoints: IPoint[], order: number) {
    if (order > cPoints.length) {
      throw new Error(
        `the order(${order}) cannot be greater than the length of control point(${cPoints.length}).`
      );
    }
    if (order < 2) {
      throw new Error("order cannot be less than 2.");
    }
    this.cPoints = cPoints;
    this.order = order;
    this.tArray = this.generateTArray();
    this.bSplinePolynomial = new BSplinePolynomial(this.tArray, order);
  }

  private generateTArray() {
    const arr: number[] = [];
    const tLen = this.cPoints.length + this.order;
    for (let i = 0; i < tLen; i += 1) {
      if (i < this.order) {
        arr.push(0);
      } else if (i <= this.cPoints.length) {
        arr.push(i - this.order + 1);
      } else {
        arr.push(this.cPoints.length - this.order + 1);
      }
    }
    return arr;
  }

  getPoint(t: number) {
    return this.cPoints.reduce(
      (prev, curr, index) => {
        const [x, y] = prev;
        const [nx, ny] = curr;
        const ratio = this.bSplinePolynomial.get(index)(t);
        return [x + ratio * nx, y + ratio * ny];
      },
      [0, 0]
    );
  }
}
