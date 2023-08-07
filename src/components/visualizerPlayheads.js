import React, { useState, useEffect, useMemo, useRef } from "react";

import { mapN } from "../utils";

import { toMidi } from "sfumato";

import { aminoAcidColors, noteMappings } from "../mappings";

import { useAnimationFrame } from "../graphics";

export const VisualizerPlayheads = ({
  playing,
  counter, // renderframes
  playheads, // main playheads
  activeNotes, // active note refs, for actual gate
  counters, // separate counts from each playhead
  countRefs, // count references
  sequence,
  nodes,
  zoom,
  param1,
  param2,
}) => {
  // boxSide x amount =

  const lastCounter = useRef(counter);
  const width = 1200;
  const height = 700;
  const spacingX = 16;
  const boxSide = 30 * zoom;
  const colSpace = boxSide / 5;
  const rowSpace = boxSide / 3;
  const boxAspect = 1.2; // w x h 1 : 1.4
  const perRow =
    Math.floor(
      Math.floor((width - spacingX * 2) / (boxSide + colSpace / 3)) / 3
    ) * 3;
  const rows = Math.ceil(sequence.length / perRow);
  const spacingY = height - rows * (boxSide * boxAspect + rowSpace * 1.5);

  const letterScale = 0.8;

  const [showLettersColors, setShowLettersColors] = useState(false);
  const [showAminoAcids, setShowAminoAcids] = useState(false);

  const [blobs, setBlobs] = useState([]);

  const blobsRef = useRef([]);

  useEffect(() => {
    blobsRef.current = blobs;
  }, [blobs]);

  useEffect(() => {
    lastCounter.current = playing ? counter : lastCounter.current;
  }, [counter]);

  const getCoord = (i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const offsetX = Math.floor(col / 3);
    const x = col * boxSide + offsetX * colSpace;
    const y = row * (boxSide + rowSpace);
    return {
      //   y: x%2 === 1 ? y : ((perRow - 1) * boxSide) - y ,
      y: spacingY + y * boxAspect,
      x: spacingX + x,
    };
  };
  const getAcidSprite = (letter) => {
    const spritePath = `/assets/acids/amino_${letter.toLowerCase()}.png`;
    return spritePath;
  };

  const [count, setCount] = React.useState(0);

  const dnaColors = {
    A: "#FADADD",
    C: "#E9F7EF",
    T: "#F0E68C",
    G: "#FFFFFF",
  };

  const getDnaColor = (letter) => {
    if (!showLettersColors) return 0xffffff;
    if (showAminoAcids) {
      return aminoAcidColors[letter];
    } else {
      return dnaColors[letter.toUpperCase()];
    }
  };

  return (
    <div
      className="absolute"
      style={{
        top: 0,
        left: 0,
        width: width,
        height: height,
      }}
    >
      <div
      className="relative"
        style={{
          width: width,
          height: height,
        }}
      >
        {playheads.map((playhead, index) => {
          const count = counters[index] * 3;
          const { x, y } = getCoord(count);
          const currentAcid = nodes[count / 3].aminoacid;
          const spritePathAcid = getAcidSprite(currentAcid);
          if (playhead.playing) {
            return (
              <div key={index + x}>
                <div
                  className="absolute box-border text-center"
                  style={{
                    left: x,
                    top: y,
                  }}
                >
                  <div
                    style={{
                        width:boxSide * 3,
                        height:boxSide * boxAspect,
                        borderRadius: '0.25rem',
                        backgroundColor: playhead.color,
                        lineHeight: `${boxSide * boxAspect}px`,
                        fontSize: `${20 * zoom}px`
                    }}
                  >
                    <div>{currentAcid}</div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
