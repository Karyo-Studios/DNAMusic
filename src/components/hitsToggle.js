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
        opacity: p.events > 1 ? 1 : 0.3,
        color: p.color,
        fontWeight: "bold",
        cursor: p.events > 1 ? 'pointer' : 'initial',
      }}
      rightStyle={{
        opacity: p.events < masterSteps ? 1 : 0.3,
        color: p.color,
        fontWeight: "bold",
        cursor:  p.events < masterSteps ? 'pointer' : 'initial',
      }}
      value={p.events}
    />
  );
};
