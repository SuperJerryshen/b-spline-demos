/*
 * @Author: 沈经纬(327538014@qq.com)
 * @Date: 2019-12-16 15:48:53
 * @Last Modified by: 沈经纬(327538014@qq.com)
 * @Last Modified time: 2019-12-16 15:49:37
 * @Content: 3阶均匀B样条曲线
 */
import { IPoint } from "./types";
import { BSplinePolynomial } from "./BSplinePolynomial";

export class UniformBSpline {
  /**
   * 阶数，表示3阶
   */
  order: number = 3;

  /**
   * t取值的最大值
   */
  maxT: number;

  /**
   * t取值的边界数组
   */
  tArray: number[];

  cPoints: IPoint[];

  tRange: [number, number];
  bSplinePolynomial: BSplinePolynomial;

  constructor(cPoints: IPoint[]) {
    this.cPoints = cPoints;
    this.maxT = cPoints.length + this.order;
    this.tArray = this.generateTArray();
    this.tRange = [this.order - 1, cPoints.length];
    this.bSplinePolynomial = new BSplinePolynomial(this.tArray, this.order);
  }

  /**
   * 生成t取值边界的数组
   */
  generateTArray(): number[] {
    const arr: number[] = [];
    for (let i = 0; i <= this.maxT; i++) {
      arr.push(i);
    }
    return arr;
  }

  getPoints(step: number = 0.05): IPoint[] {
    const [min, max] = this.tRange;
    const gens = this.cPoints.map((o, i) => this.bSplinePolynomial.get(i));
    const arr: IPoint[] = [];
    for (let i = min; i <= max; i += step) {
      const bi = gens.map(f => f(i));
      arr.push(
        this.cPoints.reduce(
          (prev, curr, index) => {
            const [prevx, prevy] = prev;
            const [currx, curry] = curr;
            return [prevx + currx * bi[index], prevy + curry * bi[index]];
          },
          [0, 0]
        )
      );
    }
    return arr;
  }
}
