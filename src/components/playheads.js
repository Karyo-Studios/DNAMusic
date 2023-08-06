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
  counters,
}) => {
  return (
    <div>
      <div className="flex mt-[1rem] text-center text-[#aaa] select-none min-w-[1000px]">
        <p className="w-[7rem]">playhead</p>
        <p className="w-[6.5rem]">hits</p>
        <p className="w-[5rem]"></p>
        <p className="w-[18rem]"></p>
        <p className="w-[9rem]">period</p>
        <p className="w-[4rem]">octave</p>
        <p className="w-[7rem]">length</p>
      </div>
      {playheads.map((p, index) => {
        return (
          <div
            key={"playheads" + index}
            className="border-l-[0.5rem] relative mb-1 px-2 flex items-center"
            style={{
              borderColor: p.playing ? `${p.color}` : "rgba(0,0,0,0)",
              opacity: p.playing ? 1 : 0.6,
            }}
          >
            <button
              className="p-1 mr-2 w-[4.6rem] rounded-[0.25rem] bg-[#666] hover:bg-[#aaa]"
              onClick={() =>
                updatePlayhead(index, { ...p, playing: !p.playing })
              }
            >
              <div className="flex items-center justify-between">
                <p className="pl-2">{p.instrumentName}</p>
                <div className="w-[1.2rem] h-[1.2rem] mx-[0.25rem]">
                  {p.playing ? (
                    <svg
                      className="button"
                      viewBox="0 0 60 60"
                      style={{ fill: p.color }}
                    >
                      <polygon points="0,0 15,0 15,60 0,60" />
                      <polygon points="25,0 40,0 40,60 25,60" />
                    </svg>
                  ) : (
                    <svg
                      className="button"
                      viewBox="0 0 60 60"
                      style={{ fill: p.color }}
                    >
                      <polygon points="0,0 50,30 0,60" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
            <div className="flex hidden">
              <div className="px-3 w-[7rem] leading-[2rem]">
                Pos: {counters[index]}
              </div>
            </div>
            <div className="flex items-center">
              <p>|</p>
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
            <div className="px-[0.25rem]"></div>
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
            <PlayheadView
              p={p}
              playing={playing}
              ticker={ticker}
              masterSteps={masterSteps}
              index={index}
            />
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
            <div className="flex items-center">
              <SpeedToggle
                leftOnClick={() => {
                  updatePlayhead(index, {
                    ...p,
                    interval: p.interval / 2,
                  });
                }}
                rightOnClick={() => {
                  updatePlayhead(index, {
                    ...p,
                    interval: p.interval * 2,
                  });
                }}
                value={`${p.interval}`}
              />
              <SwitchButtonCenterText
                leftOnClick={() => {
                  updatePlayhead(index, {
                    ...p,
                    offset: p.offset - 12,
                  });
                }}
                rightOnClick={() => {
                  updatePlayhead(index, {
                    ...p,
                    offset: p.offset + 12,
                  });
                }}
                leftText={"-"}
                rightText={"+"}
                value={p.offset / 12}
              />
              <input
                type="range"
                className="w-[4rem]"
                min="0.1"
                max="1"
                value={p.legato}
                onChange={(e) => {
                  updatePlayhead(index, {
                    ...p,
                    legato: e.target.value,
                  });
                }}
                step="0.1"
                aria-label="bpm slider"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
