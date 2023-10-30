import { factoryPresets } from "../presets";
import { updateEuclid } from "../playhead";

import { generatePattern } from "../helpers";

import { RemixButton } from "./remixButton";

export const PresetMenu = ({
  playheads,
  updatePlayer,
  setPlayheads,
  updateTempo,
  setMasterSteps,
  setNoteOffset,
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
        <p className="text-right">AUTHOR</p>
      </div>
      <div className="h-[8.5rem] overflow-y-scroll w-full bg-[#222]"
      style={{
        border: '1px white solid'
      }}
      >
        <div className="flex flex-wrap mx-auto h-[7rem]"
          >
          {factoryPresets.map((preset, index) => {
            return (
              <div className="bg-[#181818]">
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
                  <div className="flex px-[0.25rem] py-[0.2rem] justify-between text-[0.8rem] w-[15.5rem]">
                    <p className="whitespace-nowrap overflow-hidden">
                      {preset.name}
                    </p>
                    <p className="whitespace-nowrap overflow-hidden">
                      {preset.author}
                    </p>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex w-[100%] px-[0.5rem] pt-[0.5rem] pb-[0.25rem]text-[0.8rem] select-none">
        <p className="text-left text-[#888] ">RANDOMIZE</p>
        <button className="text-[#fff] text-left ml-[1rem]"
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
          Patterns
        </button>
      </div>
    </div>
  );
};
