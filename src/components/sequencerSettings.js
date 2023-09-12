import ReactSlider from "react-slider";

import { PlayPauseButton } from './playPauseButton';
import { RemixButton } from "./remixButton";
import { SwitchButton } from "./switchButton";
import { updateEuclid } from "../playhead";
import { generatePattern } from "../helpers";

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
  setShowOnlyActive,
  showOnlyActive,
}) => {
  return <div className="flex">
    <div className="">
      <PlayPauseButton
        playing={playing}
        counter={counter}
        play={() => {
          play();
        }}
        pause={pause}
        stop={stop}
      />
    </div>
    <div className="flex items-center">
      <div>
        <div className="flex items-center justify-start items-end">
          <div className="flex items-center">
            <div className="leading-[1rem] px-2 text-[#888] w-[2.9rem] text-center">
              <p className="text-[0.7rem]">BPM</p>
              <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">
                {bpm}
              </p>
            </div>
            <div className=" rounded-[0.25rem] w-[8rem]">
              <ReactSlider
                className="tempo-slider"
                thumbClassName="tempo-thumb"
                trackClassName="tempo-track"
                min={20}
                max={260}
                step={1}
                value={bpm}
                onChange={(value) => {
                  updateTempo(value);
                }}
              ></ReactSlider>
            </div>
            <div className="flex items-center">
              <RemixButton
                generatePattern={() =>
                  generatePattern({
                    playheads,
                    updateTempo,
                    setNoteOffset,
                    setMasterSteps,
                    setPlayheads,
                  })
                }
              />
            </div>
            <div className="leading-[1rem] px-1 text-[#888] text-center">
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
                setNoteOffset(
                  noteOffset > -12 ? noteOffset - 1 : noteOffset
                )
              }
              rightOnClick={() =>
                setNoteOffset(
                  noteOffset < 12 ? noteOffset + 1 : noteOffset
                )
              }
              leftText={"-"}
              rightText={"+"}
            />
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex items-center justify-stretch">
          <div className="flex items-center justify-end ">
            <div className="zoom flex justify-end">
              <div className="rounded-[0.25rem] w-[5rem] ml-[0.5rem]">
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
            {activeSequence.length < sequence.length && (
              <div className="flex ml-[0.5rem]">
                <button
                  onClick={() => {
                    setSequenceBounds([0, sequence.length]);
                    boundsRef.current = [0, sequence.length];
                  }}
                  className="uppercase rounded-[0.25rem] mr-2"
                >
                  Reset
                </button>
                <p className="text-[#888] uppercase">View:&nbsp;</p>
                <button
                  onClick={() => setShowOnlyActive(!showOnlyActive)}
                  className="uppercase rounded-[0.25rem]"
                >
                  {showOnlyActive ? "active" : "all"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
} 