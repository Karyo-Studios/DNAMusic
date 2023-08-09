export const PlayheadButtons = ({ playheads, updatePlayhead }) => {
  {
    return (
      <div className="">
        <div className="pb-[0.3rem] pt-[0.6rem] flex text-center select-none uppercase">
          <p className="w-[5.25rem] text-[#666] text-[0.8rem]">playheads</p>
        </div>
        {playheads.map((p, index) => {
          return (
            <div key={index} className="flex items-center relative">
              <div className="absolute left-[-1.5rem] top-[0.5rem] text-[#444] text-[0.8rem]">
                <p>{`[${index + 1}]`}</p>
              </div>
              <div className="w-[5.25rem] mb-1">
                <button
                  className="w-[5.25rem] p-1 rounded-[0.25rem] bg-[#555] box-sizing"
                  style={{
                    // backgroundColor: `hsl(${p.hsl.h*360},${p.hsl.s*100}%,${p.hsl.l})`
                    backgroundColor: p.playing
                      ? `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${p.hsl.l * 100
                      }%)`
                      : `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${p.hsl.l * 100
                      }%, 0.2)`,
                    opacity: p.playing ? 1 : 0.7,
                    // border: `2px solid ${p.color}`,
                  }}
                  onClick={() =>
                    updatePlayhead(index, { ...p, playing: !p.playing })
                  }
                // onMouseEnter={() => {
                //   updatePlayhead(index, { ...p, playing: !p.playing })
                // }}
                >
                  {p.playing ? `P${p.instrumentName}` : "OFF"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};
