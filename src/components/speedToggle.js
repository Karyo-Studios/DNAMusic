import React from "react";

import { SwitchButton } from "./switchButton";

export const SpeedToggle = ({leftOnClick, rightOnClick}) => {
  return <SwitchButton
    leftOnClick={leftOnClick}
    leftText="/2"
    rightOnClick={rightOnClick}
    rightText="x2"
    leftStyle={{
        width: "3rem",
      fontWeight: "bold",
    }}
    rightStyle={{
        width: "3rem",
      fontWeight: "bold",
    }}
  />;
};
