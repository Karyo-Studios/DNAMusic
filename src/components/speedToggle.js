import React from "react";

import { SwitchButton } from "./switchButton";

export const SpeedToggle = ({leftOnClick, rightOnClick}) => {
  return <SwitchButton
    leftOnClick={leftOnClick}
    leftText="x2"
    rightOnClick={rightOnClick}
    rightText="/2"
    leftStyle={{
        width: "2rem",
      fontWeight: "bold",
    }}
    rightStyle={{
        width: "2rem",
      fontWeight: "bold",
    }}
  />;
};
