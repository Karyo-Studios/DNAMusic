import ReactSlider from "react-slider";

import { SwitchButtonCenterText } from "./switchButtonCenterText";

export const AdditionalSettings = ({
  playheads,
  setSelectedPlayhead,
  updatePlayhead
}) => {
  return (
    <div>
      <div>
        <div className="flex pt-[0.5rem] pb-[0.25rem] text-center text-[#888] text-[0.8rem] select-none uppercase">
          <p className="w-[4rem]">octave</p>
          <p className="w-[4rem]">length</p>
        </div>
      </div>
      <div>
        {playheads.map((p, index) => {
          return <div
            key={"playheads" + index}
            className="relative mb-1 flex items-center"
          >
            
          </div>
        })}
      </div>
    </div>
  )
}