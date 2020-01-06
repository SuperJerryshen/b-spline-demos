import React from "react";
import { Radio } from "antd";
import { useHistory, useLocation } from "react-router-dom";

export default function RouterHeader() {
  const history = useHistory();
  const location = useLocation();
  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ textAlign: "center" }}>B样条曲线</h1>
      <Radio.Group
        value={location.pathname}
        onChange={e => {
          history.push(e.target.value);
        }}
      >
        <Radio.Button value="/uniform-b-spline-of-order-3">
          均匀3阶B样条
        </Radio.Button>
        <Radio.Button value="/open-uniform-b-spline">
          开放均匀B样条
        </Radio.Button>
        <Radio.Button value="/dynamic-b-spline">
          动态参数的B样条曲线
        </Radio.Button>
      </Radio.Group>
    </div>
  );
}
