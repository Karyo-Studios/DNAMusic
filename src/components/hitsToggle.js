import React from "react";

import { SwitchButton } from "./switchButton";

export const HitsToggle = ({
  p,
  masterSteps,
  leftOnClick,
  rightOnClick,
}) => {
  return (
    <SwitchButton
      leftOnClick={leftOnClick}
      leftText="-"
      rightOnClick={rightOnClick}
      rightText="+"
      leftStyle={{
        opacity: p.events > 1 ? 1 : 0.3,
        color: p.color,
        fontWeight: "bold",
      }}
      rightStyle={{
        opacity: p.events < masterSteps ? 1 : 0.3,
        color: p.color,
        fontWeight: "bold",
      }}
    />
  );
};
