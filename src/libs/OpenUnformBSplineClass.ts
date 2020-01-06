/*
 * @Author: 沈经纬(327538014@qq.com)
 * @Date: 2019-12-16 15:48:36
 * @Last Modified by:   沈经纬(327538014@qq.com)
 * @Last Modified time: 2019-12-16 15:48:36
 * @Content: 开放均匀B样条曲线
 */
import { IPoint } from "./types";
import { BSpline } from "./BSpline";

export class OpenUniformBSplineClass {
  mutationPointIndexes: number[] = [];
  ratioCache: Map<number, number> = new Map();
  bSpline: BSpline;

  constructor(cPoints: IPoint[], order: number) {
    if (order > cPoints.length) {
      throw new Error(
        `the order(${order}) cannot be greater than the length of control point(${cPoints.length}).`
      );
    }
    if (order < 2) {
      throw new Error("order cannot be less than 2.");
    }
    this.bSpline = new BSpline({
      order,
      points: cPoints,
      tArray: this.generateTArray(cPoints, order),
    });
  }

  private generateTArray(cPoints: IPoint[], order: number) {
    const arr: number[] = [];
    const tLen = cPoints.length + order;
    for (let i = 0; i < tLen; i += 1) {
      if (i < order) {
        arr.push(0);
      } else if (i <= cPoints.length) {
        arr.push(i - order + 1);
      } else {
        arr.push(cPoints.length - order + 1);
      }
    }
    return arr;
  }

  getPoint(t: number) {
    return this.bSpline.getPoint(t);
  }

  updatePoint(index: number, point: IPoint) {
    if (index < 0 || index > this.bSpline.points.length - 1) {
      throw new Error(`parameter index error.`);
    }
    this.bSpline.points[index] = point;
  }
}
