import { factoryPresets } from '../presets'
import { updateEuclid } from "../playhead";

import { generatePattern } from '../helpers';

import { RemixButton } from './remixButton';

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
      const p = preset.playheads[i]
      const current = playheads[i]
      updated.push(updateEuclid({
        ...current,
        steps: preset.steps,
        events: p.events,
        rotation: p.rotation,
        playing: p.playing,
        offset: p.offset,
        legato: p.legato,
        preset: p.preset,
        velocity: p.velocity,
      }))
    }
    setPlayheads(updated)
    updateTempo(preset.bpm)
    setMasterSteps(preset.steps)
    setNoteOffset(preset.keyOffset)
  }

  return (
    <div>
      <div className="flex justify-between w-[90%] pt-[0.5rem] pb-[0.25rem] text-[#888] text-[0.8rem] select-none">
        <p className="text-left">NAME</p>
        <p className="text-right">AUTHOR</p>
      </div>
      <div className="h-[7rem] overflow-y-scroll w-[90%]  bg-[#222] w-full">
        <div className="flex flex-wrap mx-auto h-[7rem]">
          {factoryPresets.map((preset, index) => {
            return (
              <div className="bg-[#181818]">
                <label className="cursor-pointer">
                  <button
                    key={index}
                    className="hidden text-left justify-between text-[0.8rem] w-[15rem]"
                    style={{
                      backgroundColor: "rgba(0,0,0,0)",
                    }}
                    onClick={() => {
                      console.log(preset)
                      updatePlayheads(preset)
                    }}
                  >
                  </button>
                  <div className="flex px-[0.25rem] justify-between text-[0.8rem] w-[14.75rem]">
                    <p className="whitespace-nowrap overflow-hidden text-[1rem]">
                      {preset.name}
                    </p>
                    <p className="whitespace-nowrap overflow-hidden text-[1rem]">
                      {preset.author}
                    </p>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between w-[90%] pt-[0.5rem] pb-[0.25rem] text-[#888] text-[0.8rem] select-none">
        <p className="text-left">RANDOMIZE</p>
      </div>
      <div className="w-[90%]">
        <div className="flex items-center justify-between">
          <button
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
          <button
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
            Instruments
          </button>
          <button
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
            All
          </button>
        </div>
      </div>
    </div>
  )
}