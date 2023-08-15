export const PlayheadButtons = ({
  playheads,
  updatePlayhead,
  playheadCount,
  setPlayheadCount,
  counter,
  playing,
  activeNotes
}) => {
  {
    return (
      <div className="relative h-full text-center text-[0.8rem]">
        <div className="flex text-center select-none uppercase">
          <p className="pt-[0.5rem] pb-[0.25rem] w-[5.25rem] text-[#888] text-[0.8rem]">playheads</p>
        </div>
        {playheads.map((p, index) => {
          if (index >= playheadCount) return;
          return (
            <div key={index} className="flex items-center relative">
              <div className="w-[5.25rem] mb-1">
                <button
                  className="w-[5.25rem] h-[1.85rem] p-1 rounded-[0.25rem] bg-[#555] uppercase"
                  style={{
                    // backgroundColor: `hsl(${p.hsl.h*360},${p.hsl.s*100}%,${p.hsl.l})`
                    backgroundColor: p.playing
                      // ? playing && ((counter - 1) / 2) % 1 === 0 ? `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${p.hsl.l * 100
                      ? playing && activeNotes[index].current ? `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${p.hsl.l * 100
                        }%,2)` : `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${p.hsl.l * 100
                        }%,0.7)`
                      : `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${p.hsl.l * 100
                      }%, 0.2)`,
                    opacity: p.playing ? 1 : 0.7,
                    transition: activeNotes[index].current ? '0' : 'color 200ms linear'
                    // border: `2px solid ${p.color}`,
                  }}

                  onClick={() =>
                    updatePlayhead(index, { ...p, playing: !p.playing })
                  }
                // onMouseEnter={() => {
                //   updatePlayhead(index, { ...p, playing: !p.playing })
                // }}
                >
                  {p.playing ? `${p.preset}` : "OFF"}
                </button>
              </div>
            </div>
          );
        })}
        {
          playheadCount < 5 ?
            <div className="relative">
              <div className="absolute top-[0rem]">
                <div className="flex relative">
                  <button
                    onClick={() => setPlayheadCount(playheadCount > 1 ? playheadCount - 1 : 1)}
                    className="w-[2.5rem] text-center h-[1.85rem] p-1  bg-[#222] hover:bg-[#444] rounded-[0.25rem]"
                    style={{ opacity: playheadCount === 1 ? 0.2 : 1 }}
                  >
                    -
                  </button>
                  <button
                    onClick={() => setPlayheadCount(playheadCount < 5 ? playheadCount + 1 : 5)}
                    className="w-[2.5rem] text-center h-[1.85rem] p-1 ml-[0.25rem] bg-[#222] hover:bg-[#444] rounded-[0.25rem] "
                    style={{ opacity: playheadCount === 5 ? 0.2 : 1 }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            :
            <div className="absolute bottom-[0.8rem] left-[-3.5rem]">
              <div className="flex relative">
                <button
                  onClick={() => setPlayheadCount(playheadCount > 1 ? playheadCount - 1 : 1)}
                  className="w-[2.5rem] text-center h-[1.85rem] p-1  bg-[#222] hover:bg-[#444] rounded-[0.25rem]"
                  style={{ opacity: playheadCount === 1 ? 0.2 : 1 }}
                >
                  -
                </button>
              </div>
            </div>
        }
      </div>
    );
  }
};
