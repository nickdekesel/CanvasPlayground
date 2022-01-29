import React, { FunctionComponent } from "react";
import { FloorPlan } from "./components/FloorPlan";
import "./App.scss";

const App: FunctionComponent = () => {
  return (
    <div className="app">
      <FloorPlan />
    </div>
  );
};

export default App;
