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
      <div className="flex pt-[0.5rem] pb-[0.25rem] text-[#888] text-[0.8rem] select-none">
        <p className="text-center w-[5rem]">CODON</p>
        <div className="w-[2rem]"></div>
        <p className="text-center w-[10rem]">AMINO ACID</p>
        <p className="text-center w-[7rem]">NOTE</p>
      </div>
      {playheads.map((p, index) => {
        const note = countRefs[index].current;
        const node = activeNodes[note];
        if (node === undefined) return
        if (index >= playheadCount) return;
        return (
          <div key={index} className="flex items-center mb-1 h-[1.85rem]"
            style={{
              opacity: p.playing ? 1 : 0.3
            }}
          >
            <div className="flex">
              {node.nucleotide.split("").map((letter, index) => {
                return <div
                  key={index}
                  className="box-border text-center uppercase text-[0.8rem]"
                  style={{
                    width: '0.8rem',
                    borderRadius: "0.25rem",
                    height: '1.8rem',
                    lineHeight: '1.8rem',
                  }}
                >

                  {parseInt(node.aminoacid) === -1 ? '-' : letter}
                </div>
              })}
            </div>
            <div
              className="px-[0.25rem] text-[1rem]"
              style={{ color: p.color }}
            >
              {'>'}
            </div>
            {
              parseInt(node.aminoacid) === -1 ?
                <div className="p-[0.25rem] rounded-[0.25rem] text-[0.8rem] w-[7rem] text-center box-border"
                >
                  n/a
                </div>
                :
                <div className="p-[0.25rem] rounded-[0.25rem] text-[0.8rem] w-[7rem] text-center box-border"
                >
                  {node.aminoacid} = {codonNames[node.aminoacid]}
                </div>
            }
            <div
              className="px-[0.25rem] text-[1rem]"
              style={{ color: p.color }}
            >
              {'>'}
            </div>
            <div className="px-[0.5rem] text-[0.8rem]">
              {noteMappings[node.aminoacid]}
            </div>
          </div>
        );
      })}
    </div>
  );
};
