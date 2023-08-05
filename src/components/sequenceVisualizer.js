import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { Stage, Container, Sprite, Graphics, withPixiApp } from "@pixi/react";

import { aminoAcidColors } from "../mappings";

// import { Blob } from "../blobs";

const Blob = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(props.color);
      g.drawCircle(props.x, props.y, props.radius);
      g.endFill();
    },
    [props]
  );
  return <Graphics draw={draw} />;
};

const Tile = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(props.height / 15, props.color, 1);
      g.drawRoundedRect(2, 0, props.width, props.height, 3);
    },
    [props]
  );
  return <Graphics draw={draw} />;
};

const PlayheadTile = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(props.color);
      g.lineStyle(props.height / 15, 0xffffff, 1);
      g.drawRoundedRect(2, 0, props.width, props.height, 3);
      g.endFill();
    },
    [props]
  );
  return <Graphics draw={draw} />;
};

const useAnimationFrame = (callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = (time) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
};
export const SequenceVisualizer = ({
  playing,
  counter,
  playheads,
  activeNotes,
  counters,
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

  useAnimationFrame((deltaTime) => {
    // Pass on a function to the setter of the state
    // to make sure we always have the latest state
    let updated = [];
    blobsRef.current.forEach((blob) => {
      updated.push({ ...blob, y: blob.y - 1 });
    });
    setBlobs(updated);
    setCount((prevCount) => (prevCount + deltaTime * 0.01) % 100);
  });

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

  const VerticalDisplay = () => {
    return <Container></Container>;
  };

  return (
    <div>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x444444, antialias: true }}
      >
        {sequence.map((letter, index) => {
          const { x, y } = getCoord(index);
          if (nodes[Math.floor(index / 3)] === undefined) {
            return;
          }

          const currentAcid = nodes[Math.floor(index / 3)].aminoacid;
          const spritePathAcid = getAcidSprite(currentAcid);
          const spritePath = getSprite(letter);
          return (
            <Container x={x} y={y} key={index}>
              {showAminoAcids ? (
                index % 3 === 0 && (
                  <Container>
                    <Tile
                      width={boxSide * 3}
                      height={boxSide * boxAspect}
                      color={getDnaColor(showAminoAcids ? currentAcid : letter)}
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
        {blobs.map((blob, index) => {
          return <Blob
            key={index}
            x={blob.x}
            y={blob.y}
            radius={blob.radius}
            color={blob.color}
          />;
        })}
      </Stage>
      <div className="absolute top-0 right-0 flex gap-x-[0.5rem] z-[99999]">
        <div>
          <p className="mb-4">{Math.round(count)}</p>
          {activeNotes.map((active, index) => {
            return <p key={index}>{active.current ? "XXX" : "---"}</p>;
          })}
        </div>
      </div>
      <div>
        <div className="flex">
          <input
            value={showLettersColors}
            onClick={() => {
              setShowLettersColors(!showLettersColors);
            }}
            type="checkbox"
            className="checked:bg-blue-500 ml-2"
          />
          <p>Colors</p>
          <input
            value={showAminoAcids}
            onClick={() => {
              setShowAminoAcids(!showAminoAcids);
            }}
            type="checkbox"
            className="checked:bg-blue-500 ml-2"
          />
          <p>ACTG / Amino Acids</p>
          <button
            className="mx-[1rem]"
            onClick={() => {
              setBlobs([
                ...blobs,
                {
                  x: 500,
                  y: 500,
                  color: 0xff0000,
                  radius: 40,
                },
              ]);
            }}
          >
            Spawn Blob
          </button>
          {blobs.length}
        </div>
      </div>
    </div>
  );
};
