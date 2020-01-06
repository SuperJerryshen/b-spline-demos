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
  tRange: [number, number];

  constructor(cPoints: IPoint[]) {
    this.bSpline = new BSpline({
      points: cPoints,
      order: 3,
      tArray: this.generateTArray(cPoints, 3),
    });
    /**
     * 其取值为order - 1至控制点数量
     */
    this.tRange = [2, cPoints.length];
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
    const [min, max] = this.tRange;
    const arr: IPoint[] = [];
    for (let i = min; i <= max; i += step) {
      arr.push(this.bSpline.getPoint(i));
    }
    return arr;
  }
}
