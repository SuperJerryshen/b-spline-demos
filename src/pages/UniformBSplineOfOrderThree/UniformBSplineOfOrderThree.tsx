import React, { useRef, useEffect, useState } from "react";
import zrender from "zrender";

interface IFactorType {}

export type IPoint = [number, number];

const getDividedValue = (numerator: number, denominator: number) => {
  if (denominator === 0) {
    return 0;
  } else {
    return numerator / denominator;
  }
};

class BSpline {
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

  factorArray: IFactorType[];

  cPoints: IPoint[];

  tRange: [number, number];

  constructor(cPoints: IPoint[]) {
    this.cPoints = cPoints;
    this.maxT = cPoints.length + this.order;
    this.tArray = this.generateTArray();
    this.factorArray = [];
    this.tRange = [this.order - 1, cPoints.length];
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

  getPoints(): IPoint[] {
    const [min, max] = this.tRange;
    const gens = this.cPoints.map((o, i) => this.getFactorGenerator(i));
    const arr: IPoint[] = [];
    const step = 0.1;
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

  /**
   * 获得多项式系数
   */
  getFactorGenerator(k: number) {
    const t_k = this.tArray[k];
    const t_k_1 = this.tArray[k + 1];
    const t_k_2 = this.tArray[k + 2];
    const t_k_3 = this.tArray[k + 3];
    return (t: number) => {
      if (t < t_k || t >= t_k_3) {
        return 0;
      }
      if (t < t_k_1) {
        return (
          getDividedValue(t - t_k, t_k_2 - t_k) *
          getDividedValue(t - t_k, t_k_1 - t_k)
        );
      } else if (t < t_k_2) {
        return (
          getDividedValue(t - t_k, t_k_2 - t_k) *
            getDividedValue(t_k_2 - t, t_k_2 - t_k_1) +
          getDividedValue(t_k_3 - t, t_k_3 - t_k_1) *
            getDividedValue(t - t_k_1, t_k_2 - t_k_1)
        );
      } else if (t < t_k_3) {
        return (
          getDividedValue(t_k_3 - t, t_k_3 - t_k_1) *
          getDividedValue(t_k_3 - t, t_k_3 - t_k_2)
        );
      } else {
        return 0;
      }
    };
  }
}

let points: IPoint[] = [
  [50, 10],
  [100, 30],
  [200, 60],
  [300, 300],
  [150, 200],
  [100, 150],
  [50, 100],
];

export default function UniformBSplineOfOrderThree() {
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
      const bSpline = new BSpline(points);
      const linePoints = bSpline.getPoints();
      let line = new zrender.Polyline({
        shape: {
          points: linePoints,
        },
      });
      z.add(line);

      points.forEach((o, i) => {
        const circle = new zrender.Circle({
          shape: {
            cx: o[0],
            cy: o[1],
            r: 3,
          },
          draggable: true,
        });
        circle.on("drag", (e: any) => {
          points[i] = [e.offsetX, e.offsetY] as IPoint;
          const bSpline = new BSpline(points);
          const linePoints = bSpline.getPoints();
          line.shape.points = linePoints;
          line.dirty();
        });
        z.add(circle);
      });
    }
  }, [z]);

  return (
    <div style={{ padding: "32px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        均匀三阶B样条曲线
      </div>
      <div ref={elRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}
