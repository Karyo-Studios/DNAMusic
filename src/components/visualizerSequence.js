import React, { useState, useEffect, useMemo, useRef } from "react";

import { mapN } from "../utils";

import { toMidi } from "sfumato";

import { aminoAcidColors, noteMappings } from "../mappings";

export const SequenceVisualizer = ({
  playing,
  sequence,
  nodes,
  zoom,
  width,
  height,
  param1,
  param2,
}) => {
  // boxSide x amount =

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

  const boxScale = 0.92;

  const [showLettersColors, setShowLettersColors] = useState(false);
  const [showAminoAcids, setShowAminoAcids] = useState(false);

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

  return (
    <div
      className="relative"
      style={{
        width: width,
        height: height,
      }}
    >
      <div>
        <div
          className="relative"
          style={{
            width: width,
            height: height,
          }}
        >
          {sequence.map((letter, index) => {
            const { x, y } = getCoord(index);
            if (nodes[Math.floor(index / 3)] === undefined) {
              return;
            }

            const currentAcid = nodes[Math.floor(index / 3)].aminoacid;
            const note = toMidi(
              noteMappings[nodes[Math.floor(index / 3)].aminoacid]
            );
            const noteColor = mapN(note, 50, 90, 20, 90);
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                }}
              >
                {showAminoAcids ? (
                  index % 3 === 0 && (
                    <div>
                    </div>
                  )
                ) : (
                  <div className="relative">
                    <div
                      className="absolute box-border text-center"
                      style={{
                        left: boxScale * ((1 - boxScale)/2),
                        width: boxSide * boxScale,
                        height: boxSide * boxAspect,
                        // border: "1px solid white",
                        borderRadius: "0.25rem",
                        lineHeight: `${boxSide * boxAspect}px`,
                        backgroundColor: 'rgba(255,255,255,0.5)'
                      }}
                    ></div>
                    <div
                      className="absolute box-border text-center"
                      style={{
                        left: boxScale * ((1 - boxScale)/2),
                        width: boxSide * boxScale,
                        height: boxSide * boxAspect,
                        lineHeight: `${boxSide * boxAspect}px`,
                        fontSize: `${20 * zoom}px`,
                        color: '#000'
                      }}
                    >
                      <div>{letter}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
