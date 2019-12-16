import React, { useRef, useEffect, useState } from "react";
import zrender from "zrender";
import { UniformBSpline } from "../../libs/UniformBSpline";
import { IPoint } from "../../libs/types";

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
      const bSpline = new UniformBSpline(points);
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
          const bSpline = new UniformBSpline(points);
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
