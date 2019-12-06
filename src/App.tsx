import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import UniformBSplineOfOrderThree from "./pages/UniformBSplineOfOrderThree";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Link to="/uniform-b-spline-of-order-3">均匀3阶B样条曲线</Link>
      </div>
      <Switch>
        <Route
          path="/uniform-b-spline-of-order-3"
          component={UniformBSplineOfOrderThree}
        />
      </Switch>
    </Router>
  );
};

export default App;
