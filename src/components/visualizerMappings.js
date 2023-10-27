import { noteMappings, codonNames } from "../mappings";

export const VisualizerMappings = ({
  playheads,
  countRefs,
  activeNodes,
  playheadCount,
  showHelp,
  helpMessage,
  setShowHelp,
}) => {
  return (
    <div className="relative px-[0.5rem] ">
      {showHelp && (
        <div className="absolute w-[15.5rem] pt-[0.5rem] h-full z-[98] bg-[#292929] p-[0rem]">
          <div className="bg-[#181818] h-[12rem] rounded-[0.25rem]">
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
      <div className="flex justify-between pt-[0.5rem] pb-[0.25rem] px-[0.25rem] text-[#888] text-[0.8rem] select-none">
        <p className="text-left">CODON</p>
        <p className="text-center">AMINO ACID</p>
        <p className="text-right">NOTE</p>
      </div>
      <div className="bg-[#181818] h-[10rem] rounded-[0.25rem] px-[0.25rem]">
      {playheads.map((p, index) => {
        const note = countRefs[index].current;
        const node = activeNodes[note];
        if (node === undefined) return;
        if (index >= playheadCount) return;
        return (
          <div
            key={index}
            className="flex items-center mb-1 h-[1.85rem]"
            style={{
              opacity: p.playing ? 1 : 0.3,
            }}
          >
            <div className="flex">
              {node.nucleotide.split("").map((letter, index) => {
                return (
                  <div
                    key={index}
                    className="box-border text-center uppercase text-[0.8rem]"
                    style={{
                      width: "0.9rem",
                      borderRadius: "0.25rem",
                      height: "1.8rem",
                      lineHeight: "1.8rem",
                    }}
                  >
                    {parseInt(node.aminoacid) === -1 ? "-" : letter}
                  </div>
                );
              })}
            </div>
            <div
              className="px-[0.25rem] w-[1.5rem] text-center text-[1rem]"
              style={{ color: p.color }}
            >
              {">"}
            </div>
            {parseInt(node.aminoacid) === -1 ? (
              <div className="p-[0.25rem] rounded-[0.25rem] text-[0.8rem] w-[7.5rem] text-center box-border">
                n/a
              </div>
            ) : (
              <div className="p-[0.25rem] rounded-[0.25rem] text-[0.8rem] w-[7.5rem] text-center box-border">
                {node.aminoacid} = {codonNames[node.aminoacid]}
              </div>
            )}
            <div
              className="px-[0.25rem] w-[1.5rem] text-[1rem]"
              style={{ color: p.color }}
            >
              {">"}
            </div>
            <div className="px-[0.5rem] text-[0.8rem]">
              {parseInt(node.aminoacid) === -1
                ? "-"
                : noteMappings[node.aminoacid]}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
