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
    <div className="flex items-center">
      <button
        className={`font-bold bg-[#393939] hover:bg-[#666] 
      p-1
      border-[#222] w-[1.5rem] rounded-l-[0.25rem]`}
        style={leftStyle}
        onClick={leftOnClick}
      >
        {leftText}
      </button>
      <p className="font-bold bg-[#393939] py-1 w-[2rem] text-center">
        {value}
      </p>
      <button
        className="font-bold bg-[#393939] hover:bg-[#666] p-1 min-w-[2rem] rounded-r-[0.25rem]"
        style={rightStyle}
        onClick={rightOnClick}
      >
        {rightText}
      </button>
    </div>
  );
};
