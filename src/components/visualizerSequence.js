import React, { useState, useEffect, useMemo, useRef } from "react";

import { mapN } from "../utils";

import { toMidi } from "sfumato";

import { aminoAcidColors, noteMappings } from "../mappings";

export const VisualizerSequence = ({
  sequence,
  nodes,
  activeNodes,
  activeSequence,
  showOnlyActive,
  bounds,
  zoom,
  width,
  height,
}) => {
  // boxSide x amount =

  const currentSequence = showOnlyActive ? activeSequence : sequence

  const spacingX = 16;
  const boxSide = 30 * zoom;
  const colSpace = boxSide / 5;
  const rowSpace = boxSide / 3;
  const boxAspect = 1.2; // w x h 1 : 1.4
  const perRow =
    Math.floor(
      Math.floor((width - spacingX * 2) / (boxSide + colSpace / 3)) / 3
    ) * 3;
  const rows = Math.ceil(currentSequence.length / perRow);
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
          {currentSequence.map((letter, index) => {
            const { x, y } = getCoord(index);
            if (nodes[Math.floor(index / 3)] === undefined) {
              return;
            }

            const currentAcid = nodes[Math.floor(index / 3)].aminoacid;
            const note = toMidi(
              noteMappings[nodes[Math.floor(index / 3)].aminoacid]
            );
            const noteColor = mapN(note, 50, 90, 30, 90);
            const isActive = showOnlyActive ? true : index >= bounds[0] && index <= bounds[1]
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
                  <span className="relative select-text">
                    <span
                      className="absolute box-border text-center"
                      style={{
                        left: boxScale * ((1 - boxScale) / 2),
                        width: boxSide * boxScale,
                        height: boxSide * boxAspect,
                        // border: "1px solid #888",
                        borderRadius: "0.25rem",
                        lineHeight: `${boxSide * boxAspect}px`,
                        // backgroundColor: 'rgba(255,255,255,0.4)'
                        // backgroundColor: `hsla(192,0%,${noteColor}%, 0.5)`
                        backgroundColor: isActive ? `hsla(192,0%,${noteColor}%, 0.5)` : `hsla(192,0%,${noteColor}%, 0.2)`
                      }}
                    ></span>
                    <span
                      className="absolute box-border text-center uppercase"
                      style={{
                        left: boxScale * ((1 - boxScale) / 2),
                        width: boxSide * boxScale,
                        height: boxSide * boxAspect,
                        lineHeight: `${boxSide * boxAspect}px`,
                        fontSize: `${20 * zoom}px`,
                        // color: '#ddd'
                        color: isActive ? '#fff' : '#000'
                      }}
                    >
                      <span>{letter}</span>
                    </span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
