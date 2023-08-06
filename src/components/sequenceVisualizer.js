import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { mapN } from "../utils";
import { Stage, Container, Sprite } from "@pixi/react";

import { toMidi } from "sfumato";

import { aminoAcidColors, noteMappings } from "../mappings";

import { Blob, Tile, PlayheadTile, useAnimationFrame } from "../graphics";

// import { Blob } from "../blobs";

export const SequenceVisualizer = ({
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
  const colSpace = boxSide / 3;
  const rowSpace = boxSide / 2;
  const boxAspect = 1.4; // w x h 1 : 1.4
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

  const addBlob = (opts) =>
    setBlobs([
      ...blobs,
      {
        x: opts.x || width / 2,
        y: opts.y || height,
        color: opts.color || 0xff0000,
        radius: opts.radius || 40,
      },
    ]);

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

  const getSprite = (letter) => {
    if (letter.toUpperCase() === "A") {
      return "/assets/a_sequel_white.png";
      //   return "/assets/a_sequel.png";
    } else if (letter.toUpperCase() === "C") {
      return "/assets/c_sequel_white.png";
      //   return "/assets/c_sequel.png";
    } else if (letter.toUpperCase() === "T") {
      return "/assets/t_sequel_white.png";
      //   return "/assets/t_sequel.png";
    } else if (letter.toUpperCase() === "G") {
      return "/assets/g_sequel_white.png";
      //   return "/assets/g_sequel.png";
    }
  };

  const getAcidSprite = (letter) => {
    const spritePath = `/assets/acids/amino_${letter.toLowerCase()}.png`;
    return spritePath;
  };

  const [count, setCount] = React.useState(0);

  const lastNote1 = useRef(-1);
  const lastNote2 = useRef(-1);
  const lastNote3 = useRef(-1);
  const lastNote4 = useRef(-1);
  const lastNote5 = useRef(-1);

  const lastSpawned1 = useRef(false);
  const lastSpawned2 = useRef(false);
  const lastSpawned3 = useRef(false);
  const lastSpawned4 = useRef(false);
  const lastSpawned5 = useRef(false);

  //   const lastNotes = [lastNote1,lastNote2,lastNote3,lastNote4,lastNote5]
  //   const lastSpawned = [lastSpawned1,lastSpawned2,lastSpawned3,lastSpawned4,lastSpawned5]

  let lastNotes = [-1, -1, -1, -1, -1];
  let lastSpawned = [false, false, false, false, false];

  const animationCallback = (deltaTime) => {
    let updated = [];
    // blobs update loop
    blobsRef.current.forEach((blob) => {
      if (blob.y > 0) {
        updated.push({ ...blob, y: blob.y - 6 });
      }
    });

    // check to add new blobs
    for (let i = 0; i < playheads.length; i++) {
      if (activeNotes[i].current) {
        const index = countRefs[i].current;
        const currentNode = nodes[Math.floor(index / 3)];
        const note = noteMappings[currentNode.aminoacid];
        // if (!lastSpawned[i]) {
        const { x, y } = getCoord(index * 3);
        const radius = 60*zoom;
        updated.push({
          x: x + boxSide*3/2,
          y: y,
          color: playheads[i].color,
          radius: radius / 2,
        });
        // }
        lastSpawned[i] = true;
      } else {
        lastSpawned[i] = false;
      }
    }

    setBlobs(updated);
    setCount((prevCount) => (prevCount + deltaTime * 0.01) % 100);
  };

  const animationCallbackRef = useRef(animationCallback);

  useEffect(() => {
    animationCallbackRef.current = animationCallback;
  }, [zoom, sequence]);

  // main animation loop
  useAnimationFrame(animationCallbackRef);

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
    <div>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x444444, antialias: true }}
        onClick={() => {
          setShowAminoAcids(!showAminoAcids);
        }}
      >
        {blobs.map((blob, index) => {
          return (
            <Blob
              key={index}
              x={blob.x}
              y={blob.y}
              radius={blob.radius}
              color={blob.color}
            />
          );
        })}
        {sequence.map((letter, index) => {
          const { x, y } = getCoord(index);
          if (nodes[Math.floor(index / 3)] === undefined) {
            return;
          }

          const currentAcid = nodes[Math.floor(index / 3)].aminoacid;
          const spritePathAcid = getAcidSprite(currentAcid);
          const spritePath = getSprite(letter);

          const note = toMidi(
            noteMappings[nodes[Math.floor(index / 3)].aminoacid]
          );
          const noteColor = mapN(note, 50, 90, 20, 90);
          return (
            <Container x={x} y={y} key={index}>
              {showAminoAcids ? (
                index % 3 === 0 && (
                  <Container>
                    <Tile
                      width={boxSide * 3}
                      height={boxSide * boxAspect}
                      color={getDnaColor(showAminoAcids ? currentAcid : letter)}
                      noteColor={noteColor ? noteColor : "100"}
                    />
                    <Sprite
                      image={spritePathAcid}
                      x={(boxSide * 3 * letterScale) / 2}
                      y={3 + boxSide * ((1 - letterScale) / 2)}
                      width={boxSide * letterScale}
                      height={boxSide * letterScale}
                      anchor={{ x: 0, y: 0 }}
                    />
                  </Container>
                )
              ) : (
                <Container>
                  <Tile
                    width={boxSide}
                    height={boxSide * boxAspect}
                    color={getDnaColor(showAminoAcids ? currentAcid : letter)}
                    noteColor={noteColor ? noteColor : "100"}
                  />
                  <Sprite
                    image={spritePath}
                    x={2 + boxSide * ((1 - letterScale) / 2)}
                    y={4 + boxSide * ((1 - letterScale) / 2)}
                    width={boxSide * letterScale}
                    height={boxSide * letterScale}
                    anchor={{ x: 0, y: 0 }}
                  />
                </Container>
              )}
            </Container>
          );
        })}
        {playheads.map((playhead, index) => {
          const count = counters[index] * 3;
          const { x, y } = getCoord(count);
          const currentAcid = nodes[count / 3].aminoacid;
          const spritePathAcid = getAcidSprite(currentAcid);
          if (playhead.playing) {
            return (
              <Container key={index + x}>
                <Container x={x} y={y}>
                  <PlayheadTile
                    width={boxSide * 3}
                    height={boxSide * boxAspect}
                    color={playhead.color}
                  />
                  <Sprite
                    image={spritePathAcid}
                    x={2 + (boxSide * 3) / 2}
                    y={3 + boxSide / 2}
                    width={boxSide * letterScale}
                    height={boxSide * letterScale}
                    anchor={{ x: 0.5, y: 0.5 }}
                  />
                </Container>
              </Container>
            );
          }
        })}
      </Stage>
      <div className="hidden absolute top-0 right-0 flex gap-x-[0.5rem] z-[99999]">
        <div>
          <p className="mb-4">{Math.round(count)}</p>
          {activeNotes.map((active, index) => {
            return <p key={index}>{active.current ? "XXX" : "---"}</p>;
          })}
        </div>
      </div>
      <div>
        <div className="select-none flex px-[1rem]">
          <p>Click = ACTG / Amino Acids</p>
        </div>
      </div>
    </div>
  );
};
