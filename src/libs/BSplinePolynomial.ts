/*
 * @Author: 沈经纬(327538014@qq.com)
 * @Date: 2019-12-16 15:37:00
 * @Last Modified by: 沈经纬(327538014@qq.com)
 * @Last Modified time: 2019-12-16 15:48:09
 * @Content: B样条曲线多项式求值器
 */
import { getDividedValue } from "../utils/math";

type IPolynomialFunc = (t: number) => number;

export class BSplinePolynomial {
  /**
   * 多项式阶数
   */
  readonly order: number;
  readonly tArray: number[];
  readonly maxIndex: number;
  private cache: Map<number, IPolynomialFunc> = new Map();
  private polynomialArray: BSplinePolynomial[] = [];

  /**
   * @param tArray 多项式取值边界点
   * @param order 多项式阶数（例如3阶则为2次，5阶则为4次）
   */
  constructor(tArray: number[], order: number) {
    this.tArray = tArray;
    this.order = order;
    this.maxIndex = tArray.length - order;
    for (let i = 0; i < order; i += 1) {
      this.polynomialArray.push(new BSplinePolynomial(this.tArray, i));
    }
  }

  get(index: number): IPolynomialFunc {
    if (index > this.maxIndex) {
      return () => 0;
    }
    const cacheFunc = this.cache.get(index);
    if (cacheFunc) {
      return cacheFunc;
    }
    return this.getPolynomialFunc(index);
  }

  /**
   * 获取多项式求值函数，返回一个接受t参数的函数
   * @param index 即公式中k值
   */
  private getPolynomialFunc(index: number): IPolynomialFunc {
    const tList = this.tArray;
    const order = this.order;
    const polynomialIndexSubtractOne = this.polynomialArray[order - 1];
    let func: IPolynomialFunc;
    if (order === 1) {
      func = (t: number) => {
        if (t >= this.tArray[index] && t < this.tArray[index + 1]) {
          return 1;
        } else {
          return 0;
        }
      };
    } else {
      const k1 = tList[index + order - 1] - tList[index];
      const k2 = tList[index + order] - tList[index + 1];
      func = (t: number) => {
        return (
          getDividedValue(t - tList[index], k1) *
            polynomialIndexSubtractOne.get(index)(t) +
          getDividedValue(tList[index + order] - t, k2) *
            polynomialIndexSubtractOne.get(index + 1)(t)
        );
      };
    }
    this.cache.set(index, func);
    return func;
  }
}
