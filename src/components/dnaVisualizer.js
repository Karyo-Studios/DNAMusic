import React, { useCallback, useMemo } from "react";

import { TextStyle, AlphaFilter } from "pixi.js";
import { Stage, Container, Sprite, Graphics, render } from "@pixi/react";

const Tile = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(props.color);
      g.drawRect(0, 0, props.boxSide, props.boxSide);
      g.endFill();
    },
    [props]
  );
  return <Graphics draw={draw} />;
};

export const DnaVisualizer = ({ playheads, counters, sequence, zoom }) => {
  const width = 800;
  const height = 400;
  const boxSide = 30 * zoom;
  const perRow = Math.floor(height / boxSide);
  const alphaFilter = useMemo(() => new AlphaFilter(0.5), []);

  const getCoord = (i) => {
    return {
      y: (i % perRow) * boxSide,
      x: Math.floor(i / perRow) * boxSide,
    };
  };

  const getSprite = (letter) => {
    if (letter.toUpperCase() === "A") {
      return "/assets/a_sequel.png";
    } else if (letter.toUpperCase() === "C") {
      return "/assets/c_sequel.png";
    } else if (letter.toUpperCase() === "T") {
      return "/assets/t_sequel.png";
    } else if (letter.toUpperCase() === "G") {
      return "/assets/g_sequel.png";
    }
  };

  return (
    <Stage
      width={width}
      height={height}
      options={{ backgroundColor: 0x444444 }}
    >
      {sequence.map((letter, index) => {
        const { x, y } = getCoord(index);
        const scale = 0.8;
        return (
          <Container x={x} y={y} key={index}>
            <Tile boxSide={boxSide} color={0xffffff} />
            <Sprite
              image={getSprite(letter)}
              x={boxSide * ((1 - scale) / 2)}
              y={boxSide * ((1 - scale) / 2)}
              width={boxSide * scale}
              height={boxSide * scale}
              anchor={{ x: 0, y: 0 }}
            />
            {/* <Text
              text={letter}
              style={
                new TextStyle({
                  align: "center",
                  fontFamily: '"ui-monospace", monospace',
                  fontSize: 25,
                  fontWeight: "400",
                  fill: ["#000"], // gradient
                })
              }
            /> */}
          </Container>
        );
      })}
      {playheads.map((playhead, index) => {
        const count = counters[index] * 3;
        const n1 = getCoord(count);
        const n2 = getCoord(count + 1);
        const n3 = getCoord(count + 2);
        if (playhead.playing) {
          return (
            <Container key={index + n1.x} filters={[alphaFilter]}>
              <Container x={n1.x} y={n1.y}>
                <Tile boxSide={boxSide} color={playhead.color} />
              </Container>
              <Container x={n2.x} y={n2.y}>
                <Tile boxSide={boxSide} color={playhead.color} />
              </Container>
              <Container x={n3.x} y={n3.y}>
                <Tile boxSide={boxSide} color={playhead.color} />
              </Container>
            </Container>
          );
        }
      })}
    </Stage>
  );
  //   const loop = (t) => {
  //     // rotation += (Math.cos(t / 1000) || 0) * 0.1;
  //     requestAnimationFrame(loop);

  //     // custom render components into PIXI Container
  //     render(<Stage />, app.stage);
  //   };

  //   loop();
};
