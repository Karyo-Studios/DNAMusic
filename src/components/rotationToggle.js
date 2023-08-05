import React from "react";

import { SingleButton } from "./singleButton";

export const RotationToggle = ({ p, onClick, children }) => {
  return (
    <SingleButton
      onClick={onClick}
      buttonStyle={{
        color: p.color,
        fontWeight: "bold",
      }}
    >
      {children}
    </SingleButton>
  );
};
