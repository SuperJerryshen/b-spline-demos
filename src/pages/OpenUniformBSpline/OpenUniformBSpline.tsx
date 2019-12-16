import React, { useEffect, useRef, useState } from "react";
import zrender from "zrender";
import { IPoint } from "../UniformBSplineOfOrderThree/UniformBSplineOfOrderThree";

type IPolynomialFunc = (t: number) => number;

const getDividedValue = (numerator: number, denominator: number) => {
  if (denominator === 0) {
    return 0;
  } else {
    return numerator / denominator;
  }
};

class BSplinePolynomial {
  order: number;
  tArray: number[];
  maxIndex: number;
  cache: Map<number, IPolynomialFunc> = new Map();
  polynomialArray: BSplinePolynomial[] = [];

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
      // throw new Error(
      //   `index(${index}) cannot be greater than the max index(${this.maxIndex})`
      // );
      return () => 0;
    }
    const cacheFunc = this.cache.get(index);
    if (cacheFunc) {
      return cacheFunc;
    }
    if (this.order === 1) {
      return this.getFuncByOrderOne(index);
    } else {
      return this.getFuncByOrderGreaterThanOne(index);
    }
  }

  /**
   * if order is equal to 1, return the function of 't'.
   * @param index
   */
  private getFuncByOrderOne(index: number): IPolynomialFunc {
    const func = (t: number) => {
      if (t >= this.tArray[index] && t < this.tArray[index + 1]) {
        return 1;
      } else {
        return 0;
      }
    };
    this.cache.set(index, func);
    return func;
  }

  private getFuncByOrderGreaterThanOne(index: number): IPolynomialFunc {
    const tList = this.tArray;
    const order = this.order;
    const polynomialIndexSubtractOne = this.polynomialArray[order - 1];
    const func = (t: number) => {
      return (
        getDividedValue(
          t - tList[index],
          tList[index + order - 1] - tList[index]
        ) *
          polynomialIndexSubtractOne.get(index)(t) +
        getDividedValue(
          tList[index + order] - t,
          tList[index + order] - tList[index + 1]
        ) *
          polynomialIndexSubtractOne.get(index + 1)(t)
      );
    };
    return func;
  }
}

class BSpline {
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

export default function OpenUniformBSpline() {
  const elRef = useRef<HTMLDivElement>(null);
  const [z, setZ] = useState<any>(null);

  useEffect(() => {
    if (elRef.current && z == null) {
      setZ(zrender.init(elRef.current, { renderer: "canvas" }));
    }
    // eslint-disable-next-line
  }, [elRef.current]);

  useEffect(() => {
    if (z) {
      const cPoints: IPoint[] = [
        [50, 50],
        [100, 70],
        [80, 140],
        [100, 200],
        [160, 180],
        [200, 200],
        [200, 300],
        [300, 200],
        [400, 400],
      ];
      const bSpline = new BSpline(cPoints, 3);
      const points: IPoint[] = [];
      for (
        let i = 0;
        i <= bSpline.tArray[bSpline.tArray.length - 1];
        i += 0.01
      ) {
        const p = bSpline.getPoint(i);
        points.push(p);
      }
      let line = new zrender.Polyline({
        shape: {
          points,
        },
      });
      z.add(line);

      cPoints.forEach((o, i) => {
        const circle = new zrender.Circle({
          shape: {
            cx: o[0],
            cy: o[1],
            r: 3,
          },
          draggable: true,
        });
        circle.on("drag", (e: any) => {
          cPoints[i] = [e.offsetX, e.offsetY] as IPoint;
          const bSpline = new BSpline(cPoints, 3);
          const points: IPoint[] = [];
          for (
            let i = 0;
            i <= bSpline.tArray[bSpline.tArray.length - 1];
            i += 0.01
          ) {
            const p = bSpline.getPoint(i);
            points.push(p);
          }
          line.shape.points = points;
          line.dirty();
        });
        z.add(circle);
      });
    }
  }, [z]);
  return (
    <div style={{ padding: "32px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        开放均匀B样条曲线
      </div>
      <div ref={elRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}
