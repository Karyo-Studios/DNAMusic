export const PlayheadButtons = ({
  playheads,
  updatePlayhead,
  playheadCount,
  setPlayheadCount,
}) => {
  {
    return (
      <div className="">
        <div className="pb-[0.3rem] pt-[0.6rem] flex text-center select-none uppercase">
          <p className="w-[5.25rem] text-[#666] text-[0.8rem]">playheads</p>
        </div>
        {playheads.map((p, index) => {
          if (index >= playheadCount) return;
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
        <div className="flex">
          <button
            onClick={() => setPlayheadCount(playheadCount > 1 ? playheadCount - 1 : 1)}
            className="w-[2.5rem] text-center p-1 bg-[#222] hover:bg-[#444] rounded-[0.25rem] mt-[0.4rem]"
            style={{opacity: playheadCount === 1 ? 0.2 : 1}}
          >
            -
          </button>
          <button
            onClick={() => setPlayheadCount(playheadCount < 5 ? playheadCount + 1 : 5)}
            className="w-[2.5rem] ml-[0.25rem] text-center p-1 bg-[#222] hover:bg-[#444] rounded-[0.25rem] mt-[0.4rem]"
            style={{opacity: playheadCount === 5 ? 0.2 : 1}}
          >
            +
          </button>
        </div>
      </div>
    );
  }
};
