import React from "react";

import { SingleButton } from "./singleButton";

export const RotationToggle = ({ p, masterSteps, onClick }) => {
  return (
    <SingleButton
      onClick={onClick}
      buttonStyle={{
        opacity: p.rotation < masterSteps - 1 ? 1 : 0.3,
        color: p.color,
        fontWeight: "bold",
      }}
    >
      {">"}
    </SingleButton>
  );
};
