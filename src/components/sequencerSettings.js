import ReactSlider from "react-slider";

import { PlayPauseButton } from "./playPauseButton";
import { RemixButton } from "./remixButton";
import { SwitchButton } from "./switchButton";
import { updateEuclid } from "../playhead";
import { generatePattern } from "../helpers";

import { ToggleButton } from "./toggleButton";

export const SequencerSettings = ({
  playing,
  counter,
  play,
  pause,
  bpm,
  stop,
  updateTempo,
  setPlayheads,
  masterSteps,
  setMasterSteps,
  playheads,
  setNoteOffset,
  noteOffset,
  zoom,
  setZoom,
  activeSequence,
  setSequenceBounds,
  sequence,
  boundsRef,
  updatePlayhead,
  showControls,
  activeNotes,
}) => {
  return (
    <div className="flex z-[9999]">
      <div className="flex items-center pr-[0.25rem]" 
        style={{ 
          border: "1px white solid",
          width: showControls ? '37.5rem' : '55rem'
          }}>
        <PlayPauseButton
          playing={playing}
          counter={counter}
          play={() => {
            play();
          }}
          pause={pause}
          stop={stop}
        />
        <div>
          <div className="flex items-center justify-between items-end">
            <div className="flex items-center">
              <div className="leading-[1rem] text-[#888] w-[3rem] text-center">
                <p className="text-[0.7rem]">BPM</p>
                <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">{bpm/2}</p>
              </div>
              <div className=" rounded-[0.25rem] w-[5rem]">
                <ReactSlider
                  className="tempo-slider"
                  thumbClassName="tempo-thumb"
                  trackClassName="tempo-track"
                  min={60}
                  max={300}
                  step={1}
                  value={bpm}
                  onChange={(value) => {
                    updateTempo(value);
                  }}
                ></ReactSlider>
              </div>
              <div className="leading-[1rem] px-1 ml-[0.5rem] text-[#888] text-center">
                <p className="text-[0.7rem]">STEP</p>
                <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">
                  {masterSteps}
                </p>
              </div>
              <SwitchButton
                leftOnClick={() => {
                  if (masterSteps > 3) {
                    let updated = [];
                    for (let i = 0; i < playheads.length; i++) {
                      const cur = playheads[i];
                      updated.push(
                        updateEuclid({
                          ...cur,
                          steps: masterSteps - 1,
                        })
                      );
                    }
                    setPlayheads(updated);
                    setMasterSteps(masterSteps - 1);
                  }
                }}
                rightOnClick={() => {
                  if (masterSteps < 16) {
                    let updated = [];
                    for (let i = 0; i < playheads.length; i++) {
                      const cur = playheads[i];
                      updated.push(
                        updateEuclid({
                          ...cur,
                          steps: masterSteps + 1,
                        })
                      );
                    }
                    setPlayheads(updated);
                    setMasterSteps(masterSteps + 1);
                  }
                }}
                leftStyle={{
                  opacity: masterSteps > 3 ? 1 : 0.3,
                  fontWeight: "bold",
                }}
                rightStyle={{
                  opacity: masterSteps < 16 ? 1 : 0.3,
                  fontWeight: "bold",
                }}
                leftText={"<"}
                rightText={">"}
              />
              <div className="leading-[1rem] ml-[0.25rem] px-2 text-[#888] text-center">
                <p className="text-[0.7rem]">KEY</p>
                <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">
                  {noteOffset}
                </p>
              </div>
              <SwitchButton
                leftOnClick={() =>
                  setNoteOffset(noteOffset > -12 ? noteOffset - 1 : noteOffset)
                }
                rightOnClick={() =>
                  setNoteOffset(noteOffset < 12 ? noteOffset + 1 : noteOffset)
                }
                leftText={"-"}
                rightText={"+"}
              />
            </div>
            <div className="leading-[1rem] ml-[0.125rem] pl-[0.5rem] pr-[0.25rem] text-[#888] w-[2.7rem] text-center">
              <p className="text-[0.7rem]">ZOOM</p>
              <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">
                {zoom.toFixed(2)}
              </p>
            </div>
            <div className="rounded-[0.25rem] w-[5rem] mr-[0.3rem]">
              <ReactSlider
                className="tempo-slider"
                thumbClassName="tempo-thumb"
                trackClassName="tempo-track"
                min={0.3}
                max={1}
                step={0.01}
                value={zoom}
                onChange={(value) => {
                  setZoom(value);
                }}
              ></ReactSlider>
            </div>
          </div>
        </div>
        {!showControls && (
          <div
            className="flex ml-[0.5rem] p-[0.25rem]"
            style={{
              // border: '2px red dotted',
              borderLeft: '1px white solid'
            }}
          >
            {playheads.map((p, index) => {
              return (
                <div key={index} className="ml-[0.25rem]">
                  <ToggleButton
                    onClick={() => {
                      updatePlayhead(index, { ...p, playing: !p.playing });
                    }}
                    playhead={p}
                    index={index}
                    activeNotes={activeNotes}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
