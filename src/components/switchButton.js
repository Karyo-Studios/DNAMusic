import React from "react";

export const SwitchButton = ({
  leftText,
  leftOnClick,
  rightText,
  rightOnClick,
  leftStyle,
  rightStyle,
}) => {
  return (
    <div className="flex items-center">
      <button
        className={`font-bold bg-[#393939] hover:bg-[#666] 
      p-1 border-r-[0.05rem]
      border-[#333] w-[2rem] rounded-l-[0.25rem]`}
        style={leftStyle}
        onClick={leftOnClick}
      >
        {leftText}
      </button>
      <button
        className="font-bold bg-[#393939] hover:bg-[#666] p-1 w-[2rem] rounded-r-[0.25rem]"
        style={rightStyle}
        onClick={rightOnClick}
      >
        {rightText}
      </button>
    </div>
  );
};
