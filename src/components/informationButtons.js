import { helpMessages } from "../information";

export const InformationButtons = ({
  showIntroduction,
  setHelpMessage,
  setMenu,
  setShowHelp,
  helpIndex
}) => {
  return <div className="overflow-x-hidden"
  >
    <div className="w-[50rem]">
      {showIntroduction && helpMessages.introduction.map((intro, index) => {
        if (index >= helpIndex) {
          return (
            <button
              onClick={() => {
                setHelpMessage(intro);
                setMenu(0);
                setShowHelp(true);
              }}
              key={index}
              className={`py-[0.5rem] px-[0.5rem] text-[0.8rem] intro-title ${helpIndex === index && "active"
                }`}
            >
              {index + 1}: {intro.name}
            </button>
          );
        }
      })}
    </div>
  </div>
}