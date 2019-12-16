import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import UniformBSplineOfOrderThree from "./pages/UniformBSplineOfOrderThree";
import OpenUniformBSpline from "./pages/OpenUniformBSpline";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Link to="/uniform-b-spline-of-order-3">均匀3阶B样条曲线</Link>
        <Link to="/open-uniform-b-spline">开放均匀B样条曲线</Link>
      </div>
      <Switch>
        <Route
          path="/uniform-b-spline-of-order-3"
          component={UniformBSplineOfOrderThree}
        />
        <Route path="/open-uniform-b-spline" component={OpenUniformBSpline} />
      </Switch>
    </Router>
  );
};

export default App;
