import React from "react";

export const ToggleButton = ({
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
        <div className={`bg-[#393939] h-[1.85rem] hover:bg-[#444] 
        p-1 w-[3rem] rounded-[0.25rem] relative`} style={{ cursor: 'pointer' }}>
          <div
            className={'absolute w-[1.2rem] h-[1.35rem] rounded-[0.4rem] transition-translate'}
            style={{
              // backgroundColor: playhead.playing ? playhead.color : ,
              left: playhead.playing ? '1.5rem' : '0.25rem',
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
