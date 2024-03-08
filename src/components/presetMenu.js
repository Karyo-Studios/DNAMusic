import { factoryPresets } from "../presets";
import { updateEuclid } from "../playhead";

import { generatePattern } from "../helpers";

import { RemixButton } from "./remixButton";

import { SwitchButton } from "./switchButton";

export const PresetMenu = ({
  playheads,
  updatePlayer,
  setPlayheads,
  updateTempo,
  setMasterSteps,
  setNoteOffset,
  noteOffset,
}) => {
  const updatePlayheads = (preset) => {
    let updated = [];
    for (let i = 0; i < preset.playheads.length; i++) {
      const p = preset.playheads[i];
      const current = playheads[i];
      updated.push(
        updateEuclid({
          ...current,
          interval: p.interval ? p.interval : 4,
          steps: preset.steps,
          events: p.events,
          rotation: p.rotation,
          playing: p.playing,
          offset: p.offset,
          legato: p.legato,
          preset: p.preset,
          velocity: p.velocity,
        })
      );
    }
    setPlayheads(updated);
    updateTempo(preset.bpm);
    setMasterSteps(preset.steps);
    setNoteOffset(preset.keyOffset);
  };

  return (
    <div className="px-[0.5rem]">
      <div className="flex justify-between w-full pt-[0.5rem] px-[0.5rem] pb-[0.25rem] text-[#888] text-[0.8rem] select-none">
        <p className="text-left">NAME</p>
        <p className="text-right">GENRE</p>
      </div>
      <div className="h-[8rem] overflow-y-scroll w-full">
        <div className="flex flex-wrap mx-auto h-[6rem]"
        >
          {factoryPresets.map((preset, index) => {
            return (
              <div className=" bg-[#232323]">
                <label className="cursor-pointer">
                  <button
                    key={index}
                    className="hidden text-left justify-between text-[0.8rem] w-[15.5em]"
                    style={{
                      backgroundColor: "rgba(0,0,0,0)",
                    }}
                    onClick={() => {
                      console.log(preset);
                      updatePlayheads(preset);
                    }}
                  ></button>
                  <div className="flex px-[0.75rem] py-[0.2rem] justify-between text-[0.8rem] w-[15.25rem]">
                    <p className="whitespace-nowrap overflow-hidden">
                      {preset.name}
                    </p>
                    <p className="whitespace-nowrap overflow-hidden">
                      {preset.genre}
                    </p>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between w-[100%] px-[0.5rem] pt-[0.25rem] text-left pb-[0.25rem] uppercase text-[0.8rem] select-none">
        <div>
          <button className="text-[#fff] bg-[#232323] hover:bg-[#353535] py-[0.25rem] px-2 text-left rounded-[0.25rem]"
            onClick={() =>
              generatePattern({
                playheads,
                updateTempo,
                setNoteOffset,
                setMasterSteps,
                setPlayheads,
              })
            }
          >
            Randomize!
          </button>
        </div>
        <div className="flex items-center">
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
      </div>
    </div>
  );
};
