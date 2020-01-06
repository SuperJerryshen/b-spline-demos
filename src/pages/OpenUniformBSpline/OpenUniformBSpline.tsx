import React, { useEffect, useRef, useState } from "react";
import zrender from "zrender";
import { IPoint } from "../../libs/types";
import { OpenUniformBSplineClass } from "../../libs/OpenUnformBSplineClass";

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
      const bSpline = new OpenUniformBSplineClass(cPoints, 3);
      const points: IPoint[] = [];
      for (
        let i = 0;
        i <= bSpline.bSpline.tArray[bSpline.bSpline.tArray.length - 1];
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
          const newPoint = [e.offsetX, e.offsetY] as IPoint;
          cPoints[i] = newPoint;
          bSpline.updatePoint(i, newPoint);
          const points: IPoint[] = [];
          for (
            let i = 0;
            i <= bSpline.bSpline.tArray[bSpline.bSpline.tArray.length - 1];
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
        The open uniform b-spline-curve(开放均匀B样条曲线)
      </div>
      <div ref={elRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}
