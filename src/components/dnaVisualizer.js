import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { TextStyle, AlphaFilter, Point } from "pixi.js";
import {
  Stage,
  Container,
  Sprite,
  Graphics,
  SimpleRope,
  Text,
} from "@pixi/react";

import { aminoAcidColors } from "../mappings";

const Tile = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      // g.beginFill(props.color);
        // g.drawRect(0, 0, props.boxSide, props.boxSide);
      g.drawCircle(props.boxSide / 2, props.boxSide / 2, props.boxSide / 2);
      g.endFill();
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
        g.drawRect(0, 0, props.boxSide, props.boxSide);
      g.drawCircle(props.boxSide / 2, props.boxSide / 2, props.boxSide / 2);
      g.endFill();
    },
    [props]
  );
  return <Graphics draw={draw} />;
};

export const DnaVisualizer = ({
  playing,
  counter,
  playheads,
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
  const spacingY = 200;
  const spacingX = 30;
  const boxSide = 30 * zoom;
  const perRow = Math.floor(Math.floor((height - spacingY) / boxSide) / 3) * 3;
  const alphaFilterPlayhead = useMemo(() => new AlphaFilter(0.7), []);
  const alphaFilter = useMemo(() => new AlphaFilter(0.3), []);

  const [showLettersColors, setShowLettersColors] = useState(true);
  const [showAminoAcids, setShowAminoAcids] = useState(false);

  useEffect(() => {
    lastCounter.current = playing ? counter : lastCounter.current;
  }, [counter]);

  const getCoord = (i) => {
    const x = Math.floor(i / perRow) * boxSide;
    const y = (i % perRow) * boxSide;
    const offset =
      Math.sin((i + lastCounter.current / (param2 * 20)) / (param1 * 6)) * 10;
    return {
      //   y: x%2 === 1 ? y : ((perRow - 1) * boxSide) - y ,
      y: spacingY + y,
      x: spacingX + x * 2.5 + (playing ? offset : 0),
    };
  };

  const getSprite = (letter) => {
    if (letter.toUpperCase() === "A") {
      return "/assets/a_sequel_white.png";
      // return "/assets/a_sequel.png";
    } else if (letter.toUpperCase() === "C") {
      return "/assets/c_sequel_white.png";
      // return "/assets/c_sequel.png";
    } else if (letter.toUpperCase() === "T") {
      return "/assets/t_sequel_white.png";
      // return "/assets/t_sequel.png";
    } else if (letter.toUpperCase() === "G") {
      return "/assets/g_sequel_white.png";
      // return "/assets/g_sequel.png";
    }
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

  const VerticalDisplay = () => {
    return (
      <Container>
      </Container>
    );
  };

  return (
    <div>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x444444 }}
      >
          {sequence.map((letter, index) => {
          const { x, y } = getCoord(index);
          const scale = 0.8;
          if (nodes[Math.floor(index / 3)] === undefined) {
            return;
          }

          const currentAcid = nodes[Math.floor(index / 3)].aminoacid
          const spritePathAcid = getAcidSprite(currentAcid)
          const spritePath = getSprite(letter);
          return (
            <Container x={x} y={y} key={index}>
              <Tile
                boxSide={boxSide}
                color={getDnaColor(showAminoAcids ? currentAcid : letter)}
                filters={[alphaFilter]}
              />
              {showAminoAcids ? (
                (index - 1) % 3 === 0 && (
                  <Sprite
                    image={spritePathAcid}
                    x={boxSide * ((1 - scale) / 2)}
                    y={boxSide * ((1 - scale) / 2)}
                    width={boxSide * scale}
                    height={boxSide * scale}
                    anchor={{ x: 0, y: 0 }}
                  />
                )
              ) : (
                <Sprite
                  image={spritePath}
                  x={boxSide * ((1 - scale) / 2)}
                  y={boxSide * ((1 - scale) / 2)}
                  width={boxSide * scale}
                  height={boxSide * scale}
                  anchor={{ x: 0, y: 0 }}
                />
              )}
            </Container>
          );
        })}
        {playheads.map((playhead, index) => {
          const count = counters[index] * 3;
          const n1 = getCoord(count);
          const n2 = getCoord(count + 1);
          const n3 = getCoord(count + 2);
          const factor = 1.5;
          const currentAcid = nodes[count/3].aminoacid
          const spritePathAcid = getAcidSprite(currentAcid)
          const scale = 0.8;
          if (playhead.playing) {
            return (
              <Container key={index + n1.x} 
              filters={[alphaFilterPlayhead]}
              >
                <Container
                  x={n1.x - boxSide / (factor * 2)}
                  y={n1.y - boxSide / (factor * 2)}
                >
                  <PlayheadTile boxSide={boxSide * factor} color={playhead.color} />
                </Container>
                <Container
                  x={n3.x - boxSide / (factor * 2)}
                  y={n3.y - boxSide / (factor * 2)}
                >
                  <PlayheadTile boxSide={boxSide * factor} color={playhead.color} />
                </Container>
                <Container
                  x={n2.x - boxSide / (factor * 2)}
                  y={n2.y - boxSide / (factor * 2)}
                >
                  <PlayheadTile boxSide={boxSide * factor} color={playhead.color} />
                  <Sprite
                    image={spritePathAcid}
                    x={boxSide * ((1) / 2)}
                    y={boxSide * ((1) / 2)}
                    width={boxSide}
                    height={boxSide}
                    anchor={{ x: 0, y: 0 }}
                  />
                </Container>
              </Container>
            );
          }
        })}

      </Stage>
      <div className="flex gap-x-[0.5rem]">
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
      </div>
    </div>
  );
};
