import React, { useState, useEffect, useRef } from "react";

import { aminoAcidColors } from "../mappings";

export const VisualizerPlayheads = ({
  playing,
  counter, // renderframes
  playheads, // main playheads
  counters, // separate counts from each playhead
  activeSequence,
  sequence,
  nodes,
  zoom,
  width,
  height,
  bounds,
  showOnlyActive,
  playheadCount,
}) => {


  const showDetails = true;
  const currentSequence = showOnlyActive ? activeSequence : sequence;

  const lastCounter = useRef(counter);
  const spacingX = width / 8;
  const boxSide = 30 * zoom;
  const colSpace = 0 * boxSide / 5;
  const rowSpace = boxSide / 10;
  const boxAspect = 1.2;
  const detailSpace = showDetails ? boxSide * boxAspect * 1.1 : 0

  const cols =
    Math.floor(
      Math.floor((width - spacingX * 2) / (boxSide + colSpace / 3)) / 3
    ) * 3;
  const rows = Math.ceil(currentSequence.length / cols);
  const spacingY = height - (height / 8) - rows * (boxSide * boxAspect + rowSpace * 1.5 + detailSpace) + detailSpace;

  const letterScale = 0.8;

  const [showLettersColors, setShowLettersColors] = useState(false);
  const [showAminoAcids, setShowAminoAcids] = useState(false);

  useEffect(() => {
    lastCounter.current = playing ? counter : lastCounter.current;
  }, [counter]);

  const getCoord = (i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const offsetX = Math.floor(col / 3);
    const x = col * boxSide + offsetX * colSpace;
    const y = row * (boxSide + rowSpace + detailSpace);
    const unit = boxSide + colSpace / 3
    const xRemainder = rows === 1 ? (width - unit * currentSequence.length) / 2 : (width - unit * cols) / 2
    return {
      //   y: x%2 === 1 ? y : ((cols - 1) * boxSide) - y ,
      y: spacingY + y * boxAspect,
      x: spacingX + x + xRemainder - spacingX,
    };
  };
  const getAcidSprite = (letter) => {
    const spritePath = `/assets/acids/amino_${letter.toLowerCase()}.png`;
    return spritePath;
  };

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
    <div className="pointer-events-none">
      {sequence.length ? (
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
              if (index >= playheadCount) return;
              const count = showOnlyActive ? counters[index] * 3 : Math.ceil((bounds[0] + counters[index] * 3) / 3) * 3;
              const { x, y } = getCoord(count);
              const currentNode = nodes[count / 3]
              if (currentNode === undefined) return;
              const currentAcid = currentNode.aminoacid;
              const letter = currentNode.nucleotide[0]
              const spritePathAcid = getAcidSprite(currentAcid);
              return (
                <div key={index + x}>
                  <div
                    className="absolute box-border text-center"
                    style={{
                      left: x,
                      top: playhead.playing ? y : y + boxSide * boxAspect,
                      // transition: "top 100ms linear",
                    }}
                  >
                    <div
                      style={{
                        width: boxSide * 2.95,
                        height: playhead.playing ? boxSide * boxAspect : "3px",
                        borderRadius: playhead.playing ? "0.25rem" : 0,
                        backgroundColor: playhead.playing
                          ? playhead.color
                          : "rgba(0,0,0,0)",
                        // backgroundColor: playhead.color,
                        opacity: playhead.playing ? 1 : 0.5,
                        borderBottom: `2px solid ${playhead.color}`,
                        lineHeight: `${boxSide * boxAspect}px`,
                        // transition: playhead.playing
                        //   ? "height 100ms linear, color 200ms linear"
                        //   : "height 100ms linear",
                        fontSize: `${20 * zoom}px`,
                        color: playhead.playing ? "#fff" : "rgba(0,0,0,0)",
                      }}
                    >
                      <div>{playhead.playing ? parseInt(currentAcid) === -1 ? letter : currentAcid : ""}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
