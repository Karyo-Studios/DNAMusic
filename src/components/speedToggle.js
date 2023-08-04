import React from "react";

import { SwitchButtonCenterText } from "./switchButtonCenterText";

export const SpeedToggle = ({leftOnClick, rightOnClick, value}) => {
  return <SwitchButtonCenterText
    leftOnClick={leftOnClick}
    leftText="-"
    rightOnClick={rightOnClick}
    rightText="+"
    leftStyle={{
        width: "2rem",
      fontWeight: "bold",
    }}
    rightStyle={{
        width: "2rem",
      fontWeight: "bold",
    }}
    value={value}
  />;
};
