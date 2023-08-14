import { noteMappings, codonNames } from "../mappings";

export const VisualizerMappings = ({
  playheads,
  counters,
  countRefs,
  activeNodes,
  playheadCount,
}) => {
  return (
    <div className="">
      <div className="flex mb-[0.25rem] text-[#888] text-[0.8rem] select-none">
        <p className="text-center w-[6rem]">CODON</p>
        <div className="w-[3rem]"></div>
        <p className="text-center w-[10rem]">AMINO ACID</p>
        <p className="text-center w-[7rem]">NOTE</p>
      </div>
      {playheads.map((p, index) => {
        const note = countRefs[index].current;
        const node = activeNodes[note];
        if (node === undefined) return
        if (index >= playheadCount) return;
        return (
          <div key={index} className="flex items-center mb-[0.25rem]"
            style={{
             opacity: p.playing ? 1 : 0.3
            }}
          >
            <div className="flex">
              {node.nucleotide.split("").map((letter,index) => {
                return <div
                  key={index}
                  className="box-border text-center uppercase"
                  style={{
                    width: '1.2rem',
                    borderRadius: "0.25rem",
                    border: "1px solid #888", 
                    height: '1.85rem',
                    lineHeight: '1.85rem',
                    fontSize: '1rem',
                  }}
                >
                  {letter}
                </div>
              })}
            </div>
            <div 
                className="px-[0.25rem] text-[1.2rem]"
                style={{color: p.color}}
            >
                {'>'}
            </div>
            <div className="p-[0.25rem] rounded-[0.25rem] px-[0.5rem] w-[1.5rem] text-center"
              style={{border: "1px solid #888"}}
              >
                <p>{node.aminoacid}</p>
            </div>
            <div 
                className="px-[0.1rem] text-[1.2rem]"
            >
                {'='}
            </div>
            <div className="p-[0.25rem] rounded-[0.25rem] w-[6rem] text-center"
              style={{border: "1px solid #888"}}
              >
              {codonNames[node.aminoacid]}
            </div>
            <div 
                className="px-[0.25rem] text-[1.2rem]"
                style={{color: p.color}}
            >
                {'>'}
            </div>
            <div>
                {noteMappings[node.aminoacid]}
            </div>
          </div>
        );
      })}
    </div>
  );
};
