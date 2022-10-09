import React, { FunctionComponent } from "react";
import { FloorPlan } from "components/floorPlan/FloorPlan";
import { SidePanel } from "components/sidePanel/SidePanel";
import { Cropper } from "components/cropper/Cropper";
import "./App.scss";

const App: FunctionComponent = () => {
  return (
    <div className="app">
      {/* <SidePanel />
      <FloorPlan /> */}
      <Cropper />
    </div>
  );
};

export default App;
