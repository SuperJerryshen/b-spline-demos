/*
 * @Author: 沈经纬(327538014@qq.com)
 * @Date: 2019-12-16 15:48:53
 * @Last Modified by: 沈经纬(327538014@qq.com)
 * @Last Modified time: 2019-12-16 15:49:37
 * @Content: 3阶均匀B样条曲线
 */
import { IPoint } from "./types";
import { BSpline } from "./BSpline";

export class UniformBSpline {
  bSpline: BSpline;

  constructor(cPoints: IPoint[]) {
    this.bSpline = new BSpline({
      points: cPoints,
      order: 3,
      tArray: this.generateTArray(cPoints, 3),
    });
  }

  /**
   * 生成t取值边界的数组
   */
  generateTArray(cPoints: IPoint[], order: number): number[] {
    const arr: number[] = [];
    for (let i = 0; i < cPoints.length + order; i++) {
      arr.push(i);
    }
    return arr;
  }

  getPoints(step: number = 0.05): IPoint[] {
    const min = this.bSpline.tArray[0];
    const max = this.bSpline.tArray[this.bSpline.tArray.length - 1];
    const arr: IPoint[] = [];
    for (let i = min; i <= max; i += step) {
      arr.push(this.bSpline.getPoint(i));
    }
    return arr;
  }
}
