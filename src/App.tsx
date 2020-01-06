import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import UniformBSplineOfOrderThree from "./pages/UniformBSplineOfOrderThree";
import OpenUniformBSpline from "./pages/OpenUniformBSpline";
import RouterHeader from "./components/RouterHeader";
import DynamicBSpline from "./pages/DynamicBSpline";

const App: React.FC = () => {
  return (
    <Router>
      <RouterHeader />
      <Switch>
        <Route
          path="/uniform-b-spline-of-order-3"
          component={UniformBSplineOfOrderThree}
        />
        <Route path="/open-uniform-b-spline" component={OpenUniformBSpline} />
        <Route path="/dynamic-b-spline" component={DynamicBSpline} />
      </Switch>
    </Router>
  );
};

export default App;
