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
        <div className={`h-[1.85rem] bg-[#232323] hover:bg-[#353535] 
        p-1 w-[3rem] rounded-[0.25rem] relative`} style={{ cursor: 'pointer' }}>
          <div
            className={'absolute w-[1.2rem] h-[1.35rem] rounded-[0.4rem] transition-translate'}
            style={{
              left: playhead.playing ? '1.5rem' : '0.25rem',
              transitionDuration: '100ms',
              backgroundColor: playhead.playing
                ? 
                playhead.playing && activeNotes[index].current
                  ? `hsla(${playhead.hsl.h * 0},${playhead.hsl.s * 100}%,100%,1)`
                  : `hsla(${playhead.hsl.h * 360},${playhead.hsl.s * 100}%,${playhead.hsl.l * 100
                  }%,0.7)`
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
