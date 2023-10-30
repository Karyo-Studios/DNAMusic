export const PlayheadButtons = ({
  playheads,
  playheadCount,
  setPlayheadCount,
  setMenu,
  setSelectedPlayhead,
}) => {
  {
    return (
      <div className="pt-[0.5rem] relative h-full text-center text-[0.8rem]">
        {playheads.map((p, index) => {
          const buttonLabel = p.midiEnabled ? `MIDI ${p.midiOutputDevice.index}` : p.preset;
          if (index >= playheadCount) return;
          return (
            <div key={index} className="flex items-center relative">
              <div className="w-[5.25rem] mb-1">
                <button
                  className="w-[5.25rem] h-[1.85rem] p-1 rounded-[0.25rem] bg-[#232323] hover:bg-[#353535] uppercase"
                  onClick={() => {
                    setMenu(1);
                    setSelectedPlayhead(index)
                  }}
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
          );
        })}
                <div className="flex text-center select-none uppercase">
          <p className="pb-[0.25rem] w-[5.25rem] text-[#888] text-[0.8rem]">
            SOUND
          </p>
        </div>
        {playheadCount < 5 ? (
          <div className="relative">
            <div className="absolute top-[0rem]">
              <div className="flex relative">
                <button
                  onClick={() =>
                    setPlayheadCount(playheadCount > 1 ? playheadCount - 1 : 1)
                  }
                  className="w-[2.5rem] text-center h-[1.85rem] p-1 text-[1.1rem] leading-[1rem] bg-[#292929] hover:bg-[#444] rounded-[0.25rem]"
                  style={{ opacity: playheadCount === 1 ? 0.2 : 1 }}
                >
                  -
                </button>
                <button
                  onClick={() =>
                    setPlayheadCount(playheadCount < 5 ? playheadCount + 1 : 5)
                  }
                  className="w-[2.5rem] text-center h-[1.85rem] p-1 text-[1.1rem] leading-[1rem] ml-[0.25rem] bg-[#292929] hover:bg-[#444] rounded-[0.25rem] "
                  style={{ opacity: playheadCount === 5 ? 0.2 : 1 }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute hidden bottom-[-0rem]">
            <div className="flex relative">
              <button
                onClick={() =>
                  setPlayheadCount(playheadCount > 1 ? playheadCount - 1 : 1)
                }
                className="w-[5.25rem] text-[#aaa] text-center h-[0.5rem] leading-[0.5rem] bg-[#292929] hover:bg-[#444] rounded-[0.25rem]"
                style={{ opacity: playheadCount === 1 ? 0.2 : 1 }}
              >
                ---
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
};
