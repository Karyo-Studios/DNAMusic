import ReactSlider from "react-slider";

import { RotationToggle } from "./rotationToggle";
import { PlayheadView } from "./playheadView";
import { HitsToggle } from "./hitsToggle";
import { SpeedToggle } from "./speedToggle";
import { SwitchButtonCenterText } from "./switchButtonCenterText";

import { updateEuclid } from "../playhead";

export const PlayheadsView = ({
  playheads,
  updatePlayhead,
  playing,
  ticker,
  masterSteps,
  playheadCount,
  width,
}) => {
  return (
    <div>
      <div className="flex pt-[0.5rem] pb-[0.25rem] text-center text-[#888] text-[0.8rem] select-none uppercase">
        <p className="w-[4.5rem]">events</p>
        <p className="w-[2rem]"></p>
        <p className="w-[17rem]">pattern</p>
        <p className="w-[2rem]"></p>
        <p className="w-[4rem]">period</p>
        <p className="w-[4.2rem]">octave</p>
        <p className="w-[4rem]">length</p>
      </div>
      {playheads.map((p, index) => {
        if (index >= playheadCount) return;
        return (
          <div
            key={"playheads" + index}
            className="relative mb-1 flex items-center"
          >
            <div className="flex items-center ml-2">
              <HitsToggle
                leftOnClick={() => {
                  if (p.events > 1) {
                    updatePlayhead(
                      index,
                      updateEuclid({ ...p, events: p.events - 1 })
                    );
                  }
                }}
                rightOnClick={() => {
                  if (p.events < masterSteps) {
                    updatePlayhead(
                      index,
                      updateEuclid({ ...p, events: p.events + 1 })
                    );
                  }
                }}
                p={p}
                masterSteps={masterSteps}
              />
            </div>
            <div className="ml-2 mr-1">
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
                }}
                p={p}
                masterSteps={masterSteps}
              >
                {"<"}
              </RotationToggle>
            </div>
            <PlayheadView
              p={p}
              playing={playing}
              ticker={ticker}
              masterSteps={masterSteps}
              index={index}
              width={width}
            />
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
                }}
                p={p}
                masterSteps={masterSteps}
              >
                {">"}
              </RotationToggle>
            </div>
            <div className="flex items-center">
              <div className="mr-1">
                <SpeedToggle
                  leftOnClick={() => {
                    updatePlayhead(index, {
                      ...p,
                      interval: p.interval > 1 ? p.interval - 1 : p.interval,
                    });
                  }}
                  rightOnClick={() => {
                    updatePlayhead(index, {
                      ...p,
                      interval: p.interval + 1,
                    });
                  }}
                  value={`${p.interval}`}
                />
              </div>
              <div>
                <SwitchButtonCenterText
                  leftOnClick={() => {
                    updatePlayhead(index, {
                      ...p,
                      offset: p.offset > -4 * 12 ? p.offset - 12 : p.offset,
                    });
                  }}
                  rightOnClick={() => {
                    updatePlayhead(index, {
                      ...p,
                      offset: p.offset < 4 * 12 ? p.offset + 12 : p.offset,
                    });
                  }}
                  leftText={"-"}
                  rightText={"+"}
                  value={p.offset / 12}
                />
              </div>
              <div className="ml-1 bg-[#393939] rounded-[0.25rem] w-[4rem]">
                <ReactSlider
                  className="length-slider"
                  thumbClassName="length-thumb"
                  trackClassName="length-track"
                  min={0.1}
                  max={1}
                  value={p.legato}
                  step={0.1}
                  onChange={(value) => {
                    updatePlayhead(index, {
                      ...p,
                      legato: value,
                    });
                  }}
                  renderThumb={(props, state) => <div {...props}></div>}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
