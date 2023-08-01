import React from "react";

import { SwitchButton } from "./switchButton";

export const RotationToggle = ({p, masterSteps, leftOnClick, rightOnClick}) => {
  return <SwitchButton
    leftOnClick={leftOnClick}
    leftText="<"
    rightOnClick={rightOnClick}
    rightText=">"
    leftStyle={{
      opacity: p.rotation > 0 ? 1 : 0.3,
      color: p.color,
      fontWeight: "bold",
    }}
    rightStyle={{
      opacity: p.rotation < masterSteps - 1 ? 1 : 0.3,
      color: p.color,
      fontWeight: "bold",
    }}
  />;
};
