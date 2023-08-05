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
        className={`font-bold bg-[#666] hover:bg-[#888] 
      p-1 ml-2
      border-[#444] w-[2rem] rounded-l-[0.25rem]`}
        style={leftStyle}
        onClick={leftOnClick}
      >
        {leftText}
      </button>
      <p className="font-bold bg-[#666] py-1 w-[2rem] text-center">
        {value}
      </p>
      <button
        className="font-bold bg-[#666] hover:bg-[#888] p-1 mr-1 min-w-[2rem] rounded-r-[0.25rem]"
        style={rightStyle}
        onClick={rightOnClick}
      >
        {rightText}
      </button>
    </div>
  );
};
