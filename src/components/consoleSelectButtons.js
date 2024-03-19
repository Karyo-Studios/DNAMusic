export const ConsoleSelectButtons = ({
  setMenu,
  menu,
  setShowHelpWindow,
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
          setShowHelpWindow(false);
        }}
        style={{
          color: menu === 1 ? '#fff' : '#aaa',
          border: '1px #999 solid',
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
          setShowHelpWindow(false);
        }}
        style={{
          color: menu === 2 ? '#fff' : '#aaa',
          border: '1px #999 solid',
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
          setShowHelpWindow(false);
        }}
        style={{
          color: menu === 0 ? '#fff' : '#aaa',
          border: '1px #999 solid',
          backgroundColor:
            menu === 0 ? "#292929" : "rgba(0,0,0,0)",
        }}
      >
        Log
      </button>
    </div>
  </div>
}