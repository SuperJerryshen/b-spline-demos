import React, { useRef, useState, useEffect } from "react";
import zrender from "zrender";
import { map, cloneDeep } from "lodash";
import { IPoint } from "../../libs/types";
import { Form, InputNumber, Button, notification } from "antd";
import { BSpline } from "../../libs/BSpline";

const DEFAULT_C_POINTS: IPoint[] = [
  [50, 50],
  [100, 70],
  [200, 200],
  [200, 300],
  [400, 400],
];
const DEFAULT_T_ARRAY: number[] = [0, 0, 0, 1, 2, 3, 3, 3];

export default function DynamicBSpline() {
  const elRef = useRef<HTMLDivElement>(null);
  const [z, setZ] = useState<any>(null);
  const [order, setOrder] = useState<number | undefined>(3);
  const [cPoints, setCPoints] = useState<IPoint[]>(cloneDeep(DEFAULT_C_POINTS));
  const [tArray, setTArray] = useState<number[]>(cloneDeep(DEFAULT_T_ARRAY));

  useEffect(() => {
    if (elRef.current && z == null) {
      setZ(zrender.init(elRef.current, { renderer: "canvas" }));
    }
    // eslint-disable-next-line
  }, [elRef.current]);

  const handleGenerate = () => {
    if (z == null || order == null) {
      return;
    }
    z.clear();
    try {
      const bSpline = new BSpline({
        points: cloneDeep(cPoints),
        tArray,
        order,
      });
      const points: IPoint[] = [];
      for (
        let i = 0;
        i <= bSpline.tArray[bSpline.tArray.length - 1];
        i += 0.05
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
          bSpline.updatePoint(i, newPoint);
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
    } catch (error) {
      notification.error({ message: "绘制错误", description: error.message });
    }
  };

  const handleReset = () => {
    setOrder(3);
    setCPoints(cloneDeep(DEFAULT_C_POINTS));
    setTArray(cloneDeep(DEFAULT_T_ARRAY));
    handleGenerate();
  };

  useEffect(() => {
    if (z) {
      handleGenerate();
    }
    // eslint-disable-next-line
  }, [z]);

  useEffect(() => {
    if (order) {
      const len = order + cPoints.length;
      if (len !== tArray.length) {
        const newTArray = cloneDeep(tArray);
        newTArray.length = len;
        for (let i = 0; i < len; i += 1) {
          if (newTArray[i] === undefined) {
            newTArray[i] = tArray[tArray.length - 1];
          }
        }
        console.log(newTArray);
        setTArray(newTArray);
      }
    }
    // eslint-disable-next-line
  }, [order, cPoints]);

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        自由参数的B样条曲线（默认为开放均匀三阶B样条）
      </div>
      <Form layout="inline">
        <Form.Item label="阶数">
          <InputNumber step={1} min={2} value={order} onChange={setOrder} />
        </Form.Item>
        <Form.Item label="控制点">
          <div style={{ textAlign: "center" }}>
            {map(cPoints, (cp, index) => {
              return (
                <div
                  style={{ display: "flex", marginBottom: "6px" }}
                  key={index}
                >
                  <div style={{ paddingRight: "6px" }}>
                    x<sub>{index}</sub>{" "}
                    <InputNumber
                      value={cp[0]}
                      onChange={e => {
                        cPoints[index][0] = e || 0;
                        setCPoints([...cPoints]);
                      }}
                    />
                  </div>
                  <div>
                    y<sub>{index}</sub>{" "}
                    <InputNumber
                      value={cp[1]}
                      onChange={e => {
                        cPoints[index][1] = e || 0;
                        setCPoints([...cPoints]);
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <Button
              onClick={() => {
                cPoints.push([0, 0]);
                setCPoints([...cPoints]);
              }}
              style={{ marginTop: "16px" }}
            >
              添加控制点
            </Button>
          </div>
        </Form.Item>
        <Form.Item label="参数t数组">
          <>
            {map(tArray, (t, index) => {
              return (
                <div style={{ marginBottom: "6px" }} key={index}>
                  t<sub>{index}</sub>:{" "}
                  <InputNumber
                    value={t}
                    onChange={e => {
                      tArray[index] = e || 0;
                      setTArray([...tArray]);
                    }}
                  />
                </div>
              );
            })}
          </>
        </Form.Item>

        <Form.Item>
          <Button.Group>
            <Button type="primary" onClick={handleGenerate}>
              生成
            </Button>
            <Button type="danger" onClick={handleReset}>
              重置
            </Button>
          </Button.Group>
        </Form.Item>
      </Form>
      <div ref={elRef} style={{ width: "100%", height: "600px" }} />
    </div>
  );
}
