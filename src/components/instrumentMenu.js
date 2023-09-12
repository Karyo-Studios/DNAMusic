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
  return <div className="w-[16.5rem]">
    <div className="flex pt-[0.5rem]">
      <div className="flex flex-col mx-[0.25rem] pt-[1.5rem]">
        {playheads.map((p, index) => {
          if (index < playheadCount) {
            return (
              <div className="relative">
                <button
                  className="mb-1 p-1 w-[3rem] h-[1.85rem] p-[0.25rem] text-[#fff] rounded-[0.25rem]"
                  key={index}
                  style={{
                    backgroundColor:
                      selectedPlayhead === index
                        ? p.color
                        : "#444",
                  }}
                  onClick={() => {
                    setSelectedPlayhead(index);
                  }}
                >
                  P{index}
                </button>
                {selectedPlayhead === index && (
                  <div
                    className="absolute top-[0.08rem] text-[1.2rem] right-[-0.8rem]"
                    style={{ color: p.color }}
                  >
                    {">"}
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
      <div className="ml-[1rem]">
        <div className="flex mb-2">
          <button
            className="w-[50%] rounded-l-[0.25rem]"
            style={{
              backgroundColor: !playheads[selectedPlayhead]
                .midiEnabled
                ? "#555"
                : "#333",
            }}
            onClick={() => {
              updatePlayhead(selectedPlayhead, {
                ...playheads[selectedPlayhead],
                midiEnabled: false,
              });
            }}
          >
            Audio
          </button>
          <button
            className="w-[50%] rounded-r-[0.25rem]"
            style={{
              backgroundColor: playheads[selectedPlayhead]
                .midiEnabled
                ? "#555"
                : "#333",
            }}
            onClick={() => {
              updatePlayhead(selectedPlayhead, {
                ...playheads[selectedPlayhead],
                midiEnabled: true,
              });
            }}
          >
            MIDI
          </button>
        </div>
        <div className="h-[8.5rem] w-[10.75rem] bg-[#181818] w-full rounded-[0.25rem]">
          {playheads[selectedPlayhead].midiEnabled ? (
            <div>
              <div className="flex flex-col overflow-y-scroll h-[8.5rem] w-[10.75rem]">
                {WebMidi &&
                  WebMidi._outputs.map((midi, index) => {
                    return (
                      <button
                        key={midi._midiOutput.name}
                        className="text-left py-[0.05rem] px-[0.25rem] text-[0.8rem] w-full"
                        style={{
                          backgroundColor:
                            index ===
                              playheads[selectedPlayhead]
                                .midiOutputDevice.index
                              ? playheads[selectedPlayhead].color
                              : "rgba(0,0,0,0)",
                        }}
                        onClick={() => {
                          updatePlayhead(selectedPlayhead, {
                            ...playheads[selectedPlayhead],
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
              <div className="w-full text-center">
                <div className="w-full mt-[0.25rem] py-[0.25rem] px-[1rem] rounded-[0.25rem] text-[0.8rem] text-[#aaa]">
                  midi chan = {selectedPlayhead + 1}
                </div>
              </div>
            </div>
          ) : (
            <div className="">
              <div className="flex flex-wrap w-[10.75rem] h-[8.5rem] overflow-y-scroll rounded-[0.25rem]">
                {presetMappings.map((preset, index) => {
                  return (
                    <div>
                      <button
                        key={index}
                        className="text-left text-[0.8rem] w-[5rem] px-[0.25rem]"
                        style={{
                          backgroundColor:
                            presetMappings[index].name ===
                              playheads[selectedPlayhead].preset
                              ? playheads[selectedPlayhead].color
                              : "rgba(0,0,0,0)",
                        }}
                        onClick={() => {
                          updatePlayer(
                            selectedPlayhead,
                            presetMappings[index].name
                          );
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
              <div className="w-full text-center">
                <button
                  className="w-full mt-[0.25rem] hover:bg-[#444] py-[0.25rem] px-[1rem] rounded-[0.25rem] text-[0.8rem]"
                  onClick={() => {
                    updatePlayer(
                      selectedPlayhead,
                      presetMappings[
                        Math.floor(
                          Math.random() * presetMappings.length
                        )
                      ].name
                    );
                  }}
                >
                  Random
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
}

