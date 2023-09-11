export const PlayPauseButton = ({
  playing,
  pause,
  play,
  stop,
  counter
}) => {
  return (
    <div className="relative">
      <div className="pl-[0.5rem] flex text-center text-[#888] select-none uppercase">
        <button
          className="bg-[#555] h-[2.25rem] w-[5.25rem] hover:bg-[#aaa] text-[1.2rem] rounded-[0.25rem]"
          onClick={() => (playing ? pause() : play())}
          style={{
            backgroundColor:
              playing && ((counter - 1) / 2) % 1 === 0 ? "#777" : "#555",
          }}
        >
          <div className="pl-[0.1rem] w-[1.2rem] h-[1.2rem] m-auto">
            {playing ? (
              <svg
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="5" width="7" height="30" rx="2" fill="white" />
                <rect x="18" width="7" height="30" rx="2" fill="white" />
              </svg>
            ) : (
              <svg viewBox="0 0 28 29" fill="#fff">
                <path
                  d="M26.7793 13.1932C27.5007 13.5658 27.5007 14.5975 26.7793 14.9701L1.45812 28.0504C0.792534 28.3942 -0.000834731 27.9111 -0.000834699 27.162L-0.000833555 1.00134C-0.000833522 0.252187 0.792537 -0.23095 1.45812 0.112876L26.7793 13.1932Z"
                  fill="#fff"
                />
              </svg>
            )}
          </div>
        </button>
        <button
          className="ml-[0.5rem] bg-[#393939] h-[2.25rem] w-[3.7rem] hover:bg-[#666] text-[1.2rem] rounded-[0.25rem]"
          onClick={stop}
        >
          <div className="w-[1rem] h-[1rem] m-auto">
            <svg
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="30" height="30" rx="3" fill="white" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
