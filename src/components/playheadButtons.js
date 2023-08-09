export const PlayheadButtons = ({ playheads, updatePlayhead }) => {
  {
    return (
      <div className="">
        <div className="py-[0.25rem] flex text-center text-[#aaa] select-none uppercase">
          <p className="w-[5.5rem] text-[#888] text-[0.8rem]">playheads</p>
        </div>
        {playheads.map((p, index) => {
          return (
            <div className="flex items-center relative">
              <div className="absolute left-[-1.5rem] top-[0.5rem] text-[#444] text-[0.8rem]">
                <p>{`[${index + 1}]`}</p>
              </div>
              <div className="w-[5.25rem] mr-2 mb-1">
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
                  {p.playing ? `P${p.instrumentName}` : "OFF"}
                </button>
              </div>
              <div>
                <p>|</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};
