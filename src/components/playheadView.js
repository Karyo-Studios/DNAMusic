export const PlayheadView = ({
  p,
  masterSteps,
  playing,
  ticker,
  index,
  width,
}) => {
  const rem = width < 1200 ? 16 : 20;
  return (
    <div className="flex items-center">
      <div className="flex w-[17rem]  h-[1.85rem] rounded-[0.25rem]">
        {p.euclid.map((hap, i) => {
          const active = Math.floor(ticker / p.interval) % masterSteps === i;
          return (
            <div
              className="flex h-[100%] items-center transition-all rounded-[0.25rem]"
              key={`${hap} + ${i} + ${index}`}
              style={{
                width: `${rem * 20 * (1 / masterSteps)}px`,
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
                  width: hap === 0 ? 4 : rem * 0.8,
                  height:
                    hap === 0
                      ? rem * 1.85 * 1
                      : p.rotation === i
                      ? rem * 1.85 * 0.9
                      : rem * 1.85 * 0.5,
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
