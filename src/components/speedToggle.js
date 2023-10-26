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
      padding: '0.16rem 0.3rem'
    }}
    rightStyle={{
      fontWeight: "bold",
      padding: '0.16rem 0.3rem'
    }}
    value={value}
  />;
};
