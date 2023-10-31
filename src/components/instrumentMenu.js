import ReactSlider from "react-slider";

import { SwitchButtonCenterText } from "./switchButtonCenterText";

import { SpeedToggle } from "./speedToggle";

export const InstrumentMenu = ({
  playheads,
  selectedPlayhead,
  updatePlayhead,
  WebMidi,
  presetMappings,
  playheadCount,
  setSelectedPlayhead,
  updatePlayer
}) => {
  const p = playheads[selectedPlayhead]
  return <div className="w-[16.5rem] px-[0.5rem]">
    <div className="w-full my-[0.5rem] pt-[0.125rem] pb-[0.125rem] text-center text-[0.8rem] select-none uppercase text-[#fff]"
      style={{
        // backgroundColor: p.color,
      }}
    >
      Playhead {selectedPlayhead + 1}
    </div>
    <div className="flex">
      <div className=" flex">
        <div className="h-[8.5rem] w-[8.2rem]"
          style={{border: '1px white solid'}}
        >
          {p.midiEnabled ? (
            <div>
              <div className="flex flex-col overflow-y-scroll h-[8.4rem] w-[8rem]">
                {WebMidi &&
                  WebMidi._outputs.map((midi, index) => {
                    return (
                      <button
                        key={midi._midiOutput.name}
                        className="text-left py-[0.05rem] px-[0.25rem] text-[0.8rem] w-full"
                        style={{
                          backgroundColor:
                            index ===
                              p
                                .midiOutputDevice.index
                              ? p.color
                              : "rgba(0,0,0,0)",
                        }}
                        onClick={() => {
                          updatePlayhead(selectedPlayhead, {
                            ...p,
                            midiOutputDevice: {
                              name: midi._midiOutput.name,
                              index,
                            },
                          });
                        }}
                      >
                        <p className="whitespace-nowrap overflow-hidden">
                          {index + 1}: {midi._midiOutput.name}
                        </p>
                      </button>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="">
              <div className="flex flex-wrap w-[8rem] h-[8.5rem] overflow-y-scroll rounded-[0.25rem]">
                {presetMappings.map((preset, index) => {
                  return (
                    <div key={index}>
                      <button
                        key={index}
                        className="text-left text-[0.8rem] w-[4rem] px-[0.25rem]"
                        style={{
                          backgroundColor:
                            presetMappings[index].name ===
                              p.preset
                              ? p.color
                              : "rgba(0,0,0,0)",
                        }}
                        onClick={() => {
                          updatePlayer(
                            selectedPlayhead,
                            presetMappings[index].name
                          );
                          updatePlayhead(selectedPlayhead, {
                            ...p,
                            preset: presetMappings[index].name,
                            offset: preset.octave * 12,
                            legato: preset.legato,
                            velocity: preset.velocity
                          });
                        }}
                      >
                        <p className="whitespace-nowrap overflow-hidden">
                          {preset.name}
                        </p>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
                    <div className="w-full text-center">
            {p.midiEnabled ?
              <div className="w-full text-center">
                <div className=" mt-[0.25rem] py-[0.25rem] px-[1rem] rounded-[0.25rem] text-[0.8rem] text-[#aaa]">
                  midi chan = {selectedPlayhead + 1}
                </div>
              </div>
              :
              <button
                className="hidden w-full mt-[0.25rem] hover:bg-[#444] py-[0.25rem] px-[1rem] rounded-[0.25rem] text-[0.8rem]"
                onClick={() => {
                  const presetIndex = Math.floor(Math.random() * presetMappings.length)
                  updatePlayer(
                    selectedPlayhead,
                    presetMappings[presetIndex].name
                  );
                  updatePlayhead(selectedPlayhead, {
                    ...p, preset: presetMappings[presetIndex].name,
                  });
                }}
              >
                Random
              </button>
            }
          </div>
        </div>
        <div className="w-[8rem] px-[0.5rem] flex-col">
          <div className="flex items-center justify-between mb-[0.5rem]">
            <p className="text-[#888] text-[0.8rem] select-none uppercase">
              Octave
            </p>
            <SwitchButtonCenterText
              leftOnClick={() => {
                updatePlayhead(selectedPlayhead, {
                  ...p,
                  offset: p.offset > -4 * 12 ? p.offset - 12 : p.offset,
                });
                setSelectedPlayhead(selectedPlayhead);
              }}
              leftStyle={{
                fontWeight: "bold",
                padding: '0.16rem 0.3rem'
              }}
              rightStyle={{
                fontWeight: "bold",
                padding: '0.16rem 0.3rem'
              }}
              rightOnClick={() => {
                updatePlayhead(selectedPlayhead, {
                  ...p,
                  offset: p.offset < 4 * 12 ? p.offset + 12 : p.offset,
                });
                setSelectedPlayhead(selectedPlayhead);
              }}
              leftText={"-"}
              rightText={"+"}
              value={p.offset / 12}
            />
          </div>
          <div className="flex items-center justify-between mb-[0.5rem]">
            <p className="text-[#888] text-[0.8rem] select-none uppercase">
              Length
            </p>
            <div className="ml-1 bg-[#393939] rounded-[0.25rem] w-[3.75rem]">
              <ReactSlider
                className="length-slider"
                thumbClassName="length-thumb"
                trackClassName="length-track"
                min={0.1}
                max={1}
                value={p.legato}
                step={0.1}
                onChange={(value) => {
                  updatePlayhead(selectedPlayhead, {
                    ...p,
                    legato: value,
                  });
                  setSelectedPlayhead(selectedPlayhead);
                }}
                renderThumb={(props, state) => <div {...props}></div>}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-[0.5rem]">
            <p className="text-[#888] text-[0.8rem] select-none uppercase">
              Volume
            </p>
            <div className="ml-1 bg-[#393939] rounded-[0.25rem] w-[3.75rem]">
              <ReactSlider
                className="length-slider"
                thumbClassName="length-thumb"
                trackClassName="length-track"
                min={0.2}
                max={1.2}
                value={p.velocity}
                step={0.1}
                onChange={(value) => {
                  updatePlayhead(selectedPlayhead, {
                    ...p,
                    velocity: value,
                  });
                  setSelectedPlayhead(selectedPlayhead);
                }}
                renderThumb={(props, state) => <div {...props}></div>}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-[0.5rem]">
            <p className="text-[#888] text-[0.8rem] select-none uppercase">
              Period
            </p>
            <SpeedToggle
              leftOnClick={() => {
                updatePlayhead(selectedPlayhead, {
                  ...p,
                  interval: p.interval > 1 ? p.interval - 1 : p.interval,
                });
              }}
              rightOnClick={() => {
                updatePlayhead(selectedPlayhead, {
                  ...p,
                  interval: p.interval + 1,
                });
              }}
              value={`${p.interval}`}
            />
          </div>
          <div className="flex items-center justify-between mb-[0.5rem]">
            <p className="text-[#888] text-[0.8rem] select-none uppercase">
              MIDI
            </p>
            <label>
              <button
                className={`hidden`}
                onClick={() => {
                  updatePlayhead(selectedPlayhead, {
                    ...p,
                    midiEnabled: !p.midiEnabled,
                  });
                }}
              >
              </button>
              <div className={`bg-[#393939] h-[1.85rem] hover:bg-[#444] p-1 w-[3rem] rounded-[0.25rem] relative`} style={{ cursor: 'pointer' }}>
                <div
                  className={'absolute w-[1.2rem] h-[1.35rem] rounded-[0.4rem] transition-translate'}
                  style={{
                    left: p.midiEnabled ? '1.5rem' : '0.25rem',
                    transitionDuration: '100ms',
                    backgroundColor: '#aaa'
                  }}
                >
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
}

