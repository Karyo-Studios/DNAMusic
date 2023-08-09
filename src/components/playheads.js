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
      <div className="flex mt-[0.5rem] text-center text-[#aaa] select-none min-w-[1000px] uppercase">
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
            className="relative mb-1 px-[1rem] flex items-center"
          >
            <div className="w-[5.25rem] mr-2 ">
              <button
                className="w-[5.25rem] p-1 rounded-[0.25rem] bg-[#555] box-sizing"
                style={{
                  // backgroundColor: `hsl(${p.hsl.h*360},${p.hsl.s*100}%,${p.hsl.l})`
                  backgroundColor: p.playing
                    ? `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${
                        p.hsl.l * 100
                      }%)`
                    : `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${
                        p.hsl.l * 100
                      }%, 0.2)`,
                    opacity: p.playing ? 1 : 0.7,
                  // border: `2px solid ${p.color}`,
                }}
                onClick={() =>
                  updatePlayhead(index, { ...p, playing: !p.playing })
                }
              >
                {p.playing ? `P${p.instrumentName}` : 'OFF'}
              </button>
            </div>
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
                    interval: (p.interval > 1 ?  p.interval - 1 : p.interval),
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
