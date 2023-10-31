import React from "react";

export const ToggleVerticalButton = ({
  playhead,
  onClick,
  activeNotes,
  index,
}) => {
  return (
    <div className="flex items-center">
      <label>
        <button
          className={`hidden`}
          onClick={onClick}
        >
          {playhead.playing ? 'on' : 'off'}
        </button>
        <div className={`w-[1.85rem] bg-[#232323] hover:bg-[#353535] 
        p-[0.25rem] h-[2.75rem] ml-[0.5rem] rounded-[0.25rem] relative`} style={{ cursor: 'pointer' }}>
          <div
            className={'absolute w-[1.35rem] h-[1.35rem] rounded-[0.4rem] transition-translate'}
            style={{
              // backgroundColor: playhead.playing ? playhead.color : ,
              bottom: playhead.playing ? '1.25rem' : '0.25rem',
              transitionDuration: '100ms',
              // backgroundColor: `hsl(${playhead.hsl.h*360},${playhead.hsl.s*100}%,${playhead.hsl.l})`
              backgroundColor: playhead.playing
                ? // ? playing && ((counter - 1) / 2) % 1 === 0 ? `hsla(${playhead.hsl.h * 360},${playhead.hsl.s * 100}%,${playhead.hsl.l * 100
                playhead.playing && activeNotes[index].current
                  ? `hsla(${playhead.hsl.h * 360},${playhead.hsl.s * 100}%,${playhead.hsl.l * 100
                  }%,2)`
                  : `hsla(${playhead.hsl.h * 360},${playhead.hsl.s * 100}%,${playhead.hsl.l * 100
                  }%,0.7)`
                : '#aaaaaa',
              // transition: activeNotes[index].current
              //   ? "0"
              //   : "color 500ms linear",
            }}
          >
          </div>
        </div>
      </label>
    </div>
  );
};
