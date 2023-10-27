import React, {useState} from "react";

import { mapN, toMidi } from "../utils";

import { noteMappings } from "../mappings";

import { helpMessages } from "../information";

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
  setShowHelp,
  setHelpMessage,
  playheads,
  getNote,
  noteOffsetRef,
  playSoundFont,
  setMenu,
  showSequenceAbove,
  showControlsTransition,
}) => {
  // boxSide x amount =

  const currentSequence = showOnlyActive ? activeSequence : sequence;

  const showDetails = showSequenceAbove;

  const spacingX = width / 10;
  const boxSide = 30 * zoom;
  const colSpace = (0 * boxSide) / 5;
  const rowSpace = boxSide / 2.5;
  const boxAspect = 1;
  const detailSpace = showDetails ? boxSide * boxAspect * 1.1 : 0;

  const [noteActive, setNoteActive] = useState(false)

  const cols =
    Math.floor(
      Math.floor((width - spacingX * 2) / (boxSide + colSpace / 3)) / 3
    ) * 3;
  const rows = Math.ceil(currentSequence.length / cols);
  const spacingY =
    height -
    height / 8 -
    rows * (boxSide * boxAspect + rowSpace * 1.5 + detailSpace) +
    detailSpace;

  const boxScale = 0.92;

  const getCoord = (i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const offsetX = Math.floor(col / 3);
    const x = col * boxSide + offsetX * colSpace;
    const y = row * (boxSide + rowSpace + detailSpace);
    const unit = boxSide + colSpace / 3;
    const xRemainder =
      rows === 1
        ? (width - unit * currentSequence.length) / 2
        : (width - unit * cols) / 2;
    return {
      //   y: x%2 === 1 ? y : ((cols - 1) * boxSide) - y ,
      y: spacingY + y * boxAspect,
      x: spacingX + x + xRemainder - spacingX,
    };
  };

  return (
    <div
      className="relative transition-translate"
      style={{
        width: width,
        height: height,
        // transitionDuration: showControlsTransition ? '200ms' : 0,
        transitionDuration: 0
      }}
    >
      <div>
        <div
          className="relative transition-translate"
          style={{
            width: width,
            height: height,
            // transitionDuration: showControlsTransition ? '200ms' : 0,
            transitionDuration: 0
          }}
        >
          {currentSequence.map((letter, index) => {
            const { x, y } = getCoord(index);
            if (nodes[Math.floor(index / 3)] === undefined) {
              return;
            }

            const currentAcid = nodes[Math.floor(index / 3)].aminoacid;
            const note =
              currentAcid !== "-1" ? toMidi(noteMappings[currentAcid]) : -1;
            // const noteColor = parseInt(currentAcid) !== -1 ? mapN(note, 55, 90, 80, 150) : 20
            const noteColor =
              parseInt(currentAcid) !== -1 ? mapN(note, 55, 90, 120, 120) : 20;

            const isActive = showOnlyActive
              ? true
              : index >= bounds[0] && index <= bounds[1];
            return (
              <div
                key={index}
                className="absolute transition-translate"
                style={{
                  left: x,
                  top: y,
                  // transitionDuration: showControlsTransition ? '200ms' : 0,
                  transitionDuration: 0
                }}
              >
                <span className="relative select-text">
                  <span
                    className="absolute box-border text-center"
                    style={{
                      top: detailSpace,
                      left: boxScale * ((1 - boxScale) / 2),
                      width: boxSide * boxScale,
                      height: boxSide * boxAspect,
                      // border: "1px solid #888",
                      borderRadius: zoom * 5,
                      lineHeight: `${boxSide * boxAspect}px`,
                      // backgroundColor: 'rgba(255,255,255,0.4)'
                      // backgroundColor: `hsla(192,0%,${noteColor}%, 0.5)`
                      backgroundColor: isActive
                        ? `hsla(192,0%,${noteColor}%, 0.6)`
                        : `hsla(192,0%,${noteColor}%, 0.2)`,
                    }}
                  ></span>
                  <span
                    className="absolute box-border text-center uppercase"
                    style={{
                      top: detailSpace,
                      left: boxScale * ((1 - boxScale) / 2),
                      width: boxSide * boxScale,
                      height: boxSide * boxAspect,
                      lineHeight: `${boxSide * boxAspect}px`,
                      fontSize: `${20 * zoom}px`,
                      // color: '#ddd'
                      // color: isActive ? '#fff' : '#000'
                      color: "#000",
                    }}
                  >
                    <span>{parseInt(currentAcid) === -1 ? "-" : letter}</span>
                  </span>
                  {(index - 1) % 3 === 0 && showDetails && (
                    <div className="relative">
                      <div
                        className={`absolute opacity-[0] hover:opacity-[0.3] z-[999] cursor-pointer`}
                        style={{
                          left: boxScale * ((1 - boxScale) / 2) - boxSide,
                          width: boxSide * 2.95,
                          height: boxSide*1.05 * boxAspect * 2,
                          borderRadius: zoom * 5,
                          backgroundColor: noteActive ? '#fff' : '#888',
                          lineHeight: `${boxSide * boxAspect}px`,
                        }}
                        onClick={() => {
                          const note = getNote(Math.floor(index/3))
                          playSoundFont(
                            0,
                            playheads[0].preset,
                            note + noteOffsetRef.current,
                            0,
                            playheads[0].legato * 300,
                            playheads[0].velocity
                          );
                          setNoteActive(true)
                          setTimeout(()=> {
                            setNoteActive(false)
                          }, 100)
                          let helpMessage = {}
                          if (helpMessages.acids[currentAcid] !== undefined) {
                            helpMessage = {
                              name: helpMessages.acids[currentAcid].name,
                              description: helpMessages.acids[currentAcid].description,
                              img: helpMessages.acids[currentAcid].img,
                              source: helpMessages.acids[currentAcid].source,
                            }
                          } else {
                            helpMessage = {
                              name: helpMessages.acids.other.name,
                              description: helpMessages.acids.other.description,
                              img: helpMessages.acids.other.img,
                              source: helpMessages.acids.other.source,
                            }
                          }
                          setMenu(0)
                          setShowHelp(true)
                          setHelpMessage(
                            helpMessage
                          )
                          console.log(currentAcid, currentSequence[index-1], letter, currentSequence[index+1])
                        }}
                      ></div>
                      <span
                        className="absolute box-border text-center uppercase"
                        style={{
                          left: boxScale * ((1 - boxScale) / 2),
                          width: boxSide * boxScale,
                          height: boxSide * boxAspect,
                          lineHeight: `${boxSide * boxAspect}px`,
                          fontSize: `${20 * zoom}px`,
                          // color: '#ddd'
                          color: isActive ? "#fff" : "#888",
                        }}
                      >
                        <span>
                          {parseInt(currentAcid) === -1 ? letter : currentAcid}
                        </span>
                      </span>
                    </div>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
