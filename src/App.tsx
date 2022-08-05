import React, { FunctionComponent } from "react";
import { FloorPlan } from "./components/FloorPlan";
import { SidePanel } from "./components/sidePanel/SidePanel";
import "./App.scss";

const App: FunctionComponent = () => {
  return (
    <div className="app">
      <SidePanel />
      <FloorPlan />
    </div>
  );
};

export default App;
