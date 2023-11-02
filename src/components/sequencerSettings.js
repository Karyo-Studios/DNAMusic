import ReactSlider from "react-slider";

import { PlayPauseButton } from "./playPauseButton";
import { RemixButton } from "./remixButton";
import { SwitchButton } from "./switchButton";
import { updateEuclid } from "../playhead";
import { generatePattern } from "../helpers";

import { ToggleVerticalButton } from "./toggleVerticalButton";

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
  updatePlayhead,
  showControls,
  setShowControls,
  activeNotes,
  setShowControlsTransition,
  setShowHelp,
}) => {
  return (
    <div className="flex z-[9999]">
      <div className="flex items-center justify-between"
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
          showControls={showControls}
        />
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!showControls && (
                <div
                  className="flex"
                >
                  {playheads.map((p, index) => {
                    return (
                      <div key={index} className="">
                        <ToggleVerticalButton
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
              <div className="flex mr-[2rem] items-center">
                <div className="leading-[1rem] text-[#888] w-[3rem] text-center"
                  style={{ marginLeft: showControls ? '0rem' : '0.5rem' }}
                >
                  <p className="text-[0.7rem]">BPM</p>
                  <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">{bpm / 2}</p>
                </div>
                <div className="rounded-[0.25rem]"
                  style={{
                    width: showControls ? '8rem' : '10rem',
                    marginRight: showControls ? '0rem' : '1.25rem',
                  }}
                >
                  <ReactSlider
                    className={showControls ? 'tempo-slider' : 'tempo-slider expanded'}
                    thumbClassName={showControls ? 'tempo-thumb' : 'tempo-thumb expanded'}
                    trackClassName={showControls ? 'tempo-track' : 'tempo-track expanded'}
                    min={60}
                    max={300}
                    step={1}
                    value={bpm}
                    onChange={(value) => {
                      updateTempo(value);
                    }}
                  ></ReactSlider>
                </div>
              </div>
              {
                showControls && <div className="flex items-center mr-[1rem]">
                  <div className="leading-[1rem] px-1 ml-[0.5rem] text-[#888] text-center">
                    <p className="text-[0.7rem]">METER</p>
                    <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">
                      {masterSteps}/4
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
                </div>
              }
            </div>

            {
              false && <div className="flex items-center">
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
            }
            <button
              className="bg-[#232323] hover:bg-[#353535] w-[3.5rem] text-[1.2rem]"
              onClick={() => {
                // setShowHelp(false);
                setShowControls(!showControls);
                setShowControlsTransition(true);
                setTimeout(() => {
                  setShowControlsTransition(false);
                }, 400);
              }}
              style={{
                borderLeft: '1px white solid',
                height: showControls ? '2.5rem' : '3.5rem'
              }}
            >
              <div className="w-[1.4rem] h-[1.4rem] m-auto"
                style={{
                  transform: showControls ? 'rotate(180deg)' : 'rotate(0)'
                }}
              >
                <svg viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_317_1325" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="39" height="39">
                    <rect x="0.619141" y="0.574219" width="38.335" height="38.335" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_317_1325)">
                    <mask id="mask1_317_1325" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="21" width="39" height="15">
                      <rect width="38.2188" height="14.0137" transform="matrix(1 0 0 -1 0.677734 35.0669)" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask1_317_1325)">
                      <rect width="22.3832" height="5.39961" transform="matrix(0.785731 0.618568 -0.785731 0.618568 20.5215 21.2012)" fill="white" />
                      <rect width="22.3832" height="5.39961" transform="matrix(-0.785731 0.618568 -0.785731 -0.618568 24.7646 24.5425)" fill="white" />
                    </g>
                    <mask id="mask2_317_1325" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="4" width="39" height="15">
                      <rect width="38.2188" height="14.0137" transform="matrix(1 0 0 -1 0.677734 18.4307)" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask2_317_1325)">
                      <rect width="22.3832" height="5.39961" transform="matrix(0.785731 0.618568 -0.785731 0.618568 20.5215 4.56494)" fill="white" />
                      <rect width="22.3832" height="5.39961" transform="matrix(-0.785731 0.618568 -0.785731 -0.618568 24.7646 7.90625)" fill="white" />
                    </g>
                  </g>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
