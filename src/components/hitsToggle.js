import React from "react";

import { SwitchButtonCenterText } from "./switchButtonCenterText";

export const HitsToggle = ({
  p,
  masterSteps,
  leftOnClick,
  rightOnClick,
}) => {
  return (
    <SwitchButtonCenterText
      leftOnClick={leftOnClick}
      leftText="-"
      rightOnClick={rightOnClick}
      rightText="+"
      leftStyle={{
        // color: p.color,
        fontWeight: "bold",
      }}
      rightStyle={{
        // color: p.color,
        fontWeight: "bold",
      }}
      value={p.events}
    />
  );
};
