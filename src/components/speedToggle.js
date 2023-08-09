import React from "react";

import { SwitchButtonCenterText } from "./switchButtonCenterText";

export const SpeedToggle = ({ leftOnClick, rightOnClick, value }) => {
  return <SwitchButtonCenterText
    leftOnClick={leftOnClick}
    leftText="-"
    rightOnClick={rightOnClick}
    rightText="+"
    leftStyle={{
      fontWeight: "bold",
    }}
    rightStyle={{
      fontWeight: "bold",
    }}
    value={value}
  />;
};
