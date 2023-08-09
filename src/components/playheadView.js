export const PlayheadView = ({ p, masterSteps, playing, ticker, index }) => {
  return (
    <div className="flex items-center">
      <div className="flex w-[17rem] bg-[#393939] h-[1.85rem] rounded-[0.25rem]">
        {p.euclid.map((hap, i) => {
          const active = Math.floor(ticker / p.interval) % masterSteps === i;
          return (
            <div
              className="flex h-[100%] items-center transition-all rounded-[0.25rem]"
              key={`${hap} + ${i} + ${index}`}
              style={{
                width: `${16 * 20 * (1 / masterSteps)}px`,
                backgroundColor:
                  active && playing && p.playing
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0)",
                transitionDuration: "50ms",
              }}
            >
              <div
                className="bg-[#00f] rounded-[0.2rem] m-auto transition-all"
                style={{
                  backgroundColor:
                    hap === 0
                      ? "#444"
                      : active && playing && p.playing
                        ? "#fff"
                        : `${p.color}`,
                  opacity: p.playing ? 1 : 0.3,
                  width: hap === 0 ? 8 : 16 * 0.8,
                  height:
                    hap === 0
                      ? 8
                      : p.rotation === i
                        ? 16 * 1.85 * 0.9
                        : 16 * 1.85 * 0.6,
                  transitionDuration: active ? "10ms" : "250ms",
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
