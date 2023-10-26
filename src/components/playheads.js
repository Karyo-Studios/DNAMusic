import { RotationToggle } from "./rotationToggle";
import { PlayheadView } from "./playheadView";
import { HitsToggle } from "./hitsToggle";
import { ToggleButton } from "./toggleButton";

import { updateEuclid } from "../playhead";

export const PlayheadsView = ({
  playheads,
  updatePlayhead,
  playing,
  ticker,
  masterSteps,
  playheadCount,
  width,
  setSelectedPlayhead,
  activeNotes
}) => {
  return (
    <div>
      <div className="flex pt-[0.5rem] pb-[0.25rem] text-center text-[#888] text-[0.8rem] select-none uppercase">
        <p className="w-[1.25rem]"></p>
        <p className="w-[3.5rem]">off/on</p>
        <p className="w-[17.75rem]">rhythm</p>
        <p className="w-[4rem]">#beats</p>
        <p className="w-[3.8rem]">offset</p>
        {/* <p className="w-[4rem]">octave</p> */}
        {/* <p className="w-[4rem]">length</p> */}
      </div>
      {playheads.map((p, index) => {
        if (index >= playheadCount) return;
        return (
          <div
            key={"playheads" + index}
            className="relative mb-1 flex items-center"
          >
            <div className="w-[1.25rem] px-[0.5rem]"
              style={{
                color: p.playing ? '#ffffff' : '#aaaaaa',
              }}
            >
              {index + 1}
            </div>
            <div className="mx-1 mr-[0.5rem]">
              <ToggleButton
                onClick={() => {
                  updatePlayhead(index, { ...p, playing: !p.playing });
                  setSelectedPlayhead(index);
                }}
                playhead={p}
                index={index}
                activeNotes={activeNotes}
              />
            </div>
            <PlayheadView
              p={p}
              playing={playing}
              ticker={ticker}
              masterSteps={masterSteps}
              index={index}
              width={width}
            />

            <div className="flex items-center ml-2">
              <HitsToggle
                leftOnClick={() => {
                  if (p.events > 1) {
                    updatePlayhead(
                      index,
                      updateEuclid({ ...p, events: p.events - 1 })
                    );
                  }
                  setSelectedPlayhead(index);
                }}
                rightOnClick={() => {
                  if (p.events < masterSteps) {
                    updatePlayhead(
                      index,
                      updateEuclid({ ...p, events: p.events + 1 })
                    );
                  }
                  setSelectedPlayhead(index);
                }}
                p={p}
                masterSteps={masterSteps}
              />
            </div>
            <div className="ml-2">
              <RotationToggle
                onClick={() => {
                  updatePlayhead(
                    index,
                    updateEuclid({
                      ...p,
                      rotation:
                        p.rotation - 1 < 0 ? masterSteps - 1 : p.rotation - 1,
                    })
                  );
                  setSelectedPlayhead(index);
                }}
                p={p}
                masterSteps={masterSteps}
              >
                {"<"}
              </RotationToggle>
            </div>
            <div className="ml-1 mr-2">
              <RotationToggle
                onClick={() => {
                  updatePlayhead(
                    index,
                    updateEuclid({
                      ...p,
                      rotation:
                        p.rotation + 1 >= masterSteps ? 0 : p.rotation + 1,
                    })
                  );
                  setSelectedPlayhead(index);
                }}
                p={p}
                masterSteps={masterSteps}
              >
                {">"}
              </RotationToggle>
            </div>
          </div>
        );
      })}
    </div>
  );
};
