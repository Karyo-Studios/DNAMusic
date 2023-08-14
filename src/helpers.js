import { codonMappings, aminoAcidToCodons } from "./mappings";

import { randRange } from "./utils";

import { updateEuclid } from "./playhead";

export const interpretSequence = (seq) => {
  if (!seq) {
    return
  }
  const splitUp = seq.toUpperCase().split("");
  let combined = ""
  for (let i = 0; i < splitUp.length; i++) {
    const codons = aminoAcidToCodons[splitUp[i]]
    if (codons === undefined) {
      combined += splitUp[i] + splitUp[i] + splitUp[i]
    } else {
      combined += codons[Math.floor(Math.random() * codons.length)]
    }
  }
  return combined
}

export const parseAllSequence = (seq) => {
  if (!seq) {
    return {
      nodes: [],
      sequence: [],
    }
  }
  const filtered = seq.split("")
  let amount = 0;
  let tempNodes = [];
  let triNucleotide = "";
  if (filtered) {
    for (let i = 0; i < filtered.length; i++) {
      const l = filtered[i].toLowerCase();
      triNucleotide += filtered[i];
      amount = amount + 1;
      if (amount === 3) {
        if ((l === "c" || l === "a" || l === "t" || l === "g")) {
          tempNodes.push({
            nucleotide: triNucleotide.toUpperCase(),
            aminoacid: codonMappings[triNucleotide.toUpperCase()],
            index: i,
          });
        } else {
          tempNodes.push({
            nucleotide: triNucleotide,
            aminoacid: '-1',
            index: i,
          });
        }
        triNucleotide = "";
        amount = 0;
      }
    }
  }
  console.log(tempNodes, filtered)
  return {
    nodes: tempNodes,
    sequence: filtered,
  };
};

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
          index: i,
        });
        triNucleotide = "";
        amount = 0;
      }
    }
  }
  return {
    nodes: tempNodes,
    sequence: filtered,
  };
};

export const generatePattern = ({
  playheads,
  updateTempo,
  setNoteOffset,
  setMasterSteps,
  setPlayheads,
}) => {
  // resetCounters();
  setNoteOffset(randRange(-5, 5));
  const tempo = randRange(100, 200);
  const special = [5, 7, 15, 10, 7, 7, 13];
  const steps =
    Math.random() > 0.3
      ? randRange(3, 5) * randRange(2, 5)
      : special[Math.floor(Math.random() * special.length)];
  const normalRotation = randRange(0, steps);
  let updated = [];
  for (let i = 0; i < playheads.length; i++) {
    const events = tempo > 140 ? randRange(1, 5) : randRange(2, steps);
    let playing = i === 0 ? true : Math.random() > 0.3;
    const p = {
      ...playheads[i],
      steps,
      interval: 4,
      events: i === 3 ? randRange(1, 2) : events,
      rotation: Math.random() > 0.5 ? normalRotation : randRange(0, steps),
      playing: playing,
    };
    updated.push(updateEuclid(p));
  }
  updateTempo(tempo);
  setMasterSteps(steps);
  setPlayheads(updated);
};
