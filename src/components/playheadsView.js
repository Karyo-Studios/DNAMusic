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
  activeNotes,
  setMenu,
  menu,
  selectedPlayhead,
  setPlayheadCount,
  setShowHelp,
  showControls,
}) => {
  return (
    <div className="pt-[0.5rem]">
      <div className="flex">
        <div 
          classNames={!showControls && `select-none`}
        >
        <div className="flex pb-[0.25rem] text-center text-[#888] text-[0.8rem] select-none uppercase">
            <p className="w-[2.5rem]"></p>
            <p className="w-[3.5rem]">off/on</p>
            <p className="w-[17.5rem]">rhythm</p>
            <p className="w-[4rem]">beats</p>
            <p className="w-[3.8rem]">offset</p>
            {/* <p className="w-[4rem]">octave</p> */}
            {/* <p className="w-[4rem]">length</p> */}
          </div>
          {playheads.map((p, index) => {
            if (index >= playheadCount) return;
            return (
              <div
                key={"playheads" + index}
                className="relative mb-1 flex items-center text-center"
              >
                <button className="px-[0.75rem] ml-[0.5rem] py-[0.25rem]"
                  style={{
                    backgroundColor: selectedPlayhead === index ? p.color : 'rgba(0,0,0,0)',
                  }}
                  onClick={() => {
                    setMenu(1)
                    setShowHelp(false)
                    setSelectedPlayhead(index)
                  }}
                >
                  {index + 1}
                </button>
                <div className="mx-1 mr-[0.5rem]">
                  <ToggleButton
                    onClick={() => {
                      updatePlayhead(index, { ...p, playing: !p.playing });
                      setSelectedPlayhead(index);
                      setShowHelp(false)
                      setMenu(1);
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
                      setShowHelp(false)
                      if (p.events > 1) {
                        updatePlayhead(
                          index,
                          updateEuclid({ ...p, events: p.events - 1 })
                        );
                      }
                      setSelectedPlayhead(index);
                      setMenu(1);
                    }}
                    rightOnClick={() => {
                      if (p.events < masterSteps) {
                        updatePlayhead(
                          index,
                          updateEuclid({ ...p, events: p.events + 1 })
                        );
                      }
                      setSelectedPlayhead(index);
                      setMenu(1);
                    }}
                    p={p}
                    masterSteps={masterSteps}
                  />
                </div>
                <div className="ml-2">
                  <RotationToggle
                    onClick={() => {
                      setShowHelp(false)
                      updatePlayhead(
                        index,
                        updateEuclid({
                          ...p,
                          rotation:
                            p.rotation - 1 < 0 ? masterSteps - 1 : p.rotation - 1,
                        })
                      );
                      setSelectedPlayhead(index);
                      setMenu(1);
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
                      setShowHelp(false)
                      updatePlayhead(
                        index,
                        updateEuclid({
                          ...p,
                          rotation:
                            p.rotation + 1 >= masterSteps ? 0 : p.rotation + 1,
                        })
                      );
                      setSelectedPlayhead(index);
                      setMenu(1);
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
        {
          false &&
          <div className="pt-[1.5rem] relative h-full text-center text-[0.8rem] z-[99]">
            {playheads.map((p, index) => {
              if (index >= playheadCount) return;
              return (
                <div key={index} className="flex items-center relative">
                  <div className="mb-1">
                    <div
                      className="w-[0.7rem] h-[1.85rem] ml-[0.2rem] bg-[#181818]"
                      style={{
                        borderTop: '1px #999 solid',
                        borderBottom: '1px #999 solid',
                        opacity: menu === 1 && selectedPlayhead === index ? '1' : 0
                      }}
                    >
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
};
