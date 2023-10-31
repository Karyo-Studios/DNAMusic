export const ConsoleSelectButtons = ({
  setMenu,
  menu,
  setShowHelp,
  helpMessage,
  showHelp,
  showControls,
}) => {
  return <div className="flex relative">
    <div
      className="flex w-[16.5rem] h-[2.7rem]"
      style={{
        display: showControls ? "flex" : "none",
      }}
    >
      <button
        className="uppercase text-[#aaa] grow text-center"
        onClick={() => {
          setMenu(1);
          setShowHelp(false);
        }}
        style={{
          color: menu === 1 ? '#fff' : '#aaa',
          border: '1px white solid',
          backgroundColor:
            menu === 1 ? "#292929" : "rgba(0,0,0,0)",
        }}
      >
        Sounds
      </button>
      <button
        className="uppercase text-[#aaa] grow text-center"
        onClick={() => {
          setMenu(2);
          setShowHelp(false);
        }}
        style={{
          color: menu === 2 ? '#fff' : '#aaa',
          border: '1px white solid',
          backgroundColor:
            menu === 2 ? "#292929" : "rgba(0,0,0,0)",
        }}
      >
        Presets
      </button>
      <button
        className="uppercase text-[#aaa] grow text-center"
        onClick={() => {
          setMenu(0);
          setShowHelp(false);
        }}
        style={{
          color: menu === 0 ? '#fff' : '#aaa',
          border: '1px white solid',
          backgroundColor:
            menu === 0 ? "#292929" : "rgba(0,0,0,0)",
        }}
      >
        Log
      </button>
      {/* <button
        className="uppercase text-[#aaa] grow text-center"
        onClick={() => {
          // setMenu(0);
          // setShowHelp(false);
        }}
        style={{
          color: menu === 0 ? '#fff' : '#aaa',
          border: '1px white solid',
          backgroundColor:
            menu === 0 ? "#292929" : "rgba(0,0,0,0)",
        }}
      >
        !
      </button> */}
    </div>
    {showHelp && showControls && (
      <div className="absolute w-full pt-[0.5rem] h-[15rem] z-[98] bg-[#181818]"
        style={{
          border: '1px white solid',
          borderBottom: 'none'
        }}
      >
        <div className="h-[12rem]">
          <div className="relative w-full h-full overflow-y-scroll px-[0.75rem] py-[0.25rem]">
            <p className="mb-[0.25rem]">{helpMessage.name}</p>
            {helpMessage.description && (
              <p className="text-[0.8rem] mb-[0.25rem]">
                {helpMessage.description}
              </p>
            )}
            {helpMessage.img && (
              <div className="bg-[#eee] p-[0.5rem] rounded-[0.25rem] relative">
                <img className="w-auto m-auto" src={helpMessage.img}
                  style={{
                    height: helpMessage.imgHeight ? helpMessage.imgHeight : '6rem'
                  }}
                ></img>
                <div className="w-full h-[7rem] m-auto absolute top-0 left-0 z-[999]"
                  style={{
                    mixBlendMode: 'difference'
                  }}
                >
                </div>
              </div>
            )}
            {helpMessage.source && (
              <a target="_blank" href={helpMessage.source}>
                <p className="underline text-[0.8rem]">learn more</p>
              </a>
            )}
          </div>
          <button
            className="uppercase text-[0.8rem] absolute top-[0.75rem] right-[0.5rem] z-[99]"
            onClick={() => {
              setShowHelp(false);
            }}
          >
            close
          </button>
        </div>
      </div>
    )}
  </div>
}