import Markdown from "react-markdown";

import { helpMessages } from "../information";

export const ConsoleWindow = ({
  helpMessage,
  setHelpMessage,
  setShowHelp,
  helpIndex,
  setHelpIndex,
  embedded, // styling for when the console is in the control panel
  showIntroductionFlow
}) => {  
  return <div className="absolute w-full h-full z-[9999]">
    <div className="relative w-full h-full max-w-[30rem] flex-col justify-between"
      style={{
        border: '1px white solid',
        backgroundColor: embedded ? '#181818' : 'rgba(30,30,30,0.4)',
      }}
    >
      <div className="overflow-y-scroll pl-[0.75rem] pr-[3rem] py-[0.5rem] pb-[3rem]"
        style={{
          height: 'calc(100% - 2rem)',
          marginTop: embedded ? '2rem' : '0',
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
      <div className="absolute w-full"
        style={{
          borderTop: !showIntroductionFlow ? 'none' : embedded ? 'none' : '1px white solid',
          borderBottom: !showIntroductionFlow ? 'none' : !embedded ? 'none' : '1px white solid',
          top: embedded ? '0px' : 'initial',
          bottom: embedded ? 'initial' : '0px',
        }}
        >
        <div className="flex justify-between">
          <div className="flex items-center">
            <button
              className={`${!showIntroductionFlow ? 'hidden' : ''} console-button uppercase py-[0.35rem] px-[0.5rem] text-[0.8rem]`}
              style={{borderRight: '1px white solid'}}
              onClick={() => {
                const newIndex = helpIndex > 0 ? helpIndex - 1 : helpIndex;
                console.log(newIndex)
                setHelpIndex(newIndex)
                setHelpMessage(helpMessages.introduction[newIndex])
              }}
            >
              Previous
            </button>
            <button
              className={`${!showIntroductionFlow ? 'hidden' : ''} console-button uppercase py-[0.35rem] px-[0.5rem] text-[0.8rem]`}
              style={{borderRight: '1px white solid'}}
              onClick={() => {
                const newIndex = helpIndex < helpMessages.introduction.length - 1 ? helpIndex + 1 : helpIndex;
                console.log(newIndex)
                setHelpIndex(newIndex)
                setHelpMessage(helpMessages.introduction[newIndex])
              }}
            >
              Next
            </button>
          </div>
          <button
            className="console-button uppercase py-[0.35rem] px-[0.5rem] text-[0.8rem]"
            style={{
              borderLeft: '1px white solid',
              borderBottom: !showIntroductionFlow && embedded ? '1px white solid' : 'none',
              borderTop: !showIntroductionFlow && !embedded ? '1px white solid' : 'none',
            }}
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