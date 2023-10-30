import React from "react";

export const SwitchButtonCenterText = ({
  leftText,
  leftOnClick,
  rightText,
  rightOnClick,
  leftStyle,
  rightStyle,
  value,
}) => {
  return (
    <div className="flex items-center select-none">
      <div className="relative flex w-[3.7rem]">
        <button
          className={`font-bold bg-[#232323] hover:bg-[#353535] py-[0.25rem] px-2 w-[1.85rem] text-left rounded-l-[0.25rem]`}
          style={leftStyle}
          onClick={leftOnClick}
        >
          {leftText}
        </button>
        <button
          className="font-bold bg-[#232323] hover:bg-[#353535] text-right py-[0.25rem] px-2 w-[1.85rem] rounded-r-[0.25rem]"
          style={rightStyle}
          onClick={rightOnClick}
        >
          {rightText}
        </button>
        <p className="absolute top-[0] w-[3.7rem] pointer-events-none font-bold py-[0.25rem] text-center">
          {value}
        </p>
      </div>
    </div>
  );
};
