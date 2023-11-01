import Markdown from "react-markdown";

export const ConsoleWindow = ({
  helpMessage,
  setShowHelp,
  helpIndex,
  setHelpIndex,
  embedded,
}) => {
  return <div className="absolute w-full h-full">
    <div className="relative w-full h-full max-w-[30rem] z-[99999] flex-col justify-between"
      style={{
        border: '1px white solid',
        backgroundColor: embedded ? '#181818' : 'rgba(50,50,50,0.1)',
      }}
    >
      <div className="overflow-y-scroll pl-[0.75rem] pr-[3rem] py-[0.5rem] pb-[3rem]"
        style={{
          height: 'calc(100% - 2rem)'
        }}
      >
        <p className="mb-[0.25rem]">{helpMessage.name}</p>
        {helpMessage.description && (
          <Markdown>{helpMessage.description}</Markdown>
        )}
        {helpMessage.img && (
          <div className="bg-[#eee] p-[0.5rem] rounded-[0.25rem] relative max-w-[15rem]">
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
      <div className="absolute bottom-0 w-full"
        style={{
          borderTop: '1px white solid',
        }}
        >
        <div className="flex justify-between">
          <div className="flex items-center">
            <button
              className="uppercase py-[0.35rem] px-[0.5rem] text-[0.8rem]"
            >
              Previous
            </button>
            <button
              className="uppercase py-[0.35rem] px-[0.5rem] text-[0.8rem]"
            >
              Next
            </button>
          </div>
          <button
            className="uppercase py-[0.35rem] px-[0.5rem] text-[0.8rem]"
            onClick={() => {
              setShowHelp(false);
            }}
          >
            close
          </button>
        </div>
      </div>
    </div>
  </div>
}