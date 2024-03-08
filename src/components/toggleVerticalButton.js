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
        <div className={`w-[1.7rem] bg-[#232323] hover:bg-[#353535] 
        p-[0.25rem] h-[2.75rem] ml-[0.5rem] rounded-[0.25rem] relative`} style={{ cursor: 'pointer' }}>
          <div
            className={'absolute w-[1.25rem] h-[1.35rem] rounded-[0.4rem] transition-translate'}
            style={{
              // backgroundColor: playhead.playing ? playhead.color : ,
              bottom: playhead.playing ? '1.3rem' : '0.125rem',
              transitionDuration: '100ms',
              // backgroundColor: `hsl(${playhead.hsl.h*360},${playhead.hsl.s*100}%,${playhead.hsl.l})`
              backgroundColor: playhead.playing
                ? // ? playing && ((counter - 1) / 2) % 1 === 0 ? `hsla(${playhead.hsl.h * 360},${playhead.hsl.s * 100}%,${playhead.hsl.l * 100
                playhead.playing && activeNotes[index].current
                  ? `hsla(${playhead.hsl.h * 0},${playhead.hsl.s * 100}%,100%,1)`
                  : `hsla(${playhead.hsl.h * 360},${playhead.hsl.s * 100}%,${playhead.hsl.l * 100
                  }%,1)`
                : '#aaaaaa',
              transition: activeNotes[index].current
                ? "background-color 100ms linear" : "background-color 10ms linear"
            }}
          >
          </div>
        </div>
      </label>
    </div>
  );
};
