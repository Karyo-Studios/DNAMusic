import { codonMappings } from "./mappings";

export const parseSequence = (seq) => {
    const splitUp = seq.split("");
    const filtered = splitUp.filter((el) => {
      const l = el.toString().toLowerCase();
      if (l === "c" || l === "a" || l === "t" || l === "g") {
        return l;
      }
    });

    let amount = 0;
    let tempNodes = [];
    let triNucleotide = "";
    if (filtered) {
      for (let i = 0; i < filtered.length; i++) {
        triNucleotide += filtered[i];
        amount = amount + 1;
        if (amount === 3) {
          tempNodes.push({
            nucleotide: triNucleotide.toUpperCase(),
            aminoacid: codonMappings[triNucleotide.toUpperCase()],
            index: i
          });
          triNucleotide = "";
          amount = 0;
        }
      }
    }
    return tempNodes
  };

  // from https://github.com/felixroos/sfumato/blob/0f5f7aa00567de9064d2b2778418e0e4c3e93429/src/util.ts#L13
  export const tokenizeNote = (note) => {
    if (typeof note !== 'string') {
      return [];
    }
    const [pc, acc = '', oct] = note.match(/^([a-gA-G])([#bs]*)([0-9])?$/)?.slice(1) || [];
    if (!pc) {
      return [];
    }
    return [pc, acc, oct ? Number(oct) : undefined];
  };

  const accs = { '#': 1, b: -1, s: 1 };
  
  export const toMidi = (note) => {
    if (typeof note === 'number') {
      return note;
    }
    const [pc, acc, oct] = tokenizeNote(note);
    if (!pc) {
      throw new Error('not a note: "' + note + '"');
    }
    const chroma = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[(pc).toLowerCase()];
    const offset = (acc)?.split('').reduce((o, char) => o + accs[char], 0) || 0;
    return (Number(oct) + 1) * 12 + (chroma) + offset;
  };
  