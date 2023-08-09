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
          className={`font-bold bg-[#393939] hover:bg-[#444] py-1 px-2 w-[1.85rem] text-left rounded-l-[0.25rem]`}
          style={leftStyle}
          onClick={leftOnClick}
        >
          {leftText}
        </button>
        <button
          className="font-bold bg-[#393939] text-right hover:bg-[#444] py-1 px-2 w-[1.85rem] rounded-r-[0.25rem]"
          style={rightStyle}
          onClick={rightOnClick}
        >
          {rightText}
        </button>
        <p className="absolute top-[0] w-[3.7rem] pointer-events-none font-bold py-1 text-center">
          {value}
        </p>
      </div>
    </div>
  );
};
